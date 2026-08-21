package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.domain.Pessoa;
import com.limiteMEI.limiteMEI.dto.documentofiscal.DocumentoFiscalXmlPreviewDTO;
import com.limiteMEI.limiteMEI.enums.TipoDocumentoFiscalEnum;
import com.limiteMEI.limiteMEI.repository.DocumentoFiscalRepository;
import com.limiteMEI.limiteMEI.repository.PessoaRepository;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class DocumentoFiscalXmlService {

    private static final long TAMANHO_MAXIMO = 2 * 1024 * 1024;

    private final EmpresaAtualService empresaAtual;
    private final DocumentoFiscalRepository documentos;
    private final PessoaRepository pessoas;

    public DocumentoFiscalXmlService(EmpresaAtualService empresaAtual,
                                     DocumentoFiscalRepository documentos,
                                     PessoaRepository pessoas) {
        this.empresaAtual = empresaAtual;
        this.documentos = documentos;
        this.pessoas = pessoas;
    }

    public DocumentoFiscalXmlPreviewDTO importar(MultipartFile arquivo) {
        validarArquivo(arquivo);
        Document xml = lerXml(arquivo);
        Element infNFe = primeiro(xml.getDocumentElement(), "infNFe").orElse(null);
        DadosXml dados = infNFe == null ? lerNfse(xml) : lerNfe(infNFe);
        validarDados(dados);

        Empresa empresa = empresaAtual.get();
        if (!normalizarDocumento(empresa.getCnpj()).equals(normalizarDocumento(dados.emitenteDocumento))) {
//            throw new ApplicationException("O CNPJ do emitente do XML não pertence à empresa ativa");
        }
        if (dados.chaveAcesso != null && documentos.existsByEmpresaIdAndChaveAcessoIgnoreCaseAndExcluidoFalse(
                empresa.getId(), dados.chaveAcesso)) {
            throw new ApplicationException("Já existe um documento fiscal cadastrado com esta chave de acesso");
        }

        Optional<Pessoa> cliente = localizarPessoa(empresa.getId(), dados.clienteDocumento);
        return DocumentoFiscalXmlPreviewDTO.builder()
                .tipo(dados.tipo)
                .numero(dados.numero)
                .serie(dados.serie)
                .chaveAcesso(dados.chaveAcesso)
                .dataEmissao(dados.dataEmissao)
                .valorTotal(dados.valorTotal)
                .clienteId(cliente.map(Pessoa::getId).orElse(null))
                .clienteNome(cliente.map(Pessoa::getNomeRazaoSocial).orElse(dados.clienteNome))
                .clienteDocumento(dados.clienteDocumento)
                .clienteEncontrado(cliente.isPresent())
                .build();
    }

    private DadosXml lerNfe(Element infNFe) {
        Element ide = primeiro(infNFe, "ide").orElseThrow(() -> xmlInvalido("identificação da NF-e"));
        String modelo = texto(ide, "mod");
        TipoDocumentoFiscalEnum tipo = "65".equals(modelo)
                ? TipoDocumentoFiscalEnum.NFCE : TipoDocumentoFiscalEnum.NFE;
        Element emitente = primeiro(infNFe, "emit").orElseThrow(() -> xmlInvalido("emitente"));
        Element destinatario = primeiro(infNFe, "dest").orElse(null);
        Element total = primeiro(infNFe, "ICMSTot").orElseThrow(() -> xmlInvalido("total da nota"));
        return new DadosXml(tipo, texto(ide, "nNF"), textoOpcional(ide, "serie"),
                chavePeloId(infNFe, "NFe"), data(textoPrimeiro(ide, "dhEmi", "dEmi")),
                decimal(texto(total, "vNF")), documento(emitente),
                destinatario == null ? null : documento(destinatario),
                destinatario == null ? null : textoOpcional(destinatario, "xNome"));
    }

    private DadosXml lerNfse(Document xml) {
        Element inf = primeiro(xml.getDocumentElement(), "infNFSe")
                .orElseGet(() -> primeiro(xml.getDocumentElement(), "infNfse").orElse(null));
        if (inf == null) throw new ApplicationException("XML não reconhecido. Envie uma NF-e, NFC-e ou NFS-e válida");
        Element prestador = primeiro(inf, "prest").orElseGet(() -> primeiro(inf, "prestador").orElse(null));
        Element tomador = primeiro(inf, "toma").orElseGet(() -> primeiro(inf, "tomador").orElse(null));
        String numero = textoPrimeiro(inf, "nNFSe", "numero", "nNFS-e");
        String valor = textoPrimeiro(inf, "vLiq", "vServ", "vNFSe", "valorServicos");
        return new DadosXml(TipoDocumentoFiscalEnum.NFSE, numero, textoPrimeiroOpcional(inf, "serie"),
                chavePeloId(inf, "NFS"), data(textoPrimeiro(inf, "dhEmi", "dhProc", "dEmi")),
                decimal(valor), prestador == null ? null : documento(prestador),
                tomador == null ? null : documento(tomador),
                tomador == null ? null : textoPrimeiroOpcional(tomador, "xNome", "razaoSocial"));
    }

    private void validarArquivo(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) throw new ApplicationException("Selecione um arquivo XML");
        if (arquivo.getSize() > TAMANHO_MAXIMO) throw new ApplicationException("O XML deve ter no máximo 2 MB");
        String nome = arquivo.getOriginalFilename();
        if (nome != null && !nome.toLowerCase(Locale.ROOT).endsWith(".xml")) {
            throw new ApplicationException("Selecione um arquivo com extensão .xml");
        }
    }

    private Document lerXml(MultipartFile arquivo) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);
            factory.setXIncludeAware(false);
            factory.setExpandEntityReferences(false);
            factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
            factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
            factory.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
            factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
            factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
            return factory.newDocumentBuilder().parse(arquivo.getInputStream());
        } catch (ParserConfigurationException | SAXException | IOException exception) {
            throw new ApplicationException("Não foi possível ler o XML. Verifique se o arquivo é válido");
        }
    }

    private void validarDados(DadosXml dados) {
        if (vazio(dados.emitenteDocumento) || vazio(dados.numero) || dados.dataEmissao == null
                || dados.valorTotal == null) {
            throw new ApplicationException("O XML não contém todos os dados obrigatórios: emitente, número, emissão e valor");
        }
    }

    private Optional<Pessoa> localizarPessoa(Long empresaId, String documento) {
        String normalizado = normalizarDocumento(documento);
        if (normalizado.isEmpty()) return Optional.empty();
        return pessoas.findByEmpresaIdOrderByNomeRazaoSocial(empresaId).stream()
                .filter(pessoa -> normalizado.equals(normalizarDocumento(pessoa.getCpfCnpj())))
                .findFirst();
    }

    private Optional<Element> primeiro(Element raiz, String nome) {
        if (nome.equalsIgnoreCase(nome(raiz))) return Optional.of(raiz);
        NodeList filhos = raiz.getElementsByTagNameNS("*", nome);
        if (filhos.getLength() > 0) return Optional.of((Element) filhos.item(0));
        NodeList todos = raiz.getElementsByTagName("*");
        for (int i = 0; i < todos.getLength(); i++) {
            if (nome.equalsIgnoreCase(nome(todos.item(i)))) return Optional.of((Element) todos.item(i));
        }
        return Optional.empty();
    }

    private String texto(Element raiz, String nome) {
        return primeiro(raiz, nome).map(Element::getTextContent).map(String::trim)
                .filter(valor -> !valor.isEmpty()).orElseThrow(() -> xmlInvalido(nome));
    }

    private String textoOpcional(Element raiz, String nome) {
        return primeiro(raiz, nome).map(Element::getTextContent).map(String::trim).filter(v -> !v.isEmpty()).orElse(null);
    }

    private String textoPrimeiro(Element raiz, String... nomes) {
        return Optional.ofNullable(textoPrimeiroOpcional(raiz, nomes))
                .orElseThrow(() -> xmlInvalido(String.join("/", nomes)));
    }

    private String textoPrimeiroOpcional(Element raiz, String... nomes) {
        for (String nome : nomes) {
            String valor = textoOpcional(raiz, nome);
            if (valor != null) return valor;
        }
        return null;
    }

    private String documento(Element raiz) {
        return textoPrimeiroOpcional(raiz, "CNPJ", "CPF", "CNPJCPF", "documento");
    }

    private String chavePeloId(Element inf, String prefixo) {
        String id = inf.getAttribute("Id");
        if (vazio(id)) id = inf.getAttribute("id");
        if (vazio(id)) return null;
        return id.startsWith(prefixo) ? id.substring(prefixo.length()) : id;
    }

    private LocalDate data(String valor) {
        try {
            return valor.length() == 10 ? LocalDate.parse(valor) : OffsetDateTime.parse(valor).toLocalDate();
        } catch (RuntimeException exception) {
            throw xmlInvalido("data de emissão");
        }
    }

    private BigDecimal decimal(String valor) {
        try {
            return new BigDecimal(valor.replace(',', '.'));
        } catch (RuntimeException exception) {
            throw xmlInvalido("valor total");
        }
    }

    private String nome(Node node) {
        return node.getLocalName() == null ? node.getNodeName().replaceFirst("^.*:", "") : node.getLocalName();
    }

    private String normalizarDocumento(String valor) {
        return valor == null ? "" : valor.replaceAll("[^A-Za-z0-9]", "").toUpperCase(Locale.ROOT);
    }

    private boolean vazio(String valor) {
        return valor == null || valor.isBlank();
    }

    private ApplicationException xmlInvalido(String campo) {
        return new ApplicationException("O XML não contém " + campo);
    }

    private record DadosXml(TipoDocumentoFiscalEnum tipo, String numero, String serie, String chaveAcesso,
                            LocalDate dataEmissao, BigDecimal valorTotal, String emitenteDocumento,
                            String clienteDocumento, String clienteNome) {
    }
}

package com.limiteMEI.limiteMEI.mapper;
import com.limiteMEI.limiteMEI.domain.*; import com.limiteMEI.limiteMEI.dto.pessoa.*; import com.limiteMEI.limiteMEI.repository.PessoaPapelRepository; import com.limiteMEI.limiteMEI.utils.BaseMapper; import org.springframework.stereotype.Component; import java.util.stream.Collectors;
@Component
public class PessoaMapper implements BaseMapper<Pessoa,PessoaDTO,PessoaCreateDTO> {
 private final PessoaPapelRepository papelRepository;
 public PessoaMapper(PessoaPapelRepository papelRepository){this.papelRepository=papelRepository;}
 public PessoaDTO toDTO(Pessoa p){ if(p==null)return null; return PessoaDTO.builder().id(p.getId()).tipoPessoa(p.getTipoPessoa()).nomeRazaoSocial(p.getNomeRazaoSocial()).nomeFantasia(p.getNomeFantasia()).cpfCnpj(p.getCpfCnpj()).email(p.getEmail()).telefone(p.getTelefone()).ativo(p.getAtivo()).papeis(papelRepository.findByPessoaId(p.getId()).stream().filter(x->Boolean.TRUE.equals(x.getAtivo())).map(PessoaPapel::getPapel).collect(Collectors.toSet())).build(); }
 public Pessoa toEntity(PessoaCreateDTO d){ Pessoa p=new Pessoa(); updateEntity(p,d); return p; }
 public void updateEntity(Pessoa p,PessoaCreateDTO d){p.setTipoPessoa(d.getTipoPessoa());p.setNomeRazaoSocial(d.getNomeRazaoSocial().trim());p.setNomeFantasia(d.getNomeFantasia());p.setCpfCnpj(normalize(d.getCpfCnpj()));p.setEmail(d.getEmail());p.setTelefone(d.getTelefone());p.setAtivo(d.getAtivo()==null?p.getAtivo()==null?true:p.getAtivo():d.getAtivo());}
 private String normalize(String v){if(v==null||v.isBlank())return null;return v.replaceAll("[^A-Za-z0-9]","").toUpperCase();}
}

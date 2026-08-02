package com.limiteMEI.limiteMEI.service;
import com.limiteMEI.limiteMEI.domain.*; import com.limiteMEI.limiteMEI.dto.pessoa.PessoaDTO; import com.limiteMEI.limiteMEI.enums.PapelPessoaEnum; import com.limiteMEI.limiteMEI.mapper.PessoaMapper; import com.limiteMEI.limiteMEI.repository.PessoaPapelRepository; import org.springframework.stereotype.Service; import java.util.*;
@Service
public class PessoaPapelService{
 private final PessoaPapelRepository repository; private final PessoaService pessoas; private final PessoaMapper mapper; private final EmpresaAtualService empresaAtual;
 public PessoaPapelService(PessoaPapelRepository r,PessoaService p,PessoaMapper m,EmpresaAtualService e){repository=r;pessoas=p;mapper=m;empresaAtual=e;}
 public PessoaDTO adicionar(Long pessoaId,PapelPessoaEnum papel){Pessoa p=pessoas.findOwnedEntity(pessoaId);if(!repository.existsByPessoaIdAndPapel(pessoaId,papel))repository.save(PessoaPapel.builder().pessoa(p).papel(papel).ativo(true).build());return mapper.toDTO(p);}
 public List<PessoaDTO> listar(PapelPessoaEnum papel){return repository.findByPessoaEmpresaIdAndPapelAndAtivoTrue(empresaAtual.get().getId(),papel).stream().map(PessoaPapel::getPessoa).map(mapper::toDTO).toList();}
}

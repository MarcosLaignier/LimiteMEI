package com.limiteMEI.limiteMEI.service;
import com.limiteMEI.limiteMEI.domain.*; import com.limiteMEI.limiteMEI.dto.funcionario.*; import com.limiteMEI.limiteMEI.enums.PapelPessoaEnum; import com.limiteMEI.limiteMEI.mapper.FuncionarioMapper; import com.limiteMEI.limiteMEI.repository.FuncionarioRepository; import com.limiteMEI.limiteMEI.utils.BaseService; import com.limiteMEI.limiteMEI.utils.validate.*; import org.springframework.stereotype.Service; import java.util.*;
import org.springframework.transaction.annotation.Transactional;
@Service
@Transactional
public class FuncionarioService extends BaseService<Funcionario,Long,FuncionarioCreateDTO,FuncionarioDTO>{
 private final FuncionarioRepository repository;private final FuncionarioMapper mapper;private final PessoaService pessoas;private final PessoaPapelService papeis;private final EmpresaAtualService empresaAtual;
 public FuncionarioService(FuncionarioRepository r,FuncionarioMapper m,PessoaService p,PessoaPapelService pp,EmpresaAtualService e,GenericUniqueValidator v){super(v);repository=r;mapper=m;pessoas=p;papeis=pp;empresaAtual=e;}
 protected FuncionarioRepository getRepository(){return repository;}protected FuncionarioMapper getMapper(){return mapper;}
 public FuncionarioDTO save(FuncionarioCreateDTO d){Pessoa p=pessoas.findOwnedEntity(d.getPessoaId());if(repository.existsByPessoaId(p.getId()))throw new ApplicationException("Esta pessoa já é funcionária");Funcionario f=mapper.toEntity(d);f.setPessoa(p);validateDates(f);f=repository.save(f);papeis.adicionar(p.getId(),PapelPessoaEnum.FUNCIONARIO);return mapper.toDTO(f);}
 public List<FuncionarioDTO> findAll(){return repository.findByPessoaEmpresaId(empresaAtual.get().getId()).stream().map(mapper::toDTO).toList();}
 public FuncionarioDTO getById(Long id){return mapper.toDTO(findOwned(id));}
 public FuncionarioDTO update(Long id,FuncionarioCreateDTO d){Funcionario f=findOwned(id);Pessoa p=pessoas.findOwnedEntity(d.getPessoaId());if(!f.getPessoa().getId().equals(p.getId())&&repository.existsByPessoaId(p.getId()))throw new ApplicationException("Esta pessoa já é funcionária");mapper.updateEntity(f,d);f.setPessoa(p);validateDates(f);papeis.adicionar(p.getId(),PapelPessoaEnum.FUNCIONARIO);return mapper.toDTO(repository.save(f));}
 public void delete(Long id){repository.delete(findOwned(id));}
 private Funcionario findOwned(Long id){return repository.findByIdAndPessoaEmpresaId(id,empresaAtual.get().getId()).orElseThrow(()->new ApplicationException("Funcionário não encontrado"));}
 private void validateDates(Funcionario f){if(f.getDataDemissao()!=null&&f.getDataDemissao().isBefore(f.getDataAdmissao()))throw new ApplicationException("A demissão não pode ser anterior à admissão");}
}

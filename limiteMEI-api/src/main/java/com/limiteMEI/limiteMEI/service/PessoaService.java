package com.limiteMEI.limiteMEI.service;
import com.limiteMEI.limiteMEI.domain.Pessoa; import com.limiteMEI.limiteMEI.dto.pessoa.*; import com.limiteMEI.limiteMEI.mapper.PessoaMapper; import com.limiteMEI.limiteMEI.repository.PessoaRepository; import com.limiteMEI.limiteMEI.utils.BaseService; import com.limiteMEI.limiteMEI.utils.validate.*; import org.springframework.stereotype.Service; import java.util.*;
@Service
public class PessoaService extends BaseService<Pessoa,Long,PessoaCreateDTO,PessoaDTO>{
 private final PessoaRepository repository; private final PessoaMapper mapper; private final EmpresaAtualService empresaAtual;
 public PessoaService(PessoaRepository r,PessoaMapper m,EmpresaAtualService e,GenericUniqueValidator v){super(v);repository=r;mapper=m;empresaAtual=e;}
 protected PessoaRepository getRepository(){return repository;} protected PessoaMapper getMapper(){return mapper;}
 protected void beforeSave(Pessoa p){p.setEmpresa(empresaAtual.get());validateDocumento(p);}
 protected void beforeUpdate(Pessoa p){validateDocumento(p);}
 public List<PessoaDTO> findAll(){return repository.findByEmpresaIdOrderByNomeRazaoSocial(empresaAtual.get().getId()).stream().map(mapper::toDTO).toList();}
 public PessoaDTO getById(Long id){return mapper.toDTO(findOwnedEntity(id));}
 public PessoaDTO update(Long id,PessoaCreateDTO d){Pessoa p=findOwnedEntity(id);mapper.updateEntity(p,d);validate(p);beforeUpdate(p);return mapper.toDTO(repository.save(p));}
 public void delete(Long id){repository.delete(findOwnedEntity(id));}
 public List<PessoaDTO> pesquisar(String termo){if(termo==null||termo.trim().length()<2)return List.of();return repository.pesquisar(empresaAtual.get().getId(),termo.trim()).stream().limit(15).map(mapper::toDTO).toList();}
 public Pessoa findOwnedEntity(Long id){return repository.findByIdAndEmpresaId(id,empresaAtual.get().getId()).orElseThrow(()->new ApplicationException("Pessoa não encontrada"));}
 private void validateDocumento(Pessoa p){if(p.getCpfCnpj()!=null&&repository.existsByEmpresaIdAndCpfCnpjIgnoreCaseAndIdNot(p.getEmpresa().getId(),p.getCpfCnpj(),p.getId()==null?0L:p.getId()))throw new ApplicationException("Já existe uma pessoa com este CPF/CNPJ");}
}

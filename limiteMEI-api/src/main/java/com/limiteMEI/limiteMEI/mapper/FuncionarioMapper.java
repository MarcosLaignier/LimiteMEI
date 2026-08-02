package com.limiteMEI.limiteMEI.mapper;
import com.limiteMEI.limiteMEI.domain.Funcionario; import com.limiteMEI.limiteMEI.dto.funcionario.*; import com.limiteMEI.limiteMEI.utils.BaseMapper; import org.springframework.stereotype.Component;
@Component
public class FuncionarioMapper implements BaseMapper<Funcionario,FuncionarioDTO,FuncionarioCreateDTO>{
 private final PessoaMapper pessoaMapper; public FuncionarioMapper(PessoaMapper p){pessoaMapper=p;}
 public FuncionarioDTO toDTO(Funcionario f){return f==null?null:FuncionarioDTO.builder().id(f.getId()).pessoa(pessoaMapper.toDTO(f.getPessoa())).cargo(f.getCargo()).dataAdmissao(f.getDataAdmissao()).dataDemissao(f.getDataDemissao()).salario(f.getSalario()).ativo(f.getAtivo()).build();}
 public Funcionario toEntity(FuncionarioCreateDTO d){Funcionario f=new Funcionario();updateEntity(f,d);return f;}
 public void updateEntity(Funcionario f,FuncionarioCreateDTO d){f.setCargo(d.getCargo());f.setDataAdmissao(d.getDataAdmissao());f.setDataDemissao(d.getDataDemissao());f.setSalario(d.getSalario());f.setAtivo(d.getAtivo()==null?f.getAtivo()==null?true:f.getAtivo():d.getAtivo());}
}

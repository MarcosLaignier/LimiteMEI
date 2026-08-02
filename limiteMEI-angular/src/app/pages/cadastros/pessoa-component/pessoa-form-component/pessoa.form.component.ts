import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseFormCrud} from '../../../../shared/components-commons/core/base.form.crud';
import {PessoaDTO} from '../../../../dtos/pessoa/pessoa.dto';
import {PessoaCreateDTO} from '../../../../dtos/pessoa/pessoa.create.dto';
import {PessoaService} from '../../../../services/pessoa.service';
import {ToolbarComponent} from '../../../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import {TextBoxComponent} from '../../../../shared/components-commons/infra/text-box-component/text.box.component';
import {SelectEnumComponent} from '../../../../shared/components-commons/infra/select-enum-component/select.enum.component';
import {SwitchComponent} from '../../../../shared/components-commons/infra/switch-component/switch.component';
import {TipoPessoaEnum, TIPO_PESSOA_LABELS} from '../../../../enums/tipo.pessoa.enum';
import {ValidationUtils} from '../../../../shared/utils/validation.utils';

@Component({standalone:true,imports:[ToolbarComponent,TextBoxComponent,SelectEnumComponent,SwitchComponent],templateUrl:'./pessoa.form.component.html',styleUrl:'./pessoa.form.component.scss'})
export class PessoaFormComponent extends BaseFormCrud<PessoaDTO,PessoaCreateDTO>{
  protected service:PessoaService; protected routeBase='/app/cadastros/pessoa';
  tipoPessoaEnum=TipoPessoaEnum; tipoPessoaLabels=TIPO_PESSOA_LABELS;
  constructor(s:PessoaService,r:Router,a:ActivatedRoute){super(r,a);this.service=s;this.reset();}
  ngOnInit(){this.initForm();}
  override clear(){this.reset();}
  override validateSave(){if(!ValidationUtils.requiredFields(this.model,['tipoPessoa','nomeRazaoSocial'])){this.alertService.warning('Informe o tipo e o nome da pessoa.');return false;}return true;}
  override afterSave(saved?:PessoaDTO){const returnUrl=this.route.snapshot.queryParamMap.get('returnUrl');if(returnUrl&&saved){this.router.navigate([returnUrl],{queryParams:{pessoaId:saved.id}});return;}super.afterSave(saved);}
  private reset(){this.model={tipoPessoa:TipoPessoaEnum.FISICA,nomeRazaoSocial:'',nomeFantasia:'',cpfCnpj:'',email:'',telefone:'',ativo:true};}
}

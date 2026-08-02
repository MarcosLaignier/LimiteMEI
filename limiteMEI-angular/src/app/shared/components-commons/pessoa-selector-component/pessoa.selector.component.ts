import {Component,EventEmitter,Input,OnDestroy,Output} from '@angular/core';import {FormsModule} from '@angular/forms';import {Subject,debounceTime,distinctUntilChanged,switchMap,takeUntil} from 'rxjs';import {PessoaDTO} from '../../../dtos/pessoa/pessoa.dto';import {PessoaService} from '../../../services/pessoa.service';
@Component({selector:'pessoa-selector-component',standalone:true,imports:[FormsModule],templateUrl:'./pessoa.selector.component.html',styleUrl:'./pessoa.selector.component.scss'})
export class PessoaSelectorComponent implements OnDestroy{
 @Input() label='Pessoa';@Input() disabled=false;@Input() pessoa?:PessoaDTO;@Output() pessoaChange=new EventEmitter<PessoaDTO|undefined>();@Output() novaPessoa=new EventEmitter<void>();
 termo='';resultados:PessoaDTO[]=[];loading=false;private busca=new Subject<string>();private destroy$=new Subject<void>();
 constructor(service:PessoaService){this.busca.pipe(debounceTime(300),distinctUntilChanged(),switchMap(t=>{this.loading=true;return service.pesquisar(t)}),takeUntil(this.destroy$)).subscribe({next:r=>{this.resultados=r.body??[];this.loading=false;},error:()=>{this.resultados=[];this.loading=false;}});}
 pesquisar(valor:string){this.termo=valor;if(valor.trim().length>=2)this.busca.next(valor.trim());else this.resultados=[];}
 selecionar(p:PessoaDTO){this.pessoa=p;this.termo='';this.resultados=[];this.pessoaChange.emit(p);}
 limpar(){this.pessoa=undefined;this.pessoaChange.emit(undefined);}
 ngOnDestroy(){this.destroy$.next();this.destroy$.complete();}
}

import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {CategoriaDTO} from '../../../dtos/categoria/categoria.dto';
import {CategoriaCreateDTO} from '../../../dtos/categoria/categoria.create.dto';
import {TipoMovimentoEnum} from '../../../enums/tipo.movimento.enum';
import {CategoriaService} from '../../../services/categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  imports: [FormsModule, NgForOf]
})
export class CategoriaComponent implements OnInit {

  categorias: CategoriaDTO[] = [];

  novaCategoria: CategoriaCreateDTO = {
    nome: '',
    tipo: TipoMovimentoEnum.DESPESA
  };

  tipos = Object.values(TipoMovimentoEnum);

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias() {
    this.categoriaService.getAll().subscribe(res => {
      this.categorias = res.body ?? [];
    });
  }

  salvar() {
    this.categoriaService.create(this.novaCategoria).subscribe(() => {

      this.novaCategoria = {
        nome: '',
        tipo: TipoMovimentoEnum.DESPESA
      };

      this.carregarCategorias();
    });
  }

  deletar(id: number) {
    this.categoriaService.delete(id).subscribe(() => {
      this.carregarCategorias();
    });
  }

}

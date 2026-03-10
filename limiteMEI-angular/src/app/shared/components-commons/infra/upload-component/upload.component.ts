// import { Component, Output, EventEmitter } from '@angular/core';
// import {ArquivoDigitalService} from "../../../service/arquivo.digital.service";
// import {ArquivoDigital} from "../../../model/arquivo.digital.model";
// import {NgClass} from "@angular/common";
// import {environment} from "../../../../enviroment";
//
// @Component({
//   selector: 'upload-component',
//   imports: [
//     NgClass
//   ],
//   templateUrl: './upload.component.html',
//   styleUrl: './upload.component.scss',
// })
// export class UploadComponent {
//   selectedFile: File | null = null;
//   uploadStatus: string = '';
//   isUploading: boolean = false;
//   isDragging: boolean = false;
//
//   private readonly TIPOS_PERMITIDOS = [
//     'image/jpeg',
//     'image/png',
//     'application/pdf',
//     'video/mp4'
//   ];
//
//   @Output() uploadSuccess = new EventEmitter<ArquivoDigital>();
//   @Output() uploadError = new EventEmitter<string>();
//
//   constructor(private arquivoService: ArquivoDigitalService) {}
//
//   onFileSelected(event: any) {
//     const file = event.target.files[0];
//     if (file && this.arquivoValido(file)) {
//       this.selectedFile = file;
//       this.uploadStatus = '';
//     }
//   }
//
//   uploadArquivo() {
//     if (this.selectedFile) {
//       this.isUploading = true;
//       this.uploadStatus = 'Enviando arquivo...';
//
//       this.arquivoService.upload(this.selectedFile).subscribe({
//         next: (response) => {
//           this.isUploading = false;
//           this.uploadStatus = 'Arquivo enviado com sucesso!';
//
//           const arquivo: ArquivoDigital = {
//             id: response.id,
//             nomeDoArquivo: response.nomeDoArquivo,
//             tipo: response.tipo,
//             tamanho: response.tamanho,
//             url: null,
//             blob: null
//           };
//
//           this.uploadSuccess.emit(arquivo);
//           this.selectedFile = null;
//
//           setTimeout(() => {
//             this.uploadStatus = '';
//           }, 3000);
//         },
//         error: (error) => {
//           this.isUploading = false;
//           this.uploadStatus = 'Erro ao enviar arquivo';
//           this.uploadError.emit(error.message || 'Erro desconhecido');
//           console.error(error);
//         }
//       });
//     }
//   }
//
//   get statusClass() {
//     if (this.isUploading) return 'info';
//
//     if (this.uploadStatus && !this.selectedFile && !this.isUploading) return 'error';
//
//     if (this.uploadStatus.includes('sucesso')) return 'success';
//     if (this.uploadStatus.includes('Erro')) return 'error';
//     return '';
//   }
//
//   get statusIcon() {
//     if (this.isUploading) return 'bi bi-info-circle';
//     if (this.uploadStatus.includes('sucesso')) return 'bi bi-check-circle-fill';
//     if (this.uploadStatus.includes('Erro')) return 'bi bi-exclamation-triangle-fill';
//     return '';
//   }
//
//   removerArquivo(event: Event) {
//     event.stopPropagation(); // Não abrir o seletor de arquivo ao clicar em remover
//     this.selectedFile = null;
//     this.uploadStatus = '';
//   }
//
//   onDragOver(event: DragEvent) {
//     event.preventDefault();
//     event.stopPropagation();
//     this.isDragging = true;
//   }
//
//   onDragLeave(event: DragEvent) {
//     event.preventDefault();
//     event.stopPropagation();
//     this.isDragging = false;
//   }
//
//   onDrop(event: DragEvent) {
//     event.preventDefault();
//     event.stopPropagation();
//     this.isDragging = false;
//
//     const files = event.dataTransfer?.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       if (this.arquivoValido(file)) {
//         this.selectedFile = file;
//         this.uploadStatus = '';
//       }
//     }
//   }
//
//   private arquivoValido(file: File): boolean {
//     if (!this.TIPOS_PERMITIDOS.includes(file.type)) {
//       this.uploadStatus = 'Tipo de arquivo não suportado! Use JPG, PNG, PDF ou MP4.';
//       this.selectedFile = null;
//       return false;
//     }
//
//     const limiteTamanho = environment.MAX_FILE_SIZE;
//     if (file.size > limiteTamanho) {
//       this.uploadStatus = `Arquivo muito grande! O limite é ${this.formatarTamanho(limiteTamanho)}`;
//       this.selectedFile = null;
//       return false;
//     }
//     return true;
//   }
//
//   formatarTamanho(bytes: number): string {
//     if (!bytes) return '0 B';
//     if (bytes < 1024) return bytes + ' B';
//     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
//     if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
//     return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
//   }
// }

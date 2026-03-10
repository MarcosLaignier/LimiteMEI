// import {Component, Input, OnDestroy, OnInit} from '@angular/core';
// import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
// import {ArquivoDigitalService} from "../../../service/arquivo.digital.service";
// import {ArquivoDigital} from "../../../model/arquivo.digital.model";
// import {CommonModule} from '@angular/common';
//
// @Component({
//   selector: 'preview-files-component',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './preview.files.component.html',
//   styleUrl: './preview.files.component.scss',
// })
// export class PreviewFilesComponent implements OnInit, OnDestroy {
//   @Input() arquivoId!: number;
//   @Input() modal: boolean = false;
//
//   imagemUrl: SafeUrl | null = null;
//   pdfUrl: SafeUrl | null = null;
//   videoUrl: SafeUrl | null = null;
//
//   arquivoDigital: ArquivoDigital | null = null;
//   modalAberto: boolean = false;
//   isLoading: boolean = false;
//
//   private objectUrl: string | null = null;
//
//   constructor(
//     private arquivoService: ArquivoDigitalService,
//     private sanitizer: DomSanitizer
//   ) {
//   }
//
//   ngOnInit() {
//     // Se não for modo modal, carrega o arquivo imediatamente ao iniciar
//     if (!this.modal && this.arquivoId) {
//       this.carregarDadosArquivo(this.arquivoId);
//     }
//   }
//
//   ngOnDestroy() {
//     this.limparUrls();
//   }
//
//   abrirModal() {
//     this.modalAberto = true;
//     document.body.style.overflow = 'hidden'; // Bloqueia scroll do fundo
//
//     if (!this.arquivoDigital && this.arquivoId) {
//       this.carregarDadosArquivo(this.arquivoId);
//     }
//   }
//
//   fecharModal() {
//     this.modalAberto = false;
//     document.body.style.overflow = 'auto'; // Restaura scroll
//   }
//
//   downloadArquivo(id: number) {
//     this.arquivoService.download(id).subscribe({
//       next: (response) => {
//         const url = window.URL.createObjectURL(response.blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = response.nome || `arquivo_${id}`;
//         link.click();
//         window.URL.revokeObjectURL(url);
//       }
//     });
//   }
//
//   formatarTamanho(bytes: number): string {
//     if (!bytes || bytes === 0) return '0 B';
//     const k = 1024;
//     const sizes = ['B', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   }
//
//   private carregarDadosArquivo(id: number) {
//     this.isLoading = true;
//     this.limparUrls();
//
//     this.arquivoService.download(id).subscribe({
//       next: (response) => {
//         const blob = response.blob;
//         const tipo = response.tipo || blob.type;
//
//         this.objectUrl = window.URL.createObjectURL(blob);
//
//         this.arquivoDigital = {
//           id: id,
//           nomeDoArquivo: response.nome || 'Arquivo sem nome',
//           tipo: tipo,
//           tamanho: response.tamanho || blob.size,
//           blob: blob,
//           url: this.sanitizer.bypassSecurityTrustUrl(this.objectUrl)
//         };
//
//         this.distribuirUrlPorTipo(tipo, this.arquivoDigital.url!);
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Erro ao buscar arquivo:', err);
//         this.isLoading = false;
//       }
//     });
//   }
//
//   private distribuirUrlPorTipo(tipo: string, safeUrl: SafeUrl) {
//     if (tipo.startsWith('image/')) {
//       this.imagemUrl = safeUrl;
//     } else if (tipo === 'application/pdf') {
//       // Para PDFs, às vezes o bypassSecurityTrustResourceUrl é necessário dependendo do navegador
//       this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl!);
//     } else if (tipo.startsWith('video/')) {
//       this.videoUrl = safeUrl;
//     }
//   }
//
//   private limparUrls() {
//     if (this.objectUrl) {
//       window.URL.revokeObjectURL(this.objectUrl);
//       this.objectUrl = null;
//     }
//     this.imagemUrl = null;
//     this.pdfUrl = null;
//     this.videoUrl = null;
//     this.arquivoDigital = null;
//   }
// }

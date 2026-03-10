import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cadastros',
    loadChildren: () =>
      import('./pages/cadastros/cadastros.routes')
        .then(m => m.CADASTROS_ROUTES)
  },

];

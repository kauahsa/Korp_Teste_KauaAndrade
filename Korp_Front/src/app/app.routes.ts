import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductsComponent } from './pages/products/products.component';
import { InvoicesListComponent } from './pages/invoices/invoices-list.component';
import { InvoiceCreateComponent } from './pages/invoices/invoice-create.component';
import { TechDetailsComponent } from './pages/tech-details/tech-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard | Korp Fiscal',
  },
  {
    path: 'produtos',
    component: ProductsComponent,
    title: 'Cadastro de Produtos | Korp Fiscal',
  },
  {
    path: 'notas-fiscais',
    component: InvoicesListComponent,
    title: 'Notas Fiscais | Korp Fiscal',
  },
  {
    path: 'notas-fiscais/nova',
    component: InvoiceCreateComponent,
    title: 'Nova Nota Fiscal | Korp Fiscal',
  },
  {
    path: 'detalhamento-tecnico',
    component: TechDetailsComponent,
    title: 'Detalhamento Técnico | Korp Fiscal',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

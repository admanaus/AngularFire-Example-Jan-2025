import { Routes } from '@angular/router';
import { CompanyEdit } from './company/company-edit/company-edit';

export const routes: Routes = [
    { path: 'company/edit', component: CompanyEdit, title: 'Edit Company' },
    { path: '**', redirectTo: 'company/edit' }
];

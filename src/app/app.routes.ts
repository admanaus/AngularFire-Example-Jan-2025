import { Routes } from '@angular/router';
import { CompanyEdit } from './company/company-edit/company-edit';
import { CompanyList } from './company/company-list/company-list';

export const routes: Routes = [
    { path: 'company/all', component: CompanyList, title: 'Company List' },
    { path: 'company/:id', component: CompanyEdit, title: 'Edit Company' },
    { path: '**', redirectTo: 'company/edit' }
];

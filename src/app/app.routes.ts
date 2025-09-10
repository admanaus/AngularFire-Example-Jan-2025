import { Routes } from '@angular/router';
import { CompanyEdit } from './company/company-edit/company-edit';
import { CompanyList } from './company/company-list/company-list';
import { ContactList } from './contact/contact-list/contact-list';
import { ContactEdit } from './contact/contact-edit/contact-edit';


export const routes: Routes = [
    { path: 'company/all', component: CompanyList, title: 'Company List' },
    { path: 'company/:id', component: CompanyEdit, title: 'Edit Company' },
    { path: 'contact/all', component: ContactList },
    { path: 'contact/:id', component: ContactEdit },
    { path: '**', redirectTo: 'company/edit' }
];

import { Routes } from '@angular/router';
import { CompanyEdit } from './company/company-edit/company-edit';
import { CompanyList } from './company/company-list/company-list';
import { ContactList } from './contact/contact-list/contact-list';
import { ContactEdit } from './contact/contact-edit/contact-edit';
import { SignIn } from './auth/signin/signin';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: 'auth/signin', component: SignIn, title: 'Sign In' },
    { 
      path: 'company/all', 
      component: CompanyList, 
      title: 'Company List',
      canActivate: [authGuard]
    },
    { 
      path: 'company/:id', 
      component: CompanyEdit, 
      title: 'Edit Company',
      canActivate: [authGuard]
    },
    { 
      path: 'contact/all', 
      component: ContactList,
      canActivate: [authGuard]
    },
    { 
      path: 'contact/:id', 
      component: ContactEdit,
      canActivate: [authGuard]
    },
    { path: '', redirectTo: '/company/all', pathMatch: 'full' },
    { path: '**', redirectTo: '/company/all' }
];

// src/app/contact/contact-list/contact-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../../models/contact';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ContactService } from '../contact.service';
import { Company } from '../../models/company';
import { CompanyService } from '../../company/company.service';



@Component({
  selector: 'app-contact-list',
  imports: [
    CommonModule,
    MatCardModule,
    RouterLink,
    MatButtonModule,
    MatIcon,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css'
})
export class ContactList implements OnInit {
  public contacts$: Observable<Contact[]> | undefined;
  public companies$?: Observable<Company[] | undefined> | undefined;
  private contactService = inject(ContactService);
  private companyService = inject(CompanyService);

  ngOnInit() {
    this.getContacts();
    this.getCompanies();
  }

  getContacts(companyId?: string) {
    this.contacts$ = this.contactService.getContactsObservable(companyId || null);
  }

  getCompanies() {
    this.companies$ = this.companyService.getCompaniesObservable();
  }
}

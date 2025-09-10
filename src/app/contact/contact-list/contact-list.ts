// src/app/contact/contact-list/contact-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../../models/contact';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ContactService } from '../contact.service';


@Component({
  selector: 'app-contact-list',
  imports: [
    CommonModule,
    MatCardModule,
    RouterLink,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css'
})
export class ContactList implements OnInit {
  public contacts$: Observable<Contact[]> | undefined;

  constructor(private contactService: ContactService) {
  }

  ngOnInit() {
    this.getContacts();
  }

  getContacts() {
    this.contacts$ = this.contactService.getContactsObservable();
  }
}

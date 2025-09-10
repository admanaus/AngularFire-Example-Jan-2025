// src/app/contact/contact-edit/contact-edit.component.ts
import { Observable, of } from 'rxjs';
import { Contact } from '../../models/contact';
import { Component, inject, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contact-edit',
  imports: [
    CommonModule,
    AsyncPipe,
    JsonPipe,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  standalone: true,
  templateUrl: './contact-edit.html',
  styleUrl: './contact-edit.css'
})
export class ContactEdit implements OnInit {
  contact$: Observable<Contact | undefined> | undefined;
  editableContact: Contact | undefined;
  contactId: string | null = null;
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private contactService = inject(ContactService);

  ngOnInit() {
    // Get the ID from the route and fetch the corresponding contact as an Observable
    this.route.paramMap.subscribe(params => {
      this.contactId = params.get('id');
      if (!this.contactId || this.contactId === 'new') {
        // Creation flow: provide a default contact object (no id) so the form renders
        const defaultContact: Contact = { name: '' } as Contact;
        this.contact$ = of(defaultContact);
        this.editableContact = { ...defaultContact };
        return;
      }
      // Editing existing doc
      this.contact$ = this.contactService.getContactObservable(this.contactId);
      // Keep an editable copy for ngModel two-way binding
      this.contact$.subscribe((contact) => {
        // ensure id is preserved in the editable copy for saving
        console.log(contact);
        this.editableContact = contact ? { ...contact } : undefined;
      });
    });
  }

  async saveContact(contact: Contact) {
    if (!contact) { return; }
    try {
      await this.contactService.saveContact(contact);
      this._snackBar.open('Contact saved successfully', 'Close', { duration: 3000 });
      await this.router.navigate(['/contact/all']);
    } catch (e) {
      console.error('Save failed', e);
      this._snackBar.open('Failed to save contact', 'Close', { duration: 3000 });
    }
  }

    async deleteContact() {
    await this.contactService.deleteContact(this.contactId as string);
    await this.router.navigate(['/contact/all']);
  }

}
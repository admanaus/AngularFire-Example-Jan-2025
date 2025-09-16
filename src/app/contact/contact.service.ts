// src/app/contact/contact.service.ts
import { Injectable, inject } from '@angular/core';
import { Contact } from '../models/contact';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  query,
  updateDoc,
  where
} from '@angular/fire/firestore';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private authService = inject(AuthService);

  constructor(private db: Firestore) {
  }

  // A helper to get the document reference
  private getContactDocRef(id: string) {
    return doc(this.db, 'contacts/' + id);
  }

  // A helper to get the collection reference
  private getContactsColRef() {
    return collection(this.db, 'contacts');
  }

  getContactObservable(id: string): Observable<Contact | undefined> {
    // include the Firestore doc id as `id` so editors can save with the correct path
    return docData(this.getContactDocRef(id), { idField: 'id' }) as Observable<Contact>;
  }

  getContactsObservable(companyId: string | null = null): Observable<Contact[]> {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return of([]);
    }

    const contactsCollection = this.getContactsColRef();
    
    // Build query with optional company filter
    if (companyId) {
      const contactsQuery = query(contactsCollection, where('companyId', '==', companyId));
      return (collectionData(contactsQuery, { idField: 'id' }) as Observable<Contact[]>).pipe(
        catchError(err => this.errorHandler(err))
      );
    }
    
    // Optional: Add user filtering
    // if (currentUser) {
    //   const contactsQuery = query(contactsCollection, where('userId', '==', currentUser.uid));
    //   return (collectionData(contactsQuery, { idField: 'id' }) as Observable<Contact[]>).pipe(
    //     catchError(err => this.errorHandler(err))
    //   );
    // }

    return (collectionData(contactsCollection, { idField: 'id' }) as Observable<Contact[]>).pipe(
      catchError(err => this.errorHandler(err))
    );
  }

  async saveContact(contact: Contact) {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      throw new Error('User must be authenticated to save contacts');
    }

    // Prepare data without the Firestore document id field
    const { id, ...data } = contact;
    
    // Optional: Add user ID to the contact data
    // const contactData = { ...data, userId: currentUser.uid };
    const contactData = data; // For now, don't add user filtering
    
    if (id) {
      await updateDoc(this.getContactDocRef(id), contactData as Partial<Contact>);
    } else {
      await addDoc(this.getContactsColRef(), contactData as Omit<Contact, 'id'>);
    }
  }

  // editContact returns a Promise
  async editContact(contact: Partial<Contact>, id: string) {
    const { id: _omit, ...data } = contact as Contact & { id?: string };
    await updateDoc(this.getContactDocRef(id), data)
      .then(_ => console.log('Success on update'))
      .catch(error => console.log('update', error));
  }

  // A method to perform a partial update (non-destructive)
  async updateContact(contact: Partial<Contact>, id: string) {
    const { id: _omit, ...data } = contact as Contact & { id?: string };
    await updateDoc(this.getContactDocRef(id), data);
  }
  // deleteContact
  async deleteContact(id: string) {
    await deleteDoc(this.getContactDocRef(id));
  }

  private errorHandler(error: any): Observable<any> {
    console.log(error);
    return throwError(() => error);
  }
}

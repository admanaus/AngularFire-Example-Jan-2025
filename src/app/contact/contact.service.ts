// src/app/contact/contact.service.ts
import { Injectable } from '@angular/core';
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
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {

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
    const contactsCollection = this.getContactsColRef();
    const filtered = companyId ? query(contactsCollection, where('companyId', '==', companyId)) : contactsCollection;
    return (collectionData(filtered, { idField: 'id' }) as Observable<Contact[]>).pipe(
      catchError(err => this.errorHandler(err))
    );
  }


  async saveContact(contact: Contact) {
    // Prepare data without the Firestore document id field
    const { id, ...data } = contact;
    if (id) {
      // updateDoc expects an object without the document id and with proper field paths
      await updateDoc(this.getContactDocRef(id), data as Partial<Contact>);
    } else {
      // For creation, also avoid persisting the id field
      await addDoc(this.getContactsColRef(), data as Omit<Contact, 'id'>);
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

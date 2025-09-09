// src/app/company/company.service.ts
import {Injectable} from '@angular/core';
import {Company} from '../models/company';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  updateDoc
} from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {

  constructor(private db: Firestore) {
  }
  // A helper to get the document reference
  private getCompanyDocRef(id: string) {
    return doc(this.db, 'companies/' + id);
  }

  // A helper to get the collection reference
  private getCompaniesColRef() {
    return collection(this.db, 'companies');
  }

  getCompanyObservable(id: string): Observable<Company | undefined> {
    // include the Firestore doc id as `id` so editors can save with the correct path
    return docData(this.getCompanyDocRef(id), { idField: 'id' }) as Observable<Company>;
  }

  getCompaniesObservable(): Observable<Company[]> {
    return collectionData(this.getCompaniesColRef(), {idField: 'id'}) as Observable<Company[]>;
  }

  async saveCompany(company: Company) {
    // Prepare data without the Firestore document id field
    const { id, ...data } = company;
    if (id) {
      // updateDoc expects an object without the document id and with proper field paths
      await updateDoc(this.getCompanyDocRef(id), data as Partial<Company>);
    } else {
      // For creation, also avoid persisting the id field
      await addDoc(this.getCompaniesColRef(), data as Omit<Company, 'id'>);
    }
  }

  // editCompany returns a Promise
  async editCompany(company: Partial<Company>, id: string) {
    const { id: _omit, ...data } = company as Company & { id?: string };
    await updateDoc(this.getCompanyDocRef(id), data)
      .then(_ => console.log('Success on update'))
      .catch(error => console.log('update', error));
  }

  // A method to perform a partial update (non-destructive)
  async updateCompany(company: Partial<Company>, id: string) {
    const { id: _omit, ...data } = company as Company & { id?: string };
    await updateDoc(this.getCompanyDocRef(id), data);
  }
  // deleteCompany
  async deleteCompany(id: string) {
    await deleteDoc(this.getCompanyDocRef(id));
  }
}

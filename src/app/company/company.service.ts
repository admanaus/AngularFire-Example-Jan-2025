// src/app/company/company.service.ts
import { Injectable } from '@angular/core';
import { Company } from '../models/company';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  setDoc,
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
  // A method to retrieve the document as an Observable
  getCompanyObservable(id: string): Observable<Company | undefined> {
    return docData(this.getCompanyDocRef(id)) as Observable<Company>;
  }

  // A method to retrieve the collection as an Observable with IDs
  getCompaniesObservable(): Observable<Company[]> {
    // collectionData() gets the collection data and automatically
    // includes the ID as a property of each document object.
    return collectionData(this.getCompaniesColRef(), { idField: 'id' }) as Observable<Company[]>;
  }
  // saveCompany returns a Promise, so we can use .then() and .catch()
  async saveCompany(company: Company, id: string) {
    await setDoc(this.getCompanyDocRef(id), company)
      .then(_ => console.log('Success on set'))
      .catch(error => console.log('set', error));
  }

  // editCompany returns a Promise
  async editCompany(company: any, id: string) {
    await updateDoc(this.getCompanyDocRef(id), company)
      .then(_ => console.log('Success on update'))
      .catch(error => console.log('update', error));
  }

  // A method to perform a partial update (non-destructive)
  async updateCompany(company: any, id: string) {
    await updateDoc(this.getCompanyDocRef(id), company);
  }
  // deleteCompany returns a Promise
  async deleteCompany(id: string) {
    await deleteDoc(this.getCompanyDocRef(id))
      .then(_ => console.log('Success on remove'))
      .catch(error => console.log('remove', error));
  }
}

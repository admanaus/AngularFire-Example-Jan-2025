// src/app/company/company.service.ts
import {Injectable, inject} from '@angular/core';
import {Company} from '../models/company';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  updateDoc,
  query,
  where
} from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { catchError } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private authService = inject(AuthService);

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
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return of([]);
    }
    
    // Optional: Filter companies by user ID if you want user-specific data
    // const companiesQuery = query(
    //   this.getCompaniesColRef(),
    //   where('userId', '==', currentUser.uid)
    // );
    // return collectionData(companiesQuery, {idField: 'id'}) as Observable<Company[]>;
    
    // For now, return all companies (no user filtering)
    return collectionData(this.getCompaniesColRef(), {idField: 'id'}) as Observable<Company[]>;
  }

  async saveCompany(company: Company) {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      throw new Error('User must be authenticated to save companies');
    }

    // Prepare data without the Firestore document id field
    const { id, ...data } = company;
    
    // Optional: Add user ID to the company data
    // const companyData = { ...data, userId: currentUser.uid };
    const companyData = data; // For now, don't add user filtering
    
    if (id) {
      await updateDoc(this.getCompanyDocRef(id), companyData as Partial<Company>);
    } else {
      await addDoc(this.getCompaniesColRef(), companyData as Omit<Company, 'id'>);
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

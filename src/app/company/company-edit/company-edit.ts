// src/app/company/company-edit/company-edit.component.ts
import { Observable } from 'rxjs';
import { Company } from '../../models/company';
import { Component, inject, OnInit } from '@angular/core';
import { CompanyService } from '../company.service';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-edit',
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
  templateUrl: './company-edit.html',
  styleUrl: './company-edit.css'
})
export class CompanyEdit implements OnInit {
  company$: Observable<Company | undefined>;
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);

  constructor(private companyService: CompanyService) {
    this.company$ = this.companyService.getCompanyObservable();
  }

  ngOnInit() {
  }

  // Here we are also handing errors and showing a snackbar, adding a nicer experience for whoever is using our app to be notified that what they        // did was successsful
  async saveCompany(company: Company) {
    try {
      await this.companyService.saveCompany(company);
      console.log('Company saved successfully');
      this._snackBar.open('Company saved successfully', 'Close', { duration: 3000 });
    } catch (err) {
      console.error('Error saving company:', err);
      this._snackBar.open('Failed to save company', 'Close', { duration: 3000 });
    }
  }

  async editCompany(company: any) {
    try {
      // This is a partial update object with only a 'phone' property.
      await this.companyService.editCompany({ phone: '123-456-7890' });
      this._snackBar.open('Company updated', 'Close', { duration: 3000 });
    } catch (err) {
      console.error('Error editing company:', err);
      this._snackBar.open('Failed to update company', 'Close', { duration: 3000 });
    }
  }

  async deleteCompany() {
    await this.companyService.deleteCompany();
    // After deletion, navigate to the main page
    this.router.navigate(['/']);
  }
}
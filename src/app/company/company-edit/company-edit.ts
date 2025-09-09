// src/app/company/company-edit/company-edit.component.ts
import { Observable, of } from 'rxjs';
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
import { ActivatedRoute, Router } from '@angular/router';

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
  company$: Observable<Company | undefined> | undefined;
  editableCompany: Company | undefined;
  companyId: string | null = null;
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private companyService = inject(CompanyService);

  ngOnInit() {
    // Get the ID from the route and fetch the corresponding company as an Observable
    this.route.paramMap.subscribe(params => {
      this.companyId = params.get('id');
      if (!this.companyId || this.companyId === 'new') {
        // Creation flow: provide a default company object (no id) so the form renders
        const defaultCompany: Company = { name: '' } as Company;
        this.company$ = of(defaultCompany);
        this.editableCompany = { ...defaultCompany };
        return;
      }
      // Editing existing doc
      this.company$ = this.companyService.getCompanyObservable(this.companyId);
      // Keep an editable copy for ngModel two-way binding
      this.company$.subscribe((company) => {
        // ensure id is preserved in the editable copy for saving
        console.log(company);
        this.editableCompany = company ? { ...company } : undefined;
      });
    });
  }

  async saveCompany(company: Company) {
    if (!company) { return; }
    try {
      await this.companyService.saveCompany(company);
      this._snackBar.open('Company saved successfully', 'Close', { duration: 3000 });
      await this.router.navigate(['/company/all']);
    } catch (e) {
      console.error('Save failed', e);
      this._snackBar.open('Failed to save company', 'Close', { duration: 3000 });
    }
  }

    async deleteCompany() {
    await this.companyService.deleteCompany(this.companyId as string);
    await this.router.navigate(['/company/all']);
  }

}
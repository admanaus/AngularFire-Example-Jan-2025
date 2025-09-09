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
  company$: Observable<Company> | undefined;
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);

  constructor(private companyService: CompanyService) {
  }

  ngOnInit() {
  }

}
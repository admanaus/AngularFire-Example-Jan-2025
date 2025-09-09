// src/app/company/company-list/company-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../../models/company';
import { CompanyService } from '../company.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-company-list',
  imports: [
    CommonModule,
    MatCardModule,
    RouterLink,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css'
})
export class CompanyList implements OnInit {
  public companies$: Observable<Company[]> | undefined;

  constructor(private companyService: CompanyService) {
  }

  ngOnInit() {
    this.getCompanies();
  }

  getCompanies() {
    this.companies$ = this.companyService.getCompaniesObservable();
  }
}

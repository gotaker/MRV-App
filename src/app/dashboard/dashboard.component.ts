import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>Emissions Overview</mat-card-title></mat-card-header>
        <mat-card-content><p>Connect MRV KPIs and charts here.</p></mat-card-content>
        <mat-card-actions><button mat-button>View Details</button></mat-card-actions>
      </mat-card>
    </div>
  `
})
export class DashboardComponent {}

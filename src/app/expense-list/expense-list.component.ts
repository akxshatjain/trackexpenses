import { Component, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../models/expense.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { effect } from '@angular/core'; // make sure 'effect' is imported


@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.css'
})
export class ExpenseListComponent {
  expenseService = inject(ExpenseService);
  displayedColumns: string[] = ['id', 'title', 'category', 'amount', 'date'];
  dataSource = new MatTableDataSource<Expense>([]);

  constructor() {
  this.expenseService.getExpenses();

  effect(() => {
    this.dataSource.data = this.expenseService.expenses();
  });
}
}


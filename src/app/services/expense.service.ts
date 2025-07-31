import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense } from '../models/expense.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expenseSignal = signal<Expense[]>([]);

  constructor(private http: HttpClient) { }

  getExpenses() {
    this.http.get<Expense[]>('http://localhost:3000/expenses')
      .subscribe(expenses => this.expenseSignal.set(expenses));
  }
  //get all exp
  get expenses() {
    return this.expenseSignal;
  }

  //add an exp
  // addExpense(expense: Expense) {
  //    this.http.post('http://localhost:3000/expenses', expense)
  //    .subscribe(()=>this.getExpenses());
  // }


 addExpense(expense: Expense) {
  this.http.get<Expense[]>('http://localhost:3000/expenses').subscribe(currentExpenses => {
    const maxId = currentExpenses.length > 0
      ? Math.max(...currentExpenses.map(e => +e.id))
      : 0;

    const newExpense = {
      ...expense,
      id: (maxId + 1).toString()  // or just maxId + 1 if `id` is a number
    };

    this.http.post('http://localhost:3000/expenses', newExpense)
      .subscribe(() => this.getExpenses());
  });
}





  //del an exp
 deleteExpense(id: number) {
     this.http.delete(`http://localhost:3000/expenses/${id}`)
     .subscribe(()=>this.getExpenses());
  }

  updateExpense(id: string, updatedExpense: Expense) {
    this.http.put(`http://localhost:3000/expenses/${id}`, updatedExpense)
    .subscribe(()=>this.getExpenses());  
  }

  getExpenseById(id: number) {
    return this.expenseSignal().find(expense => expense.id == id);
  }
}

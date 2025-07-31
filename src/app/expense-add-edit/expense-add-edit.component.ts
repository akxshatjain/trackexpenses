import { Component,inject } from '@angular/core';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExpenseService } from '../services/expense.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Expense } from '../models/expense.model';

@Component({
  selector: 'app-expense-add-edit',
  imports: [MatCardModule,MatDatepicker,CommonModule,ReactiveFormsModule,MatButtonModule,MatInputModule,MatSelectModule,MatDatepickerModule,MatCardModule,MatIconModule,MatFormFieldModule],
  templateUrl: './expense-add-edit.component.html',
  styleUrl: './expense-add-edit.component.css'
})
export class ExpenseAddEditComponent {
  expenseService=inject(ExpenseService);
  router=inject(Router);
  snackBar=inject(MatSnackBar);
  route=inject(ActivatedRoute);

  

  categories=["Food","Travel","Entertainment","Luxury","Movies","dating"]

  expenseForm:FormGroup;
  isEditMode=false;
  expenseId:number=0;

  constructor(private fb: FormBuilder){
    this.expenseForm=this.fb.group({
      title:["",Validators.required],
      category:["",Validators.required],
      amount:[null,[Validators.required,Validators.min(0)]],
      date:["",Validators.required]

    });

    this.route.paramMap.subscribe(params=>{
      const id = params.get("id");
       if(id){
        this.isEditMode=true;
        this.expenseId=+id;
        this.expenseService.getExpenses();

        effect(()=>{
            const expense =this.expenseService.expenses();
            if(expense.length>0){
              this.loadExpenseData(this.expenseId);

            }

        })
       }

    });
  }

  loadExpenseData(expenseId:number){
    const expense=this.expenseService.getExpenseById(expenseId);
    console.log(expense);
    console.log("Inside Load Expense");

    if(expense){
      this.expenseForm.patchValue({
        title:expense.title,
        amount:expense.amount,
        category:expense.category,
        date: new Date(expense.date)


      })
    }


}
  ///old submit button without formatted date
  onSubmit(){
    console.log("Form Submitted");
    console.log(this.expenseForm);
     if(this.expenseForm.valid){
      const expense: Expense= {...this.expenseForm.value, id:this.expenseId || Date.now()}
      
          if(this.isEditMode && this.expenseId!==null){
          this.expenseService.updateExpense(this.expenseId.toString(),expense);
          this.snackBar.open("Expense Edited Successfully")

          } 
          else{
            this.expenseService.addExpense(expense);
            this.snackBar.open("Expense Added Successfullly");
            
          }
          this.router.navigate(["/dashboard"]);
    }
  }

  //new submit with formatted date
//   onSubmit() {
//   console.log("Form Submitted");
//   console.log(this.expenseForm);

//   if (this.expenseForm.valid) {
//     const rawDate: Date = this.expenseForm.value.date;

//     const formattedDate = this.formatDate(rawDate);

//     const expense: Expense = {
//       ...this.expenseForm.value,
//       date: formattedDate,
//       id: this.expenseId || Date.now()
//     };

//     if (this.isEditMode && this.expenseId !== null) {
//       this.expenseService.updateExpense(this.expenseId.toString(), expense);
//       this.snackBar.open("Expense Edited Successfully");
//     } else {
//       this.expenseService.addExpense(expense);
//       this.snackBar.open("Expense Added Successfully");
//     }

//     this.router.navigate(["/dashboard"]);
//   }

//   //format date function
//   }

//   formatDate(date: Date): string {
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// }

}


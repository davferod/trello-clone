import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CdkTableModule} from '@angular/cdk/table';
import { ReactiveFormsModule, FormControl } from '@angular/forms';


import { Product } from '@shared/models/product.model';
import { TaskService } from '@shared/services/task.service';
import { ProductStore } from '@shared/services/product-store';
import { NavbarComponent } from '@shared/components/navbar/navbar.component'
import { ButtonComponent } from '@domains/shared/components/button/button.component';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, CdkTableModule, ButtonComponent],
  templateUrl: './table.component.html'
})
export class TableComponent {
  private taskSrv = inject(TaskService);
  private productStore = inject(ProductStore);
  displayedColumns: string[] = ['title', 'price', 'description', 'images', 'actions'];
  ColumnsFor: string[] = ['title', 'price', 'description'];
  input = new FormControl('', { nonNullable: true });

  products =  this.productStore.products;
  total = this.productStore.total;
  originalData = this.productStore.originalData;

  ngOnInit(): void {
    this.getProducts();

    this.input.valueChanges
    .pipe(debounceTime(300))
    .subscribe((value) => {
      this.findProduct(value);
    });
  }

  getProducts() {
    this.taskSrv.getProducts()
    .subscribe({
      next: (data) => {
        this.productStore.setProducts(data);
      },
      error: (err: Error) => {
        console.error(err);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }

  updateProduct(product: Product): void {
    const index = product.id;
    this.productStore.updateProduct(index);
  }

  findProduct(query: string): void {
    this.productStore.findProduct(query);
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { Category, Product } from '../models/models';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-suggested-products',
  templateUrl: './suggested-products.component.html',
  styleUrls: ['./suggested-products.component.css'],
})
export class SuggestedProductsComponent implements OnInit {
  @Input() category: Category = {
    id: 0,
    category: '',
    subCategory: '',
  };
  @Input() count: number = 3;
  products: Product[] = [];

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.navigationService
    //se llama al metodo, y se pasa los argumentos para obtener los productos
    .getProducts(
      this.category.category,
      this.category.subCategory,
      this.count
    )
    //recorre el array, por cada producto recibido, se añade a la propiedad products
    .subscribe((res: Product[]) => {
      for (let product of res) {
        this.products.push(product);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from './product.service';
import { Product } from '../models/models';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  product: Product = {
    id: 0,
    title: '',
    description: '',
    price: 0,
    quantity: 0,
    productCategory: {
      id: 1,
      category: '',
      subCategory: '',
    },
    offer: {
      id: 1,
      title: '',
      discount: 0,
    },
    imageName: '',
  };
  isEditMode: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.isEditMode = true;
      this.productService.getProduct(+productId).subscribe(product => {
        this.product = product;
      });
    }
  }

  saveProduct(): void {
    if (this.isEditMode) {
      this.productService.updateProduct(this.product.id, this.product).subscribe(() => {
        this.router.navigate(['/productss']);
      });
    } else {
      this.productService.createProduct(this.product).subscribe(() => {
        this.router.navigate(['/productss']);
      });
    }
  }
}

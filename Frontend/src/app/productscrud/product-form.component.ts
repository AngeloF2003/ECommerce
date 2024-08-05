import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from '../models/models';
import { environment } from 'src/environments/environment';
import { ProductService } from './product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
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

  private imgBBUrl = 'https://api.imgbb.com/1/upload';
  private imgBBApiKey = environment.IMGBB_API_KEY;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
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

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      this.http.post<any>(`${this.imgBBUrl}?key=${this.imgBBApiKey}`, formData)
        .subscribe(response => {
          console.log('Image URL:', response.data.url);

          this.product.imageName = response.data.url; // Obtén la URL de la imagen cargada
          console.log('Image URL:', this.product.imageName);
        }, error => {
          console.error('Image upload failed', error);
        });
    }
  }

  saveProduct(): void {
    if (this.isEditMode) {
      this.productService.updateProduct(this.product.id, this.product).subscribe(() => {
        this.router.navigate(['/admin']);
      });
    } else {
      this.productService.createProduct(this.product).subscribe(() => {
        this.router.navigate(['/admin']);
      });
    }
  }
}

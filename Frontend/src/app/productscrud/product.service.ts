  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
import { Product } from '../models/models';


  @Injectable({
    providedIn: 'root'
  })
  export class ProductService {
    private apiUrl = 'https://localhost:7149/api/ProductCrud';  // Asegúrate de que la URL base sea correcta
  ;  // Cambia esta URL por la de tu API

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
      console.log('si llega aca');
      return this.http.get<Product[]>(`${this.apiUrl}/ListAll`);
    }

    getProduct(id: number): Observable<Product> {
      return this.http.get<Product>(`${this.apiUrl}/ProductRead/${id}`);
    }

    createProduct(product: Product): Observable<Product> {
      return this.http.post<Product>(`${this.apiUrl}/Insert`, product);
    }

    updateProduct(id: number, product: Product): Observable<Product> {
      return this.http.put<Product>(`${this.apiUrl}/Update/${id}`, product);
    }

    deleteProduct(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`);
    }
  }

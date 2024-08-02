  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
import { Offer, Product } from '../models/models';


  @Injectable({
    providedIn: 'root'
  })
  export class ProductService {
    private apiUrl = 'https://localhost:7149/api/ProductCrud';
    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
      console.log('si llega aca');
      return this.http.get<Product[]>(`${this.apiUrl}/ListAll`);
    }

    getProduct(id: number): Observable<Product> {
      return this.http.get<Product>(`${this.apiUrl}/ProductRead/${id}`);
    }

    createProduct(product: Product): Observable<Product> {
      console.log('Creating product with:', product);

      return this.http.post<Product>(`${this.apiUrl}/Insert`, product);
    }

    updateProduct(id: number, product: Product): Observable<Product> {
      return this.http.put<Product>(`${this.apiUrl}/Update/${id}`, product, {
        headers: { 'Content-Type': 'application/json' }
      });
    }



    deleteProduct(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`);
    }
    getOffers(): Observable<Offer[]> {
      return this.http.get<Offer[]>(`${this.apiUrl}/GetOffers`);

    }

    getOffer(id: number): Observable<Offer> {
      return this.http.get<Offer>(`${this.apiUrl}/GetOffer/${id}`);
    }
  }

import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject} from 'rxjs';
import { Cart, Payment, Product, User } from '../models/models';
import { NavigationService } from './navigation.service';


@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  changeCart = new Subject();

  constructor(
    private navigationService: NavigationService,
    private jwt: JwtHelperService
  ) {}

  applyDiscount(price: number, discount: number): number {
    let finalPrice: number = price - price * (discount / 100);
    return finalPrice;
  }

  getUser(): User {
    let token = this.jwt.decodeToken();
    let user: User = {
      id: token.id,
      firstName: token.firstName,
      lastName: token.lastName,
      address: token.address,
      mobile: token.mobile,
      email: token.email,
      password: '',
      createdAt: token.createdAt,
      modifiedAt: token.modifiedAt,
      idRole: token.idRole
    };
    return user;
  }



  setUser(token: string) {
    localStorage.setItem('user', token);
  }


  isLoggedIn(): boolean {
    const token = localStorage.getItem('user');
    console.log('Stored token:', token); // Agrega este log
    if (token) {
      try {
        // Verifica que el token esté en el formato correcto
        if (this.isTokenFormatValid(token)) {
          return !this.jwt.isTokenExpired(token); // Verifica si el token está expirado
        } else {
          console.error('Token format is invalid');
          return false;
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        return false;
      }
    }
    return false;
  }

  private isTokenFormatValid(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3;
  }



  logoutUser() {
    localStorage.removeItem('user');
  }

  addToCart(product: Product) {
    let user = this.getUser();
    if (user) {
      let productId = product.id;
      let userId = user.id;

      this.navigationService.addToCart(userId, productId).subscribe((res) => {
        if (res.toString() === 'inserted') this.changeCart.next(1);
      });
    }
  }
  removeFromCart(product: Product) {
    let user = this.getUser();
    if (user) {
      let productId = product.id;
      let userId = user.id;

      this.navigationService.removeFromCart(userId, productId).subscribe((res) => {
        if (res.toString() === 'deleted') this.changeCart.next(-1);
      });
    }
  }

  calculatePayment(cart: Cart, payment: Payment) {
    payment.totalAmount = 0;
    payment.amountPaid = 0;
    payment.amountReduced = 0;
//se acumula el precio de todos los productos
    for (let cartitem of cart.cartItems) {
      payment.totalAmount += cartitem.product.price;

      payment.amountReduced +=
        cartitem.product.price -
        this.applyDiscount(
          cartitem.product.price,
          cartitem.product.offer.discount
        );

      payment.amountPaid += this.applyDiscount(
        cartitem.product.price,
        cartitem.product.offer.discount
      );
    }

    if (payment.amountPaid > 50000) payment.shipingCharges = 2000;
    else if (payment.amountPaid > 20000) payment.shipingCharges = 1000;
    else if (payment.amountPaid > 5000) payment.shipingCharges = 500;
    else payment.shipingCharges = 200;
  }

  calculatePricePaid(cart: Cart) {
    let pricepaid = 0;
    for (let cartitem of cart.cartItems) {
      pricepaid += this.applyDiscount(
        cartitem.product.price,
        cartitem.product.offer.discount
      );
    }
    return pricepaid;
  }

  orderTheCart() {

  }
  getUserRole(): string | null {
    let token = localStorage.getItem('user');
    if (token && !this.jwt.isTokenExpired(token)) {
      let decodedToken = this.jwt.decodeToken(token);
      return decodedToken.role;
    }
    return null;
  }

  isUserAdmin() {
    const user = this.getUser();
    return user && user.idRole === 1;
  }
}

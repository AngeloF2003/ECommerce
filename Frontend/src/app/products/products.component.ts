import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/models';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  view: 'grid' | 'list' = 'list';
  sortby: 'default' | 'htl' | 'lth' = 'default';
  products: Product[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private navigationService: NavigationService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    //accedo a la info de la url, me suscribo cada vez que la consulta en la url cambie
    //params recibe los parametros actuales, extrae los valores de los parametro de consulta
    this.activatedRoute.queryParams.subscribe((params: any) => {
      let category = params.category;
      let subcategory = params.subcategory;
//si ambos estan, se llama al metodo para que tome como argumentos, cat, sub, count
//devuel un obs, quee toma como respuesta res, y se asigna a products
      if (category && subcategory)
        this.navigationService
          .getProducts(category, subcategory, 10)
          .subscribe((res: any) => {
            this.products = res;
          });
    });
  }
//ordenamiento predetermiando
  sortByPrice(sortKey: string) {
    this.products.sort((a, b) => {
      if (sortKey === 'default') {
        return a.id > b.id ? 1 : -1;
      }
      //ordenamiento por precios
      return (
        (sortKey === 'htl' ? 1 : -1) *
        (this.utilityService.applyDiscount(a.price, a.offer.discount) >
        this.utilityService.applyDiscount(b.price, b.offer.discount)
          ? -1
          : 1)
      );
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Product, Review } from '../models/models';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  imageIndex: number = 1;
  product!: Product;
  reviewControl = new FormControl('');
  showError = false;
  reviewSaved = false;
  otherReviews: Review[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private navigationService: NavigationService,
    public utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      let id = params.id;
      this.navigationService.getProduct(id).subscribe((res: any) => {
        this.product = res;
        this.fetchAllReviews();
      });
    });

  }

  submitReview() {
    let review = this.reviewControl.value;

    if (review === '' || review === null) {
      this.showError = true;
      return;
    }

    let userid = this.utilityService.getUser().id;
    let productid = this.product.id;

    this.navigationService
      .submitReview(userid, productid, review)
      .subscribe((res) => {
        this.reviewSaved = true;
        this.fetchAllReviews();
        this.reviewControl.setValue('');
      });
  }

  fetchAllReviews() {
    this.otherReviews = [];
    this.navigationService
      .getAllReviewsOfProduct(this.product.id)
      .subscribe((res: any) => {
        for (let review of res) {
          review.createdAt = this.convertToISODate(review.createdAt);
          this.otherReviews.push(review);
        }
      });
  }

  convertToISODate(dateString: string): string {
    try {
      const [dayOfWeek, monthDayTime] = dateString.split(', ');
      const [day, month, time] = monthDayTime.split(' ');
      const [hour, minute, second] = time.split(':');
      const months: { [key: string]: number } = {
        ene: 0,
        feb: 1,
        mar: 2,
        abr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        ago: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dic: 11
      };

      const monthIndex = months[month];
      const year = new Date().getFullYear();

      const date = new Date(year, monthIndex, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }

      return date.toISOString();
    } catch (error) {

      return new Date().toISOString();
    }
  }
}

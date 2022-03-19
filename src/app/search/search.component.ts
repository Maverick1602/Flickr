import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { element } from 'protractor';
import {debounceTime, distinctUntilChanged, map, pluck, switchMap} from 'rxjs/operators';
import { FetchService } from '../fetch.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements AfterViewInit {

  @ViewChildren('theLastList', {read: ElementRef})
  theLastList: QueryList<ElementRef>;

  @ViewChild('searchForm', {static: false}) searchForm: NgForm;

  constructor(public fetchServ: FetchService) { }

  textVal: string;
  dataArr: any = {stat: 'fail', code: 3, message: 'Parameterless searches have been disabled. Please use flickr.photos.getRecent instead.'};
  totalPages: number;
  currentPage = 0;
  observer: any;
  arr: any = [];
  fVal: any;



  ngAfterViewInit() {

    this.fetchData();

    this.theLastList.changes.subscribe((d) => {
      // console.log(d);
      if (d.last) { this.observer.observe(d.last.nativeElement); }
    });

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // console.log("scroll more")
        if (this.currentPage < this.totalPages) {
          // console.log("condition met")
          this.currentPage++;
          // console.log(this.arr)
          // console.log("text",this.textVal)

          this.fetchServ.fetchData(this.textVal, this.currentPage).subscribe(res => {
            res.photos.photo.forEach(el => {
              this.arr.push(el);
            });
          });
        }
      }
    }, options);
  }

  fetchData() {
    const formValue = this.searchForm.valueChanges;

    // console.log("fetching")
    formValue.pipe(
      pluck('searchVal'),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(data => this.fetchServ.fetchData(data, this.currentPage))
    ).subscribe((success) => {
      this.dataArr = success;
      this.arr = [];
      this.textVal = this.searchForm.value.searchVal;
      if (this.dataArr.stat === 'ok') {
        this.totalPages = success.photos.pages;
        success.photos.photo.forEach((ele) => {
        this.arr.push(ele);

      });
      }

      // console.log(success);
      // console.log(this.arr)
    });
  }



  intersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // console.log("scroll more")
        if (this.currentPage < this.totalPages) {
          // console.log("condition met")
          this.currentPage++;
          this.fetchData();
        }
      }
    }, options);
  }


}

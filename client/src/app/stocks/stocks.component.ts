import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {
  stocks: any;
  private readonly URL = 'https://cloud.iexapis.com/stable/stock/market/collection/tag?collectionName=Airlines&token=pk_6458d2a7c5ab4c70b5dfa001795e7535';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.stocks = this.getData();
    console.log("STONKS ", this.stocks);
  }

  getData() {
    return this.http.get(this.URL);
  }
}

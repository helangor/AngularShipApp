import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CurrencyService } from '../services/currency.service';

export class CurrencyData {
  name: any;
  rate: number;
}

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class CurrencyComponent implements OnInit, AfterViewInit  {
  currencies = new MatTableDataSource<CurrencyData[]>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  expandedElement: CurrencyData | null;


  constructor(private currencyService: CurrencyService) { }
  displayedColumns: string[] = ['name','rate'];

  ngOnInit() {

  this.currencyService.getLatest().subscribe(data => {
    this.currencies.data = this.convertToArray(data.rates);
  });
  }

  ngAfterViewInit() {
    this.currencies.paginator = this.paginator;
  }
  
  convertToArray (data) {
    let arr = [];  

    Object.keys(data).map(function(key){  
      arr.push({'name':key,'rate':data[key]})  
      return arr;});  
      return arr;
    }

}

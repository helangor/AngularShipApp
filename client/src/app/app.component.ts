import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  wheather: any;

  constructor(private http: HttpClient) {}


  ngOnInit() {
    console.log("Init works");
    this.http.get('https://localhost:44369/weatherforecast/').subscribe(response => {
      this.wheather = response;
    }, error => {
      console.log(error);
    })
  }

  
}

import { Component, OnInit } from '@angular/core';
import { Ship } from '../models/ship.model';
import { ShipService } from '../services/ship.service';

@Component({
  selector: 'app-ship-radar',
  templateUrl: './ship-radar.component.html',
  styleUrls: ['./ship-radar.component.scss']
})
export class ShipRadarComponent implements OnInit {
ships: Ship[];

  constructor(private shipService: ShipService) {
   }

  ngOnInit() {

    this.shipService.getLatest().subscribe((res: any) => {
      this.ships = res.features;
      this.calculateDistanceFromHome();
    });
  }


  calculateDistanceFromHome(){
    console.log("SHIPs: ", this.ships);
    for (let ship of this.ships)
    {
      console.log(ship.geometry.coordinates[0])
    }
  }

}

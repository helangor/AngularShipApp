import { Component, OnInit } from '@angular/core';
import { Ship } from '../models/ship.model';
import { ShipService } from '../services/ship.service';
import { getDistance } from 'geolib';

@Component({
  selector: 'app-ship-radar',
  templateUrl: './ship-radar.component.html',
  styleUrls: ['./ship-radar.component.scss']
})
export class ShipRadarComponent implements OnInit {
ships: Ship[];
homeCoordinates: [latitude: number, longitude: number] = [28.320951, 61.058983];

  constructor(private shipService: ShipService) {
   }

  ngOnInit() {
    this.shipService.getLatest().subscribe((res: any) => {
      this.ships = res.features;
      this.enterExtraData();
    });
  }

  private enterExtraData() {
    for (let ship of this.ships)
    {
      this.addDistanceFromMustola(ship);
      this.isHeadingTowardsMustola(ship);
    }
  }

  private addDistanceFromMustola(ship: Ship) {
    ship.properties.distance = getDistance(
      {latitude: this.homeCoordinates[0], longitude: this.homeCoordinates[1]},
      {latitude: ship.geometry.coordinates[1], longitude: ship.geometry.coordinates[0]});
  }

  private isHeadingTowardsMustola(ship: Ship) {
    console.log(ship);
    // (lat < 61.0804652 and long > 28.2754649)) and ((((200 <= course <= 360) or course <= 10) and lat < homeLat and long > homeLong) or ((30 <= course <= 190) and lat > homeLat and long < homeLong)):

  }

}

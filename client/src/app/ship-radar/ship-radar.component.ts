import { Component, OnInit } from '@angular/core';
import { Ship } from '../models/ship.model';
import { ShipService } from '../services/ship.service';
import { getDistance } from 'geolib';
import { BidiModule } from '@angular/cdk/bidi';

@Component({
  selector: 'app-ship-radar',
  templateUrl: './ship-radar.component.html',
  styleUrls: ['./ship-radar.component.scss']
})
export class ShipRadarComponent implements OnInit {
ships: Ship[];
nearestShip: Ship;
homeCoordinates: [longitude: number, latitude: number] = [28.320951, 61.058983];

  constructor(private shipService: ShipService) {
   }

  ngOnInit() {
    this.shipService.getLatest().subscribe((res: any) => {
      this.ships = [...res.features];
      this.enterExtraData();
      this.filterShips();
      this.getNearestShip();
    });
  }

private getNearestShip() {
  this.ships = this.ships.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
  this.nearestShip = this.ships[0]  
}

  private filterShips() {
    this.ships = this.ships.filter(p => p.properties.isHeadingToMustola === true && (p.properties.navStat === 0 || 5 || 8))
  }

  private enterExtraData() {
    for (let ship of this.ships)
    {
      this.addDistanceFromMustola(ship);
      this.isHeadingToMustola(ship);
    }
  }

  private addDistanceFromMustola(ship: Ship) {
    ship.distance = getDistance(
      {latitude: this.homeCoordinates[1], longitude: this.homeCoordinates[0]},
      {latitude: ship.geometry.coordinates[1], longitude: ship.geometry.coordinates[0]});
  }

  private isHeadingToMustola(ship: Ship) {
    // Ship east from Mustola
    if ((ship.geometry.coordinates[1] <= this.homeCoordinates[1]) && (ship.properties.cog < 30 || ship.properties.cog > 250)) {
      ship.properties.isHeadingToMustola = true;
    // Ship west from Mustola
    } else if ((ship.geometry.coordinates[1] <= 61.08) && (ship.properties.cog > 50 && ship.properties.cog < 180)) {
      ship.properties.isHeadingToMustola = true;
    } else { ship.properties.isHeadingToMustola = false; }
  }

}

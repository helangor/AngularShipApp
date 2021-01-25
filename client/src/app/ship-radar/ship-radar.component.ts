import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { Ship } from '../models/ship.model';
import { ShipExtraDataService } from '../services/ship-extra-data.service';
import { ShipService } from '../services/ship.service';

@Component({
  selector: 'app-ship-radar',
  templateUrl: './ship-radar.component.html',
  styleUrls: ['./ship-radar.component.scss']
})
export class ShipRadarComponent implements OnInit {
  ships: Ship[];
  nearestShip: Ship;
  items: any;
  homeCoordinates: [longitude: number, latitude: number] = [28.320951, 61.058983];

  constructor(private shipService: ShipService, private shipExtraDataService: ShipExtraDataService) {
  }

  ngOnInit() {
    this.timerToUpdateShips();
    this.getShipDataFromDatabase();
  }

  private timerToUpdateShips() {
    const updateTimer = timer(100, 3000);
    updateTimer.subscribe(x => {
      this.updateShips();
    });
  }

  private getShipDataFromDatabase() {
    this.shipExtraDataService.getExtraData(123).subscribe((res: any) => {
      console.log("RES ", res);
    })
  }

  private updateShips() {
    this.shipService.getLatest().subscribe((res: any) => {
      this.ships = res.features;
      this.enterExtraData();
      this.filterShips();
      this.nearestShip = this.getNearestShip();
      console.log("NEAREST: ", this.nearestShip)
      if (this.nearestShip) {
        this.getShipMetadata();
      }
    })
  }

  private getNearestShip() {
    this.ships = this.ships.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
    return this.ships[0]
  }

  private getShipMetadata() {
    this.shipService.getShipMetadata(this.nearestShip.mmsi).subscribe((res: any) => {
      this.nearestShip.properties.name = res.name;
      this.nearestShip.properties.destination = res.destination;
      this.nearestShip.properties.imo = res.imo;
      this.nearestShip.properties.shipType = res.shipType;
      this.nearestShip.properties.draught = res.draught;
    })
  }



  private filterShips() {
    this.ships = this.ships.filter(p => p.properties.isHeadingToMustola === true && (p.properties.navStat === 0 || 5 || 8))
  }

  private enterExtraData() {
    for (let ship of this.ships) {
      this.addDistanceFromMustola(ship);
      this.isHeadingToMustola(ship);
    }
  }

  private addDistanceFromMustola(ship: Ship) {
    ship.distance = this.getDistanceFromLatLonInKm(this.homeCoordinates[1], this.homeCoordinates[0], ship.geometry.coordinates[1], ship.geometry.coordinates[0])
  }

  private getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  private isHeadingToMustola(ship: Ship) {
    // Ship east from Mustola
    // HomeCord: 61.05
    if ((ship.geometry.coordinates[0] >= this.homeCoordinates[0]) && (ship.properties.cog <= 30 || ship.properties.cog >= 250)) {
      ship.properties.isHeadingToMustola = true;
      // Ship west from Mustola
    } else if ((ship.geometry.coordinates[0] <= this.homeCoordinates[0]) && (ship.properties.cog >= 50 && ship.properties.cog <= 180)) {
      ship.properties.isHeadingToMustola = true;
    } else { ship.properties.isHeadingToMustola = false; }
  }

}

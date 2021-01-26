import { Component, OnInit } from '@angular/core';
import { forkJoin, timer } from 'rxjs';
import { Ship } from '../models/ship.model';
import { ShipService } from '../services/ship.service';

@Component({
  selector: 'app-ship-radar',
  templateUrl: './ship-radar.component.html',
  styles: ['agm-map {height: 300px;}'],
  styleUrls: ['./ship-radar.component.scss']
})
export class ShipRadarComponent implements OnInit {
  ships: Ship[];
  nearestShip: Ship;
  lastShip: Ship;
  items: any;
  

  loading: boolean = true;
  homeCoordinates: [longitude: number, latitude: number] = [28.320951, 61.058983];

  constructor(private shipService: ShipService) {
  }

  ngOnInit() {
    this.shipService.getLatest().subscribe((res: any) => {
      this.ships = res.features;
      this.enterExtraData();
      this.filterShips();
      this.nearestShip = this.getNearestShip();
      this.getShipMetadata();
      this.lastShip = this.nearestShip;
      console.log("LAST:", this.lastShip);
      this.loading = false;
    })
    this.timerToUpdateShips();
  }

  private timerToUpdateShips() {
    const updateTimer = timer(100, 3000);
    updateTimer.subscribe(x => {
      this.updateShips();
    });
  }

  private updateShips() {
    this.shipService.getLatest().subscribe((res: any) => {
      this.ships = res.features;
      this.enterExtraData();
      this.filterShips();
      this.nearestShip = this.getNearestShip();
      if (this.nearestShip.mmsi === this.lastShip.mmsi) {
        this.lastShip.distance = this.nearestShip.distance;
        this.lastShip.geometry = this.nearestShip.geometry;
      } else {
        this.getShipMetadata();
        this.lastShip = this.nearestShip;
      }
    })
  }

  private getNearestShip() {
    this.ships = this.ships.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
    return this.ships[0]
  }

  private getShipMetadata() {
    forkJoin({
      shipApiData: this.shipService.getShipMetadata(this.nearestShip.mmsi), 
      shipDbData: this.shipService.getShipMetadataDB(this.nearestShip.mmsi)})
      .subscribe((res: any) => {
        console.log("RES: ", res);
      this.nearestShip.properties.name = res.shipApiData.name;
      this.nearestShip.properties.destination = res.shipApiData.destination;
      this.nearestShip.properties.imo = res.shipApiData.imo;
      this.nearestShip.properties.shipType = res.shipApiData.shipType;
      this.nearestShip.properties.draught = res.shipApiData.draught;
      this.nearestShip.properties.length = res.shipDbData.length;
      this.nearestShip.properties.width = res.shipDbData.width;
      this.nearestShip.properties.flag = res.shipDbData.flag;
      this.nearestShip.properties.image = res.shipDbData.image;
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

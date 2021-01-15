import { Injectable } from "@angular/core";

export class Ship {
        constructor(
          public geometry: {type: string, coordinates: number[]},
          public mmsi: number,
          public properties: 
            {cog: number, heading: number, mmsi: number, navStat: number, 
                posAcc: boolean, raim: boolean, rot: number, sog: number,
                timestamp: number, timestampExternal: number},
          public type: string
        ) {}
      }
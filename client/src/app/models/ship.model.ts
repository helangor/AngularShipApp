import { Injectable } from "@angular/core";

export class Ship {
        constructor(
          public mmsi: number,
          public geometry?: {type: string, coordinates: [longitude: number, latitude: number]},
          public properties?: 
            {cog: number, name: string, destination: string, imo: number, shipType: number, draught: number, heading: number, mmsi: number, navStat: number, 
                posAcc: boolean, raim: boolean, rot: number, sog: number,
                timestamp: number, timestampExternal: number, isHeadingToMustola: boolean},
          public type?: string,
          public distance?: number
        ) {}
      }
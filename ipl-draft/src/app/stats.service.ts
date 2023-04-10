import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private batsmanData: any;
  private bowlerData: any;
  private points: any;


  constructor() { }

  setBatsman(data: any) {
    this.batsmanData = data;
  }

  getBatsman() {
    return this.batsmanData;
  }

  setBowler(data: any) {
    this.bowlerData = data;
  }

  getBowler() {
    return this.bowlerData;
  }

  setPoints(data: any) {
    this.points = data;
  }

  getPoints() {
    return this.points;
  }
}

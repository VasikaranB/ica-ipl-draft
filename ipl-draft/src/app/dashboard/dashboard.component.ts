import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { masterData } from '../../util/playerslist';
import { StatsService } from '../stats.service';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private statService: StatsService,
    private loaderService: LoaderService
  ) {}

  battersData: any;
  bowlersData: any;
  members: members[] = [];

  ngOnInit() {
    let names = Object.keys(masterData);
    names.forEach((value: string) => {
      this.members.push({ name: value, score: 0 });
    });
    this.loaderService.isLoading.next(true);
    this.http
      .get(
        'https://proxy-server-jum4.onrender.com/api/ipl/feeds/stats/107-mostwickets.js',
        { responseType: 'text' }
      )
      .subscribe((data) => {
        this.bowlersData = this.parseJS(data)?.mostwickets;
        this.bowlersData = this.filterBowlerData(this.bowlersData);
        this.statService.setBowler(this.bowlersData);
        console.log(this.bowlersData);
        this.loaderService.isLoading.next(false);
      });
    this.loaderService.isLoading.next(true);
    this.http
      .get(
        'https://proxy-server-jum4.onrender.com/api/ipl/feeds/stats/107-toprunsscorers.js',
        { responseType: 'text' }
      )
      .subscribe((data) => {
        this.battersData = this.parseJS(data)?.toprunsscorers;
        this.battersData = this.filterBatterData(this.battersData);
        this.statService.setBatsman(this.battersData);
        console.log(this.battersData);
        this.loaderService.isLoading.next(false);
      });
    const interval = setInterval(() => {
      if (this.battersData && this.bowlersData) {
        this.calculateScores();
        clearInterval(interval);
      }
    }, 100);
  }

  parseJS(response: any) {
    const jsonStr = response.match(/\{.*\}/)[0];
    const data = JSON.parse(jsonStr);
    return data;
  }

  filterBowlerData(data: any[]) {
    return data.map((bowler: any) => {
      return { BowlerName: bowler?.BowlerName, Wickets: bowler?.Wickets };
    });
  }

  filterBatterData(data: any[]) {
    return data.map((batter: any) => {
      return { StrikerName: batter?.StrikerName, TotalRuns: batter?.TotalRuns };
    });
  }

  calculateScores() {
    this.members.forEach((mem: members) => {
      let players = masterData[mem.name];
      let points = 0;
      players.forEach((player) => {
        let battingStats = this.battersData.find(
          (bat: any) => bat?.StrikerName === player
        );
        let bowlingStats = this.bowlersData.find(
          (ball: any) => ball?.BowlerName === player
        );
        points += parseInt(battingStats?.TotalRuns)
          ? parseInt(battingStats?.TotalRuns)
          : 0;
        points +=
          parseInt(bowlingStats?.Wickets) * 20
            ? parseInt(bowlingStats?.Wickets) * 20
            : 0;
      });
      mem.score = points;
      if(mem.name === 'Yeshwant') mem.score = mem.score-75;
    });
    this.members.sort((a, b) => b.score - a.score);
    this.statService.setPoints(this.members);
    console.log(this.members);
  }
}

interface members {
  name: string;
  score: number;
}

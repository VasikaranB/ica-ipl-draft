import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  masterData2023,
  masterData2024,
  masterData2025,
} from '../../util/playerslist';
import { StatsService } from '../stats.service';
import { LoaderService } from '../loader.service';
import { ActivatedRoute } from '@angular/router';
import { getId, getMasterData } from 'src/util/app.utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private statService: StatsService,
    private loaderService: LoaderService,
    private route: ActivatedRoute
  ) {}

  battersData: any;
  bowlersData: any;
  members: members[] = [];
  year: string = this.route.snapshot.paramMap.get('year') || '2025';
  masterData = getMasterData(this.year);

  ngOnInit() {
    const yearID = getId(this.year);
    let names = Object.keys(this.masterData);
    names.forEach((value: string) => {
      this.members.push({ name: value, score: 0, allScore: 0 });
    });
    this.loaderService.isLoading.next(true);
    this.http
      .get(
        `https://proxy-server-jum4.onrender.com/api/ipl/feeds/stats/${yearID}-mostwickets.js`,
        { responseType: 'text' }
      )
      .subscribe((data) => {
        this.bowlersData = this.parseJS(data)?.mostwickets;
        this.bowlersData = this.filterBowlerData(this.bowlersData);
        this.statService.setBowler(this.bowlersData);
        // console.log(this.bowlersData);
        this.loaderService.isLoading.next(false);
      });
    this.loaderService.isLoading.next(true);
    this.http
      .get(
        `https://proxy-server-jum4.onrender.com/api/ipl/feeds/stats/${yearID}-toprunsscorers.js`,
        { responseType: 'text' }
      )
      .subscribe((data) => {
        this.battersData = this.parseJS(data)?.toprunsscorers;
        this.battersData = this.filterBatterData(this.battersData);
        this.statService.setBatsman(this.battersData);
        // console.log(this.battersData);
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
      let players = this.masterData[mem.name];
      let points = 0;
      let pointsList: number[] = [];
      players.forEach((player) => {
        let battingStats = this.battersData.find(
          (bat: any) => bat?.StrikerName === player
        );
        let bowlingStats = this.bowlersData.find(
          (ball: any) => ball?.BowlerName === player
        );
        let batPoints = parseInt(battingStats?.TotalRuns)
          ? parseInt(battingStats?.TotalRuns)
          : 0;
        let ballPoints =
          parseInt(bowlingStats?.Wickets) * 25
            ? parseInt(bowlingStats?.Wickets) * 25
            : 0;
        points = points + batPoints + ballPoints;
        pointsList.push(batPoints + ballPoints);
      });
      mem.score = points;
      mem.allScore = points;
      pointsList.sort((a, b) => b - a);
      pointsList.length = 15;
      mem.score = pointsList.reduce((acc, curr) => {
        return acc + curr;
      }, 0);
    });
    this.members.sort((a, b) => b.score - a.score);
    this.statService.setPoints(this.members);
    // console.log(this.members);
  }
}

interface members {
  name: string;
  score: number;
  allScore: number;
}

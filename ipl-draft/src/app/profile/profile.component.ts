import { Component, OnInit } from '@angular/core';
import { masterData2023, masterData2024 } from '../../util/playerslist';
import { StatsService } from '../stats.service';
import { ActivatedRoute, Router } from '@angular/router';
import { getMasterData } from 'src/util/app.utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private statService: StatsService,
    private router: Router
  ) {}
  year = this.route.snapshot.paramMap.get('year') || '2025';
  masterData = getMasterData(this.year);;
  names = Object.keys(this.masterData);
  playerList: string[] = [];
  profilePoints = 0
  profile15Points = 0;
  players :any[] =[];
  profileName ='';

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('name');
    if (id == null) {
      this.router.navigate(['/']);
      id = 'test';
    }
    this.playerList = this.masterData[id];
    let members: any[] = this.statService.getPoints();
    if (!members) {
      this.router.navigate(['/']);
    }
    let member = members.find((mem: any) => id === mem.name)
    this.profilePoints = member.allScore
    this.profileName =  member.name
    this.profile15Points = member.score
    this.masterData[this.profileName].forEach(player => {
      this.players.push({name : player , runsScored: 0, wicketsTaken: 0})
    })
    let battingStats = this.statService.getBatsman()
    let bowlingStats = this.statService.getBowler()
    // console.log(battingStats,bowlingStats)
    this.players.forEach(player =>{     
      let batStat = battingStats.find((bat: any) => bat.StrikerName == player.name)
      player.runsScored = batStat?.TotalRuns ? batStat?.TotalRuns : 0
      let bowlStat = bowlingStats.find((ball: any) => ball.BowlerName == player.name)
      player.wicketsTaken = bowlStat?.Wickets ? bowlStat?.Wickets :0
    })
  }

  playerImage(name: string) {
    return `https://scores.iplt20.com/ipl/playerimages/${name}.png`
  }
}

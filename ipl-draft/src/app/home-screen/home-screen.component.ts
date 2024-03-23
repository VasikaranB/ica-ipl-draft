import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToDashboard(year: number): void {
    this.router.navigate(['/', year, 'dashboard']);
  }

}

import { Component } from '@angular/core';
import { LoaderService } from './loader.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ipl-draft';

  isLoading: boolean = false;

  constructor(private loaderService: LoaderService,private router: Router) {
    this.loaderService.isLoading.subscribe((v) => {
      this.isLoading = v;
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
  }
}

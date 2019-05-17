import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormGroup, FormBuilder } from '@angular/forms';

import { ApiService } from '../service/api.service';
import { Trending } from '../interface/trending';
import { Language } from '../interface/language';
import { Period } from '../interface/period';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  registerForm: any;
  list: Array<Trending> = [];
  isSmallScreen = false;
  languages: Array<Language> = [];
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  period: Array<Period> = [
    { value: 'daily', viewValue: 'Trending today' },
    { value: 'weekly', viewValue: 'Trending this week' },
    { value: 'monthly', viewValue: 'Trending this month' },
  ];

  constructor(private api: ApiService, private breakpointObserver: BreakpointObserver, private fb: FormBuilder) {
    breakpointObserver.observe([
      Breakpoints.Tablet,
      Breakpoints.Handset,
      Breakpoints.TabletPortrait,
      Breakpoints.TabletLandscape,
      Breakpoints.WebPortrait
    ]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      currentLanguage: [''],
      since: ['daily']
    });

    this.onChanges();

    this.getLanguages();
    this.getTrendings();
  }

  public luckyButton(): void {
    const repo = this.list[Math.floor(Math.random() * this.list.length)];
    window.open(repo.attributes.url);
  }

  private onChanges(): void {
    this.registerForm.get('currentLanguage').valueChanges.subscribe(lang => {
      const since = this.registerForm.value.since;

      this.list = [];
      this.getTrendings(lang, since);
    });

    this.registerForm.get('since').valueChanges.subscribe(since => {
      const lang = this.registerForm.value.currentLanguage;

      this.list = [];
      this.getTrendings(lang, since);
    });
  }

  private getLanguages(): void {
    this.api.get('/languages').subscribe((resp) => {
      const data = [{
        name: 'Default',
        data: [{ value: '', viewValue: 'All languages' }]
      }, {
        name: 'Popular',
        data: resp.data.attributes.popular.data.map((d) => {
          return { value: d.attributes.value, viewValue: d.attributes.view_value };
        })
      }, {
        name: 'All',
        data: resp.data.attributes.all.data.map((d) => {
          return { value: d.attributes.value, viewValue: d.attributes.view_value };
        })
      }];
      this.languages = data;
    }, console.log);
  }

  private getTrendings(lang: string = '', since: string = 'daily'): void {
    this.api.get(`/trendings?lang=${encodeURIComponent(lang)}&since=${since}`).subscribe((resp) => {
      this.list = resp.data;
    }, console.log);
  }
}

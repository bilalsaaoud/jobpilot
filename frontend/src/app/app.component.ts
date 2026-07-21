import { Component, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyzerComponent } from './components/analyzer.component';
import { ApplicationsComponent } from './components/applications.component';
import { StatsComponent } from './components/stats.component';
import { JobService } from './job.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AnalyzerComponent, ApplicationsComponent, StatsComponent],
  template: `
  <header>
    <div class="brand">
      <div class="logo">✈</div>
      <div>
        <h1>JobPilot</h1>
        <p>Assistant intelligent de recherche d'alternance</p>
      </div>
    </div>
    <nav>
      <button [class.on]="tab()==='analyze'" (click)="tab.set('analyze')">Analyser</button>
      <button [class.on]="tab()==='apps'" (click)="go('apps')">Mes candidatures</button>
      <button [class.on]="tab()==='stats'" (click)="go('stats')">Statistiques</button>
    </nav>
  </header>

  @if (api.isOffline) {
    <div class="offline">Mode démo hors-ligne — l'analyse tourne dans ton navigateur.
      Lance le backend Spring Boot pour la persistance réelle.</div>
  }

  <main>
    @switch (tab()) {
      @case ('analyze') { <app-analyzer (saved)="onSaved()"></app-analyzer> }
      @case ('apps') { <app-applications #appsCmp></app-applications> }
      @case ('stats') { <app-stats></app-stats> }
    }
  </main>

  <footer>
    <span>Bilal Saaoud · Java · Spring Boot · Angular · Docker</span>
    <a href="https://github.com/bilalsaaoud/jobpilot" target="_blank" rel="noopener">Code source</a>
  </footer>
  `,
  styles: [`
    :host { display:block; max-width:1080px; margin:0 auto; padding:26px 20px 60px; }
    header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:22px; }
    .brand { display:flex; align-items:center; gap:14px; }
    .logo { width:46px; height:46px; border-radius:12px; display:grid; place-content:center; font-size:22px;
      background:linear-gradient(135deg,#6d5efc,#4aa8ff); }
    h1 { margin:0; font-size:22px; letter-spacing:.3px; }
    header p { margin:2px 0 0; color:#9aa3c8; font-size:13px; }
    nav { display:flex; gap:8px; }
    nav button { background:#12162a; border:1px solid #232a45; color:#a9b2d6; padding:9px 16px;
      border-radius:10px; cursor:pointer; font-weight:600; font-size:13.5px; }
    nav button.on { background:linear-gradient(135deg,#6d5efc,#4aa8ff); color:#fff; border-color:transparent; }
    .offline { background:rgba(255,200,90,.1); border:1px solid rgba(255,200,90,.3); color:#ffd27f;
      padding:10px 14px; border-radius:10px; font-size:13px; margin-bottom:18px; }
    footer { margin-top:30px; display:flex; justify-content:space-between; color:#7f88ad; font-size:12.5px; }
    footer a { color:#8a9bff; text-decoration:none; }
  `]
})
export class AppComponent {
  tab = signal<'analyze'|'apps'|'stats'>('analyze');
  @ViewChild('appsCmp') appsCmp?: ApplicationsComponent;
  constructor(public api: JobService) {}
  go(t: 'apps'|'stats') { this.tab.set(t); }
  onSaved() { /* la liste se recharge a l'ouverture de l'onglet */ }
}

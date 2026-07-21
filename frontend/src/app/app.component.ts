import { Component, signal } from '@angular/core';
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
  <header class="fade-up">
    <div class="brand">
      <div class="logo">✈</div>
      <div>
        <h1>Job<span>Pilot</span></h1>
        <p>Assistant intelligent de recherche d'alternance</p>
      </div>
    </div>
    <nav>
      <button [class.on]="tab()==='analyze'" (click)="tab.set('analyze')">Analyser</button>
      <button [class.on]="tab()==='apps'" (click)="tab.set('apps')">Candidatures</button>
      <button [class.on]="tab()==='stats'" (click)="tab.set('stats')">Statistiques</button>
    </nav>
  </header>

  @if (api.isOffline) {
    <div class="offline fade-up">
      <strong>Mode démo</strong> — l'analyse tourne dans ton navigateur. Lance le backend Spring Boot pour la persistance réelle.
    </div>
  }

  <main>
    @switch (tab()) {
      @case ('analyze') { <app-analyzer (saved)="tab.set('apps')"></app-analyzer> }
      @case ('apps') { <app-applications></app-applications> }
      @case ('stats') { <app-stats></app-stats> }
    }
  </main>

  <footer>
    <span>Bilal Saaoud · Java · Spring Boot · Angular · Docker · IA</span>
    <a href="https://github.com/bilalsaaoud/jobpilot" target="_blank" rel="noopener">Code source ↗</a>
  </footer>
  `,
  styles: [`
    :host { display:block; max-width:1120px; margin:0 auto; padding:30px 22px 70px; }
    header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:18px; margin-bottom:26px; }
    .brand { display:flex; align-items:center; gap:15px; }
    .logo { width:50px; height:50px; border-radius:14px; display:grid; place-content:center; font-size:24px; color:#fff;
      background:var(--grad); box-shadow:0 12px 30px -8px rgba(123,92,255,.7); animation:floaty 4s ease-in-out infinite; }
    h1 { margin:0; font-size:24px; letter-spacing:.3px; font-weight:800; }
    h1 span { background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent; }
    header p { margin:3px 0 0; color:var(--muted); font-size:13px; }
    nav { display:flex; gap:8px; background:rgba(9,12,26,.5); padding:6px; border-radius:14px; border:1px solid var(--border); }
    nav button { background:transparent; border:none; color:var(--muted); padding:9px 17px; border-radius:10px;
      cursor:pointer; font-weight:700; font-size:13.5px; transition:.18s; font-family:inherit; }
    nav button:hover { color:#fff; }
    nav button.on { background:var(--grad); color:#fff; box-shadow:0 8px 22px -8px rgba(123,92,255,.6); }
    .offline { background:linear-gradient(135deg, rgba(255,200,90,.12), rgba(255,150,90,.08));
      border:1px solid rgba(255,200,90,.28); color:#ffd894; padding:12px 16px; border-radius:12px; font-size:13px; margin-bottom:20px; }
    .offline strong { color:#ffe6b0; }
    footer { margin-top:34px; padding-top:18px; border-top:1px solid var(--border); display:flex;
      justify-content:space-between; flex-wrap:wrap; gap:10px; color:var(--muted-2); font-size:12.5px; }
    footer a { color:#9fb0ff; text-decoration:none; font-weight:600; }
    footer a:hover { color:#fff; }
  `]
})
export class AppComponent {
  tab = signal<'analyze'|'apps'|'stats'>('analyze');
  constructor(public api: JobService) {}
}

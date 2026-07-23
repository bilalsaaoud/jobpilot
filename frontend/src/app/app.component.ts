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
      <div class="logo"><span>✈</span></div>
      <div>
        <h1>Job<span>Pilot</span> <em>IA</em></h1>
        <p>Ton copilote de recherche d'alternance — analyse, score & lettres en un clic</p>
      </div>
    </div>
    <nav>
      <button [class.on]="tab()==='analyze'" (click)="tab.set('analyze')"><span class="ico">⚡</span> Analyser</button>
      <button [class.on]="tab()==='apps'" (click)="tab.set('apps')"><span class="ico">📋</span> Candidatures</button>
      <button [class.on]="tab()==='stats'" (click)="tab.set('stats')"><span class="ico">📊</span> Statistiques</button>
    </nav>
  </header>

  @if (api.isOffline) {
    <div class="offline fade-up">
      <span class="dot"></span><strong>Mode démo</strong> — tout tourne dans ton navigateur, aucune donnée envoyée.
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
    <span>Conçu par <strong>Bilal Saaoud</strong> · Java · Spring Boot · Angular · Docker · IA</span>
    <a href="https://github.com/bilalsaaoud/jobpilot" target="_blank" rel="noopener">Code source ↗</a>
  </footer>
  `,
  styles: [`
    :host { display:block; max-width:1160px; margin:0 auto; padding:34px 24px 80px; }
    header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px; margin-bottom:28px; }
    .brand { display:flex; align-items:center; gap:16px; }
    .logo { width:56px; height:56px; border-radius:17px; display:grid; place-content:center; position:relative;
      background:var(--grad); box-shadow:0 16px 38px -10px rgba(123,92,255,.75); animation:floaty 4.5s ease-in-out infinite; }
    .logo span { font-size:27px; color:#fff; filter:drop-shadow(0 2px 6px rgba(0,0,0,.3)); }
    .logo::after { content:''; position:absolute; inset:-2px; border-radius:19px; background:var(--grad); filter:blur(16px); opacity:.5; z-index:-1; }
    h1 { margin:0; font-size:27px; font-weight:700; display:flex; align-items:center; gap:9px; }
    h1 span { background:var(--grad-2); -webkit-background-clip:text; background-clip:text; color:transparent; }
    h1 em { font-style:normal; font-size:11px; font-weight:700; letter-spacing:1px; color:#fff; background:var(--grad);
      padding:3px 9px; border-radius:8px; box-shadow:0 6px 16px -6px rgba(123,92,255,.7); }
    header p { margin:5px 0 0; color:var(--muted); font-size:13.5px; max-width:440px; }
    nav { display:flex; gap:6px; background:rgba(8,11,26,.55); padding:6px; border-radius:16px; border:1px solid var(--border);
      backdrop-filter:blur(10px); }
    nav button { background:transparent; border:none; color:var(--muted); padding:10px 16px; border-radius:11px;
      cursor:pointer; font-weight:600; font-size:13.5px; transition:.2s; font-family:inherit; display:flex; align-items:center; gap:6px; }
    nav button .ico { font-size:13px; opacity:.85; }
    nav button:hover { color:#fff; background:rgba(255,255,255,.04); }
    nav button.on { background:var(--grad); color:#fff; box-shadow:0 10px 26px -8px rgba(123,92,255,.65); }
    nav button.on .ico { opacity:1; }
    .offline { display:flex; align-items:center; gap:9px; background:linear-gradient(135deg, rgba(255,200,90,.10), rgba(255,150,90,.06));
      border:1px solid rgba(255,200,90,.26); color:#ffd894; padding:11px 16px; border-radius:13px; font-size:13px; margin-bottom:22px; }
    .offline .dot { width:8px; height:8px; border-radius:50%; background:#ffcf6b; box-shadow:0 0 10px #ffcf6b; }
    .offline strong { color:#ffe6b0; }
    footer { margin-top:38px; padding-top:20px; border-top:1px solid var(--border); display:flex;
      justify-content:space-between; flex-wrap:wrap; gap:10px; color:var(--muted-2); font-size:12.5px; }
    footer strong { color:var(--muted); }
    footer a { color:#9fb0ff; text-decoration:none; font-weight:600; }
    footer a:hover { color:#fff; }
    @media (max-width:620px){ h1 { font-size:23px; } nav { width:100%; } nav button { flex:1; justify-content:center; } }
  `]
})
export class AppComponent {
  tab = signal<'analyze'|'apps'|'stats'>('analyze');
  constructor(public api: JobService) {}
}

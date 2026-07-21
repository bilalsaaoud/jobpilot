import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../job.service';
import { Stats, STATUS_LABELS } from '../models';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
  @if (stats(); as s) {
  <div class="cards">
    <div class="stat pop-in"><span class="n">{{ s.total }}</span><span class="l">Candidatures</span></div>
    <div class="stat pop-in"><span class="n">{{ s.averageScore | number:'1.0-0' }}</span><span class="l">Score moyen</span></div>
    <div class="stat pop-in"><span class="n">{{ s.interviews }}</span><span class="l">Entretiens</span></div>
    <div class="stat pop-in"><span class="n">{{ s.offers }}</span><span class="l">Offres reçues</span></div>
  </div>
  <div class="card fade-up">
    <h3>Répartition par statut</h3>
    <div class="bars">
      @for (row of rows(s); track row.key) {
        <div class="bar-row">
          <span class="bar-label">{{ labelFor(row.key) }}</span>
          <div class="bar-track"><div class="bar-fill" [style.width.%]="row.pct"></div></div>
          <span class="bar-val">{{ row.val }}</span>
        </div>
      }
    </div>
  </div>
  }
  `,
  styles: [`
    .cards { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:18px; }
    @media (max-width:700px){ .cards{ grid-template-columns:repeat(2,1fr); } }
    .stat { background:var(--grad-soft); border:1px solid var(--border-strong); border-radius:16px;
      padding:20px; display:flex; flex-direction:column; gap:6px; transition:transform .15s; }
    .stat:hover { transform:translateY(-3px); }
    .stat .n { font-size:36px; font-weight:800; background:linear-gradient(135deg,#a99bff,#4aa8ff);
      -webkit-background-clip:text; background-clip:text; color:transparent; line-height:1; }
    .stat .l { color:var(--muted); font-size:13px; }
    h3 { margin:0 0 4px; font-size:16px; }
    .bars { display:flex; flex-direction:column; gap:13px; margin-top:12px; }
    .bar-row { display:flex; align-items:center; gap:12px; }
    .bar-label { width:120px; font-size:13px; color:#cdd4f4; }
    .bar-track { flex:1; height:13px; background:rgba(9,12,26,.7); border-radius:8px; overflow:hidden; }
    .bar-fill { height:100%; background:var(--grad); border-radius:8px; animation:grow .7s cubic-bezier(.2,.8,.2,1) both; }
    @keyframes grow { from { width:0 !important; } }
    .bar-val { width:30px; text-align:right; color:var(--muted); font-size:13px; font-weight:700; }
  `]
})
export class StatsComponent implements OnInit {
  stats = signal<Stats | null>(null);
  labels = STATUS_LABELS;
  constructor(private api: JobService) {}
  ngOnInit() { this.api.stats().subscribe(s => this.stats.set(s)); }
  labelFor(key: string): string { return (STATUS_LABELS as Record<string, string>)[key] ?? key; }
  rows(s: Stats) {
    const max = Math.max(1, ...Object.values(s.byStatus));
    return Object.entries(s.byStatus).map(([key, val]) => ({ key, val, pct: (val / max) * 100 }));
  }
}

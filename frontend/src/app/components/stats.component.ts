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
    <div class="stat"><span class="n">{{ s.total }}</span><span class="l">Candidatures</span></div>
    <div class="stat"><span class="n">{{ s.averageScore | number:'1.0-0' }}</span><span class="l">Score moyen</span></div>
    <div class="stat"><span class="n">{{ s.interviews }}</span><span class="l">Entretiens</span></div>
    <div class="stat"><span class="n">{{ s.offers }}</span><span class="l">Offres reçues</span></div>
  </div>
  <div class="card">
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
    .stat { background:linear-gradient(160deg,#171d38,#12162a); border:1px solid #232a45; border-radius:14px;
      padding:20px; display:flex; flex-direction:column; gap:6px; }
    .stat .n { font-size:34px; font-weight:800; background:linear-gradient(135deg,#8a7bff,#4aa8ff);
      -webkit-background-clip:text; background-clip:text; color:transparent; }
    .stat .l { color:#9aa3c8; font-size:13px; }
    .bars { display:flex; flex-direction:column; gap:12px; margin-top:8px; }
    .bar-row { display:flex; align-items:center; gap:12px; }
    .bar-label { width:110px; font-size:13px; color:#c7cef0; }
    .bar-track { flex:1; height:12px; background:#12162a; border-radius:8px; overflow:hidden; }
    .bar-fill { height:100%; background:linear-gradient(90deg,#6d5efc,#4aa8ff); border-radius:8px; }
    .bar-val { width:28px; text-align:right; color:#9aa3c8; font-size:13px; }
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

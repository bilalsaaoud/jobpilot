import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../job.service';
import { JobApplication, ApplicationStatus, STATUS_LABELS } from '../models';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="card fade-up">
    <div class="head">
      <h2>Mes candidatures</h2>
      <select [(ngModel)]="filter" class="filter">
        <option value="">Tous les statuts</option>
        @for (s of statuses; track s) { <option [value]="s">{{ labels[s] }}</option> }
      </select>
    </div>

    @if (visible().length === 0) {
      <p class="muted">Aucune candidature. Analyse une offre et clique « Analyser + suivre ».</p>
    }

    <div class="list">
    @for (a of visible(); track a.id) {
      <div class="item pop-in">
        <div class="left">
          <div class="mini-score" [style.--v]="a.matchScore || 0" [attr.data-v]="a.matchScore"></div>
        </div>
        <div class="body">
          <div class="title-row">
            <strong>{{ a.role || 'Poste' }}</strong>
            <span class="at">· {{ a.company || '—' }}</span>
            @if (a.location) { <span class="loc">📍 {{ a.location }}</span> }
          </div>
          <div class="tags">
            @for (k of a.matchedKeywords.slice(0,6); track k) { <span class="tag ok">{{ k }}</span> }
            @for (k of a.missingKeywords.slice(0,3); track k) { <span class="tag miss">{{ k }}</span> }
          </div>
          @if (a.followUpDate) { <div class="follow">🔔 Relance prévue : {{ a.followUpDate }}</div> }
        </div>
        <div class="right">
          <select [ngModel]="a.status" (ngModelChange)="setStatus(a, $event)" class="status" [attr.data-s]="a.status">
            @for (s of statuses; track s) { <option [value]="s">{{ labels[s] }}</option> }
          </select>
          <button class="del" (click)="remove(a)">Supprimer</button>
        </div>
      </div>
    }
    </div>
  </div>
  `,
  styles: [`
    .head { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; gap:12px; flex-wrap:wrap; }
    .filter, .status { padding:9px 12px; border-radius:10px; background:rgba(9,12,26,.6); color:var(--text);
      border:1px solid var(--border-strong); font-size:13px; font-family:inherit; }
    .list { display:flex; flex-direction:column; gap:12px; }
    .item { display:flex; gap:16px; align-items:flex-start; background:rgba(9,12,26,.45); border:1px solid var(--border);
      border-radius:14px; padding:15px 17px; transition:border-color .2s, transform .12s; }
    .item:hover { border-color:var(--border-strong); transform:translateY(-2px); }
    .mini-score { position:relative; width:54px; height:54px; border-radius:50%; flex-shrink:0;
      display:grid; place-content:center;
      background: conic-gradient(from -90deg, var(--violet), var(--blue) calc(var(--v)*3.6deg), #1c2340 calc(var(--v)*3.6deg)); }
    .mini-score::after { content:attr(data-v); position:absolute; inset:6px; border-radius:50%; background:#0c1024;
      display:grid; place-content:center; font-weight:800; color:#fff; font-size:15px; }
    .body { flex:1; min-width:0; }
    .title-row { display:flex; gap:8px; align-items:baseline; flex-wrap:wrap; margin-bottom:9px; }
    .title-row strong { font-size:15px; }
    .at { color:var(--muted); } .loc { color:var(--muted-2); font-size:12px; }
    .tags { display:flex; flex-wrap:wrap; gap:6px; }
    .tag { padding:3px 10px; border-radius:14px; font-size:11.5px; font-weight:600; }
    .tag.ok { background:rgba(79,227,163,.13); color:var(--green); }
    .tag.miss { background:rgba(255,184,103,.12); color:var(--orange); }
    .follow { margin-top:9px; font-size:12.5px; color:#ffd894; }
    .right { display:flex; flex-direction:column; gap:8px; align-items:flex-end; flex-shrink:0; }
    .del { background:transparent; border:1px solid rgba(255,120,155,.3); color:var(--pink); border-radius:9px;
      padding:6px 12px; cursor:pointer; font-size:12px; font-family:inherit; transition:.15s; }
    .del:hover { background:rgba(255,120,155,.12); }
    .status[data-s="ENTRETIEN"]{ border-color:var(--blue); color:var(--blue); }
    .status[data-s="OFFRE"]{ border-color:var(--green); color:var(--green); }
    .status[data-s="REFUSEE"]{ border-color:var(--pink); color:var(--pink); }
  `]
})
export class ApplicationsComponent implements OnInit {
  apps = signal<JobApplication[]>([]);
  filter = '';
  statuses: ApplicationStatus[] = ['A_ENVOYER','ENVOYEE','RELANCEE','ENTRETIEN','OFFRE','REFUSEE'];
  labels = STATUS_LABELS;

  constructor(private api: JobService) {}
  ngOnInit() { this.reload(); }
  reload() { this.api.list().subscribe(a => this.apps.set(a)); }
  visible() { return this.filter ? this.apps().filter(a => a.status === this.filter) : this.apps(); }
  setStatus(a: JobApplication, s: ApplicationStatus) { this.api.updateStatus(a.id, s).subscribe(() => this.reload()); }
  remove(a: JobApplication) { if (confirm('Supprimer cette candidature ?')) this.api.delete(a.id).subscribe(() => this.reload()); }
}

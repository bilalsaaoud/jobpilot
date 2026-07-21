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
  <div class="card">
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
      <div class="item">
        <div class="left">
          <div class="mini-score" [style.--v]="a.matchScore || 0">{{ a.matchScore }}</div>
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
    .head { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
    .filter, .status { padding:8px 11px; border-radius:9px; background:#12162a; color:#e8ecff; border:1px solid #2a2f45; font-size:13px; }
    .list { display:flex; flex-direction:column; gap:12px; }
    .item { display:flex; gap:16px; align-items:flex-start; background:#0e1224; border:1px solid #232a45;
      border-radius:12px; padding:14px 16px; }
    .mini-score { width:52px; height:52px; border-radius:50%; display:grid; place-content:center; font-weight:800; color:#fff;
      background: radial-gradient(closest-side,#0e1224 76%, transparent 77%),
        conic-gradient(#6d5efc calc(var(--v)*1%), #232a45 0); font-size:16px; }
    .body { flex:1; }
    .title-row { display:flex; gap:8px; align-items:baseline; flex-wrap:wrap; margin-bottom:8px; }
    .at { color:#9aa3c8; } .loc { color:#7f88ad; font-size:12px; }
    .tags { display:flex; flex-wrap:wrap; gap:6px; }
    .tag { padding:3px 9px; border-radius:14px; font-size:11.5px; font-weight:600; }
    .tag.ok { background:rgba(74,220,150,.13); color:#57e0a0; }
    .tag.miss { background:rgba(255,170,80,.12); color:#ffb867; }
    .follow { margin-top:8px; font-size:12.5px; color:#ffd27f; }
    .right { display:flex; flex-direction:column; gap:8px; align-items:flex-end; }
    .del { background:transparent; border:1px solid #3a2030; color:#ff8098; border-radius:8px; padding:6px 12px; cursor:pointer; font-size:12px; }
    .status[data-s="ENTRETIEN"]{ border-color:#4aa8ff; } .status[data-s="OFFRE"]{ border-color:#57e0a0; }
    .status[data-s="REFUSEE"]{ border-color:#ff8098; }
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

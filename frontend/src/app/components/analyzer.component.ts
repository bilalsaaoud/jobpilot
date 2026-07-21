import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../job.service';
import { AnalysisResult, AnalyzeRequest } from '../models';

@Component({
  selector: 'app-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="grid">
    <section class="card">
      <h2>Analyser une offre</h2>
      <p class="muted">Colle le texte d'une annonce. JobPilot calcule ta compatibilité, repère les
        compétences manquantes et rédige ton mot de motivation.</p>
      <div class="row">
        <input [(ngModel)]="req.company" placeholder="Entreprise (ex : JCDecaux)">
        <input [(ngModel)]="req.role" placeholder="Poste (ex : Développeur Java)">
      </div>
      <div class="row">
        <input [(ngModel)]="req.location" placeholder="Lieu (ex : Paris)">
        <input [(ngModel)]="req.sourceUrl" placeholder="Lien de l'offre (optionnel)">
      </div>
      <textarea [(ngModel)]="req.offerText" rows="10"
        placeholder="Colle ici le texte complet de l'offre..."></textarea>
      <div class="actions">
        <button class="primary" (click)="run(false)" [disabled]="loading()">
          {{ loading() ? 'Analyse...' : 'Analyser' }}</button>
        <button class="ghost" (click)="run(true)" [disabled]="loading()">Analyser + suivre</button>
      </div>
    </section>

    @if (result(); as r) {
    <section class="card result">
      <div class="score-head">
        <div class="gauge" [style.--v]="r.matchScore">
          <span>{{ r.matchScore }}</span><small>/100</small>
        </div>
        <div>
          <h3>{{ r.verdict }}</h3>
          <p class="muted">Moteur : {{ r.engine }}</p>
        </div>
      </div>

      <h4>Compétences alignées ({{ r.matchedKeywords.length }})</h4>
      <div class="tags">
        @for (k of r.matchedKeywords; track k) { <span class="tag ok">{{ k }}</span> }
        @if (!r.matchedKeywords.length) { <span class="muted">Aucune détectée</span> }
      </div>

      <h4>À travailler / ajouter ({{ r.missingKeywords.length }})</h4>
      <div class="tags">
        @for (k of r.missingKeywords; track k) { <span class="tag miss">{{ k }}</span> }
        @if (!r.missingKeywords.length) { <span class="muted">Profil parfaitement aligné</span> }
      </div>

      <div class="gen">
        <div class="gen-head"><h4>Mot de motivation généré</h4>
          <button class="mini" (click)="copy(r.coverLetter)">Copier</button></div>
        <pre>{{ r.coverLetter }}</pre>
      </div>
      <div class="gen">
        <div class="gen-head"><h4>Conseils pour adapter ton CV</h4>
          <button class="mini" (click)="copy(r.cvSuggestions)">Copier</button></div>
        <pre>{{ r.cvSuggestions }}</pre>
      </div>
    </section>
    }
  </div>
  `,
  styles: [`
    .grid { display:grid; grid-template-columns: 1fr 1fr; gap:20px; }
    @media (max-width: 900px){ .grid{ grid-template-columns:1fr; } }
    .row { display:flex; gap:10px; margin-bottom:10px; }
    input, textarea { width:100%; padding:11px 13px; border:1px solid #2a2f45; border-radius:10px;
      background:#12162a; color:#e8ecff; font-size:14px; font-family:inherit; }
    textarea { resize:vertical; }
    .actions { display:flex; gap:10px; margin-top:12px; }
    button { cursor:pointer; border:none; border-radius:10px; padding:11px 18px; font-weight:600; font-size:14px; }
    .primary { background:linear-gradient(135deg,#6d5efc,#4aa8ff); color:#fff; }
    .ghost { background:transparent; color:#a9b2d6; border:1px solid #2a2f45; }
    .mini { background:#1b2140; color:#9fb0ff; padding:5px 12px; font-size:12px; }
    .result h4 { margin:16px 0 8px; font-size:14px; color:#c7cef0; }
    .score-head { display:flex; align-items:center; gap:18px; }
    .gauge { width:96px; height:96px; border-radius:50%; display:grid; place-content:center; text-align:center;
      background: radial-gradient(closest-side,#12162a 78%, transparent 79%),
        conic-gradient(#6d5efc calc(var(--v)*1%), #232a45 0); }
    .gauge span { font-size:26px; font-weight:800; color:#fff; }
    .gauge small { color:#8b93b8; }
    .tags { display:flex; flex-wrap:wrap; gap:7px; }
    .tag { padding:5px 11px; border-radius:20px; font-size:12.5px; font-weight:600; }
    .tag.ok { background:rgba(74,220,150,.13); color:#57e0a0; border:1px solid rgba(74,220,150,.3); }
    .tag.miss { background:rgba(255,170,80,.12); color:#ffb867; border:1px solid rgba(255,170,80,.3); }
    .gen { margin-top:16px; }
    .gen-head { display:flex; justify-content:space-between; align-items:center; }
    pre { white-space:pre-wrap; background:#0e1224; border:1px solid #232a45; border-radius:10px;
      padding:14px; font-size:13px; line-height:1.55; color:#d5dbf5; font-family:inherit; }
  `]
})
export class AnalyzerComponent {
  @Output() saved = new EventEmitter<void>();
  req: AnalyzeRequest = { offerText: '' };
  result = signal<AnalysisResult | null>(null);
  loading = signal(false);

  constructor(private api: JobService) {}

  run(save: boolean) {
    if (!this.req.offerText.trim()) { alert("Colle d'abord le texte d'une offre."); return; }
    this.loading.set(true);
    this.api.analyze({ ...this.req, save }).subscribe({
      next: r => { this.result.set(r); this.loading.set(false); if (save) this.saved.emit(); },
      error: () => this.loading.set(false)
    });
  }
  copy(t: string) { navigator.clipboard?.writeText(t); }
}

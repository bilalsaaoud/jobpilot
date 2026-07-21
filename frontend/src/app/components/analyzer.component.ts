import { Component, EventEmitter, Output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../job.service';
import { AnalysisResult, AnalyzeRequest } from '../models';
import { searchCompanies } from '../companies';
import { ROLES, CITIES, searchList } from '../suggest-data';
import { AutocompleteInputComponent, Suggestion } from './autocomplete-input.component';

@Component({
  selector: 'app-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule, AutocompleteInputComponent],
  template: `
  <div class="grid">
    <section class="card fade-up">
      <h2>Analyser une offre</h2>
      <p class="muted">Colle le texte d'une annonce. JobPilot détecte l'entreprise et le poste,
        calcule ta compatibilité et rédige ton mot de motivation.</p>

      <div class="row">
        <app-autocomplete class="cell" label="Entreprise" fieldId="cp" [detected]="detected('company')"
          [value]="req.company || ''" (valueChange)="req.company=$event" [search]="companySearch" (picked)="onCompanyPick($event)"></app-autocomplete>
        <app-autocomplete class="cell" label="Poste" fieldId="rl" [detected]="detected('role')"
          [value]="req.role || ''" (valueChange)="req.role=$event" [search]="roleSearch"></app-autocomplete>
      </div>
      <div class="row">
        <app-autocomplete class="cell" label="Lieu" fieldId="lc" [detected]="detected('location')"
          [value]="req.location || ''" (valueChange)="req.location=$event" [search]="locationSearch"></app-autocomplete>
        <div class="cell field">
          <input [(ngModel)]="req.sourceUrl" placeholder=" " id="su">
          <label for="su">Lien de l'offre (optionnel)</label>
        </div>
      </div>
      <textarea [(ngModel)]="req.offerText" rows="11"
        placeholder="Colle ici le texte complet de l'offre... (l'entreprise, le poste et le lieu seront devinés automatiquement)"></textarea>

      <div class="actions">
        <button class="primary" (click)="run(false)" [disabled]="loading()">
          <span class="ic">⚡</span> {{ loading() ? 'Analyse…' : 'Analyser' }}</button>
        <button class="ghost" (click)="run(true)" [disabled]="loading()">Analyser + suivre</button>
      </div>
      <p class="hint" (click)="fillExample()">Pas d'offre sous la main ? Charger un exemple</p>
    </section>

    @if (result(); as r) {
    <section class="card result pop-in">
      <div class="score-head">
        <div class="gauge" [style.--v]="animScore()">
          <div class="gauge-inner"><span>{{ animScore() }}</span><small>/100</small></div>
        </div>
        <div>
          <div class="verdict" [class.hi]="r.matchScore>=80" [class.mid]="r.matchScore>=60 && r.matchScore<80">
            {{ r.verdict }}</div>
          <p class="muted engine">Moteur : {{ r.engine }}</p>
          @if (detectionChips().length) {
            <div class="detect">
              @for (c of detectionChips(); track c) { <span class="dchip">{{ c }}</span> }
            </div>
          }
        </div>
      </div>

      <h4>Compétences alignées <span class="count">{{ r.matchedKeywords.length }}</span></h4>
      <div class="tags">
        @for (k of r.matchedKeywords; track k) { <span class="tag ok pop-in">{{ k }}</span> }
        @if (!r.matchedKeywords.length) { <span class="muted">Aucune détectée</span> }
      </div>

      <h4>À travailler <span class="count miss">{{ r.missingKeywords.length }}</span></h4>
      <div class="tags">
        @for (k of r.missingKeywords; track k) { <span class="tag miss pop-in">{{ k }}</span> }
        @if (!r.missingKeywords.length) { <span class="muted">Profil parfaitement aligné 🎯</span> }
      </div>

      @if (r.projectIdeas.length) {
      <div class="ideas">
        <h4>💡 Idées de mini-projets pour combler tes lacunes</h4>
        <div class="idea-list">
          @for (p of r.projectIdeas; track p.skill) {
            <div class="idea">
              <span class="idea-skill">{{ p.skill }}</span>
              <p>{{ p.idea }}</p>
            </div>
          }
        </div>
      </div>
      }

      <div class="gen">
        <div class="gen-head"><h4>✍️ Mot de motivation généré</h4>
          <button class="mini" (click)="copy(r.coverLetter, 'cover')">{{ copied()==='cover' ? '✓ Copié' : 'Copier' }}</button></div>
        <pre>{{ r.coverLetter }}</pre>
      </div>
      <div class="gen">
        <div class="gen-head"><h4>🎯 Conseils pour adapter ton CV</h4>
          <button class="mini" (click)="copy(r.cvSuggestions, 'cv')">{{ copied()==='cv' ? '✓ Copié' : 'Copier' }}</button></div>
        <pre>{{ r.cvSuggestions }}</pre>
      </div>
    </section>
    }
  </div>
  `,
  styles: [`
    .grid { display:grid; grid-template-columns: 1fr 1fr; gap:20px; align-items:start; }
    @media (max-width: 940px){ .grid{ grid-template-columns:1fr; } }
    .row { display:flex; gap:12px; margin-bottom:12px; }
    @media (max-width: 520px){ .row{ flex-direction:column; } }
    .cell { flex:1; min-width:0; }
    .field { position:relative; }
    .field input { width:100%; padding:15px 13px 7px; border:1px solid var(--border-strong); border-radius:11px;
      background:rgba(9,12,26,.6); color:var(--text); font-size:14px; font-family:inherit; transition:border-color .2s, box-shadow .2s; }
    .field label { position:absolute; left:13px; top:12px; color:var(--muted-2); font-size:13px; pointer-events:none; transition:.16s ease; }
    .field input:focus { outline:none; border-color:var(--blue); box-shadow:0 0 0 3px rgba(74,168,255,.15); }
    .field input:focus + label, .field input:not(:placeholder-shown) + label { top:4px; font-size:10.5px; color:var(--blue); }
    textarea { width:100%; padding:13px; border:1px solid var(--border-strong); border-radius:12px;
      background:rgba(9,12,26,.6); color:var(--text); font-size:14px; font-family:inherit; resize:vertical; transition:border-color .2s, box-shadow .2s; }
    textarea:focus { outline:none; border-color:var(--blue); box-shadow:0 0 0 3px rgba(74,168,255,.13); }
    .actions { display:flex; gap:11px; margin-top:14px; }
    button { cursor:pointer; border:none; border-radius:12px; padding:12px 20px; font-weight:700; font-size:14px;
      transition:transform .12s, box-shadow .2s, opacity .2s; font-family:inherit; }
    button:active { transform:translateY(1px) scale(.99); }
    .primary { background:var(--grad); color:#fff; box-shadow:0 10px 30px -10px rgba(123,92,255,.7); }
    .primary:hover { box-shadow:0 14px 36px -8px rgba(123,92,255,.85); }
    .primary .ic { margin-right:2px; }
    .ghost { background:rgba(255,255,255,.04); color:var(--muted); border:1px solid var(--border-strong); }
    .ghost:hover { color:#fff; border-color:var(--blue); }
    button:disabled { opacity:.6; cursor:default; }
    .hint { margin:12px 0 0; font-size:12.5px; color:var(--blue); cursor:pointer; width:fit-content; }
    .hint:hover { text-decoration:underline; }
    .result h4 { margin:20px 0 9px; font-size:14px; color:#cdd4f4; display:flex; align-items:center; gap:8px; }
    .count { background:rgba(79,227,163,.16); color:var(--green); border-radius:20px; padding:1px 9px; font-size:12px; }
    .count.miss { background:rgba(255,184,103,.14); color:var(--orange); }
    .score-head { display:flex; align-items:center; gap:20px; }
    .gauge { width:104px; height:104px; border-radius:50%; display:grid; place-content:center; flex-shrink:0;
      background: conic-gradient(from -90deg, var(--violet) 0, var(--blue) calc(var(--v)*3.6deg), #222a49 calc(var(--v)*3.6deg)); transition: background .1s linear; }
    .gauge-inner { width:82px; height:82px; border-radius:50%; background:#0c1024; display:grid; place-content:center; text-align:center; }
    .gauge span { font-size:29px; font-weight:800; color:#fff; }
    .gauge small { color:var(--muted-2); font-size:11px; }
    .verdict { font-size:15px; font-weight:700; color:#cfd6f7; }
    .verdict.hi { color:var(--green); } .verdict.mid { color:var(--blue); }
    .engine { margin:4px 0 0; font-size:11.5px; }
    .detect { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
    .dchip { background:var(--grad-soft); border:1px solid var(--border-strong); color:#c9d2ff; padding:3px 10px; border-radius:16px; font-size:11.5px; }
    .tags { display:flex; flex-wrap:wrap; gap:7px; }
    .tag { padding:5px 12px; border-radius:20px; font-size:12.5px; font-weight:600; }
    .tag.ok { background:rgba(79,227,163,.13); color:var(--green); border:1px solid rgba(79,227,163,.3); }
    .tag.miss { background:rgba(255,184,103,.12); color:var(--orange); border:1px solid rgba(255,184,103,.3); }
    .ideas { margin-top:14px; }
    .idea-list { display:flex; flex-direction:column; gap:10px; }
    .idea { background:var(--grad-soft); border:1px solid var(--border-strong); border-radius:12px; padding:12px 14px; }
    .idea-skill { display:inline-block; background:var(--grad); color:#fff; font-size:11px; font-weight:700; padding:2px 10px; border-radius:14px; margin-bottom:6px; text-transform:capitalize; }
    .idea p { margin:0; font-size:13px; line-height:1.55; color:#d7ddf7; }
    .gen { margin-top:18px; }
    .gen-head { display:flex; justify-content:space-between; align-items:center; }
    .mini { background:rgba(123,92,255,.16); color:#b7b0ff; padding:6px 13px; font-size:12px; }
    .mini:hover { background:rgba(123,92,255,.28); }
    pre { white-space:pre-wrap; background:rgba(9,12,26,.7); border:1px solid var(--border); border-radius:12px;
      padding:15px; font-size:13px; line-height:1.6; color:#dfe4fa; font-family:inherit; margin:8px 0 0; }
  `]
})
export class AnalyzerComponent {
  @Output() saved = new EventEmitter<void>();
  req: AnalyzeRequest = { offerText: '' };
  result = signal<AnalysisResult | null>(null);
  loading = signal(false);
  animScore = signal(0);
  copied = signal<string>('');

  // fonctions de recherche (arrow = 'this' correctement lié)
  companySearch = (q: string): Suggestion[] =>
    searchCompanies(q).map(c => ({ label: c.name, meta: `${c.sector} · ${c.city}`, data: c }));
  roleSearch = (q: string): Suggestion[] => searchList(ROLES, q).map(x => ({ label: x }));
  locationSearch = (q: string): Suggestion[] => searchList(CITIES, q).map(x => ({ label: x }));

  constructor(private api: JobService) {
    effect(() => {
      const r = this.result();
      if (!r) return;
      const target = r.matchScore; let cur = 0;
      const step = () => { cur += Math.max(1, Math.ceil((target - cur) / 6));
        if (cur >= target) { this.animScore.set(target); return; }
        this.animScore.set(cur); requestAnimationFrame(step); };
      this.animScore.set(0); requestAnimationFrame(step);
    });
  }

  onCompanyPick(s: Suggestion) {
    if (!this.req.location && s.data?.city) this.req.location = s.data.city;
  }

  detected(field: 'company'|'role'|'location') {
    const r = this.result(); if (!r) return false;
    const map: any = { company: r.detectedCompany, role: r.detectedRole, location: r.detectedLocation };
    return !!map[field];
  }
  detectionChips(): string[] {
    const r = this.result(); if (!r) return [];
    return [r.detectedCompany, r.detectedRole, r.detectedLocation, r.detectedContract].filter(Boolean) as string[];
  }

  run(save: boolean) {
    if (!this.req.offerText.trim()) { alert("Colle d'abord le texte d'une offre."); return; }
    this.loading.set(true);
    this.api.analyze({ ...this.req, save }).subscribe({
      next: r => {
        this.result.set(r); this.loading.set(false);
        if (!this.req.company && r.detectedCompany) this.req.company = r.detectedCompany;
        if (!this.req.role && r.detectedRole) this.req.role = r.detectedRole;
        if (!this.req.location && r.detectedLocation) this.req.location = r.detectedLocation;
        if (!this.req.contractType && r.detectedContract) this.req.contractType = r.detectedContract;
        if (save) this.saved.emit();
      },
      error: () => this.loading.set(false)
    });
  }
  copy(t: string, which: string) { navigator.clipboard?.writeText(t); this.copied.set(which);
    setTimeout(() => this.copied.set(''), 1500); }
  fillExample() {
    this.req = { offerText:
      "Alternance Développeur Java/Angular F/H chez JCDecaux à Neuilly-sur-Seine. Au sein de la DSI, " +
      "vous développez des applications en Java 17 et 21, Spring Boot 3, JPA/Hibernate, PostgreSQL, Kafka, " +
      "API REST, tests JUnit et Cucumber. CI/CD avec Maven, Jenkins, Sonar, Docker, Kubernetes, AWS. " +
      "Front-end Angular 19. Méthodes Agile, Jira, Confluence." };
  }
}

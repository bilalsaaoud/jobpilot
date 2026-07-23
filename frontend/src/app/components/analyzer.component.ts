import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../job.service';
import { AnalysisResult, AnalyzeRequest } from '../models';
import { searchCompanies } from '../companies';
import { CITIES, searchList } from '../suggest-data';
import { DOMAINS, getDomain } from '../domains';
import { extractTextFromFile, detectSkillsFromText, cvInsights, CvInsights } from '../cv-parser';
import { AutocompleteInputComponent, Suggestion } from './autocomplete-input.component';

@Component({
  selector: 'app-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule, AutocompleteInputComponent],
  template: `
  <div class="grid">
    <section class="card fade-up">
      <h2>Analyser une offre</h2>
      <p class="muted">Choisis ton domaine, colle une annonce : JobPilot détecte l'entreprise et le poste,
        calcule ta compatibilité et rédige ton mot de motivation. Fonctionne pour tous les métiers.</p>

      <div class="step-label"><span class="num">1</span> Ton profil</div>
      <div class="domains">
        @for (d of domains; track d.id) {
          <button class="dom" [class.on]="domain()===d.id" (click)="setDomain(d.id)">
            <span class="e">{{ d.emoji }}</span> {{ d.label }}</button>
        }
      </div>

      <div class="skills-box">
        <div class="sk-head">
          <span>Mes compétences <small>({{ userSkills().length }})</small></span>
          <div class="sk-actions">
            <button class="cv-btn" (click)="cvInput.click()" [disabled]="cvLoading()">
              {{ cvLoading() ? '⏳ Lecture…' : '📄 Déposer mon CV' }}</button>
            <button class="reset" (click)="resetSkills()">Réinitialiser</button>
          </div>
          <input #cvInput type="file" accept=".pdf,.txt" hidden (change)="onCvUpload($event)">
        </div>
        @if (cvMsg()) { <div class="cv-msg">{{ cvMsg() }}</div> }
        <div class="sk-tags">
          @for (s of userSkills(); track s) {
            <span class="sk">{{ s }} <b (click)="removeSkill(s)">×</b></span>
          }
          @if (!userSkills().length) { <span class="muted">Ajoute tes compétences pour un score personnalisé ↓</span> }
        </div>
        <app-autocomplete label="Ajouter une compétence" fieldId="sk" [value]="skillDraft"
          [search]="skillSearch" [emitEnter]="true"
          (valueChange)="skillDraft=$event" (picked)="addSkill($event.label)" (submitted)="addSkill($event)"></app-autocomplete>
      </div>

      @if (cvReport(); as cv) {
      <section class="cv-report card pop-in">
        <div class="cvr-head">
          <div class="cvr-ring" [style.--v]="cv.coverage">
            <div class="cvr-ring-in"><span>{{ cv.coverage }}<small>%</small></span><em>couvert</em></div>
          </div>
          <div class="cvr-head-txt">
            <h3>Avis sur ton CV <span class="dom">{{ cv.domainLabel }}</span></h3>
            <p class="verdict-cv">{{ cv.verdict }}</p>
            <div class="cvr-mini">
              <span class="mini ok">✅ {{ cv.strengths.length }} atouts</span>
              <span class="mini miss">📈 {{ cv.gaps.length }} à renforcer</span>
            </div>
          </div>
        </div>

        <h4 class="cvr-h">💪 Tes points forts</h4>
        <div class="tags">
          @for (s of cv.strengths; track s) { <span class="tag ok pop-in">{{ s }}</span> }
        </div>

        @if (cv.gaps.length) {
          <h4 class="cvr-h">📈 À renforcer pour ce métier</h4>
          <div class="tags">
            @for (g of cv.gaps; track g) { <span class="tag miss pop-in">{{ g }}</span> }
          </div>
        }

        @if (cv.ideas.length) {
          <h4 class="cvr-h">🚀 Ta feuille de route projets</h4>
          <div class="roadmap">
            @for (p of cv.ideas; track p.skill; let i = $index) {
              <div class="rm-step pop-in" [style.animation-delay.ms]="i*90">
                <div class="rm-node">{{ i + 1 }}</div>
                <div class="rm-card">
                  <div class="rm-top"><span class="rm-skill">{{ p.skill }}</span><span class="rm-badge">Projet suggéré</span></div>
                  <p>{{ p.idea }}</p>
                </div>
              </div>
            }
          </div>
        }
        <p class="cv-hint">👉 Colle une offre ci-dessous pour une analyse ciblée sur un poste précis.</p>
      </section>
      }

      <div class="step-label"><span class="num">2</span> L'offre à analyser</div>
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
        <h4>🚀 Feuille de route — projets pour combler tes lacunes</h4>
        <div class="roadmap">
          @for (p of r.projectIdeas; track p.skill; let i = $index) {
            <div class="rm-step pop-in" [style.animation-delay.ms]="i*90">
              <div class="rm-node">{{ i + 1 }}</div>
              <div class="rm-card">
                <div class="rm-top"><span class="rm-skill">{{ p.skill }}</span><span class="rm-badge">Projet suggéré</span></div>
                <p>{{ p.idea }}</p>
              </div>
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
    .step-label { display:flex; align-items:center; gap:9px; font-family:'Space Grotesk',sans-serif; font-weight:600;
      font-size:13px; letter-spacing:.5px; text-transform:uppercase; color:#aeb8e0; margin:20px 0 12px; }
    .step-label .num { width:22px; height:22px; border-radius:7px; display:grid; place-content:center; font-size:12px;
      color:#fff; background:var(--grad); box-shadow:0 6px 14px -6px rgba(123,92,255,.7); }
    .step-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,var(--border-strong),transparent); }
    .row { display:flex; gap:12px; margin-bottom:12px; }
    @media (max-width: 520px){ .row{ flex-direction:column; } }
    .cell { flex:1; min-width:0; }
    .domains { display:flex; flex-wrap:wrap; gap:7px; margin:14px 0 16px; }
    .dom { background:rgba(9,12,26,.5); border:1px solid var(--border-strong); color:var(--muted);
      padding:7px 12px; border-radius:20px; cursor:pointer; font-size:12.5px; font-weight:600; font-family:inherit; transition:.15s; }
    .dom:hover { color:#fff; border-color:var(--blue); }
    .dom.on { background:var(--grad); color:#fff; border-color:transparent; box-shadow:0 8px 20px -8px rgba(123,92,255,.6); }
    .dom .e { margin-right:2px; }
    .skills-box { background:rgba(9,12,26,.4); border:1px solid var(--border); border-radius:14px; padding:14px; margin-bottom:16px; }
    .sk-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-size:13px; color:#cdd4f4; font-weight:600; }
    .sk-head small { color:var(--muted-2); font-weight:400; }
    .sk-actions { display:flex; gap:8px; align-items:center; }
    .reset { background:transparent; border:1px solid var(--border-strong); color:var(--muted); border-radius:8px;
      padding:4px 10px; font-size:11.5px; cursor:pointer; font-family:inherit; }
    .reset:hover { color:#fff; }
    .cv-btn { background:var(--grad); color:#fff; border:none; border-radius:8px; padding:5px 12px;
      font-size:11.5px; font-weight:700; cursor:pointer; font-family:inherit; box-shadow:0 6px 16px -8px rgba(123,92,255,.7); }
    .cv-btn:hover { filter:brightness(1.08); }
    .cv-btn:disabled { opacity:.6; cursor:default; }
    .cv-msg { background:var(--grad-soft); border:1px solid var(--border-strong); color:#c9d2ff;
      border-radius:10px; padding:8px 12px; font-size:12.5px; margin-bottom:10px; }
    .cv-report { margin-bottom:16px; background:linear-gradient(165deg, rgba(30,26,66,.6), rgba(16,21,42,.5)); }
    .cvr-head { display:flex; align-items:center; gap:18px; margin-bottom:6px; }
    .cvr-ring { width:92px; height:92px; border-radius:50%; flex-shrink:0; display:grid; place-content:center; position:relative;
      background: conic-gradient(from -90deg, var(--violet) 0, var(--blue) calc(var(--v)*3.6deg), rgba(255,255,255,.07) calc(var(--v)*3.6deg));
      animation:glowRing 3s ease-in-out infinite; }
    @keyframes glowRing { 0%,100%{ filter:drop-shadow(0 0 6px rgba(123,92,255,.4)); } 50%{ filter:drop-shadow(0 0 16px rgba(74,168,255,.6)); } }
    .cvr-ring-in { width:72px; height:72px; border-radius:50%; background:#0b0f22; display:grid; place-content:center; text-align:center; }
    .cvr-ring-in span { font-family:'Space Grotesk',sans-serif; font-size:22px; font-weight:700; color:#fff; }
    .cvr-ring-in span small { font-size:12px; color:var(--muted); }
    .cvr-ring-in em { font-style:normal; font-size:9.5px; letter-spacing:1px; text-transform:uppercase; color:var(--muted-2); }
    .cvr-head-txt h3 { margin:0 0 4px; font-size:17px; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
    .cvr-head-txt .dom { background:var(--grad); color:#fff; font-size:11px; font-weight:700; padding:2px 10px; border-radius:14px; }
    .verdict-cv { margin:0 0 8px; font-size:13px; color:var(--blue); font-weight:600; }
    .cvr-mini { display:flex; gap:8px; flex-wrap:wrap; }
    .cvr-mini .mini { font-size:11.5px; font-weight:600; padding:3px 10px; border-radius:20px; }
    .cvr-mini .ok { background:rgba(79,227,163,.14); color:var(--green); }
    .cvr-mini .miss { background:rgba(255,184,103,.14); color:var(--orange); }
    .cvr-h { margin:18px 0 10px; font-size:13.5px; color:#cdd4f4; font-family:'Space Grotesk',sans-serif; }
    .cv-hint { margin:16px 0 0; font-size:12.5px; color:var(--muted); padding-top:12px; border-top:1px dashed var(--border); }

    /* Roadmap / feuille de route projets */
    .roadmap { display:flex; flex-direction:column; gap:12px; position:relative; padding-left:6px; }
    .rm-step { display:flex; gap:14px; position:relative; }
    .rm-step:not(:last-child)::before { content:''; position:absolute; left:15px; top:34px; bottom:-14px; width:2px;
      background:linear-gradient(var(--violet), rgba(74,168,255,.25)); }
    .rm-node { width:32px; height:32px; border-radius:50%; flex-shrink:0; display:grid; place-content:center;
      font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:14px; color:#fff; background:var(--grad); z-index:1;
      box-shadow:0 8px 20px -8px rgba(123,92,255,.8); }
    .rm-card { flex:1; background:rgba(9,12,26,.6); border:1px solid var(--border-strong); border-radius:14px;
      padding:13px 15px; transition:transform .15s, border-color .2s; position:relative; overflow:hidden; }
    .rm-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--grad); }
    .rm-card:hover { transform:translateX(3px); border-color:var(--violet); }
    .rm-top { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:7px; flex-wrap:wrap; }
    .rm-skill { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:13.5px; color:#fff; text-transform:capitalize;
      background:var(--grad-soft); border:1px solid var(--border-strong); padding:3px 11px; border-radius:16px; }
    .rm-badge { font-size:10px; font-weight:700; letter-spacing:.4px; text-transform:uppercase; color:#b7b0ff;
      background:rgba(139,123,255,.14); padding:3px 9px; border-radius:12px; }
    .rm-card p { margin:0; font-size:12.8px; line-height:1.55; color:#d7ddf7; }
    .sk-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; }
    .sk { background:rgba(79,227,163,.13); color:var(--green); border:1px solid rgba(79,227,163,.3);
      padding:4px 10px; border-radius:16px; font-size:12px; font-weight:600; text-transform:capitalize; }
    .sk b { cursor:pointer; color:#8fe9c0; margin-left:3px; font-weight:800; }
    .sk b:hover { color:#fff; }
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

  domains = DOMAINS;
  domain = signal<string>('informatique');
  userSkills = signal<string[]>(getDomain('informatique').profileSkills);
  skillDraft = '';
  cvLoading = signal(false);
  cvMsg = signal<string>('');
  cvReport = signal<CvInsights | null>(null);

  // fonctions de recherche (arrow = 'this' correctement lié)
  companySearch = (q: string): Suggestion[] =>
    searchCompanies(q).map(c => ({ label: c.name, meta: `${c.sector} · ${c.city}`, data: c }));
  roleSearch = (q: string): Suggestion[] =>
    searchList(getDomain(this.domain()).roles, q).map(x => ({ label: x }));
  locationSearch = (q: string): Suggestion[] => searchList(CITIES, q).map(x => ({ label: x }));
  skillSearch = (q: string): Suggestion[] => {
    const have = new Set(this.userSkills().map(s => s.toLowerCase()));
    return searchList(getDomain(this.domain()).skills.filter(s => !have.has(s.toLowerCase())), q)
      .map(x => ({ label: x }));
  };

  setDomain(id: string) {
    this.domain.set(id);
    this.userSkills.set([...getDomain(id).profileSkills]);
    this.req.role = '';
  }
  resetSkills() { this.userSkills.set([...getDomain(this.domain()).profileSkills]); this.cvMsg.set(''); this.cvReport.set(null); }

  async onCvUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.cvLoading.set(true); this.cvMsg.set('');
    try {
      const text = await extractTextFromFile(file);
      const res = detectSkillsFromText(text);
      if (!res.skills.length) {
        this.cvMsg.set("Aucune compétence reconnue dans ce CV. Ajoute-les à la main ou vérifie le fichier.");
      } else {
        this.domain.set(res.domain);
        this.userSkills.set(res.skills);
        const label = getDomain(res.domain).label;
        this.cvMsg.set(`✨ ${res.skills.length} compétences détectées et remplies depuis ton CV (domaine : ${label}).`);
        this.cvReport.set(cvInsights(res.domain, res.skills));
      }
    } catch {
      this.cvMsg.set("Impossible de lire ce fichier. Essaie un PDF avec du texte sélectionnable, ou un .txt.");
    } finally {
      this.cvLoading.set(false);
      input.value = '';
    }
  }
  addSkill(s: string) {
    const v = s.trim(); if (!v) return;
    if (!this.userSkills().some(x => x.toLowerCase() === v.toLowerCase()))
      this.userSkills.set([...this.userSkills(), v]);
    this.skillDraft = '';
  }
  removeSkill(s: string) { this.userSkills.set(this.userSkills().filter(x => x !== s)); }

  constructor(private api: JobService) {}

  private animateScore(target: number) {
    let cur = 0; this.animScore.set(0);
    const id = setInterval(() => {
      cur += Math.max(1, Math.ceil((target - cur) / 6));
      if (cur >= target) { this.animScore.set(target); clearInterval(id); }
      else this.animScore.set(cur);
    }, 28);
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
    this.api.analyze({ ...this.req, save, domain: this.domain(), userSkills: this.userSkills() }).subscribe({
      next: r => {
        this.result.set(r); this.loading.set(false); this.animateScore(r.matchScore);
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

import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Suggestion { label: string; meta?: string; data?: any; }

/**
 * Champ de saisie réutilisable avec autocomplétion :
 * label flottant, liste déroulante instantanée, navigation clavier (↑ ↓ Entrée Échap).
 */
@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="ac">
    <input [ngModel]="value" (ngModelChange)="onType($event)" (keydown)="onKey($event)"
           (focus)="onType(value)" (blur)="closeSoon()"
           placeholder=" " [id]="fieldId" autocomplete="off">
    <label [attr.for]="fieldId">{{ label }} @if (detected) { <span class="auto">✨ détecté</span> }</label>
    @if (open() && items().length) {
      <ul class="suggest">
        @for (s of items(); track s.label; let i = $index) {
          <li [class.active]="i===idx()" (mousedown)="pick(s)" (mouseenter)="idx.set(i)">
            <span class="s-name">{{ s.label }}</span>
            @if (s.meta) { <span class="s-meta">{{ s.meta }}</span> }
          </li>
        }
      </ul>
    }
  </div>
  `,
  styles: [`
    .ac { position:relative; }
    input { width:100%; padding:15px 13px 7px; border:1px solid var(--border-strong); border-radius:11px;
      background:rgba(9,12,26,.6); color:var(--text); font-size:14px; font-family:inherit; transition:border-color .2s, box-shadow .2s; }
    input:focus { outline:none; border-color:var(--blue); box-shadow:0 0 0 3px rgba(74,168,255,.15); }
    label { position:absolute; left:13px; top:12px; color:var(--muted-2); font-size:13px; pointer-events:none; transition:.16s ease; }
    input:focus + label, input:not(:placeholder-shown) + label { top:4px; font-size:10.5px; color:var(--blue); }
    .auto { color:var(--violet); font-weight:700; }
    .suggest { position:absolute; z-index:20; top:calc(100% + 4px); left:0; right:0; margin:0; padding:5px;
      list-style:none; background:#0f1430; border:1px solid var(--border-strong); border-radius:12px;
      box-shadow:0 22px 50px -18px rgba(0,0,0,.85); max-height:260px; overflow:auto; animation:popIn .16s ease both; }
    .suggest li { display:flex; flex-direction:column; gap:1px; padding:8px 11px; border-radius:8px; cursor:pointer; }
    .suggest li.active { background:var(--grad-soft); }
    .s-name { font-size:13.5px; font-weight:600; color:#eaf0ff; }
    .s-meta { font-size:11px; color:var(--muted-2); }
  `]
})
export class AutocompleteInputComponent {
  @Input() label = '';
  @Input() fieldId = 'ac';
  @Input() value = '';
  @Input() detected = false;
  /** Fonction de recherche fournie par le parent. */
  @Input() search: (q: string) => Suggestion[] = () => [];
  /** Si true, appuyer sur Entrée sans sélection émet (submitted) et vide le champ (mode tags). */
  @Input() emitEnter = false;
  @Output() valueChange = new EventEmitter<string>();
  @Output() picked = new EventEmitter<Suggestion>();
  @Output() submitted = new EventEmitter<string>();

  items = signal<Suggestion[]>([]);
  open = signal(false);
  idx = signal(-1);

  onType(v: string) {
    this.value = v;
    this.valueChange.emit(v);
    this.items.set(this.search(v));
    this.open.set(true);
    this.idx.set(-1);
  }
  onKey(e: KeyboardEvent) {
    const list = this.items();
    if (e.key === 'Enter') {
      if (this.open() && this.idx() >= 0 && list.length) { e.preventDefault(); this.pick(list[this.idx()]); return; }
      if (this.emitEnter && this.value.trim()) { e.preventDefault(); this.submitted.emit(this.value.trim());
        this.value = ''; this.valueChange.emit(''); this.items.set([]); this.open.set(false); return; }
    }
    if (!this.open() || !list.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); this.idx.set((this.idx() + 1) % list.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.idx.set((this.idx() - 1 + list.length) % list.length); }
    else if (e.key === 'Escape') { this.open.set(false); }
  }
  pick(s: Suggestion) {
    this.value = s.label;
    this.valueChange.emit(s.label);
    this.picked.emit(s);
    this.open.set(false);
    this.items.set([]);
  }
  closeSoon() { setTimeout(() => this.open.set(false), 150); }
}

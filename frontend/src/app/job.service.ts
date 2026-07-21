import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AnalysisResult, AnalyzeRequest, JobApplication, Stats, ApplicationStatus } from './models';
import { mockAnalyze, mockApplications } from './mock-engine';

/**
 * Service API. Tente le backend Spring Boot ; si indisponible (ex : demo GitHub Pages),
 * bascule automatiquement sur un moteur local -> l'appli reste 100% fonctionnelle hors-ligne.
 */
@Injectable({ providedIn: 'root' })
export class JobService {
  /** Surcharge possible via window.__API_BASE__ ; sinon backend local. */
  private base = (window as any).__API_BASE__ ?? '/api';
  private offline = false;
  private mockStore: JobApplication[] = mockApplications();
  private seq = 100;

  constructor(private http: HttpClient) {}

  get isOffline() { return this.offline; }

  analyze(req: AnalyzeRequest): Observable<AnalysisResult> {
    return this.http.post<AnalysisResult>(`${this.base}/analyze`, req).pipe(
      catchError(() => {
        this.offline = true;
        const r = mockAnalyze(req);
        if (req.save) {
          const app: JobApplication = { id: ++this.seq, company: req.company, role: req.role,
            location: req.location, contractType: req.contractType, offerText: req.offerText,
            status: 'A_ENVOYER', matchScore: r.matchScore, matchedKeywords: r.matchedKeywords,
            missingKeywords: r.missingKeywords, coverLetter: r.coverLetter,
            cvSuggestions: r.cvSuggestions, createdAt: new Date().toISOString() };
          this.mockStore.unshift(app);
          r.id = app.id;
        }
        return of(r);
      })
    );
  }

  list(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.base}/applications`).pipe(
      catchError(() => { this.offline = true; return of(this.sortedMock()); })
    );
  }

  updateStatus(id: number, status: ApplicationStatus, followUpDate?: string, notes?: string): Observable<JobApplication> {
    return this.http.patch<JobApplication>(`${this.base}/applications/${id}`, { status, followUpDate, notes }).pipe(
      catchError(() => {
        const a = this.mockStore.find(x => x.id === id)!;
        a.status = status; if (followUpDate) a.followUpDate = followUpDate; if (notes) a.notes = notes;
        this.offline = true; return of(a);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/applications/${id}`).pipe(
      catchError(() => { this.mockStore = this.mockStore.filter(x => x.id !== id); this.offline = true; return of(void 0); })
    );
  }

  stats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.base}/applications/stats`).pipe(
      catchError(() => { this.offline = true; return of(this.mockStats()); })
    );
  }

  private sortedMock(): JobApplication[] {
    return [...this.mockStore].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  }
  private mockStats(): Stats {
    const all = this.mockStore;
    const byStatus: Record<string, number> = {};
    all.forEach(a => byStatus[a.status] = (byStatus[a.status] ?? 0) + 1);
    const avg = all.length ? all.reduce((s, a) => s + (a.matchScore ?? 0), 0) / all.length : 0;
    return { total: all.length, averageScore: avg,
      interviews: all.filter(a => a.status === 'ENTRETIEN').length,
      offers: all.filter(a => a.status === 'OFFRE').length, byStatus };
  }
}

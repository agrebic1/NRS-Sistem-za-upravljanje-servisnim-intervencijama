'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import type { Notifikacija } from '@/domain/types/servisirane';

const POLL_INTERVAL_MS = 30_000;

const TIP_IKONA: Record<string, string> = {
  dodjela_intervencije:  '📋',
  prihvatanje_zadatka:   '✅',
  odbijanje_zadatka:     '❌',
  promjena_statusa:      '🔄',
  evidencija_rada:       '🔧',
  zavrsetak_intervencije:'🏁',
  zatvaranje_intervencije:'🔒',
  promjena_termina:      '📅',
  uklanjanje_servisera:  '👤',
  tim_dodjela:           '👥',
};

function fmtVrijeme(iso: string): string {
  const d     = new Date(iso);
  const danas = new Date();
  const razlika = Math.floor((danas.getTime() - d.getTime()) / 60_000);
  if (razlika < 1)  return 'Upravo sada';
  if (razlika < 60) return `Prije ${razlika} min`;
  const sati = Math.floor(razlika / 60);
  if (sati < 24) return `Prije ${sati}h`;
  return d.toLocaleDateString('bs-BA', { day: '2-digit', month: '2-digit' });
}

export function NotifikacijeBell({ boja }: { boja?: string }) {
  const [otvoren,       setOtvoren]       = useState(false);
  const [notifikacije,  setNotifikacije]  = useState<Notifikacija[]>([]);
  const [neprocitane,   setNeprocitane]   = useState(0);
  const [ucitava,       setUcitava]       = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const router   = useRouter();

  const fetchNotifikacije = useCallback(async () => {
    try {
      const r = await fetch('/api/notifikacije?limit=20', { cache: 'no-store' });
      if (!r.ok) return;
      const d = await r.json();
      setNotifikacije(d.notifikacije ?? []);
      setNeprocitane(d.neprocitane ?? 0);
    } catch { /* silent */ }
  }, []);

  // Inicijalno učitavanje + polling
  useEffect(() => {
    fetchNotifikacije();
    const timer = setInterval(fetchNotifikacije, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetchNotifikacije]);

  // Zatvori panel na klik izvan
  useEffect(() => {
    if (!otvoren) return;
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOtvoren(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [otvoren]);

  async function označiSveKaoProcitano() {
    setUcitava(true);
    try {
      await fetch('/api/notifikacije', { method: 'PATCH' });
      setNotifikacije((prev) => prev.map((n) => ({ ...n, procitano: true })));
      setNeprocitane(0);
    } finally { setUcitava(false); }
  }

  async function klikNaNotifikaciju(n: Notifikacija) {
    if (!n.procitano) {
      await fetch(`/api/notifikacije/${n.id}`, { method: 'PATCH' });
      setNotifikacije((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, procitano: true } : x))
      );
      setNeprocitane((prev) => Math.max(0, prev - 1));
    }
    setOtvoren(false);
    if (n.zahtjev_id) {
      router.push(`/dispecer/intervencije/${n.zahtjev_id}`);
    }
  }

  const akcentBoja = boja ?? 'var(--first-secondary)';

  return (
    <div ref={panelRef} className="relative">
      {/* Bell dugme */}
      <button
        type="button"
        onClick={() => { setOtvoren((v) => !v); if (!otvoren) fetchNotifikacije(); }}
        className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-black/[0.06]"
        style={{ color: neprocitane > 0 ? akcentBoja : 'var(--first-nonary)' }}
        aria-label="Obavještenja"
      >
        <Bell className="h-4 w-4" />
        {neprocitane > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-black text-white"
            style={{ backgroundColor: '#DC2626' }}
          >
            {neprocitane > 99 ? '99+' : neprocitane}
          </span>
        )}
      </button>

      {/* Panel */}
      {otvoren && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl shadow-xl"
          style={{
            backgroundColor: 'var(--first-tertiary)',
            border:          '1px solid rgb(var(--first-quaternary-rgb)/0.35)',
          }}
        >
          {/* Header panela */}
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={{ borderColor: 'rgb(var(--first-quaternary-rgb)/0.3)' }}
          >
            <div className="flex items-center gap-2">
              <Bell className="h-3.5 w-3.5" style={{ color: akcentBoja }} />
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
                Obavještenja
              </p>
              {neprocitane > 0 && (
                <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                  style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#DC2626' }}>
                  {neprocitane} novo
                </span>
              )}
            </div>
            {neprocitane > 0 && (
              <button
                type="button"
                onClick={označiSveKaoProcitano}
                disabled={ucitava}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold transition hover:bg-black/[0.06] disabled:opacity-50"
                style={{ color: 'var(--first-secondary)' }}
              >
                <CheckCheck className="h-3 w-3" />
                Sve pročitano
              </button>
            )}
          </div>

          {/* Lista notifikacija */}
          <div className="max-h-96 overflow-y-auto">
            {notifikacije.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: 'rgb(var(--first-secondary-rgb)/0.08)' }}>
                  <Bell className="h-5 w-5" style={{ color: 'var(--first-secondary)', opacity: 0.4 }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                  Nema obavještenja
                </p>
                <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                  Novi događaji će se prikazati ovdje
                </p>
              </div>
            ) : (
              notifikacije.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => klikNaNotifikaciju(n)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-black/[0.04]"
                  style={{
                    backgroundColor: !n.procitano
                      ? `rgb(var(--first-secondary-rgb)/0.04)`
                      : 'transparent',
                    borderBottom: '1px solid rgb(var(--first-quaternary-rgb)/0.15)',
                  }}
                >
                  {/* Ikona tipa */}
                  <div className="mt-0.5 flex-shrink-0 text-base leading-none">
                    {TIP_IKONA[n.tip] ?? '🔔'}
                  </div>

                  {/* Sadržaj */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold leading-snug"
                        style={{ color: n.procitano ? 'var(--first-nonary)' : 'var(--first-octonary)' }}>
                        {n.naslov}
                      </p>
                      {!n.procitano && (
                        <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: akcentBoja }} />
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed"
                      style={{ color: 'var(--first-nonary)' }}>
                      {n.poruka}
                    </p>
                    <div className="mt-1 flex items-center gap-1" style={{ color: 'var(--first-quinary)' }}>
                      <Clock className="h-2.5 w-2.5" />
                      <span className="text-[10px]">{fmtVrijeme(n.created_at)}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

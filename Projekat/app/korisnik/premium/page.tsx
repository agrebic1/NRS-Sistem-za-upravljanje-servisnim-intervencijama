'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { formatirajDatumPrikaz, formatirajDatumVrijemeZaPrikaz } from '@/lib/format/datumi';

type PremiumStatus = 'inactive' | 'pending_payment' | 'active' | 'expired' | 'cancelled';
type PlanTip = 'monthly' | 'yearly';

type ProfilResponse = {
  profil?: {
    is_premium: boolean;
    premium_status?: PremiumStatus;
    premium_started_at?: string | null;
    premium_expires_at?: string | null;
    premium_plan?: string | null;
    premium_cancelled_at?: string | null;
    premium_cancel_reason?: string | null;
  };
  error?: string;
};

type PremiumEvent = {
  id: number;
  event_type: string;
  payload_json: Record<string, unknown> | null;
  created_at: string;
};

const PLANOVI: Record<PlanTip, { naziv: string; cijena: string; period: string; opis: string; usteda?: string }> = {
  monthly: {
    naziv: 'Mjesečni Premium',
    cijena: '19 KM',
    period: '/ mjesec',
    opis: 'Fleksibilan plan bez dugoročnog vezivanja.',
  },
  yearly: {
    naziv: 'Godišnji Premium',
    cijena: '179 KM',
    period: '/ godina',
    opis: 'Najisplativiji plan za korisnike koji redovno koriste uslugu.',
    usteda: 'Ušteda 21% u odnosu na mjesečni plan',
  },
};

function eventLabel(eventType: string): string {
  const map: Record<string, string> = {
    premium_activated: 'Premium aktiviran',
    premium_activated_admin: 'Premium aktiviran (admin)',
    premium_deactivated_admin: 'Premium deaktiviran (admin)',
    premium_checkout_started: 'Započeta aktivacija',
    premium_cancelled: 'Premium otkazan',
    premium_renewed: 'Premium obnovljen',
    premium_expired: 'Premium istekao',
    premium_admin_pending_payment: 'Postavljeno: čeka uplatu (admin)',
    premium_admin_cancelled: 'Postavljeno: otkazano (admin)',
    premium_admin_expired: 'Postavljeno: isteklo (admin)',
  };
  return map[eventType] ?? eventType;
}

function statusLabel(status: PremiumStatus): string {
  if (status === 'active') return 'Aktivan';
  if (status === 'pending_payment') return 'Čeka uplatu';
  if (status === 'expired') return 'Istekao';
  if (status === 'cancelled') return 'Otkazan';
  return 'Neaktivan';
}

export default function KorisnikPremiumPage() {
  const [ucitava, setUcitava] = useState(true);
  const [akcijaUToku, setAkcijaUToku] = useState<string | null>(null);
  const [greska, setGreska] = useState<string | null>(null);
  const [poruka, setPoruka] = useState<string | null>(null);
  const [status, setStatus] = useState<PremiumStatus>('inactive');
  const [pocetak, setPocetak] = useState<string | null>(null);
  const [istek, setIstek] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [otkazano, setOtkazano] = useState<string | null>(null);
  const [razlogOtkaza, setRazlogOtkaza] = useState<string | null>(null);
  const [events, setEvents] = useState<PremiumEvent[]>([]);
  const [unosRazlogaOtkaza, setUnosRazlogaOtkaza] = useState('');
  const [brojKartice, setBrojKartice] = useState('');
  const [vaziDo, setVaziDo] = useState('');
  const [cvv, setCvv] = useState('');
  const [imeNaKartici, setImeNaKartici] = useState('');
  const [odabraniPlan, setOdabraniPlan] = useState<PlanTip>('monthly');

  function formatirajBrojKartice(vrijednost: string): string {
    const cifre = vrijednost.replace(/\D/g, '').slice(0, 16);
    const dijelovi = cifre.match(/.{1,4}/g) ?? [];
    return dijelovi.join(' ');
  }

  function formatirajVaziDo(vrijednost: string): string {
    const cifre = vrijednost.replace(/\D/g, '').slice(0, 4);
    if (cifre.length <= 2) return cifre;
    return `${cifre.slice(0, 2)}/${cifre.slice(2)}`;
  }

  const karticaCifre = brojKartice.replace(/\D/g, '');
  const vaziDoCifre = vaziDo.replace(/\D/g, '');
  const cvvCifre = cvv.replace(/\D/g, '');
  const karticaValidna = karticaCifre.length === 16;
  const vaziDoValidanFormat = /^\d{2}\/\d{2}$/.test(vaziDo);
  const mjesec = Number(vaziDoCifre.slice(0, 2));
  const vaziDoValidanMjesec = vaziDoCifre.length === 4 && mjesec >= 1 && mjesec <= 12;
  const cvvValidan = cvvCifre.length >= 3 && cvvCifre.length <= 4;
  const imeValidno = imeNaKartici.trim().length >= 3;
  const formaKarticeValidna =
    karticaValidna && vaziDoValidanFormat && vaziDoValidanMjesec && cvvValidan && imeValidno;

  async function ucitajProfil() {
    setUcitava(true);
    setGreska(null);
    try {
      const r = await fetch('/api/profil', { cache: 'no-store' });
      const d = (await r.json()) as ProfilResponse;
      if (!r.ok) throw new Error(d.error ?? 'Greška pri učitavanju premium statusa.');
      const premiumStatus = d.profil?.premium_status ?? (d.profil?.is_premium ? 'active' : 'inactive');
      setStatus(premiumStatus);
      setPocetak(d.profil?.premium_started_at ?? null);
      setIstek(d.profil?.premium_expires_at ?? null);
      setPlan(d.profil?.premium_plan ?? null);
      setOtkazano(d.profil?.premium_cancelled_at ?? null);
      setRazlogOtkaza(d.profil?.premium_cancel_reason ?? null);
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška pri učitavanju premium statusa.');
    } finally {
      setUcitava(false);
    }
  }

  async function ucitajEvente() {
    try {
      const r = await fetch('/api/premium/events', { cache: 'no-store' });
      const d = (await r.json()) as { events?: PremiumEvent[]; error?: string };
      if (!r.ok) throw new Error(d.error ?? 'Greška pri učitavanju premium događaja.');
      setEvents(d.events ?? []);
    } catch {
      setEvents([]);
    }
  }

  useEffect(() => {
    void ucitajProfil();
    void ucitajEvente();
  }, []);

  async function pozoviPremium(kljuc: string, url: string, opcije?: RequestInit): Promise<void> {
    setAkcijaUToku(kljuc);
    setGreska(null);
    setPoruka(null);
    try {
      const r = await fetch(url, { method: 'POST', ...opcije });
      const d = (await r.json()) as { success?: boolean; error?: string; alreadyActive?: boolean };
      if (!r.ok) throw new Error(d.error ?? 'Akcija nije uspjela.');
      if (d.alreadyActive) setPoruka('Premium usluga je već aktivna.');
      else setPoruka('Akcija je uspješno izvršena.');
      await ucitajProfil();
      await ucitajEvente();
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Akcija nije uspjela.');
    } finally {
      setAkcijaUToku(null);
    }
  }

  async function aktivirajPutemNaplate() {
    if (!formaKarticeValidna) {
      setGreska('Provjerite podatke kartice (broj, rok važenja, CVV i ime).');
      return;
    }

    setAkcijaUToku('checkout');
    setGreska(null);
    setPoruka(null);
    try {
      const r1 = await fetch('/api/premium/start', { method: 'POST' });
      const d1 = (await r1.json()) as { error?: string };
      if (!r1.ok) throw new Error(d1.error ?? 'Pokretanje naplate nije uspjelo.');

      const r2 = await fetch('/api/premium/confirm', { method: 'POST' });
      const d2 = (await r2.json()) as { error?: string };
      if (!r2.ok) throw new Error(d2.error ?? 'Potvrda uplate nije uspjela.');

      setPoruka(
        odabraniPlan === 'yearly'
          ? 'Premium je aktiviran. Odabran je godišnji plan.'
          : 'Premium je aktiviran. Odabran je mjesečni plan.'
      );
      await ucitajProfil();
      await ucitajEvente();
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Aktivacija premiuma nije uspjela.');
    } finally {
      setAkcijaUToku(null);
    }
  }

  return (
    <AppShell uloga="korisnik">
      <div className="mx-auto max-w-5xl">
        <section
          className="mb-6 rounded-3xl p-6 sm:p-8"
          style={{
            background:
              'linear-gradient(135deg, rgb(var(--first-primary-rgb) / 0.12), rgb(var(--first-secondary-rgb) / 0.10))',
            border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--first-primary)' }}>
                Premium Membership
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight" style={{ color: 'var(--first-octonary)' }}>
                Aktivacija Premium usluge
              </h1>
              <p className="mt-2 max-w-2xl text-sm" style={{ color: 'var(--first-nonary)' }}>
                Prioritetna obrada zahtjeva, brža reakcija i premium podrška. Odaberite plan koji vam najviše odgovara.
              </p>
            </div>
            <div
              className="rounded-xl border px-3 py-2 text-sm font-semibold"
              style={{
                borderColor: 'rgb(var(--first-primary-rgb) / 0.35)',
                backgroundColor: 'rgb(255 255 255 / 0.55)',
                color: 'var(--first-octonary)',
              }}
            >
              Status: {statusLabel(status)}
            </div>
          </div>
        </section>

        {greska && <AlertMessage variant="error" message={greska} />}
        {poruka && <AlertMessage variant="success" message={poruka} />}

        {ucitava ? (
          <div className="rounded-2xl border p-6 text-sm" style={{ color: 'var(--first-nonary)' }}>
            Učitavanje premium statusa...
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {(status === 'inactive' || status === 'pending_payment') && (
                <>
                  <section
                    className="rounded-2xl p-5 sm:p-6"
                    style={{
                      backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
                      border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
                    }}
                  >
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--first-octonary)' }}>
                      Odaberite plan
                    </h2>
                    <p className="mt-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
                      Transparentan pregled cijena i pogodnosti prije aktivacije.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {(Object.keys(PLANOVI) as PlanTip[]).map((tip) => {
                        const p = PLANOVI[tip];
                        const aktivan = odabraniPlan === tip;
                        return (
                          <button
                            key={tip}
                            type="button"
                            onClick={() => setOdabraniPlan(tip)}
                            className="rounded-2xl border p-4 text-left transition-all"
                            style={{
                              borderColor: aktivan ? 'var(--first-primary)' : 'rgb(var(--first-quaternary-rgb) / 0.35)',
                              backgroundColor: aktivan ? 'rgb(var(--first-primary-rgb) / 0.08)' : 'rgb(255 255 255 / 0.7)',
                              boxShadow: aktivan ? '0 0 0 2px rgb(var(--first-primary-rgb) / 0.20)' : 'none',
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                                {p.naziv}
                              </p>
                              {tip === 'yearly' && (
                                <span
                                  className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                                  style={{ backgroundColor: 'rgb(var(--first-secondary-rgb) / 0.15)', color: 'var(--first-secondary)' }}
                                >
                                  Najbolja ponuda
                                </span>
                              )}
                            </div>
                            <p className="mt-2 text-2xl font-bold" style={{ color: 'var(--first-octonary)' }}>
                              {p.cijena}
                              <span className="ml-1 text-sm font-medium" style={{ color: 'var(--first-nonary)' }}>
                                {p.period}
                              </span>
                            </p>
                            <p className="mt-1 text-xs" style={{ color: 'var(--first-nonary)' }}>
                              {p.opis}
                            </p>
                            {p.usteda && (
                              <p className="mt-2 text-xs font-semibold" style={{ color: 'var(--first-secondary)' }}>
                                {p.usteda}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section
                    className="rounded-2xl p-5 sm:p-6"
                    style={{
                      backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
                      border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
                    }}
                  >
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--first-octonary)' }}>
                      Podaci za naplatu
                    </h2>
                    <p className="mt-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
                      Siguran unos podataka kartice i trenutna potvrda aktivacije.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <label className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                        Ime i prezime na kartici
                        <input
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.45)' }}
                          value={imeNaKartici}
                          onChange={(e) => setImeNaKartici(e.target.value)}
                        />
                      </label>
                      <div className="hidden sm:block" />
                      <label className="text-xs sm:col-span-2" style={{ color: 'var(--first-nonary)' }}>
                        Broj kartice
                        <input
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.45)' }}
                          value={brojKartice}
                          onChange={(e) => setBrojKartice(formatirajBrojKartice(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          inputMode="numeric"
                          autoComplete="cc-number"
                        />
                        {!karticaValidna && brojKartice.length > 0 && (
                          <span className="mt-1 block text-[11px]" style={{ color: 'var(--first-senary)' }}>
                            Broj kartice mora imati 16 cifara.
                          </span>
                        )}
                      </label>
                      <label className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                        Važi do
                        <input
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.45)' }}
                          value={vaziDo}
                          onChange={(e) => setVaziDo(formatirajVaziDo(e.target.value))}
                          placeholder="MM/YY"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                        />
                        {vaziDo.length > 0 && (!vaziDoValidanFormat || !vaziDoValidanMjesec) && (
                          <span className="mt-1 block text-[11px]" style={{ color: 'var(--first-senary)' }}>
                            Unesite ispravan rok važenja (MM/YY).
                          </span>
                        )}
                      </label>
                      <label className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                        CVV
                        <input
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.45)' }}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                        />
                        {!cvvValidan && cvv.length > 0 && (
                          <span className="mt-1 block text-[11px]" style={{ color: 'var(--first-senary)' }}>
                            CVV mora imati 3 ili 4 cifre.
                          </span>
                        )}
                      </label>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {status === 'pending_payment' ? (
                        <Button
                          type="button"
                          size="md"
                          onClick={() => void pozoviPremium('confirm', '/api/premium/confirm')}
                          isLoading={akcijaUToku === 'confirm'}
                          loadingText="Potvrda..."
                        >
                          Potvrdi uplatu
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="md"
                          onClick={() => void aktivirajPutemNaplate()}
                          isLoading={akcijaUToku === 'checkout'}
                          loadingText="Obrada..."
                          disabled={!formaKarticeValidna}
                        >
                          Aktiviraj premium
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="md"
                        variant="secondary"
                        onClick={() =>
                          void pozoviPremium('cancel', '/api/premium/cancel', {
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ reason: unosRazlogaOtkaza || null }),
                          })
                        }
                        isLoading={akcijaUToku === 'cancel'}
                        loadingText="Otkazivanje..."
                      >
                        Otkaži
                      </Button>
                    </div>
                  </section>
                </>
              )}

              {status === 'active' && (
                <section
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: 'rgb(var(--first-secondary-rgb) / 0.10)',
                    border: '1px solid rgb(var(--first-secondary-rgb) / 0.35)',
                  }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--first-secondary)' }}>
                        <CheckCircle2 className="h-4 w-4" />
                        Premium nalog je aktivan
                      </p>
                      <h2 className="mt-2 text-xl font-bold" style={{ color: 'var(--first-octonary)' }}>
                        Usluga je spremna za prioritetnu obradu zahtjeva
                      </h2>
                    </div>
                    <Link
                      href="/korisnik/zahtjevi/novi"
                      className="rounded-xl px-3 py-2 text-sm font-semibold"
                      style={{
                        backgroundColor: 'var(--first-primary)',
                        color: '#fff',
                      }}
                    >
                      Novi premium zahtjev
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border p-3" style={{ borderColor: 'rgb(var(--first-secondary-rgb) / 0.35)' }}>
                      <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                        Aktiviran
                      </p>
                      <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                        {pocetak ? formatirajDatumPrikaz(pocetak) : '-'}
                      </p>
                    </div>
                    <div className="rounded-xl border p-3" style={{ borderColor: 'rgb(var(--first-secondary-rgb) / 0.35)' }}>
                      <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                        Istek
                      </p>
                      <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                        {istek ? formatirajDatumPrikaz(istek) : '-'}
                      </p>
                    </div>
                    <div className="rounded-xl border p-3" style={{ borderColor: 'rgb(var(--first-secondary-rgb) / 0.35)' }}>
                      <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                        Aktivni plan
                      </p>
                      <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                        {plan || 'monthly'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border p-4" style={{ borderColor: 'rgb(var(--first-secondary-rgb) / 0.35)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                      Premium pogodnosti
                    </p>
                    <ul className="mt-2 space-y-2 text-sm" style={{ color: 'var(--first-nonary)' }}>
                      <li className="flex items-center gap-2"><Zap className="h-4 w-4" /> Prioritetno rangiranje zahtjeva.</li>
                      <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Brža operativna obrada.</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Premium oznaka na dispečerskoj listi.</li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <textarea
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                      style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.45)' }}
                      rows={2}
                      placeholder="Opcioni razlog otkazivanja"
                      value={unosRazlogaOtkaza}
                      onChange={(e) => setUnosRazlogaOtkaza(e.target.value)}
                      maxLength={500}
                    />
                    <div className="mt-2">
                      <Button
                        type="button"
                        size="md"
                        variant="secondary"
                        onClick={() =>
                          void pozoviPremium('cancelActive', '/api/premium/cancel', {
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ reason: unosRazlogaOtkaza || null }),
                          })
                        }
                        isLoading={akcijaUToku === 'cancelActive'}
                        loadingText="Otkazivanje..."
                      >
                        Otkaži premium
                      </Button>
                    </div>
                  </div>
                </section>
              )}

              {(status === 'expired' || status === 'cancelled') && (
                <section
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
                    border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
                  }}
                >
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--first-octonary)' }}>
                    Premium je {status === 'expired' ? 'istekao' : 'otkazan'}
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
                    Obnovite paket kako biste nastavili koristiti prioritetnu obradu.
                  </p>
                  {otkazano && (
                    <p className="mt-2 text-xs" style={{ color: 'var(--first-nonary)' }}>
                      Zadnja promjena: {formatirajDatumVrijemeZaPrikaz(otkazano)}
                    </p>
                  )}
                  {razlogOtkaza && (
                    <p className="mt-1 text-xs" style={{ color: 'var(--first-nonary)' }}>
                      Razlog: {razlogOtkaza}
                    </p>
                  )}
                  <div className="mt-4">
                    <Button
                      type="button"
                      size="md"
                      onClick={() => void pozoviPremium('renew', '/api/premium/renew')}
                      isLoading={akcijaUToku === 'renew'}
                      loadingText="Obnova..."
                    >
                      Obnovi premium
                    </Button>
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-6">
              <section
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
                  border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
                }}
              >
                <h3 className="text-base font-semibold" style={{ color: 'var(--first-octonary)' }}>
                  Sažetak pretplate
                </h3>
                <p className="mt-1 text-xs" style={{ color: 'var(--first-nonary)' }}>
                  Trenutni pregled statusa i ključnih datuma.
                </p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt style={{ color: 'var(--first-nonary)' }}>Status</dt>
                    <dd className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
                      {statusLabel(status)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt style={{ color: 'var(--first-nonary)' }}>Plan</dt>
                    <dd className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
                      {plan ?? odabraniPlan}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt style={{ color: 'var(--first-nonary)' }}>Aktiviran</dt>
                    <dd className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
                      {pocetak ? formatirajDatumPrikaz(pocetak) : '-'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt style={{ color: 'var(--first-nonary)' }}>Istek</dt>
                    <dd className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
                      {istek ? formatirajDatumPrikaz(istek) : '-'}
                    </dd>
                  </div>
                </dl>
              </section>

              <section
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
                  border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
                }}
              >
                <h3 className="text-base font-semibold" style={{ color: 'var(--first-octonary)' }}>
                  Historija premium statusa
                </h3>
                <p className="mt-1 text-xs" style={{ color: 'var(--first-nonary)' }}>
                  Posljednje promjene na vašem nalogu.
                </p>

                {events.length === 0 ? (
                  <p className="mt-3 text-sm" style={{ color: 'var(--first-nonary)' }}>
                    Nema zabilježenih događaja.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {events.slice(0, 8).map((event) => (
                      <li
                        key={event.id}
                        className="rounded-xl border px-3 py-2 text-sm"
                        style={{
                          borderColor: 'rgb(var(--first-quaternary-rgb) / 0.3)',
                          backgroundColor: 'rgb(255 255 255 / 0.65)',
                        }}
                      >
                        <p className="font-medium" style={{ color: 'var(--first-octonary)' }}>
                          {eventLabel(event.event_type)}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                          {formatirajDatumVrijemeZaPrikaz(event.created_at)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </aside>
          </div>
        )}
      </div>
    </AppShell>
  );
}

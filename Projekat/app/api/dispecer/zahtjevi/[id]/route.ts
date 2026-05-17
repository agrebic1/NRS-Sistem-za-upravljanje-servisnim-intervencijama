import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { assertDispatcherAccess } from '@/lib/servisirane/dispecerPristup';
import { korisnickiBrojZahtjevaZaId } from '@/lib/servisirane/korisnickiBrojZahtjeva';
import { premiumZahtijevaObrazlozenjeSmanjenjaPrioriteta } from '@/lib/servisirane/operativniPrioritet';
import { dispecerSmijeMijenjatiOperativniPrioritet } from '@/lib/servisirane/statusZahtjeva';
import { dodijelijeSchema } from '@/lib/validations/servisirane';
import { provjeriKonfliktServiseraNaTerminu } from '@/lib/servisirane/konfliktiTermina';
import {
  notifDodjelaIntervencije,
  notifZatvaranjeIntervencije,
  notifTimDodjela,
} from '@/lib/servisirane/notifikacijeHelper';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const potvrdiSchema = z.object({
  action:         z.literal('potvrdi'),
  final_priority: z.enum(['NISKO', 'SREDNJE', 'VISOKO', 'KRITIČNO', 'HITNO']),
  premium_downgrade_reason: z.string().max(500).optional(),
});

const odbijSchema = z.object({
  action:           z.literal('odbij'),
  rejection_reason: z.string().min(5, 'Objasnite razlog odbijanja (min. 5 karaktera)').max(500),
});

const promijeniPrioritetSchema = z.object({
  action:                   z.literal('promijeni_prioritet'),
  final_priority:           potvrdiSchema.shape.final_priority,
  premium_downgrade_reason: z.string().max(500).optional(),
});

const zatvorSchema = z.object({
  action:    z.literal('zatvori'),
  napomene:  z.string().max(1000).optional().nullable(),
});

const napomenaDispeSchema = z.object({
  action:  z.literal('napomena'),
  sadrzaj: z.string().min(1, 'Napomena ne može biti prazna.').max(2000, 'Napomena je predugačka (max 2000 znakova).'),
});

const zatvoriFormalnoSchema = z.object({
  action:       z.literal('zatvoriFormalno'),
  closure_note: z.string().max(1000).optional().nullable(),
});

const actionSchema = z.discriminatedUnion('action', [
  potvrdiSchema,
  odbijSchema,
  promijeniPrioritetSchema,
  dodijelijeSchema,
  zatvorSchema,
  napomenaDispeSchema,
  zatvoriFormalnoSchema,
]);
/** Statusi u kojima dispečer može potvrditi/odbiti (MVP: uključuje in_review ako je u inboxu). */
const PENDING_STATUSES = new Set(['na_cekanju', 'pending_review', 'in_review']);

/** Kad dispečer prvi put snimi operativni prioritet, zahtjev prelazi u čarobnjak — korisnik više ne smije uređivati. */
const STATUS_PRE_CAROBNJAKA = new Set(['na_cekanju', 'pending_review']);
type RouteParams = { id: string } | Promise<{ id: string }>;

async function resolveRequestId(params: RouteParams): Promise<number | null> {
  const resolved = await params;
  const parsed = Number.parseInt(resolved.id, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

export async function GET(
  _request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const requestId = await resolveRequestId(params);
    if (!requestId) {
      return NextResponse.json({ error: 'Neispravan ID zahtjeva.' }, { status: 400 });
    }

    const imaPriv = await assertDispatcherAccess(supabase, user.id);
    if (!imaPriv) {
      return NextResponse.json({ error: 'Pristup odbijen.' }, { status: 403 });
    }

    const db = supabase as any;
    const { data: zahtjev, error } = await db
      .from('service_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (error || !zahtjev) {
      return NextResponse.json({ error: 'Zahtjev nije pronađen.' }, { status: 404 });
    }

    const { data: osoba } = await db
      .from('osoba')
      .select('ime, prezime, broj_telefona')
      .eq('id_osobe', zahtjev.user_id)
      .maybeSingle();

    const { data: redoviAsc } = await db
      .from('service_requests')
      .select('id, created_at')
      .eq('user_id', zahtjev.user_id)
      .order('created_at', { ascending: true })
      .order('id', { ascending: true });

    const korisnicki_broj_zahtjeva = redoviAsc
      ? korisnickiBrojZahtjevaZaId(redoviAsc, requestId)
      : null;

    // Serviser profil (ako je dodijeljen)
    let serviserProfil: { id: string; ime: string; prezime: string; broj_telefona: string | null } | null = null;
    if (zahtjev.serviser_dodijeljen_id) {
      const { data: sp } = await db
        .from('osoba')
        .select('id_osobe, ime, prezime, broj_telefona')
        .eq('id_osobe', zahtjev.serviser_dodijeljen_id)
        .maybeSingle();
      if (sp) serviserProfil = { id: sp.id_osobe, ime: sp.ime, prezime: sp.prezime, broj_telefona: sp.broj_telefona };
    }

    // Aktivnosti intervencije
    const { data: aktivnosti } = await db
      .from('intervention_activities')
      .select('*, autor:osoba!autor_id(ime, prezime, uloga)')
      .eq('zahtjev_id', requestId)
      .order('created_at', { ascending: true });

    // Evidencija rada
    const { data: evidencije } = await db
      .from('work_evidence')
      .select('*')
      .eq('zahtjev_id', requestId)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      zahtjev: {
        ...zahtjev,
        podnosilac:               osoba ?? null,
        serviser:                 serviserProfil,
        korisnicki_broj_zahtjeva: korisnicki_broj_zahtjeva ?? undefined,
      },
      aktivnosti: (aktivnosti ?? []).map((a: Record<string, unknown>) => ({
        ...a,
        autor: Array.isArray(a.autor) ? a.autor[0] : a.autor,
      })),
      evidencije: evidencije  ?? [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const requestId = await resolveRequestId(params);
    if (!requestId) {
      return NextResponse.json({ error: 'Neispravan ID zahtjeva.' }, { status: 400 });
    }

    const imaPriv = await assertDispatcherAccess(supabase, user.id);
    if (!imaPriv) {
      return NextResponse.json({ error: 'Pristup odbijen.' }, { status: 403 });
    }

    const db = supabase as any;
    const body     = await request.json();
    const rezultat = actionSchema.safeParse(body);

    if (!rezultat.success) {
      return NextResponse.json({ error: rezultat.error.errors[0].message }, { status: 400 });
    }

    const { data: zahtjev } = await db
      .from('service_requests')
      .select('status, is_premium')
      .eq('id', requestId)
      .single();

    if (!zahtjev) {
      return NextResponse.json({ error: 'Zahtjev nije pronađen.' }, { status: 404 });
    }

    const podaci = rezultat.data;

    if (podaci.action === 'promijeni_prioritet') {
      if (!dispecerSmijeMijenjatiOperativniPrioritet(zahtjev.status)) {
        return NextResponse.json(
          { error: 'Operativni prioritet se ne može mijenjati u ovom statusu.' },
          { status: 400 },
        );
      }
      if (
        zahtjev.is_premium === true &&
        premiumZahtijevaObrazlozenjeSmanjenjaPrioriteta(podaci.final_priority) &&
        (!podaci.premium_downgrade_reason || podaci.premium_downgrade_reason.trim().length < 10)
      ) {
        return NextResponse.json(
          {
            error:
              'Premium zahtjev mora ostati u hitnoj operativnoj grupi (HITNO, KRITIČNO ili VISOKO) ili unesite obrazloženje (min. 10 karaktera).',
          },
          { status: 400 },
        );
      }
      const izmjena: {
        final_priority: string;
        premium_priority_override_reason: string | null;
        status?: 'in_review';
      } = {
        final_priority: podaci.final_priority,
        premium_priority_override_reason:
          zahtjev.is_premium === true &&
          premiumZahtijevaObrazlozenjeSmanjenjaPrioriteta(podaci.final_priority)
            ? podaci.premium_downgrade_reason?.trim() ?? null
            : null,
      };
      if (STATUS_PRE_CAROBNJAKA.has(zahtjev.status)) {
        izmjena.status = 'in_review';
      }

      const { error } = await db.from('service_requests').update(izmjena).eq('id', requestId);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    // ── Dodjela servisera (s provjerom konflikta termina) ─────────────────────
    if (podaci.action === 'dodijeli') {
      const DOZVOLJENI_ZA_DODJELU = new Set(['potvrdeno', 'dodijeljeno']);
      if (!DOZVOLJENI_ZA_DODJELU.has(zahtjev.status)) {
        return NextResponse.json(
          { error: 'Dodjela servisera moguća je samo za potvrđene zahtjeve.' },
          { status: 400 }
        );
      }

      // Provjera konflikta termina (samo ako su oba termina prisutna)
      if (
        podaci.termin_planirani_pocetak &&
        podaci.termin_planirani_kraj &&
        !(podaci as Record<string, unknown>).override_konflikt
      ) {
        const konflikt = await provjeriKonfliktServiseraNaTerminu(
          db,
          podaci.serviser_id,
          podaci.termin_planirani_pocetak,
          podaci.termin_planirani_kraj,
          requestId
        );
        if (konflikt) {
          return NextResponse.json(
            {
              error:    'Serviser ima drugu intervenciju u odabranom terminu.',
              kod:      'KONFLIKT_TERMINA',
              konflikt,
            },
            { status: 409 }
          );
        }
      }

      // Evidentiramo override konflikta ako je prisutan
      if ((podaci as Record<string, unknown>).override_konflikt) {
        await db.from('intervention_activities').insert({
          zahtjev_id: requestId,
          autor_id:   user.id,
          tip:        'konflikt_override',
          sadrzaj:    `Dispečer prihvatio konflikt termina. Razlog: ${(podaci as Record<string, unknown>).razlog_konflikta ?? 'nije naveden'}`,
          metadata:   { serviser_id: podaci.serviser_id },
        });
      }

      const izmjena: Record<string, unknown> = {
        status:                 'dodijeljeno',
        serviser_dodijeljen_id: podaci.serviser_id,
      };
      if (podaci.termin_planirani_pocetak !== undefined)
        izmjena.termin_planirani_pocetak = podaci.termin_planirani_pocetak;
      if (podaci.termin_planirani_kraj !== undefined)
        izmjena.termin_planirani_kraj = podaci.termin_planirani_kraj;
      if (podaci.procijenjeno_trajanje !== undefined)
        izmjena.procijenjeno_trajanje = podaci.procijenjeno_trajanje;
      if (podaci.dispecer_napomene !== undefined)
        izmjena.dispecer_napomene = podaci.dispecer_napomene;

      const { error: updErr } = await db
        .from('service_requests')
        .update(izmjena)
        .eq('id', requestId);

      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

      await db.from('intervention_activities').insert({
        zahtjev_id: requestId,
        autor_id:   user.id,
        tip:        'dodjela',
        sadrzaj:    'Dispečer dodijelio intervenciju serviseru.',
        metadata:   { serviser_id: podaci.serviser_id, iz: zahtjev.status, u: 'dodijeljeno' },
      });

      // Notifikacija serviseru
      await notifDodjelaIntervencije(db, podaci.serviser_id, requestId);

      return NextResponse.json({ success: true, novi_status: 'dodijeljeno' });
    }

    // ── US-30: Napomena dispečera ─────────────────────────────────────────────
    if (podaci.action === 'napomena') {
      const { error: insErr } = await db.from('intervention_activities').insert({
        zahtjev_id: requestId,
        autor_id:   user.id,
        tip:        'napomena',
        sadrzaj:    podaci.sadrzaj.trim(),
        metadata:   null,
      });
      if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    // ── Zatvaranje intervencije (dispečer) ────────────────────────────────────
    if (podaci.action === 'zatvori') {
      const DOZVOLJENI_ZA_ZATVARANJE = new Set(['dodijeljeno', 'u_radu', 'u_izvrsenju']);
      if (!DOZVOLJENI_ZA_ZATVARANJE.has(zahtjev.status)) {
        return NextResponse.json(
          { error: 'Zatvaranje je moguće samo za aktivne intervencije.' },
          { status: 400 }
        );
      }

      const { error: updErr } = await db
        .from('service_requests')
        .update({ status: 'zavrseno' })
        .eq('id', requestId);

      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

      await db.from('intervention_activities').insert({
        zahtjev_id: requestId,
        autor_id:   user.id,
        tip:        'status_promjena',
        sadrzaj:    podaci.napomene?.trim()
          ? `Dispečer zatvorio intervenciju. Napomena: ${podaci.napomene.trim()}`
          : 'Dispečer zatvorio intervenciju.',
        metadata:   { iz: zahtjev.status, u: 'zavrseno' },
      });

      return NextResponse.json({ success: true, novi_status: 'zavrseno' });
    }

    // ── Formalno zatvaranje intervencije (status: zavrseno → zatvoreno) ────────
    if (podaci.action === 'zatvoriFormalno') {
      if (zahtjev.status !== 'zavrseno') {
        return NextResponse.json(
          { error: 'Formalno zatvaranje moguće je samo za intervencije u statusu "zavrseno".' },
          { status: 400 }
        );
      }

      // Provjeri da postoji evidencija rada
      const { count: evidCount } = await db
        .from('work_evidence')
        .select('*', { count: 'exact', head: true })
        .eq('zahtjev_id', requestId);

      if (!evidCount || evidCount === 0) {
        return NextResponse.json(
          { error: 'Intervencija ne može biti zatvorena bez evidencije rada. Serviser mora evidentirati obavljeni posao.' },
          { status: 400 }
        );
      }

      const { error: updErr } = await db
        .from('service_requests')
        .update({
          status:       'zatvoreno',
          closed_at:    new Date().toISOString(),
          closed_by:    user.id,
          closure_note: podaci.closure_note?.trim() || null,
        })
        .eq('id', requestId);

      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

      await db.from('intervention_activities').insert({
        zahtjev_id: requestId,
        autor_id:   user.id,
        tip:        'zatvaranje',
        sadrzaj:    podaci.closure_note?.trim()
          ? `Intervencija formalno zatvorena. Napomena: ${podaci.closure_note.trim()}`
          : 'Intervencija formalno zatvorena.',
        metadata:   { iz: 'zavrseno', u: 'zatvoreno' },
      });

      // Notifikacije svim servisirima u timu
      const { data: zahtjevFull } = await db
        .from('service_requests')
        .select('serviser_dodijeljen_id')
        .eq('id', requestId)
        .single();

      if (zahtjevFull?.serviser_dodijeljen_id) {
        await notifZatvaranjeIntervencije(db, zahtjevFull.serviser_dodijeljen_id, requestId);
      }

      // Pomoćni serviseri
      const { data: tim } = await db
        .from('tim_intervencije')
        .select('serviser_id')
        .eq('zahtjev_id', requestId);

      for (const clan of tim ?? []) {
        await notifZatvaranjeIntervencije(db, clan.serviser_id, requestId);
      }

      return NextResponse.json({ success: true, novi_status: 'zatvoreno' });
    }

    if (!PENDING_STATUSES.has(zahtjev.status)) {
      return NextResponse.json(
        { error: 'Akcija je moguća samo za zahtjeve koji još nisu potvrđeni ili odbijeni.' },
        { status: 400 }
      );
    }

    // US-12: operativni prioritet uz potvrdu (status → potvrdeno).
    if (podaci.action === 'potvrdi') {
      if (
        zahtjev.is_premium === true &&
        premiumZahtijevaObrazlozenjeSmanjenjaPrioriteta(podaci.final_priority) &&
        (!podaci.premium_downgrade_reason || podaci.premium_downgrade_reason.trim().length < 10)
      ) {
        return NextResponse.json(
          {
            error:
              'Premium zahtjev mora ostati u hitnoj operativnoj grupi (HITNO, KRITIČNO ili VISOKO) ili unesite obrazloženje (min. 10 karaktera).',
          },
          { status: 400 }
        );
      }
      const { error } = await db
        .from('service_requests')
        .update({
          status:         'potvrdeno',
          final_priority: podaci.final_priority,
          premium_priority_override_reason:
            zahtjev.is_premium === true &&
            premiumZahtijevaObrazlozenjeSmanjenjaPrioriteta(podaci.final_priority)
              ? podaci.premium_downgrade_reason?.trim() ?? null
              : null,
        })
        .eq('id', requestId);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, novi_status: 'potvrdeno' });
    }

    if (podaci.action === 'odbij') {
      const { error } = await db
        .from('service_requests')
        .update({
          status:           'odbijeno',
          rejection_reason: podaci.rejection_reason,
        })
        .eq('id', requestId);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, novi_status: 'odbijeno' });
    }

    return NextResponse.json({ error: 'Nepoznata akcija.' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

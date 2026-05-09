import Link from 'next/link';

async function getZahtjevi() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dispecer/zahtjevi`, {
    cache: 'no-store'
  });
  return res.json();
}

export default async function Page() {
  const { zahtjevi } = await getZahtjevi();

  const aktivni = zahtjevi.filter((z: any) =>
    z.status !== 'completed' &&
    z.status !== 'cancelled' &&
    z.status !== 'inactive'
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>Otvoreni zahtjevi</h1>

      <button onClick={() => location.reload()}>Osvježi</button>

      {aktivni.map((z: any) => (
        <Link key={z.id} href={`/dispecer/zahtjevi/${z.id}`}>
          <div style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
            
            <p><b>Kategorija:</b> {z.kategorija}</p>
            {z.potkategorija && <p><b>Potkategorija:</b> {z.potkategorija}</p>}

            <p><b>Adresa:</b> {z.adresa}</p>
            <p><b>Telefon:</b> {z.telefon}</p>
            <p><b>Datum:</b> {z.datum}</p>

            <p><b>Status:</b> {z.status}</p>
            <p><b>Hitnost:</b> {z.hitnost}</p>

            {z.termin && <p><b>Termin:</b> {z.termin}</p>}

            <div>
              {z.slika && <span>📷 Ima sliku </span>}
              {z.gps && <span>📍 GPS lokacija </span>}
            </div>

          </div>
        </Link>
      ))}
    </div>
  );
}
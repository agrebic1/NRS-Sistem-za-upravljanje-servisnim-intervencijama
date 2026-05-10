import { Suspense } from 'react';

import { DispecerZahtjeviLista } from './DispecerZahtjeviLista';

export default function DispecerZahtjeviPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center p-8">
          <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
            Učitavanje...
          </p>
        </div>
      }
    >
      <DispecerZahtjeviLista />
    </Suspense>
  );
}

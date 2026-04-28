import Link from 'next/link';
import { Settings, Info, ShieldAlert } from 'lucide-react';
import { RegisterForm } from '@/components/forms/RegisterForm';

export default function RegistracijaPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: 'var(--color-warm-cream)' }}
    >
      {/* Brand */}
      <div className="mb-7 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'var(--color-deep-teal)' }}
        >
          <Settings className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>
          InterServ
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl p-7 shadow-card-lg sm:p-8"
          style={{
            backgroundColor: 'rgb(var(--rgb-muted-sand) / 0.22)',
            border: '1px solid rgb(var(--rgb-soft-beige) / 0.4)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>
              Kreirajte korisnički nalog
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Registracija je namijenjena korisnicima usluge koji žele prijaviti servisnu intervenciju.
            </p>
          </div>

          {/* Important notice */}
          <div
            className="mb-6 flex items-start gap-3 rounded-xl border px-4 py-3"
            style={{
              backgroundColor: 'rgb(var(--rgb-mystic-ember) / 0.06)',
              borderColor: 'rgb(var(--rgb-mystic-ember) / 0.25)',
            }}
          >
            <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: 'var(--color-mystic-ember)' }} />
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-mystic-ember)' }}>
              <span className="font-semibold">Napomena za uposlenike:</span>{' '}
              Ako ste serviser ili uposlenik sistema, nalog vam kreira administrator. Ne registrujte se ovdje.
            </p>
          </div>

          <RegisterForm />

          <div
            className="mt-6 border-t pt-5"
            style={{ borderColor: 'rgb(var(--rgb-soft-beige) / 0.4)' }}
          >
            <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Već imate nalog?{' '}
              <Link
                href="/auth/login"
                className="font-semibold transition-opacity duration-200 hover:opacity-70"
                style={{ color: 'var(--color-deep-teal)' }}
              >
                Prijavite se
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div
          className="mt-4 flex items-start gap-2 rounded-xl px-4 py-3 text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--color-celestial-teal)' }} />
          <span>
            Kreiranjem naloga prihvatate naše uslove korištenja. Vaši podaci su zaštićeni i neće biti dijeljeni s trećim stranama.
          </span>
        </div>
      </div>
    </div>
  );
}

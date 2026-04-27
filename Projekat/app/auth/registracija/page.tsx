import Link from 'next/link';
import { Settings, Info, ShieldAlert } from 'lucide-react';
import { RegisterForm } from '@/components/forms/RegisterForm';

export default function RegistracijaPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: '#F2E6D8' }}
    >
      {/* Brand */}
      <div className="mb-7 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: '#2C444D' }}
        >
          <Settings className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight" style={{ color: '#1F2A30' }}>
          InterServ
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl p-7 shadow-card-lg sm:p-8"
          style={{
            backgroundColor: 'rgba(199, 184, 164, 0.22)',
            border: '1px solid rgba(204, 182, 142, 0.4)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1F2A30' }}>
              Kreirajte korisnički nalog
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: '#6B7C82' }}>
              Registracija je namijenjena korisnicima usluge koji žele prijaviti servisnu intervenciju.
            </p>
          </div>

          {/* Important notice */}
          <div
            className="mb-6 flex items-start gap-3 rounded-xl border px-4 py-3"
            style={{
              backgroundColor: 'rgba(139, 74, 43, 0.06)',
              borderColor: 'rgba(139, 74, 43, 0.25)',
            }}
          >
            <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: '#8B4A2B' }} />
            <p className="text-xs leading-relaxed" style={{ color: '#8B4A2B' }}>
              <span className="font-semibold">Napomena za uposlenike:</span>{' '}
              Ako ste serviser ili uposlenik sistema, nalog vam kreira administrator. Ne registrujte se ovdje.
            </p>
          </div>

          <RegisterForm />

          <div
            className="mt-6 border-t pt-5"
            style={{ borderColor: 'rgba(204, 182, 142, 0.4)' }}
          >
            <p className="text-center text-sm" style={{ color: '#6B7C82' }}>
              Već imate nalog?{' '}
              <Link
                href="/auth/login"
                className="font-semibold transition-opacity duration-200 hover:opacity-70"
                style={{ color: '#2C444D' }}
              >
                Prijavite se
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div
          className="mt-4 flex items-start gap-2 rounded-xl px-4 py-3 text-xs"
          style={{ color: '#6B7C82' }}
        >
          <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: '#5A7C83' }} />
          <span>
            Kreiranjem naloga prihvatate naše uslove korištenja. Vaši podaci su zaštićeni i neće biti dijeljeni s trećim stranama.
          </span>
        </div>
      </div>
    </div>
  );
}

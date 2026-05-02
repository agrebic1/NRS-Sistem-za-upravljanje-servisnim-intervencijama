'use client';

import { useState } from 'react';
import { Upload, X, AlertCircle, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea';
import { AlertMessage } from '@/components/ui/AlertMessage';

// ─── Validacija telefona — samo brojevi i +, -, / ─────────────────────────────

const PHONE_REGEX = /^[0-9+\-\/ ]*$/;

function validirajTelefon(tel: string): string | null {
  if (!tel.trim()) return null; // prazno polje — provjera dužine u wizardu
  if (!PHONE_REGEX.test(tel)) return 'Dozvoljeni su samo brojevi i znakovi +, -, /.';
  return null;
}

// ─── Kontrolisani Phone input ─────────────────────────────────────────────────

interface PhoneInputProps {
  value:    string;
  onChange: (val: string) => void;
  error?:   string | null;
}

function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
        Kontakt telefon
      </label>
      <div className="relative">
        <input
          id="wizard-telefon"
          type="tel"
          inputMode="tel"
          placeholder="+387 61 000 000"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="tel"
          className="w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200
            placeholder:text-text-muted/60 focus:outline-none focus:ring-2"
          style={{
            borderColor:     error
              ? '#DC2626'
              : 'rgb(var(--first-quaternary-rgb) / 0.4)',
            backgroundColor: error
              ? 'rgba(220,38,38,0.04)'
              : 'rgb(255 255 255 / 0.6)',
            color:           'var(--first-octonary)',
          }}
        />
        {error && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <AlertCircle className="h-4 w-4" style={{ color: '#DC2626' }} />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium" style={{ color: '#DC2626' }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Korak 4: Opis i kontakt ──────────────────────────────────────────────────

interface KorakOpisProps {
  description:  string;
  contactPhone: string;
  photoFile:    File | null;
  onUpdate: (p: {
    description?:  string;
    contactPhone?: string;
    photoFile?:    File | null;
  }) => void;
  onPhoneValidity?: (isValid: boolean) => void;
  errors?: Partial<Record<'description', string>>;
}

export function KorakOpis({
  description,
  contactPhone,
  photoFile,
  onUpdate,
  onPhoneValidity,
  errors,
}: KorakOpisProps) {
  const [isDragging, setIsDragging] = useState(false);

  const phoneError = validirajTelefon(contactPhone);

  function handlePhoneChange(val: string) {
    onUpdate({ contactPhone: val });
    const err = validirajTelefon(val);
    onPhoneValidity?.(!err && val.trim().length > 0);
  }

  function handleFile(file: File | null) {
    if (!file) { onUpdate({ photoFile: null }); return; }
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return;
    onUpdate({ photoFile: file });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-1 text-xl font-bold" style={{ color: 'var(--first-octonary)' }}>
          Opis i kontakt
        </h2>
        <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
          Što detaljniji opis — brža i preciznija intervencija.
        </p>
      </div>

      {/* Opis kvara — Triple Coding: siva + FileText ikona + naziv */}
      <div>
        <div className="mb-1.5 flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ backgroundColor: 'rgb(var(--first-quaternary-rgb) / 0.4)' }}
          >
            <FileText className="h-3.5 w-3.5" style={{ color: 'var(--first-nonary)' }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
            Opis kvara
          </span>
        </div>
        <Textarea
          label=""
          id="wizard-opis"
          rows={5}
          placeholder="Opišite šta se desilo, kada je počelo i šta ste već pokušali..."
          value={description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          showCharacterCount
          maxCharacters={2000}
          currentLength={description.length}
          error={errors?.description}
        />
      </div>

      <PhoneInput
        value={contactPhone}
        onChange={handlePhoneChange}
        error={phoneError}
      />

      {phoneError && (
        <AlertMessage
          variant="warning"
          message="Telefon može sadržavati samo: cifre (0-9) i znakove +, -, /."
        />
      )}

      {/* Drag-and-drop foto */}
      <div>
        <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
          Fotografija kvara{' '}
          <span className="font-normal" style={{ color: 'var(--first-nonary)' }}>(neobavezno)</span>
        </label>

        {photoFile ? (
          <div
            className="flex items-center justify-between rounded-xl border px-4 py-3"
            style={{
              borderColor:     'rgb(var(--first-secondary-rgb) / 0.4)',
              backgroundColor: 'rgb(var(--first-secondary-rgb) / 0.06)',
            }}
          >
            <span className="truncate text-sm" style={{ color: 'var(--first-octonary)' }}>
              {photoFile.name}
            </span>
            <button type="button" onClick={() => onUpdate({ photoFile: null })} className="ml-3 flex-shrink-0 transition-opacity hover:opacity-70">
              <X className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
            </button>
          </div>
        ) : (
          <div
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-5 py-8 text-center transition-colors duration-200"
            style={{
              borderColor:     isDragging ? 'var(--first-secondary)' : 'rgb(var(--first-quaternary-rgb) / 0.5)',
              backgroundColor: isDragging ? 'rgb(var(--first-secondary-rgb) / 0.05)' : 'transparent',
            }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0] ?? null); }}
            onClick={() => document.getElementById('wizard-foto-input')?.click()}
          >
            <Upload className="h-7 w-7" style={{ color: 'var(--first-nonary)' }} />
            <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
              Prevucite sliku ili{' '}
              <span style={{ color: 'var(--first-secondary)' }}>kliknite za odabir</span>
            </p>
            <p className="text-xs" style={{ color: 'var(--first-quinary)' }}>JPG, PNG do 5 MB</p>
            <input id="wizard-foto-input" type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
          </div>
        )}
      </div>
    </div>
  );
}

import { IntervencijeKosturEkran } from '@/components/intervencije/IntervencijeKosturEkran';
import { MOCK_INTERVENCIJE_DISPECER } from '@/lib/servisirane/intervencijaKostur';

export default function DispecerIntervencijePage() {
  return <IntervencijeKosturEkran uloga="dispecer" mockRedovi={MOCK_INTERVENCIJE_DISPECER} />;
}

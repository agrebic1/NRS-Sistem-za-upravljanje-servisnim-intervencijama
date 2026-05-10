import { IntervencijeKosturEkran } from '@/components/intervencije/IntervencijeKosturEkran';
import { MOCK_INTERVENCIJE_SERVISER } from '@/lib/servisirane/intervencijaKostur';

export default function ServiserIntervencijePage() {
  return <IntervencijeKosturEkran uloga="serviser" mockRedovi={MOCK_INTERVENCIJE_SERVISER} />;
}

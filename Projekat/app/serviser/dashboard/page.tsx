import { redirect } from 'next/navigation';

/**
 * /serviser/dashboard je legacy ruta sa hardkodiranim mock podacima.
 * Realni serviser dashboard je na /serviser.
 */
export default function ServiserDashboardPage() {
  redirect('/serviser');
}

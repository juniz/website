import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import PejabatForm from '../../PejabatForm';

export const metadata = { title: 'Edit Pejabat — Admin RS Bhayangkara' };

async function getPejabat(id) {
  const res = await api.get(`/pejabat/${id}`);
  if (!res.success) return null;
  return res.data.data ?? res.data;
}

export default async function EditPejabatPage({ params }) {
  const { id } = await params;
  const pejabat = await getPejabat(id);
  if (!pejabat) notFound();
  return <PejabatForm mode="edit" pejabat={pejabat} />;
}

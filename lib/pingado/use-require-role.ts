'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import type { PapelUsuario } from './types';

/** Protege uma rota do CRM por papel — redireciona para o login se a sessão não corresponder. */
export function useRequireRole(papel: PapelUsuario) {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (role !== papel) router.replace('/login');
  }, [role, loading, papel, router]);

  return { pronto: !loading && role === papel };
}

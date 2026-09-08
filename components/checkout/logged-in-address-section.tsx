'use client';

import { useEffect, useState } from 'react';
import { MapPin, Plus, Star, X } from 'lucide-react';

import type { EnderecoSalvo } from '@/lib/types';
import { formatCep } from '@/lib/cep';
import { cn } from '@/lib/utils';
import { AddressFormFields, ENDERECO_FORM_VAZIO, enderecoFormValido } from '@/components/perfil/address-form-fields';

interface LoggedInAddressSectionProps {
  userId: string;
  userName: string;
  selectedId: string | null;
  onSelect: (endereco: EnderecoSalvo) => void;
}

function storageKey(userId: string) {
  return `pingado_enderecos_${userId}`;
}

export function LoggedInAddressSection({ userId, userName, selectedId, onSelect }: LoggedInAddressSectionProps) {
  const [enderecos, setEnderecos] = useState<EnderecoSalvo[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(ENDERECO_FORM_VAZIO);
  const [padraoNovo, setPadraoNovo] = useState(false);
  const [tentouSalvar, setTentouSalvar] = useState(false);

  useEffect(() => {
    try {
      const salvos: EnderecoSalvo[] = JSON.parse(localStorage.getItem(storageKey(userId)) || '[]');
      setEnderecos(salvos);

      if (salvos.length > 0) {
        const padrao = salvos.find((e) => e.padrao) ?? salvos[0];
        onSelect(padrao);
      } else {
        setMostrarForm(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    } catch (e) {
      console.error('Erro ao ler endereços do localStorage:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  function persistir(next: EnderecoSalvo[]) {
    setEnderecos(next);
    localStorage.setItem(storageKey(userId), JSON.stringify(next));
  }

  function resetForm() {
    setForm(ENDERECO_FORM_VAZIO);
    setPadraoNovo(false);
    setTentouSalvar(false);
    setMostrarForm(false);
  }

  function handleSalvarNovo() {
    setTentouSalvar(true);
    if (!enderecoFormValido(form)) return;

    const deveSerPadrao = padraoNovo || enderecos.length === 0;
    const novo: EnderecoSalvo = {
      id: 'end_' + Math.random().toString(36).slice(2, 9),
      user_id: userId,
      ...form,
      padrao: deveSerPadrao,
      created_at: new Date().toISOString(),
    };

    const atualizados = deveSerPadrao ? enderecos.map((e) => ({ ...e, padrao: false })) : enderecos;
    const next = [...atualizados, novo];
    persistir(next);
    onSelect(novo);
    resetForm();
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-serif text-lg text-foreground">Endereço de entrega</h2>

      <div className="mt-5 space-y-1.5">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Nome completo</p>
        <p className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-sm font-semibold text-muted-foreground">
          {userName}
        </p>
      </div>

      {enderecos.length > 0 && (
        <div className="mt-5 space-y-2.5" role="radiogroup" aria-label="Endereço de entrega">
          {enderecos.map((end) => (
            <label
              key={end.id}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-xs transition-colors',
                selectedId === end.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
              )}
            >
              <input
                type="radio"
                name="endereco-entrega"
                checked={selectedId === end.id}
                onChange={() => onSelect(end)}
                className="mt-1 accent-primary"
              />
              <div className="flex-1 space-y-0.5 text-foreground">
                <p className="flex items-center gap-2 font-bold text-sm">
                  {end.endereco}, {end.numero}
                  {end.complemento ? ` — ${end.complemento}` : ''}
                  {end.padrao && (
                    <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      <Star size={9} fill="currentColor" />
                      Padrão
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground">
                  {end.bairro} · {end.cidade}/{end.estado} · CEP {formatCep(end.cep)}
                </p>
              </div>
            </label>
          ))}
        </div>
      )}

      {!mostrarForm ? (
        <button
          type="button"
          onClick={() => setMostrarForm(true)}
          className="mt-4 flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <Plus size={14} />
          Novo endereço
        </button>
      ) : (
        <div className={cn('space-y-3', enderecos.length > 0 && 'mt-5 border-t border-border/60 pt-4')}>
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin size={14} className="text-primary" />
              Novo endereço
            </p>
            {enderecos.length > 0 && (
              <button
                type="button"
                onClick={resetForm}
                aria-label="Cancelar novo endereço"
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <AddressFormFields value={form} onChange={setForm} idPrefix="checkout-novo" />

          {tentouSalvar && !enderecoFormValido(form) && (
            <p className="text-xs font-medium text-destructive">Preencha todos os campos obrigatórios corretamente.</p>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setPadraoNovo((v) => !v)}
              aria-pressed={padraoNovo}
              className="flex items-center gap-2 text-xs font-semibold text-foreground"
            >
              <span
                className={cn(
                  'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
                  padraoNovo ? 'bg-primary' : 'bg-muted',
                )}
              >
                <span
                  className={cn(
                    'inline-block size-4 transform rounded-full bg-white shadow transition-transform',
                    padraoNovo ? 'translate-x-[18px]' : 'translate-x-0.5',
                  )}
                />
              </span>
              Usar como endereço padrão
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {enderecos.length > 0 && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-1.5 px-4 py-2.5 text-foreground text-xs font-bold rounded-full transition-all border border-border hover:bg-muted"
              >
                Cancelar
              </button>
            )}
            <button
              type="button"
              onClick={handleSalvarNovo}
              className="flex items-center gap-1.5 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2.5 rounded-full font-bold text-xs transition shadow"
            >
              <Plus size={14} />
              Salvar e usar este endereço
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

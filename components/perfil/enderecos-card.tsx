'use client';

import { useEffect, useState } from 'react';
import { MapPin, Plus, Star, Trash2, X } from 'lucide-react';

import type { EnderecoSalvo } from '@/lib/types';
import { formatCep } from '@/lib/cep';
import { AddressFormFields, ENDERECO_FORM_VAZIO, enderecoFormValido } from '@/components/perfil/address-form-fields';

interface EnderecosCardProps {
  userId: string;
}

function storageKey(userId: string) {
  return `pingado_enderecos_${userId}`;
}

export function EnderecosCard({ userId }: EnderecosCardProps) {
  const [enderecos, setEnderecos] = useState<EnderecoSalvo[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(ENDERECO_FORM_VAZIO);
  const [padraoNovo, setPadraoNovo] = useState(false);
  const [tentouSalvar, setTentouSalvar] = useState(false);

  useEffect(() => {
    try {
      const salvos = JSON.parse(localStorage.getItem(storageKey(userId)) || '[]');
      setEnderecos(salvos);
    } catch (e) {
      console.error('Erro ao ler endereços do localStorage:', e);
    }
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

  function handleAdicionar() {
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

    const atualizados = deveSerPadrao
      ? enderecos.map((e) => ({ ...e, padrao: false }))
      : enderecos;

    persistir([...atualizados, novo]);
    resetForm();
  }

  function handleRemover(id: string) {
    const restante = enderecos.filter((e) => e.id !== id);
    const removidoEraPadrao = enderecos.find((e) => e.id === id)?.padrao;
    if (removidoEraPadrao && restante.length > 0 && !restante.some((e) => e.padrao)) {
      restante[0].padrao = true;
    }
    persistir(restante);
  }

  function handleTornarPadrao(id: string) {
    persistir(enderecos.map((e) => ({ ...e, padrao: e.id === id })));
  }

  return (
    <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-md border border-border/40 flex flex-col justify-between h-fit">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-normal text-foreground flex items-center gap-2">
            <MapPin size={20} className="text-primary" />
            Endereço
          </h2>
          {!mostrarForm && (
            <button
              type="button"
              onClick={() => setMostrarForm(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <Plus size={14} />
              Adicionar
            </button>
          )}
        </div>

        {enderecos.length === 0 && !mostrarForm && (
          <p className="text-xs text-muted-foreground font-medium font-sans">
            Você ainda não salvou nenhum endereço. Cadastre um para usar nas próximas compras sem precisar digitar tudo de novo.
          </p>
        )}

        {enderecos.length > 0 && (
          <div className="space-y-3 mb-4">
            {enderecos.map((end) => (
              <div
                key={end.id}
                className={`bg-background/50 p-4 rounded-xl border font-sans text-xs ${
                  end.padrao ? 'border-primary/50' : 'border-border/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5 text-foreground">
                    <p className="font-bold text-sm">
                      {end.endereco}, {end.numero}
                      {end.complemento ? ` — ${end.complemento}` : ''}
                    </p>
                    <p className="text-muted-foreground">
                      {end.bairro} · {end.cidade}/{end.estado}
                    </p>
                    <p className="text-muted-foreground">CEP {formatCep(end.cep)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {end.padrao ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        <Star size={10} fill="currentColor" />
                        Padrão
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleTornarPadrao(end.id)}
                        className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                      >
                        Tornar padrão
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemover(end.id)}
                      aria-label="Remover endereço"
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {mostrarForm && (
          <div className="border-t border-border/60 pt-4 space-y-3">
            <AddressFormFields value={form} onChange={setForm} idPrefix="perfil-end" />

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
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                    padraoNovo ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block size-4 transform rounded-full bg-white shadow transition-transform ${
                      padraoNovo ? 'translate-x-[18px]' : 'translate-x-0.5'
                    }`}
                  />
                </span>
                Usar como endereço padrão
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-1.5 px-4 py-2.5 text-foreground text-xs font-bold rounded-full transition-all border border-border hover:bg-muted"
              >
                <X size={14} />
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAdicionar}
                className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white px-4 py-2.5 rounded-full font-bold text-xs transition shadow"
              >
                <Plus size={14} />
                Salvar endereço
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

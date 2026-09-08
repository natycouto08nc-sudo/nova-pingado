import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ESTADOS_BRASIL } from '@/lib/estados-brasil';

export interface EnderecoEntrega {
  nomeCompleto: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export const ENDERECO_VAZIO: EnderecoEntrega = {
  nomeCompleto: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
};

interface ShippingAddressFormProps {
  value: EnderecoEntrega;
  onChange: (value: EnderecoEntrega) => void;
}

function campo(label: string, value: string, onValue: (v: string) => void, id: string, extraProps: Record<string, unknown> = {}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(e) => onValue(e.target.value)} {...extraProps} />
    </div>
  );
}

export function ShippingAddressForm({ value, onChange }: ShippingAddressFormProps) {
  function set<K extends keyof EnderecoEntrega>(key: K, v: EnderecoEntrega[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-serif text-lg text-foreground">Endereço de entrega</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          {campo('Nome completo', value.nomeCompleto, (v) => set('nomeCompleto', v), 'nomeCompleto')}
        </div>
        <div className="sm:col-span-2">
          {campo('Endereço', value.endereco, (v) => set('endereco', v), 'endereco')}
        </div>
        {campo('Número', value.numero, (v) => set('numero', v), 'numero')}
        {campo('Complemento (opcional)', value.complemento, (v) => set('complemento', v), 'complemento')}
        {campo('Bairro', value.bairro, (v) => set('bairro', v), 'bairro')}
        {campo('Cidade', value.cidade, (v) => set('cidade', v), 'cidade')}

        <div className="space-y-1.5">
          <Label htmlFor="estado">Estado</Label>
          <Select
            items={ESTADOS_BRASIL.map((estado) => ({ label: estado.sigla, value: estado.sigla }))}
            value={value.estado || null}
            onValueChange={(v) => set('estado', (v as string) ?? '')}
          >
            <SelectTrigger id="estado">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS_BRASIL.map((estado) => (
                <SelectItem key={estado.sigla} value={estado.sigla}>
                  {estado.sigla} — {estado.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export function enderecoValido(endereco: EnderecoEntrega): boolean {
  return Boolean(
    endereco.nomeCompleto.trim() &&
      endereco.endereco.trim() &&
      endereco.numero.trim() &&
      endereco.bairro.trim() &&
      endereco.cidade.trim() &&
      endereco.estado.trim(),
  );
}

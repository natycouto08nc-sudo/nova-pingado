import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ESTADOS_BRASIL } from '@/lib/estados-brasil';
import { formatCep } from '@/lib/cep';

export interface EnderecoFormValues {
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export const ENDERECO_FORM_VAZIO: EnderecoFormValues = {
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
};

export function enderecoFormValido(form: EnderecoFormValues): boolean {
  return Boolean(
    form.endereco.trim() &&
      form.numero.trim() &&
      form.bairro.trim() &&
      form.cidade.trim() &&
      form.estado.trim() &&
      form.cep.replace(/\D/g, '').length === 8,
  );
}

interface AddressFormFieldsProps {
  value: EnderecoFormValues;
  onChange: (value: EnderecoFormValues) => void;
  idPrefix?: string;
}

export function AddressFormFields({ value, onChange, idPrefix = 'end' }: AddressFormFieldsProps) {
  function set<K extends keyof EnderecoFormValues>(key: K, v: EnderecoFormValues[K]) {
    onChange({ ...value, [key]: v });
  }

  const fieldId = (name: string) => `${idPrefix}-${name}`;
  const labelClass = 'text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5';

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor={fieldId('endereco')} className={labelClass}>
          Endereço
        </Label>
        <Input id={fieldId('endereco')} value={value.endereco} onChange={(e) => set('endereco', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={fieldId('numero')} className={labelClass}>
            Número
          </Label>
          <Input id={fieldId('numero')} value={value.numero} onChange={(e) => set('numero', e.target.value)} />
        </div>
        <div>
          <Label htmlFor={fieldId('complemento')} className={labelClass}>
            Complemento (opcional)
          </Label>
          <Input id={fieldId('complemento')} value={value.complemento} onChange={(e) => set('complemento', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={fieldId('bairro')} className={labelClass}>
            Bairro
          </Label>
          <Input id={fieldId('bairro')} value={value.bairro} onChange={(e) => set('bairro', e.target.value)} />
        </div>
        <div>
          <Label htmlFor={fieldId('cidade')} className={labelClass}>
            Cidade
          </Label>
          <Input id={fieldId('cidade')} value={value.cidade} onChange={(e) => set('cidade', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={fieldId('estado')} className={labelClass}>
            Estado
          </Label>
          <Select
            items={ESTADOS_BRASIL.map((e) => ({ label: e.sigla, value: e.sigla }))}
            value={value.estado || null}
            onValueChange={(v) => set('estado', (v as string) ?? '')}
          >
            <SelectTrigger id={fieldId('estado')}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS_BRASIL.map((e) => (
                <SelectItem key={e.sigla} value={e.sigla}>
                  {e.sigla} — {e.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={fieldId('cep')} className={labelClass}>
            CEP
          </Label>
          <Input
            id={fieldId('cep')}
            inputMode="numeric"
            placeholder="00000-000"
            maxLength={9}
            value={value.cep}
            onChange={(e) => set('cep', formatCep(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}

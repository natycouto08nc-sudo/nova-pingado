import type { ReactNode } from 'react';
import { pipsFor } from '@/lib/pingado/profiles';

/** Pequenos blocos visuais compartilhados pelas telas do CRM Pingado (vendedor · admin · vitrine). */

export function PgEyebrow({ children }: { children: ReactNode }) {
  return <div className="text-[9.5px] tracking-[.2em] uppercase text-pg-text-tertiary mb-2">{children}</div>;
}

export function PgTitle({ children, size = 34 }: { children: ReactNode; size?: number }) {
  return (
    <h1 className="font-pg-display font-medium text-pg-green m-0 leading-[1.05]" style={{ fontSize: size }}>
      {children}
    </h1>
  );
}

export function PgKpi({ label, value, sub, dark }: { label: string; value: ReactNode; sub?: ReactNode; dark?: boolean }) {
  return (
    <div className={`rounded-[3px] border px-[18px] pt-[18px] pb-4 ${dark ? 'bg-pg-green border-pg-green' : 'bg-pg-surface border-[rgba(28,46,35,.10)]'}`}>
      <div className={`text-[9.5px] tracking-[.16em] uppercase ${dark ? 'text-[#8FA394]' : 'text-pg-text-tertiary'}`}>{label}</div>
      <div className={`font-pg-display text-[30px] mt-[10px] ${dark ? 'text-pg-cream' : 'text-pg-green'}`}>{value}</div>
      {sub && <div className={`text-[11.5px] mt-1 ${dark ? 'text-[#C8A98C]' : 'text-pg-text-secondary'}`}>{sub}</div>}
    </div>
  );
}

const TONES = {
  success: 'bg-pg-success-bg text-pg-success-fg',
  warn: 'bg-pg-warn-bg text-pg-warn-fg',
  error: 'bg-pg-error-bg text-pg-error-fg',
  neutral: 'bg-pg-surface-alt text-pg-text-secondary',
  accent: 'bg-pg-accent-bg text-pg-terracotta-text',
};

export function PgBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: keyof typeof TONES }) {
  return (
    <span className={`text-[9.5px] tracking-[.1em] uppercase px-2 py-1 rounded-[2px] whitespace-nowrap ${TONES[tone]}`}>
      {children}
    </span>
  );
}

export function PgPips({ value, dark, size = 6 }: { value: number; dark?: boolean; size?: number }) {
  return (
    <div className="flex gap-[3px]">
      {pipsFor(value).map((on, i) => (
        <span
          key={i}
          className="rounded-full flex-none"
          style={{
            width: size, height: size,
            background: on ? '#C0562B' : dark ? 'rgba(237,230,217,.22)' : '#DED5C6',
          }}
        />
      ))}
    </div>
  );
}

export function PgMatchBar({ pct, width = 44 }: { pct: number; width?: number }) {
  const cor = pct >= 80 ? '#4E7A55' : pct >= 65 ? '#C0562B' : '#B08A6A';
  return (
    <div className="h-1 rounded-[2px] overflow-hidden bg-[#E7DFD1]" style={{ width }}>
      <div className="h-1" style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: cor }} />
    </div>
  );
}

export function PgChip({ label, active, onClick, dark }: { label: string; active: boolean; onClick: () => void; dark?: boolean }) {
  const cls = dark
    ? active ? 'bg-pg-terracotta border-pg-terracotta text-white' : 'bg-pg-green-soft-2 border-[rgba(237,230,217,.22)] text-[#D6CFC0]'
    : active ? 'bg-pg-terracotta border-pg-terracotta text-white' : 'bg-pg-field border-[rgba(28,46,35,.18)] text-[#3C4A3E]';
  return (
    <button type="button" onClick={onClick} className={`cursor-pointer text-xs px-[14px] py-2 rounded-[2px] border transition-colors ${cls}`}>
      {label}
    </button>
  );
}

export function PgCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] ${className}`}>{children}</div>;
}

export function PgEmpty({ children }: { children: ReactNode }) {
  return (
    <div className="bg-pg-surface border border-dashed border-[rgba(28,46,35,.2)] rounded-[3px] px-6 py-10 text-center text-sm text-pg-text-secondary">
      {children}
    </div>
  );
}

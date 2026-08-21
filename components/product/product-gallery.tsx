'use client';

import { useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  imagens: string[];
  nome: string;
}

export function ProductGallery({ imagens, nome }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const imagemAtiva = imagens[selected] ?? imagens[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-card">
        <Image
          key={imagemAtiva}
          src={imagemAtiva}
          alt={nome}
          fill
          priority
          className="object-cover transition-opacity duration-300"
          sizes="(min-width: 1024px) 45vw, 100vw"
        />
      </div>

      {imagens.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 snap-x">
          {imagens.map((imagem, index) => (
            <button
              key={imagem + index}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Ver imagem ${index + 1} de ${nome}`}
              aria-current={selected === index}
              className={cn(
                'relative size-16 shrink-0 snap-start overflow-hidden rounded-lg border-2 bg-card transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                selected === index ? 'border-primary' : 'border-border hover:border-primary/50',
              )}
            >
              <Image src={imagem} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

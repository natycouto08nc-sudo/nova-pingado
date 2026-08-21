import Image from 'next/image';

import type { Cafe } from '@/lib/types';
import { CoffeeSpecs, hasCoffeeSpecs } from '@/components/product/coffee-specs';
import { BrewingGuide, hasBrewingGuide } from '@/components/product/brewing-guide';
import { ConservationCard } from '@/components/product/conservation-card';

interface ProductStoryProps {
  cafe: Cafe;
}

export function ProductStory({ cafe }: ProductStoryProps) {
  const produtor = cafe.produtores;
  const temIntro = Boolean(cafe.descricao || produtor?.descricao);
  const temSpecs = hasCoffeeSpecs(cafe);
  const temPreparo = hasBrewingGuide(cafe);

  return (
    <section aria-labelledby="product-story-heading" className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl space-y-14 px-4 md:px-6">
        <div className="text-center">
          <p className="kicker text-primary">Sobre este café</p>
          <h2
            id="product-story-heading"
            className="mt-4 font-serif text-3xl leading-tight text-balance md:text-4xl"
          >
            {cafe.nome}
          </h2>
        </div>

        {temIntro && (
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <div className="space-y-5">
              {cafe.descricao && (
                <p className="font-serif text-2xl leading-snug text-foreground text-pretty">
                  {cafe.descricao}
                </p>
              )}
              {produtor?.descricao && (
                <p className="border-l-2 border-primary/30 pl-4 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {produtor.nome && <span className="font-semibold text-foreground">{produtor.nome}: </span>}
                  {produtor.descricao}
                </p>
              )}
            </div>

            {cafe.imagem_url && (
              <div className="relative order-first aspect-[4/3] overflow-hidden rounded-2xl md:order-last">
                <Image
                  src={cafe.imagem_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              </div>
            )}
          </div>
        )}

        {temSpecs && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-foreground">Características do café</h3>
            <CoffeeSpecs cafe={cafe} />
          </div>
        )}

        {temPreparo ? (
          <div className="grid gap-10 sm:grid-cols-2">
            <div className="flex flex-col gap-4">
              <h3 className="font-serif text-xl text-foreground">Como recomendamos preparar</h3>
              <BrewingGuide cafe={cafe} className="flex-1" />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-serif text-xl text-foreground">Conservação</h3>
              <ConservationCard className="flex-1" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-foreground">Conservação</h3>
            <ConservationCard />
          </div>
        )}
      </div>
    </section>
  );
}

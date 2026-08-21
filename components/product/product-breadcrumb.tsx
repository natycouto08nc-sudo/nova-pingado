import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ProductBreadcrumbProps {
  categoria: string;
  nome: string;
}

export function ProductBreadcrumb({ categoria, nome }: ProductBreadcrumbProps) {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Produtos', href: '/loja' },
    { label: categoria, href: '/loja' },
  ];

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <Link
              href={item.href}
              className="transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
            >
              {item.label}
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
          </li>
        ))}
        <li aria-current="page" className="text-foreground font-medium truncate max-w-[50vw]">
          {nome}
        </li>
      </ol>
    </nav>
  );
}

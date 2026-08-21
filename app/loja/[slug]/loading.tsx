import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function ProductLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 md:px-6 md:py-12">
          <div className="h-3 w-64 animate-pulse rounded bg-muted" />
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-muted" />
            <div className="space-y-4">
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-10 w-40 animate-pulse rounded bg-muted" />
              <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
              <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

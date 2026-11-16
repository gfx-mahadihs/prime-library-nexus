import { ArrowDownRight, ArrowUpRight, Search } from "lucide-react";
import { useState } from "react";
import type { Book, BookFilters, Category } from "@/types/library";
import { filterCatalogue } from "@/services/catalogue";
import { BookCard, BookGrid } from "./BookCard";
import { Chip, FilterPanel, SearchBar } from "./SearchFilters";
import { EmptyState } from "@/components/shared/states";
import { cn } from "@/lib/utils";
import { bookCornerImages } from "@/data/bookCornerImages";

type CornerImage = { id: string; image: string; alt: string; title?: string };

function EditorialImage({
  image,
  className,
  priority = false,
}: {
  image: CornerImage;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {failed ? (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-bluegray/60 via-card to-lime/40">
          <span className="px-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Replaceable image
          </span>
        </div>
      ) : (
        <img
          src={image.image}
          alt={image.alt}
          loading={priority ? "eager" : "lazy"}
          onError={() => setFailed(true)}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}
    </div>
  );
}

function SectionRule({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 border-t border-foreground/15 pt-3">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {children}
      </span>
      <span className="h-px flex-1 bg-foreground/10" />
    </div>
  );
}

export function BookCorner({
  books,
  categories,
  filters,
  onChange,
  mode = "explore",
}: {
  books: Book[];
  categories: Category[];
  filters: BookFilters;
  onChange: (patch: Partial<BookFilters>) => void;
  mode?: "explore" | "search";
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filteredBooks = filterCatalogue(books, filters);
  const authors = [...new Set(books.flatMap((book) => book.authors))].sort();
  const languages = [...new Set(books.map((book) => book.language))].sort();
  const years = [
    ...new Set(books.map((book) => book.publicationYear).filter(Boolean) as number[]),
  ].sort((a, b) => b - a);
  const isFiltered = Boolean(
    filters.q ||
    filters.category ||
    filters.author ||
    filters.language ||
    filters.year ||
    filters.availableOnly,
  );
  const gallery = bookCornerImages.gallery;

  return (
    <div className="mx-auto max-w-7xl">
      <header className="border-b border-foreground/15 pb-5">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
            The Book Corner
          </p>
          <span className="text-xs text-muted-foreground">01 / 05</span>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <h1 className="max-w-3xl font-serif text-5xl leading-[0.96] tracking-[-0.06em] text-foreground sm:text-7xl lg:text-8xl">
            A quiet place
            <br />
            for curious minds.
          </h1>
          <p className="max-w-[18rem] text-sm leading-6 text-muted-foreground">
            Browse a considered collection of stories, ideas, and places to take with you.
          </p>
        </div>
      </header>

      <section className="grid gap-8 border-b border-foreground/15 py-8 md:grid-cols-[1.4fr_0.6fr] md:py-12">
        <div className="group relative min-h-[22rem] overflow-hidden bg-ink sm:min-h-[31rem]">
          <EditorialImage image={bookCornerImages.featured} priority className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-primary-foreground sm:inset-x-8 sm:bottom-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-lime">
                Featured
              </p>
              <h2 className="mt-2 font-serif text-3xl tracking-tight sm:text-5xl">
                {bookCornerImages.featured.title}
              </h2>
            </div>
            <ArrowUpRight className="size-7 shrink-0" />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-8">
          <p className="max-w-xs font-serif text-2xl leading-tight sm:text-3xl">
            “The best discoveries often begin with a little time and a good question.”
          </p>
          <div className="flex items-end justify-between border-t border-foreground/15 pt-4 text-xs text-muted-foreground">
            <span>Notes for slow afternoons</span>
            <ArrowDownRight className="size-5 text-foreground" />
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <SectionRule>Collected references</SectionRule>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {gallery.slice(0, 4).map((image, index) => (
            <div
              key={image.id}
              className={cn(
                "group",
                index === 1 && "sm:translate-y-10",
                index === 3 && "sm:translate-y-5",
              )}
            >
              <EditorialImage image={image} className="aspect-[4/5]" />
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                0{index + 1} / 04
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-foreground/15 py-8 sm:py-12">
        <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-14">
          <div>
            <SectionRule>Find your next read</SectionRule>
            <h2 className="mt-5 font-serif text-4xl leading-none tracking-[-0.04em] sm:text-6xl">
              Search the
              <br />
              collection.
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
              {mode === "search"
                ? "Use the search to find a title, author, or subject that stays with you."
                : "Start with a word, a name, or a feeling. We will take it from there."}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <Search className="size-4 text-muted-foreground" />
              <SearchBar
                value={filters.q ?? ""}
                onChange={(q) => onChange({ q: q.slice(0, 100) || undefined })}
                onToggleFilters={() => setFiltersOpen((open) => !open)}
                filtersOpen={filtersOpen}
              />
            </div>
            <FilterPanel
              open={filtersOpen}
              filters={filters}
              categories={categories}
              authors={authors}
              languages={languages}
              years={years}
              onChange={onChange}
            />
            <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
              <Chip active={!filters.category} onClick={() => onChange({ category: undefined })}>
                All
              </Chip>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  active={filters.category === category.slug}
                  onClick={() => onChange({ category: category.slug })}
                >
                  {category.name}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <SectionRule>{isFiltered ? "Matching results" : "The collection"}</SectionRule>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">
              {isFiltered ? "For you" : "Worth a closer look"}
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">{filteredBooks.length} titles</span>
        </div>
        <div className="mt-7">
          {filteredBooks.length ? (
            <BookGrid>
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </BookGrid>
          ) : (
            <EmptyState
              title="Nothing found yet"
              description="Try another title, author, or category."
            />
          )}
        </div>
      </section>

      <section className="border-t border-foreground/15 py-8 sm:py-12">
        <SectionRule>More to explore</SectionRule>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {bookCornerImages.collections.map((collection) => (
            <div key={collection.id} className="group">
              <EditorialImage image={collection} className="aspect-[4/3]" />
              <div className="mt-3 flex items-center justify-between gap-3">
                <h3 className="font-serif text-2xl">{collection.title}</h3>
                <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

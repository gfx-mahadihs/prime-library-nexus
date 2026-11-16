import { useSearch, useNavigate } from "@tanstack/react-router";
import { Page } from "@/components/layout/AppLayout";
import { useSuspenseQuery } from "@tanstack/react-query";
import { publicCatalogueQuery } from "@/services/public-catalogue";
import { PublicLibraryLayout } from "@/components/layout/PublicLibraryLayout";
import type { BookFilters } from "@/types/library";
import { BookCorner } from "./BookCorner";

export function Explore() {
  const filters: BookFilters = useSearch({ strict: false });
  const navigate = useNavigate();
  const update = (patch: Partial<BookFilters>) =>
    navigate({
      to: "/explore",
      search: (previous) => ({ ...previous, ...patch }),
      replace: true,
    });

  const { data: catalogue } = useSuspenseQuery(publicCatalogueQuery);

  return (
    <PublicLibraryLayout>
      <Page>
        <BookCorner
          books={catalogue.books}
          categories={catalogue.categories}
          filters={filters}
          onChange={(patch) => void update(patch)}
          mode="explore"
        />
      </Page>
    </PublicLibraryLayout>
  );
}

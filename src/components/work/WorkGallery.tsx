"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import Masonry from "react-masonry-css";

import { Input } from "~/components/ui";
import { cn } from "~/lib/cn";
import { api, type RouterOutputs } from "~/trpc/react";

import { WorkCard, type WorkCardWork } from "./WorkCard";

type WorkListItem = RouterOutputs["works"]["listAll"][number];
type CategoryItem = RouterOutputs["categories"]["listPublic"][number];

const MASONRY_BREAKPOINTS = {
  default: 3,
  1024: 2,
  640: 1,
} as const;

function toWorkCardWork(work: WorkListItem): WorkCardWork {
  return {
    slug: work.slug,
    title: work.title,
    subtitle: work.subtitle,
    coverImageUrl: work.coverImageUrl,
    coverIsAnimated: work.coverIsAnimated,
    categories: work.categories.map((category) => ({
      id: category.id,
      name: category.name,
    })),
  };
}

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase();
}

function matchesSearch(work: WorkListItem, query: string): boolean {
  if (!query) {
    return true;
  }

  if (work.title.toLowerCase().includes(query)) {
    return true;
  }

  return work.categories.some((category) =>
    category.name.toLowerCase().includes(query),
  );
}

function matchesCategory(work: WorkListItem, categoryId: string): boolean {
  if (categoryId === "all") {
    return true;
  }

  return work.categories.some((category) => category.id === categoryId);
}

function CategoryPill({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        selected
          ? "bg-accent text-accent-foreground"
          : "border border-border bg-background text-foreground hover:border-accent/40 hover:text-accent",
      )}
    >
      {label}
    </button>
  );
}

export function WorkGallery() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: works = [],
    isLoading: worksLoading,
    isError: worksError,
  } = api.works.listAll.useQuery();
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = api.categories.listPublic.useQuery();

  const normalizedQuery = normalizeQuery(searchQuery);

  const filteredWorks = useMemo(() => {
    return works.filter(
      (work) =>
        matchesCategory(work, selectedCategoryId) &&
        matchesSearch(work, normalizedQuery),
    );
  }, [works, selectedCategoryId, normalizedQuery]);

  const isLoading = worksLoading || categoriesLoading;
  const isError = worksError || categoriesError;

  return (
    <div className="mt-12 flex flex-col gap-8 md:mt-16">
      <div className="flex flex-col gap-6">
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by title or category…"
            aria-label="Search work by title or category"
            className="pl-11"
          />
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          <CategoryPill
            label="All"
            selected={selectedCategoryId === "all"}
            onSelect={() => setSelectedCategoryId("all")}
          />
          {categories.map((category: CategoryItem) => (
            <CategoryPill
              key={category.id}
              label={category.name}
              selected={selectedCategoryId === category.id}
              onSelect={() => setSelectedCategoryId(category.id)}
            />
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="py-16 text-center text-sm text-muted">Loading work…</p>
      ) : isError ? (
        <p className="py-16 text-center text-sm text-muted">
          Unable to load work. Please try again later.
        </p>
      ) : works.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">No work yet</p>
      ) : filteredWorks.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">No work found</p>
      ) : (
        <Masonry
          breakpointCols={MASONRY_BREAKPOINTS}
          className="-ml-8 flex w-auto"
          columnClassName="pl-8 bg-clip-padding"
        >
          {filteredWorks.map((work) => (
            <div key={work.id} className="mb-8">
              <WorkCard work={toWorkCardWork(work)} />
            </div>
          ))}
        </Masonry>
      )}

      {filteredWorks.length > 0 ? (
        <p className="sr-only" aria-live="polite">
          Showing {filteredWorks.length} of {works.length} works
        </p>
      ) : null}
    </div>
  );
}

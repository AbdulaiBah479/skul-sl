import { Suspense } from "react";
import SearchClient from "@/components/SearchClient";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="skeleton h-14" aria-label="Loading search" />}>
      <SearchClient />
    </Suspense>
  );
}

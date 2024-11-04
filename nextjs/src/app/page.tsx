import VideoCardSkeleton from "@/components/VideoCardSkeleton";
import { VideosList } from "@/components/VideosList";
import { Suspense } from "react";

export default async function Home(
  props: {
    searchParams: Promise<{ search: string }>;
  }
) {
  const searchParams = await props.searchParams;
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Suspense fallback={Array.from({ length: 15 }, (_, index) => (
          <VideoCardSkeleton key={index} />
        ))}>
          <VideosList search={searchParams.search} />
        </Suspense>
      </div>
    </main>
  );
}

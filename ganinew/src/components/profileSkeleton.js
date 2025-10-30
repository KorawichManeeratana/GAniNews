"use client";
import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSkeleton = ()  => {
  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
      {/* Left Column */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col items-center">
        <Skeleton className="w-24 h-24 rounded-full" />

        <Skeleton className="mt-4 w-32 h-6 rounded-full" />
        <Skeleton className="mt-2 w-20 h-4 rounded-full" />

        <div className="mt-6 w-full space-y-3">
          <Skeleton className="w-full h-4 rounded-full" />
          <Skeleton className="w-full h-4 rounded-full" />
          <Skeleton className="w-full h-4 rounded-full" />
        </div>

        <div className="my-4 border-t w-full" />

        <div className="w-full">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Favorite Genres</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="px-3 py-1 rounded-full w-20 h-6" />
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 md:col-span-2 space-y-4">
        <Skeleton className="w-40 h-6 rounded-full" />
        <Skeleton className="w-full h-20 rounded-xl" />

        <div className="flex items-center gap-2">
          <Skeleton className="w-32 h-6 rounded-full" />
          <Skeleton className="w-10 h-6 rounded-full ml-auto" />
        </div>

        <div className="flex flex-nowrap gap-5 overflow-x-auto py-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white shadow-lg rounded-xl flex-shrink-0 min-w-[230px] max-w-[250px] border border-gray-200 p-2"
            >
              <Skeleton className="w-full h-40 rounded-3xl" />
              <Skeleton className="mt-2 w-full h-6 rounded-full" />
              <Skeleton className="mt-2 w-24 h-4 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useDictionary } from "@/app/contexts/DictionaryContext";

export default function EventNotFound() {
  const { public: d } = useDictionary();

  return (
    <h1 className="bg-red-500 text-white text-2xl font-bold text-center my-5 py-5">
      {d.event_not_found}
    </h1>
  );
}

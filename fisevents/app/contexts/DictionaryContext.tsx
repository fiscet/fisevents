'use client';

import { getDictionary } from '@/lib/i18n.utils';
import { createContext, useContext } from 'react';

type DictionaryContextType = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
};

const DictionaryContext = createContext<DictionaryContextType | undefined>(
  undefined
);

export function DictionaryProvider({
  children,
  dictionary
}: {
  children: React.ReactNode;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}) {
  return (
    <DictionaryContext.Provider value={{ dictionary }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (context === undefined) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }

  return context.dictionary;
}

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { acceptToS } from '@/lib/actions';
import Link from 'next/link';
import { useCurrentLang } from '@/hooks/useCurrentLang';

export default function TosGate() {
  const [accepted, setAccepted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const lang = useCurrentLang();

  const handleAccept = () => {
    startTransition(async () => {
      await acceptToS();
      router.refresh();
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Terms of Service and Data Processing Agreement
          </h2>
          <p className="text-sm text-gray-600">
            Before using FisEvents you must read and accept our{' '}
            <Link
              href={`/${lang}/terms`}
              target="_blank"
              className="text-blue-600 underline"
            >
              Terms of Service and DPA
            </Link>
            . As an organizer you act as Data Controller for your participants&apos;
            data; FisEvents acts as your Data Processor (Art. 28 GDPR).
          </p>
        </div>

        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
          <li>You will collect participants&apos; data only for your event.</li>
          <li>You will provide participants with a privacy notice.</li>
          <li>You will handle data subject requests within GDPR deadlines.</li>
          <li>FisEvents processes data only on your behalf.</li>
        </ul>

        <div className="flex items-start gap-3">
          <Checkbox
            id="tos-accept"
            checked={accepted}
            onCheckedChange={(v) => setAccepted(v === true)}
          />
          <label htmlFor="tos-accept" className="text-sm text-gray-700 cursor-pointer leading-snug">
            I have read and accept the{' '}
            <Link
              href={`/${lang}/terms`}
              target="_blank"
              className="text-blue-600 underline"
            >
              Terms of Service and Data Processing Agreement
            </Link>
            .
          </label>
        </div>

        <Button
          onClick={handleAccept}
          disabled={!accepted || isPending}
          className="w-full"
        >
          {isPending ? 'Saving…' : 'Continue to FisEvents'}
        </Button>
      </div>
    </div>
  );
}

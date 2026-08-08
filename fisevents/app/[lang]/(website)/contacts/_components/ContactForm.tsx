'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendContactEmail } from '@/lib/mail-actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';

type Props = {
  labels: {
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    success_title: string;
    success_text: string;
    error_text: string;
    privacy_prefix: string;
    validation: {
      name: string;
      email: string;
      message: string;
      privacy: string;
    };
  };
  lang: Locale;
  privacyPolicyLabel: string;
};

type ContactFormValues = {
  name: string;
  email: string;
  message: string;
  privacyAccepted: boolean;
};

export default function ContactForm({ labels: l, lang, privacyPolicyLabel }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const schema = z.object({
    name: z.string().min(2, l.validation.name),
    email: z.string().email(l.validation.email),
    message: z.string().min(10, l.validation.message).max(1000, l.validation.message),
    privacyAccepted: z.boolean().refine((val) => val === true, {
      message: l.validation.privacy,
    }),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { privacyAccepted: false },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus('sending');

    try {
      const res = await sendContactEmail({ name: data.name, email: data.email, message: data.message });

      if (res?.accepted?.length) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-fe-secondary-fixed/30 border border-fe-secondary/20 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="font-headline font-bold text-fe-on-surface text-xl mb-2">
          {l.success_title}
        </h3>
        <p className="text-fe-on-surface-variant">{l.success_text}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-fe-on-surface mb-1.5">
          {l.name}
        </label>
        <input
          type="text"
          {...register('name')}
          className="w-full px-4 py-2.5 rounded-xl border border-fe-outline-variant bg-fe-surface-container-lowest text-fe-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-fe-primary/30 focus:border-fe-primary transition-colors"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-fe-on-surface mb-1.5">
          {l.email}
        </label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-4 py-2.5 rounded-xl border border-fe-outline-variant bg-fe-surface-container-lowest text-fe-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-fe-primary/30 focus:border-fe-primary transition-colors"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-fe-on-surface mb-1.5">
          {l.message}
        </label>
        <textarea
          {...register('message')}
          rows={5}
          className="w-full px-4 py-2.5 rounded-xl border border-fe-outline-variant bg-fe-surface-container-lowest text-fe-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-fe-primary/30 focus:border-fe-primary transition-colors resize-none"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
        )}
      </div>

      {/* Privacy */}
      <div>
        <div className="flex items-center gap-2">
          <Controller
            name="privacyAccepted"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="privacyAccepted"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <label htmlFor="privacyAccepted" className="text-sm text-fe-on-surface-variant">
            {l.privacy_prefix}{' '}
            <Link
              href={`/${lang}/privacy-cookie-policy`}
              className="text-fe-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
              target="_blank"
            >
              {privacyPolicyLabel}
            </Link>
          </label>
        </div>
        {errors.privacyAccepted && (
          <p className="mt-1 text-xs text-red-500">{errors.privacyAccepted.message}</p>
        )}
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-500">{l.error_text}</p>
      )}

      <Button
        type="submit"
        variant="default"
        size="lg"
        disabled={status === 'sending'}
        className="w-full"
      >
        {status === 'sending' ? l.sending : l.send}
      </Button>
    </form>
  );
}

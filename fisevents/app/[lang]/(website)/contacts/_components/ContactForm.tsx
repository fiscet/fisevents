'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendMail } from '@/lib/send-mail';
import { Button } from '@/components/ui/button';

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
    validation: {
      name: string;
      email: string;
      message: string;
    };
  };
};

type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

export default function ContactForm({ labels: l }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const schema = z.object({
    name: z.string().min(2, l.validation.name),
    email: z.string().email(l.validation.email),
    message: z.string().min(10, l.validation.message).max(1000, l.validation.message),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus('sending');

    const text = `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
    const html = `<p><strong>Name:</strong> ${data.name}</p><p><strong>Email:</strong> ${data.email}</p><p>${data.message}</p>`;

    try {
      const res = await sendMail({
        subject: `FisEvents - Contact form: ${data.name}`,
        text,
        html,
      });

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

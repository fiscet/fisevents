'use client';

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild
} from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Fragment, useState } from 'react';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { FDefaultSession } from '@/types/custom.types';
import { sendMail } from '@/lib/send-mail';
import { useNotification } from '@/components/Notification/useNotification';
import { usePathname } from 'next/navigation';
import { BugReportSchema } from '@/lib/form-schemas';

type BugReportFormValues = z.infer<typeof BugReportSchema>;

export default function ReportBugDialog({
  session
}: {
  session?: FDefaultSession;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const d = useDictionary().creator_admin.shared;

  const pathname = usePathname();

  const userEmail = session?.user?.email ?? '';

  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<BugReportFormValues>({
    resolver: zodResolver(BugReportSchema),
    defaultValues: {
      type: 'bug',
      email: userEmail
    }
  });

  const onSubmit = async (data: BugReportFormValues) => {
    const bodyTxt = `From: ${data.email}\n\nPathname: ${pathname}\n\n${data.description}`;
    const bodyHtml = `<p>From: ${data.email}</p><p>Pathname: ${pathname}</p><p>${data.description}</p>`;

    const emailRes = await sendMail({
      subject: `Fisvents - ${d.report_bug[data.type]}`,
      text: bodyTxt,
      html: bodyHtml
    });

    if (emailRes?.accepted.length) {
      showNotification({
        title: d.report_bug.title,
        message: d.report_bug.ok_text,
        type: 'success'
      });

      reset();

      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    } else {
      showNotification({
        title: d.report_bug.title,
        message: d.error_text,
        type: 'error'
      });
    }
  };

  return (
    <>
      <div
        className="text-orange-700 hover:text-orange-600 underline cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {d.report_bug.title}
      </div>

      {/* Dialog */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          onClose={() => setIsOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {d.report_bug.title}
                  </DialogTitle>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      {d.report_bug.description}
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-4 space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {d.report_bug.type}
                      </label>
                      <select
                        {...register('type')}
                        className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="bug">{d.report_bug.bug}</option>
                        <option value="suggestion">
                          {d.report_bug.suggestion}
                        </option>
                      </select>
                      {errors.type && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.type.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {d.report_bug.text}
                      </label>
                      <textarea
                        {...register('description')}
                        rows={4}
                        className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        {d.report_bug.send}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

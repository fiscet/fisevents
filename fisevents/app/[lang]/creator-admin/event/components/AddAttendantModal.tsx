'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { eventAttendantSchema } from '@/lib/form-schemas';
import { addEventAttendant } from '@/lib/actions';
import { useNotification } from '@/components/Notification/useNotification';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import DefaultFormField from '@/components/FormField/DefaultFormField';
import SaveButton from '../../_components/SaveButton';

export type AttendantFormSchemaType = z.infer<typeof eventAttendantSchema>;

export type AddAttendantModalProps = {
  eventId: string;
};

export default function AddAttendantModal({ eventId }: AddAttendantModalProps) {
  const { creator_admin: ca, public: pd } = useDictionary();
  const { attendants: d, shared: s } = ca;
  const { showNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const formSchema = z
    .object(eventAttendantSchema.shape)
    .refine(data => data.fullName.length > 5, {
      message: pd.validation.fullName,
      path: ['fullName'],
    })
    .refine(data => data.privacyAccepted === true, {
      message: pd.validation.privacy_acceptance,
      path: ['privacyAccepted'],
    });

  const form = useForm<AttendantFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      privacyAccepted: true, // Default to true for admin adding manually
      checkedIn: false,
      paymentStatus: 'pending',
    },
  });

  const onSubmit = (data: AttendantFormSchemaType) => {
    startTransition(async () => {
      try {
        await addEventAttendant({
          eventId,
          eventAttendant: data,
        });
        showNotification({ type: 'success', message: s.success_text });
        setIsOpen(false);
        form.reset();
      } catch (error: unknown) {
        let msg = s.error_text;
        if (error instanceof Error) {
          if (error.message === 'already_subscribed') {
            msg = 'Already subscribed';
          } else if (error.message === 'email_invalid') {
            msg = pd.validation.email || 'Invalid email';
          }
        }
        showNotification({ type: 'error', message: msg });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">{d.new_attendant || 'Add Attendant'}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{d.new_attendant || 'Add Attendant'}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <DefaultFormField
                form={form}
                name="fullName"
                label={pd.fullname}
                formComponent={Input}
                requiredStatus="required"
              />
              <DefaultFormField
                form={form}
                name="email"
                label={pd.email}
                formComponent={Input}
                requiredStatus="required"
              />
              <DefaultFormField
                form={form}
                name="phone"
                label={pd.phone}
                formComponent={Input}
                requiredStatus="optional-with-text"
              />
              <FormField
                control={form.control}
                name="privacyAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <div className="w-full flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel style={{ margin: 0 }}>
                        {pd.privacy_acceptance} *
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="checkedIn"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 flex-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Checked In</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Payment Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="na">Not Applicable</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <SaveButton
                  label={s.save}
                  isEnabled={form.formState.isValid && !isPending}
                />
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

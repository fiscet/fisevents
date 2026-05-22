'use client';

import { useState } from 'react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { EventFormSchemaType } from '../hooks/useEventSingleForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { useDictionary } from '@/app/contexts/DictionaryContext';

type FieldType = 'text' | 'number' | 'select' | 'checkbox';

type CustomFieldsDict =
  ReturnType<typeof useDictionary>['creator_admin']['events']['custom_fields'];

export type CustomFieldsEditorProps = {
  form: UseFormReturn<EventFormSchemaType>;
};

export default function CustomFieldsEditor({ form }: CustomFieldsEditorProps) {
  const { creator_admin: ca } = useDictionary();
  const d = ca.events.custom_fields;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'customFields',
  });

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="text-sm text-fe-on-surface-variant">{d.empty}</p>
      )}

      {fields.map((field, index) => (
        <CustomFieldRow
          key={field.id}
          form={form}
          index={index}
          d={d}
          onRemove={() => remove(index)}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            label: '',
            fieldType: 'text',
            required: false,
            options: [],
          })
        }
      >
        <Plus className="w-4 h-4 mr-2" />
        {d.add}
      </Button>
    </div>
  );
}

type CustomFieldRowProps = {
  form: UseFormReturn<EventFormSchemaType>;
  index: number;
  d: CustomFieldsDict;
  onRemove: () => void;
};

function CustomFieldRow({ form, index, d, onRemove }: CustomFieldRowProps) {
  const fieldType = (form.watch(`customFields.${index}.fieldType`) ??
    'text') as FieldType;

  // Local state keeps the raw text (commas included) so typing isn't disrupted
  // by the array round-trip; the form array is kept in sync for submission.
  const [optionsText, setOptionsText] = useState(
    (form.getValues(`customFields.${index}.options`) ?? []).join(', ')
  );

  const hints: Record<FieldType, string> = {
    text: d.hint_text,
    number: d.hint_number,
    select: d.hint_select,
    checkbox: d.hint_checkbox,
  };

  return (
    <div className="rounded-xl border border-fe-outline-variant/30 p-4 space-y-3">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs text-fe-on-surface-variant">{d.label}</label>
          <Input
            {...form.register(`customFields.${index}.label`)}
            placeholder={d.label_placeholder}
          />
        </div>
        <div className="w-40">
          <label className="text-xs text-fe-on-surface-variant">{d.type}</label>
          <Select
            value={fieldType}
            onValueChange={(v) =>
              form.setValue(`customFields.${index}.fieldType`, v as FieldType, {
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">{d.type_text}</SelectItem>
              <SelectItem value="number">{d.type_number}</SelectItem>
              <SelectItem value="select">{d.type_select}</SelectItem>
              <SelectItem value="checkbox">{d.type_checkbox}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          aria-label={d.remove}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>

      <p className="text-xs text-fe-on-surface-variant">{hints[fieldType]}</p>

      {fieldType === 'select' && (
        <div>
          <label className="text-xs text-fe-on-surface-variant">
            {d.options}
          </label>
          <Input
            value={optionsText}
            placeholder={d.options_placeholder}
            onChange={(e) => {
              const raw = e.target.value;
              setOptionsText(raw);
              form.setValue(
                `customFields.${index}.options`,
                raw
                  .split(',')
                  .map((o) => o.trim())
                  .filter(Boolean),
                { shouldDirty: true }
              );
            }}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Switch
          checked={!!form.watch(`customFields.${index}.required`)}
          onCheckedChange={(v) =>
            form.setValue(`customFields.${index}.required`, v, {
              shouldDirty: true,
            })
          }
        />
        <span className="text-sm">{d.required}</span>
      </div>
    </div>
  );
}

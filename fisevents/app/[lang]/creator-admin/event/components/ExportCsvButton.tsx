'use client';

import { Button } from '@/components/ui/button';
import { CustomFieldDef, EventAttendant } from '@/types/sanity.types';
import { getCustomFieldKey } from '@/lib/custom-fields';
import { Download } from 'lucide-react';

export type ExportCsvButtonProps = {
  attendants?: EventAttendant[];
  customFields?: Array<Partial<CustomFieldDef>>;
  filename?: string;
};

const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;

export default function ExportCsvButton({
  attendants,
  customFields,
  filename = 'attendants.csv',
}: ExportCsvButtonProps) {
  const handleExport = () => {
    if (!attendants || attendants.length === 0) return;

    const customDefs = (customFields ?? []).filter((f) => getCustomFieldKey(f));

    // Define CSV headers
    const headers = [
      'Full Name',
      'Email',
      'Phone',
      'Subscription Date',
      'Checked In',
      'Payment Status',
      ...customDefs.map((f) => f.label ?? getCustomFieldKey(f)),
    ];

    // Create CSV rows
    const rows = attendants.map(attendant => [
      escapeCsv(attendant.fullName || ''),
      escapeCsv(attendant.email || ''),
      escapeCsv(attendant.phone || ''),
      escapeCsv(attendant.subcribitionDate ? new Date(attendant.subcribitionDate).toLocaleString() : ''),
      escapeCsv(attendant.checkedIn ? 'Yes' : 'No'),
      escapeCsv(attendant.paymentStatus || 'Pending'),
      ...customDefs.map((f) => {
        const key = getCustomFieldKey(f);
        const value =
          attendant.customFieldValues?.find((v) => v.name === key)?.value ?? '';
        return escapeCsv(value);
      }),
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={!attendants || attendants.length === 0}
    >
      <Download className="w-4 h-4 mr-2" />
      Export CSV
    </Button>
  );
}

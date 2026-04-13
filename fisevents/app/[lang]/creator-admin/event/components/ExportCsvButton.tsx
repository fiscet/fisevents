'use client';

import { Button } from '@/components/ui/button';
import { EventAttendant } from '@/types/sanity.types';
import { Download } from 'lucide-react';

export type ExportCsvButtonProps = {
  attendants?: EventAttendant[];
  filename?: string;
};

export default function ExportCsvButton({
  attendants,
  filename = 'attendants.csv',
}: ExportCsvButtonProps) {
  const handleExport = () => {
    if (!attendants || attendants.length === 0) return;

    // Define CSV headers
    const headers = [
      'Full Name',
      'Email',
      'Phone',
      'Subscription Date',
      'Checked In',
      'Payment Status',
    ];

    // Create CSV rows
    const rows = attendants.map(attendant => [
      `"${attendant.fullName || ''}"`,
      `"${attendant.email || ''}"`,
      `"${attendant.phone || ''}"`,
      `"${attendant.subcribitionDate ? new Date(attendant.subcribitionDate).toLocaleString() : ''}"`,
      `"${attendant.checkedIn ? 'Yes' : 'No'}"`,
      `"${attendant.paymentStatus || 'Pending'}"`,
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
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

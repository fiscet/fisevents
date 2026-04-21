import Link from 'next/link';

export type SubscribeAnchorProps = {
  anchorId: string;
  label: string;
};

export default function SubscribeAnchor({
  anchorId,
  label,
}: SubscribeAnchorProps) {
  return (
    <div className="text-center mt-2 mb-6">
      <Link
        href={anchorId}
        className="inline-block bg-gradient-to-r from-fe-primary to-fe-primary-container text-fe-on-primary px-8 py-4 rounded-xl font-headline font-bold shadow-editorial hover:scale-[0.98] transition-transform"
      >
        {label}
      </Link>
    </div>
  );
}

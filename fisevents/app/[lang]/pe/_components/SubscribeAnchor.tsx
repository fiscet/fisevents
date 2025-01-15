import Link from 'next/link';

export type SubscribeAnchorProps = {
  anchorId: string;
  label: string;
};

export default function SubscribeAnchor({
  anchorId,
  label
}: SubscribeAnchorProps) {
  return (
    <div className="text-center mt-2 mb-6">
      <Link
        href={anchorId}
        className="bg-orange-600 text-white p-4 rounded-md shadow-md hover:bg-orange-700 hover:shadow-sm"
      >
        {label}
      </Link>
    </div>
  );
}

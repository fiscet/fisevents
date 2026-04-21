import { BiMinus } from 'react-icons/bi';

export default function NumAttendants({ num }: { num?: number }) {
  if (num) {
    return (
      <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-fe-secondary-container text-fe-on-secondary-container text-sm font-semibold">
        {num}
      </span>
    );
  }

  return <BiMinus className="w-5 h-5 text-fe-on-surface-variant" />;
}

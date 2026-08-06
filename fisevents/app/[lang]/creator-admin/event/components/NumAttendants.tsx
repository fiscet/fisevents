import { BiMinus } from 'react-icons/bi';

export type NumAttendantsProps = {
  num?: number;
  /** People currently waiting for a spot to free up. */
  waiting?: number;
  /** Tooltip on the waiting badge, e.g. "2 on the waitlist". */
  waitingLabel?: string;
};

export default function NumAttendants({ num, waiting, waitingLabel }: NumAttendantsProps) {
  return (
    <span className="inline-flex items-center gap-1">
      {num ? (
        <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-fe-secondary-container text-fe-on-secondary-container text-sm font-semibold">
          {num}
        </span>
      ) : (
        <BiMinus className="w-5 h-5 text-fe-on-surface-variant" />
      )}
      {!!waiting && (
        <span
          title={waitingLabel}
          className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold"
        >
          +{waiting}
        </span>
      )}
    </span>
  );
}

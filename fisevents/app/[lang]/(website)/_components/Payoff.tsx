// Kept for backward compatibility — homepage now uses a full Hero section instead.
export type PayoffProps = {
  text: string;
};

export default function Payoff({ text }: PayoffProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <p className="text-center italic text-xl text-fe-on-surface-variant font-body">
        <q>{text}</q>
      </p>
    </div>
  );
}

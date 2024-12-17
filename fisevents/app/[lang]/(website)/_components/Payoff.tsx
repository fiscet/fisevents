export type PayoffProps = {
  text: string;
};

export default function Payoff({ text }: PayoffProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <p className="text-center italic text-xl text-gray-600">
        <q>{text}</q>
      </p>
    </div>
  );
}

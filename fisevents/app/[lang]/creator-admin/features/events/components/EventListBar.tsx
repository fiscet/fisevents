export type EventListBarProps = {
  leftElements?: React.ReactNode;
  rightElements?: React.ReactNode;
};

export default function EventListBar({
  leftElements,
  rightElements
}: EventListBarProps) {
  const leftItems = leftElements ?? <></>;
  const rightItems = rightElements ?? <></>;
  return (
    <div className="flex gap-1 items-center justify-between mx-4 mb-6">
      <div className="flex gap-1">{leftItems}</div>
      <div className="flex gap-1">{rightItems}</div>
    </div>
  );
}

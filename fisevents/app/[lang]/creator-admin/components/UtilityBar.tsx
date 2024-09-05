export type UtilityBarProps = {
  leftElements?: React.ReactNode;
  rightElements?: React.ReactNode;
};

export default function UtilityBar({
  leftElements,
  rightElements
}: UtilityBarProps) {
  const leftItems = leftElements ?? <></>;
  const rightItems = rightElements ?? <></>;
  return (
    <div className="flex gap-1 items-center justify-between mx-4 mt-2 mb-6">
      <div className="flex gap-1">{leftItems}</div>
      <div className="flex gap-1">{rightItems}</div>
    </div>
  );
}

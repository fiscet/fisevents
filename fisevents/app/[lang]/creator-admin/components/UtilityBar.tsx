export type UtilityBarProps = {
  leftElements?: React.ReactNode;
  centerElements?: React.ReactNode;
  rightElements?: React.ReactNode;
};

export default function UtilityBar({
  leftElements,
  centerElements,
  rightElements
}: UtilityBarProps) {
  const leftItems = leftElements ?? <></>;
  const centerItems = centerElements ?? <></>;
  const rightItems = rightElements ?? <></>;
  return (
    <div className="flex gap-1 items-center justify-between mx-4 mt-2 mb-6">
      <div className="flex gap-1">{leftItems}</div>
      <div className="flex gap-1">{centerItems}</div>
      <div className="flex gap-1">{rightItems}</div>
    </div>
  );
}

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
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-2 md:gap-1 mx-4 mt-2 mb-2 md:mb-6 items-center">
      <div className="flex gap-1 justify-center md:justify-start">
        {leftItems}
      </div>
      <div className="flex gap-1 justify-center">{centerItems}</div>
      <div className="flex gap-1 justify-center md:justify-end">
        {rightItems}
      </div>
    </div>
  );
}

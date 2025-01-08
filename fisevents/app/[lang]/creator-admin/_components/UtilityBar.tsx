import { cn } from '@/lib/utils';

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

  const mdCols = centerElements
    ? 'md:grid-cols-[1fr_2fr_1fr]'
    : 'md:grid-cols-2';

  return (
    <div
      className={cn(
        `grid grid-cols-1 gap-2 md:gap-1 mx-4 mt-2 mb-2 md:mb-6 items-center`,
        mdCols
      )}
    >
      <div className="flex gap-1 justify-center md:justify-start">
        {leftItems}
      </div>
      {centerElements && (
        <div className="flex gap-1 justify-center">{centerItems}</div>
      )}
      <div className="flex gap-1 justify-center md:justify-end">
        {rightItems}
      </div>
    </div>
  );
}

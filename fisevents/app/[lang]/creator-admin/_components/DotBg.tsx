export type DotBgProps = {
  /**
   * Color of the dot
   */
  color?: string;

  /**
   * Size of the dot in pixels
   */
  size?: number;

  /**
   * Spacing between dots
   */
  spacing?: number;

  /**
   * Content of the component
   */
  children?: React.ReactNode;

  /**
   * Class name
   */
  className?: string;

  style?: React.CSSProperties;
};

export default function DotBg({
  color = '#eee',
  size = 1,
  spacing = 20,
  children,
  className,
  style = {
    backgroundColor: 'white'
  }
}: DotBgProps) {
  return (
    <div
      style={{
        ...style,
        backgroundImage: `radial-gradient(${color} ${size}px, transparent ${size}px)`,
        backgroundSize: `calc(${spacing} * ${size}px) calc(${spacing} * ${size}px)`
      }}
      className={className}
    >
      {children}
    </div>
  );
}

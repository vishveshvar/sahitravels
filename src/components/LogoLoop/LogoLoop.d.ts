import { ComponentType, CSSProperties, ReactNode } from "react";

export interface LogoItem {
  node?: ReactNode;
  src?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  href?: string;
  ariaLabel?: string;
  hoverColor?: string;
}

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: string | number;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutWidth?: number;
  scaleOnHover?: boolean;
  layout?: "line" | "wave";
  bend?: number;
  focus?: number;
  magnify?: number;
  tiltX?: number;
  tiltY?: number;
  step?: boolean;
  muted?: number;
  labels?: "none" | "inline" | "below" | "hover";
  draggable?: boolean;
  intro?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  renderItem?: (item: LogoItem, key: string) => ReactNode;
}

declare const LogoLoop: ComponentType<LogoLoopProps>;

export default LogoLoop;


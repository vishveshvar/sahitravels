import { ComponentType, CSSProperties, ReactNode } from "react";

export interface CounterProps {
  value?: number;
  locale?: string;
  format?: Intl.NumberFormatOptions;
  decimals?: number;
  minDigits?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  direction?: "auto" | "up" | "down" | "shortest";
  duration?: number;
  bounce?: number;
  stagger?: number;
  motionBlur?: boolean;
  intro?: boolean;
  fade?: number;
  fontSize?: number | string;
  fontWeight?: number | string;
  textColor?: string;
  gap?: number;
  padding?: number;
  tabular?: boolean;
  digitStyle?: CSSProperties;
  className?: string;
  style?: CSSProperties;
}

declare const Counter: ComponentType<CounterProps>;

export default Counter;


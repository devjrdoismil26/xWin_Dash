import React from 'react';

// Declarações de módulos para bibliotecas sem tipos
declare module 'react-big-calendar' {
  import { ComponentType } from 'react';
  
  export interface CalendarEvent {
  id?: string | number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: Record<string, any>; }

  export interface CalendarProps {
  events: CalendarEvent[];
  onSelectEvent??: (e: any) => void;
  onSelectSlot??: (e: any) => void;
  selectable?: boolean;
  localizer: unknown;
  style?: React.CSSProperties;
  className?: string;
  views?: string[];
  defaultView?: string;
  step?: number;
  timeslots?: number;
  min?: Date;
  max?: Date;
  scrollToTime?: Date;
  culture?: string;
  formats?: string;
  components?: string;
  messages?: string;
  dayLayoutAlgorithm?: string;
  popup?: boolean;
  popupOffset?: number | { x: number;
  y: number;
};

    onNavigate??: (e: any) => void;
    onView??: (e: any) => void;
    onDrillDown??: (e: any) => void;
    onShowMore??: (e: any) => void;
    showMultiDayTimes?: boolean;
    max?: Date;
    getNow?: () => Date;
    length?: number;
    toolbar?: boolean;
    date?: Date;
    view?: string;
    drilldownView?: string;
    titleAccessor?: string | ((event: unknown) => string);

    tooltipAccessor?: string | ((event: unknown) => string);

    allDayAccessor?: string | ((event: unknown) => boolean);

    startAccessor?: string | ((event: unknown) => Date);

    endAccessor?: string | ((event: unknown) => Date);

    resourceAccessor?: string | ((event: unknown) => any);

    resourceIdAccessor?: string | ((resource: unknown) => any);

    resourceTitleAccessor?: string | ((resource: unknown) => string);

    eventPropGetter?: (event: unknown, start: Date, end: Date, isSelected: boolean) => Record<string, any>;
    slotPropGetter?: (date: Date) => Record<string, any>;
    dayPropGetter?: (date: Date) => Record<string, any>;
    showAllEvents?: boolean;
    doShowMoreDrillDown?: boolean;
  }

  const Calendar: ComponentType<CalendarProps>;
  export default Calendar;

  export const momentLocalizer: (moment: unknown) => any;
  export const dateFnsLocalizer: (config: unknown) => any;
  export const globalizeLocalizer: (globalizeInstance: unknown) => any;
  export const Views: {
    MONTH: string;
    WEEK: string;
    WORK_WEEK: string;
    DAY: string;
    AGENDA: string;};

}

declare module 'react-syntax-highlighter' {
  import { ComponentType } from 'react';
  
  export interface SyntaxHighlighterProps {
  language?: string;
  style?: string;
  customStyle?: React.CSSProperties;
  codeTagProps?: string;
  useInlineStyles?: boolean;
  showLineNumbers?: boolean;
  showInlineLineNumbers?: boolean;
  startingLineNumber?: number;
  lineNumberContainerStyle?: React.CSSProperties;
  lineNumberStyle?: React.CSSProperties | ((lineNumber: number) => React.CSSProperties);
  wrapLines?: boolean;
  wrapLongLines?: boolean;
  lineProps?: string;
  renderer?: string;
  PreTag?: string | ComponentType<Record<string, any>>;
  CodeTag?: string | ComponentType<Record<string, any>>;
  children: string;
  [key: string]: unknown; }

  const SyntaxHighlighter: ComponentType<SyntaxHighlighterProps>;
  export default SyntaxHighlighter;
  
  export const Prism: ComponentType<SyntaxHighlighterProps>;
  export const Light: ComponentType<SyntaxHighlighterProps>;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const styles: { [key: string]: Record<string, any>};

  export default styles;
  export const tomorrow: unknown;
  export const twilight: unknown;
  export const prism: unknown;
  export const atomDark: unknown;
  export const base16AteliersulphurpoolLight: unknown;
  export const cb: unknown;
  export const coldarkCold: unknown;
  export const coldarkDark: unknown;
  export const coy: unknown;
  export const darcula: unknown;
  export const dark: unknown;
  export const duotoneDark: unknown;
  export const duotoneEarth: unknown;
  export const duotoneForest: unknown;
  export const duotoneLight: unknown;
  export const duotoneSea: unknown;
  export const duotoneSpace: unknown;
  export const funky: unknown;
  export const ghcolors: unknown;
  export const hopscotch: unknown;
  export const materialDark: unknown;
  export const materialLight: unknown;
  export const materialOceanic: unknown;
  export const nord: unknown;
  export const okaidia: unknown;
  export const oneDark: unknown;
  export const oneLight: unknown;
  export const pojoaque: unknown;
  export const shadesOfPurple: unknown;
  export const solarizedlight: unknown;
  export const synthwave84: unknown;
  export const vs: unknown;
  export const vscDarkPlus: unknown;
  export const xonokai: unknown;
}

declare module 'moment' {
  interface Moment {
  format(format?: string): string;
  add(amount?: number, unit?: string): Moment;
  subtract(amount?: number, unit?: string): Moment;
  startOf(unit: string): Moment;
  endOf(unit: string): Moment;
  isSame(other: Moment | string | Date, unit?: string): boolean;
  isBefore(other: Moment | string | Date, unit?: string): boolean;
  isAfter(other: Moment | string | Date, unit?: string): boolean;
  clone(): Moment;
  toDate(): Date;
  valueOf(): number;
  unix(): number;
  utc(): Moment;
  local(): Moment;
  isValid(): boolean; }

  interface MomentStatic {
  (date?: string | number | Date | Moment): Moment;
  utc(date?: string | number | Date | Moment): Moment;
  unix(timestamp: number): Moment;
  locale(locale: string): void;
  locale(): string;
  localeData(locale?: string): unknown;
  duration(amount?: number, unit?: string): unknown;
  isDuration(obj: unknown): boolean;
  isMoment(obj: unknown): obj is Moment;
  isDate(obj: unknown): obj is Date;
  now(): number;
  min(...moments: Moment[]): Moment;
  max(...moments: Moment[]): Moment; }

  const moment: MomentStatic;
  export = moment;
}

export {  };

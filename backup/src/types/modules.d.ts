
// Declarações de módulos para bibliotecas sem tipos
declare module 'react-big-calendar' {
  import { ComponentType } from 'react';
  
  export interface CalendarEvent {
    id?: string | number;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
  }

  export interface CalendarProps {
    events: CalendarEvent[];
    onSelectEvent?: (event: CalendarEvent) => void;
    onSelectSlot?: (slotInfo: any) => void;
    selectable?: boolean;
    localizer: any;
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
    formats?: any;
    components?: any;
    messages?: any;
    dayLayoutAlgorithm?: string;
    popup?: boolean;
    popupOffset?: number | { x: number; y: number };
    onNavigate?: (date: Date, view: string, action: string) => void;
    onView?: (view: string) => void;
    onDrillDown?: (date: Date, view: string) => void;
    onShowMore?: (events: CalendarEvent[], date: Date) => void;
    showMultiDayTimes?: boolean;
    max?: Date;
    getNow?: () => Date;
    length?: number;
    toolbar?: boolean;
    date?: Date;
    view?: string;
    drilldownView?: string;
    titleAccessor?: string | ((event: any) => string);
    tooltipAccessor?: string | ((event: any) => string);
    allDayAccessor?: string | ((event: any) => boolean);
    startAccessor?: string | ((event: any) => Date);
    endAccessor?: string | ((event: any) => Date);
    resourceAccessor?: string | ((event: any) => any);
    resourceIdAccessor?: string | ((resource: any) => any);
    resourceTitleAccessor?: string | ((resource: any) => string);
    eventPropGetter?: (event: any, start: Date, end: Date, isSelected: boolean) => any;
    slotPropGetter?: (date: Date) => any;
    dayPropGetter?: (date: Date) => any;
    showAllEvents?: boolean;
    doShowMoreDrillDown?: boolean;
  }

  const Calendar: ComponentType<CalendarProps>;
  export default Calendar;

  export const momentLocalizer: (moment: any) => any;
  export const dateFnsLocalizer: (config: any) => any;
  export const globalizeLocalizer: (globalizeInstance: any) => any;
  export const Views: {
    MONTH: string;
    WEEK: string;
    WORK_WEEK: string;
    DAY: string;
    AGENDA: string;
  };
}

declare module 'react-syntax-highlighter' {
  import { ComponentType } from 'react';
  
  export interface SyntaxHighlighterProps {
    language?: string;
    style?: any;
    customStyle?: React.CSSProperties;
    codeTagProps?: any;
    useInlineStyles?: boolean;
    showLineNumbers?: boolean;
    showInlineLineNumbers?: boolean;
    startingLineNumber?: number;
    lineNumberContainerStyle?: React.CSSProperties;
    lineNumberStyle?: React.CSSProperties | ((lineNumber: number) => React.CSSProperties);
    wrapLines?: boolean;
    wrapLongLines?: boolean;
    lineProps?: any;
    renderer?: any;
    PreTag?: string | ComponentType<any>;
    CodeTag?: string | ComponentType<any>;
    children: string;
    [key: string]: any;
  }

  const SyntaxHighlighter: ComponentType<SyntaxHighlighterProps>;
  export default SyntaxHighlighter;
  
  export const Prism: ComponentType<SyntaxHighlighterProps>;
  export const Light: ComponentType<SyntaxHighlighterProps>;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const styles: { [key: string]: any };
  export default styles;
  export const tomorrow: any;
  export const twilight: any;
  export const prism: any;
  export const atomDark: any;
  export const base16AteliersulphurpoolLight: any;
  export const cb: any;
  export const coldarkCold: any;
  export const coldarkDark: any;
  export const coy: any;
  export const darcula: any;
  export const dark: any;
  export const duotoneDark: any;
  export const duotoneEarth: any;
  export const duotoneForest: any;
  export const duotoneLight: any;
  export const duotoneSea: any;
  export const duotoneSpace: any;
  export const funky: any;
  export const ghcolors: any;
  export const hopscotch: any;
  export const materialDark: any;
  export const materialLight: any;
  export const materialOceanic: any;
  export const nord: any;
  export const okaidia: any;
  export const oneDark: any;
  export const oneLight: any;
  export const pojoaque: any;
  export const shadesOfPurple: any;
  export const solarizedlight: any;
  export const synthwave84: any;
  export const vs: any;
  export const vscDarkPlus: any;
  export const xonokai: any;
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
    isValid(): boolean;
  }

  interface MomentStatic {
    (date?: string | number | Date | Moment): Moment;
    utc(date?: string | number | Date | Moment): Moment;
    unix(timestamp: number): Moment;
    locale(locale: string): void;
    locale(): string;
    localeData(locale?: string): any;
    duration(amount?: number, unit?: string): any;
    isDuration(obj: any): boolean;
    isMoment(obj: any): obj is Moment;
    isDate(obj: any): obj is Date;
    now(): number;
    min(...moments: Moment[]): Moment;
    max(...moments: Moment[]): Moment;
  }

  const moment: MomentStatic;
  export = moment;
}

export {};

import React from 'react';
interface SettingsLayoutProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const SettingsLayout = ({ children }) => (
  <div className="{children}">$2</div>
  </div>);

export default SettingsLayout;

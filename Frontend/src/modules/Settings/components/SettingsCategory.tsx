import React from 'react';
import Card from '@/shared/components/ui/Card';
// Design System
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/shared/components/ui/design-tokens';
interface SettingsCategoryProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const SettingsCategory = ({ title, description, configs, children }) => {
  return (
        <>
      <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10" />
      <Card.Header />
        <Card.Title>{title}</Card.Title>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </Card.Header>
      <Card.Content />
        <div className="{children}">$2</div>
        </div>
      </Card.Content>
    </Card>);};

export default SettingsCategory;

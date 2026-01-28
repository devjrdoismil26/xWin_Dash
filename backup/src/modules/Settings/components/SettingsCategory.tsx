import React from 'react';
import Card from '@/components/ui/Card';
// Design System
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/components/ui/design-tokens';
const SettingsCategory = ({ title, description, configs, children }) => {
  return (
    <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {children}
        </div>
      </Card.Content>
    </Card>
  );
};
export default SettingsCategory;

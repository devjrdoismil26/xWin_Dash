import React from 'react';

interface ModuleLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode; }

const ModuleLayout: React.FC<ModuleLayoutProps> = ({ children, title, description, actions    }) => {
  return (
            <div className="{(title || description || actions) && (">$2</div>
        <div className="{title && ">$2</div><h1>{title}</h1>}
          {description && <p>{description}</p>}
          {actions && <div className="module-actions">{actions}</div>}
        </div>
      )}
      <div className="module-content">{children}</div>);};

export default ModuleLayout;

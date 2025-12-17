import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string;
  href?: string;
}>;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions, breadcrumbs    }) => {
  return (
            <div className="{breadcrumbs && (">$2</div>
        <nav className="breadcrumbs" />
          {breadcrumbs.map((item, index) => (
            <span key={ index }>{item.label}</span>
          ))}
        </nav>
      )}
      <div className=" ">$2</div><div>
           
        </div><h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>);};

export default PageHeader;

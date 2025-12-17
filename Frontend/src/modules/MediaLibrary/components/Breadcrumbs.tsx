import React from 'react';
type Crumb = { label: string; href?: string; onClick?: (e: any) => void};

type BreadcrumbsProps = { items?: Crumb[]};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items = [] as unknown[]    }) => {
  return (
        <>
      <nav aria-label="Breadcrumb" />
      <ol className="flex items-center gap-2 text-sm" />
        {(items || []).map((c: unknown, i: unknown) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-2" />
            <a
              href={ c.href ?? '#' }
              onClick={ (e: unknown) => {
                if (c.onClick) {
                  e.preventDefault();

                  c.onClick();

                 } }
              className="text-blue-600 hover:underline"
            >
              {c.label}
            </a>
            {i < items.length - 1 && <span className="text-gray-400">/</span>}
          </li>
        ))}
      </ol>
    </nav>);};

export default Breadcrumbs;

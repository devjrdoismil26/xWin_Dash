/**
 * Setup compartilhado para testes do módulo Products
 * Mocks e configurações reutilizáveis
 */

import { vi } from 'vitest';

// Mocks de API
vi.mock("@/services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mocks de UI Components
vi.mock("@/shared/components/ui/Card", () => ({
  default: ({ children, className }: unknown) => (
    <div className={`card ${className} `}>{children}</div>
  ),
}));

vi.mock("@/shared/components/ui/Button", () => ({
  default: ({ children, onClick, disabled, className }: unknown) => (
    <button onClick={onClick} disabled={disabled} className={className } />
      {children}
    </button>
  ),
}));

vi.mock("@/shared/components/ui/LoadingStates", () => ({
  LoadingSpinner: ({ size }: unknown) => (
    <div className={`loading-spinner ${size} `}>Loading...</div>
  ),
  LoadingSkeleton: ({ className }: unknown) => (
    <div className={`loading-skeleton ${className} `}>Skeleton</div>
  ),
}));

vi.mock("@/shared/components/ui/AdvancedAnimations", () => ({
  AnimatedCounter: ({ value, className }: unknown) => (
    <span className={className } >{value}</span>
  ),
  Animated: ({ children, delay }: unknown) => (
    <div data-delay={ delay }>{children}</div>
  ),
  PageTransition: ({ children }: unknown) => (
    <div className="page-transition">{children}</div>
  ),
}));

vi.mock("@/shared/components/ui/AdvancedProgress", () => ({
  Progress: ({ value, max, className }: unknown) => (
    <div className={`progress-bar ${className} `} data-value={value} data-max={ max } />
          ),
        </div>
  CircularProgress: ({ value, className }: unknown) => (
    <div className={`circular-progress ${className} `} data-value={ value } />
          ),
        </div>
  }));

vi.mock("@/shared/components/ui/EmptyState", () => ({
  EmptyState: ({ title, message, action }: unknown) => (
    <div className=" ">$2</div><h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  ),
}));

vi.mock("@/shared/components/ui/ErrorState", () => ({
  ErrorState: ({ title, message, action }: unknown) => (
    <div className=" ">$2</div><h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  ),
}));

vi.mock("@/shared/components/ui/Tooltip", () => ({
  default: ({ children, content }: unknown) => (
    <div className="tooltip" title={ content  }>
        </div>{children}
    </div>
  ),
}));

vi.mock("@/shared/components/ui/ResponsiveSystem", () => ({
  ResponsiveGrid: ({ children, cols }: unknown) => (
    <div className="responsive-grid" data-cols={ JSON.stringify(cols)  }>
        </div>{children}
    </div>
  ),
  ResponsiveContainer: ({ children }: unknown) => (
    <div className="responsive-container">{children}</div>
  ),
  ShowOn: ({ children }: unknown) => <div className="show-on">{children}</div>,
}));

// Exports para reutilização
export { vi };

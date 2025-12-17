import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { IntelligentDashboard } from '@/shared/components/ui/IntelligentDashboard';
import { IntelligentAutomation } from '@/shared/components/ui/IntelligentAutomation';

// Extend expect with axe matchers
expect.extend(toHaveNoViolations);

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: unknown) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: unknown) => children,
}));

// Mock Lucide React
vi.mock("lucide-react", () => ({
  TrendingUp: () => <div data-testid="trending-up" />,
  TrendingDown: () => <div data-testid="trending-down" />,
  Activity: () => <div data-testid="activity" />,
  Users: () => <div data-testid="users" />,
  DollarSign: () => <div data-testid="dollar-sign" />,
  BarChart3: () => <div data-testid="bar-chart" />,
  RefreshCw: () => <div data-testid="refresh" />,
  Settings: () => <div data-testid="settings" />,
  Lightbulb: () => <div data-testid="lightbulb" />,
  AlertTriangle: () => <div data-testid="alert-triangle" />,
  CheckCircle: () => <div data-testid="check-circle" />,
  Info: () => <div data-testid="info" />,
  Zap: () => <div data-testid="zap" />,
  Play: () => <div data-testid="play" />,
  Pause: () => <div data-testid="pause" />,
  Plus: () => <div data-testid="plus" />,
  Edit: () => <div data-testid="edit" />,
  Trash2: () => <div data-testid="trash" />,
  AlertCircle: () => <div data-testid="alert-circle" />,
  Clock: () => <div data-testid="clock" />,
}));

describe("Accessibility Tests", () => {
  describe("IntelligentDashboard", () => {
    const mockMetrics = [
      {
        id: "revenue",
        label: "Revenue",
        value: "$125,000",
        change: "+12.5%",
        trend: "up" as const,
        icon: "DollarSign" as const,
      },
    ];

    const mockCharts = [
      {
        id: "revenue-chart",
        title: "Revenue Trend",
        type: "line" as const,
        data: [
          { label: "Jan", value: 100000 },
          { label: "Feb", value: 120000 },
        ],
      },
    ];

    const mockInsights = [
      {
        id: "insight-1",
        type: "success" as const,
        title: "Revenue Growth",
        description: "Revenue increased by 12.5% this month",
        action: "View Details",
      },
    ];

    it("should not have accessibility violations", async () => {
      const { container } = render(
        <IntelligentDashboard
          metrics={ mockMetrics }
          charts={ mockCharts }
          insights={ mockInsights }
          loading={ false }
          error={ null }
          onRefresh={ vi.fn() }
          onSettings={ vi.fn() }
          onInsightAction={ vi.fn() } />,);

      const results = await axe(container);

      expect(results).toHaveNoViolations();

    });

    it("should have proper heading hierarchy", () => {
      render(
        <IntelligentDashboard
          metrics={ mockMetrics }
          charts={ mockCharts }
          insights={ mockInsights }
          loading={ false }
          error={ null }
          onRefresh={ vi.fn() }
          onSettings={ vi.fn() }
          onInsightAction={ vi.fn() } />,);

      // Check for main heading
      const mainHeading = screen.getByRole("heading", { level: 1 });

      expect(mainHeading).toBeInTheDocument();

      // Check for section headings
      const sectionHeadings = screen.getAllByRole("heading", { level: 2 });

      expect(sectionHeadings.length).toBeGreaterThan(0);

    });

    it("should have proper ARIA labels", () => {
      render(
        <IntelligentDashboard
          metrics={ mockMetrics }
          charts={ mockCharts }
          insights={ mockInsights }
          loading={ false }
          error={ null }
          onRefresh={ vi.fn() }
          onSettings={ vi.fn() }
          onInsightAction={ vi.fn() } />,);

      // Check for buttons with proper labels
      const refreshButton = screen.getByRole("button", { name: /refresh/i });

      expect(refreshButton).toBeInTheDocument();

      const settingsButton = screen.getByRole("button", { name: /settings/i });

      expect(settingsButton).toBeInTheDocument();

    });

    it("should have proper color contrast", () => {
      const { container } = render(
        <IntelligentDashboard
          metrics={ mockMetrics }
          charts={ mockCharts }
          insights={ mockInsights }
          loading={ false }
          error={ null }
          onRefresh={ vi.fn() }
          onSettings={ vi.fn() }
          onInsightAction={ vi.fn() } />,);

      // Check for proper color contrast classes
      const textElements = container.querySelectorAll(
        'p, span, div[role="text"]',);

      textElements.forEach((element) => {
        const classes = element.className;
        // Should have proper text color classes
        expect(classes).toMatch(
          /text-(gray|white|black|blue|green|red|yellow)/,);

      });

    });

    it("should be keyboard navigable", () => {
      render(
        <IntelligentDashboard
          metrics={ mockMetrics }
          charts={ mockCharts }
          insights={ mockInsights }
          loading={ false }
          error={ null }
          onRefresh={ vi.fn() }
          onSettings={ vi.fn() }
          onInsightAction={ vi.fn() } />,);

      // Check for focusable elements
      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        expect(button).toHaveAttribute("tabindex", "0");

      });

      // Check for proper focus management
      const focusableElements = screen.getAllByRole("button");

      expect(focusableElements.length).toBeGreaterThan(0);

    });

    it("should have proper semantic structure", () => {
      const { container } = render(
        <IntelligentDashboard
          metrics={ mockMetrics }
          charts={ mockCharts }
          insights={ mockInsights }
          loading={ false }
          error={ null }
          onRefresh={ vi.fn() }
          onSettings={ vi.fn() }
          onInsightAction={ vi.fn() } />,);

      // Check for main landmark
      const main = container.querySelector("main")!;
      expect(main).toBeInTheDocument();

      // Check for sections
      const sections = container.querySelectorAll("section");

      expect(sections.length).toBeGreaterThan(0);

      // Check for proper list structure
      const lists = container.querySelectorAll("ul, ol");

      lists.forEach((list) => {
        const listItems = list.querySelectorAll("li");

        expect(listItems.length).toBeGreaterThan(0);

      });

    });

  });

  describe("IntelligentAutomation", () => {
    const mockRules = [
      {
        id: "rule-1",
        name: "Welcome Email",
        description: "Send welcome email to new users",
        trigger: "user_registered",
        actions: ["send_email"],
        conditions: ["is_new_user"],
        status: "active" as const,
        lastExecuted: "2024-01-15T10:30:00Z",
        executionCount: 150,
        successRate: 98.5,
      },
    ];

    const mockTriggers = [
      {
        id: "user_registered",
        name: "User Registered",
        description: "Triggered when a new user registers",
        type: "event" as const,
        active: true,
      },
    ];

    const mockActions = [
      {
        id: "send_email",
        name: "Send Email",
        description: "Send an email to the user",
        type: "email" as const,
        configurable: true,
      },
    ];

    const mockConditions = [
      {
        id: "is_new_user",
        name: "Is New User",
        description: "Check if user is new",
        type: "boolean" as const,
        required: true,
      },
    ];

    const mockStats = {
      totalRules: 5,
      activeRules: 3,
      totalExecutions: 1250,
      successRate: 96.8,
      avgExecutionTime: 1.2,};

    it("should not have accessibility violations", async () => {
      const { container } = render(
        <IntelligentAutomation
          rules={ mockRules }
          triggers={ mockTriggers }
          actions={ mockActions }
          conditions={ mockConditions }
          stats={ mockStats }
          loading={ false }
          error={ null }
          onRuleCreate={ vi.fn() }
          onRuleUpdate={ vi.fn() }
          onRuleDelete={ vi.fn() }
          onRuleToggle={ vi.fn() }
          onRuleExecute={ vi.fn() } />,);

      const results = await axe(container);

      expect(results).toHaveNoViolations();

    });

    it("should have proper form labels", () => {
      render(
        <IntelligentAutomation
          rules={ mockRules }
          triggers={ mockTriggers }
          actions={ mockActions }
          conditions={ mockConditions }
          stats={ mockStats }
          loading={ false }
          error={ null }
          onRuleCreate={ vi.fn() }
          onRuleUpdate={ vi.fn() }
          onRuleDelete={ vi.fn() }
          onRuleToggle={ vi.fn() }
          onRuleExecute={ vi.fn() } />,);

      // Check for proper form structure
      const forms = screen.getAllByRole("form");

      forms.forEach((form) => {
        const inputs = form.querySelectorAll("input, select, textarea");

        inputs.forEach((input) => {
          const label = form.querySelector(`label[for="${input.id}"]`)!;
          expect(label).toBeInTheDocument();

        });

      });

    });

    it("should have proper status indicators", () => {
      render(
        <IntelligentAutomation
          rules={ mockRules }
          triggers={ mockTriggers }
          actions={ mockActions }
          conditions={ mockConditions }
          stats={ mockStats }
          loading={ false }
          error={ null }
          onRuleCreate={ vi.fn() }
          onRuleUpdate={ vi.fn() }
          onRuleDelete={ vi.fn() }
          onRuleToggle={ vi.fn() }
          onRuleExecute={ vi.fn() } />,);

      // Check for status indicators with proper ARIA labels
      const statusElements = screen.getAllByRole("status");

      statusElements.forEach((status) => {
        expect(status).toHaveAttribute("aria-live", "polite");

      });

    });

    it("should have proper error handling", () => {
      render(
        <IntelligentAutomation
          rules={ [] }
          triggers={ [] }
          actions={ [] }
          conditions={ [] }
          stats={ null }
          loading={ false }
          error="Failed to load automation rules"
          onRuleCreate={ vi.fn() }
          onRuleUpdate={ vi.fn() }
          onRuleDelete={ vi.fn() }
          onRuleToggle={ vi.fn() }
          onRuleExecute={ vi.fn() } />,);

      // Check for error message with proper ARIA attributes
      const errorMessage = screen.getByRole("alert");

      expect(errorMessage).toBeInTheDocument();

      expect(errorMessage).toHaveAttribute("aria-live", "assertive");

    });

  });

  describe("General Accessibility Guidelines", () => {
    it("should have proper focus management", () => {
      const { container } = render(
        <div>
           
        </div><button>Button 1</button>
          <button>Button 2</button>
          <button>Button 3</button>
        </div>,);

      const buttons = container.querySelectorAll("button");

      buttons.forEach((button, index) => {
        expect(button).toHaveAttribute("tabindex", "0");

        // Check focus order
        if (index > 0) {
          const prevButton = buttons[index - 1];
          expect(button.compareDocumentPosition(prevButton)).toBe(4); // FOLLOWING
        } );

    });

    it("should have proper skip links", () => {
      const { container } = render(
        <div>
           
        </div><a href="#main-content" className="skip-link" />
            Skip to main content
          </a>
          <main id="main-content" />
            <h1>Main Content</h1></main></div>,);

      const skipLink = container.querySelector(".skip-link")!;
      expect(skipLink).toBeInTheDocument();

      expect(skipLink).toHaveAttribute("href", "#main-content");

    });

    it("should have proper alt text for images", () => {
      const { container } = render(
        <div>
           
        </div><img
            src="chart.png"
            alt="Revenue trend chart showing growth over time"
          / />
          <img src="icon.png" alt="" role="presentation" / />
        </div>,);

      const images = container.querySelectorAll("img");

      images.forEach((img) => {
        if (img.getAttribute("role") !== "presentation") {
          expect(img).toHaveAttribute("alt");

          expect(img.getAttribute("alt")).not.toBe("");

        } );

    });

    it("should have proper table structure", () => {
      const { container } = render(
        <table />
          <caption>Campaign Performance Data</caption>
          <thead />
            <tr />
              <th scope="col">Campaign Name</th>
              <th scope="col">Open Rate</th>
              <th scope="col">Click Rate</th></tr></thead>
          <tbody />
            <tr />
              <th scope="row">Welcome Campaign</th>
              <td>25.5%</td>
              <td>5.2%</td></tr></tbody>
        </table>,);

      const table = container.querySelector("table")!;
      expect(table).toBeInTheDocument();

      const caption = table?.querySelector("caption")!;
      expect(caption).toBeInTheDocument();

      const headers = table?.querySelectorAll("th[scope]");

      expect(headers?.length).toBeGreaterThan(0);

    });

    it("should have proper form validation", () => {
      const { container } = render(
        <form />
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            required
            aria-describedby="email-error"
            aria-invalid="true"
          / />
          <div id="email-error" role="alert">
          Please enter a valid email address
        </div>
          </div>
        </form>,);

      const input = container.querySelector("input")!;
      expect(input).toHaveAttribute("aria-invalid", "true");

      expect(input).toHaveAttribute("aria-describedby", "email-error");

      const errorMessage = container.querySelector("#email-error")!;
      expect(errorMessage).toHaveAttribute("role", "alert");

    });

    it("should have proper loading states", () => {
      const { container } = render(
        <div>
           
        </div><div role="status" aria-live="polite">
          Loading data...
        </div>
          </div>
          <div aria-hidden="true">
           
        </div><div className="spinner">Loading...</div>
        </div>,);

      const statusElement = container.querySelector('[role="status"]')!;
      expect(statusElement).toHaveAttribute("aria-live", "polite");

      const hiddenElement = container.querySelector('[aria-hidden="true"]')!;
      expect(hiddenElement).toBeInTheDocument();

    });

    it("should have proper color and contrast", () => {
      const { container } = render(
        <div>
           
        </div><p className="text-gray-900">High contrast text</p>
          <p className="text-gray-600">Medium contrast text</p>
          <button className="bg-blue-600 text-white" />
            High contrast button
          </button>
        </div>,);

      // Check for proper color classes
      const textElements = container.querySelectorAll("p");

      textElements.forEach((element) => {
        const classes = element.className;
        expect(classes).toMatch(/text-(gray|white|black)/);

      });

      const button = container.querySelector("button")!;
      expect(button?.className).toMatch(/bg-blue-600 text-white/);

    });

    it("should have proper responsive design", () => {
      const { container } = render(
        <div className=" ">$2</div><div className="p-4">Item 1</div>
          <div className="p-4">Item 2</div>
          <div className="p-4">Item 3</div>,);

      const grid = container.querySelector(".grid")!;
      expect(grid?.className).toMatch(
        /grid-cols-1 md:grid-cols-2 lg:grid-cols-3/,);

    });

  });

});

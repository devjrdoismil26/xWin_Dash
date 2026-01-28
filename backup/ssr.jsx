import React from 'react';
import createServer from '@inertiajs/react/server';
import { createInertiaApp } from '@inertiajs/react';
import ReactDOMServer from 'react-dom/server';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { route as ziggyRoute } from 'ziggy-js';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.jsx';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from '@/components/ui/ThemeProvider.jsx';

const appName = import.meta.env.VITE_APP_NAME || 'xWin';

createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
      const pages = import.meta.glob('./src/modules/**/*.jsx', { eager: true });
      const match = pages[`./src/modules/${name}.jsx`];
      const resolved = match ?? { default: () => null };
      resolved.default.layout =
        resolved.default.layout || ((p) => <AuthenticatedLayout>{p}</AuthenticatedLayout>);
      return resolved;
    },
    setup: ({ App, props }) => {
      global.route = (name, params, absolute, _config) => {
        const ziggyConfig = { ...page.props.ziggy, location: new URL(page.props.ziggy.location) };
        return ziggyRoute(name, params, absolute, ziggyConfig);
      };
      return (
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <AuthProvider>
            <TooltipProvider>
              <App {...props} />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      );
    },
  }),
);

export default appName;

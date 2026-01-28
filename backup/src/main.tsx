import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ResponsiveProvider } from '@/components/ui/ResponsiveSystem';

// Importações diretas para evitar chunks separados
import Login from './modules/Users/Auth/Login.tsx';
import Register from './modules/Users/Auth/Register.tsx';
import ForgotPassword from './modules/Users/Auth/ForgotPassword.tsx';
import ResetPassword from './modules/Users/Auth/ResetPassword.tsx';
import VerifyEmail from './modules/Users/Auth/VerifyEmail.tsx';
import ConfirmPassword from './modules/Users/Auth/ConfirmPassword.tsx';
import ProfileShow from './modules/Users/Profile/Show.tsx';
import ProfileEdit from './modules/Users/Profile/Edit.tsx';
import UserCreateEdit from './modules/Users/CreateEdit.tsx';
import PageNotFound from './components/ErrorBoundary/PageNotFound.tsx';

// Projects Module
import ProjectSelector from './modules/Projects/ProjectSelector.tsx';

// Dashboard Module
import DashboardMain from './modules/Dashboard/DashboardMain.tsx';

// Universe Module
import Universe from './modules/Projects/Universe/index.tsx';
import UniverseHub from './modules/Projects/Universe/dashboard/UniverseHub.tsx';

// Missing Modules - Adding to ensure they're included in build
import AI from './modules/AI/AIComponent.tsx';
import Activity from './modules/Activity/ActivityComponent.tsx';
import Products from './modules/Products/ProductsComponent.tsx';
import Users from './modules/Users/UsersComponent.tsx';
import Workflows from './modules/Workflows/WorkflowsComponent.tsx';

const appName = import.meta.env.VITE_APP_NAME || 'xWin_Dash';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => {
    console.log(`📄 Resolvendo página: ${name}`);
    
    // Resolução direta para evitar chunks separados
    if (name === 'Users/Auth/Login') {
      return Login;
    }
    
    if (name === 'Users/Auth/Register') {
      return Register;
    }
    
    if (name === 'Users/Auth/ForgotPassword') {
      return ForgotPassword;
    }
    
    if (name === 'Users/Auth/ResetPassword') {
      return ResetPassword;
    }
    
    if (name === 'Users/Auth/VerifyEmail') {
      return VerifyEmail;
    }
    
    if (name === 'Users/Auth/ConfirmPassword') {
      return ConfirmPassword;
    }
    
    if (name === 'Users/Profile/Show') {
      return ProfileShow;
    }
    
    if (name === 'Users/Profile/Edit') {
      return ProfileEdit;
    }
    
    if (name === 'Users/CreateEdit') {
      return UserCreateEdit;
    }
    
    // Projects Module Routes
    if (name === 'Projects/ProjectSelector') {
      return ProjectSelector;
    }
    
    // Dashboard Module Routes
    if (name === 'Dashboard/DashboardMain') {
      return DashboardMain;
    }
    
    // Universe Module Routes
    if (name === 'Projects/Universe/dashboard/UniverseHub') {
      return UniverseHub;
    }
    
    if (name === 'Projects/Universe/index') {
      return Universe;
    }
    
    // Missing Modules Routes
    if (name === 'AI/index') {
      return AI;
    }
    
    if (name === 'Activity/index') {
      return Activity;
    }
    
    if (name === 'Products/index') {
      return Products;
    }
    
    if (name === 'Users/index') {
      return Users;
    }
    
    if (name === 'Workflows/index') {
      return Workflows;
    }
    
    // Fallback para página não encontrada
    console.log(`⚠️ Página não encontrada: ${name}, usando fallback`);
    return PageNotFound;
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
      <ResponsiveProvider>
        <App {...props} />
      </ResponsiveProvider>
    );
  },
  progress: { color: '#4B5563', showSpinner: true },
});
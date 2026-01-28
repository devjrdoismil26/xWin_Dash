// =========================================
// ACCESSIBILITY COMPONENTS EXPORTS - SOCIAL BUFFER
// =========================================

// Provider e hook principal
export { AccessibilityProvider, useAccessibility } from './AccessibilityProvider';

// Componentes de acessibilidade
export {
  SkipLink,
  FocusTrap,
  ScreenReaderOnly,
  VisuallyHidden
} from './AccessibilityProvider';

// Hooks especializados
export {
  useAnnouncement,
  useFocusManagement,
  useKeyboardNavigation
} from './AccessibilityProvider';

// Estilos CSS
export { accessibilityStyles } from './AccessibilityProvider';

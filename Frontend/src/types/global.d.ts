// Global Type Definitions

interface ReduxDevToolsExtension {
  connect(): void;
  send(action: string, state: unknown): void; }

declare global {
  interface Window {
  __REDUX_DEVTOOLS_EXTENSION__?: ReduxDevToolsExtension; } export {  };

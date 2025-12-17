// Re-export all API services
export { productsApi } from './api/productsApi';
export { landingPagesApi } from './api/landingPagesApi';
export { leadCaptureFormsApi } from './api/leadCaptureFormsApi';
export { leadsApi } from './api/leadsApi';

// Default export for backward compatibility
import { productsApi } from './api/productsApi';
import { landingPagesApi } from './api/landingPagesApi';
import { leadCaptureFormsApi } from './api/leadCaptureFormsApi';
import { leadsApi } from './api/leadsApi';

export default {
  products: productsApi,
  landingPages: landingPagesApi,
  leadCaptureForms: leadCaptureFormsApi,
  leads: leadsApi};

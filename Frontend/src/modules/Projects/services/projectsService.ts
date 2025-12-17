import { projectsApi } from './modules/projectsApi';
import { projectsMembers } from './modules/projectsMembers';
import { projectsResources } from './modules/projectsResources';
import { projectsAnalytics } from './modules/projectsAnalytics';

const projectsService = {
  ...projectsApi,
  ...projectsMembers,
  ...projectsResources,
  ...projectsAnalytics};

export default projectsService;

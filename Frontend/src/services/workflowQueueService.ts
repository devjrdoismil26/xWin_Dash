// Workflow Queue Service
class WorkflowQueueService {
  private queue: string[] = [];

  add(item: unknown) {
    this.queue.push(item);

  }

  remove(id: string) {
    this.queue = this.queue.filter(item => item.id !== id);

  }

  getAll() {
    return this.queue;
  }

  clear() {
    this.queue = [];
  } export const workflowQueueService = new WorkflowQueueService();

export default workflowQueueService;

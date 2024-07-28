export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'baixa' | 'moderada' | 'alta';
  completed: boolean;
  timestamp?: string;
  completedTimestamp?: string;
}
import type { Task } from '../types';
import { TaskListItem } from './TaskListItem';

interface TaskListProps {
  tasks: Task[];
  onStatusUpdated: () => void;
  onError: (message: string) => void;
}

export function TaskList({ tasks, onStatusUpdated, onError }: TaskListProps) {
  return (
    <section className="task-list" aria-label="Task list">
      {tasks.map((task) => (
        <TaskListItem
          key={task.id}
          task={task}
          onStatusUpdated={onStatusUpdated}
          onError={onError}
        />
      ))}
    </section>
  );
}

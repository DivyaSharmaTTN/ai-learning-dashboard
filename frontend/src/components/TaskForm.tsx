import { useEffect, useState } from 'react';
import type {
  CreateTaskPayload,
  Task,
  TaskCategory,
  TaskPriority,
  TaskStatus,
  User,
} from '../types';

export interface TaskFormValues {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  ownerId: number;
  dueDate: string;
}

interface TaskFormProps {
  users: User[];
  initialValues?: Partial<TaskFormValues>;
  submitLabel: string;
  readOnly?: boolean;
  onSubmit: (values: CreateTaskPayload) => Promise<void>;
  onCancel?: () => void;
}

const categories: TaskCategory[] = ['Learning', 'Project', 'Certification', 'Other'];
const priorities: TaskPriority[] = ['Low', 'Medium', 'High'];
const statuses: TaskStatus[] = ['NotStarted', 'InProgress', 'Completed'];

const defaultValues: TaskFormValues = {
  title: '',
  description: '',
  category: 'Learning',
  priority: 'Medium',
  status: 'NotStarted',
  ownerId: 0,
  dueDate: '',
};

function toFormValues(task?: Partial<TaskFormValues>): TaskFormValues {
  return { ...defaultValues, ...task };
}

export function TaskForm({
  users,
  initialValues,
  submitLabel,
  readOnly = false,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(() => toFormValues(initialValues));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setValues(toFormValues(initialValues));
    }
  }, [initialValues]);

  useEffect(() => {
    if (values.ownerId === 0 && users.length > 0) {
      setValues((prev) => ({ ...prev, ownerId: users[0].id }));
    }
  }, [users, values.ownerId]);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!values.title.trim()) nextErrors.title = 'Title is required.';
    if (!values.category) nextErrors.category = 'Category is required.';
    if (!values.priority) nextErrors.priority = 'Priority is required.';
    if (!values.status) nextErrors.status = 'Status is required.';
    if (!values.ownerId) nextErrors.ownerId = 'Owner is required.';
    if (!values.dueDate) nextErrors.dueDate = 'Due date is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        category: values.category,
        priority: values.priority,
        status: values.status,
        ownerId: values.ownerId,
        dueDate: values.dueDate,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={readOnly ? (e) => e.preventDefault() : handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          value={values.title}
          disabled={readOnly}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={4}
          value={values.description}
          disabled={readOnly}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            value={values.category}
            disabled={readOnly}
            onChange={(e) =>
              setValues({ ...values, category: e.target.value as TaskCategory })
            }
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="priority">Priority *</label>
          <select
            id="priority"
            value={values.priority}
            disabled={readOnly}
            onChange={(e) =>
              setValues({ ...values, priority: e.target.value as TaskPriority })
            }
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="status">Status *</label>
          <select
            id="status"
            value={values.status}
            disabled={readOnly}
            onChange={(e) =>
              setValues({ ...values, status: e.target.value as TaskStatus })
            }
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="ownerId">Owner *</label>
          <select
            id="ownerId"
            value={values.ownerId}
            disabled={readOnly}
            onChange={(e) =>
              setValues({ ...values, ownerId: Number(e.target.value) })
            }
          >
            <option value={0}>Select owner</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
          {errors.ownerId && <span className="field-error">{errors.ownerId}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="dueDate">Due Date *</label>
          <input
            id="dueDate"
            type="date"
            value={values.dueDate}
            disabled={readOnly}
            onChange={(e) => setValues({ ...values, dueDate: e.target.value })}
          />
          {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
        </div>
      </div>

      {submitError && <p className="form-error">{submitError}</p>}

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {readOnly ? 'Back' : 'Cancel'}
          </button>
        )}
        {!readOnly && (
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : submitLabel}
          </button>
        )}
      </div>
    </form>
  );
}

export function taskToFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    category: task.category,
    priority: task.priority,
    status: task.status,
    ownerId: task.ownerId,
    dueDate: task.dueDate.slice(0, 10),
  };
}

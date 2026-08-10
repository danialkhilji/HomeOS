import { useState } from "react";
import { useTasks, useCreateTask, useUpdateTask, useToggleTask, useDeleteTask } from "../../hooks/useTasks";
import { PageHeader, Button, EmptyState } from "../../components";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";
import TaskList from "./TaskList";
import type { Task } from "../../types";

export default function TasksPage() {
  const { data: tasks = [] } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  function handleCreate(title: string, assignedTo: number | null) {
    createTask.mutate(
      { title, assigned_to: assignedTo },
      { onSuccess: () => setAddModalOpen(false) },
    );
  }

  function handleEdit(title: string, assignedTo: number | null) {
    if (!editingTask) return;
    updateTask.mutate(
      { id: editingTask.id, data: { title, assigned_to: assignedTo } },
      { onSuccess: () => setEditingTask(null) },
    );
  }

  return (
    <div>
      <PageHeader
        title="Tasks"
        action={<Button onClick={() => setAddModalOpen(true)}>Add Task</Button>}
      />

      {tasks.length === 0 ? (
        <EmptyState
          message="No tasks yet. Add your first task."
          action={<Button onClick={() => setAddModalOpen(true)}>Add Task</Button>}
        />
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={(id) => toggleTask.mutate(id)}
          onEdit={(task) => setEditingTask(task)}
          onDelete={(id) => deleteTask.mutate(id)}
        />
      )}

      <AddTaskModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleCreate}
      />

      <EditTaskModal
        open={editingTask !== null}
        onClose={() => setEditingTask(null)}
        onSave={handleEdit}
        task={editingTask}
      />
    </div>
  );
}
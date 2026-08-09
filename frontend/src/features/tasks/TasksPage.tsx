import { useState } from "react";
import { useTasks, useCreateTask, useToggleTask, useDeleteTask } from "../../hooks/useTasks";
import { PageHeader, Button, EmptyState } from "../../components";
import AddTaskModal from "./AddTaskModal";
import TaskList from "./TaskList";

export default function TasksPage() {
  const { data: tasks = [] } = useTasks();
  const createTask = useCreateTask();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const [modalOpen, setModalOpen] = useState(false);

  function handleSave(title: string, assignedTo: number | null) {
    createTask.mutate(
      { title, assigned_to: assignedTo },
      { onSuccess: () => setModalOpen(false) },
    );
  }

  return (
    <div>
      <PageHeader
        title="Tasks"
        action={<Button onClick={() => setModalOpen(true)}>Add Task</Button>}
      />

      {tasks.length === 0 ? (
        <EmptyState
          message="No tasks yet. Add your first task."
          action={<Button onClick={() => setModalOpen(true)}>Add Task</Button>}
        />
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={(id) => toggleTask.mutate(id)}
          onDelete={(id) => deleteTask.mutate(id)}
        />
      )}

      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

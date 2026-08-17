import { useState, useMemo } from "react";
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useTasks, useCreateTask, useUpdateTask, useToggleTask, useReorderTasks, useDeleteTask } from "../../hooks/useTasks";
import { PageHeader, Button, EmptyState } from "../../components";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";
import { TaskRow } from "./TaskList";
import type { Task } from "../../types";

export default function TasksPage() {
  const { data: tasks = [] } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const toggleTask = useToggleTask();
  const reorderTasks = useReorderTasks();
  const deleteTask = useDeleteTask();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const activeTasks = useMemo(() => tasks.filter((t) => !t.is_completed), [tasks]);
  const recentlyCompleted = useMemo(() => tasks.filter((t) =>
    t.is_completed && t.completed_at && (now - new Date(t.completed_at).getTime()) < DAY_MS
  ), [tasks, now]);
  const olderCompleted = useMemo(() => tasks.filter((t) =>
    t.is_completed && (!t.completed_at || (now - new Date(t.completed_at).getTime()) >= DAY_MS)
  ), [tasks, now]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  function handleCreate(title: string, assignedTo: number | null, reminderAt: string | null, recurrence: string) {
    createTask.mutate(
      { title, assigned_to: assignedTo, reminder_at: reminderAt, recurrence },
      { onSuccess: () => setAddModalOpen(false) },
    );
  }

  function handleEdit(title: string, assignedTo: number | null, reminderAt: string | null, recurrence: string) {
    if (!editingTask) return;
    updateTask.mutate(
      { id: editingTask.id, data: { title, assigned_to: assignedTo, reminder_at: reminderAt, recurrence } },
      { onSuccess: () => setEditingTask(null) },
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = activeTasks.findIndex((t) => t.id === active.id);
    const newIndex = activeTasks.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...activeTasks];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved!);

    reorderTasks.mutate(reordered.map((t) => t.id));
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
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={activeTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {activeTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask.mutate(task.id)}
                    onEdit={() => setEditingTask(task)}
                    onDelete={() => deleteTask.mutate(task.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {activeTasks.length === 0 && recentlyCompleted.length === 0 && (
            <p className="text-center text-text-muted py-8">All tasks completed!</p>
          )}

          {recentlyCompleted.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              {recentlyCompleted.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask.mutate(task.id)}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => deleteTask.mutate(task.id)}
                />
              ))}
            </div>
          )}

          {olderCompleted.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="text-sm text-text-muted active:text-primary transition-colors"
              >
                {showCompleted ? "Hide" : "Show"} older completed ({olderCompleted.length})
              </button>

              {showCompleted && (
                <div className="mt-3 pt-3 border-t border-border space-y-2">
                  {olderCompleted.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTask.mutate(task.id)}
                      onEdit={() => setEditingTask(task)}
                      onDelete={() => deleteTask.mutate(task.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
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
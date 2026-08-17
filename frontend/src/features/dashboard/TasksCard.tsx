import { Card, EmptyState, LoadingSpinner } from "../../components";
import { useTasks, useToggleTask } from "../../hooks/useTasks";

export default function TasksCard() {
  const { data: tasks = [], isLoading } = useTasks();
  const toggleTask = useToggleTask();
  const now = new Date();
  const activeTasks = tasks.filter((t) => !t.is_completed);

  return (
    <Card title="Today's Tasks">
      {isLoading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <EmptyState message="No tasks yet." />
      ) : activeTasks.length === 0 ? (
        <p className="text-center text-text-muted py-4">All tasks done!</p>
      ) : (
        <div className="space-y-2">
          {activeTasks.map((task) => {
            const isOverdue = task.reminder_at && new Date(task.reminder_at) < now;

            return (
              <div
                key={task.id}
                onClick={() => toggleTask.mutate(task.id)}
                className={`flex items-center gap-3 py-1.5 cursor-pointer rounded-lg px-1 ${
                  isOverdue ? "bg-danger/10" : ""
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 border-2 border-border" />

                <div className="flex-1 min-w-0">
                  <span
                    className={`text-base ${
                      isOverdue
                        ? "text-danger font-semibold"
                        : "text-text"
                    }`}
                  >
                    {task.member && (
                      <>
                        <span className="font-semibold">{task.member.name}</span>
                        <span className={isOverdue ? "text-danger" : "text-text-muted"}> — </span>
                      </>
                    )}
                    {task.title}
                  </span>
                  {(task.reminder_at || task.recurrence !== "none") && (
                    <div className="flex items-center gap-2 mt-0.5">
                      {task.reminder_at && (
                        <span className={`text-xs ${isOverdue ? "text-danger font-semibold" : "text-text-muted"}`}>
                          🔔 {new Date(task.reminder_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} {new Date(task.reminder_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                      {task.recurrence !== "none" && (
                        <span className="text-xs text-text-muted">
                          🔁 {task.recurrence}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {task.member && (
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: task.member.colour }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
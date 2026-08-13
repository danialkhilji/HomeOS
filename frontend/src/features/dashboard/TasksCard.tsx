import { Card, EmptyState, LoadingSpinner } from "../../components";
import { useTasks, useToggleTask } from "../../hooks/useTasks";

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function TasksCard() {
  const { data: tasks = [], isLoading } = useTasks();
  const toggleTask = useToggleTask();
  const now = new Date();

  return (
    <Card title="Today's Tasks">
      {isLoading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <EmptyState message="No tasks yet." />
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const isOverdue = task.reminder_at && new Date(task.reminder_at) < now && !task.is_completed;

            return (
              <div
                key={task.id}
                onClick={() => toggleTask.mutate(task.id)}
                className={`flex items-center gap-3 py-1.5 cursor-pointer rounded-lg px-1 ${
                  isOverdue ? "bg-danger/10" : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 ${
                    task.is_completed
                      ? "bg-success text-white"
                      : "border-2 border-border dark:border-border-dark"
                  }`}
                >
                  {task.is_completed && <CheckIcon />}
                </div>

                <div className="flex-1 min-w-0">
                  <span
                    className={`text-base ${
                      task.is_completed
                        ? "line-through text-text-muted dark:text-text-dark-muted"
                        : isOverdue
                          ? "text-danger font-semibold"
                          : "text-text dark:text-text-dark"
                    }`}
                  >
                    {task.member && (
                      <>
                        <span className="font-semibold">{task.member.name}</span>
                        <span className={isOverdue ? "text-danger" : "text-text-muted dark:text-text-dark-muted"}> — </span>
                      </>
                    )}
                    {task.title}
                  </span>
                  {(task.reminder_at || task.recurrence !== "none") && (
                    <div className="flex items-center gap-2 mt-0.5">
                      {task.reminder_at && (
                        <span className={`text-xs ${isOverdue ? "text-danger font-semibold" : "text-text-muted dark:text-text-dark-muted"}`}>
                          🔔 {new Date(task.reminder_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} {new Date(task.reminder_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                      {task.recurrence !== "none" && (
                        <span className="text-xs text-text-muted dark:text-text-dark-muted">
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

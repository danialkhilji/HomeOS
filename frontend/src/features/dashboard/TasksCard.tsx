import { Card, EmptyState, LoadingSpinner } from "../../components";
import { useTasks } from "../../hooks/useTasks";

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function TasksCard() {
  const { data: tasks = [], isLoading } = useTasks();

  return (
    <Card title="Today's Tasks">
      {isLoading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <EmptyState message="No tasks yet." />
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 py-1.5">
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
                      : "text-text dark:text-text-dark"
                  }`}
                >
                  {task.member && (
                    <>
                      <span className="font-semibold">{task.member.name}</span>
                      <span className="text-text-muted dark:text-text-dark-muted"> — </span>
                    </>
                  )}
                  {task.title}
                </span>
              </div>

              {task.member && (
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: task.member.colour }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

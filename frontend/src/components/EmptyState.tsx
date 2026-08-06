interface EmptyStateProps {
  message: string;
  action?: React.ReactNode;
}

export default function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <p className="text-lg text-center text-text-muted dark:text-text-dark-muted">
        {message}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}

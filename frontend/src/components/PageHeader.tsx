interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-text dark:text-text-dark">
        {title}
      </h1>
      {action && <div>{action}</div>}
    </div>
  );
}

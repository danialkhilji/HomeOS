export interface Member {
  id: number;
  name: string;
  colour: string;
  created_at: string;
}

export interface MemberSummary {
  id: number;
  name: string;
  colour: string;
}

export interface Task {
  id: number;
  title: string;
  assigned_to: number | null;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  member: MemberSummary | null;
}

export interface HealthResponse {
  app: string;
  version: string;
  status: string;
  database: string;
}

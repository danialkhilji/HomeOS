export interface Member {
  id: number;
  name: string;
  colour: string;
  created_at: string;
}

export interface HealthResponse {
  app: string;
  version: string;
  status: string;
  database: string;
}

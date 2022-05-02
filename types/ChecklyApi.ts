export type ChecklyApiResponse = Status[];

export interface Status {
  name: string;
  hasErrors: boolean;
  hasFailures: boolean;
  longestRun: number;
  shortestRun: number;
  checkId: string;
  created_at: Date;
  updated_at: Date;
  lastRunLocation: string;
  lastCheckRunId: string;
  sslDaysRemaining: number;
  isDegraded: boolean;
}

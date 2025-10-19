
export enum CheckStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
}

export interface CheckResult {
  url: string;
  status: CheckStatus;
  statusCode?: number;
  reason?: string;
  timestamp: number;
}

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonRecord = Record<string, JsonValue>;

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiErrorShape = {
  code: string;
  message: string;
};

export type ApiMetaShape = {
  collection?: string;
  id?: string;
  page?: number;
  limit?: number;
  total?: number;
  count?: number;
  totalPages?: number;
  timestamp?: string;
  requestId?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  status: string;
  message: string;
  data: T;
  error: ApiErrorShape | null;
  meta?: ApiMetaShape;
};
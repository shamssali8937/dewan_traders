export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  userType: string;
  phone?: string | null;
  companyName?: string | null;
  city?: string | null;
  country?: string | null;
  createdAt: Date;
}

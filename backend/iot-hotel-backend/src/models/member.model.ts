export interface Member {
  id: number;
  phone: string;
  password: string;
  name: string;
  id_number: string;
  member_level: string;
  points: number;
  balance: number;
  total_spent: number;
  total_stays: number;
  created_at: string;
  updated_at: string;
}

export interface MemberInput {
  phone: string;
  password: string;
  name?: string;
  id_number?: string;
}

export interface MemberUpdate {
  name?: string;
  id_number?: string;
  member_level?: string;
  points?: number;
  balance?: number;
  total_spent?: number;
  total_stays?: number;
}

export interface MemberQuery {
  page?: number;
  pageSize?: number;
  level?: string;
}

export interface MemberLogin {
  phone: string;
  password: string;
}

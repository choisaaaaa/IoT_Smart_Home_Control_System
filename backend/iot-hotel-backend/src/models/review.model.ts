export interface Review {
  id: number;
  order_id: number;
  order_type: string;
  member_id: number;
  score: number;
  content: string;
  photos: string[];
  created_at: string;
}

export interface ReviewInput {
  order_id: number;
  order_type: string;
  member_id: number;
  score: number;
  content: string;
  photos?: string[];
}

export interface ReviewQuery {
  page?: number;
  pageSize?: number;
  order_type?: string;
}

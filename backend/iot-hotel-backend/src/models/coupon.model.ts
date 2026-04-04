export interface Coupon {
  id: number;
  coupon_name: string;
  coupon_type: string;
  discount_value: number;
  min_amount: number;
  total_count: number;
  received_count: number;
  valid_from: string;
  valid_to: string;
  created_at: string;
  updated_at: string;
}

export interface CouponInput {
  coupon_name: string;
  coupon_type: string;
  discount_value: number;
  min_amount: number;
  total_count: number;
  valid_from: string;
  valid_to: string;
}

export interface CouponQuery {
  page?: number;
  pageSize?: number;
  status?: string;
}

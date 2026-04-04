export interface Hotel {
  id: number;
  hotel_name: string;
  hotel_address: string;
  hotel_phone: string;
  hotel_star: number;
  total_rooms: number;
  occupied_rooms: number;
  occupancy_rate: number;
  logo: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface HotelInput {
  hotel_name?: string;
  hotel_address?: string;
  hotel_phone?: string;
  hotel_star?: number;
  logo?: string;
  description?: string;
}

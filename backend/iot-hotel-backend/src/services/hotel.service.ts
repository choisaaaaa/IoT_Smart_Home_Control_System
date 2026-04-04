import pool, { RowDataPacket, ResultSetHeader } from '../config/database';
import logger from '../utils/logger';

export interface Hotel extends RowDataPacket {
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
  created_at: Date;
  updated_at: Date;
}

export class HotelService {
  static async getHotel(): Promise<Hotel | null> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM hotels LIMIT 1');
      return (rows[0] as Hotel) || null;
    } catch (error) {
      logger.error('获取酒店信息失败:', error);
      throw new Error('获取酒店信息失败');
    }
  }

  static async updateHotel(data: Partial<Hotel>): Promise<boolean> {
    try {
      const { hotel_name, hotel_address, hotel_phone, hotel_star, logo, description } = data;
      
      await pool.query<ResultSetHeader>(
        'UPDATE hotels SET hotel_name = ?, hotel_address = ?, hotel_phone = ?, hotel_star = ?, logo = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
        [hotel_name, hotel_address, hotel_phone, hotel_star, logo, description]
      );
      
      return true;
    } catch (error) {
      logger.error('更新酒店信息失败:', error);
      throw new Error('更新酒店信息失败');
    }
  }
}

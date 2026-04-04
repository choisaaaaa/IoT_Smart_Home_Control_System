import pool, { RowDataPacket, ResultSetHeader } from '../config/database';
import logger from '../utils/logger';

export interface Room extends RowDataPacket {
  id: number;
  room_number: string;
  room_type: string;
  room_name: string;
  room_price: number;
  room_status: string;
  floor: number;
  area: number;
  bed_type: string;
  max_guests: number;
  description: string;
  facilities: string;
  images: string;
  created_at: Date;
  updated_at: Date;
}

export interface RoomListResponse {
  list: Room[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class RoomService {
  static async getRooms(params: {
    page?: number;
    pageSize?: number;
    status?: string;
    type?: string;
  }): Promise<RoomListResponse> {
    try {
      const { page = 1, pageSize = 10, status, type } = params;
      const offset = (Number(page) - 1) * Number(pageSize);
      
      let whereClause = 'WHERE 1=1';
      const paramsArray: any[] = [];
      
      if (status) {
        whereClause += ' AND room_status = ?';
        paramsArray.push(status);
      }
      
      if (type) {
        whereClause += ' AND room_type = ?';
        paramsArray.push(type);
      }
      
      const [totalRows] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) as total FROM rooms ${whereClause}`, paramsArray);
      const total = (totalRows[0] as any).total;
      
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM rooms ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
        [...paramsArray, Number(pageSize), offset]
      );
      
      return {
        list: rows as Room[],
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / Number(pageSize))
      };
    } catch (error) {
      logger.error('获取房间列表失败:', error);
      throw new Error('获取房间列表失败');
    }
  }

  static async getRoomById(id: number): Promise<Room | null> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM rooms WHERE id = ?', [id]);
      return (rows[0] as Room) || null;
    } catch (error) {
      logger.error('获取房间详情失败:', error);
      throw new Error('获取房间详情失败');
    }
  }

  static async createRoom(data: Partial<Room>): Promise<number> {
    try {
      const { room_number, room_type, room_name, room_price, room_status, floor, area, bed_type, max_guests, description, facilities, images } = data;
      
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO rooms (room_number, room_type, room_name, room_price, room_status, floor, area, bed_type, max_guests, description, facilities, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [room_number, room_type, room_name, room_price, room_status, floor, area, bed_type, max_guests, description, JSON.stringify(facilities || []), JSON.stringify(images || [])]
      );
      
      return result.insertId;
    } catch (error) {
      logger.error('创建房间失败:', error);
      throw new Error('创建房间失败');
    }
  }

  static async updateRoom(id: number, data: Partial<Room>): Promise<boolean> {
    try {
      const { room_number, room_type, room_name, room_price, room_status, floor, area, bed_type, max_guests, description, facilities, images } = data;
      
      const [result] = await pool.query<ResultSetHeader>(
        'UPDATE rooms SET room_number = ?, room_type = ?, room_name = ?, room_price = ?, room_status = ?, floor = ?, area = ?, bed_type = ?, max_guests = ?, description = ?, facilities = ?, images = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [room_number, room_type, room_name, room_price, room_status, floor, area, bed_type, max_guests, description, JSON.stringify(facilities || []), JSON.stringify(images || []), id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      logger.error('更新房间失败:', error);
      throw new Error('更新房间失败');
    }
  }

  static async deleteRoom(id: number): Promise<boolean> {
    try {
      const [result] = await pool.query<ResultSetHeader>('DELETE FROM rooms WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      logger.error('删除房间失败:', error);
      throw new Error('删除房间失败');
    }
  }
}

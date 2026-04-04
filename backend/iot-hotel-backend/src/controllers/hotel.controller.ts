import { Request, Response } from 'express';
import { successResponse, errorResponse, AuthRequest } from '../types';
import pool, { RowDataPacket, ResultSetHeader } from '../config/database';
import logger from '../utils/logger';

export const get = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM hotels LIMIT 1');
    const hotel = rows[0];
    
    res.json(successResponse(hotel, '获取酒店信息成功'));
  } catch (error) {
    logger.error('获取酒店信息失败:', error);
    res.status(500).json(errorResponse('获取酒店信息失败'));
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { hotel_name, hotel_address, hotel_phone, hotel_star, logo, description } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE hotels SET hotel_name = ?, hotel_address = ?, hotel_phone = ?, hotel_star = ?, logo = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
      [hotel_name, hotel_address, hotel_phone, hotel_star, logo, description]
    );
    
    if (result.affectedRows === 0) {
      res.status(404).json(errorResponse('酒店信息不存在'));
      return;
    }
    
    res.json(successResponse(null, '更新酒店信息成功'));
  } catch (error) {
    logger.error('更新酒店信息失败:', error);
    res.status(500).json(errorResponse('更新酒店信息失败'));
  }
};
import { Request, Response } from 'express';
import { successResponse, errorResponse, AuthRequest } from '../types';
import pool, { RowDataPacket, ResultSetHeader } from '../config/database';
import logger from '../utils/logger';

export const get = async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 10, status, type } = req.query;
    const offset = (Number(page) - 1) * Number(pageSize);
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    
    if (status) {
      whereClause += ' AND room_status = ?';
      params.push(status);
    }
    
    if (type) {
      whereClause += ' AND room_type = ?';
      params.push(type);
    }
    
    const [totalRows] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) as total FROM rooms ${whereClause}`, params);
    const total = (totalRows[0] as any).total;
    
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM rooms ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]
    );
    
    res.json(successResponse({
      list: rows,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize))
    }, '获取房间列表成功'));
  } catch (error) {
    logger.error('获取房间列表失败:', error);
    res.status(500).json(errorResponse('获取房间列表失败'));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM rooms WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      res.status(404).json(errorResponse('房间不存在'));
      return;
    }
    
    res.json(successResponse(rows[0], '获取房间详情成功'));
  } catch (error) {
    logger.error('获取房间详情失败:', error);
    res.status(500).json(errorResponse('获取房间详情失败'));
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const { room_number, room_type, room_name, room_price, room_status, floor, area, bed_type, max_guests, description, facilities, images } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO rooms (room_number, room_type, room_name, room_price, room_status, floor, area, bed_type, max_guests, description, facilities, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [room_number, room_type, room_name, room_price, room_status, floor, area, bed_type, max_guests, description, JSON.stringify(facilities || []), JSON.stringify(images || [])]
    );
    
    res.json(successResponse({ id: result.insertId }, '创建房间成功'));
  } catch (error) {
    logger.error('创建房间失败:', error);
    res.status(500).json(errorResponse('创建房间失败'));
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { room_number, room_type, room_name, room_price, room_status, floor, area, bed_type, max_guests, description, facilities, images } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE rooms SET room_number = ?, room_type = ?, room_name = ?, room_price = ?, room_status = ?, floor = ?, area = ?, bed_type = ?, max_guests = ?, description = ?, facilities = ?, images = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [room_number, room_type, room_name, room_price, room_status, floor, area, bed_type, max_guests, description, JSON.stringify(facilities || []), JSON.stringify(images || []), id]
    );
    
    if (result.affectedRows === 0) {
      res.status(404).json(errorResponse('房间不存在'));
      return;
    }
    
    res.json(successResponse(null, '更新房间成功'));
  } catch (error) {
    logger.error('更新房间失败:', error);
    res.status(500).json(errorResponse('更新房间失败'));
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM rooms WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      res.status(404).json(errorResponse('房间不存在'));
      return;
    }
    
    res.json(successResponse(null, '删除房间成功'));
  } catch (error) {
    logger.error('删除房间失败:', error);
    res.status(500).json(errorResponse('删除房间失败'));
  }
};

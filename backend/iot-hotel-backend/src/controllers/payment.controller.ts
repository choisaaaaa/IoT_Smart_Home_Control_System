import { Request, Response } from 'express';
import { successResponse, errorResponse, AuthRequest } from '../types';
import pool, { RowDataPacket, ResultSetHeader } from '../config/database';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export const get = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, pageSize = 10, status, order_type } = req.query;
    const offset = (Number(page) - 1) * Number(pageSize);
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    
    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }
    
    if (order_type) {
      whereClause += ' AND order_type = ?';
      params.push(order_type);
    }
    
    const [totalRows] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) as total FROM payments ${whereClause}`, params);
    const total = (totalRows[0] as any).total;
    
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM payments ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]
    );
    
    res.json(successResponse({
      list: rows,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize))
    }, '获取支付列表成功'));
  } catch (error) {
    logger.error('获取支付列表失败:', error);
    res.status(500).json(errorResponse('获取支付列表失败'));
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM payments WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      res.status(404).json(errorResponse('支付记录不存在'));
      return;
    }
    
    res.json(successResponse(rows[0], '获取支付详情成功'));
  } catch (error) {
    logger.error('获取支付详情失败:', error);
    res.status(500).json(errorResponse('获取支付详情失败'));
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const { order_type, order_id, amount, payment_method, description } = req.body;
    
    const paymentNo = `PAY${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${uuidv4().slice(0, 8).toUpperCase()}`;
    
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO payments (payment_no, order_type, order_id, amount, payment_method, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [paymentNo, order_type, order_id, amount, payment_method, 'pending', description]
    );
    
    res.json(successResponse({ id: result.insertId, payment_no: paymentNo }, '创建支付订单成功'));
  } catch (error) {
    logger.error('创建支付订单失败:', error);
    res.status(500).json(errorResponse('创建支付订单失败'));
  }
};

export const pay = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { transaction_no } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE payments SET status = ?, transaction_no = ?, paid_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['paid', transaction_no, id]
    );
    
    if (result.affectedRows === 0) {
      res.status(404).json(errorResponse('支付记录不存在'));
      return;
    }
    
    res.json(successResponse(null, '支付成功'));
  } catch (error) {
    logger.error('支付失败:', error);
    res.status(500).json(errorResponse('支付失败'));
  }
};
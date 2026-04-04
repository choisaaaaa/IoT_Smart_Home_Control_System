import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = (err as any).statusCode || 500;
  
  res.status(statusCode).json({
    code: statusCode,
    message: err.message || '服务器错误',
    details: process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined,
    timestamp: Date.now()
  });
}

export function notFoundHandler(_req: Request, res: Response, _next: NextFunction): void {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    timestamp: Date.now()
  });
}

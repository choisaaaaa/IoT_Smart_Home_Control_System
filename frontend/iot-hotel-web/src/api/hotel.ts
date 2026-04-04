import request from './request'
import type { HotelInfo, ApiResponse } from '@/types'

export const hotelApi = {
  getHotelInfo: () =>
    request.get<ApiResponse<HotelInfo>>('/hotels'),

  updateHotelInfo: (data: Partial<HotelInfo>) =>
    request.put<ApiResponse<HotelInfo>>('/hotels', data),

  getOccupancyStats: () =>
    request.get<ApiResponse<any>>('/hotels/stats/occupancy'),

  getRevenueStats: () =>
    request.get<ApiResponse<any>>('/hotels/stats/revenue')
}
import request from './request'
import type { RoomInfo, PaginatedResponse, ApiResponse } from '@/types'

export const roomApi = {
  getRoomList: (params?: { page?: number; pageSize?: number; status?: string; floor?: number }) =>
    request.get<PaginatedResponse<RoomInfo>>('/rooms', { params }),

  getRoomDetail: (id: number) =>
    request.get<ApiResponse<RoomInfo>>(`/rooms/${id}`),

  updateRoomStatus: (id: number, status: string) =>
    request.patch<ApiResponse<RoomInfo>>(`/rooms/${id}/status`, { status })
}
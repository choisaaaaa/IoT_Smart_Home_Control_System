import request from './request'
import type { DeviceInfo, ApiResponse } from '@/types'

export const deviceApi = {
  getDeviceList: () =>
    request.get<ApiResponse<DeviceInfo[]>>('/devices'),

  getDeviceDetail: (deviceId: string) =>
    request.get<ApiResponse<DeviceInfo>>(`/devices/${deviceId}`),

  sendCommand: (deviceId: string, commandType: string, commandValue: string) =>
    request.post<ApiResponse<any>>('/devices/command', {
      device_id: deviceId,
      command_type: commandType,
      command_value: commandValue
    }),

  getDeviceStatusHistory: (deviceId: string, params?: { limit?: number }) =>
    request.get<ApiResponse<any[]>>(`/devices/${deviceId}/history`, { params })
}
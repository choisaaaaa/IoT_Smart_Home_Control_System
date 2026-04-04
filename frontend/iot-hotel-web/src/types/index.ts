export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PaginatedResponse<T = any> extends ApiResponse<{
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}> {}

export interface HotelInfo {
  id: number
  hotel_name: string
  hotel_address: string
  hotel_phone: string
  hotel_star: number
  total_rooms: number
  occupied_rooms: number
  occupancy_rate: string
  logo: string | null
  description: string
  created_at: string
  updated_at: string
}

export interface RoomInfo {
  id: number
  room_number: string
  room_type: 'standard' | 'deluxe' | 'suite' | 'presidential'
  room_name: string
  room_price: string
  room_status: 'available' | 'occupied' | 'maintenance' | 'cleaning'
  floor: number
  area: string
  bed_type: 'single' | 'double' | 'king' | 'twin'
  max_guests: number
  description: string
  facilities: string[]
  images: string[] | null
  created_at: string
  updated_at: string
}

export interface DeviceInfo {
  device_id: string
  device_type: 'main' | 'sub1' | 'sub2' | 'sensor' | 'actuator'
  device_name: string
  device_key: string
  device_status: 'online' | 'offline' | 'error' | 'unknown'
  firmware_version: string
  last_seen: string
  room_id?: number
  created_at: string
  updated_at: string
}

export interface BookingInfo {
  id: number
  booking_number: string
  room_id: number
  guest_name: string
  guest_phone: string
  check_in_date: string
  check_out_date: string
  guest_count: number
  payment_method: string
  total_price: string
  status: string
  created_at: string
  updated_at: string
}

export interface SensorDataPayload {
  device_id: string
  sensor_type: string
  value: number | string
  unit?: string
  timestamp?: string
}

export interface DeviceStatusPayload {
  device_id: string
  status: string
  firmware_version?: string
  signal_strength?: number
  battery_level?: number
}

export interface CommandResultPayload {
  command_id: string
  device_id: string
  command_type: string
  result: string
  value?: any
  error_code?: string
}
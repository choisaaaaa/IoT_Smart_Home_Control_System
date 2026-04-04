import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DeviceInfo, DeviceStatusPayload, SensorDataPayload, CommandResultPayload } from '@/types'

export const useDeviceStore = defineStore('device', () => {
  const devices = ref<DeviceInfo[]>([])
  const deviceStatusMap = ref<Map<string, DeviceStatusPayload>>(new Map())
  const sensorDataMap = ref<Map<string, SensorDataPayload[]>>(new Map())
  const commandResults = ref<Map<string, CommandResultPayload>>(new Map())

  function updateDevice(deviceId: string, payload: DeviceStatusPayload) {
    deviceStatusMap.value.set(deviceId, payload)
    const idx = devices.value.findIndex(d => d.device_id === deviceId)
    if (idx !== -1) {
      devices.value[idx] = {
        ...devices.value[idx],
        device_status: payload.status as DeviceInfo['device_status'],
        last_seen: new Date().toISOString(),
        firmware_version: payload.firmware_version || devices.value[idx].firmware_version
      }
    }
  }

  function addSensorData(data: SensorDataPayload) {
    const list = sensorDataMap.value.get(data.device_id) || []
    list.push(data)
    if (list.length > 100) list.shift()
    sensorDataMap.value.set(data.device_id, [...list])
  }

  function addCommandResult(result: CommandResultPayload) {
    commandResults.value.set(result.command_id, result)
  }

  function setDevices(list: DeviceInfo[]) {
    devices.value = list
  }

  function getOnlineCount(): number {
    return devices.value.filter(d => d.device_status === 'online').length
  }

  function getOfflineCount(): number {
    return devices.value.filter(d => d.device_status === 'offline').length
  }

  function getErrorCount(): number {
    return devices.value.filter(d => d.device_status === 'error').length
  }

  return {
    devices,
    deviceStatusMap,
    sensorDataMap,
    commandResults,
    updateDevice,
    addSensorData,
    addCommandResult,
    setDevices,
    getOnlineCount,
    getOfflineCount,
    getErrorCount
  }
})
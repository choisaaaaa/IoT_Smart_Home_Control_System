<template>
  <div class="device-monitor">
    <a-row :gutter="[12, 12]">
      <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="device in deviceStore.devices" :key="device.device_id">
        <a-card hoverable size="small" :class="['device-card', `status-${device.device_status}`]">
          <div class="card-header">
            <a-avatar :style="{ backgroundColor: avatarColor(device.device_status), fontSize: 18 }" shape="square">
              {{ typeLabel(device.device_type) }}
            </a-avatar>
            <div class="header-info">
              <h4>{{ device.device_name }}</h4>
              <span class="device-id">{{ device.device_id }}</span>
            </div>
          </div>
          <a-divider style="margin: 10px 0;" />
          <div class="detail-list">
            <div class="detail-item">
              <span>固件版本</span>
              <a-tag color="blue">{{ device.firmware_version }}</a-tag>
            </div>
            <div class="detail-item">
              <span>运行状态</span>
              <a-badge :status="badgeStatus(device.device_status)" :text="statusText(device.device_status)" />
            </div>
            <div class="detail-item">
              <span>最后通信</span>
              <span class="time-text">{{ formatTime(device.last_seen) }}</span>
            </div>
          </div>
          <div class="card-actions">
            <a-button size="small" block :disabled="device.device_status !== 'online'" @click="sendCommand(device)">
              发送测试指令
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-empty v-if="!deviceStore.devices.length && !loading" description="暂无设备数据" />

    <a-modal v-model:open="cmdModalVisible" title="发送设备指令" @ok="confirmCommand">
      <a-form layout="vertical">
        <a-form-item label="目标设备">
          <a-input :value="currentCmd.deviceId" disabled />
        </a-form-item>
        <a-form-item label="指令类型">
          <a-select v-model:value="currentCmd.commandType">
            <a-select-option value="ping">Ping 测试</a-select-option>
            <a-select-option value="restart">重启设备</a-select-option>
            <a-select-option value="status_query">状态查询</a-select-option>
            <a-select-option value="firmware_update">固件更新</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="指令参数">
          <a-input v-model:value="currentCmd.commandValue" placeholder="可选参数值" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { DeviceInfo } from '@/types'
import { useDeviceStore } from '@/stores/device'
import { sendDeviceCommand } from '@/utils/websocket'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const deviceStore = useDeviceStore()
const loading = ref(false)
const cmdModalVisible = ref(false)

const currentCmd = reactive({
  deviceId: '',
  commandType: 'ping',
  commandValue: ''
})

function typeLabel(type: string): string {
  return ({ main: '前', sub1: '楼', sub2: '客', sensor: '感', actuator: '执' } as Record<string, string>)[type] || '?'
}

function avatarColor(status: string): string {
  return ({ online: '#52c41a', offline: '#999', error: '#ff4d4f', unknown: '#d9d9d9' } as Record<string, string>)[status] || '#d9d9d9'
}

function badgeStatus(s: string): string {
  return ({ online: 'success', offline: 'default', error: 'error', unknown: 'default' } as Record<string, string>)[s] || 'default'
}

function statusText(s: string): string {
  return ({ online: '在线', offline: '离线', error: '异常', unknown: '未知' } as Record<string, string>)[s] || s
}

function formatTime(t: string): string { return t ? dayjs(t).fromNow() : '-' }

function sendCommand(device: DeviceInfo) {
  currentCmd.deviceId = device.device_id
  currentCmd.commandType = 'ping'
  currentCmd.commandValue = ''
  cmdModalVisible.value = true
}

async function confirmCommand() {
  sendDeviceCommand(currentCmd.deviceId, currentCmd.commandType, currentCmd.commandValue)
  message.success(`指令已发送至 ${currentCmd.deviceId}`)
  cmdModalVisible.value = false
}

onMounted(async () => {
  loading.value = true
  try {
    const { deviceApi } = await import('@/api/device')
    const res: any = await deviceApi.getDeviceList()
    deviceStore.setDevices(res.data || [])
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.device-card { border-left: 4px solid transparent; transition: all .3s; }
.device-card.status-online { border-left-color: #52c41a; }
.device-card.status-offline { border-left-color: #999; }
.device-card.status-error { border-left-color: #ff4d4f; }
.card-header { display: flex; align-items: center; gap: 10px; }
.header-info h4 { margin: 0; font-size: 14px; }
.device-id { font-size: 11px; color: rgba(0,0,0,0.45); }
.detail-item { display: flex; justify-content: space-between; align-items: center; padding: 3px 0; font-size: 13px; }
.time-text { font-size: 11px; color: rgba(0,0,0,0.35); }
.card-actions { margin-top: 10px; }
</style>
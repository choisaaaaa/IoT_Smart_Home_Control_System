<template>
  <div class="room-availability">
    <div class="toolbar">
      <a-space>
        <a-date-picker v-model:value="queryDate" format="YYYY-MM-DD" /> 至
        <a-date-picker v-model:value="queryDateEnd" format="YYYY-MM-DD" />
        <a-select v-model:value="filterType" placeholder="房型筛选" allow-clear style="width: 140px;">
          <a-select-option value="standard">标准间</a-select-option>
          <a-select-option value="deluxe">豪华间</a-select-option>
          <a-select-option value="suite">套房</a-select-option>
          <a-select-option value="presidential">总统套房</a-select-option>
        </a-select>
      </a-space>
      <a-space>
        <a-radio-group v-model:value="viewMode" button-style="solid" size="small">
          <a-radio-button value="table">表格视图</a-radio-button>
          <a-radio-button value="grid">平面图视图</a-radio-button>
        </a-radio-group>
      </a-space>
    </div>

    <template v-if="viewMode === 'table'">
      <a-table
        :columns="columns"
        :data-source="hotelStore.rooms"
        :pagination="{ pageSize: 15 }"
        row-key="id"
        size="middle"
        :row-class-name="(record: any) => `row-status-${record.room_status}`"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'room_status'">
            <a-badge :text="statusText(record.room_status)" :status="badgeStatus(record.room_status)" />
          </template>
          <template v-if="column.key === 'room_price'">¥{{ record.room_price }}</template>
          <template v-if="column.key === 'action'">
            <a-space v-if="record.room_status === 'available'">
              <a-button type="primary" size="small" @click="quickBook(record)">快速预订</a-button>
              <a-button size="small" @click="quickCheckin(record)">直接入住</a-button>
            </a-space>
            <a-tag v-else color="default">{{ statusText(record.room_status) }}</a-tag>
          </template>
        </template>
      </a-table>
    </template>

    <template v-else>
      <div class="floor-grid-wrapper">
        <h4>楼层平面图 - 实时余量</h4>
        <div class="floor-grid">
          <div
            v-for="room in hotelStore.rooms"
            :key="room.id"
            :class="['grid-cell', `cell-${room.room_status}`]"
            @click="showRoomDetail(room)"
          >
            <div class="grid-room-num">{{ room.room_number }}</div>
            <div class="grid-type">{{ typeName(room.room_type) }}</div>
            <div class="grid-price">¥{{ room.room_price }}</div>
            <div class="grid-status-label">{{ statusText(room.room_status) }}</div>
          </div>
        </div>
      </div>
    </template>

    <a-drawer
      v-model:open="drawerVisible"
      :title="`房间 ${currentRoom?.room_number} 详情`"
      :width="480"
    >
      <template v-if="currentRoom">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="房号">{{ currentRoom.room_number }}</a-descriptions-item>
          <a-descriptions-item label="名称">{{ currentRoom.room_name }}</a-descriptions-item>
          <a-descriptions-item label="房型">{{ typeName(currentRoom.room_type) }}</a-descriptions-item>
          <a-descriptions-item label="价格">¥{{ currentRoom.room_price }}/晚</a-descriptions-item>
          <a-descriptions-item label="楼层">{{ currentRoom.floor }}楼</a-descriptions-item>
          <a-descriptions-item label="面积">{{ currentRoom.area }}m²</a-descriptions-item>
          <a-descriptions-item label="床型">{{ bedName(currentRoom.bed_type) }}</a-descriptions-item>
          <a-descriptions-item label="最大人数">{{ currentRoom.max_guests }}人</a-descriptions-item>
          <a-descriptions-item label="设施">
            <a-space :size="[0, 4]" wrap>
              <a-tag v-for="f in currentRoom.facilities" :key="f">{{ f }}</a-tag>
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item label="描述">{{ currentRoom.description }}</a-descriptions-item>
        </a-descriptions>
        <div class="drawer-actions" style="margin-top: 20px;">
          <a-button type="primary" block size="large" :disabled="currentRoom.room_status !== 'available'" @click="quickBook(currentRoom)">
            快速预订此房间
          </a-button>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { RoomInfo } from '@/types'
import { useHotelStore } from '@/stores/hotel'

const hotelStore = useHotelStore()
const viewMode = ref<'table' | 'grid'>('grid')
const queryDate = ref<any>(null)
const queryDateEnd = ref<any>(null)
const filterType = ref<string | undefined>()
const drawerVisible = ref(false)
const currentRoom = ref<RoomInfo | null>(null)

const columns = [
  { title: '房号', dataIndex: 'room_number', width: 80 },
  { title: '名称', dataIndex: 'room_name', ellipsis: true },
  { title: '房型', dataIndex: 'room_type', width: 100 },
  { title: '价格(元/晚)', dataIndex: 'room_price', key: 'room_price', width: 120 },
  { title: '状态', dataIndex: 'room_status', key: 'room_status', width: 110 },
  { title: '楼层', dataIndex: 'floor', width: 60 },
  { title: '面积(m²)', dataIndex: 'area', width: 90 },
  { title: '操作', key: 'action', width: 200 }
]

function badgeStatus(s: string): string {
  return ({ available: 'success', occupied: 'warning', maintenance: 'error', cleaning: 'processing' } as Record<string, string>)[s] || 'default'
}

function statusText(s: string): string {
  return ({ available: '空闲', occupied: '已入住', maintenance: '维修中', cleaning: '清洁中' } as Record<string, string>)[s] || s
}

function typeName(t: string): string {
  return ({ standard: '标准', deluxe: '豪华', suite: '套房', presidential: '总统' } as Record<string, string>)[t] || t
}

function bedName(b: string): string {
  return ({ single: '单人床', double: '双人床', king: '大床', twin: '双床' } as Record<string, string>)[b] || b
}

function quickBook(room: RoomInfo) { message.info(`预订 ${room.room_number}`) }
function quickCheckin(room: RoomInfo) { message.info(`直接入住 ${room.room_number}`) }
function showRoomDetail(room: RoomInfo) {
  currentRoom.value = room
  drawerVisible.value = true
}

onMounted(() => hotelStore.fetchRooms())
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
.floor-grid-wrapper h4 { margin-bottom: 12px; }
.floor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
}
.grid-cell {
  background: #fff;
  border-radius: 8px;
  padding: 12px 8px;
  text-align: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all .2s;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
}
.grid-cell:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.12); }
.cell-available { border-color: #b7eb8f; }
.cell-occupied { border-color: #91d5ff; opacity: 0.85; }
.cell-maintenance { border-color: #ffa39e; }
.cell-cleaning { border-color: #ffd591; }
.grid-room-num { font-weight: bold; font-size: 16px; }
.grid-type { font-size: 11px; color: rgba(0,0,0,0.45); margin-top: 2px; }
.grid-price { font-size: 13px; color: #1890ff; font-weight: 600; margin-top: 4px; }
.grid-status-label { font-size: 11px; margin-top: 4px; padding: 1px 8px; border-radius: 8px; display: inline-block; }
.cell-available .grid-status-label { background: #f6ffed; color: #52c41a; }
.cell-occupied .grid-status-label { background: #e6f7ff; color: #1890ff; }
.cell-maintenance .grid-status-label { background: #fff2f0; color: #ff4d4f; }
.cell-cleaning .grid-status-label { background: #fffbe6; color: #faad14; }
:deep(.row-status-available) { background: #f6ffed; }
:deep(.row-status-occupied) { background: #e6f7ff; }
</style>
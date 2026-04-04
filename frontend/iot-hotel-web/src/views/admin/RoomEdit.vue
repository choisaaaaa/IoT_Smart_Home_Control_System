<template>
  <div class="room-edit">
    <div class="toolbar">
      <a-space>
        <a-input-search v-model:value="searchKey" placeholder="搜索房号/名称" style="width: 220px;" allow-clear />
        <a-select v-model:value="filterFloor" placeholder="按楼层筛选" allow-clear style="width: 130px;">
          <a-select-option v-for="f in floors" :key="f" :value="f">{{ f }}楼</a-select-option>
        </a-select>
      </a-space>
      <a-space>
        <a-button type="primary" @click="showAddModal"><PlusOutlined /> 新增房间</a-button>
        <a-button @click="batchEdit">批量编辑</a-button>
      </a-space>
    </div>

    <a-table
      :columns="columns"
      :data-source="filteredRooms"
      :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
      :loading="loading"
      :pagination="{ pageSize: 10, showSizeChanger: false }"
      row-key="id"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'room_status'">
          <a-select
            v-model:value="record.room_status"
            size="small"
            style="width: 100px;"
            @change="(val: string) => updateStatus(record.id, val)"
          >
            <a-select-option value="available">空闲</a-select-option>
            <a-select-option value="occupied">已入住</a-select-option>
            <a-select-option value="maintenance">维修</a-select-option>
            <a-select-option value="cleaning">清洁</a-select-option>
          </a-select>
        </template>
        <template v-if="column.key === 'room_price'">
          <a-input-number v-model:value="record.priceNum" size="small" :min="0" :precision="2" style="width: 100px;" />
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="editRoom(record)">编辑</a-button>
            <a-popconfirm title="确定删除此房间？" @confirm="deleteRoom(record.id)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="modalVisible" :title="editingRoom ? '编辑房间' : '新增房间'" @ok="saveRoom" width="600px">
      <a-form :model="formModel" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="房号" required>
              <a-input v-model:value="formModel.room_number" placeholder="如 101" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="房型">
              <a-select v-model:value="formModel.room_type">
                <a-select-option value="standard">标准间</a-select-option>
                <a-select-option value="deluxe">豪华间</a-select-option>
                <a-select-option value="suite">套房</a-select-option>
                <a-select-option value="presidential">总统套房</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="楼层">
              <a-input-number v-model:value="formModel.floor" :min="1" :max="30" style="width: 100%;" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="面积(m²)">
              <a-input-number v-model:value="formModel.areaNum" :min="10" :precision="2" style="width: 100%;" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="价格(元/晚)">
              <a-input-number v-model:value="formModel.priceNum" :min="0" :precision="2" style="width: 100%;" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="床型">
              <a-select v-model:value="formModel.bed_type">
                <a-select-option value="single">单人床</a-select-option>
                <a-select-option value="double">双人床</a-select-option>
                <a-select-option value="king">大床</a-select-option>
                <a-select-option value="twin">双床</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="房间名称">
          <a-input v-model:value="formModel.room_name" placeholder="如 标准单人房A" />
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea v-model:value="formModel.description" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { RoomInfo } from '@/types'
import { useHotelStore } from '@/stores/hotel'

const hotelStore = useHotelStore()
const loading = ref(false)
const searchKey = ref('')
const filterFloor = ref<number | undefined>()
const modalVisible = ref(false)
const editingRoom = ref<RoomInfo | null>(null)
const selectedRowKeys = ref<number[]>([])

const formModel = reactive({
  room_number: '', room_type: 'standard', room_name: '',
  floor: 1, areaNum: 25, priceNum: 299, bed_type: 'single',
  max_guests: 1, description: ''
})

const columns = [
  { title: '房号', dataIndex: 'room_number', key: 'room_number', width: 80, fixed: 'left' as const },
  { title: '名称', dataIndex: 'room_name', key: 'room_name', ellipsis: true },
  { title: '房型', dataIndex: 'room_type', key: 'room_type', width: 100 },
  { title: '价格', dataIndex: 'room_price', key: 'room_price', width: 120 },
  { title: '状态', dataIndex: 'room_status', key: 'room_status', width: 140 },
  { title: '楼层', dataIndex: 'floor', key: 'floor', width: 70 },
  { title: '操作', key: 'action', width: 140, fixed: 'right' as const }
]

const filteredRooms = computed(() => {
  let list = [...hotelStore.rooms]
  if (searchKey.value) {
    const k = searchKey.value.toLowerCase()
    list = list.filter(r => r.room_number.includes(k) || r.room_name.toLowerCase().includes(k))
  }
  if (filterFloor.value !== undefined && filterFloor.value !== null) {
    list = list.filter(r => r.floor === filterFloor.value)
  }
  return list.map(r => ({ ...r, priceNum: Number(r.room_price), areaNum: Number(r.area) }))
})

const floors = computed(() => [...new Set(hotelStore.rooms.map(r => r.floor))].sort())

function onSelectChange(keys: number[]) { selectedRowKeys.value = keys }

function showAddModal() {
  editingRoom.value = null
  Object.assign(formModel, { room_number: '', room_type: 'standard', room_name: '', floor: 1, areaNum: 25, priceNum: 299, bed_type: 'single', max_guests: 1, description: '' })
  modalVisible.value = true
}

function editRoom(room: any) {
  editingRoom.value = room
  Object.assign(formModel, {
    room_number: room.room_number, room_type: room.room_type, room_name: room.room_name,
    floor: room.floor, areaNum: Number(room.area), priceNum: Number(room.room_price),
    bed_type: room.bed_type, max_guests: room.max_guests, description: room.description
  })
  modalVisible.value = true
}

async function saveRoom() {
  message.success(editingRoom.value ? '房间信息已更新' : '房间创建成功')
  modalVisible.value = false
}

async function updateStatus(id: number, val: string) {
  message.info(`房间 ${id} 状态变更为 ${val}`)
}

function deleteRoom(id: number) {
  message.success('房间已删除')
}

function batchEdit() {
  if (!selectedRowKeys.value.length) { message.warning('请先选择房间'); return }
  message.info(`已选择 ${selectedRowKeys.value.length} 个房间进行批量编辑`)
}

onMounted(() => hotelStore.fetchRooms())
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
</style>
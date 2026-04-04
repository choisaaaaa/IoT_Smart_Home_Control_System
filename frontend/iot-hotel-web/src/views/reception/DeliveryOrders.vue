<template>
  <div class="delivery-orders">
    <a-row :gutter="[16, 16]">
      <a-col :xs="12" :sm="8">
        <a-card size="small" class="stat-card">
          <a-statistic title="待配送" :value="pendingCount" :value-style="{ color: '#faad14' }"><template #icon><SendOutlined /></template></a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="8">
        <a-card size="small" class="stat-card">
          <a-statistic title="配送中" :value="deliveringCount" :value-style="{ color: '#1890ff' }"><template #icon><CarOutlined /></template></a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="8">
        <a-card size="small" class="stat-card">
          <a-statistic title="今日已完成" :value="doneCount" :value-style="{ color: '#52c41a' }"><template #icon><CheckCircleOutlined /></template></a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <div class="toolbar" style="margin-top: 16px;">
      <a-input-search v-model:value="searchKey" placeholder="搜索订单号/房号" style="width: 240px;" allow-clear />
      <a-button type="primary" @click="showCreateModal"><PlusOutlined /> 新建送物订单</a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="orders"
      :pagination="{ pageSize: 10 }"
      row-key="id"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'category'">
          <a-tag>{{ categoryLabel(record.category) }}</a-tag>
        </template>
        <template v-if="column.key === 'status'">
          <a-badge :status="deliveryBadge(record.status)" :text="deliveryStatusText(record.status)" />
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" v-if="record.status === 'pending'" @click="startDelivery(record)">开始配送</a-button>
            <a-button type="link" size="small" v-if="record.status === 'delivering'" @click="completeDelivery(record)">送达确认</a-button>
            <a-popconfirm title="取消此订单？" @confirm="cancelOrder(record)">
              <a-button type="link" size="small" danger v-if="record.status === 'pending'">取消</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="modalVisible" title="新建送物订单" @ok="createDelivery" width="500px">
      <a-form :model="form" layout="vertical">
        <a-form-item label="目标房间" required>
          <a-select v-model:value="form.room_id" show-search placeholder="选择房间">
            <a-select-option v-for="r in hotelStore.rooms" :key="r.id" :value="r.id">{{ r.room_number }} - {{ r.room_name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="物品类别" required>
          <a-select v-model:value="form.category">
            <a-select-option value="beverage">饮品</a-select-option>
            <a-select-option value="food">食品</a-select-option>
            <a-select-option value="daily">日用品</a-select-option>
            <a-select-option value="other">其他</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="物品名称" required>
          <a-input v-model:value="form.item_name" placeholder="如 矿泉水、方便面等" />
        </a-form-item>
        <a-form-item label="数量">
          <a-input-number v-model:value="form.quantity" :min="1" :max="20" style="width: 100%;" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="form.note" :rows="2" placeholder="特殊要求..." />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { SendOutlined, CarOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { useHotelStore } from '@/stores/hotel'

const hotelStore = useHotelStore()
const searchKey = ref('')
const modalVisible = ref(false)

const form = reactive({ room_id: undefined as number | undefined, category: 'beverage', item_name: '', quantity: 1, note: '' })

const orders = ref([
  { id: 1, order_no: 'DLV20260404001', room: '102', category: 'beverage', item_name: '矿泉水', quantity: 2, note: '送到房间', status: 'processing', created_at: '2026-04-04 10:00' },
  { id: 2, order_no: 'DLV20260404002', room: '102', category: 'food', item_name: '方便面', quantity: 1, note: '', status: 'pending', created_at: '2026-04-04 11:30' },
  { id: 3, order_no: 'DLV20260404003', room: '205', category: 'daily', item_name: '毛巾', quantity: 2, note: '需要大毛巾', status: 'delivering', created_at: '2026-04-04 13:00' },
  { id: 4, order_no: 'DLV20260403001', room: '301', category: 'beverage', item_name: '可乐', quantity: 4, note: '', status: 'completed', created_at: '2026-04-03 21:00' }
])

const pendingCount = computed(() => orders.value.filter(o => o.status === 'pending').length)
const deliveringCount = computed(() => orders.value.filter(o => o.status === 'delivering').length)
const doneCount = computed(() => orders.value.filter(o => o.status === 'completed').length)

const columns = [
  { title: '订单号', dataIndex: 'order_no', width: 170 },
  { title: '房间', dataIndex: 'room', width: 70 },
  { title: '类别', dataIndex: 'category', key: 'category', width: 80 },
  { title: '物品', dataIndex: 'item_name', width: 120 },
  { title: '数量', dataIndex: 'quantity', width: 60 },
  { title: '备注', dataIndex: 'note', ellipsis: true },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'created_at', width: 160 },
  { title: '操作', key: 'action', width: 140 }
]

function categoryLabel(c: string): string {
  return ({ beverage: '🍶 饮品', food: '🍕 食品', daily: '🧴 日用品', other: '📦 其他' } as Record<string, string>)[c] || c
}

function deliveryBadge(s: string): string {
  return ({ pending: 'warning', processing: 'default', delivering: 'processing', completed: 'success' } as Record<string, string>)[s] || 'default'
}

function deliveryStatusText(s: string): string {
  return ({ pending: '待处理', processing: '处理中', delivering: '配送中', completed: '已送达' } as Record<string, string>)[s] || s
}

function showCreateModal() { modalVisible.value = true }
async function createDelivery() { message.success('送物订单已创建'); modalVisible.value = false }
function startDelivery(order: any) { order.status = 'delivering'; message.info(`${order.order_no} 开始配送`) }
function completeDelivery(order: any) { order.status = 'completed'; message.success(`${order.order_no} 已送达`) }
function cancelOrder(order: any) { message.warning(`已取消 ${order.order_no}`) }

onMounted(() => hotelStore.fetchRooms())
</script>

<style scoped>
.stat-card { text-align: center; cursor: pointer; }
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
</style>
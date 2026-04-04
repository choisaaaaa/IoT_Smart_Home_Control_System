<template>
  <div class="reception-bookings">
    <div class="toolbar">
      <a-space>
        <a-input-search v-model:value="searchKey" placeholder="搜索预订号/客人名" style="width: 240px;" allow-clear />
        <a-select v-model:value="filterStatus" placeholder="状态筛选" allow-clear style="width: 140px;">
          <a-select-option value="confirmed">已确认</a-select-option>
          <a-select-option value="checked_in">已入住</a-select-option>
          <a-select-option value="checked_out">已退房</a-select-option>
          <a-select-option value="cancelled">已取消</a-select-option>
        </a-select>
      </a-space>
      <a-button type="primary" @click="showCreateModal"><PlusOutlined /> 新建预订</a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="bookings"
      :loading="loading"
      :pagination="{ pageSize: 10 }"
      row-key="id"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="statusColor(record.status)">{{ statusText(record.status) }}</a-tag>
        </template>
        <template v-if="column.key === 'total_price'">
          <span style="font-weight: 600;">¥{{ record.total_price }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="viewDetail(record)">详情</a-button>
            <a-dropdown v-if="record.status === 'confirmed'">
              <a-button type="link" size="small">操作 <DownOutlined /></a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="confirmBooking(record)">确认预订</a-menu-item>
                  <a-menu-item @click="doCheckin(record)">办理入住</a-menu-item>
                  <a-menu-item danger @click="cancelBooking(record)">取消预订</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="modalVisible" title="新建预订" @ok="createBooking" width="600px">
      <a-form :model="newBooking" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="客人姓名" required><a-input v-model:value="newBooking.guest_name" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系电话" required><a-input v-model:value="newBooking.phone" /></a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="入住日期"><a-date-picker v-model:value="newBooking.check_in" style="width: 100%;" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="退房日期"><a-date-picker v-model:value="newBooking.check_out" style="width: 100%;" /></a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="房型偏好"><a-input v-model:value="newBooking.room_type_pref" placeholder="如 豪华大床房" /></a-form-item>
        <a-form-item label="备注"><a-textarea v-model:value="newBooking.remark" :rows="2" /></a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, DownOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

const loading = ref(false)
const searchKey = ref('')
const filterStatus = ref<string | undefined>()
const modalVisible = ref(false)

const columns = [
  { title: '预订号', dataIndex: 'booking_number', width: 170 },
  { title: '客人', dataIndex: 'guest_name', width: 100 },
  { title: '电话', dataIndex: 'phone', width: 130 },
  { title: '入住', dataIndex: 'check_in', width: 110 },
  { title: '退房', dataIndex: 'check_out', width: 110 },
  { title: '金额', dataIndex: 'total_price', key: 'total_price', width: 110 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', key: 'action', width: 160 }
]

const bookings = ref([
  { id: 1, booking_number: 'BK20260404001', guest_name: '王五', phone: '137****7000', check_in: '2026-04-04', check_out: '2026-04-06', total_price: '598.00', status: 'checked_in' },
  { id: 2, booking_number: 'BK20260404002', guest_name: '赵六', phone: '136****6000', check_in: '2026-04-05', check_out: '2026-04-08', total_price: '1797.00', status: 'confirmed' },
  { id: 3, booking_number: 'BK20260404003', guest_name: '钱七', phone: '135****5000', check_in: '2026-04-06', check_out: '2026-04-09', total_price: '8997.00', status: 'confirmed' },
  { id: 4, booking_number: 'BK20260404004', guest_name: '孙八', phone: '134****4000', check_in: '2026-04-07', check_out: '2026-04-09', total_price: '998.00', status: 'confirmed' },
  { id: 5, booking_number: 'BK20260403001', guest_name: '李四', phone: '139****9000', check_in: '2026-04-03', check_out: '2026-04-05', total_price: '598.00', status: 'cancelled' }
])

const newBooking = reactive({
  guest_name: '', phone: '', check_in: dayjs().add(1, 'day'), check_out: dayjs().add(3, 'day'),
  room_type_pref: '', remark: ''
})

function statusColor(s: string): string {
  return ({ confirmed: 'processing', checked_in: 'success', checked_out: 'default', cancelled: 'error' } as Record<string, string>)[s] || 'default'
}
function statusText(s: string): string {
  return ({ confirmed: '已确认', checked_in: '已入住', checked_out: '已退房', cancelled: '已取消' } as Record<string, string>)[s] || s
}

function showCreateModal() { modalVisible.value = true }

async function createBooking() {
  message.success('预订创建成功')
  modalVisible.value = false
}

function viewDetail(record: any) { message.info(`查看 ${record.booking_number} 详情`) }
function confirmBooking(record: any) { message.success(`${record.booking_number} 已确认`) }
function doCheckin(record: any) { message.info(`为 ${record.guest_name} 办理入住`) }
function cancelBooking(record: any) { message.warning(`已取消 ${record.booking_number}`) }

onMounted(async () => {
  loading.value = true
  try {
    const { bookingApi } = await import('@/api/booking')
    const res: any = await bookingApi.getBookingList()
    if (res.data?.list?.length) bookings.value = res.data.list
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
</style>
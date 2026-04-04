<template>
  <div class="reception-dashboard">
    <a-row :gutter="[16, 16]">
      <a-col :xs="12" :sm="6" v-for="s in stats" :key="s.key">
        <a-card size="small" :hoverable="true" class="stat-card">
          <a-statistic :title="s.title" :value="s.value" :value-style="{ color: s.color, fontSize: '24px' }">
            <template #prefix><component :is="s.icon" /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 16px;">
      <a-col :xs="24" :lg="14">
        <a-card title="今日入住/退房" size="small">
          <a-timeline>
            <a-timeline-item color="green" v-for="(item, i) in todayEvents.slice(0, 6)" :key="i">
              <div class="event-item">
                <strong>{{ item.guest }}</strong> · {{ item.room }}
                <a-tag :color="item.type === 'checkin' ? 'success' : 'warning'" size="small">{{ item.type === 'checkin' ? '入住' : '退房' }}</a-tag>
                <span class="event-time">{{ item.time }}</span>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="10">
        <a-card title="待处理事项" size="small">
          <a-list :data-source="pendingItems" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :title="item.title" :description="item.desc">
                  <template #avatar><a-badge :status="item.status" /></template>
                </a-list-item-meta>
                <a-button type="link" size="small">处理</a-button>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 16px;">
      <a-col :xs="24">
        <a-card title="当前在住客人" size="small">
          <a-table
            :columns="guestColumns"
            :data-source="currentGuests"
            :pagination="{ pageSize: 6 }"
            row-key="id"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'stay_days'">
                {{ record.stay_days }}晚
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small">退房</a-button>
                  <a-button type="link" size="small">续住</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  UserAddOutlined, UserDeleteOutlined,
  CalendarOutlined, FileTextOutlined
} from '@ant-design/icons-vue'
import { useHotelStore } from '@/stores/hotel'

const hotelStore = useHotelStore()

const stats = ref([
  { key: 'today_checkin', title: '今日入住', value: 5, color: '#52c41a', icon: UserAddOutlined },
  { key: 'today_checkout', title: '今日退房', value: 3, color: '#faad14', icon: UserDeleteOutlined },
  { key: 'available', title: '可售房间', value: hotelStore.getAvailableRooms().length || 7, color: '#1890ff', icon: CalendarOutlined },
  { key: 'pending_bills', title: '待结账单', value: 4, color: '#ff4d4f', icon: FileTextOutlined }
])

const todayEvents = ref([
  { guest: '王五', room: '102', type: 'checkin' as const, time: '09:15' },
  { guest: '赵六', room: '205', type: 'checkin' as const, time: '10:30' },
  { guest: '李四', room: '108', type: 'checkout' as const, time: '11:00' },
  { guest: '钱七', room: '301', type: 'checkin' as const, time: '13:20' },
  { guest: '孙八', room: '203', type: 'checkout' as const, time: '14:00' },
  { guest: '周九', room: '106', type: 'checkin' as const, time: '15:45' }
])

const pendingItems = ref([
  { title: '送物订单 DLV20260404001', desc: '102房 矿泉水x2', status: 'processing' as const },
  { title: '维修工单 MT20260404001', desc: '309房 空调故障', status: 'error' as const },
  { title: '预订确认 BK20260404003', desc: '钱七 总统套房', status: 'warning' as const },
  { title: '清洁请求', desc: '205房 客人要求打扫', status: 'processing' as const }
])

const guestColumns = [
  { title: '姓名', dataIndex: 'guest_name', width: 90 },
  { title: '房号', dataIndex: 'room_number', width: 80 },
  { title: '电话', dataIndex: 'phone', width: 130 },
  { title: '入住日期', dataIndex: 'check_in', width: 110 },
  { title: '预计退房', dataIndex: 'check_out', width: 110 },
  { title: '已住', dataIndex: 'stay_days', key: 'stay_days', width: 70 },
  { title: '操作', key: 'action', width: 140 }
]

const currentGuests = ref([
  { id: 1, guest_name: '王五', room_number: '102', phone: '137****7000', check_in: '2026-04-04', check_out: '2026-04-06', stay_days: 0 },
  { id: 2, guest_name: '赵六', room_number: '205', phone: '136****6000', check_in: '2026-04-05', check_out: '2026-04-08', stay_days: 0 },
  { id: 3, guest_name: '钱七', room_number: '301', phone: '135****5000', check_in: '2026-04-06', check_out: '2026-04-09', stay_days: -2 },
  { id: 4, guest_name: '吴十', room_number: '108', phone: '134****4000', check_in: '2026-04-02', check_out: '2026-04-05', stay_days: 2 },
  { id: 5, guest_name: '郑十一', room_number: '203', phone: '133****3000', check_in: '2026-04-01', check_out: '2026-04-04', stay_days: 3 }
])

onMounted(() => hotelStore.fetchRooms())
</script>

<style scoped>
.stat-card { text-align: center; }
.event-item { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.event-time { font-size: 12px; color: rgba(0,0,0,0.35); margin-left: auto; }
</style>
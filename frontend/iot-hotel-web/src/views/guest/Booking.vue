<template>
  <div class="guest-booking">
    <div class="hero-section">
      <h1>欢迎来到智联酒店</h1>
      <p>智能客房体验，尽在指尖</p>
    </div>

    <a-card class="booking-card" title="🏨 客房预订" :bordered="false">
      <a-form :model="form" layout="vertical" style="max-width: 680px; margin: 0 auto;">
        <a-row :gutter="20">
          <a-col :xs="24" :sm="12">
            <a-form-item label="入住日期" required>
              <a-date-picker v-model:value="form.check_in" style="width: 100%;" placeholder="选择入住日期" :disabled-date="(d: any) => d && d < dayjs().startOf('day')" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="退房日期" required>
              <a-date-picker v-model:value="form.check_out" style="width: 100%;" placeholder="选择退房日期" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="20">
          <a-col :xs="24" :sm="12">
            <a-form-item label="房型偏好">
              <a-select v-model:value="form.room_type" placeholder="选择房型" allow-clear>
                <a-select-option value="standard">标准间 - ¥299/晚</a-select-option>
                <a-select-option value="deluxe">豪华间 - ¥499/晚</a-select-option>
                <a-select-option value="suite">套房 - ¥899/晚</a-select-option>
                <a-select-option value="presidential">总统套房 - ¥2999/晚</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="入住人数">
              <a-input-number v-model:value="form.guests" :min="1" :max="4" style="width: 100%;" addon-after="人" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="客人信息">
          <a-input-group compact>
            <a-input v-model:value="form.guest_name" style="width: 50%;" placeholder="姓名" />
            <a-input v-model:value="form.phone" style="width: 50%;" placeholder="手机号" />
          </a-input-group>
        </a-form-item>

        <a-form-item label="特殊要求">
          <a-textarea v-model:value="form.remark" :rows="2" placeholder="如：需要高楼层、无烟房等" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" size="large" block @click="submitBooking" :loading="submitting">
            <CalendarOutlined /> 查询可用房间并预订
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-divider />

    <a-card title="✨ 热门房型推荐" :bordered="false">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :lg="8" v-for="room in recommendRooms" :key="room.id">
          <a-card hoverable size="small" class="room-recommend">
            <template #title>
              <span>{{ room.room_name }}</span>
              <a-tag color="blue" style="float: right;">{{ typeName(room.room_type) }}</a-tag>
            </template>
            <div class="room-preview">
              <div class="room-price">¥<strong>{{ room.room_price }}</strong><span>/晚</span></div>
              <div class="room-meta">
                <span>📍 {{ room.floor }}楼</span>
                <span>📐 {{ room.area }}m²</span>
                <span>🛏️ {{ bedName(room.bed_type) }}</span>
              </div>
              <div class="room-facilities">
                <a-tag v-for="f in room.facilities?.slice(0, 4)" :key="f" size="small">{{ f }}</a-tag>
              </div>
            </div>
            <a-button type="primary" block @click="quickBook(room)">立即预订</a-button>
          </a-card>
        </a-col>
      </a-row>
    </a-card>

    <a-modal v-model:open="resultVisible" title="预订结果" :footer="null">
      <a-result
        status="success"
        title="预订申请已提交！"
        :sub-title="`您的预订号：${bookingNo}。我们将在30分钟内确认您的预订。`"
      >
        <template #extra>
          <a-space>
            <a-button type="primary" @click="$router.push('/guest/checkin-online')">在线办理入住</a-button>
            <a-button @click="resultVisible = false">继续浏览</a-button>
          </a-space>
        </template>
      </a-result>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { CalendarOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import type { RoomInfo } from '@/types'
import { useHotelStore } from '@/stores/hotel'

const hotelStore = useHotelStore()
const submitting = ref(false)
const resultVisible = ref(false)
const bookingNo = ref('')

const form = reactive({
  check_in: dayjs().add(1, 'day'),
  check_out: dayjs().add(3, 'day'),
  room_type: undefined as string | undefined,
  guests: 1,
  guest_name: '',
  phone: '',
  remark: ''
})

const recommendRooms = computed(() => {
  return hotelStore.rooms.filter(r => r.room_status === 'available').slice(0, 6)
})

function typeName(t: string): string {
  return ({ standard: '标准间', deluxe: '豪华间', suite: '套房', presidential: '总统套房' } as Record<string, string>)[t] || t
}
function bedName(b: string): string {
  return ({ single: '单人床', double: '双人床', king: '大床', twin: '双床' } as Record<string, string>)[b] || b
}

async function submitBooking() {
  if (!form.check_in || !form.check_out) { message.warning('请选择入住和退房日期'); return }
  if (!form.guest_name || !form.phone) { message.warning('请填写联系人信息'); return }
  submitting.value = true
  try {
    await new Promise(r => setTimeout(r, 1000))
    bookingNo.value = `BK${dayjs().format('YYYYMMDDHHmmss')}`
    resultVisible.value = true
  } finally {
    submitting.value = false
  }
}

function quickBook(room: RoomInfo) {
  message.info(`预订 ${room.room_number} - ${room.room_name}`)
}

onMounted(() => hotelStore.fetchRooms())
</script>

<style scoped>
.hero-section { text-align: center; padding: 28px 0 12px; background: linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%); border-radius: 12px; margin-bottom: 20px; }
.hero-section h1 { font-size: 26px; background: linear-gradient(135deg, #1890ff, #722ed1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-section p { color: rgba(0,0,0,0.45); margin-top: 6px; font-size: 15px; }
.booking-card { box-shadow: 0 2px 12px rgba(0,0,0,.06); border-radius: 10px; }
.room-recommend { height: 100%; }
.room-price { text-align: center; margin: 12px 0; }
.room-price strong { font-size: 28px; color: #1890ff; }
.room-price span { font-size: 13px; color: rgba(0,0,0,0.45); }
.room-meta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; color: rgba(0,0,0,0.55); font-size: 13px; margin-bottom: 8px; }
.room-facilities { text-align: center; margin-bottom: 12px; }
</style>
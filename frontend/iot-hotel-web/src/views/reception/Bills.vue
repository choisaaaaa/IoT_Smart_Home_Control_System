<template>
  <div class="bills-page">
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="8">
        <a-card size="small">
          <a-statistic title="今日营收" :value="12856" prefix="¥" :value-style="{ color: '#1890ff', fontWeight: 600 }">
            <template #suffix><span style="font-size: 13px; color: #52c41a;"> ↑12.3%</span></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="8">
        <a-card size="small">
          <a-statistic title="本月累计" :value="386420" prefix="¥" :value-style="{ color: '#722ed1', fontWeight: 600 }" />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="8">
        <a-card size="small">
          <a-statistic title="待结算账单" :value="15" suffix="笔" :value-style="{ color: '#ff4d4f' }">
            <template #prefix><FileTextOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <div class="toolbar" style="margin-top: 16px;">
      <a-space>
        <a-range-picker />
        <a-select v-model:value="payMethodFilter" placeholder="支付方式" allow-clear style="width: 130px;">
          <a-select-option value="alipay">支付宝</a-select-option>
          <a-select-option value="wechat">微信支付</a-select-option>
          <a-select-option value="credit_card">银行卡</a-select-option>
          <a-select-option value="cash">现金</a-select-option>
        </a-select>
      </a-space>
      <a-space>
        <a-button><DownloadOutlined /> 导出报表</a-button>
        <a-button type="primary" @click="printBill"><PrinterOutlined /> 打印</a-button>
      </a-space>
    </div>

    <a-table
      :columns="columns"
      :data-source="bills"
      :pagination="{ pageSize: 10, showSizeChanger: true }"
      row-key="id"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'amount'">
          <span style="font-weight: 600;">¥{{ record.amount }}</span>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 'paid' ? 'success' : record.status === 'pending' ? 'warning' : 'default'">
            {{ record.status === 'paid' ? '已支付' : record.status === 'pending' ? '待支付' : '已退款' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="viewBillDetail(record)">查看明细</a-button>
            <a-button type="link" size="small" v-if="record.status === 'pending'" @click="collectPayment(record)">
              收款
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-drawer v-model:open="drawerVisible" :title="`账单 ${currentBill?.bill_no} 明细`" :width="520">
      <template v-if="currentBill">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="账单号">{{ currentBill.bill_no }}</a-descriptions-item>
          <a-descriptions-item label="客人">{{ currentBill.guest_name }}</a-descriptions-item>
          <a-descriptions-item label="房号">{{ currentBill.room_number }}</a-descriptions-item>
          <a-descriptions-item label="入住日期">{{ currentBill.check_in }}</a-descriptions-item>
          <a-descriptions-item label="退房日期">{{ currentBill.check_out }}</a-descriptions-item>
        </a-descriptions>
        <h4 style="margin: 16px 0 8px;">费用明细</h4>
        <a-table :columns="detailColumns" :data-source="billDetails" :pagination="false" size="small" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'amount'">¥{{ record.amount }}</template>
          </template>
        </a-table>
        <a-divider />
        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
          <span>合计</span>
          <span style="color: #ff4d4f;">¥{{ currentBill.amount }}</span>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { FileTextOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons-vue'

const payMethodFilter = ref<string | undefined>()
const drawerVisible = ref(false)
const currentBill = ref<any>(null)

const detailColumns = [
  { title: '项目', dataIndex: 'item' },
  { title: '说明', dataIndex: 'desc' },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 100 }
]

const billDetails = ref([
  { id: 1, item: '房费', desc: '标准间 x 2晚', amount: '598.00' },
  { id: 2, item: '餐饮消费', desc: '早餐 + 客房送餐', amount: '86.00' },
  { id: 3, item: '增值服务', desc: '洗衣服务', amount: '50.00' },
  { id: 4, item: '其他', desc: '迷你吧消费', amount: '35.00' }
])

const columns = [
  { title: '账单号', dataIndex: 'bill_no', width: 170 },
  { title: '客人', dataIndex: 'guest_name', width: 90 },
  { title: '房号', dataIndex: 'room_number', width: 70 },
  { title: '入住日期', dataIndex: 'check_in', width: 110 },
  { title: '退房日期', dataIndex: 'check_out', width: 110 },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 110 },
  { title: '支付方式', dataIndex: 'pay_method', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '操作', key: 'action', width: 140 }
]

const bills = ref([
  { id: 1, bill_no: 'BILL20260404001', guest_name: '王五', room_number: '102', check_in: '2026-04-04', check_out: '2026-04-06', amount: '769.00', pay_method: '支付宝', status: 'paid' },
  { id: 2, bill_no: 'BILL20260404002', guest_name: '赵六', room_number: '205', check_in: '2026-04-05', check_out: '2026-04-08', amount: '1797.00', pay_method: '微信', status: 'paid' },
  { id: 3, bill_no: 'BILL20260404003', guest_name: '钱七', room_number: '301', check_in: '2026-04-06', check_out: '2026-04-09', amount: '9182.00', pay_method: '银行卡', status: 'pending' },
  { id: 4, bill_no: 'BILL20260403001', guest_name: '孙八', room_number: '108', check_in: '2026-04-02', check_out: '2026-04-05', amount: '1298.00', pay_method: '微信', status: 'paid' },
  { id: 5, bill_no: 'BILL20260403002', guest_name: '周九', room_number: '203', check_in: '2026-04-01', check_out: '2026-04-04', amount: '1196.00', pay_method: '支付宝', status: 'refunded' }
])

function viewBillDetail(bill: any) {
  currentBill.value = bill
  drawerVisible.value = true
}

function collectPayment(bill: any) { message.success(`已收取 ${bill.guest_name} 账单 ¥${bill.amount}`) }
function printBill() { message.info('打印报表功能开发中...') }
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
</style>
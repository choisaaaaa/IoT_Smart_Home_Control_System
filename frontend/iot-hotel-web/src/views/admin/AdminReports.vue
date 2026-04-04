<template>
  <div class="admin-reports">
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="8">
        <a-card>
          <a-statistic title="今日营收" :value="12856" prefix="¥" :value-style="{ color: '#1890ff', fontWeight: 600 }">
            <template #suffix>
              <span style="font-size: 13px; color: #52c41a;"> ↑12.3%</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="8">
        <a-card>
          <a-statistic title="本月累计" :value="386420" prefix="¥" :value-style="{ color: '#722ed1', fontWeight: 600 }" />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="8">
        <a-card>
          <a-statistic title="待结算账单" :value="15" suffix="笔" :value-style="{ color: '#faad14' }">
            <template #prefix><FileTextOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 16px;">
      <a-col :xs="24" :lg="14">
        <a-card title="营收趋势（近7日）" size="small">
          <div ref="revenueChartRef" style="height: 320px;"></div>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="10">
        <a-card title="收入构成" size="small">
          <div ref="pieChartRef" style="height: 320px;"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-card title="账单明细" size="small" style="margin-top: 16px;">
      <a-table
        :columns="billColumns"
        :data-source="bills"
        :pagination="{ pageSize: 8 }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'amount'">
            <span style="font-weight: 600; color: #1890ff;">¥{{ record.amount }}</span>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'paid' ? 'success' : record.status === 'pending' ? 'warning' : 'default'">
              {{ record.status === 'paid' ? '已支付' : record.status === 'pending' ? '待支付' : '已退款' }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { FileTextOutlined } from '@ant-design/icons-vue'

const revenueChartRef = ref<HTMLDivElement>()
const pieChartRef = ref<HTMLDivElement>()

const billColumns = [
  { title: '账单号', dataIndex: 'bill_no', width: 160 },
  { title: '客人', dataIndex: 'guest_name', width: 100 },
  { title: '房号', dataIndex: 'room_number', width: 80 },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 110 },
  { title: '支付方式', dataIndex: 'pay_method', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '日期', dataIndex: 'date', width: 120 }
]

const bills = ref([
  { id: 1, bill_no: 'BILL20260404001', guest_name: '王五', room_number: '102', amount: '598.00', pay_method: '支付宝', status: 'paid', date: '2026-04-04' },
  { id: 2, bill_no: 'BILL20260404002', guest_name: '赵六', room_number: '205', amount: '1797.00', pay_method: '微信', status: 'paid', date: '2026-04-03' },
  { id: 3, bill_no: 'BILL20260404003', guest_name: '钱七', room_number: '301', amount: '8997.00', pay_method: '银行卡', status: 'pending', date: '2026-04-04' },
  { id: 4, bill_no: 'BILL20260403001', guest_name: '孙八', room_number: '108', amount: '1298.00', pay_method: '微信', status: 'paid', date: '2026-04-03' },
  { id: 5, bill_no: 'BILL20260403002', guest_name: '周九', room_number: '203', amount: '598.00', pay_method: '支付宝', status: 'refunded', date: '2026-04-02' }
])

onMounted(async () => {
  await nextTick()
  if (revenueChartRef.value) {
    const c = echarts.init(revenueChartRef.value)
    c.setOption({
      grid: { top: 40, right: 20, bottom: 30, left: 55 },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['03-29', '03-30', '03-31', '04-01', '04-02', '04-03', '04-04'] },
      yAxis: { type: 'value', name: '元', min: 8000 },
      series: [
        { name: '营业收入', type: 'bar', data: [10580, 12340, 9860, 14200, 11560, 13200, 12856], itemStyle: { color: '#1890ff', borderRadius: [4, 4, 0, 0] } },
        { name: '趋势线', type: 'line', smooth: true, data: [10580, 11460, 10927, 12496, 11972, 12688, 12744], lineStyle: { color: '#faad14' }, symbol: 'none' }
      ]
    })
    window.addEventListener('resize', () => c.resize())
  }
  if (pieChartRef.value) {
    const c = echarts.init(pieChartRef.value)
    c.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
      legend: { bottom: 0 },
      series: [{
        type: 'pie',
        radius: ['35%', '65%'],
        center: ['50%', '48%'],
        itemStyle: { borderRadius: 6 },
        label: { formatter: '{b}\n{d}%' },
        data: [
          { value: 186500, name: '房费收入', itemStyle: { color: '#1890ff' } },
          { value: 42800, name: '餐饮消费', itemStyle: { color: '#52c41a' } },
          { value: 25600, name: '增值服务', itemStyle: { color: '#faad14' } },
          { value: 131520, name: '其他收入', itemStyle: { color: '#722ed1' } }
        ]
      }]
    })
    window.addEventListener('resize', () => c.resize())
  }
})
</script>
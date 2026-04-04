import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin',
    component: () => import('@/components/layout/AdminLayout.vue'),
    meta: { title: '管理端', icon: 'SettingOutlined' },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '总览仪表盘', icon: 'DashboardOutlined' }
      },
      {
        path: 'devices',
        name: 'DeviceMonitor',
        component: () => import('@/views/admin/DeviceMonitor.vue'),
        meta: { title: '设备监控', icon: 'MonitorOutlined' }
      },
      {
        path: 'rooms/edit',
        name: 'RoomEdit',
        component: () => import('@/views/admin/RoomEdit.vue'),
        meta: { title: '房间信息管理', icon: 'HomeOutlined' }
      },
      {
        path: 'hotel/info',
        name: 'HotelInfoEdit',
        component: () => import('@/views/admin/HotelInfoEdit.vue'),
        meta: { title: '酒店信息编辑', icon: 'BankOutlined' }
      },
      {
        path: 'reports',
        name: 'AdminReports',
        component: () => import('@/views/admin/AdminReports.vue'),
        meta: { title: '账单报表', icon: 'FileTextOutlined' }
      }
    ]
  },
  {
    path: '/reception',
    component: () => import('@/components/layout/ReceptionLayout.vue'),
    meta: { title: '前台端', icon: 'CustomerServiceOutlined' },
    children: [
      {
        path: '',
        redirect: '/reception/dashboard'
      },
      {
        path: 'dashboard',
        name: 'ReceptionDashboard',
        component: () => import('@/views/reception/Dashboard.vue'),
        meta: { title: '前台总览', icon: 'DashboardOutlined' }
      },
      {
        path: 'checkinout',
        name: 'CheckInOut',
        component: () => import('@/views/reception/CheckInOut.vue'),
        meta: { title: '入住退房', icon: 'LoginOutlined' }
      },
      {
        path: 'bookings',
        name: 'ReceptionBookings',
        component: () => import('@/views/reception/Bookings.vue'),
        meta: { title: '预订管理', icon: 'CalendarOutlined' }
      },
      {
        path: 'room-availability',
        name: 'RoomAvailability',
        component: () => import('@/views/reception/RoomAvailability.vue'),
        meta: { title: '客房余量', icon: 'ApartmentOutlined' }
      },
      {
        path: 'workorders',
        name: 'WorkOrders',
        component: () => import('@/views/reception/WorkOrders.vue'),
        meta: { title: '工单处理', icon: 'ToolOutlined' }
      },
      {
        path: 'delivery',
        name: 'DeliveryOrders',
        component: () => import('@/views/reception/DeliveryOrders.vue'),
        meta: { title: '客房送物', id: 'SendOutlined' }
      },
      {
        path: 'bills',
        name: 'Bills',
        component: () => import('@/views/reception/Bills.vue'),
        meta: { title: '账单报表', icon: 'DollarOutlined' }
      }
    ]
  },
  {
    path: '/guest',
    component: () => import('@/components/layout/GuestLayout.vue'),
    meta: { title: '客户端', icon: 'MobileOutlined' },
    children: [
      {
        path: '',
        redirect: '/guest/booking'
      },
      {
        path: 'booking',
        name: 'GuestBooking',
        component: () => import('@/views/guest/Booking.vue'),
        meta: { title: '客房预订', icon: 'CalendarOutlined' }
      },
      {
        path: 'checkin-online',
        name: 'OnlineCheckIn',
        component: () => import('@/views/guest/OnlineCheckIn.vue'),
        meta: { title: '在线办理入住', icon: 'IdcardOutlined' }
      },
      {
        path: 'room/:roomId?',
        name: 'GuestRoom',
        component: () => import('@/views/guest/GuestRoom.vue'),
        meta: { title: '客房服务', icon: 'HomeOutlined' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string
  document.title = title ? `${title} - 智联酒店` : '智联酒店 - 智慧酒店物联网控制系统'
  next()
})

export default router
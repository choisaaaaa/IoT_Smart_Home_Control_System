<template>
  <div class="guest-layout">
    <a-layout>
      <a-layout-header class="guest-header">
        <div class="header-left">
          <MobileOutlined class="header-logo" />
          <h3 @click="$router.push('/guest/booking')">智联酒店</h3>
        </div>
        <div class="header-nav">
          <a-button
            type="text"
            :class="{ active: isActive('/guest/booking') || isActive('/guest/checkin-online') }"
            @click="$router.push('/guest/booking')"
          >预订入住</a-button>
          <a-button
            type="text"
            :class="{ active: isActive('/guest/room') }"
            @click="$router.push('/guest/room')"
          >客房服务</a-button>
          <a-button type="text" @click="$router.push('/admin/dashboard')">
            <SettingOutlined /> 管理入口
          </a-button>
        </div>
        <div class="header-right">
          <a-tag :color="appStore.connected ? 'success' : 'default'" size="small">
            {{ appStore.connected ? '在线' : '' }}
          </a-tag>
        </div>
      </a-layout-header>

      <a-layout-content class="guest-content">
        <router-view />
      </a-layout-content>

      <a-layout-footer class="guest-footer">
        <p>©2026 智联酒店 - 智慧酒店物联网控制系统</p>
        <p class="footer-links">
          <a href="#">关于我们</a> · <a href="#">服务条款</a> · <a href="#">隐私政策</a> · <a href="#">联系客服</a>
        </p>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { MobileOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const appStore = useAppStore()

function isActive(path: string): boolean {
  return route.path.startsWith(path)
}
</script>

<style scoped>
.guest-layout { min-height: 100vh; background: linear-gradient(180deg, #f0f5ff 0%, #e6f7ff 100%); }
.guest-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-left { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.header-logo { font-size: 26px; color: #1890ff; }
.header-left h3 { margin: 0; font-size: 18px; background: linear-gradient(135deg, #1890ff, #722ed1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700; }
.header-nav { display: flex; gap: 4px; }
.header-nav .ant-btn { font-size: 15px; padding: 4px 16px; border-radius: 20px; font-weight: 500; }
.header-nav .ant-btn.active { background: #e6f7ff; color: #1890ff; }
.header-right { display: flex; align-items: center; gap: 12px; }
.guest-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 24px;
  min-height: calc(100vh - 60px - 80px);
}
.guest-footer {
  text-align: center;
  padding: 20px;
  color: rgba(0,0,0,0.45);
  background: transparent;
}
.guest-footer p { margin: 4px 0; font-size: 13px; }
.footer-links a { color: rgba(0,0,0,0.45); }
.footer-links a:hover { color: #1890ff; }
</style>
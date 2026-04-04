import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const currentTier = ref<'admin' | 'floor' | 'room'>('admin')
  const connected = ref(false)
  const notifications = ref<{ id: string; type: string; message: string; time: string }[]>([])

  const notificationCount = computed(() => notifications.value.length)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setCurrentTier(tier: 'admin' | 'floor' | 'room') {
    currentTier.value = tier
  }

  function setConnected(status: boolean) {
    connected.value = status
  }

  function addNotification(type: string, message: string) {
    notifications.value.unshift({
      id: Date.now().toString(),
      type,
      message,
      time: new Date().toLocaleTimeString()
    })
    if (notifications.value.length > 50) notifications.value.pop()
  }

  function removeNotification(id: string) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function clearNotifications() {
    notifications.value = []
  }

  return {
    sidebarCollapsed,
    currentTier,
    connected,
    notifications,
    notificationCount,
    toggleSidebar,
    setCurrentTier,
    setConnected,
    addNotification,
    removeNotification,
    clearNotifications
  }
})
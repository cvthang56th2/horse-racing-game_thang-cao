import type { App } from 'vue'
import * as UIComponents from '@/components/ui'

export default {
  install(app: App) {
    // Register all UI components globally
    Object.entries(UIComponents).forEach(([name, component]) => {
      if (typeof component === 'object' && name) {
        app.component(name, component)
      }
    })
  }
}

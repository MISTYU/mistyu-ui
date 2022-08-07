import type { App } from 'vue'
import CForm from './Index.vue'

CForm.install = (app: App): void => {
  app.component(CForm.name, CForm)
}

export default CForm

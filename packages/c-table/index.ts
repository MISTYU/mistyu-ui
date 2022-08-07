import type { App } from 'vue'
import Ctable from './Index.vue'

Ctable.install = (app: App): void => {
  app.component(Ctable.name, Ctable)
}

export default Ctable

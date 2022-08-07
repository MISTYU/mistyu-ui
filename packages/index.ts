import type { App, Component } from "vue"

import CForm from "./c-form"
import Ctable from "./c-table"
// import CTable from "./c-form"

// 所有组件
const components: Component[] = [CForm, Ctable]

/**
 * 组件注册
 * @param {App} app Vue 对象
 * @returns {Void}
 */
const installs = (app: App) => {
  // 注册组件
  components.forEach(component => app.component(component.name as string, component))
}
// export {
//   CForm
// }

// 全部导出
export default {
  installs
}

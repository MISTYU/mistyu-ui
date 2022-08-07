import { series, parallel } from 'gulp'
import { run, withTaskName } from '../utils'


// 1. 打包样式
// 3. 打包工具方法
// 3. 打包所有组件
// 4. 生成一个组件库
export default series(
  withTaskName('clean', async () => run('pnpm run clean')),
  // 打包组件, 文档, 工具方法
  withTaskName('buildPackages', async () => run('pnpm run --filter "./packages/**" --parallel build')) // 运行 packages 下的所有 build script
)

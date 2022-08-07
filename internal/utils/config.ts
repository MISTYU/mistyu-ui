import path from "path"
import { outDir } from './path'
export const buildConfig = {
  esm: {
    module: 'ESNext', // tsconfig 输出的结果es6模块
    format: 'esm', // 需要配置格式化后的模块规范
    output: {
      name: 'es', // 打包到dist目录下的哪个目录
      path: path.resolve(outDir, 'es')
    },
    bundle: {
      path: 'mistyu-ui/es'
    }
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    output: {
      name: 'lib',
      path: path.resolve(outDir, 'lib')
    },
    bundle: {
      path: 'mistyu-ui/lib'
    }
  }
}

export type BuildConfig = typeof buildConfig

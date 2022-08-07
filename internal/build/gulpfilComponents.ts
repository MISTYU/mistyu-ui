// packages 下

// import { buildComponents } from '../internal/build'
import { rollup } from 'rollup'

// console.log('build components')

// buildComponents(__dirname, 'components')
import { dest, parallel, series, src } from "gulp"
import path from "path"
import { buildConfig } from "../utils/config"
import { outDir, projectRoot } from "../utils/path"
import gulpTs from 'gulp-typescript'
import { withTaskName } from "../utils"
import rollupVue from 'rollup-plugin-vue'
import rollupTs from 'rollup-plugin-typescript2'
import rollupScss from 'rollup-plugin-scss'

const overrides = {
  compilerOptions: {
    declaration: true,
  },
  exclude: ["gulpfile.ts"]
}

const buildComponents = (dirname: string, name: string) => {
  // 打包的格式：cjs es
  const tasks = Object.entries(buildConfig).map(([module, config]) => {
    const output = path.resolve(dirname, config.output.name)
    console.log(output, 'output')
    return series(
      withTaskName(`build:${dirname}`, () => {
        const tsConfig = path.resolve(projectRoot, 'tsconfig.json')
        const inputs = ['**/*ts', '!gulpfile.ts', '!node_modules']
        return src(inputs)
          .pipe(
            rollup({
              input: 'index.ts',
              output: {
                file: 'dist/index.js',
                format: 'es'
              },
              plugins: [
                rollupTs({
                  tsconfigOverride: overrides,
                }),
                rollupVue({
                  // Dynamically inject css as a <style> tag
                  // css: true,
                  // Explicitly convert template to render function
                  // compileTemplate: true
                }),
                rollupScss()
              ]
            })
          )
          .pipe(dest(`dist/index.${config.output.name}.js`))
      }),
      // withTaskName(`copy:${config.output.name}`, () => {
      //   return src(`${output}/**`)
      //     // 放到 es -> utils 和 lib -> utils
      //     // 将 utils 模块放到 dist 目录下的 es lib
      //     .pipe(dest(path.resolve(outDir, 'mistyu-ui', config.output.name, name)))
      // })
    )
  })

  return parallel(...tasks)
}

export default buildComponents(__dirname, 'packages')
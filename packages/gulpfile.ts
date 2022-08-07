import { rollup } from 'rollup'
import { parallel, series } from "gulp"
import path from "path"
import { buildConfig } from "../internal/utils/config"
import { outDir, projectRoot } from "../internal/utils/path"
import gulpTs from 'gulp-typescript'
import { withTaskName } from "../internal/utils"
import rollupVue from 'rollup-plugin-vue'
import rollupTs from 'rollup-plugin-typescript2'
import rollupScss from 'rollup-plugin-scss'
import nodeResolve from '@rollup/plugin-node-resolve' // 允许我们加载第三方模块
import commonJs from '@rollup/plugin-commonjs' // convert CommonJS modules to ES6

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
      withTaskName(`build:${dirname}`, async () => {
        const tsConfig = path.resolve(projectRoot, 'tsconfig.json')
        const inputs = ['**/*ts', '!gulpfile.ts', '!node_modules']
        await rollup({
          input: 'index.ts',
          output: {
            file: 'dist/index.js',
            format: 'es'
          },
          external: ["vue"],
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

// console.log(withTaskName(`build:packages`, async () => {
//   await rollup({
//     input: 'index.ts',
//     plugins: [
//       rollupTs({
//         tsconfigOverride: overrides,
//       }),
//       nodeResolve({
//         extensions: ['.mjs', '.js', '.json', '.ts'],
//       }),
//       rollupVue({
//         // Dynamically inject css as a <style> tag
//         // css: true,
//         // Explicitly convert template to render function
//         // compileTemplate: true
//       }),
//       rollupScss(),
//     ],
//     treeshake: true,
//   })
// }))

// export default buildComponents(__dirname, 'packages')
export default series(async () => {
  const bundle = await rollup({
    input: 'index.ts',
    plugins: [
      rollupVue({
        // Dynamically inject css as a <style> tag
        // css: true,
        // Explicitly convert template to render function
        // compileTemplate: true
      }),
      rollupTs({
        tsconfigOverride: overrides,
      }),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonJs(),
      rollupScss()
    ],
    treeshake: true
  })
  await bundle.write({
    file: './dist/index.es.js',
    format: 'es',
    sourcemap: true
  })
})
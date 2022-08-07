import chalk from 'chalk'
import { spawn } from 'child_process'
import consola from 'consola'
import { projectRoot } from './path'

export const withTaskName = <T>(name: string, func: T) => Object.assign(func, {
  displayName: name
})

// 在node中使用子进程运行脚本
export const run = async (command: string, cwd: string = projectRoot) =>
  new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    consola.info(`run: ${chalk.green(`${cmd} ${args.join(' ')}`)}`)
    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit', // 直接将这个子进程的输出共享给父进程
      shell: true, // 默认情况下 linux 才支持 rm -rf, 其他系统调用 git bash
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)
      if (code === 0) resolve()
      else
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        )
    })
    process.on('exit', onProcessExit)
  })

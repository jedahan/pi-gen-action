import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'

export async function installHostDependencies(): Promise<void> {
  let execOutput: exec.ExecOutput | undefined

  try {
    core.startGroup('Installing build dependencies on host')

    const sudoPath = await io.which('sudo', true)
    execOutput = await exec.getExecOutput(
      sudoPath,
      [
        'apt-get',
        '--no-install-recommends',
        '--no-install-suggests',
        'install',
        '-y',
        'binfmt-support',
        'qemu-user-static',
        'qemu-utils',
        'nbd-server',
        'nbd-client'
      ],
      {silent: true}
    )
    execOutput = await exec.getExecOutput(
      sudoPath,
      ['modprobe', '-a', 'binfmt_misc', 'nbd'],
      {silent: true}
    )
  } catch (error) {
    core.setFailed(`${(error as Error).message}\n${execOutput?.stderr}`)
  } finally {
    core.endGroup()
  }
}
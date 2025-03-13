import { Octokit } from '@octokit/rest'
import { createAppAuth } from '@octokit/auth-app'
import { context } from '@actions/github'
import { getInput } from '@actions/core'

export async function run(): Promise<void> {
  const { repo, owner } = context.repo
  const { ref, actor: creator } = context
  const environment = getInput('environment')
  const application = getInput('application')
  const infrastructure = getInput('infrastructure')
  const awsAccount = getInput('awsAccount')
  const useLatestManifest = getInput('useLatestManifest')
  const payload = {
    application,
    infrastructure,
    creator,
    awsAccount,
    useLatestManifest
  }
  const description = `Deploy: ${application} ${ref} ${environment} ${infrastructure} ${awsAccount}`

  const appId = getInput('appId')
  const installationId = getInput('installationId') || ''
  const privateKey = getInput('privateKey')
    .replaceAll(`"`, ``)
    .replaceAll(`\\n`, `\n`)

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      installationId,
      privateKey
    }
  })

  await octokit.repos.createDeployment({
    owner,
    repo,
    ref,
    environment,
    description: description,
    payload,
    auto_merge: false,
    auto_inactive: false,
    required_contexts: []
  })
  console.log(description)
}

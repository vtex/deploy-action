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
  const payload = {
    application,
    infrastructure,
    creator
  }
  const description = `Deploy: ${application} ${ref} ${environment} ${infrastructure}`

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
    required_contexts: []
  })
  console.log(description)
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const tslib_1 = require("tslib");
const rest_1 = require("@octokit/rest");
const auth_app_1 = require("@octokit/auth-app");
const github_1 = require("@actions/github");
const core_1 = require("@actions/core");
function run() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { repo, owner } = github_1.context.repo;
        const { ref, actor: creator } = github_1.context;
        const environment = (0, core_1.getInput)('environment');
        const application = (0, core_1.getInput)('application');
        const infrastructure = (0, core_1.getInput)('infrastructure');
        const awsAccount = (0, core_1.getInput)('awsAccount');
        const useLatestManifest = (0, core_1.getInput)('useLatestManifest');
        const useArtifactFrom = (0, core_1.getInput)('useArtifactFrom');
        const payload = {
            application,
            infrastructure,
            creator,
            awsAccount,
            useLatestManifest,
            useArtifactFrom
        };
        const shortRef = ref.split('/').pop();
        const description = `Deploy: ${application} ${shortRef} ${environment} ${infrastructure} ${awsAccount}`;
        const appId = (0, core_1.getInput)('appId');
        const installationId = (0, core_1.getInput)('installationId') || '';
        const privateKey = (0, core_1.getInput)('privateKey')
            .replaceAll(`"`, ``)
            .replaceAll(`\\n`, `\n`);
        const octokit = new rest_1.Octokit({
            authStrategy: auth_app_1.createAppAuth,
            auth: {
                appId,
                installationId,
                privateKey
            }
        });
        yield octokit.repos.createDeployment({
            owner,
            repo,
            ref: shortRef,
            environment,
            description: description,
            payload,
            auto_merge: false,
            auto_inactive: false,
            required_contexts: []
        });
        console.log(description);
    });
}
//# sourceMappingURL=main.js.map
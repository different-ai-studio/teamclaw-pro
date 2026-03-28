# TeamClaw Pro Build

Build and release configuration for TeamClaw Pro.

This repo contains **only CI/CD workflows and build config** -- no application code. It builds TeamClaw Pro by combining:

1. **[teamclaw](https://github.com/different-ai-studio/teamclaw)** (open-source) -- the application shell
2. **[teamclaw-plugin-team](https://github.com/different-ai-studio/teamclaw-plugin-team)** (private) -- the Pro team collaboration plugin
3. **build.config.json** -- Pro-specific build configuration

## How it works

```
Tag v* pushed to this repo
  -> release.yml triggered
  -> Clones open-source teamclaw
  -> Installs @teamclaw/plugin-team (private)
  -> Applies Pro build config
  -> Builds with --features team,p2p (macOS) / --features team (Windows)
  -> Uploads to GitHub Releases + Alibaba Cloud OSS
```

## Release

Push a version tag to trigger a release:

```bash
git tag v1.0.1
git push origin v1.0.1
```

## Required Secrets

| Secret | Purpose |
|--------|---------|
| `PLUGIN_DEPLOY_KEY` | SSH deploy key for private plugin repo |
| `TAURI_SIGNING_PRIVATE_KEY` | Tauri updater signing key |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Signing key password |
| `BUILD_CONFIG_PRODUCTION` | Production build config JSON |
| `APPLE_CERTIFICATE` | Apple Developer ID certificate (base64) |
| `APPLE_CERTIFICATE_PASSWORD` | Certificate password |
| `APPLE_ID` / `APPLE_PASSWORD` / `APPLE_TEAM_ID` | Apple notarization |
| `ALIYUN_ACCESS_KEY_ID` / `ALIYUN_ACCESS_KEY_SECRET` | Alibaba Cloud OSS |
| `KEYCHAIN_PASSWORD` | macOS CI keychain |
| `WECOM_WEBHOOK_KEY` | WeCom notifications |

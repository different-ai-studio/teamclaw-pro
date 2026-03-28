# TeamClaw Pro — Upstream Sync Guide

Pro 仓库是开源仓库的 fork，增加了团队协作功能。日常同步上游时，以下文件会有冲突，按此文档解决。

## 与开源仓库的差异文件

### 1. `packages/app/src/plugins/index.ts`

**开源版：**
```typescript
export function loadPlugins() {
  // Open-source: no plugins registered
}
```

**Pro 版（保持这个）：**
```typescript
import '@teamclaw/plugin-team'

export function loadPlugins() {
  // Team plugin self-registers via side-effect import above
}
```

---

### 2. `pnpm-workspace.yaml`

**开源版：**
```yaml
packages:
  - 'packages/*'
```

**Pro 版（加一行）：**
```yaml
packages:
  - 'packages/*'
  - 'plugins/*'
```

---

### 3. `packages/app/package.json`

**Pro 版多一行 dependency：**
```json
"@teamclaw/plugin-team": "workspace:*"
```

合并时保留这一行即可。

---

### 4. `src-tauri/Cargo.toml`

**开源版：**
```toml
[features]
default = []
```

**Pro 版（保留完整 features + 团队依赖）：**
```toml
[features]
default = ["team", "p2p"]
team = []
p2p = ["team", "dep:iroh", "dep:iroh-blobs", "dep:iroh-docs", "dep:iroh-gossip"]
```

以及额外的依赖项（iroh, aws-sdk-s3, aws-config, loro, quick-xml, aes-gcm, pbkdf2, gethostname, filetime, futures-lite）。

合并时：保留 Pro 的 features 和依赖，接受开源对其他部分的变更。

---

### 5. `src-tauri/src/plugins/mod.rs`

**开源版：**
```rust
pub fn register_all<R: tauri::Runtime>(
    builder: tauri::Builder<R>,
) -> tauri::Builder<R> {
    builder
}
```

**Pro 版（完整的团队 Plugin 注册）：** 保持 Pro 版本不变，这是唯一包含团队模块声明和 TauriPlugin 注册的文件。

---

### 6. Pro 独有目录（不会冲突）

- `plugins/team/` — 团队插件代码（前端 + Rust）
- `fc/` — 阿里云 FC 函数
- `crates/teamclaw-seed/` — P2P Seed 节点
- `.github/workflows/sync-upstream.yml` — 上游同步 CI

---

## 处理 Merge 冲突的原则

1. **`lib.rs`、`commands/mod.rs`** — 应始终与开源一致，直接接受上游版本
2. **上述 5 个差异文件** — 保留 Pro 的改动行
3. **其他文件** — 接受上游版本
4. 冲突解决后运行验证：
   ```bash
   pnpm --filter @teamclaw/app exec tsc --noEmit
   cd src-tauri && cargo check
   pnpm --filter @teamclaw/app build
   ```

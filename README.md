# DSH 插件自留备份

> 目的：**不依赖原作者仓库**。原作者更新、改名、删库，这里仍能装。
> 建立：2026-11-04 · 来源：`github.com/oldsan888/{dsh-global-memory, dsh-music-mode, dsh-voice-companion}`

## 为什么必须有这一份

这三个包**不在 npm 上**（`@oldsan888/*` 查无此包），作者的官方安装方式是从 GitHub 拉源码 + 本地 `prepare` 构建：

```
pnpm dsh plugin --profile web add "git+https://github.com/oldsan888/xxx.git#<40位commit>"
```

→ 仓库一旦删了，这条路就断了。所以这里保存：**完整源码 + 已构建的 lib + 打好的 tgz**。

## 目录

```
packages/            三个仓库的完整源码（已剔除 .git / node_modules）
  dsh-global-memory/
  dsh-music-mode/
  dsh-voice-companion/
tarballs/            已构建的安装包（pnpm pack 产物，可直接 file: 安装）
  oldsan888-dsh-global-memory-0.2.0.tgz       83 KB
  oldsan888-dsh-music-mode-0.2.0.tgz         738 KB
  oldsan888-dsh-voice-companion-0.2.0.tgz    605 KB
install-from-here.ps1  从本目录离线安装到 DSH profile
```

## 锁定版本（已核对的 commit）

| 包 | 版本 | commit | 日期 |
| --- | --- | --- | --- |
| dsh-global-memory | 0.2.0 | `edb5ec9f5c6be6e6b19e402e20f48b2fbb6afd36` | 2026-09-13 |
| dsh-music-mode | 0.2.0 | `2503276e68a7523acfe97ddfca25662c9bb6629d` | 2026-09-13 |
| dsh-voice-companion | 0.2.0 | `605fd579d7cdd45a4cd31d2255d307c3a172fadf` | 2026-09-01 |

## 依赖清点（哪些"外面"的东西会让它失效）

| 依赖 | 属于 | 风险 | 我们的处置 |
| --- | --- | --- | --- |
| `@deepseek-ai/dsh-storage-sqlite`、`@deepseek-ai/cordis`、`@deepseek-ai/dsh-agent` | DeepSeek 官方 npm | 低（官方包） | 跟随 DSH 版本即可 |
| `zod`、`yaml`、`tsdown`（构建期） | npm 通用包 | 极低 | 版本已锁在各自 `pnpm-lock.yaml` |
| **`vendor/regret-radio`**（音乐播放器，改自 Mineradio） | **已被作者内嵌在本仓库里** | 低（源码在我们手上） | 随 music-mode 一起备份 |
| **MiMo TTS 云服务（Base URL + API Key）** | **外部服务** | ⚠️ **最高**：服务停/涨价/改协议，voice-companion 就哑了 | 目前无替代；本地 TTS 是后手（Ollama/edge-tts） |
| 网易云 / QQ 音乐接口（music-mode 播放源） | 第三方 | 中：接口随时变 | 播放失败不影响插件加载 |
| SQLite 原生模块 | 本机二进制 | 低 | 随 `@deepseek-ai/dsh-storage-sqlite` 安装 |

**结论**：代码层面已经"冻住"；**唯一真正的外部依赖是 MiMo TTS 云服务**——它能用多久，voice-companion 就能用多久。

## 怎么用这份备份

### 方式 A：离线安装（推荐）

```powershell
powershell -ExecutionPolicy Bypass -File .\install-from-here.ps1
```
脚本会把三个 tgz 以 `file:` 方式装进 `%USERPROFILE%\.dsh\profiles\desktop`，并把三个 bundle 加进 `package.json` 的 `dsh.profile.bundles`；**装完重启 DSH**。

### 方式 B：从源码重建（tgz 丢了也能恢复）

```powershell
cd packages\dsh-voice-companion
pnpm install --frozen-lockfile --ignore-scripts
pnpm exec tsdown
pnpm pack --pack-destination ..\..\tarballs
```

## 放到自己的 GitHub（可选，多一层保险）

```powershell
cd <本目录>
git init
git add .
git commit -m "vendor: dsh plugins mirror (oldsan888, pinned)"
git branch -M main
git remote add origin https://github.com/<你的账号>/dsh-plugins-mirror.git
git push -u origin main
```
推上去之后，把 `install-from-here.ps1` 里的 `$Base` 改成你的 raw 地址，或直接 `git clone` 后再跑。

## 这三个插件**不能**做什么（重要）

- **不是"识别声音"**：没有任何 ASR/语音转文字；
- `dsh-voice-companion` 是**让我说话**（TTS 播报任务完成/提问/失败），不是听懂你说话；
- `dsh-music-mode` 是**放歌 + 我能控制播放**；
- `dsh-global-memory` 是**跨会话记忆**（SQLite）。
- 想让 AI"听懂音频"，需要另外接 ASR（Whisper / 阿里云 / 讯飞），这是另一件事。

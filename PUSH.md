# 推送到你自己的 GitHub（musice）

> 仓库：`https://github.com/Frank0200/musice`
> 本地镜像源：`F:\00\harnessproject\_vendor\dsh-plugins-mirror`
> 仓库工作副本：`F:\00\harnessproject\_vendor\_musice_push`
> 状态：**已推送** —— 2026-11-04 19:4x，commit `f00bae0`，**211 个文件 / 6.6 MB**（含 `packages/` 三个插件源码 + `tarballs/` 三个 tgz）

## 已经推上去的内容

| 目录/文件 | 内容 |
| --- | --- |
| `packages/dsh-global-memory/` | 完整源码（0.2.0，commit `edb5ec9f`） |
| `packages/dsh-music-mode/` | 完整源码（0.2.0，commit `2503276e`，含内嵌 `vendor/regret-radio`） |
| `packages/dsh-voice-companion/` | 完整源码（0.2.0，commit `605fd579`） |
| `tarballs/*.tgz` | 已构建好的安装包（可直接 `file:` 安装，不需要重新 build） |
| `install-from-here.ps1` | 离线安装脚本 |
| `README.md` | 依赖清点、风险表、重建步骤 |

## 以后怎么更新（本机已授权）

这台机器的 Git 已经把访问令牌存进 Windows 凭据管理器（`credential.helper=wincred`），**以后不用再输账号密码**：

```powershell
cd "F:\00\harnessproject\_vendor\_musice_push"
git pull                     # 先同步远端
# …把 _vendor\dsh-plugins-mirror 的新内容 robocopy 过来…
git add .
git commit -m "update: ..."
git push
```

⚠️ 令牌 30 天到期（2026-12-04）。到期后 `git push` 会 403，到 GitHub → Settings → Developer settings → Personal access tokens (classic) 重新生成一个（勾 `repo`），再执行一次：

```powershell
git config --global credential.helper wincred
"protocol=https`nhost=github.com`nusername=Frank0200`npassword=<新token>`n`n" | git credential approve
```

## 换机器 / 原仓库消失时怎么装回

```powershell
git clone https://github.com/Frank0200/musice.git F:\00\_mirror
powershell -ExecutionPolicy Bypass -File F:\00\_mirror\install-from-here.ps1
```

脚本会把三个 tgz 以 `file:` 方式装进 `%USERPROFILE%\.dsh\profiles\desktop`，并把三个 bundle 写进 `package.json`；装完**重启 DSH**。

## 提醒

- **不要提交** 任何 `.env`、API Key、`node_modules`（本目录已剔除 node_modules；本地若重装过，commit 前先看 `git status`）；
- `voice-companion` 需要 MiMo TTS 的 Base URL + Key，**那是外部服务，不在这个仓库里**；
- 这份镜像是**锁版本**用的：原仓库（oldsan888）以后更新或删除都不影响这里能跑通的版本。

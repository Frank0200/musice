# 推送到你自己的 GitHub（musice）

> 目标仓库：`https://github.com/Frank0200/musice`
> 本目录：`F:\00\harnessproject\_vendor\dsh-plugins-mirror`
> ⚠️ 我（AI）**没有推送权限**，也没有你的 token；下面三条命令请你在本机执行。

## 一次性推送

```powershell
cd "F:\00\harnessproject\_vendor\dsh-plugins-mirror"
git init
git add .
git commit -m "vendor: DSH plugins mirror (oldsan888 三件套, pinned commits + built tarballs)"
git branch -M main
git remote add origin https://github.com/Frank0200/musice.git
git push -u origin main
```

如果远端已有内容（比如 README），先 `git pull --rebase origin main` 再 push。

## 推上去之后怎么装（换机器/原仓库消失时）

```powershell
git clone https://github.com/Frank0200/musice.git F:\00\_mirror
powershell -ExecutionPolicy Bypass -File F:\00\_mirror\install-from-here.ps1
```
脚本会把三个 tgz 以 `file:` 方式装进 `%USERPROFILE%\.dsh\profiles\desktop`，并把三个 bundle 写进 `package.json`；装完重启 DSH。

## 这份镜像里有什么

| 目录/文件 | 内容 |
| --- | --- |
| `packages/dsh-global-memory/` | 完整源码（0.2.0，commit `edb5ec9f`） |
| `packages/dsh-music-mode/` | 完整源码（0.2.0，commit `2503276e`，含内嵌 `vendor/regret-radio`） |
| `packages/dsh-voice-companion/` | 完整源码（0.2.0，commit `605fd579`） |
| `tarballs/*.tgz` | 已构建好的安装包（可直接 file: 安装，不需要重新 build） |
| `install-from-here.ps1` | 离线安装脚本 |
| `README.md` | 依赖清点、风险表、重建步骤 |

## 提醒

- **不要提交** 任何 `.env`、API Key、`node_modules`（本目录已剔除 node_modules；若你本地重装过，commit 前检查 `git status`）；
- voice-companion 需要 MiMo TTS 的 Base URL + Key，**那是外部服务，不在这个仓库里**；
- 原仓库若还在，也不必再追更新——我们锁的是能跑通的版本。

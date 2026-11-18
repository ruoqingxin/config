# 项目配置

源表位于 `Datas`，按战斗、技能、敌人、物品、储物、地图六类拆分，另有注册表和品质枚举。

运行 `gen_client.bat`：Luban 导出 11 张运行表，打包并同步到相邻 `ItemChangeWorld` 客户端。需要 .NET 8；打包使用本目录的 Node。生成代码和数据不可手改。

现行开发规则见 `AGENTS.md` 及 `E:/NowChange/ItemChangeWorld/document/09_整合开发/README.md`。

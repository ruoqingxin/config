# 项目配置

源表位于 `Datas`，按战斗、技能、敌人、物品、储物、地图六类拆分，另有注册表和数值枚举。

运行 `gen_client.bat`：Luban 导出 22 张运行表，打包并同步到相邻 `ItemChangeWorld` 客户端。需要 .NET 8；打包使用本目录的 Node。生成代码和数据不可手改。

数字枚举表头用批注注明数字含义；数字 ID 右侧提供只读名称列，辅助列表头用 `##` 前缀、类型和分组留空，不参与导出。具体维护方式见现行第 09 号文档“配置设定规则”。

现行开发规则见 `AGENTS.md` 及 `E:/NowChange/ItemChangeWorld/document/09_整合开发/README.md`。

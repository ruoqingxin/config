const fs = require("fs");
const path = require("path");
// 每次导表统一清理生成器残留的英文说明及停用代码块。
const schemaFile = path.join(__dirname, "output_client/code/schema.ts");
const schema = fs.readFileSync(schemaFile, "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g,
    comment => /[\u3400-\u9fff]/.test(comment) ? comment : "")
    .replace(/[ \t]+(?=\r?$)/gm, "")
    .replace(/\n(?:[ \t]*\r?\n){3,}/g, "\n\n");
fs.writeFileSync(schemaFile, schema);
const dataDir = path.join(__dirname, "output_client/data");
const files = fs.readdirSync(dataDir).filter(name => name.endsWith(".bin")).sort();
if (!files.length) throw new Error("没有可打包的配置");
const int = value => { const b = Buffer.alloc(4); b.writeInt32LE(value); return b; };
const chunks = [int(files.length)];
for (const file of files) {
    const name = Buffer.from(path.basename(file, ".bin"), "utf8");
    const data = fs.readFileSync(path.join(dataDir, file));
    chunks.push(int(name.length), name, int(data.length), data);
}
fs.writeFileSync(path.join(__dirname, "configbin.bin"), Buffer.concat(chunks));
console.log(`已打包 ${files.length} 张配置表`);

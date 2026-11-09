const fs = require("fs");
const path = require("path");
const JSZip = require("../node_modules/jszip");

const root = path.resolve(__dirname, "..");
const datas = path.join(root, "Datas");

function cell(ref, value, style = 4, prefix = "x:") {
  if (value === "" || value === null || value === undefined) {
    return `<${prefix}c r="${ref}" s="${style}" />`;
  }
  if (typeof value === "number") {
    return `<${prefix}c r="${ref}" s="${style}" t="n"><${prefix}v>${value}</${prefix}v></${prefix}c>`;
  }
  const escaped = String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<${prefix}c r="${ref}" s="${style}" t="str"><${prefix}v>${escaped}</${prefix}v></${prefix}c>`;
}

function row(r, values, startCol = 1, style = 4, prefix = "x:") {
  const refs = [];
  for (let i = 0; i < values.length; i++) {
    const col = String.fromCharCode(65 + startCol - 1 + i);
    refs.push(cell(`${col}${r}`, values[i], style, prefix));
  }
  return `<${prefix}row r="${r}" ht="24" customHeight="1">${refs.join("")}</${prefix}row>`;
}

async function patchWorkbook(file, sheetIndex, addRows, dimensionRef) {
  const filePath = path.join(datas, file);
  const zip = await JSZip.loadAsync(fs.readFileSync(filePath));
  const sheetName = `xl/worksheets/sheet${sheetIndex}.xml`;
  let xml = await zip.file(sheetName).async("string");
  const existing = new Set((xml.match(/<(?:x:)?c r="B\d+"[^>]*>.*?<(?:x:)?v>(\d+)<\/(?:x:)?v>/g) || []).map(x => Number(x.match(/<(?:x:)?v>(\d+)<\/(?:x:)?v>/)[1])));
  const freshRows = addRows.filter(x => !existing.has(x.id)).map(x => x.xml).join("");
  if (freshRows) {
    xml = xml.replace(/<\/(?:x:)?sheetData>/, m => `${freshRows}${m}`);
    if (dimensionRef) {
      xml = xml.replace(/<x:dimension ref="[^"]+"/, `<x:dimension ref="${dimensionRef}"`);
    }
    zip.file(sheetName, xml);
    fs.writeFileSync(filePath, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
    console.log(`updated ${file} sheet${sheetIndex}: ${addRows.length} candidate rows`);
  } else {
    console.log(`unchanged ${file} sheet${sheetIndex}`);
  }
}

async function removeRows(file, sheetIndex, ids) {
  const filePath = path.join(datas, file);
  const zip = await JSZip.loadAsync(fs.readFileSync(filePath));
  const sheetName = `xl/worksheets/sheet${sheetIndex}.xml`;
  let xml = await zip.file(sheetName).async("string");
  const before = xml;
  for (const id of ids) {
    const re = new RegExp(`<x:row r="\\d+"[\\s\\S]*?<x:c r="B\\d+"[^>]*>\\s*<x:v>${id}<\\/x:v>[\\s\\S]*?<\\/x:row>`, "g");
    xml = xml.replace(re, "");
  }
  if (xml !== before) {
    zip.file(sheetName, xml);
    fs.writeFileSync(filePath, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
    console.log(`removed unsupported rows from ${file}`);
  }
}

async function restoreCWorkbook() {
  const filePath = path.join(datas, "C-战斗物资配置表.xlsx");
  const zip = await JSZip.loadAsync(fs.readFileSync(filePath));
  const sheetName = "xl/worksheets/sheet1.xml";
  const rows = [
    row(1, ["##comment", "物品ID", "使用类型", "治疗生命", "施加灼烧", "获得护盾", "初始法囊格", "启用"], 1, 3),
    row(2, ["##var", "item_id", "use_type", "heal_value", "burn_stacks", "block_value", "initial_slot", "enabled"], 1, 3),
    row(3, ["##type", "int32", "string", "int32", "int32", "int32", "int32", "int32"], 1, 3),
    row(4, ["##group", "c,s", "c,s", "c,s", "c,s", "c,s", "c,s", "c,s"], 1, 3),
    row(5, ["##"], 1, 1),
    row(6, ["", 2142, "fire_stone", 0, 2, 0, 1, 1]),
    row(7, ["", 2152, "earth_stone", 0, 0, 4, 2, 1]),
    row(8, ["", 2601, "heal", 12, 0, 0, 3, 1])
  ];
  const xml = `<?xml version="1.0" encoding="utf-8"?><x:worksheet xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><x:sheetViews><x:sheetView workbookViewId="0"><x:pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen" /></x:sheetView></x:sheetViews><x:sheetFormatPr defaultRowHeight="15" /><x:cols><x:col min="1" max="8" width="19" hidden="0" customWidth="1" /></x:cols><x:sheetData>${rows.join("")}</x:sheetData><x:pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" /></x:worksheet>`;
  zip.file(sheetName, xml);
  fs.writeFileSync(filePath, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  console.log("restored C-战斗物资配置表.xlsx");
}

async function repairWWorkbook() {
  const filePath = path.join(datas, "W-物品配置表.xlsx");
  const zip = await JSZip.loadAsync(fs.readFileSync(filePath));
  const sheetName = "xl/worksheets/sheet1.xml";
  let xml = await zip.file(sheetName).async("string");
  xml = xml.replace(/<x:row r="(?:17|18|19|20)"[\s\S]*?<\/x:row>/g, "");
  xml = xml.replace(/<row r="(?:17|18|19|20)"[\s\S]*?<\/row>/g, "");
  const rows = [
    row(17, ["", 2602, "凝神露", "战斗中恢复18灵力，满灵力不可用。", 2, 204, 1, "", 1, 1, 1], 1, 9, ""),
    row(18, ["", 2603, "耐久修补片", "局内修补武器8点耐久。", 2, 204, 1, "", 1, 1, 1], 1, 9, ""),
    row(19, ["", 3001, "下品灵石", "基础交易货币。", 1, 200, 1, "", 1, 1, 1], 1, 9, ""),
    row(20, ["", 3002, "愿力结晶", "维修和商店使用的愿力货币。", 1, 201, 1, "", 1, 1, 1], 1, 9, "")
  ];
  xml = xml.replace("</sheetData>", `${rows.join("")}</sheetData>`);
  if (xml !== (await zip.file(sheetName).async("string"))) {
    zip.file(sheetName, xml);
    fs.writeFileSync(filePath, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
    console.log("repaired W-物品配置表.xlsx namespace");
  }
}

async function main() {
  await patchWorkbook("S-技能战斗配置表.xlsx", 2, [
    { id: 101, xml: row(10, ["", 101, "飞岩术", "", 4, 13, 0, 0, 0, 0, 1]) },
    { id: 102, xml: row(11, ["", 102, "岩甲诀", "", 6, 0, 18, 0, 0, 0, 1]) },
    { id: 103, xml: row(12, ["", 103, "撼岳击", "", 9, 12, 0, 0, 0, 0, 1]) },
    { id: 104, xml: row(13, ["", 104, "陷地术", "", 7, 7, 0, 0, 0, 0, 1]) },
    { id: 105, xml: row(14, ["", 105, "返震印", "", 10, 0, 15, 0, 0, 0, 1]) }
  ]);

  await restoreCWorkbook();

  await repairWWorkbook();
  await repairWWorkbook();
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});

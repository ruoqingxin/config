import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath = "E:/NowChange/config/Datas/物品配置表.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const summary = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 12000,
  tableMaxRows: 18,
  tableMaxCols: 18,
  tableMaxCellChars: 160,
});
console.log(summary.ndjson);

const sheetNames = workbook.worksheets.items.map((sheet) => sheet.name);
console.log("SHEETS", JSON.stringify(sheetNames));

const sheet = workbook.worksheets.getItemAt(0);
const preview = await workbook.render({
  sheetName: sheet.name,
  range: "A1:O18",
  scale: 1,
  format: "png",
});
await fs.writeFile(
  "E:/NowChange/config/document/item-config-before.png",
  new Uint8Array(await preview.arrayBuffer()),
);

sheet.getRange("K11:K16").values = [
  ["ui/atlas/module/equipment/icon_115.png"],
  ["ui/atlas/module/equipment/icon_116.png"],
  ["ui/atlas/module/equipment/icon_117.png"],
  ["ui/atlas/module/equipment/icon_118.png"],
  ["ui/atlas/module/equipment/icon_119.png"],
  ["ui/atlas/module/equipment/icon_120.png"],
];

const changed = await workbook.inspect({
  kind: "table",
  sheetId: sheet.name,
  range: "B11:K16",
  include: "values,formulas",
  tableMaxRows: 8,
  tableMaxCols: 12,
  maxChars: 6000,
});
console.log("CHANGED", changed.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log("ERRORS", errors.ndjson);

const after = await workbook.render({
  sheetName: sheet.name,
  range: "A1:O18",
  scale: 1,
  format: "png",
});
await fs.writeFile(
  "E:/NowChange/config/document/item-config-after.png",
  new Uint8Array(await after.arrayBuffer()),
);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(workbookPath);
console.log(`SAVED ${workbookPath}`);

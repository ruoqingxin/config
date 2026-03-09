const fs = require('fs');
const path = require('path');
var SnappyJS = require('snappyjs')
// 源数据目录
const dataDir = path.join(__dirname, 'output_client', 'data');
// 输出文件
const outputFile = path.join(__dirname, 'configbin.bin');

// 确保输出目录存在
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 获取所有.bin文件
const files = fs.readdirSync(dataDir)
    .filter(file => file.endsWith('.bin'))
    .sort(); // 按文件名排序，确保打包顺序一致


// 写入文件数量
const fileCount = Buffer.alloc(4);
fileCount.writeUInt32LE(files.length, 0);
let allBuffers = [fileCount];
// 写入每个文件
files.forEach(file => {
    const filePath = path.join(dataDir, file);
    const fileData = fs.readFileSync(filePath);
    // 写入文件名长度
    file = file.replace('.bin', '');
    const nameBuffer = Buffer.from(file, 'utf8');
    const nameLength = Buffer.alloc(4);
    nameLength.writeUInt32LE(nameBuffer.length, 0);
    allBuffers.push(nameLength);
    
    // 写入文件名
    allBuffers.push(nameBuffer);
    
    // 写入文件内容长度
    const contentLength = Buffer.alloc(4);
    contentLength.writeUInt32LE(fileData.length, 0);
    allBuffers.push(contentLength);
    
    // 写入文件内容
    allBuffers.push(fileData);
});

const finalBuffer = Buffer.concat(allBuffers);
console.log("finalBuffer.length",finalBuffer.length);
var usecompressed = false;
if(usecompressed){
    var compressed = SnappyJS.compress(finalBuffer);
    console.log("compressed.length",compressed.length);
    //写入压缩标识
    const compressFlag = Buffer.alloc(4);
    compressFlag.writeUInt32LE(6666, 0);
    let allBuffers2 = [];
    allBuffers2.push(compressFlag);
    allBuffers2.push(compressed);
    let finalBuffer2 = Buffer.concat(allBuffers2);
    console.log("finalBuffer2.length",finalBuffer2.length);
    fs.writeFileSync(outputFile, finalBuffer2);
}else{
    fs.writeFileSync(outputFile, finalBuffer);
}


console.log('打包完成！');
console.log(`总共打包了 ${files.length} 个文件`);
console.log(`输出文件: ${outputFile}`);

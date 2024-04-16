import "@3r/tool"


import { writeFileSync, readdirSync, statSync, readFileSync } from "fs";
import JSZIP from "jszip";
const zip = new JSZIP();

// 读取文件加入包中
function readFileJoinZip(zip, nowPath) {
    let files = readdirSync(nowPath);
    files.forEach(function (fileName, index) {
        let fillPath = nowPath + "/" + fileName;
        let file = statSync(fillPath);
        if (file.isDirectory()) {
            let zipdir = zip.folder(fileName);
            readFileJoinZip(zipdir, fillPath);
        } else {
            zip.file(fileName, readFileSync(fillPath));
        }
    });
}

// 构建压缩包
function buildZip(saveFileName, targetDir = "./dict") {
    // 执行方法
    readFileJoinZip(zip, targetDir);
    zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    }).then(function (content) {
        writeFileSync("./" + saveFileName, content, "utf-8");
    });
}


// 获取Git版本号
import { exec } from 'child_process';

function getGitCommitHash(callback) {
    exec('git rev-parse HEAD', (error, stdout, stderr) => {
        callback(stdout.trim());
    });
}

getGitCommitHash(gitCommitHash => {
    console.log(`当前Git版本号: ${gitCommitHash}`);
    let saveFileName = `TEST_${new Date().timeFormat('yyyyMMddhhmm')}_${String(gitCommitHash).substring(0, 8)}.zip`
    buildZip(saveFileName)
});



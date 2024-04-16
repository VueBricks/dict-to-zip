import "@3r/tool"
const saveFileName = `TEST_${new Date().timeFormat('yyyyMMddhhmm')}.zip`

import { writeFileSync, readdirSync, statSync, readFileSync } from "fs";
import JSZIP from "jszip";
const zip = new JSZIP();
const targetDir = "./dict";

// 读取文件加入Zip包中
function readdirJoinZip(zip, nowPath) {
    let files = readdirSync(nowPath);
    files.forEach(function (fileName, index) {
        let fillPath = nowPath + "/" + fileName;
        let file = statSync(fillPath);
        if (file.isDirectory()) {
            let zipdir = zip.folder(fileName);
            readdirJoinZip(zipdir, fillPath);
        } else {
            zip.file(fileName, readFileSync(fillPath));
        }
    });
}

// 执行方法
readdirJoinZip(zip, targetDir);

zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: {
        level: 9
    }
}).then(function (content) {
    writeFileSync("./" + saveFileName, content, "utf-8");
});


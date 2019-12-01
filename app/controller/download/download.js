const Controller = require('egg').Controller;
const fs = require('fs');
const send = require('koa-send');
const archiver = require('archiver');
class DownloadController extends Controller {
    async index() {
        
        const file = this.ctx.request.query.file;
        const decodeFile = decodeURI(file);
        // 生成压缩文件
        const zipName = `${decodeFile}.zip`;
        const zipStream = fs.createWriteStream(zipName);
        const zip = archiver('zip');
        zip.pipe(zipStream);
        const readDir = fs.readdirSync(`public/${file}`);
        for(let i = 0;i < readDir.length; i++ ){
            // const filePath = `public/${file}/${readDir[i]}`;
            // this.ctx.attachment(filePath);;
            // this.ctx.set('Content-Type', 'application/octet-stream');
            // this.ctx.body = fs.createReadStream(filePath);
            zip.append(readDir[i],{name: readDir[i]});
        }
        await zip.finalize();
        this.ctx.attachment(zipName);
        await send(this.ctx,zipName);
    }
}
module.exports = DownloadController;
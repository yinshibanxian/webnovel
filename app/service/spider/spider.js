const Service = require('egg').Service;
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

class SpiderService extends Service {
    async spider() {
        const {ctx} = this;
        // 数据库中书籍的数量
        const novelsLength = await ctx.model.Novellist.countDocuments({});
        // 数据库中的书籍
        const novels = await ctx.model.Novellist.find({}).limit(5).skip(1);
        for(let j = 0;j < 5;j ++) {
            const novelToSpider = novels[j];
            const { link,novelName } = novelToSpider;
            // 先爬取（更新）
            await ctx.service.spider.bookContent.getBookChapters(link);
            // 再从数据库当中读取
            const bookInfo = await ctx.model.Novelinfo.findOne({novelName});
            const chapterLength = bookInfo.chapters.length;
            if( bookInfo ) {
                const { chapters } = bookInfo;
                const readDir = fs.readdirSync(`public/novels`);
                if(!readDir.includes(novelName)) {
                    fs.mkdirSync(`public/novels/${novelName}`);
                }
            for(let i = 0;i < chapterLength; i ++) {
                const chapter = chapters[i];
                const href = chapter.href;
                const chapterName = chapter.chapter;
                console.log(chapterName);
                await ctx.service.spider.bookContent.saveChapterContent(novelName,href,chapterName);
            }
            } 
        } 
    }
}

module.exports = SpiderService;
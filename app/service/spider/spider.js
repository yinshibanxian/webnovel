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
        const novels = await ctx.model.Novellist.find({});
        
        const novelToSpider = novels[0];
        const { link,novelName } = novelToSpider;
        // 先爬取（更新）
        //await ctx.service.spider.bookContent.getBookChapters(link);
        // 再从数据库当中读取
        const bookInfo = await ctx.model.Novelinfo.findOne({novelName});
        console.log(bookInfo.chapters[1]);
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
        // 数据库当中存在
        // if( bookInfo ) {
        //     // 小说章节
        //     const { chapters } = bookInfo;
        //     // 小说目录不存在则创建小说目录
        //     const readDir = fs.readdirSync(`public/novels`);
        //     if(!readDir.includes(novelName)) {
        //         fs.mkdirSync(`public/novels/${novelName}`);
        //     }
        //     // 爬取每章内容并保存
        //     chapters.forEach(async(chapter) => {
        //         const href = chapter.href;
        //         const chapterName = chapter.chapter; 
        //         await ctx.service.spider.bookContent.saveChapterContent(novelName,href,chapterName);
        //     })
            
        // }
        
        
    }
}

module.exports = SpiderService;
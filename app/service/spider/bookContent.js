const Service = require('egg').Service;
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

class BookContentService extends Service {
    // 爬取单本小说信息(书名、作者、简介、全部章节),并且保存到数据库当中
    async getBookChapters(link) {
        const res = await axios.get(link)
        const html = res.data;
        const $ = cheerio.load(html);
        
        // 小说名
        const novelName = $('#info>h1')[0].children[0].data;
        // 小说类型
        const type = $('div.con_top a')[2].children[0].data;
        // 小说简介
        const intro = $('#intro p')[1].children[0].data;
        // 小说作者
        const authorUnfix = $('#info p')[0].children[0].data;
        const author = authorUnfix.split('：')[1];
        const chapters = $('div#list dd a');
        
        const chaptersToSave = [];
        const chapterToArray = Array.from(chapters);
        const preNovelInfo = await this.ctx.model.Novelinfo.find({novelName});
        chapterToArray.forEach((chapter) => {
            // 章节链接
            const href = chapter.attribs.href;
            // 章节名
            const chapterName = chapter.children[0].data;
            chaptersToSave.push({href,chapter: chapterName});
            
        })
        // 这本小说在数据库当中没有记录
        if ( preNovelInfo.length === 0 || preNovelInfo[0].chapters.length === 0) {
            const NovelinfoModel = new this.ctx.model.Novelinfo({
                novelName,
                author,
                intro,
                type,
                chapters: chaptersToSave
            });
            return await NovelinfoModel.save();
        }else {// 已经存在这边小说的记录
            // 小说章节有更新
            if(chapterToArray.length > preNovelInfo[0].chapters.length) {
                return await this.ctx.model.Novelinfo.findOneAndUpdate({novelName},{$set: {chapters: chaptersToSave}})
            } else {//小说章节没有更新
                return ;
            }

        }
       
    }
    
    // 保存书籍内容到文件
    async saveChapterContent(novelName,href,chapter) {
         const chapterContent = await this.ctx.service.spider.chapterContent.getChapterContent(href);
         // 过滤空格
         const chapterName = chapter.replace(/ /g,'',);
         try {
            fs.openSync(`public/novels/${novelName}/${chapterName}.txt`,'w');
            fs.writeFileSync(`public/novels/${novelName}/${chapterName}.txt`,chapterContent);
         }catch(err) {
             return console.error(err);
         }
        
    }

}

module.exports = BookContentService;
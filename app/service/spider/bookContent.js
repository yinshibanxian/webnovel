const Service = require('egg').Service;
const cheerio = require('cheerio');
const axios = require('axios');

class BookContentService extends Service {
    async getBookChapters() {
        const res = await axios.get('http://xbiquge.la/15/15409/')
        const html = res.data;
        const $ = cheerio.load(html);
        // 小说类型
        const type = $('div.con_top a')[2].children[0].data;
        // 小说简介
        const intro = $('#intro p')[1].children[0].data;
        // 小说作者
        const authorUnfix = $('#info p')[0].children[0].data;
        const author = authorUnfix.split('：')[1];
        console.log(author);
        const chapters = $('div#list dd a');
        const chaptersToSave = [];
        const chapterToArray = Array.from(chapters);
        chapterToArray.forEach((chapter) => {
            // 章节链接
            const href = chapter.attribs.href;
            // 章节名
            const chapterName = chapter.children[0].data;

            chaptersToSave.push({href,chapter: chapterName});
            //console.log(chapterName);
            
        })
       
    }
}

module.exports = BookContentService;
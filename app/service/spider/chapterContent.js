const Service = require('egg').Service;
const axios = require('axios');
const cheerio = require('cheerio');

class ChapterContentService extends Service {
    // 爬取单章内容
    async getChapterContent(href) {
        const {ctx} = this;
        const res = await axios.get(`http://www.xbiquge.la${href}`);
        const html = res.data;
        const $ = cheerio.load(html);
        // 章节名
        const chapterName = $('div.bookname h1')[0].children[0].data;
        // 章节内容
        let chapterContent = $('#content').text();
        // 去除笔趣阁的广告语
        chapterContent = chapterContent.indexOf('亲,点击进去,给个好评呗,分数越高更新越快') > 0? chapterContent.split('亲,点击进去,给个好评呗,分数越高更新越快')[0] : chapterContent;
        return chapterContent;
    }
}


module.exports = ChapterContentService;
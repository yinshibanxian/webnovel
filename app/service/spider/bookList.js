const Service = require('egg').Service;
const axios = require('axios');
const cheerio = require('cheerio');
class BookListService extends Service {
    async getBookList() {
        // 获取全部小说页面结构
        const res = await axios.get('http://www.xbiquge.la/xiaoshuodaquan/');
        const html = res.data;
        const $ = cheerio.load(html);
        const novelList = $('div#main div.novellist ul>li');
        const novelListArray = Array.from(novelList);
        const novelListModel = this.ctx.model.Novellist;
        novelListArray.forEach(async (novel) => {
            // 书籍链接
            const link = novel.children[0].attribs.href;
            // 书籍名称
            const novelName = novel.children[0].children[0].data;
            const foundResult = await novelListModel.find({novelName});
            //如果小说列表中没有对应的小说，再增加
            if(foundResult.length === 0) {
                const novelItem = new novelListModel({link,novelName}); 
                await novelItem.save();
            }
        })
    }
}

module.exports = BookListService;
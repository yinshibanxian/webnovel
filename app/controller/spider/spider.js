const Controller = require('egg').Controller;
const cheerio = require('cheerio');

class SpiderController extends Controller {
    async index() {
        const {ctx} = this;
        // 获取全部小说页面结构
        const res = await ctx.service.spider.bookList.getBookList();
        const html = res.data;
        const $ = cheerio.load(html);
        const novelList = $('div#main div.novellist ul>li');
        const novelListArray = Array.from(novelList);
        const novelListToSave = [];
        const novelListModel = this.ctx.model.Novellist;
        novelListArray.forEach(async (novel) => {
            // 书籍链接
            const link = novel.children[0].attribs.href;
            // 书籍名称
            const novelName = novel.children[0].children[0].data;
            const novelItem = new novelListModel({link,novelName});
            novelListToSave.push(novelItem);
        })
        const result = await novelListModel.insertMany(novelListToSave);
        console.log(result);
        

        
        
    }
}


module.exports = SpiderController;
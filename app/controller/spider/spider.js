const Controller = require('egg').Controller;

class SpiderController extends Controller {
    async getBookList() {
        return await this.ctx.service.spider.bookList.getBookList();
    }
    async getBookChapters() {
        return await this.ctx.service.spider.bookContent.getBookChapters();
    }
}


module.exports = SpiderController;
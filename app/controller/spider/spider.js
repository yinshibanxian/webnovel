const Controller = require('egg').Controller;

class SpiderController extends Controller {
    async getBookList() {
        return await this.ctx.service.spider.bookList.getBookList();
    }
    async getBookChapters() {
        return await this.ctx.service.spider.bookContent.getBookChapters();
    }
    async getChapterContent() {
        return await this.ctx.service.spider.bookContent.getChapterContent();
    }
}


module.exports = SpiderController;
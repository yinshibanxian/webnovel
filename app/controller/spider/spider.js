const Controller = require('egg').Controller;

class SpiderController extends Controller {
    async index() {
        await this.ctx.service.spider.bookList.getBookList();
    }
}


module.exports = SpiderController;
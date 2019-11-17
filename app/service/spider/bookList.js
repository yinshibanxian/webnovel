const Service = require('egg').Service;
const axios = require('axios');

class BookListService extends Service {
    async getBookList() {
        return await axios.get('http://www.xbiquge.la/xiaoshuodaquan/');
    }
}

module.exports = BookListService;
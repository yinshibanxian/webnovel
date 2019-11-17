const axios = require('axios');
const cheerio = require('cheerio');
module.exports = {
    schedule: {
      interval: '1min', // 1 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
      //const res = await axios.get('http://www.xbiquge.la/xiaoshuodaquan/');
      //console.log(res);
    },
  };
'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.index.index.ssr);
  router.get('/getbooklist',controller.spider.spider.getBookList); //爬取小说列表
  router.get('/getbookchapter',controller.spider.spider.getBookChapters)
};
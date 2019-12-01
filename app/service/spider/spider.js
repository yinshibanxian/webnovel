const Service = require('egg').Service;
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

class SpiderService extends Service {
    async spider() {
        const {ctx} = this;
        // 数据库中书籍的数量
        const novelsLength = await ctx.model.Novellist.countDocuments({});
        // 数据库中的书籍
        const novels = await ctx.model.Novellist.find({}).limit(5).skip(1);
        for(let j = 0;j < 5;j ++) {
            const novelToSpider = novels[j];
            const { link,novelName } = novelToSpider;
            // 先爬取（更新）
            await ctx.service.spider.bookContent.getBookChapters(link);
            // 再从数据库当中读取
            const bookInfo = await ctx.model.Novelinfo.findOne({novelName});
            const chapterLength = bookInfo.chapters.length;
            if( bookInfo ) {
                const { chapters } = bookInfo;
                const readDir = fs.readdirSync(`public/novels`);
                if(!readDir.includes(novelName)) {
                    fs.mkdirSync(`public/novels/${novelName}`);
                }
            for(let i = 0;i < chapterLength; i ++) {
                const chapter = chapters[i];
                const href = chapter.href;
                const chapterName = chapter.chapter;
                console.log(chapterName);
                await ctx.service.spider.bookContent.saveChapterContent(novelName,href,chapterName);
            }
            } 
        } 
    }
    //获得一篇游记的文字
    async tripContent(url) {
        const {ctx} = this;
        const res = await axios.get('https://you.ctrip.com'+url);
        const html = res.data;
        const $ = cheerio.load(html);
        // 获得一篇游记的文字
        const text = $('div.ctd_content>p').text();
        return text;
 
     }
     // 获得一页游记列表
     async singleTrip(pageNo) {
         const {ctx} = this;
         const attraction = ctx.query.attraction;
         // 对汉字景点进行URL编码
         const url = encodeURI(attraction);
         const res = await axios.get(`https://you.ctrip.com/searchsite/travels/?query=${url}&isAnswered=&isRecommended=&publishDate=&PageNo=${pageNo}`);
         const html = res.data;
         const $ = cheerio.load(html);
         const tripList = $('li.cf>dl>dt>a');
         const tripListArray = Array.from(tripList);
         // 如果爬取到的游记列表为空
         if(!tripListArray) {
             return ;
         }
         tripListArray.forEach(async (item) => {
             const { href } = item.attribs;
             const title =  item.children[0].data;
             const titleFixed = title.replace(/ |\\|\/|\*|\<|\>|\\|\？|\、\——/g,'',);
             const file = attraction.replace(/ |\\|\/|\*|\<|\>|\\|\？|\、\——/g,'',);
             const tripContent = await this.tripContent(href);
             try {
                 fs.openSync(`public/${file}/${titleFixed}.txt`,'w');
                 fs.writeFileSync(`public/${file}/${titleFixed}.txt`,tripContent);
             }catch(err) {
                 console.log(err);
             }
             
         })
         return tripListArray;
     }
     async trip() {
         const {ctx} = this;
         const pageNum = Number(ctx.request.query.pageNum);
         const attraction = ctx.request.query.attraction;
         const file = attraction.replace(/ |\\|\/|\*|\<|\>|\\|\？|\、|\——/g,'',);
         const readDir = fs.readdirSync(`public`);
         //这里先删除
         if(!readDir.includes(file)) {
             fs.mkdirSync(`public/${file}`);
         }
        
         for(let i = 1;i <= pageNum; i++) {
             await this.singleTrip(i);
         }
         return true;
         // const filePath = 'public/hello.txt';
         // this.ctx.attachment(filePath);;
         // this.ctx.set('Content-Type', 'application/octet-stream');
         // this.ctx.body = fs.createReadStream(filePath);
         
     }
}

module.exports = SpiderService;
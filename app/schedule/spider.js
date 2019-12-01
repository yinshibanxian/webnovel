const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
module.exports = {
    schedule: {
      interval: '10s', // 30 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
      // const readDir = fs.readdirSync('public');
      // console.log(readDir);
      // for(let i  = 0;i < readDir.length; i++ ){
      //   const dirToDelete = readDir[i];
      //   if(dirToDelete !== 'js' && dirToDelete!=='css' && dirToDelete!=='font' && dirToDelete!== 'img') {
      //       fs.rmdirSync(dirToDelete);
      //     }
      //   }
      }
  };
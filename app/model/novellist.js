'use strict';


module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const NovelListSchema = new Schema({
        novelName: { type: String},
        link: { type: String}
    })
    return mongoose.model('NovelList',NovelListSchema,'novellist');
}
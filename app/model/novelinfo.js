module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const NovelInfoSchema = new Schema({
        novelName: String,
        author: String,
        intro: String,
        type: String,
        chapters: Array
    })
    return mongoose.model('NovelInfo',NovelInfoSchema,'novelinfo');
}
const mongoose = require("mongoose");
const blacklistSchema = new mongoose.Schema(
    {
        token:     { type: String                                               },
        createdAt: { type: Date, expires: '24h', index:true, default: new Date()}
}
)

const blacklist = mongoose.model('blacklist', blacklistSchema);
module.exports = blacklist;
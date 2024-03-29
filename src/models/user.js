const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
    {

        name:                 { type: String,required: true                               },
        email:                { type: String,unique: true,required: true,lowercase: true  },
        password:             { type: String,required: true,select: false                 },
        createdAt:            { type: Date,default: Date.now                              },
        adm:                  { type: Boolean,required: true                              },
        passwordResetToken:   { type: String, select: false                               },
        passwordResetExpires: { type: String, select: false                               },


}
)



const User = mongoose.model('User', UserSchema);
module.exports = User;
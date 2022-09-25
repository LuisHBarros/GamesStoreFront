const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
    {
        name:                { type: String, required: true         },
        discount:            { type: Number                         },      
        price:               { type: Number, required: true         },
        developer:           { type: String, required: true         },
        tax:                 { type: Number, required: true         },
        dep:                 { type: String, required: true         },
        image1:              { type: String, required: true         },
        image2:              { type: String, required: true         },
        image3:              { type: String, required: true         },
        video:              { type: String, required: true         },
        description:         { type: String, required: true         },
        description2:        { type: String                         },
        title_description:   { type: String, required: true         },
        image_description:   { type: String, required: true         },
        platform:            { type: String, required: true         },
        stock:               { type: Number, required: true         },
})

const product = mongoose.model('Product', ProductSchema);
module.exports = product;
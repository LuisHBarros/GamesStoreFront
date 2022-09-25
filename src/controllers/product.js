const e = require('express');
const Product = require('../models/product');
const User = require('../models/user')

function admVerify(user){
    return user.adm === true;
}


module.exports = class productController {

    static listProducts = (req, res) => {

                Product.find((e,product) => 
                {
                    if(e) 
                        return res.status(500).json({ error: e.message })
                    return res.status(200).json(product)

                })

  
    }

    static listProductsById = (req, res) => {
        try {
            const id = req.params.id;
            Product.findById(id, (e, product) => {
                if(e) 
                    return res.status(404).json({  message: "Not found" })
                return res.status(200).json(product)
            })
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    static listProductsByDep = (req, res) => {
        try {
            const dep = req.params.dep;
            Product.find(dep, (err, product) => {
                if (err)
                    return res.status(404).json({ error: "Not found" });
                return res.status(200).json(product)
            })
            
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    //ADM confirmation needed
    static registerProduct = (req, res) => {
        const admId = req.query.admId;

        let product = new Product(req.body);
        product.save((err) => {

            if(err){
                res.status(500).send({ message: `${err.message} - error on registering product` });
            }
            else{
                res.status(201).send(product.toJSON());
            }
        })
    }

    //ADM confirmation needed
    static refreshProduct = (req, res) =>{
        const id = req.params.id;

        Product.findByIdAndUpdate(id, {$set: req.body}, (err) => {
            if(err){
                res.status(500).send({ message: err.message })
            }
            else{
                res.status(201).send({ message: 'Product updated successfully' })
            }
        })
    }

    //ADM confirmation needed
    static deleteProduct = async (req, res) => {
        const id = req.params.id;
        const identification = req.query.identification
        const adm = User.findById(identification, (e) => {
            if (e) return res.status(401).json({ error: e.message });
        });
        if(!adm)
            return res.status(401).json({ message: 'You are not registrated'})
        if (adm.adm === false)
            return res.status(401).json({message: 'You are not authorized'})
        const productDelete = await Product.findById(id);
        if(!productDelete)
            return res.status(404).json({ message: "Product not found" })
        Product.findByIdAndDelete(id, (err) => {
            if(err) {
                res.status(500).send({ message:err.message })
            }
            else{
                res.status(200).send( { message: "Product deleted successfully" } )
            }
        })
    }

}
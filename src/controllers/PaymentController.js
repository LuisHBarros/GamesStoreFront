require('dotenv').config()
const mercadopago = require("mercadopago")
const donePayment = require("../models/donePayment")
const Product = require("../models/product")


class PaymentController {

    static payment = async (req, res) => {
        mercadopago.configurations.setAccessToken(process.env.ACESS_TOKEN)
        const {product} = req.body
        const body = req.body
        const {user_id} = req.body

        let preference = () =>{

            //Funcao para ler o array de items, e passar para o mercadopago preferences
            const items = {}
            let itemArray = []
            for (let index = 0; index < product.length; index++) {
                items.unit_price = product[index].price
                items.title = product[index].title
                items.quantity = product[index].quantity
                itemArray.push({...items})
            }

            const response = {

                items: itemArray,
               back_urls: {
                   "success": "https://www.seu-site/success",
                   "failure": "http://www.seu-site/failure",
                   "pending": "http://www.seu-site/pending"
               },
               auto_return: "approved",
               binary_mode: true
            }
            return response
        }
        mercadopago.preferences.create(preference())
            .then(async (response) => {
                console.log(response)
                const payment = new donePayment({
                    user_id,
                    status: response.body.auto_return,
                    payment_id: response.body.id,
                    date: response.body.date_created,
                    payment_link:response.body.sandbox_init_point
                });
                payment.save()


                res.status(201).json({payment})
            }).catch((e) =>{
                console.log(e)
                return res.status(500).json({error:{preference} })
            })
    }
    static getPayments = async (req,res) => {
        //mudar nome para 
        const purchase = await donePayment.find({user_id: req.body.user_id})
        res.json({
            purchase
        })
    }
    static getOnePayment = async (req, res) => {
        const purchase = await donePayment.findById(req.body.id)
        return res.status(200).json({purchase})
    }

    static feedback = async(req, ses) => {
        res.json(
            {
                Payment: req.query.payment_id,
                Status: req.query.status,
                MerchantOrder: req.query.merchant_order_id
            }
        )
    }
}

  module.exports = PaymentController;
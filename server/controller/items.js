const Product = require('../models/product');
const mongoose = require('mongoose');


//create a new item
exports.createItem = (req, res) => {
    //validate the request, if body empty error 400 is returned
    if(!req.body){
        res.status(400).send({message: "Content cannot be empty!"});
        return;
    }

    //new item
    const product = new Product({
        title:req.body.title,
        price:req.body.price,
        description:req.body.description
    })

    //save the item in the MongoDB database
    product
        .save(product)
        .then(data => {
            // res.send(data)
            res.redirect('/admin/new-item')
        })
        .catch(err=>{
            res.status(500).send({
                message:err.message || "Errors occured"
            });
        });
}


//get all items or a single item
exports.findItem = (req, res) => {

    if(req.params.id){
        const id = req.params.id;
        Product.findById(id)
            .then(item=>{
                if(!item){
                    res.status(404).send({message:`Product with ${id} not found!`})
                }else{
                    // res.send(item)
                        res.render('item-details', { item });
                }
            })
            .catch(err=>{
                res.status(500).send({message:"Error retrieving product with id:" + id })
            })

    }else{
        Product.find()
            .then(items =>{
                res.send(items)
            })
            .catch(err=> {
                res.status(500).send({message:err.message || "Error occured while retrieving items"})
            })
    }
}

// render the edit-item page with item
exports.editItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          req.flash('error', 'Invalid id');
          res.redirect('/admin/menu');
          return;
        }
        const item = await Product.findById(id);
        res.render('edit-item', { item });
      } catch (error) {
        next(error);
      }
};

// update the information of a product
exports.updateItem = (req, res, next) => {
    Product.updateOne({ _id: req.body.id }, { $set: { title: req.body.title, price: req.body.price, description: req.body.description } })
        .then(result => {
            res.redirect('/admin/menu');
        })
        .catch(err => console.log(err));
}


//delete an item
exports.deleteItem = (req, res) => {
    // const id = req.params.id;
    const id = req.body.id;

    Product.findByIdAndDelete(id)
        .then(data =>{
            if(!data){
                res.status(404).send({message:`Cannot delete item with ${id}`})
            }else{
                // res.send({
                //     message:"item deleted"
                // })
                res.redirect('/admin/menu');
            }
        })
        .catch(err=> {
            res.status(500).send({message:"Could not delete item with id:" +id});
        });
}


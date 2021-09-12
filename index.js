require("dotenv").config({ path: "./config.env" });
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;


//CALLING ENGINE
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.MONGO_URL, ()=>{
    console.log("connected !!");
});


//CREATING SCHEMA
const itemsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please provide a todo"]
    } 
});


//COLLECTION NAME
const Item = mongoose.model("Item", itemsSchema);


// HOME ROUTER
app.get('/', (req, res) => {
    Item.find({}, (err, f) => {
        res.render('list', {newListItems : f});
    })
});


//ADD ROUTER
app.post('/', async(req, res, next) => {
    const itemName = req.body.n;
    if(itemName === ""){
        // alert("Enter any todo");  
         res.redirect("/")
        
    }

    try{
        const item  = await Item.create({
            name: itemName
        });

        res.redirect("/")
    }
    catch(e){
        console.log("cannot save your todo");
        next(e);
    };
});


//DELETE ROUTER
app.post('/delete', (req, res) => {
   const check = req.body.checkbox;
   console.log(check);
   Item.findByIdAndRemove(check, (err) => {
       if(!err){
           console.log("sucessfully deleted");
           res.redirect("/");
       }
   });

})


//Listen To PORT
app.listen(PORT, () => {
    console.log(`server is running to port ${PORT}`)
});
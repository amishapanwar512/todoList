//TO COONNECT MONGOOSE TO NODE.JS
const mongoose = require("mongoose");
const mongoURL = "mongodb+srv://Amisha-789:XGsIiE1RIDcZeBVP@cluster0.vo7vnfr.mongodb.net/todolistDB";
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("connected successfully");
})
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
const PORT =process.env.PORT | 5000;
const express = require("express");
const bodyParser = require("body-parser")
const app = express();
const _=require("lodash")
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

task1 = {
    name: "Buy Food"
}
task2 = {
    name: "Cook Food"
}
task3 = {
    name: "Eat food"
}

const defaultItems = [task1, task2, task3];
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]

});
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
    Item.find().then(function (foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems).then(function () {
                console.log("inserted successfully")
            })

        }
        else {
            res.render("list", { listTitle: "Today", newListItems: foundItems })
        }

    })
})


 app.post("/",function(req,res){
    var itemName=req.body.newItem;
   var listName= req.body.button;
   const task = new Item({
    name:itemName
   })
   if(listName==="Today")
   {
     task.save().then(function(){
        console.log("ss")
     })
     res.redirect("/")
   }
   else
   {
    List.updateOne({name:listName},{$push:{items:task}}).then(function(){
        console.log("successfully updated");
    res.redirect("/"+listName)
    })
    
   }
 })   


    app.get("/:customListName", function (req, res) {
        const customListName =_.capitalize(req.params.customListName) ;
        List.findOne({ name: customListName }).then(function (foundItems) {
            if (!foundItems) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save().then(function () {
                    console.log("ss in list")
                })
                res.redirect("/" + customListName)
            }
            else {
                res.render("list", { listTitle: foundItems.name, newListItems: foundItems.items })
            }

        }).catch(function (err) {
            //    const list=new List({
            //     name: customListName,
            //     items:defaultItems
            //    });
            //    list.save().then(function(){
            //     console.log("ss in list")
            //     })
            console.log(err)

        })
        
    });


    app.get("/about", function (req, res) {
        res.render("about")
    })

    // app.post("/", function (req, res) {
    //     let item = req.body.newlist;

    // });
    app.post("/delete", function (req, res) {
        const checkedItemId = req.body.checkbox;
        const listName=req.body.listName;
        if(listName === "Today"){
            Item.deleteOne({ _id: checkedItemId }).then(function () {
                console.log("successfully deleted")
            })
            res.redirect("/");
        }
        else{
            //to remove an item from array
            List.updateOne({name:listName},{$pull:{items:{_id:checkedItemId}}}).then(function(){
                console.log("uuuuu")
            })
            res.redirect("/"+listName)
        }
       
    });

    app.listen(PORT, function () {
        console.log("server started succesfully $(PORT)...");
    })

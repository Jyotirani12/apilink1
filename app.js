let express=require('express');
let app=express();
let port=process.env.port||9870;
let dotenv=require('dotenv');
dotenv.config();
let mongo=require('mongodb');
let MongoClient=mongo.MongoClient;
let mongoUrl="mongodb://localhost:27017";
//let mongoUrl="mongodb+srv://test:test123@cluster0.cxbxf.mongodb.net/?retryWrites=true&w=majority";
let db;
// app.get('/loc',(res,res))
app.get('/',(req,res)=>{
    res.send("hi from express3");
})
//app.listen(port)
// app.listen(port,()=>{
//     console.log(`listen on port ${port}`);
// })
// app.get('/category',(req,res)=>{
//     db.collection('category').find().toArray((err,result)=>{
//         if(err) throw err;
//         res.send(result);
//     })
   
// })
app.get('/category',(req,res) => {
    db.collection('category').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result);
    })
})
app.get('/subcategory',(req,res) => {
    db.collection('subcategory').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result);
    })
})
//to show all Product
app.get('/product',(req,res)=>{
    db.collection('product').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})
//To show Product Acc to category
app.get('/product/:id',(req,res)=>{
    let id=req.params.id;

    db.collection('product').find({category_id:Number(id)}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})
// app.get('/product',(req,res)=>{
//    let id=req.query.category_id;
// //let {category_id}=req.query;
//     db.collection('product').find({category_id:Number(id)}).toArray((err,result)=>{
//         if(err) throw err;
//         res.send(result);
//     })
// })


MongoClient.connect(mongoUrl,(err,client) =>{
    if(err) console.log(`Error While Connecting`);
    db = client.db('amazon');
       app.listen(port,() => {
        console.log(`listening on port ${port}`)

    })
})


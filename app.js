let express=require('express');
let app=express();


let dotenv=require('dotenv');
dotenv.config();
let port=process.env.port;
let morgan=require('morgan');
let bodyParser=require('body-parser');
let cors=require('cors');

let mongo=require('mongodb');
let MongoClient=mongo.MongoClient;
//let MongoUrl="mongodb://localhost:27017";
let MongoUrl="mongodb+srv://test:test123@cluster0.cxbxf.mongodb.net/?retryWrites=true&w=majority"
let db;
app.use(morgan('common'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
// app.get('/loc',(res,res))
app.get('/',(req,res)=>{
    res.send("hi from express3");
})

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
    db.collection('product').find({},{'product_name':1,'_id':0}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

app.get('/details/:id',(req,res)=>{
    let id = Number(req.params.id);
    db.collection('product').find({product_id:Number(id)},{product_name:1,_id:0}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})
//To show Product Acc to category
app.get('/product/:id',(req,res)=>{
    let id=req.params.id;
    db.collection('product').find({category_id:Number(id)},{product_name:0}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})
////To show Product Acc to Brands
app.get('/products',(req,res)=>{
    let query = {}
    let brandId = Number(req.query.brandId);
    if(brandId){
        query = {"Brand.brand_id":brandId}
    }else{
        query = {}
    }
    db.collection('product').find(query).toArray((err,result)=>{
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
// app.get('filter'/)

MongoClient.connect(MongoUrl,(err,client) =>{
    if(err) console.log(`Error While Connecting`);
    db = client.db('amazon');
       app.listen(port,() => {
        console.log(`listening on port ${port}`);

    })
})
// app.listen(port,() => {
//            console.log(`listening on port ${port}`)
    
//         })

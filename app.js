



let express=require('express');
let app=express();

let dotenv=require('dotenv');

dotenv.config();
let port=process.env.PORT||9870;
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

// app.get('/details/:id',(req,res)=>{
//     let id = Number(req.params.id);
//     db.collection('product').find({product_id:Number(id)},{product_name:1,_id:0}).toArray((err,result)=>{
//         if(err) throw err;
//         res.send(result);
//     })
// })
app.get('/deal',(req,res) => {
    db.collection('dealData').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result);
    })
})
app.get('/details/:categoryId',(req,res)=>{
    let query={};
    let categoryId=Number(req.params.categoryId);
    let productId = Number(req.query.productId);
    if(productId)
    {
        query={
            "category_id":categoryId,
            "product_id":productId
        }
    } else if(categoryId)
    {
        query={
            "category_id":categoryId
          
        }
    } else{
        query={}

    }

    db.collection('product').find(query).toArray((err,result)=>{
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
//List of product according to subcategory
app.get('/detailSubcategory/:categoryId',(req,res)=>{
    let query={};
    let categoryId=Number(req.params.categoryId);
    let subcategoryId = Number(req.query.subcategoryId);
    if(subcategoryId)
    {
        query={
            "category_id":categoryId,
            "subcategory_id":subcategoryId
        }
    } else if(categoryId)
    {
        query={
            "category_id":categoryId
          
        }
    } else{
        query={}

    }

    db.collection('product').find(query).toArray((err,result)=>{
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
//filter according to cost nd brand

   
    // db.collection('product').find({category_id:categoryId}).toArray((err,result) => {
    //             if(err) throw err;
    //             res.send(result)
    //         })
        



app.get(`/filter/:categoryId`,(req,res) => {
    let query = {}
    // let sort = {cost:1}
    let categoryId = Number(req.params.categoryId);
    let subcategoryId=Number(req.query.subcategoryId);
    let BrandId = Number(req.query.BrandId);
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);
    // if(req.query.sort){
    //     sort={cost:req.query.sort}
    // }
    if(subcategoryId && BrandId && lcost && hcost){
        query = {
            category_id:categoryId,
            subcategory_id:subcategoryId,
            "Brand.brand_id":BrandId,
            $and:[{Price:{$gt:lcost,$lt:hcost}}]
        }
    }
    else if(subcategoryId && BrandId){
        query = {
            category_id:categoryId,
            subcategory_id:subcategoryId,
            "Brand.brand_id":BrandId
        }
    }
    else if(subcategoryId && lcost && hcost ){
        query = {
            category_id:categoryId,
            subcategory_id:subcategoryId,
            $and:[{Price:{$gt:lcost,$lt:hcost}}]
       
        }
    }
    else if(BrandId){
        query = {
            category_id:categoryId,
            "Brand.brand_id":BrandId
          
        }
    }
    else if(subcategoryId){
        query = {
            category_id:categoryId,
            subcategory_id:subcategoryId
           
          
        }
    }
    
    else if(lcost && hcost){
        query = {
            category_id:categoryId,
            $and:[{Price:{$gt:lcost,$lt:hcost}}]
        }
    }
    else{
        query = {
            category_id:categoryId
        }
    }
    db.collection('product').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})
//Post API to place the order 
app.post('/placeOrder', (req, res) => {
    db.collection('orders').insert(req.body, (err, result) => {
        if (err) throw err;
        res.send('order placed')
    })
})
//To see menu Item
app.post('/menuItem',(req,res) => {
    if(Array.isArray(req.body.id)){
        db.collection('product').find({product_id:{$in:req.body.id}}).toArray((err,result) => {
            if(err) throw err;
            res.send(result)
        })
    }else{
        res.send('Invalid Input')
    }
})



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

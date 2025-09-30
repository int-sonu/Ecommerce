import express from 'express'
import {MongoClient} from 'mongodb'

const app=express()

const uri='mongodb://127.0.0.1:27017'
const client=new MongoClient(uri)

let db,usersCollection

async function connectDB() {
    try{
    await client.connect()
    db=client.db('ecommerce')
    usersCollection=db.collection('products')
    console.log('MongoDB connected')
    }
    catch(error){
        console.log(error)
    }
}
app.get('/findproducts',async(req,res)=>{

    const {name}=req.query
    const findproduct=await products.findOne({name}).toArray()
    res.json(findproduct)
})

app.listen(3000,()=>{
    console.log(`server running:http://localhost:3000`)
})
connectDB()
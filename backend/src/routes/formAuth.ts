import Router from "express";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from "@prisma/client";
import upload from "../config/multer";

const prisma = new  PrismaClient();
const router = Router();
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); 
var yyyy = today.getFullYear();
const todayDate = mm + '/' + dd + '/' + yyyy;


type FormAuth = {
    userId : string,
    firstName : string,
    lastName : string,
    email : string,
    phone : string,
    street : string,
    zip : string,
    country : string,
    city : string,
    state : string
}

const id = Math.floor(Math.random())*1000


router.post("/form",async  (req, res) => {
    const userId  = req.headers.authorization
    if (!userId) {
        return res.status(401).json({ error: 'No User provided' });
      }
    const { firstName , lastName, email, phone, street , zip , country , city  ,state} : FormAuth= req.body;
    console.log(req.body)
    try {
    const address = await prisma.address.upsert({
        //@ts-ignore
        where:{
            id : id 
        },
        update:{
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            street: street,
            zip: zip,
            country: country,
            city: city,
            state: state,
            date: todayDate
        },
        create:{
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            city,
            country,
            state,
            street,
            zip,
            date: todayDate,
            userId
        }
    })
    if(!address) throw new Error("Error Occured in Database");
    res.status(200).json({message : "Address Added Successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error : error})
    }
})

type DataPops = {
    value : string,
    label : string
}


router.post("/form-dropdown",async  (req, res) => {
  try {
    
    const data = req.body
    const userId = req.headers.authorization
    if(!userId) return res.status(401).json({ error: 'No User provided' });
    const save  = data.map( async (data : DataPops)=>{
      await prisma.interests.upsert({
        where:{
            id : data.label
        },
        update:{
            value:data.value
        },
        create:{
          value:data.value,
          date:todayDate, 
          userId: userId
        }
      })
    })  
    if(!save) throw new Error("Error Occured in Database");
    res.status(200).json({message : "Address Added Successfully"})
  } catch (error) {
    res.send(error)
  }
   
});

router.get("/form-bundle" , async (req,res)=>{
 try {
  const userId = req.headers.authorization
  const data = await prisma.user.findMany({
    where:{
      id: userId
    },include:{
      addresses:true,
      interests:true,
      files:true
    }
  })
  res.send(data)
 } catch (error) {
  return res.send(error)
 }
})

export { router as formRouter }
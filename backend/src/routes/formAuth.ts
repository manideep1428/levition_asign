//
import Router from "express";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from "@prisma/client";

const prisma = new  PrismaClient();
const router = Router();
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); 
var yyyy = today.getFullYear();
const todayDate = mm + '/' + dd + '/' + yyyy;
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  


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
    const data = req.body
    const save  = data.map((data : DataPops)=>{
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
          userId: "2"
        }
      })
    }
});

router.get("/form-bundle" , async (req,res)=>{
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
})


router.post('/upload', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = req.files as Express.Multer.File[];

    const uploadPromises: Promise<any>[] = files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    console.log(uploadedFiles)

    // const response = {
    //   message: 'Files uploaded successfully',
    //   files: savedFiles
    // };

    res.json("response");
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Error uploading files' });
  }
});


export { router as formRouter }
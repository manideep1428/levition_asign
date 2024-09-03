import express from 'express';
import { userRouter } from './routes/UserAuth';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { formRouter } from './routes/formAuth';

require('dotenv').config();

const app = express();
export const prisma  = new PrismaClient();
app.use(cors({
    credentials: true
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req ,res)=>{
    res.send("Hello World");
})

app.use("/api/v1", userRouter);
app.use("/api/v1", formRouter);


app.listen(8080, ()=>{
    console.log("Server is running on port 8080");
});

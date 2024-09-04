import express from 'express';
import { userRouter } from './routes/UserAuth';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { formRouter } from './routes/formAuth';
import { fileUploader } from './routes/fileUploader';

require('dotenv').config();

const app = express();
export const prisma  = new PrismaClient();
app.use(cors({
    credentials: true
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", userRouter);
app.use("/api/v1", formRouter);
app.use("/v1", fileUploader)


app.listen(8080, ()=>{
    console.log("Server is running on port 8080");
});

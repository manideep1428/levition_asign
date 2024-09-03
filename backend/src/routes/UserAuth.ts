import { Router } from "express";
import jwt from "jsonwebtoken";
const router = Router();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

router.post("/login", async (req , res ) => {
    const { name , password } = req.body;
    try {
        const user  = await prisma.user.findFirst({
            where: {
                name: name,
            }
        })
        if(!user) {
            res.status(401).send("User Not Found")
            console.log("User Not Found")
        }
        if(!user?.password == password) return res.status(401).send("Password Not Matched")
        const token = jwt.sign({name : user?.id} , "mysupersecret")
        return res.status(200).json({message: "User SuccessFully Login" , token : user?.id})
    } catch (error) {
        console.log(error)
    }
})

//Sigup route
router.post("/register",async (req, res) => {
    const { name , password , email } = req.body;
    console.log({name : name , password : password , email : email})
    try{
        const user = await prisma.user.create({
            data: {
                name: name,
                password: password,
                email: email
            }
        })
        if(!user) throw new Error("User Not Created")
        const token = jwt.sign({email: user?.id} , "mysupersecret") 
        res.status(200).json({message: "User SuccessFully Register" , token : user.id })
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})


export { router as userRouter }  

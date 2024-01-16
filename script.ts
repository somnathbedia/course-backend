import { PrismaClient } from '@prisma/client'
import express from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv';
dotenv.config();
const userRoutes = require('./controllers/user-controller')
const PORT = process.env.PORT ?? 8000

const app = express();

export const prisma = new PrismaClient()

async function main() {
    app.use(bodyParser.json())
    app.use(cors());

    app.use('/user',userRoutes)
    app.get('/', (req, res) => {
        res.json({ msg: "Hello from prisma" });
    })

    app.listen(8080, () => {
        console.log("Backend server is running at port 8080")
    })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
import { Router } from 'express'
import { prisma } from '../script';
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authenticate } from '../authmiddleware/authenticate';
import {z} from "zod"

const userInput = z.object({
    username: z.string().min(4).max(15),
    fullname: z.string().max(25),
    email: z.string().min(15).max(50),
    password: z.string().min(8).max(30)
})

const router = Router();


router.post("/signup", async (req, res) => {

    try {
        let { username, fullname, email, password } = userInput.parse(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        password = hashedPassword;
        const user = await prisma.user.create({
            data: { username, fullname, email, password }
        })
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY ?? '', { expiresIn: "2h" });
        if (user) {
            res.status(201).json({ msg: "user signup", token })
            return;
        } else {
            res.status(404).json({ msg: "Signup failed" });
        }
    } catch (e: any) {
        const msg = e.message;
        res.json({ msg });
        return;
    }
   
})

router.post("/login", authenticate, async (req, res) => {
    const existingUser =  prisma.user.findMany();
    const currentUser = (await existingUser).filter((users) => { users.username === req.body.username && users.password === req.body.password });
    if (currentUser) {
        res.status(201).json({ msg: "User logged in" });
    } else {
        res.json({ msg: "Invalid credential" });
    }
})

router.post("/courses/:courseId", authenticate,async (req:Request | any, res) => {
    const course = await prisma.course.findUnique({
        where: {
            id:req.params.courseId
        }
    })
    if (course) {
        await prisma.user.update({
            where: {
                id: req.userId.id
            },
            data: {
                purchasedCourse: {
                    connect: {
                        id:req.params.courseId
                    }
                }
            }
        })
        res.json({ msg: "Course purchased successfully!" });
        return;
    }
    else {
        res.status(403).json({ message: 'User not found' });
    }
    if(!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
    }
});

router.get("/purchasedcourses",authenticate, async (req:Request | any, res) => {
    const user = await prisma.user.findUnique({
        where: {
           id: req.userId.id
        },
        include:{purchasedCourse:true}
    })
    const userPurchased = user?.purchasedCourse
    if (user?.purchasedCourse) {
        res.json({ msg: "Your purchased", userPurchased });
    }
})

router.get("/courses", async (req, res) => {
    const courses = await prisma.course.findMany({
        where: {
            isPublished: true
        }
    })
    res.json({courses})
})

module.exports = router;

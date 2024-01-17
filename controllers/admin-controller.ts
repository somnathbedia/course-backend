import { Request, Response, Router } from 'express'
import { prisma } from '../script';
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authenticate } from '../authmiddleware/authenticate';



const router = Router();


router.post("/signup", async (req, res) => {
    let { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;
    const user = await prisma.admin.create({
        data: {
            username,
            email,
            password,
        }
    })
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY ?? '', { expiresIn: "2h" });
    if (user) {
        res.status(201).json({ msg: "Admin signup successfully!", token })
        return;
    } else {
        res.status(404).json({ msg: "Signup failed" });
    }
})

router.post("/login", authenticate, async (req, res) => {
    const existingUser = prisma.admin.findMany();
    const currentUser = (await existingUser).filter((users) => { users.username === req.body.username && users.password === req.body.password });
    if (currentUser) {
        res.status(201).json({ msg: "User logged in" });
    } else {
        res.json({ msg: "Invalid credential" });
    }
})

router.post("/createcourse", authenticate, async (req: Request | any, res: Response) => {
    const { title,
        description } = req.body;
    const course = await prisma.course.create({
        data: {
            title,
            description,
            isPublished: true,
            adminId: req.userId.id
        }
    })

    if (course) {
        res.json({ msg: "Course created", course });
        return;
    } else {
        res.status(403).json({ msg: "Failed creation" });
        return;
    }

})

router.put("/updatecourse/:courseId", authenticate, async (req, res) => {
    const updatedCourse = await prisma.course.update({
        where: {
            id: req.params.courseId
        },
        data: req.body
    })
    if (updatedCourse) {
        res.json({ message: 'Course updated successfully', updatedCourse });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
})

router.get("/courses", authenticate, async (req, res) => {
    const allCourses = await prisma.course.findMany();
    if (allCourses) {
        res.json({ allCourses });
    } else {
        res.json({ msg: "Not found" });
    }
})

router.delete("/course/:courseId", authenticate, async (req, res) => {
    const deleteCourse = await prisma.course.delete({
        where: {
            id: req.params.courseId,
        },
    })
    if (deleteCourse) {
        res.json({ msg: "Course delete successfully", deleteCourse })
        return;
    } else {
        res.json({ msg: "Course Not found" });
        return;
    }
})

module.exports = router;


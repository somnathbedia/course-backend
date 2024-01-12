import express from 'express'
import { Router } from 'express'
import { prisma } from '../script';
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from "../secret"

const router = Router();


router.post("/signup", async (req, res) => {
    let { username, fullname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;
    const user = await prisma.user.create({
        data: { username, fullname, email, password }
    })
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "2h" });
    if (user) {
        res.status(201).json({ msg: "user signup", token })
        return;
    } else {
        res.status(404).json({ msg: "Signup failed" });
    }
})

module.exports = router;

import { PrismaClient, User } from '@prisma/client'
import express from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv';
dotenv.config();
const userRoutes = require('./controllers/user-controller')
const adminRoutes = require('./controllers/admin-controller')
const testRoutes = require('./controllers/data-controller')
const PORT = process.env.PORT ?? 8000
import axios from "axios"

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { log } from 'console'


const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Admin {
    id: ID
    username: String
    email: String
    password: String
  }

  type User{
    id:ID
    username:String
    fullname:String
    email:String
    password:String
    purchasedCourse:[Course]
  }

  type Course{
    id:ID
    title:String
    description: String
    adminId:String
  }
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getAllAdmin: [Admin]
    getAllCourses: [Course]
    getAllUsers: [User]
    getUser(id:ID!): User
  }
`;

const resolvers = {
  Query: {
    getAllAdmin: async () => {
      const admins = await prisma.admin.findMany()
      return admins
    },
    getAllCourses: async () => {
      const courses = await prisma.course.findMany();
      return courses
    },
    getAllUsers: async () => {
      const users = await prisma.user.findMany();
      return users;
    },

    getUser: async (parent:any,args:any): Promise<User | null> => {
      // const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${args.id}`)
      // const data = response.data;
      // return data;
      const user = await prisma.user.findUnique({
        where: {
          id: args.id
        }
      })
      return user;
    }

  },
};

const app = express();

export const prisma = new PrismaClient()

async function main() {


  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  app.use(bodyParser.json())
  app.use(cors());
  await server.start();


  app.use('/graphql', expressMiddleware(server))
  app.use('/test', testRoutes);


  app.use('/user', userRoutes)
  app.use('/admin', adminRoutes)
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
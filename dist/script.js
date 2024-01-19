"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userRoutes = require('./controllers/user-controller');
const adminRoutes = require('./controllers/admin-controller');
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8000;
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Admin {
    id: ID
    username: String
    email: String
    password: String
    course: String
  }

  type User{
    id:ID
    username:String
    fullname:String
    email:String
    password:String
    course:Course
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
  }
`;
const resolvers = {
    Query: {
        getAllAdmin: () => __awaiter(void 0, void 0, void 0, function* () {
            const admins = yield exports.prisma.admin.findMany();
            return admins;
        }),
        getAllCourses: () => __awaiter(void 0, void 0, void 0, function* () {
            const courses = yield exports.prisma.course.findMany();
            return courses;
        })
    },
};
const app = (0, express_1.default)();
exports.prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new server_1.ApolloServer({
            typeDefs,
            resolvers,
        });
        app.use(body_parser_1.default.json());
        app.use((0, cors_1.default)());
        yield server.start();
        app.use('/graphql', (0, express4_1.expressMiddleware)(server));
        app.use('/user', userRoutes);
        app.use('/admin', adminRoutes);
        app.get('/', (req, res) => {
            res.json({ msg: "Hello from prisma" });
        });
        app.listen(8080, () => {
            console.log("Backend server is running at port 8080");
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield exports.prisma.$disconnect();
    process.exit(1);
}));

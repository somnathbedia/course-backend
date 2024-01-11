import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const admins = await prisma.admin.findMany({
        where: {
            isAdmin:true
        }
    
    })

    console.log(admins);
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
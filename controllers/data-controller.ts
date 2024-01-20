import { Router, query } from 'express'
import axios from "axios"


const router = Router();


router.get('/api/getalladmin', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8080/graphql', {
            query: `
                query{
                    getAllAdmin{
                        username
                        email
                    }
                }
          
            `,
        });

        const data = response.data.data; // Extract the data from the GraphQL response
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from GraphQL server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/api/getallcourses', async (req, res) => {
    try {
        const response = await axios.post("http://localhost:8080/graphql", {
            query:
                `
                    query{
                        getAllCourses{
                            title
                            description
                        }
                    }
                `,


        })

        const data = response.data.data; // Extract the data from the GraphQL response
        res.json(data);

    } catch (error) {
        console.error('Error fetching data from GraphQL server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/api/getallusers', async (req, res) => {
    try {
        const response = await axios.post("http://localhost:8080/graphql", {
            query:
                `
                    query{
                        getAllUsers{
                            fullname
                            email
                        }
                    }
                `

        })

        const data = response.data.data; // Extract the data from the GraphQL response
        res.json(data);

    } catch (error) {
        console.error('Error fetching data from GraphQL server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/api/user/:id', async (req, res) => {
    try {
        const response = await axios.post("http://localhost:8080/graphql", {
            query: `
                query($id: ID!){
                    getUser(id: $id){
                        username
                      
                        email
                    }
                }
            `,
            variables: {
                id: req.params.id
            }

        })

        const data = response.data.data; // Extract the data from the GraphQL response
        const userData = data.getUser; // Extract the user data

        res.json(userData);

    } catch (error) {
        console.error('Error fetching data from GraphQL server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;
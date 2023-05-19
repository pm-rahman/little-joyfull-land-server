const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.maiu4ju.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();

        const toyCollection = client.db('little-joyful-land').collection('toys');

        app.get('/toys', async (req, res) => {
            const result = await toyCollection.find().toArray();
            res.send(result);
        })
        app.get('/user-toys', async (req, res) => {
            const email = req.query.email;
            const query = { email: req.query.email }
            const result = await toyCollection.find(query).toArray();
            res.send(result);
        })
        app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query);
            res.send(result);
        })
        app.post('/toy', async (req, res) => {
            const toy = req.body;
            const result = await toyCollection.insertOne(toy);
            res.send(result);
        })
        app.patch('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatedToy = req.body
            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    price: updatedToy.price,
                    quantity: updatedToy.quantity,
                    description: updatedToy.updatedToy

                }
            }
            const result = await toyCollection.updateOne(query,updateDoc);
            console.log(result);
            res.send(result);
        })
        app.delete('/user-toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Little Joyful Land is under construction')
})
app.listen(port, () => {
    console.log(`Little Joyful Land made in road ${port}`)
})
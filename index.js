const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.maiu4ju.mongodb.net/?retryWrites=true&w=majority`;

// middleware
app.use(cors())
app.use(express.json())

// middleware
app.use(cors());
app.use(express.json());


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

        const db = client.db('little-joyful-land');
        const toyCollection = db.collection('toys');

        // 
        const indexKeys = { toyName: 1, };
        const indexOptions = { name: "toyName" };
        const result = await toyCollection.createIndex(indexKeys, indexOptions);



        // get method
        app.get('/allToys', async (req, res) => {
            const result = await toyCollection.find().toArray()
            res.send(result);
        })
        app.get('/toys', async (req, res) => {
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 0;
            const skip = limit * page;
            const result = await toyCollection.find().skip(skip).limit(limit).toArray();
            res.send(result);
        })
        app.get('/toy-category', async (req, res) => {
            // const category = req.query.category;
            const query = { subCategory: req.query.category };
            const limit = 10;
            const result = await toyCollection.find(query).limit(limit).toArray();
            res.send(result);
        })
        app.get('/highlightProduct', async (req, res) => {
            const limit = 6;
            const result = await toyCollection.find().limit(limit).toArray();
            res.send(result);
        })
        app.get('/user-toys', async (req, res) => {
            const query = { email: req.query.email }
            const shortingValue = parseInt(req.query.shortingValue)
            const result = await toyCollection.find(query).sort({ price: shortingValue }).toArray();
            res.send(result);
        })
        app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query);
            res.send(result);
        })
        app.get("/searchToy/:text", async (req, res) => {
            const text = req.params.text;
            const result = await toyCollection.find({
                toyName: { $regex: text }
            }).toArray();
            res.send(result);
        });


        // other method
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
            const result = await toyCollection.updateOne(query, updateDoc);
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

module.exports = app;
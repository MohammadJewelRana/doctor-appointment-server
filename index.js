const express = require("express");
const app = express();

//mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//dotenv
require("dotenv").config();

const cors = require("cors");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//---------------------DB Start--------------------------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.843endu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    //....................code start...................

    //all collection
    const usersCollection = client.db("DoctorAppointment").collection("users");
    const doctorCollection = client
      .db("DoctorAppointment")
      .collection("doctors");
    const messageCollection = client
      .db("DoctorAppointment")
      .collection("messages");

    //------------------------user relate api-----------
    //get all user
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    //create user
    app.post("/users", async (req, res) => {
      const user = req.body;
    //   console.log(user);

      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User already Exist" });
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });







    
    //----------------------------------manage user related api----------------------
    //update user information using patch
    app.put('/users/update/:id', async (req, res) => {
       const id=req.params.id;
       console.log(id);

       const newData=req.body;
       console.log(newData);


       const filter={_id: new ObjectId(id)};
    const options={upsert:true}

    const updatedData = {
        $set: {
          name: newData.name,
          password: newData.password,
          email:newData.email,        
          gender: newData.gender,
          contact: newData.contact,
          bio: newData.bio,
          blood: newData.blood,
          specialization:newData.specialization,
          price:newData.price

  
        },
      };

    const result=await  usersCollection.updateOne(filter,updatedData,options);
    res.send(result);
    })









    //------------------------doctor relate api-----------

    //add a doctor
    app.post("/doctors", async (req, res) => {
      const newDoctor = req.body;
      console.log(newDoctor);
      const result = await doctorCollection.insertOne(newDoctor);
      res.send(result);
    });

    //get all user
    app.get("/doctors", async (req, res) => {
      const result = await doctorCollection.find().toArray();
      res.send(result);
    });

    //------------------------contact relate api-----------

    app.post("/message", async (req, res) => {
      const newMessage = req.body;
      // console.log(newMessage);
      const result = await messageCollection.insertOne(newMessage);
      res.send(result);
    });

    app.get("/message", async (req, res) => {
      const result = await messageCollection.find().toArray();
      res.send(result);
    });



    // //create a user
    // app.post('/users', async (req, res) => {
    //     const user = req.body;
    //     const query = { email: user.email };
    //     const existingUser = await usersCollection.findOne(query);
    //     if (existingUser) {
    //         return res.send({ message: 'User already Exist' });
    //     }
    //     const result = await usersCollection.insertOne(user);
    //     res.send(result);
    // })

    //         //get all user
    //         app.get('/users', async (req, res) => {
    //             const result = await usersCollection.find().toArray();
    //             res.send(result);
    //         })

    //  //delete specific user cart product
    // app.delete('/carts/:id', async (req, res) => {
    //     const deletedId = req.params.id;
    //     const query = { _id: new ObjectId(deletedId) };
    //     const result = await cartsCollection.deleteOne(query);
    //     res.send(result);
    // })

    // //add a class
    // app.post('/classes',async(req,res)=>{
    //     const newClass=req.body;
    //     // console.log(newClass);
    //     const result = await classesCollection.insertOne(newClass);
    //     res.send(result);
    // })

    // //status update
    // app.put('/classes/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const newStatus=req.body;
    //     // console.log(newStatus,id);
    //     const filter={_id:new ObjectId(id)}//get specific data
    //     const options={upsert:true}//if data exist

    //     //set data
    //     const updatedData={
    //         $set:{
    //             status:newStatus.statusNew
    //         }
    //         }
    //         const result=await classesCollection.updateOne(filter,updatedData,options)
    //         res.send(result);

    // })

    //----------------------------------manage user related api----------------------
    //update user role using patch
    // app.patch('/users/admin/:id', async (req, res) => {
    //    const id=req.params.id;
    // //    console.log(id);
    //    const filter={_id: new ObjectId(id)};
    //    const updateUser={
    //     $set:{
    //         role:'admin'
    //     }
    //    }
    // const result=await  usersCollection.updateOne(filter,updateUser);
    // res.send(result);
    // })







    //...........end code ................

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//-------------------------------------------------------------

app.get("/", (req, res) => {
  res.send("Doctor appointment server is running");
});

app.listen(port, () => {
  console.log(`Running at port is ${port}`);
});

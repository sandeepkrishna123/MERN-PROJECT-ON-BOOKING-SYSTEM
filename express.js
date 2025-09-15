const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");

// Initialize express app
const app = express();

// MongoDB connection (replace <password> with the actual password)
const uri = "mongodb+srv://murarigist:<password>@cluster0.ek0ekyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const encodedPassword = encodeURIComponent("Murari@123");
const newUri = uri.replace("<password>", encodedPassword);

app.use(cors());
app.use(express.json());

// MongoDB client setup
const client = new MongoClient(newUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db('Busticket'); // Use 'Busticket' database
    console.log("Connected to MongoDB and using Busticket database");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Start the server and connect to MongoDB
app.listen(8003, async () => {
  await connectToMongoDB();
  console.log("Server is running on port 8003");
});

// Base route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the app" });
});
app.post("/signup", async (req, res) => {
    const { phone, email, pass, first_name, last_name } = req.body;
  
    try {
      // Connect to the correct database and collection
      const datab = client.db("Busticket");
      const collect = datab.collection("users");
  
      // Check if the user already exists
      const existingUser = await collect.findOne({ phone });
  
      if (existingUser) {
        return res.json({ status: 'error', message: 'User already exists' });
      } 
  
      // Insert new user data into the database
      const newUser = { phone, email, pass, first_name, last_name };
      await collect.insertOne(newUser);
  
      // Respond with success and user data
      res.json({ status: 'success', user_data: newUser });
  
    } catch (error) {
      // Error handling in case something goes wrong
      console.error("Error during signup:", error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });
  app.post("/login",async(req,res)=>{
const{phone,pass}=req.body;
const datab = client.db("Busticket");
const collect = datab.collection("users");
const user = await collect.findOne({ phone,pass });
if(user){
    console.log("success")
    res.json({status:'success',user_data:user})
}
  });
  app.post("/buses",async(req,res)=>{
    const database = client.db("Busticket");
        
    let buses = []; 

    const { start, end, date } = req.query; 

    
    if (!start || !end) {
      res.send({ status: "error", message: "Source and Destination required" });
    }

    
    let query = {
      source: start,
      destination: end,
    };

    
    if (date && date !== "null" && date !== "") {
      query.date = date; 
    }

  
    buses = await database.collection("buses").find(query).toArray();

    if (buses.length > 0) {
      console.log(buses);
      res.send({ status: "success", data: buses });
    } else {
      res.send({ status: "error", message: "No buses found for the given criteria." });
    }
  }
  );
  app.post('/busseats', async (req, res) => {
    const { busId, seats } = req.body;
  
  
    if (!busId) {
      return res.status(400).json({ error: 'Bus ID is required' });
    }
    if (!seats || seats.length === 0) {
      return res.status(400).json({ error: 'No seats selected' });
    }
  
    try {
     
      const alreadyBooked = await db.collection('seats').find({
        busId: busId,
        seatNumber: { $in: seats }
      }).toArray();
      const alreadyBookedSeats = alreadyBooked.map(seat => seat.seatNumber);
  
      if (alreadyBookedSeats.length > 0) {
        return res.status(400).json({
          error: 'Some seats are already booked',
          alreadyBookedSeats
        });
      }
  
   
      const bookedSeats = seats.map(seat => ({ busId: busId, seatNumber: seat }));
      await db.collection('seats').insertMany(bookedSeats);
  
      res.json({ message: 'Seats booked successfully', bookedSeats: seats });
    } catch (error) {
      console.error("Seat booking error:", error);
      res.status(500).json({ error: 'An error occurred while booking seats' });
    }
  });
  
  
  app.get('/bookedseats', async (req, res) => {
    const { busId } = req.query;
  
  
    if (!busId) {
      return res.status(400).json({ error: 'Bus ID is required' });
    }
  
    try {
      const bookedSeats = await db.collection('seats').find({ busId: busId }).project({ seatNumber: 1, _id: 0 }).toArray();
      res.json({ bookedSeats: bookedSeats.map(seat => seat.seatNumber) });
    } catch (error) {
      console.error("Error retrieving booked seats:", error);
      res.status(500).json({ error: 'An error occurred while retrieving booked seats' });
    }
  });
  app.post('offers',async(req,res)=>{
    
  })
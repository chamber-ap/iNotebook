const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')

 

connectToMongo();
const app = express()
const port = 5000

//middleware --to use req.body auth route
app.use(cors())
app.use(express.json()) 


//Available Routes
app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// app.get('/', (req, res)=>{
//   res.send('Hello World!')
// }
// ),

app.listen(port, () => {
  console.log(`iNotbook app backend listening on port http://localhost:${port}`)
})
let express=require('express'),
bodyParser = require('body-parser');
let app=express();

app.use(bodyParser.json());

let mongoose=require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URL,{useNewUrlParser:true},(err)=>{
  if(err) console.log('Could not connect');
  else console.log('connected')
})


let user = require('./routes/route');
let user1 = require('./routes/card');
app.use('/user', user);
app.use('/user1',user1);


app.get('/', (req, res) => res.send("Hello Page"));

PORT = 4101 ;
app.listen(PORT, () => console.log(`At ${PORT} port is running!`));

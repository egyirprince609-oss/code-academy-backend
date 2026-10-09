import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const JIYU_API_KEY = process.env.JIYU_API_KEY;

app.get('/', (req,res)=> res.send('Backend Live - Code Academy'));

const POSSIBLE_URLS = [
  'https://jiyudata.store/api/plans',
  'https://api.jiyudata.store/api/plans',
  'https://jiyudata.store/api/v1/plans'
];

app.get('/api/plans', async (req,res)=>{
  for (let url of POSSIBLE_URLS){
    try{
      console.log("Trying", url);
      const r = await fetch(url, {
        headers: { 
          'x-api-key': JIYU_API_KEY,
          'Authorization': `Bearer ${JIYU_API_KEY}`
        }
      });
      const text = await r.text();
      console.log(url, "->", r.status, text.slice(0,300));
      if(r.ok){
        try{ return res.json(JSON.parse(text)); } catch{ return res.send(text); }
      }
    }catch(e){ console.log("Failed", url, e.message); }
  }
  res.status(500).json({error:"Could not find working JiyuData URL. Please provide docs link."});
});

app.post('/api/buy-data', async (req,res)=>{
  res.status(500).json({message:"We need correct JiyuData URL first"});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Running on', PORT));
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const JIYU_API_KEY = process.env.JIYU_API_KEY;
console.log("Key present?", !!JIYU_API_KEY);

app.get('/', (req,res)=> res.send('Backend Live - Code Academy'));

app.get('/api/plans', async (req,res)=>{
  try{
    console.log("Fetching Jiyu plans...");
    // Try with x-api-key header
    const r = await fetch('https://api.jiyudata.com.gh/api/plans', {
      headers: { 
        'x-api-key': JIYU_API_KEY,
        'X-API-KEY': JIYU_API_KEY,
        'Authorization': `Bearer ${JIYU_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const text = await r.text();
    console.log("Jiyu status:", r.status, "body:", text.slice(0,500));
    
    try{
      const data = JSON.parse(text);
      res.status(r.status).json(data);
    }catch{
      res.status(r.status).send(text);
    }
  }catch(e){ 
    console.error(e);
    res.status(500).json({error:"Failed to fetch", details: e.message}) 
  }
});

app.post('/api/buy-data', async (req,res)=>{
  try{
    const { network, phone, plan_id } = req.body;
    const r = await fetch('https://api.jiyudata.com.gh/api/orders', {
      method:'POST',
      headers: { 
        'x-api-key': JIYU_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ network, phone, plan_id })
    });
    const data = await r.text();
    console.log("Buy response:", data);
    try{ res.json(JSON.parse(data)); } catch{ res.send(data); }
  }catch(e){ res.status(500).json({message:"Failed", error: e.message}) }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Running on', PORT));
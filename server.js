import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const JIYU_API_KEY = process.env.JIYU_API_KEY;

app.get('/', (req,res)=> res.send('Code Academy Backend is Live'));

app.get('/api/plans', async (req,res)=>{
  try{
    const r = await fetch('https://api.jiyudata.com.gh/api/plans', {
      headers: { 'x-api-key': JIYU_API_KEY }
    });
    const data = await r.json();
    res.json(data);
  }catch(e){ res.status(500).json({error:"Failed"}) }
});

app.post('/api/buy-data', async (req,res)=>{
  try{
    const { network, phone, plan_id } = req.body;
    const r = await fetch('https://api.jiyudata.com.gh/api/orders', {
      method:'POST',
      headers: { 'x-api-key': JIYU_API_KEY, 'Content-Type':'application/json' },
      body: JSON.stringify({ network, phone, plan_id })
    });
    const data = await r.json();
    res.json(data);
  }catch(e){ res.status(500).json({message:"Failed"}) }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Running'));
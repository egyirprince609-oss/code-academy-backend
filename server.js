import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.JIYU_API_KEY;
const BASE_URL = 'https://jiyudata.store/api/external/v1';

app.get('/', (req,res)=> res.send('Code Academy Backend LIVE - Wiseman'));

app.get('/api/plans', async (req,res)=>{
  try{
    console.log("Fetching networks from JiyuData...");
    const r = await fetch(`${BASE_URL}/networks`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    const data = await r.text();
    console.log("Status", r.status, data.slice(0,500));
    try{
      const json = JSON.parse(data);
      res.status(r.status).json(json);
    }catch{
      res.status(r.status).send(data);
    }
  }catch(e){
    console.error(e);
    res.status(500).json({error:"Failed", details:e.message});
  }
});

app.post('/api/buy-data', async (req,res)=>{
  try{
    const { bundleId, recipientPhone, network } = req.body;
    // frontend will send bundleId and phone
    const r = await fetch(`${BASE_URL}/orders`, {
      method:'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        bundleId: bundleId,
        recipientPhone: recipientPhone
      })
    });
    const data = await r.text();
    console.log("Order response:", data);
    try{ res.status(r.status).json(JSON.parse(data)); }
    catch{ res.status(r.status).send(data); }
  }catch(e){
    res.status(500).json({error:"Buy failed", details:e.message});
  }
});

app.get('/api/orders/:id', async (req,res)=>{
  try{
    const r = await fetch(`${BASE_URL}/orders/${req.params.id}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    const data = await r.text();
    try{ res.json(JSON.parse(data)); } catch{ res.send(data); }
  }catch(e){ res.status(500).json({error:e.message}); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Running on', PORT));
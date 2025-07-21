import express from 'express';
import  execute from './api/execute';
const app = express();
app.get('/api/execute', execute);
app.listen(3000, () => {
  console.log('running');
});

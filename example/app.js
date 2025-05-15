const express = require('express');
const mathLib = require('math-lib');  // Replace with your actual library name

const app = express();
const port = 3000;

app.get('/add/:a/:b', (req, res) => {
  const a = parseInt(req.params.a);
  const b = parseInt(req.params.b);
  const result = mathLib.add(a, b);
  res.json({ result });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

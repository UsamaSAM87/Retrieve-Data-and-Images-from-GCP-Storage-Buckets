const express = require('express');

const app = express();

// The default page
const defaultStyle = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
      }
      h2 {
        color: white;
        background-color: #c01947;
        border-radius: 3px;
        padding: 3px;
        text-align: center;
      }
      ul {
        list-style-type: none;
        padding: 0;
        text-align: center;
      }
      li {
        margin-bottom: 10px;
      }
      a {
        text-decoration: none;
        color: #333;
        display: inline-block;
        padding: 10px 20px;
        background-color: #273748;
        color: #fff;
        border-radius: 5px;
        transition: background-color 0.3s ease;
      }
      a:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <h2>Dashboard for Coursework-1</h2>
    <ul>
      <li><a href="https://task1d-dot-boreal-axiom-415114.nw.r.appspot.com/">Task 1</a></li>
      <li><a href="https://task2-dot-boreal-axiom-415114.nw.r.appspot.com/">Task 2</a></li>
      <li><a href="https://task3-dot-boreal-axiom-415114.nw.r.appspot.com/">Task 3</a></li>
    </ul>
  </body>
  </html>
`;

// Route for the default landing page
app.get('/', (req, res) => {
  res.send(defaultStyle);
});

// Starting our server
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

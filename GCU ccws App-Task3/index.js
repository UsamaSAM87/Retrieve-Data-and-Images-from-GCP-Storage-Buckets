const express = require('express');
const axios = require('axios');
const { Storage } = require('@google-cloud/storage');
const process = require('process');
const { google } = require('googleapis');

const app = express();

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
});

// The homepage
const homepageStyle = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Third Activity</title>
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


      .goback-button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #dc3545;
        color: #fff;
        border-radius: 5px;
        text-decoration: none;
        transition: background-color 0.3s ease;
      }
      .goback-button:hover {
        background-color: #c82333;
      }
    </style>
  </head>



  <body>
    <h2> 3rd Activity -> metadata responces from Google Cloud Storage Bucket</h2>
    <ul>
      <li><a href="/metadata/2c1.jpg">Request metadata of Image 1</a></li>
      <li><a href="/metadata/2c2.jpg">Request metadata of Image 2</a></li>
      <li><a href="/metadata/2c3.jpg">Request metadata of Image 3</a></li>
      <br> <br> <br>
      <li><a href="https://boreal-axiom-415114.nw.r.appspot.com">Go to dashboard</a></li>
    </ul>
  </body>
  </html>
`;

app.get('/', (req, res) => {
  res.send(homepageStyle);
});

// Route to serve metadata for images
app.get('/metadata/:image_name', async (req, res) => {
  const imageName = req.params.image_name;
  const bucketName = 'coursework1-cloud';
  const folderName = 'Coursework1';
  const apiUrl = `https://storage.googleapis.com/storage/v1/b/${bucketName}/o/${folderName}%2F${imageName}`;

  try {
    // Making HTTP GET request to retrieve metadata
    const response = await axios.get(apiUrl);

    // Extracting relevant metadata
    const metadata = {
      filename: response.data.name,
      contentType: response.data.contentType,
      size: response.data.size,
      creationTime: response.data.timeCreated,
      studentID: 'S2386295',
      requestTime: new Date().toISOString()
    };

    // Sending JSON response with metadata
    res.send(`
      <div style="padding: 20px; background-color: #f4f4f4;">
        <h2 style="color: #007bff;">Metadata for ${imageName}</h2>
        <pre style="background-color: #fff; padding: 20px; border-radius: 5px;">${JSON.stringify(metadata, null, 2)}</pre>
        <a href="/" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: #fff; border-radius: 6px; text-decoration: none; transition: background-color 0.3s ease;">Click to go to Home</a>
      </div>
    `);
  } catch (error) {
    console.error('Error retrieving metadata:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Starting our dev server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const express = require('express');
const { Storage } = require('@google-cloud/storage');
const process = require('process');

const app = express();

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Activity 2</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
        }
        h1 {
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
      <h1>Retrieve Images from Bucket</h1>
      <ul>
        <li><a href="/image/2c1.jpg">Image 1</a></li>
        <li><a href="/image/2c2.jpg">Image 2</a></li>
        <li><a href="/image/2c3.jpg">Image 3</a></li>
        <br><br><br>
        <li><a href="https://boreal-axiom-415114.nw.r.appspot.com/">Go to Dashboard</a></li>
      </ul>
    </body>
    </html>
  `);
});

app.get('/image/:image_name', async (req, res) => {
    const imageName = req.params.image_name;
    const folderName = 'Coursework1';

    try {
        const bucket = storage.bucket('coursework1-cloud');
        const file = bucket.file(`${folderName}/${imageName}`);

        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-01-2500'
        });

        const [metadata] = await file.getMetadata();
        const caption = metadata.metadata ? metadata.metadata.caption : '';

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Image & Caption</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                  }
                  h1 {
                    color: #007bff;
                    text-align: center;
                  }
                  img {
                    display: block;
                    margin: 0 auto;
                    width: 250px;
                    height: 300px;
                  }
                  h4 {
                    text-align: center;
                    margin-top: 20px;
                    color: #333;
                  }
                  p {
                    text-align: center;
                    color: #555;
                  }
                </style>
            </head>
            <body>
                <h1>Image</h1>
                <img src="${url}" alt="${caption}">
                <h4>Caption</h4>
                <p>${caption}</p>
                <br> <br>
                <a href="/" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: #fff; border-radius: 5px; text-decoration: none; transition: background-color 0.3s ease;">Go Back to Home Page</a>
            </body>
            </html>
        `;
        
        res.send(html);
    } catch (error) {
        console.error('Error serving image:', error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Parser } = require('json2csv');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const programs = [];

    // Replace the following selector with the actual selector for the YMCA programs on the search results page
    $('.program-item').each((index, element) => {
      const name = $(element).find('.program-name').text().trim();
      const description = $(element).find('.program-description').text().trim();
      const schedule = $(element).find('.program-schedule').text().trim();
      const price = $(element).find('.program-price').text().trim();

      programs.push({ name, description, schedule, price });
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(programs);

    res.header('Content-Type', 'text/csv');
    res.attachment('programs.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

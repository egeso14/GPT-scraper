import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [url, setUrl] = useState('');
  const [programs, setPrograms] = useState([]);

  const handleScrape = async () => {
    try {
      const response = await axios.post('http://localhost:5001/scrape', { url }, {
        responseType: 'blob',
      });
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute('download', 'programs.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error scraping the website:', error);
    }
  };

  return (
    <div className="App">
      <h1>YMCA Program Scraper</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter YMCA search results URL"
      />
      <button onClick={handleScrape}>Scrape Programs</button>
    </div>
  );
};

export default App;

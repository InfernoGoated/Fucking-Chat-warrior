const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static('public'));

// File listing endpoint
app.get('/api/files', (req, res) => {
  const filesDir = path.join(__dirname, 'public/files');
  
  fs.readdir(filesDir, (err, items) => {
    if (err) return res.status(500).json({ error: 'Unable to read directory' });

    const files = items.map(item => {
      const itemPath = path.join(filesDir, item);
      const stats = fs.statSync(itemPath);
      
      return {
        name: item,
        path: `/files/${item}`,
        size: stats.size,
        modified: stats.mtime,
        type: stats.isDirectory() ? 'directory' : 'file',
        ext: path.extname(item).toLowerCase().substring(1)
      };
    });

    res.json(files);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

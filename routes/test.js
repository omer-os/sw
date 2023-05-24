const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const dummyData = {
    message: 'Dummy data for testing',
    items: [
      { id: 1, name: 'Item 1', description: 'This is a test item 1' },
      { id: 2, name: 'Item 2', description: 'This is a test item 2' },
      { id: 3, name: 'Item 3', description: 'This is a test item 3' },
    ],
  };

  res.json(dummyData);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getNote,
  updateNote,
  deleteNote,
  getNotes,
  createNote,
} = require('../controllers/noteController');
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);
router.route('/').get(getNotes).post(createNote);
router.route('/:id').get(getNote).put(updateNote).delete(deleteNote);

module.exports = router;

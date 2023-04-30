const asyncHandler = require('express-async-handler');
const Note = require('../models/noteModel');

//@desc Get all notes
//@route GET /api/notes
//@access private
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user_id: req.user.id });
  res.status(200).json({ message: 'Notes fetched successfully', data: notes });
});

//@desc Create New note
//@route POST /api/notes
//@access private
const createNote = asyncHandler(async (req, res) => {
  const { note } = req.body;
  if (!note) {
    res.status(422).json({
      status: 'error',
      message: 'Note cannot be empty',
    });
  }
  const singleNote = await Note.create({
    note,
    user_id: req.user.id,
  });

  res
    .status(201)
    .json({ message: 'Note saved successfully', data: singleNote });
});

//@desc Get note
//@route GET /api/notes/:id
//@access private
const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    res.status(404).json({
      status: 'error',
      message: 'Note not found',
    });
  }
  res.status(200).json({ message: 'Note saved successfully', data: note });
});

//@desc Update note
//@route PUT /api/notes/:id
//@access private
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    res.status(404).json({
      status: 'error',
      message: 'Note not found',
    });
  }

  if (note.user_id.toString() !== req.user.id) {
    res.status(403).json({
      status: 'error',
      message: 'You do not have permission to edit this note',
    });
  }

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res
    .status(200)
    .json({ message: 'Note updated successfully', data: updatedNote });
});

//@desc Delete note
//@route DELETE /api/notes/:id
//@access private
const deleteNote = asyncHandler(async (req, res) => {
  const contact = await Note.findById(req.params.id);
  if (!contact) {
    res.status(404).json({
      status: 'error',
      message: 'Note does not exist',
    });
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403).json({
      status: 'error',
      message: 'You do not have permission to edit this note',
    });
  }
  await Note.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Note deleted successfully' });
});

module.exports = {
  getNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
};

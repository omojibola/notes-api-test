const mongoose = require("mongoose");

const noteSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    note: {
      type: String,
      required: [true, "Please add a note"],
    },
   
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", noteSchema);

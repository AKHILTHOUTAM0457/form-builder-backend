const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true, // Ensuring each field has a type (like 'text', 'radio', etc.)
  },
  label: {
    type: String,
    required: true, // Ensuring each field has a label
  },
  options: {
    type: [String], // This will be an array of strings, for options like 'radio', 'select', etc.
    default: [], // Default empty array if no options are provided
  },
});

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Title is required
  },
  sections: [
    {
      label: String, // Label for the section
      fields: [fieldSchema], // The fields are now an array of objects defined by fieldSchema
    },
  ],
});

const Form = mongoose.model("Form", formSchema);

module.exports = Form;

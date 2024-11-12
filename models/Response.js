const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  responses: [
    {
      label: {
        type: String,
        required: true,
      },
      response: {
        type: mongoose.Schema.Types.Mixed, // Allow both String and Buffer types
        required: true,
      },
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

responseSchema.index({ formId: 1 });

const Response = mongoose.model("Response", responseSchema);

module.exports = Response;

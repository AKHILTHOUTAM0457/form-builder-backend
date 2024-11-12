require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Form = require("./models/Form");
const Response = require("./models/Response");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Route to create a new form
app.post("/api/forms", async (req, res) => {
  console.log("Request Body:", req.body);
  const newForm = new Form(req.body);

  try {
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(400).json({ error: error.message });
  }
});

// Route to get all forms
app.get("/api/forms", async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to submit form responses
app.post("/api/forms/:id/submit", async (req, res) => {
  const { id } = req.params;
  const { responses } = req.body;

  try {
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const newResponse = new Response({
      formId: form._id,
      responses,
    });

    await newResponse.save();

    res.status(201).json({ message: "Response submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all responses for a form
app.get("/api/forms/:id/responses", async (req, res) => {
  const { id } = req.params;

  try {
    const responses = await Response.find({ formId: id });

    if (responses.length === 0) {
      return res
        .status(404)
        .json({ error: "No responses found for this form" });
    }

    res.status(200).json({ responses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to generate shareable link for a form
app.post("/api/forms/:id/share", async (req, res) => {
  const { id } = req.params;
  const baseUrl = req.protocol + "://" + req.get("host");

  try {
    const form = await Form.findById(id);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const formLink = `https://form-builder-frontend-kappa.vercel.app/form/${id}`;

    res.status(200).json({ formLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New route to fetch form by its ID and display it when the user accesses the shared link
app.get("/forms/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Send back the form data
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

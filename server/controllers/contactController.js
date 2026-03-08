import ContactModel from "../models/contactModel.js";

export const createContact = async (req, res) => {
  try {
    const newContact = new ContactModel(req.body);
    await newContact.save();
    res.status(201).json({ success: true, message: "Message sent", contact: newContact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const contact = await ContactModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
    res.status(200).json({ success: true, message: "Status updated", contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await ContactModel.findByIdAndDelete(id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
    res.status(200).json({ success: true, message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

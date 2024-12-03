// Importing React and useState hook for managing component state
import React, { useState } from "react";

// Importing external CSS for styling the component
import "./DynamicForm.css";




const DynamicForm = () => {
  // State variables to manage form data, progress, feedback, and edit mode
  const [formFields, setFormFields] = useState([]); // Fields of the form based on selection
  const [formData, setFormData] = useState({}); // Data entered by user in the form
  const [dropdownSelection, setDropdownSelection] = useState(""); // Selected form type
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Feedback message after submit
  const [progress, setProgress] = useState(0); // Form completion progress
  const [submittedData, setSubmittedData] = useState({
    "User Information": [],
    "Address Information": [],
    "Payment Information": [],
  }); // Store submitted data for all form types
  const [editIndex, setEditIndex] = useState(null); // Track row index being edited
  const [errorMessage, setErrorMessage] = useState(""); // Validation error message

  // Mock API response with form structure and fields for each form type
  const mockApiResponse = {
    "User Information": {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    "Address Information": {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        {
          name: "state",
          type: "dropdown",
          label: "State",
          options: ["California", "Texas", "New York"],
          required: true,
        },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    "Payment Information": {
      fields: [
        { name: "cardNumber", type: "text", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
      ],
    },
  };

  // Handle dropdown selection change and reset form
  const handleDropdownChange = (e) => {
    const selection = e.target.value;
    setDropdownSelection(selection);
    setFormFields([]); // Reset fields
    setFormData({}); // Clear form data
    setProgress(0); // Reset progress
    setFeedbackMessage(""); // Clear feedback message
    setErrorMessage(""); // Clear error message

    if (!selection) {
      setErrorMessage("Please select a valid form type.");
      return;
    }

    // Load form structure for the selected form type
    const formStructure = mockApiResponse[selection];
    if (!formStructure) {
      setErrorMessage("Form structure could not be loaded.");
      return;
    }

    setFormFields(formStructure.fields);
  };

  // Handle input field change and update form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Check for fields that should allow only letters
    if (["firstName", "lastName", "city", "cardholderName"].includes(name)) {
      const lettersOnly = /^[a-zA-Z\s]*$/; // Allow letters and spaces
      if (!lettersOnly.test(value)) {
        setErrorMessage("Only letters are allowed in this field.");
        return; // Stop updating the state if validation fails
      }
    }
  
    setErrorMessage(""); // Clear error message if validation passes
    setFormData((prev) => ({ ...prev, [name]: value }));
    updateProgress(); // Update progress bar based on form completion
  };
  

  // Update progress based on filled required fields
  const updateProgress = () => {
    const requiredFields = formFields.filter((field) => field.required);
    const filledFields = requiredFields.filter(
      (field) => formData[field.name] && formData[field.name].trim() !== ""
    );
    setProgress((filledFields.length / requiredFields.length) * 100);
  };

  // Handle form submission: validate, add or update data
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formType = dropdownSelection;
      const updatedData = { ...formData, formType };

      if (editIndex === null) {
        // Add new entry if not in edit mode
        setSubmittedData((prevData) => ({
          ...prevData,
          [formType]: [...prevData[formType], updatedData],
        }));
        setFeedbackMessage("Form submitted successfully.");
      } else {
        // Update the specific row if editing
        const updatedEntries = [...submittedData[formType]];
        updatedEntries[editIndex] = updatedData;
        setSubmittedData((prevData) => ({
          ...prevData,
          [formType]: updatedEntries,
        }));
        setFeedbackMessage("Changes saved successfully.");
      }

      // Reset form after submission
      setFormFields([]);
      setFormData({});
      setDropdownSelection("");
      setProgress(100);
      setEditIndex(null); // Reset edit mode

      // Hide feedback message after 3 seconds
      setTimeout(() => {
        setFeedbackMessage("");
      }, 3000);
    }
  };

  // Validate form to ensure required fields are filled
  const validateForm = () => {
    const errors = formFields.filter(
      (field) => field.required && (!formData[field.name] || formData[field.name].trim() === "")
    );
    if (errors.length > 0) {
      setFeedbackMessage("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  // Handle editing a row: populate form with selected data
  const handleEdit = (index, formType) => {
    const editedData = submittedData[formType][index];
    setEditIndex(index);
    setFormData(editedData); // Populate form with the selected row's data
    setDropdownSelection(formType); // Set form type based on the selected row's data
    setFormFields(mockApiResponse[formType].fields); // Set the fields for the form type
  };

  // Handle deleting a row
  const handleDelete = (index, formType) => {
    const updatedData = submittedData[formType].filter((_, i) => i !== index);
    setSubmittedData((prevData) => ({
      ...prevData,
      [formType]: updatedData,
    }));
    setFeedbackMessage("Entry deleted successfully.");

    // Clear feedback message after 3 seconds
    setTimeout(() => {
      setFeedbackMessage("");
    }, 3000);
  };

  // Render submitted data in a table grouped by form type
  const groupedData = submittedData;

  return (
    <div className="dynamic-form">
      <header>
        <h2>Dynamic Form</h2>
      </header>

      {/* Form for selecting form type and entering data */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="formType">Select Form Type</label>
          <select
            id="formType"
            value={dropdownSelection}
            onChange={handleDropdownChange}
          >
            <option value="">-- Select --</option>
            {Object.keys(mockApiResponse).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        {/* Render form fields dynamically */}
        {formFields.map((field) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>
              {field.label} {field.required && "*"}
            </label>
            {field.type === "dropdown" ? (
              <select
                id={field.name}
                name={field.name}
                onChange={handleInputChange}
                required={field.required}
              >
                <option value="">-- Select --</option>
                {field.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                required={field.required}
              />
            )}
          </div>
        ))}

        <button type="submit">{editIndex === null ? "Submit" : "Save Changes"}</button>
      </form>

      {/* Feedback messages */}
      {feedbackMessage && <div className="feedback-message">{feedbackMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Display form progress */}
      <div className="progress-bar">
        <ProgressBar progress={progress} />
      </div>

      {/* Display all submitted data in a table */}
      <div className="submitted-data">
        <h3>All Submitted Data</h3>
        {Object.keys(groupedData).map((formType) => {
          if (groupedData[formType].length > 0) {
            const form = mockApiResponse[formType];
            return (
              <div key={formType}>
                <h4>{formType}</h4>
                <table>
                  <thead>
                    <tr>
                      {form.fields.map((field) => (
                        <th key={field.name}>{field.label}</th>
                      ))}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedData[formType].map((data, idx) => (
                      <tr key={idx}>
                        {form.fields.map((field) => (
                          <td key={field.name}>{data[field.name]}</td>
                        ))}
                        <td>
                          <button onClick={() => handleEdit(idx, formType)}>Edit</button>
                          <button onClick={() => handleDelete(idx, formType)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

// Progress bar component to show form completion
export const ProgressBar = ({ progress }) => (
  <div className="progress">
    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
  </div>
);

export default DynamicForm;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import api from '../utils/api';
import { showToast, showApiError } from '../utils/toast';
import ImageUploadWidget from '../components/ImageUploadWidget';

const AddRecipePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // JSON Schema for the recipe form
  const schema = {
    type: "object",
    required: ["title", "ingredients", "instructions", "cookingTime"],
    properties: {
      title: {
        type: "string",
        title: "Recipe Title",
        minLength: 1,
        maxLength: 100
      },
      ingredients: {
        type: "array",
        title: "Ingredients",
        minItems: 1,
        items: {
          type: "string",
          minLength: 1
        }
      },
      instructions: {
        type: "string",
        title: "Instructions",
        minLength: 10
      },
      cookingTime: {
        type: "string",
        title: "Cooking Time",
        minLength: 1
      },
      imageUrl: {
        type: "string",
        title: "Recipe Image"
      }
    }
  };

  // UI Schema for better form layout
  const uiSchema = {
    title: {
      "ui:placeholder": "Enter recipe title (e.g., Spaghetti Carbonara)"
    },
    ingredients: {
      "ui:options": {
        addable: true,
        removable: true,
        orderable: true
      },
      items: {
        "ui:placeholder": "Enter ingredient (e.g., 400g spaghetti)"
      }
    },
    instructions: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 6
      },
      "ui:placeholder": "Enter detailed cooking instructions..."
    },
    cookingTime: {
      "ui:placeholder": "e.g., 25 minutes or 1 hour 30 minutes"
    },
    imageUrl: {
      "ui:widget": "imageUpload"
    }
  };

  // Custom widgets
  const widgets = {
    imageUpload: ImageUploadWidget
  };

  // Form submission handler
  const handleSubmit = async ({ formData }) => {
    setLoading(true);

    try {
      console.log('Submitting recipe data:', formData);

      const response = await api.post('/recipes', formData);

      console.log('Recipe creation response:', response.data);

      showToast.success('Recipe created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Recipe creation error:', error);
      showApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-5 text-primary mb-3">
              <i className="fas fa-plus-circle me-3"></i>
              Add New Recipe
            </h1>
            <p className="lead text-muted">
              Share your delicious recipe with the community!
            </p>
          </div>

          {/* Recipe Form */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <Form
                schema={schema}
                uiSchema={uiSchema}
                validator={validator}
                widgets={widgets}
                onSubmit={handleSubmit}
                disabled={loading}
              >
                <div className="d-flex gap-3 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/')}
                    disabled={loading}
                  >
                    <i className="fas fa-times me-1"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Creating Recipe...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-1"></i>
                        Create Recipe
                      </>
                    )}
                  </button>
                </div>
              </Form>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-4">
            <div className="alert alert-info" role="alert">
              <h5 className="alert-heading">
                <i className="fas fa-lightbulb me-2"></i>
                Tips for a great recipe:
              </h5>
              <ul className="mb-0">
                <li>Use clear, descriptive titles</li>
                <li>List ingredients with specific measurements</li>
                <li>Write step-by-step instructions</li>
                <li>Include cooking time for planning</li>
                <li>Add a photo to make it more appealing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipePage; 
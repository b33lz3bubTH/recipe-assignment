import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '@rjsf/bootstrap-4';
import validator from '@rjsf/validator-ajv8';
import api from '../utils/api';
import { showToast, showApiError } from '../utils/toast';
import ImageUploadWidget from '../components/ImageUploadWidget';
import CustomRJSFTheme from '../components/CustomRJSFTheme';
import useRecipeStore from '../store/recipeStore';

const EditRecipePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const { fetchRecipeById, clearCurrentRecipe } = useRecipeStore();

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

  const widgets = {
    imageUpload: ImageUploadWidget
  };

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        console.log('Fetching recipe for editing:', id);
        const result = await fetchRecipeById(id);
        
        if (result.success) {
          const { currentRecipe } = useRecipeStore.getState();
          console.log('Loaded recipe data:', currentRecipe);
          setInitialData(currentRecipe);
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
        showApiError(error);
        navigate('/');
      }
    };

    if (id) {
      loadRecipe();
    }

    return () => {
      clearCurrentRecipe();
    };
  }, [id, fetchRecipeById, clearCurrentRecipe, navigate]);

  const handleSubmit = async ({ formData }) => {
    setLoading(true);

    try {
      console.log('Submitting updated recipe data:', formData);

      const response = await api.put(`/recipes/${id}`, formData);

      console.log('Recipe update response:', response.data);

      showToast.success('Recipe updated successfully!');
      navigate(`/recipes/${id}`);
    } catch (error) {
      console.error('Recipe update error:', error);
      showApiError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading recipe data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div style={{width: '100%', marginTop: '10em'}}></div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-5 text-primary mb-3">
              <i className="fas fa-edit me-3"></i>
              Edit Recipe
            </h1>
            <p className="lead text-muted">
              Update your recipe details
            </p>
          </div>

          {/* Recipe Form */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <CustomRJSFTheme>
                <Form
                  schema={schema}
                  uiSchema={uiSchema}
                  validator={validator}
                  widgets={widgets}
                  formData={initialData}
                  onSubmit={handleSubmit}
                  disabled={loading}
                >
                  <div className="d-flex gap-3 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate(`/recipes/${id}`)}
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
                          Updating Recipe...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-1"></i>
                          Update Recipe
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              </CustomRJSFTheme>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-4">
            <div className="alert alert-info" role="alert">
              <h5 className="alert-heading">
                <i className="fas fa-lightbulb me-2"></i>
                Editing tips:
              </h5>
              <ul className="mb-0">
                <li>You can update any field in your recipe</li>
                <li>Upload a new image to replace the current one</li>
                <li>Add or remove ingredients as needed</li>
                <li>Improve instructions for better clarity</li>
                <li>Update cooking time if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRecipePage; 
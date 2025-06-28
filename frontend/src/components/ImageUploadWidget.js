import React, { useState } from 'react';
import api from '../utils/api';
import { showToast, showApiError } from '../utils/toast';
import { formatImageUrl } from '../utils/imageUtils';

const ImageUploadWidget = ({ id, value, onChange, disabled, readonly }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value ? formatImageUrl(value) : null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showToast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);

      const { filename } = response.data.data;
      
      // Update the form value with the filename
      onChange(filename);
      
      // Set preview using the formatted URL
      setPreview(formatImageUrl(filename));
      
      showToast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      showApiError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setPreview(null);
  };

  return (
    <div className="image-upload-widget">
      <div className="mb-3">
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || readonly || uploading}
          className="form-control"
        />
      </div>

      {uploading && (
        <div className="text-center mb-3">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Uploading...</span>
          </div>
          <span className="ms-2 text-muted">Uploading image...</span>
        </div>
      )}

      {preview && (
        <div className="image-preview mb-3">
          <div className="position-relative d-inline-block">
            <img
              src={preview}
              alt="Preview"
              className="img-thumbnail"
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
            />
            {!disabled && !readonly && (
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                style={{ margin: '5px' }}
                onClick={handleRemove}
                title="Remove image"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          <div className="mt-2">
            <small className="text-muted">
              Current image: {value}
            </small>
          </div>
        </div>
      )}

      {!preview && !uploading && (
        <div className="text-center p-4 border rounded bg-light">
          <i className="fas fa-image fa-3x text-muted mb-3"></i>
          <p className="text-muted mb-0">No image selected</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadWidget; 
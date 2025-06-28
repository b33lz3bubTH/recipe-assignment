const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000/api';

// Helper function to log responses
const logResponse = (title, response) => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ ${title}`);
  console.log(`${'='.repeat(50)}`);
  console.log('Status:', response.status);
  console.log('Data:', JSON.stringify(response.data, null, 2));
};

// Helper function to log errors
const logError = (title, error) => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`❌ ${title}`);
  console.log(`${'='.repeat(50)}`);
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Data:', JSON.stringify(error.response.data, null, 2));
  } else {
    console.log('Error:', error.message);
  }
};

// Create a test image file
const createTestImage = () => {
  const testImagePath = path.join(__dirname, 'test-image.png');
  
  // Create a simple 1x1 PNG image (minimal valid PNG)
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width: 1
    0x00, 0x00, 0x00, 0x01, // height: 1
    0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
    0x90, 0x77, 0x53, 0xDE, // CRC
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
    0xE2, 0x21, 0xBC, 0x33, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  fs.writeFileSync(testImagePath, pngData);
  return testImagePath;
};

// Test functions
const testUploadImage = async () => {
  try {
    console.log('\n📤 Testing Image Upload...');
    
    // Create test image
    const testImagePath = createTestImage();
    console.log(`Created test image at: ${testImagePath}`);
    
    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testImagePath));
    
    // Upload image
    const response = await axios.post(`${BASE_URL}/upload/image`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    
    logResponse('Image Upload', response);
    
    // Clean up test file
    fs.unlinkSync(testImagePath);
    
    return response.data.data.filename;
    
  } catch (error) {
    logError('Image Upload Test', error);
    return null;
  }
};

const testServeFile = async (filename) => {
  try {
    console.log('\n📥 Testing File Serving...');
    
    if (!filename) {
      console.log('No filename provided, skipping file serving test');
      return;
    }
    
    const response = await axios.get(`${BASE_URL}/upload/file?file=${filename}`, {
      responseType: 'arraybuffer'
    });
    
    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ File Served Successfully`);
    console.log(`${'='.repeat(50)}`);
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Content-Length:', response.headers['content-length']);
    console.log('File size:', response.data.length, 'bytes');
    
    // Save the served file to verify it's correct
    const servedFilePath = path.join(__dirname, 'served-image.png');
    fs.writeFileSync(servedFilePath, response.data);
    console.log(`Served file saved to: ${servedFilePath}`);
    
  } catch (error) {
    logError('File Serving Test', error);
  }
};

const testGetUploadedFiles = async () => {
  try {
    console.log('\n📋 Testing Get Uploaded Files...');
    
    const response = await axios.get(`${BASE_URL}/upload/files`);
    logResponse('Get Uploaded Files', response);
    
  } catch (error) {
    logError('Get Uploaded Files Test', error);
  }
};

const testErrorCases = async () => {
  try {
    console.log('\n🚫 Testing Error Cases...');
    
    // Test uploading without file
    try {
      const formData = new FormData();
      const response = await axios.post(`${BASE_URL}/upload/image`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
    } catch (error) {
      logResponse('Upload without file (Expected Error)', error.response);
    }
    
    // Test uploading invalid file type
    try {
      const formData = new FormData();
      const testTextPath = path.join(__dirname, 'test.txt');
      fs.writeFileSync(testTextPath, 'This is a text file, not an image');
      
      formData.append('file', fs.createReadStream(testTextPath));
      
      const response = await axios.post(`${BASE_URL}/upload/image`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      
      // Clean up
      fs.unlinkSync(testTextPath);
    } catch (error) {
      logResponse('Upload invalid file type (Expected Error)', error.response);
    }
    
    // Test serving non-existent file
    try {
      await axios.get(`${BASE_URL}/upload/file?file=nonexistent.jpg`);
    } catch (error) {
      logResponse('Serve non-existent file (Expected Error)', error.response);
    }
    
    // Test serving without file parameter
    try {
      await axios.get(`${BASE_URL}/upload/file`);
    } catch (error) {
      logResponse('Serve without file parameter (Expected Error)', error.response);
    }
    
  } catch (error) {
    logError('Error Cases Test', error);
  }
};

// Main test runner
const runTests = async () => {
  console.log('📤 Upload API Testing Suite');
  console.log('============================');
  
  try {
    const uploadedFilename = await testUploadImage();
    await testServeFile(uploadedFilename);
    await testGetUploadedFiles();
    await testErrorCases();
    
    console.log('\n🎉 All upload tests completed!');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
  }
};

// Run the tests
runTests(); 
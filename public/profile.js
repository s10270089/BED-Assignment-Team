// Get references to the HTML elements you'll interact with
const nameInput = document.getElementById("name");
const birthdayInput = document.getElementById("birthday");
const passwordInput = document.getElementById("password");
const profilePicture = document.getElementById("profile-picture");
const profileForm = document.querySelector(".profile-info");
const messageDiv = document.getElementById("message");
const submitBtn = document.querySelector(".submit-btn");
const deleteBtn = document.getElementById("delete-btn");
const photoInput = document.getElementById("photo-input");
const uploadPhotoBtn = document.getElementById("upload-photo-btn");
const photoUploadOverlay = document.getElementById("photo-upload-overlay");
const apiBaseUrl = "http://localhost:3000";

function getCurrentUserFromToken() {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      return null;
    }
    
    // Decode the token payload (client-side decoding for display only)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Check if token is expired
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      return null;
    }
    
    return {
      userId: payload.user_id, // Fixed: should be user_id not userId
      email: payload.email,
      profileId: payload.user_id // Fixed: should be user_id not userId
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Initialize user data from token
const currentUser = getCurrentUserFromToken();

// Check if user is authenticated
if (!currentUser) {
  console.error('No authenticated user found. Redirecting to login...');
  if (messageDiv) {
    messageDiv.textContent = 'Authentication required. Redirecting to login...';
    messageDiv.className = 'message error';
  }
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 2000);
  throw new Error('Authentication required');
}

// Set global variables for use throughout the file
const userId = currentUser.userId;

console.log('Using user ID from token:', userId);

// Function to show loading state on button
function setLoadingState(isLoading) {
  if (submitBtn) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? "Saving..." : "Save Changes";
  }
}

// Photo upload functionality
let selectedPhotoFile = null;

// Function to create or check upload preset (call this once to setup)
async function setupCloudinaryPreset() {
  try {
    console.log('Setting up Cloudinary upload preset...');
    // This is just a check function - the actual preset setup should be done in Cloudinary dashboard
    showMessage('Please ensure "ml_default" upload preset is created in your Cloudinary dashboard with unsigned uploads enabled.', 'loading');
  } catch (error) {
    console.log('Preset setup check failed:', error);
  }
}

// Function to handle photo selection
function handlePhotoSelection(event) {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('Please select a valid image file.', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('Please select an image smaller than 5MB.', 'error');
      return;
    }

    selectedPhotoFile = file;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
      profilePicture.src = e.target.result;
      showMessage('Photo selected. Click "Upload Selected Photo" to save.', 'success');
      uploadPhotoBtn.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

// Function to upload photo - Hybrid approach (Backend first, then direct Cloudinary)
async function uploadPhoto() {
  if (!selectedPhotoFile) {
    showMessage('Please select a photo first.', 'error');
    return;
  }

  try {
    // Show loading state
    uploadPhotoBtn.disabled = true;
    uploadPhotoBtn.textContent = 'Uploading...';
    showMessage('Uploading photo...', 'loading');

    let imageUrl = null;

    // Method 1: Try backend upload first (more secure)
    try {
      console.log('Attempting backend upload...');
      const reader = new FileReader();
      
      const backendUpload = new Promise((resolve, reject) => {
        reader.onload = async function(e) {
          try {
            const base64Image = e.target.result;

            const uploadResponse = await fetch(`${apiBaseUrl}/upload-image`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ image: base64Image })
            });

            if (!uploadResponse.ok) {
              throw new Error(`Backend upload failed: ${uploadResponse.status}`);
            }

            const uploadResult = await uploadResponse.json();
            resolve(uploadResult.url);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
      });

      reader.readAsDataURL(selectedPhotoFile);
      imageUrl = await backendUpload;
      console.log('Backend upload successful:', imageUrl);

    } catch (backendError) {
      console.log('Backend upload failed, trying direct Cloudinary...', backendError.message);
      
      // Method 2: Fallback to direct Cloudinary upload
      try {
        showMessage('Trying alternative upload method...', 'loading');
        
        const formData = new FormData();
        formData.append('file', selectedPhotoFile);
        formData.append('upload_preset', 'ml_default'); // Unsigned preset
        formData.append('cloud_name', 'dgtx0alyb');

        const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dgtx0alyb/image/upload', {
          method: 'POST',
          body: formData
        });

        if (!cloudinaryResponse.ok) {
          throw new Error(`Cloudinary upload failed: ${cloudinaryResponse.status}`);
        }

        const cloudinaryResult = await cloudinaryResponse.json();
        imageUrl = cloudinaryResult.secure_url;
        console.log('Direct Cloudinary upload successful:', imageUrl);

      } catch (cloudinaryError) {
        console.log('Direct Cloudinary upload also failed:', cloudinaryError.message);
        
        // Method 3: Final fallback - signed upload with your credentials
        try {
          showMessage('Trying signed upload...', 'loading');
          
          const timestamp = Math.round((new Date()).getTime() / 1000);
          const signatureString = `timestamp=${timestamp}931192727676242`; // timestamp + api_key
          
          const formDataSigned = new FormData();
          formDataSigned.append('file', selectedPhotoFile);
          formDataSigned.append('api_key', '931192727676242');
          formDataSigned.append('timestamp', timestamp);
          formDataSigned.append('cloud_name', 'dgtx0alyb');

          const signedResponse = await fetch('https://api.cloudinary.com/v1_1/dgtx0alyb/image/upload', {
            method: 'POST',
            body: formDataSigned
          });

          if (!signedResponse.ok) {
            throw new Error(`Signed upload failed: ${signedResponse.status}`);
          }

          const signedResult = await signedResponse.json();
          imageUrl = signedResult.secure_url;
          console.log('Signed upload successful:', imageUrl);

        } catch (signedError) {
          throw new Error(`All upload methods failed. Backend: ${backendError.message}, Cloudinary: ${cloudinaryError.message}, Signed: ${signedError.message}`);
        }
      }
    }

    // If we got here, one of the upload methods worked
    if (!imageUrl) {
      throw new Error('No image URL received from upload');
    }

    // Update profile with new image URL
    showMessage('Updating profile...', 'loading');

    // Get token for authorization
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const updateData = {
      user_id: userId,
      profile_photo_url: imageUrl
    };

    const response = await fetch(`${apiBaseUrl}/userprofiles/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add this line
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `Profile update failed: ${response.status}, message: ${errorBody.message || errorBody.error}`
      );
    }

    // Success
    profilePicture.src = imageUrl;
    showMessage('Profile picture updated successfully!', 'success');
    uploadPhotoBtn.style.display = 'none';
    selectedPhotoFile = null;
    photoInput.value = '';

  } catch (error) {
    console.error('Error uploading photo:', error);
    showMessage(`Failed to upload photo: ${error.message}`, 'error');
  } finally {
    // Restore button state
    uploadPhotoBtn.disabled = false;
    uploadPhotoBtn.textContent = 'Upload Selected Photo';
  }
}

// Function to show messages
function showMessage(text, type) {
  if (messageDiv) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    if (type === 'success') {
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
      }, 5000);
    }
  }
}

// Function to enable photo upload mode (now enabled by default)
function enablePhotoUpload() {
  // Make picture clickable and show upload overlay on hover
  if (profilePicture && photoUploadOverlay) {
    profilePicture.style.cursor = 'pointer';
    
    // Add click handlers for photo upload
    profilePicture.addEventListener('click', () => {
      photoInput.click();
      showMessage('Select an image to upload as your profile picture.', 'success');
    });
    photoUploadOverlay.addEventListener('click', () => {
      photoInput.click();
      showMessage('Select an image to upload as your profile picture.', 'success');
    });
  }
}

// Function to fetch and prefill profile data
async function preloadProfileData() {
  try {
    // Show loading state
    if (messageDiv) {
      messageDiv.textContent = "Loading profile...";
      messageDiv.className = "message loading";
    }

    // Get token for authorization
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // Use the user_id endpoint
    const response = await fetch(`${apiBaseUrl}/userprofiles/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message || errorBody.error}`
      );
    }

    const data = await response.json();
    console.log('Profile loaded:', data);

    // Prefill form fields
    fillFormWithData(data);

    // Clear loading message and show success
    if (messageDiv) {
      messageDiv.textContent = "Profile loaded successfully!";
      messageDiv.className = "message success";
      setTimeout(() => {
        messageDiv.textContent = "";
        messageDiv.className = "";
      }, 3000);
    }

  } catch (error) {
    console.error("Error loading profile:", error);
    
    if (messageDiv) {
      messageDiv.textContent = `Failed to load profile: ${error.message}`;
      messageDiv.className = "message error";
    }
  }
}

// Function to fill form with fetched data
function fillFormWithData(data) {
  try {
    // Fill name field (now available from Users table join)
    if (nameInput && data.name) {
      nameInput.value = data.name;
    }

    // Fill birthday field (now available from Users table join)
    if (birthdayInput && data.birthday) {
      const formattedDate = data.birthday.split("T")[0];
      birthdayInput.value = formattedDate;
    }

    // Set profile picture if available
    if (profilePicture && data.profile_photo_url) {
      profilePicture.src = data.profile_photo_url;
    }

  } catch (error) {
    console.error("Error filling form with data:", error);
    throw new Error("Failed to populate form fields");
  }
}

// Function to handle profile update
async function updateProfile(profileData) {
  try {
    // Show loading state
    setLoadingState(true);
    if (messageDiv) {
      messageDiv.textContent = "Updating profile...";
      messageDiv.className = "message loading";
    }

    // Get token for authorization
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    // Make PUT request to update profile
    const response = await fetch(`${apiBaseUrl}/userprofiles/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // 🔹 ADD THIS LINE
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message || errorBody.error}`
      );
    }

    const result = await response.json();
    
    // Show success message
    if (messageDiv) {
      messageDiv.textContent = "Profile updated successfully!";
      messageDiv.className = "message success";
      setTimeout(() => {
        messageDiv.textContent = "";
        messageDiv.className = "";
      }, 5000);
    }

    return result;

  } catch (error) {
    console.error("Error updating profile:", error);
    
    if (messageDiv) {
      messageDiv.textContent = `Update failed: ${error.message}`;
      messageDiv.className = "message error";
    }
    
    throw error;
  } finally {
    setLoadingState(false);
  }
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();

  try {
    // Validate form data
    const formData = getFormData();
    validateFormData(formData);

    // Update profile
    await updateProfile(formData);

  } catch (error) {
    console.error("Form submission error:", error);
    // Error message is already shown by updateProfile function
    // Just log here for debugging
    
    // Make sure button is not stuck in loading state
    setLoadingState(false);
  }
}

// Function to extract form data
function getFormData() {
  const name = nameInput?.value.trim() || "";
  const birthday = birthdayInput?.value || "";
  const password = passwordInput?.value.trim() || "";
  const profilePhotoUrl = profilePicture?.src || "";

  const data = {
    user_id: userId, // Required by backend
    name: name, // Send name for Users table update
    birthday: birthday, // Send birthday for Users table update
    profile_photo_url: profilePhotoUrl !== "https://via.placeholder.com/100" ? profilePhotoUrl : ""
  };

  // Only include password if it's provided
  if (password) {
    data.password = password;
  }

  return data;
}

// Function to validate form data
function validateFormData(data) {
  const errors = [];

  if (!data.user_id) {
    errors.push("User ID is required");
  }

  if (!data.name || data.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!data.birthday) {
    errors.push("Birthday is required");
  }

  // Password validation only if password is provided
  if (data.password && data.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (errors.length > 0) {
    if (messageDiv) {
      messageDiv.textContent = `Validation Error: ${errors.join(", ")}`;
      messageDiv.className = "message error";
    }
    throw new Error(errors.join(", "));
  }
}

// Function to handle profile deletion
async function deleteProfile() {
  try {
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
      return;
    }

    // Show loading state
    if (deleteBtn) {
      deleteBtn.disabled = true;
      deleteBtn.textContent = "Deleting...";
    }

    if (messageDiv) {
      messageDiv.textContent = "Deleting profile...";
      messageDiv.className = "message loading";
    }

    // Get token for authorization
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    // Make DELETE request
    const response = await fetch(`${apiBaseUrl}/userprofiles/${profileId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}` // 🔹 ADD THIS LINE
      }
    });

    if (!response.ok) {
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message || errorBody.error}`
      );
    }

    // Show success message
    if (messageDiv) {
      messageDiv.textContent = "Profile deleted successfully! Redirecting...";
      messageDiv.className = "message success";
    }

    // Redirect after successful deletion
    setTimeout(() => {
      window.location.href = "/"; // Redirect to home page or user list
    }, 2000);

  } catch (error) {
    console.error("Error deleting profile:", error);
    
    // Show error message
    if (messageDiv) {
      messageDiv.textContent = `Delete failed: ${error.message}`;
      messageDiv.className = "message error";
    }

    // Restore button state
    if (deleteBtn) {
      deleteBtn.disabled = false;
      deleteBtn.textContent = "Delete Profile";
    }
  }
}



// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Load profile data when page loads
  preloadProfileData();

  // Enable photo upload functionality immediately
  enablePhotoUpload();

  // Add form submit event listener
  if (profileForm) {
    profileForm.addEventListener("submit", handleFormSubmit);
  } else {
    console.error("Profile form not found!");
  }

  // Add delete button event listener
  if (deleteBtn) {
    deleteBtn.addEventListener("click", deleteProfile);
  } else {
    console.error("Delete button not found!");
  }

  // Add back button event listener
  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "/index.html";
    });
  } else {
    console.error("Back button not found!");
  }

  // Add photo input change event listener
  if (photoInput) {
    photoInput.addEventListener("change", handlePhotoSelection);
  } else {
    console.error("Photo input not found!");
  }

  // Add upload photo button event listener
  if (uploadPhotoBtn) {
    uploadPhotoBtn.addEventListener("click", uploadPhoto);
  } else {
    console.error("Upload photo button not found!");
  }
});

// Optional: Add helper function to refresh profile data
function refreshProfile() {
  preloadProfileData();
}

// Optional: Export functions for testing or external use
window.profileManager = {
  preloadProfileData,
  updateProfile,
  deleteProfile,
  refreshProfile,
  uploadPhoto
};

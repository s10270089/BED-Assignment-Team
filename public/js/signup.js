const form = document.getElementById("signupForm");
const errorBox = document.getElementById("signupError");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const nextToStep2 = document.getElementById("nextToStep2");
const nextToStep3 = document.getElementById("nextToStep3");
const skipStep2 = document.getElementById("skipStep2");
const skipStep3 = document.getElementById("skipStep3");
const profilePicInput = document.getElementById("profilePicInput");
const profilePicPreview = document.getElementById("profilePicPreview");

let signupData = {};
let profilePhotoUrl = "";
let registeredUserId = null;

// Password visibility toggle
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
});

const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
toggleConfirmPassword.addEventListener("click", () => {
  const type = confirmPasswordInput.type === "password" ? "text" : "password";
  confirmPasswordInput.type = type;
});
  
// Function to upload photo to backend (which then uploads to Cloudinary)
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file); // Append the file to FormData

  try {
    // Send the image file to the backend for processing/upload to Cloudinary
    const response = await fetch("/signup/upload-profile-photo", {
      method: "POST",
      body: formData,  // Send formData as the request body
    });

    const data = await response.json();
    console.log("Cloudinary Upload Response:", data);  // Log Cloudinary response

    if (data.secure_url) {
      console.log("Image URL:", data.secure_url);  // Ensure the URL is being returned
      return data.secure_url;  // Return the URL of the uploaded image
    } else {
      throw new Error("Failed to upload to Cloudinary.");
    }
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw new Error("Error uploading photo to Cloudinary");
  }
}

// On Step 1 → Step 2: Only POST basic info and get user ID
nextToStep2.onclick = function () {
  errorBox.textContent = "";
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  if (!name || !email || !password || !confirmPassword) {
    errorBox.textContent = "Please fill all fields.";
    return;
  }
  if (password !== confirmPassword) {
    errorBox.textContent = "Passwords do not match.";
    return;
  }

  signupData = { name, email, password };

  console.log("POST Data:", signupData);

  fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signupData),
  })
    .then((res) =>
      res.json().then((data) => ({ status: res.status, data }))
    )
    .then(({ status, data }) => {
      console.log("Response Data:", data);

      if (status !== 201) {
        errorBox.textContent = data.error || (data.errors && data.errors[0]) || "Signup failed.";
        return;
      }

      const userId = data.user_id;
      if (!userId) {
        errorBox.textContent = "Failed to get user ID.";
        return;
      }

      registeredUserId = userId;
      console.log("Registered User ID:", registeredUserId);
      step1.style.display = "none";
      step2.style.display = "block";
    });
};

// On Step 2 → Step 3: Just collect data, no PATCH!
// On Step 2 → Step 3: Just collect data, no PATCH!
nextToStep3.onclick = function () {
  errorBox.textContent = "";
  
  const birthday = form.birthday.value;
  let height = form.heightValue.value;
  let heightUnit = form.heightUnit.value;
  let weight = form.weightValue.value;
  let weightUnit = form.weightUnit.value;
  const genderSelect = document.getElementById("gender");
  const gender = genderSelect.options[genderSelect.selectedIndex].value;

  // Check if all required fields are filled
  if (!birthday || !gender || gender === "") {
    errorBox.textContent = "Please fill birthday and gender.";
    return;
  }

  if (height && heightUnit === "ft") {
    height = (parseFloat(height) * 30.48).toFixed(1);
    heightUnit = "cm";
  }
  if (weight && weightUnit === "lbs") {
    weight = (parseFloat(weight) * 0.453592).toFixed(1);
    weightUnit = "kg";
  }

  // Store all data into signupData
  signupData.birthday = birthday;
  signupData.height = height ? `${height}${heightUnit}` : "";
  signupData.weight = weight ? `${weight}${weightUnit}` : "";
  signupData.gender = gender;
  
  console.log("signupData in Step 3:", signupData);  // Check what's inside signupData

  step2.style.display = "none";
  step3.style.display = "block";
};

// Final Form Submit (Step 3 → Submit)
// Form submit (final step)
form.onsubmit = async function (e) {
  e.preventDefault();  // Prevent default form submission

  // Retrieve the profile photo URL from the hidden input
  const profilePhotoUrl = document.getElementById("profilePicUrl").value;

  // If there's no profile photo URL (because the user skipped the upload)
  if (!profilePhotoUrl) {
    console.log("No profile photo uploaded, proceeding without it.");
  }

  // Prepare the data to be submitted
  const patchData = {
    birthday: signupData.birthday || null,
    height: signupData.height ? parseFloat(signupData.height.replace(/[^\d.]/g, "")) : null,
    weight: signupData.weight ? parseFloat(signupData.weight.replace(/[^\d.]/g, "")) : null,
    gender: signupData.gender || null,
    profile_photo_url: profilePhotoUrl,  // Add uploaded photo URL to data
  };

  console.log("Patch Data being sent:", patchData);  // Debug the patch data

  // Submit to the backend for updating the user
  const res = await fetch(`/signup/${registeredUserId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patchData),
  });

  const data = await res.json();
  if (res.status !== 200) {
    errorBox.textContent = data.error || (data.errors && data.errors[0]) || "Profile update failed.";
    return;
  }

  alert("Signup successful! Please login.");
  window.location.href = "login.html";  // Redirect after successful submission
};

// src/pages/SignUp.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabase"; // Ensure this is correctly imported
import Header from "../partials/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function SignUp() {
  const navigate = useNavigate();
  
  // Initialize form data with default values
  const [formData, setFormData] = useState({
    avatar: "",
    name: "",
    designation: "",
    phone: "",
    whatsapp: "",
    website: "",
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    google_reviews: "",
    upi: "",
    email: "",
    maps: "",
    background_image: "",
    password: "",
    drive_link: "",
    is_verified: false, // User is pending admin approval upon sign-up
  });

  const [avatarFile, setAvatarFile] = useState(null); // New state for avatar file
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [redirectDelay, setRedirectDelay] = useState(3); // Countdown for redirect
  const [errorMessage, setErrorMessage] = useState(null); // For displaying errors
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false); // Loading state for avatar upload

  // Effect to handle redirect after successful sign-up
  useEffect(() => {
    if (isSuccessPopupOpen) {
      const countdown = setInterval(() => {
        setRedirectDelay((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            navigate("/signin");
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [isSuccessPopupOpen, navigate]);

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Function to handle file uploads to Supabase Storage.
   * @param {File} file - The file to upload.
   * @param {string} bucketName - The storage bucket name.
   * @returns {string|null} - The public URL of the uploaded file or null if failed.
   */
  const handleFileUpload = async (file, bucketName = 'image') => {
    if (!file) return null;

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      // Upload the file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError.message);
        setErrorMessage('Error uploading image. Please try again.');
        return null;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (urlError) {
        console.error('Error getting public URL:', urlError.message);
        setErrorMessage('Error retrieving image URL. Please try again.');
        return null;
      }

      return publicUrl;
    } catch (error) {
      console.error('Unexpected error during file upload:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      return null;
    }
  };

  // Handle avatar image selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (e.g., 5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_SIZE) {
      setErrorMessage('Image size must be less than 5MB');
      return;
    }

    setAvatarFile(file); // Store the file in state
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setErrorMessage(null); // Reset any previous error messages

    // Prepare the data to insert
    const dataToInsert = { ...formData };

    // If background_image is empty, remove it to allow Supabase to use the default
    if (!dataToInsert.background_image) {
      delete dataToInsert.background_image;
    }

    // Handle avatar upload if a file is selected
    if (avatarFile) {
      setIsUploadingAvatar(true); // Start avatar upload loading
      const publicUrl = await handleFileUpload(avatarFile);
      setIsUploadingAvatar(false); // End avatar upload loading

      if (publicUrl) {
        dataToInsert.avatar = publicUrl; // Set the avatar URL in form data
      } else {
        // If avatar upload failed, stop the submission
        setIsLoading(false);
        return;
      }
    }

    try {
      const { error } = await supabase.from("social_media_data").insert([dataToInsert]);

      if (error) {
        console.error("Error inserting data into Supabase:", error.message);
        setErrorMessage("Error creating account. Please try again.");
      } else {
        console.log("Data inserted successfully");
        setIsSuccessPopupOpen(true); // Open the success pop-up
        // Optionally, reset the avatar file after successful submission
        setAvatarFile(null);
      }
    } catch (err) {
      console.error("Error with Supabase:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-12 pb-12 md:pt-20 md:pb-20">
              {/* Page Title */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="text-4xl font-bold text-gray-800">
                  Unlock the Power of NFC Business Cards
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                  Create and manage your digital business cards effortlessly.
                </p>
              </div>

              {/* Sign-Up Form Container */}
              <div className="max-w-lg mx-auto">
                {/* Display Error Message */}
                {errorMessage && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                    role="alert"
                  >
                    <span className="block sm:inline">{errorMessage}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                      <svg
                        className="fill-current h-6 w-6 text-red-500"
                        role="button"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        onClick={() => setErrorMessage(null)}
                      >
                        <title>Close</title>
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  </div>
                )}

                {/* Display Success Popup */}
        
     {isSuccessPopupOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
          {/* Video for Success */}
          <div className="mb-4">
            {isVideoLoading && (
              <div className="flex justify-center items-center">
                {/* Loading Spinner */}
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            )}
    
            <video
              className={`mx-auto h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 ${isVideoLoading ? 'hidden' : ''}`}
              autoPlay
              loop
              muted
              playsInline
              preload="auto" // Preload video
              onCanPlay={() => setIsVideoLoading(false)} // Set loading state to false when video is ready
            >
              <source src="/src/utils/verify.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
    
          {/* Success Text */}
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">Sign Up Successful!</h3>
          <p className="mt-2 text-gray-600 text-sm sm:text-base lg:text-lg">
            Your account has been created. Verification pending.
          </p>
          <p className="mt-4 text-gray-500 text-xs sm:text-sm lg:text-base">
            Redirecting to Sign In in {redirectDelay} second{redirectDelay !== 1 ? 's' : ''}...
          </p>
        </div>
      </div>
    )}
    
              

                {/* Sign-Up Form */}
                <form onSubmit={handleSubmit}>
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Designation */}
                    <div>
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        name="designation"
                        type="text"
                        placeholder="Software Engineer"
                        value={formData.designation}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="text"
                        placeholder="+1 234 567 8901"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Website */}
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://example.com"
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        type="text"
                        placeholder="+1 234 567 8901"
                        value={formData.whatsapp}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {/* Facebook */}
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        name="facebook"
                        type="url"
                        placeholder="https://facebook.com/johndoe"
                        value={formData.facebook}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Instagram */}
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        type="url"
                        placeholder="https://instagram.com/johndoe"
                        value={formData.instagram}
                        onChange={handleChange}
                      />
                    </div>

                    {/* YouTube */}
                    <div>
                      <Label htmlFor="youtube">YouTube</Label>
                      <Input
                        id="youtube"
                        name="youtube"
                        type="url"
                        placeholder="https://youtube.com/johndoe"
                        value={formData.youtube}
                        onChange={handleChange}
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        type="url"
                        placeholder="https://linkedin.com/in/johndoe"
                        value={formData.linkedin}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Additional Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {/* Google Reviews */}
                    <div>
                      <Label htmlFor="google_reviews">Google Reviews</Label>
                      <Input
                        id="google_reviews"
                        name="google_reviews"
                        type="text"
                        placeholder="www.googlereview.com"
                        value={formData.google_reviews}
                        onChange={handleChange}
                      />
                    </div>

                    {/* UPI */}
                    <div>
                      <Label htmlFor="upi">UPI</Label>
                      <Input
                        id="upi"
                        name="upi"
                        type="text"
                        placeholder="https://upi.com/johndoe"
                        value={formData.upi}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Maps */}
                    <div>
                      <Label htmlFor="maps">Maps</Label>
                      <Input
                        id="maps"
                        name="maps"
                        type="url"
                        placeholder="https://maps.google.com/?q=johndoe"
                        value={formData.maps}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Drive Link */}
                    <div>
                      <Label htmlFor="drive_link">Drive Link</Label>
                      <Input
                        id="drive_link"
                        name="drive_link"
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={formData.drive_link}
                        onChange={handleChange}
                      />
                    </div>
                  </div>


                  {/* Avatar Upload */}
                  <div className="mt-4">
                    <Label htmlFor="avatar">Avatar</Label>
                    <div className="relative">
                      <Input
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="mt-1"
                      />
                      {isUploadingAvatar && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <svg
                            className="animate-spin h-5 w-5 text-blue-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Upload an avatar image.
                    </p>
                  </div>

                  {/* Avatar Preview */}
                  {avatarFile && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={URL.createObjectURL(avatarFile)}
                        alt="Avatar Preview"
                        className="w-24 h-24 rounded-full object-cover border"
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="mt-6">
                    <Button
                      type="submit"
                      className="w-full flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isLoading} // Disable button while loading
                    >
                      <span>Sign Up</span>
                    </Button>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="text-sm text-gray-500 text-center mt-4">
                    By creating an account, you agree to the{" "}
                    <a className="underline" href="/terms" target="_blank" rel="noopener noreferrer">
                      terms & conditions
                    </a>{" "}
                    and our{" "}
                    <a className="underline" href="/privacy" target="_blank" rel="noopener noreferrer">
                      privacy policy
                    </a>
                    .
                  </div>
                </form>

                {/* Redirect Link */}
                <div className="text-gray-600 text-center mt-6">
                  Already using White Tap?{" "}
                  <Link
                    to="/signin"
                    className="text-blue-600 hover:underline transition duration-150 ease-in-out"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Loading Overlay (Only for Form Submission) */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col justify-center items-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <p className="text-lg text-gray-700">Signing Up...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons Component for Search
const SearchIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

export default SignUp;

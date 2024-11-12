// src/pages/UserHome.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "../supabase";
import ViewUserInsights from "./adminwidgets/ViewUserInsights"; // Ensure correct import path
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, Ban, Edit2, ExternalLink, BarChart2 } from "lucide-react"; // Imported Cancel icon
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// ContactItem Component
function ContactItem({ icon: Icon, label, value, link }) {
  return (
    <div className="flex items-center space-x-2">
      <Icon className="w-5 h-5 text-gray-600" />
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-gray-600">{value}</p>
        )}
      </div>
    </div>
  );
}

// Utility function for uploading files
const uploadFile = async (file, folder, setError) => {
  if (!file) return null;

  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError(`Please upload a valid image file (${allowedTypes.join(', ')})`);
      return null;
    }

    // Validate file size (e.g., 5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_SIZE) {
      setError('Image size must be less than 5MB');
      return null;
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload the file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('image') // Ensure 'image' bucket exists
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error(`Error uploading file:`, uploadError.message);
      setError(`Error uploading file: ${uploadError.message}`);
      return null;
    }

    // Get the public URL for the uploaded file
    const { data: urlData, error: urlError } = supabase.storage
      .from('image')
      .getPublicUrl(filePath);

    if (urlError) {
      console.error('Error getting public URL:', urlError.message);
      setError('Error retrieving file URL. Please try again.');
      return null;
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error('Unexpected error during file upload:', error);
    setError('An unexpected error occurred. Please try again.');
    return null;
  }
};

function UserHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const signedInUserEmail = location.state?.signedInUserEmail;

  // State variables
  const [userData, setUserData] = useState(null);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [themesLoading, setThemesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [editedFormData, setEditedFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false); // For save button loading

  // Toggle edit mode
  const toggleEditing = () => setIsEditing(!isEditing);

  // Handle viewing the user's card
  const handleViewCard = () => {
    if (!userData || !userData.id) {
      console.error("User data or user ID is not available");
      return;
    }
    const userId = userData.id;
    const url = `${window.location.origin}/profile/${userId}/`;
    console.log("Opening URL:", url); // Debugging line
    window.open(url, "_blank");
  };

  // Handle viewing insights
  const handleViewInsights = () => {
    setIsInsightsOpen(true);
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (signedInUserEmail) {
          const { data, error } = await supabase
            .from("social_media_data")
            .select("*")
            .eq("email", signedInUserEmail)
            .single();

          if (error) {
            setError("Error fetching user data");
          } else if (data) {
            setUserData(data);
            setEditedFormData(data);
          } else {
            setError("No user data found");
          }
        } else {
          setError("User not signed in");
        }
      } catch (error) {
        console.error("Fetch User Data Error:", error);
        setError("An error occurred. Please try again.");
      }
    };

    // Introduce an artificial delay of 1.5 seconds
    const fetchDataWithDelay = async () => {
      await Promise.all([
        fetchUserData(),
        new Promise((resolve) => setTimeout(resolve, 1500)), // 1.5 seconds delay
      ]);
      setLoading(false);
    };

    fetchDataWithDelay();
  }, [signedInUserEmail]);

  // Fetch themes from Supabase
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const { data, error } = await supabase
          .from("theme")
          .select("*")
          .order("theme_name", { ascending: true }); // Optional: Order themes alphabetically

        if (error) {
          setError("Error fetching themes");
        } else if (data) {
          setThemes(data);
        }
      } catch (error) {
        console.error("Fetch Themes Error:", error);
        setError("An error occurred while fetching themes.");
      } finally {
        setThemesLoading(false);
      }
    };

    fetchThemes();
  }, []);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file uploads for avatar and background image
  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setIsSaving(true);
      const publicUrl = await uploadFile(file, field === "avatar" ? "images" : "background_images", setError);
      if (publicUrl) {
        setEditedFormData((prevData) => ({
          ...prevData,
          [field]: publicUrl,
        }));
      }
      setIsSaving(false);
    }
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    setIsSaving(true);
    setError(null);

    // Prepare the data to update
    const dataToUpdate = { ...editedFormData };

    // If background_image is empty, remove it to allow Supabase to use the default
    if (!dataToUpdate.background_image) {
      delete dataToUpdate.background_image;
    }

    console.log("Data to update in Supabase:", dataToUpdate);

    try {
      const { error } = await supabase
        .from("social_media_data")
        .update([dataToUpdate])
        .eq("email", signedInUserEmail);

      if (error) {
        console.error("Error updating user data:", error.message);
        setError("Error saving changes. Please try again.");
      } else {
        setUserData(dataToUpdate);
        setIsEditing(false);
        console.log("User data updated successfully");
      }
    } catch (err) {
      console.error("Save Changes Error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle canceling edits
  const handleCancelEdit = () => {
    setEditedFormData(userData); // Revert changes
    setIsEditing(false); // Exit edit mode
    setError(null); // Clear any existing errors
    console.log("Edits canceled. Reverted to original user data.");
  };

  // Conditional rendering based on loading and error states
  if (loading || themesLoading) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!userData) {
    navigate("/signin");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="backdrop-blur-md bg-white/90 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                {/* Responsive Title */}
                <CardTitle className="text-lg md:text-2xl font-bold">Profile</CardTitle>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleEditing}
                    aria-label={isEditing ? "Cancel Editing" : "Edit Profile"}
                  >
                    {isEditing ? <Ban className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleViewInsights}
                    aria-label="View Insights"
                  >
                    <BarChart2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleViewCard}
                    aria-label="View Card"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Avatar and Basic Info */}
                  <div className="flex flex-col items-center">
                    <Avatar className="w-32 h-32 mb-4">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {isEditing ? (
                      <div className="space-y-2 text-center">
                        <Input
                          id="name"
                          name="name"
                          value={editedFormData.name}
                          onChange={handleInputChange}
                          placeholder="Name"
                          className="text-center"
                        />
                        <Input
                          id="designation"
                          name="designation"
                          value={editedFormData.designation}
                          onChange={handleInputChange}
                          placeholder="Designation"
                          className="text-center"
                        />

                        {/* Avatar Upload */}
                        <div className="mt-2">
                          <Label htmlFor="avatar">
                            <Button as="span" variant="outline" className="cursor-pointer">
                              Change Profile
                            </Button>
                          </Label>
                          <Input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "avatar")}
                            className="hidden"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <h2 className="text-xl font-semibold">{userData.name}</h2>
                        <p className="text-gray-600">{userData.designation}</p>
                      </div>
                    )}
                  </div>

                  {/* Contact Information and Theme Selector */}
                  <div className="md:col-span-2">
                    {/* Theme Selector (Only in Edit Mode) */}
                    {isEditing && (
                      <div className="mb-6">
                        <Label htmlFor="theme">Theme</Label>
                        <Select
                          onValueChange={(value) =>
                            setEditedFormData((prevData) => ({ ...prevData, background_image: value }))
                          }
                          defaultValue={userData.background_image}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a theme" />
                          </SelectTrigger>
                          <SelectContent>
                            {themes.map((theme) => (
                              <SelectItem key={theme.id} value={theme.background_image_url}>
                                {/* Theme Preview Thumbnail */}
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={theme.background_image_url}
                                    alt={`${theme.theme_name} thumbnail`}
                                    className="w-6 h-6 rounded object-cover"
                                  />
                                  <span>{theme.theme_name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Contact Tabs */}
                    <Tabs defaultValue="contact" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                        <TabsTrigger value="social">Social</TabsTrigger>
                      </TabsList>
                      <TabsContent value="contact" className="space-y-4 mt-4">
                        {isEditing ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={editedFormData.phone}
                                onChange={handleInputChange}
                                placeholder="+1 234 567 8901"
                              />
                            </div>
                            <div>
                              <Label htmlFor="whatsapp">WhatsApp</Label>
                              <Input
                                id="whatsapp"
                                name="whatsapp"
                                value={editedFormData.whatsapp}
                                onChange={handleInputChange}
                                placeholder="+1 234 567 8901"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={editedFormData.email}
                                onChange={handleInputChange}
                                placeholder="john.doe@example.com"
                              />
                            </div>
                            <div>
                              <Label htmlFor="website">Website</Label>
                              <Input
                                id="website"
                                name="website"
                                type="url"
                                value={editedFormData.website}
                                onChange={handleInputChange}
                                placeholder="https://example.com"
                              />
                            </div>
                            <div>
                              <Label htmlFor="upi">UPI</Label>
                              <Input
                                id="upi"
                                name="upi"
                                value={editedFormData.upi}
                                onChange={handleInputChange}
                                placeholder="johndoe@upi"
                              />
                            </div>
                            <div>
                              <Label htmlFor="maps">Maps</Label>
                              <Input
                                id="maps"
                                name="maps"
                                type="url"
                                value={editedFormData.maps}
                                onChange={handleInputChange}
                                placeholder="https://maps.google.com/?q=johndoe"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <ContactItem icon={ExternalLink} label="Phone" value={userData.phone} />
                            <ContactItem icon={ExternalLink} label="WhatsApp" value={userData.whatsapp} />
                            <ContactItem
                              icon={ExternalLink}
                              label="Email"
                              value={userData.email}
                              link={`mailto:${userData.email}`}
                            />
                            <ContactItem
                              icon={ExternalLink}
                              label="Website"
                              value="Visit Website"
                              link={userData.website}
                            />
                            <ContactItem icon={ExternalLink} 
                              label="UPI" 
                              value="Visit UPI"
                              link={userData.upi}/>
                            <ContactItem
                              icon={ExternalLink}
                              label="Maps"
                              value="View on Maps"
                              link={userData.maps}
                            />
                          </div>
                        )}
                      </TabsContent>
                      <TabsContent value="social" className="space-y-4 mt-4">
                        {isEditing ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="facebook">Facebook</Label>
                              <Input
                                id="facebook"
                                name="facebook"
                                type="url"
                                value={editedFormData.facebook}
                                onChange={handleInputChange}
                                placeholder="https://facebook.com/johndoe"
                              />
                            </div>
                            <div>
                              <Label htmlFor="instagram">Instagram</Label>
                              <Input
                                id="instagram"
                                name="instagram"
                                type="url"
                                value={editedFormData.instagram}
                                onChange={handleInputChange}
                                placeholder="https://instagram.com/johndoe"
                              />
                            </div>
                            <div>
                              <Label htmlFor="youtube">YouTube</Label>
                              <Input
                                id="youtube"
                                name="youtube"
                                type="url"
                                value={editedFormData.youtube}
                                onChange={handleInputChange}
                                placeholder="https://youtube.com/johndoe"
                              />
                            </div>
                            <div>
                              <Label htmlFor="linkedin">LinkedIn</Label>
                              <Input
                                id="linkedin"
                                name="linkedin"
                                type="url"
                                value={editedFormData.linkedin}
                                onChange={handleInputChange}
                                placeholder="https://linkedin.com/in/johndoe"
                              />
                            </div>
                            <div>
                              <Label htmlFor="google_reviews">Google Reviews</Label>
                              <Input
                                id="google_reviews"
                                name="google_reviews"
                                type="url"
                                value={editedFormData.google_reviews}
                                onChange={handleInputChange}
                                placeholder="https://g.page/r/johndoe"
                              />
                            </div>
                            <div>
                              <Label htmlFor="drive_link">Drive Link</Label>
                              <Input
                                id="drive_link"
                                name="drive_link"
                                type="url"
                                value={editedFormData.drive_link}
                                onChange={handleInputChange}
                                placeholder="https://drive.google.com/..."
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <ContactItem
                              icon={ExternalLink}
                              label="Facebook"
                              value="Visit Profile"
                              link={userData.facebook}
                            />
                            <ContactItem
                              icon={ExternalLink}
                              label="Instagram"
                              value="Visit Profile"
                              link={userData.instagram}
                            />
                            <ContactItem
                              icon={ExternalLink}
                              label="YouTube"
                              value="Visit Channel"
                              link={userData.youtube}
                            />
                            <ContactItem
                              icon={ExternalLink}
                              label="LinkedIn"
                              value="Visit Profile"
                              link={userData.linkedin}
                            />
                            <ContactItem
                              icon={ExternalLink}
                              label="Google Reviews"
                              value="View Reviews"
                              link={userData.google_reviews}
                            />
                            <ContactItem
                              icon={ExternalLink}
                              label="Drive Link"
                              value="Open Drive"
                              link={userData.drive_link}
                            />
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                    {/* Save and Cancel Changes Buttons */}
                    {isEditing && (
                      <div className="mt-6 flex justify-center md:justify-end space-x-4">
                        {/* Cancel Button */}
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="flex items-center space-x-2"
                          disabled={isSaving} // Disable button while saving
                        >
                          <Ban className="h-4 w-4" />
                          <span>Cancel</span>
                        </Button>

                        {/* Save Changes Button */}
                        <Button
                          onClick={handleSaveChanges}
                          className="flex items-center space-x-2"
                          disabled={isSaving} // Disable button while saving
                        >
                          <Save className="h-4 w-4" />
                          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Insights Modal */}
        <ViewUserInsights isOpen={isInsightsOpen} setIsOpen={setIsInsightsOpen} userId={userData.id} />
      </main>
    </div>
  );
}

export default UserHome;

// Icons Component for Search (if needed elsewhere)
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

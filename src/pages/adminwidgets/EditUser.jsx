// src/pages/adminwidgets/EditUser.jsx

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Save, Ban } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import supabase from "../../supabase"; // Ensure correct import path
import { Skeleton } from "@/components/ui/skeleton";

function EditUser({
  isOpen, // Boolean to control dialog visibility
  setIsOpen, // Function to close the dialog
  handleEditUser, // Function to handle editing
  selectedUserForEdit, // The user currently being edited
  setSelectedUserForEdit, // Function to set the selected user
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
    phone: "",
    website: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    google_reviews: "",
    upi: "",
    maps: "",
    background_image: "", // Holds the selected theme URL
    avatar: "",
    drive_link: "",
  });

  const [alertMessage, setAlertMessage] = useState(null); // Alert message
  const [themes, setThemes] = useState([]); // State to hold themes
  const [themesLoading, setThemesLoading] = useState(true); // Loading state for themes
  const [themesError, setThemesError] = useState(null); // Error state for themes

  // Fetch themes from Supabase when component mounts
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const { data, error } = await supabase
          .from("theme")
          .select("*")
          .order("theme_name", { ascending: true }); // Optional: Order themes alphabetically

        if (error) {
          console.error("Error fetching themes:", error);
          setThemesError("Failed to load themes. Please try again.");
        } else {
          setThemes(data);
        }
      } catch (err) {
        console.error("Unexpected error fetching themes:", err);
        setThemesError("An unexpected error occurred while loading themes.");
      } finally {
        setThemesLoading(false);
      }
    };

    if (isOpen) {
      fetchThemes();
    }
  }, [isOpen]);

  // Populate form data when a user is selected for editing
  useEffect(() => {
    if (selectedUserForEdit) {
      setFormData({
        name: selectedUserForEdit.name || "",
        email: selectedUserForEdit.email || "",
        password: "", // Typically, you wouldn't pre-fill password fields
        designation: selectedUserForEdit.designation || "",
        phone: selectedUserForEdit.phone || "",
        website: selectedUserForEdit.website || "",
        whatsapp: selectedUserForEdit.whatsapp || "",
        facebook: selectedUserForEdit.facebook || "",
        instagram: selectedUserForEdit.instagram || "",
        youtube: selectedUserForEdit.youtube || "",
        linkedin: selectedUserForEdit.linkedin || "",
        google_reviews: selectedUserForEdit.google_reviews || "",
        upi: selectedUserForEdit.upi || "",
        maps: selectedUserForEdit.maps || "",
        background_image: selectedUserForEdit.background_image || "",
        avatar: selectedUserForEdit.avatar || "",
        drive_link: selectedUserForEdit.drive_link || "",
      });
    }
  }, [selectedUserForEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value, field) => {
    if (field === "background_image" && value === "none") {
      setFormData((prev) => ({ ...prev, [field]: "" })); // Set to empty string when 'None' is selected
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleEditUser(formData);
      setAlertMessage({
        type: "success",
        message: "User updated successfully!",
      });
      setIsOpen(false); // Close the modal after successful update
      setSelectedUserForEdit(null);
    } catch (error) {
      console.error("Error editing user:", error);
      setAlertMessage({
        type: "error",
        message: "An error occurred while updating the user. Please try again.",
      });
    }
  };

  // Automatically dismiss alert after 3 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null); // Clear the alert after 3 seconds
      }, 3000); // 3 seconds delay

      return () => clearTimeout(timer); // Cleanup timer if alert changes or component unmounts
    }
  }, [alertMessage]);

  const closeAlert = () => {
    setAlertMessage(null); // Clears the alert manually
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-4xl w-full h-full sm:h-auto max-h-full sm:max-h-[90vh] p-4 sm:p-6"
        aria-labelledby="edit-user-dialog-title"
        aria-describedby="edit-user-dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="edit-user-dialog-title">Edit User</DialogTitle>
          <DialogDescription id="edit-user-dialog-description">
            Modify the details of the selected user. All fields are optional except for the email.
          </DialogDescription>
        </DialogHeader>

  
        {/* ScrollArea Wrapper */}
        <ScrollArea className="mt-4 h-full sm:h-[calc(100vh-200px)] px-2">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 px-2 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                type="email"
                id="email"
                name="email"
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
                type="password"
                id="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Designation */}
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input
                type="text"
                id="designation"
                name="designation"
                placeholder="Software Engineer"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                type="text"
                id="phone"
                name="phone"
                placeholder="+1 234 567 8901"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Website */}
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                type="url"
                id="website"
                name="website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            {/* WhatsApp */}
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                type="text"
                id="whatsapp"
                name="whatsapp"
                placeholder="+1 234 567 8901"
                value={formData.whatsapp}
                onChange={handleChange}
              />
            </div>

            {/* Facebook */}
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                type="url"
                id="facebook"
                name="facebook"
                placeholder="https://facebook.com/johndoe"
                value={formData.facebook}
                onChange={handleChange}
              />
            </div>

            {/* Instagram */}
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                type="url"
                id="instagram"
                name="instagram"
                placeholder="https://instagram.com/johndoe"
                value={formData.instagram}
                onChange={handleChange}
              />
            </div>

            {/* YouTube */}
            <div>
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                type="url"
                id="youtube"
                name="youtube"
                placeholder="https://youtube.com/johndoe"
                value={formData.youtube}
                onChange={handleChange}
              />
            </div>

            {/* LinkedIn */}
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                type="url"
                id="linkedin"
                name="linkedin"
                placeholder="https://linkedin.com/in/johndoe"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </div>

            {/* Google Reviews */}
            <div>
              <Label htmlFor="google_reviews">Google Reviews</Label>
              <Input
                type="text"
                id="google_reviews"
                name="google_reviews"
                placeholder="Enter Google Reviews link"
                value={formData.google_reviews}
                onChange={handleChange}
              />
            </div>

            {/* UPI */}
            <div>
              <Label htmlFor="upi">UPI</Label>
              <Input
                type="text"
                id="upi"
                name="upi"
                placeholder="https://upi.com/johndoe"
                value={formData.upi}
                onChange={handleChange}
              />
            </div>

            {/* Maps */}
            <div>
              <Label htmlFor="maps">Maps</Label>
              <Input
                type="url"
                id="maps"
                name="maps"
                placeholder="https://maps.google.com/?q=johndoe"
                value={formData.maps}
                onChange={handleChange}
              />
            </div>

            {/* Background Image (Select Box) */}
            <div>
              <Label htmlFor="background_image">Background Image</Label>
              {themesLoading ? (
                <Skeleton className="w-full h-10 rounded-md mt-1" />
              ) : themesError ? (
                <p className="text-red-500 mt-1">{themesError}</p>
              ) : (
                <Select
                  onValueChange={(value) =>
                    handleSelectChange(value, "background_image")
                  }
                  value={formData.background_image || "none"} // Default to "none" if empty
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select Background Image" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="text-gray-500">None</span>
                    </SelectItem>
                    {themes.map((theme) => (
                      <SelectItem
                        key={theme.id}
                        value={theme.background_image_url}
                      >
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
              )}
            </div>

            {/* Avatar */}
            {/* <div>
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                type="url"
                id="avatar"
                name="avatar"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatar}
                onChange={handleChange}
              />
            </div> */}

            {/* Drive Link */}
            <div>
              <Label htmlFor="drive_link">Drive Link</Label>
              <Input
                type="url"
                id="drive_link"
                name="drive_link"
                placeholder="https://drive.google.com/..."
                value={formData.drive_link}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
              <Button type="submit"       className="mt-4 w-full mb-8 sm:mb-0 flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default EditUser;

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

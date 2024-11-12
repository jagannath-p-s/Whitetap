// src/pages/adminwidgets/AddUser.jsx

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import supabase from "../../supabase"; // Ensure correct path

function AddUser({ isOpen, setIsOpen, handleAddUser }) {
  const cancelButtonRef = useRef(null);

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
    background_image: "", // Holds the URL of the selected background image
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleAddUser(formData);
      setAlertMessage({
        type: "success",
        message: "User added successfully!",
      });

      // Reset form data
      setFormData({
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
        background_image: "",
        avatar: "",
        drive_link: "",
      });

      setIsOpen(false); // Close the modal after successful addition
    } catch (error) {
      console.error("Error adding user:", error);
      setAlertMessage({
        type: "error",
        message: "An error occurred while adding the user. Please try again.",
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
    <div>
      {/* Alert Message */}
      {alertMessage && (
        <div
          role="alert"
          className={`rounded-xl border p-4 mb-4 ${
            alertMessage.type === "success"
              ? "border-green-100 bg-green-50"
              : "border-red-100 bg-red-50"
          }`}
        >
          <div className="flex items-start gap-4">
            <span
              className={`text-${
                alertMessage.type === "success" ? "green" : "red"
              }-600`}
            >
              {alertMessage.type === "success" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </span>
            <div className="flex-1">
              <strong className="block font-medium text-gray-900 dark:text-gray-100">
                {alertMessage.message}
              </strong>
            </div>
            <button
              className="text-gray-500 transition hover:text-gray-600"
              onClick={closeAlert}
            >
              <span className="sr-only">Dismiss alert</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Add User Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="sm:max-w-4xl w-full h-full sm:h-auto max-h-full sm:max-h-[90vh] p-4 sm:p-6"
          aria-labelledby="add-user-dialog-title"
          aria-describedby="add-user-dialog-description"
        >
          <DialogHeader>
            <DialogTitle id="add-user-dialog-title">Add New User</DialogTitle>
            <DialogDescription id="add-user-dialog-description">
              Please fill in the details of the new user.
            </DialogDescription>
          </DialogHeader>

          {/* ScrollArea Wrapper */}
          <ScrollArea className="mt-4 h-full sm:h-[calc(100vh-200px)] px-2">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 px-2 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {/* Name */}
              <div className="col-span-1">
                <Label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              {/* Email */}
              <div className="col-span-1">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              {/* Password */}
              <div className="col-span-1">
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              {/* Designation */}
              <div className="col-span-1">
                <Label
                  htmlFor="designation"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Designation
                </Label>
                <Input
                  id="designation"
                  name="designation"
                  type="text"
                  placeholder="Enter designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* Phone */}
              <div className="col-span-1">
                <Label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* Website */}
              <div className="col-span-1">
                <Label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="Enter website URL"
                  value={formData.website}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* WhatsApp */}
              <div className="col-span-1">
                <Label
                  htmlFor="whatsapp"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  WhatsApp
                </Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="text"
                  placeholder="Enter WhatsApp number"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* Facebook */}
              <div className="col-span-1">
                <Label
                  htmlFor="facebook"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  name="facebook"
                  type="url"
                  placeholder="Enter Facebook profile URL"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* Instagram */}
              <div className="col-span-1">
                <Label
                  htmlFor="instagram"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  name="instagram"
                  type="url"
                  placeholder="Enter Instagram profile URL"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* YouTube */}
              <div className="col-span-1">
                <Label
                  htmlFor="youtube"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  YouTube
                </Label>
                <Input
                  id="youtube"
                  name="youtube"
                  type="url"
                  placeholder="Enter YouTube channel URL"
                  value={formData.youtube}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* LinkedIn */}
              <div className="col-span-1">
                <Label
                  htmlFor="linkedin"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  placeholder="Enter LinkedIn profile URL"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* Google Reviews */}
              <div className="col-span-1">
                <Label
                  htmlFor="google_reviews"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Google Reviews
                </Label>
                <Input
                  id="google_reviews"
                  name="google_reviews"
                  type="text"
                  placeholder="Enter Google Reviews link"
                  value={formData.google_reviews}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* UPI */}
              <div className="col-span-1">
                <Label
                  htmlFor="upi"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  UPI
                </Label>
                <Input
                  id="upi"
                  name="upi"
                  type="text"
                  placeholder="Enter UPI link"
                  value={formData.upi}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* Maps */}
              <div className="col-span-1">
                <Label
                  htmlFor="maps"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Maps
                </Label>
                <Input
                  id="maps"
                  name="maps"
                  type="url"
                  placeholder="Enter Google Maps link"
                  value={formData.maps}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* Background Image Select */}
              <div className="col-span-1">
                <Label
                  htmlFor="background_image"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Background Image
                </Label>
                {themesLoading ? (
                  <Skeleton className="w-full h-10 rounded-md mt-1" />
                ) : themesError ? (
                  <p className="text-red-500 mt-1">{themesError}</p>
                ) : (
                  <Select
                    value={formData.background_image}
                    onValueChange={(value) =>
                      handleSelectChange(value, "background_image")
                    }
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select background image" />
                    </SelectTrigger>
                    <SelectContent>
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
              {/* <div className="col-span-1">
                <Label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Avatar URL
                </Label>
                <Input
                  id="avatar"
                  name="avatar"
                  type="url"
                  placeholder="Enter avatar image URL"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div> */}

              {/* Drive Link */}
              <div className="col-span-1">
                <Label
                  htmlFor="drive_link"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Drive Link
                </Label>
                <Input
                  id="drive_link"
                  name="drive_link"
                  type="url"
                  placeholder="Enter Google Drive link"
                  value={formData.drive_link}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* Submit Button */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center sm:justify-end">
                <Button
                  type="submit"
                  className="mt-4 w-full mb-8 sm:mb-0 flex items-center space-x-2"
                  disabled={themesLoading || themesError}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add User</span>
                </Button>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddUser;

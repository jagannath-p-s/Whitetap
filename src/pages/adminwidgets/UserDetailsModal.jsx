// src/pages/adminwidgets/UserDetailsModal.jsx

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Import ShadCN's Dialog components
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import supabase from "../../supabase";
import { CheckCircle, XCircle } from "lucide-react"; // Added icons

function UserDetailsModal({ isOpen, setIsOpen, user, onUserVerified }) {
  const handleVerifyUser = async () => {
    try {
      const { error } = await supabase
        .from("social_media_data")
        .update({ is_verified: true })
        .eq("id", user.id);

      if (error) {
        console.error("Error verifying user:", error);
        alert("An error occurred while verifying the user. Please try again.");
      } else {
        onUserVerified(user); // Notify that user is verified
        setIsOpen(false); // Close the modal
      }
    } catch (err) {
      console.error("Error updating user:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg w-full p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">User Details</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Review the details of the user below. Click "Verify User" to approve their account.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2 text-sm sm:text-base">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Designation:</strong> {user.designation || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone || "N/A"}
          </p>
          <p>
            <strong>Sign-Up Date:</strong>{" "}
            {format(new Date(user.created_at), "PPP p")}
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6 sm:mt-8">
        
          <Button
            variant="default"
            className="w-full  flex items-center space-x-2"
            onClick={handleVerifyUser}
            aria-label="Verify User"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Verify User</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UserDetailsModal;

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

function UserDetailsModal({ isOpen, setIsOpen, user, onUserVerified }) {
  const handleVerifyUser = async () => {
    try {
      const { error } = await supabase
        .from("social_media_data")
        .update({ is_verified: true })
        .eq("id", user.id);

      if (error) {
        console.error("Error verifying user:", error);
      } else {
        onUserVerified(user); // Notify that user is verified
        setIsOpen(false); // Close the modal
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full sm:w-4/5 lg:max-w-lg mx-auto"> {/* Responsive width */}
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">User Details</DialogTitle> {/* Responsive text size */}
          <DialogDescription className="text-sm sm:text-base">
            Review the details of the user below. Click "Verify User" to approve their account.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2 text-sm sm:text-base"> {/* Responsive text size */}
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Designation:</strong> {user.designation}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Sign-Up Date:</strong> {format(new Date(user.created_at), "PPP p")}</p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6 sm:mt-8">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button className="ml-0 sm:ml-4 w-full sm:w-auto" onClick={handleVerifyUser}>
            Verify User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UserDetailsModal;

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

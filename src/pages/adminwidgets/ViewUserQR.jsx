// src/pages/adminwidgets/ViewUserQR.jsx

import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode.react";
import supabase from "../../supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Assuming ShadCN Dialog is available
import { Button } from "@/components/ui/button"; // Assuming ShadCN Button is available
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

function ViewUserQR({ isOpen, setIsOpen, userId }) {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const baseURL = "https://www.thewhitetap.com/profile/";
  const fullURL = `${baseURL}${userId}`;
  const downloadRef = useRef(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!userId) return;

      setLoading(true);
      setUserName(""); // Reset userName when userId changes

      try {
        const { data, error } = await supabase
          .from("social_media_data")
          .select("name")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching user name:", error);
          setUserName("Unknown User");
        } else {
          setUserName(data.name || "Unnamed User");
        }
      } catch (err) {
        console.error("An error occurred:", err);
        setUserName("Unknown User");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUserName();
    }
  }, [isOpen, userId]);

  const handleDownload = () => {
    if (downloadRef.current) {
      const canvas = downloadRef.current.querySelector("canvas");
      if (canvas) {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${userName}_QR.png`;
        link.click();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md w-full p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>
            {loading ? (
              <Skeleton className="w-32 h-6 rounded-md mb-2" />
            ) : (
              `${userName}'s QR Code`
            )}
          </DialogTitle>
          <DialogDescription>
            {loading ? (
              <Skeleton className="w-full h-4 rounded-md" />
            ) : (
              "Download or view the QR code below."
            )}
          </DialogDescription>
        </DialogHeader>

        {/* QR Code and Download Button */}
        <div className="flex flex-col items-center mt-4">
          {loading ? (
            <Skeleton className="w-64 h-64 rounded-md" />
          ) : (
            <div ref={downloadRef} className="mb-4">
              <QRCode value={fullURL} size={256} level="H" includeMargin={true} />
            </div>
          )}
          <Button
            onClick={handleDownload}
            className="flex items-center space-x-2"
            disabled={loading}
          >
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewUserQR;

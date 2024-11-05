import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode.react";
import supabase from "../../supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"; // Assuming ShadCN Dialog is available
import { Button } from "@/components/ui/button"; // Assuming ShadCN Button is available

function ViewUserQR({ isOpen, setIsOpen, userId }) {
  const [userName, setUserName] = useState("");
  const baseURL = "https://www.thewhitetap.com/profile/";
  const fullURL = `${baseURL}${userId}`;
  const downloadRef = useRef(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const { data, error } = await supabase
          .from("social_media_data")
          .select("name")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching user name:", error);
        } else {
          setUserName(data.name);
        }
      } catch (err) {
        console.error("An error occurred:", err);
      }
    };

    if (userId) {
      fetchUserName();
    }
  }, [userId]);

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
      <DialogContent >
        <DialogHeader>
          <DialogTitle>{userName}'s QR Code</DialogTitle>
          <DialogDescription>Download or view the QR code below</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4" ref={downloadRef}>
          <QRCode value={fullURL} size={256} level="H" />
        </div>
        <div className="flex justify-center  mt-4">
          <Button onClick={handleDownload} className="mr-2">
            Download QR Code
          </Button>
      
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewUserQR;

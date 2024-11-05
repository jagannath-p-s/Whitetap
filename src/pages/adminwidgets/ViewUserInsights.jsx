// src/pages/adminwidgets/ViewUserInsights.jsx
import React, { useState, useEffect, Fragment, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // ShadCN Dialog components
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"; // ShadCN Drawer components
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Skeleton } from "@/components/ui/skeleton"; // ShadCN Skeleton component
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table"; // ShadCN Table components
import { ScrollArea } from "@/components/ui/scroll-area"; // ShadCN ScrollArea component
import { useMediaQuery } from "@/hooks/use-media-query"; // Custom hook for media queries
import { X, Download } from "lucide-react"; // Lucide icons for close and download buttons

// Initialize Supabase Client
const supabaseUrl = "https://coxblzsivuqumwkcfaop.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNveGJsenNpdnVxdW13a2NmYW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQxMTM3MzIsImV4cCI6MjAyOTY4OTczMn0.j-G7Un4Glyp7SzjFhB6u8nd_R9n0ObCRl3ciYVRc7dM";
const supabaseClient = createClient(supabaseUrl, supabaseKey);

function ViewUserInsights({ isOpen, setIsOpen, userId }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");

  const isDesktop = useMediaQuery("(min-width: 768px)"); // Define breakpoint for responsiveness

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("social_media_data")
          .select("name")
          .eq("id", userId)
          .single();
        if (error) {
          setError("Error fetching user name");
        } else {
          setUserName(data.name);
        }
      } catch (err) {
        setError("An error occurred while fetching user name.");
      }
    };

    const fetchInsights = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("link_clicks")
          .select("link_type")
          .eq("social_media_data_id", userId);

        if (error) {
          setError("Error fetching insights");
        } else {
          const aggregatedData = data.reduce((acc, curr) => {
            const { link_type } = curr;
            if (acc[link_type]) {
              acc[link_type]++;
            } else {
              acc[link_type] = 1;
            }
            return acc;
          }, {});

          const insightsArray = Object.entries(aggregatedData).map(
            ([link_type, count]) => ({
              link_type,
              count,
            })
          );

          setInsights(insightsArray);
        }
      } catch (err) {
        setError("An error occurred while fetching insights.");
      } finally {
        setLoading(false);
      }
    };

    const linkClicksSubscription = supabaseClient
      .channel("realtime:public:link_clicks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "link_clicks",
          filter: `social_media_data_id=eq.${userId}`,
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            fetchInsights();
          }
        }
      )
      .subscribe();

    if (userId) {
      fetchUserName();
      fetchInsights();
    }

    return () => {
      linkClicksSubscription.unsubscribe();
    };
  }, [userId]);

  const handleDownload = () => {
    // Implement download functionality if needed
    // For example, exporting insights as CSV
  };

  const InsightsContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {/* Skeleton for Title */}
          <Skeleton className="w-1/3 h-6 rounded-full" />
          {/* Skeleton for Table */}
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="py-3 px-6">Link Type</th>
                  <th className="py-3 px-6">Taps</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="w-24 h-4 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-16 h-4 rounded" />
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (insights.length === 0) {
      return <div className="text-gray-500 ">No insights available.</div>;
    }

    return (
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Link Type</TableHead>
              <TableHead>Taps</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {insights.map((insight) => (
              <TableRow key={insight.link_type} className="bg-white border-b">
                <TableCell>{insight.link_type}</TableCell>
                <TableCell>{insight.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <>
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-2xl h-[80%]">
            <DialogHeader>
              <DialogTitle>{userName}'s Insights</DialogTitle>
              <DialogDescription>
                Overview of link taps and user engagement.
              </DialogDescription>
            </DialogHeader>
     
              <ScrollArea className="h-96 w-full rounded-md border">
                <InsightsContent />
              </ScrollArea>
 

          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
         
            <DrawerHeader>
              <DrawerTitle>{userName}'s Insights</DrawerTitle>
              <DrawerDescription>
                Overview of link taps and user engagement.
              </DrawerDescription>
            </DrawerHeader>
            <div className="mt-2">
            <ScrollArea className="h-[430px] rounded-md border p-2">
                <InsightsContent />
              </ScrollArea>
            </div>
            <div className="my-4 flex justify-center space-x-2">
        
              <Button
                variant=""
                onClick={() => setIsOpen(false)}
                className="w-[90%]"
              >
               
                <span>Close</span>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

export default ViewUserInsights;

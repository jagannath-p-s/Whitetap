import React, { useState, useEffect, useRef } from "react";
import supabase from "../../supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

function ViewUserInsights({ isOpen, setIsOpen, userId }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [isScrollable, setIsScrollable] = useState(false);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);

  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasReachedBottom(false);

      // Wait for content to render before checking scrollability
      const timer = setTimeout(() => {
        checkIfScrollable();
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen, insights]);

  const checkIfScrollable = () => {
    if (contentRef.current && scrollRef.current) {
      const scrollable = contentRef.current.scrollHeight > scrollRef.current.clientHeight;
      setIsScrollable(scrollable);
    }
  };

  const handleScroll = (e) => {
    if (!scrollRef.current || !isScrollable) return;

    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 10;

    // Disable automatic scrolling when user reaches the bottom
    if (isAtBottom) {
      setHasReachedBottom(true);
      scrollRef.current.style.overflow = 'hidden';
      setTimeout(() => {
        scrollRef.current.style.overflow = 'auto';
      }, 3000);
    } else {
      setHasReachedBottom(false);
      scrollRef.current.style.overflow = 'auto';
    }
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const { data, error } = await supabase
          .from("social_media_data")
          .select("name")
          .eq("id", userId)
          .single();
        if (error) throw error;
        setUserName(data.name);
      } catch (err) {
        setError("Could not fetch user information");
      }
    };

    const fetchInsights = async () => {
      try {
        const { data, error } = await supabase
          .from("link_clicks")
          .select("link_type")
          .eq("social_media_data_id", userId);

        if (error) throw error;

        const aggregatedData = data.reduce((acc, curr) => {
          acc[curr.link_type] = (acc[curr.link_type] || 0) + 1;
          return acc;
        }, {});

        const sortedInsights = Object.entries(aggregatedData)
          .map(([link_type, count]) => ({ link_type, count }))
          .sort((a, b) => b.count - a.count);

        setInsights(sortedInsights);
      } catch (err) {
        setError("Could not fetch insights data");
      } finally {
        setLoading(false);
      }
    };

    const linkClicksSubscription = supabase
      .channel("realtime:public:link_clicks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "link_clicks",
          filter: `social_media_data_id=eq.${userId}`,
        },
        () => fetchInsights()
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

  const InsightsContent = () => {
    if (loading) {
      return (
        <div className="space-y-4 p-4">
          <Skeleton className="w-32 h-8 rounded-md bg-gray-200" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/3">
                  <Skeleton className="w-24 h-4 bg-gray-200" />
                </TableHead>
                <TableHead>
                  <Skeleton className="w-16 h-4 bg-gray-200" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="w-40 h-4 bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-12 h-4 bg-gray-200" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="m-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      );
    }

    if (insights.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-gray-50 rounded-lg m-4">
          <div className="text-4xl">📊</div>
          <h3 className="text-lg font-semibold text-gray-700">No insights yet</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Link interactions will appear here once users start engaging with your Profile.
          </p>
        </div>
      );
    }


  const ContentWrapper = ({ children }) => (
    <div>
      <ScrollArea
        ref={scrollRef}
        className="h-[430px] rounded-md border"
        onScroll={handleScroll}
      >
        {children}
        {!isDesktop && isScrollable && !hasReachedBottom && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center py-2 bg-gradient-to-t from-white to-transparent">
            <div className="flex items-center space-x-2 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 animate-bounce"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Scroll down for more</span>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );

  return (
    <div ref={contentRef} className="p-4">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2">
            <TableHead className="font-semibold text-gray-900">Link Type</TableHead>
            <TableHead className="font-semibold text-gray-900 text-right">Taps</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {insights.map((insight, index) => (
            <TableRow 
              key={insight.link_type}
              className="transition-colors duration-150 hover:bg-gray-50 cursor-default"
            >
              <TableCell className="font-medium">
                {insight.link_type}
              </TableCell>
              <TableCell className="text-right">{insight.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};



const ContentWrapper = ({ children }) => {
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    if (!isDesktop && isScrollable && !hasReachedBottom) {
      const timer = setTimeout(() => {
        setShowScrollHint(false);
      }, 2001);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isDesktop, isScrollable, hasReachedBottom]);

  return (
    <div>
      <ScrollArea
        ref={scrollRef}
        className="h-[430px] rounded-md border"
        onScroll={handleScroll}
      >
        {children}
        {!isDesktop && isScrollable && !hasReachedBottom && showScrollHint && (
          <div className="absolute  bottom-0 left-0 right-0 flex justify-center py-2 bg-gradient-to-t from-white to-transparent">
            <div className="flex  items-center space-x-2 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 animate-bounce"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

  return (
    <>
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">{userName}'s Insights</DialogTitle>
              <DialogDescription className="text-gray-500">
                Overview of link taps and user engagement.
              </DialogDescription>
            </DialogHeader>
            <ContentWrapper>
              <InsightsContent />
            </ContentWrapper>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="font-semibold">{userName}'s Insights</DrawerTitle>
              <DrawerDescription className="text-gray-500">
                Overview of link taps and user engagement.
              </DrawerDescription>
            </DrawerHeader>
            <ContentWrapper>
              <InsightsContent />
            </ContentWrapper>
            <div className="p-4">
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full hover:bg-gray-100"
              >
                Close
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

export default ViewUserInsights;
// src/pages/AdminHome.jsx
import React, { useState, useEffect, useMemo } from "react";
import supabase from "../supabase";
import AddUser from "./adminwidgets/AddUser";
import EditUser from "./adminwidgets/EditUser";
import ViewUserQR from "./adminwidgets/ViewUserQR";
import ViewUserInsights from "./adminwidgets/ViewUserInsights";
import UserDetailsModal from "./adminwidgets/UserDetailsModal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Edit, QrCode, BarChart, Trash2, CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format } from "date-fns";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter 
} from "@/components/ui/alert-dialog"; // Import AlertDialog components

function AdminHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [isViewQRModalOpen, setIsViewQRModalOpen] = useState(false);
  const [selectedUserIdForQR, setSelectedUserIdForQR] = useState(null);
  const [isViewUserInsightsOpen, setIsViewUserInsightsOpen] = useState(false);
  const [selectedUserIdForInsights, setSelectedUserIdForInsights] = useState(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [userToDelete, setUserToDelete] = useState(null); // State for deletion

  // Fetch users and set up real-time subscription
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from("social_media_data").select("*");
        if (error) {
          setError("Error fetching users");
        } else {
          setUsers(data);
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    const subscription = supabase
      .channel("realtime-social_media_data")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "social_media_data" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setUsers((prevUsers) => [...prevUsers, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setUsers((prevUsers) =>
              prevUsers.map((user) => (user.id === payload.new.id ? payload.new : user))
            );
          } else if (payload.eventType === "DELETE") {
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Derive filteredUsers and pendingUsers using useMemo
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFromDate = dateRange.from ? new Date(user.created_at) >= new Date(dateRange.from) : true;
      const matchesToDate = dateRange.to ? new Date(user.created_at) <= new Date(dateRange.to) : true;
      return user.is_verified && matchesSearch && matchesFromDate && matchesToDate;
    });
  }, [users, searchTerm, dateRange]);

  const pendingUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFromDate = dateRange.from ? new Date(user.created_at) >= new Date(dateRange.from) : true;
      const matchesToDate = dateRange.to ? new Date(user.created_at) <= new Date(dateRange.to) : true;
      return !user.is_verified && matchesSearch && matchesFromDate && matchesToDate;
    });
  }, [users, searchTerm, dateRange]);

  // Handle Search and Date Filter
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateRange]);

  const handleAddUser = async (newUser) => {
    try {
      const { error } = await supabase
        .from("social_media_data")
        .insert([newUser]);
      if (error) {
        setError("Error adding user");
      } else {
        setIsAddUserModalOpen(false);
      }
    } catch (err) {
      console.error("Error adding user:", err);
      setError("An unexpected error occurred while adding the user.");
    }
  };

  const handleEditUser = async (updatedUserData) => {
    try {
      const { error } = await supabase
        .from("social_media_data")
        .update(updatedUserData)
        .eq("id", selectedUserForEdit.id);
      if (error) {
        setError("Error updating user");
      } else {
        setIsEditUserModalOpen(false);
        setSelectedUserForEdit(null);
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError("An unexpected error occurred while updating the user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      // First, delete the link_clicks associated with the user
      const { error: linkClicksError } = await supabase
        .from("link_clicks")
        .delete()
        .eq("social_media_data_id", userId);
    
      if (linkClicksError) {
        console.error("Error deleting user link clicks:", linkClicksError);
        setError("Error deleting user's link clicks.");
        return; // Stop the deletion process if there's an error
      }
    
      // Then, delete the user
      const { error: userDeleteError } = await supabase
        .from("social_media_data")
        .delete()
        .eq("id", userId);
    
      if (userDeleteError) {
        setError("Error deleting user");
      } else {
        // The real-time subscription will handle removing the user from the state
        setUserToDelete(null);
      }
    } catch (err) {
      console.error("An error occurred during user deletion:", err);
      setError("An unexpected error occurred while deleting the user.");
    }
  };

  const handleViewQR = (userId) => {
    setSelectedUserIdForQR(userId);
    setIsViewQRModalOpen(true);
  };

  const handleViewDetails = (user) => {
    setSelectedUserForDetails(user);
    setIsUserDetailsModalOpen(true);
  };

  const handleViewInsights = (userId) => {
    setSelectedUserIdForInsights(userId);
    setIsViewUserInsightsOpen(true);
  };

  // Pagination Logic
  const filteredAndPaginatedUsers = useMemo(() => {
    return filteredUsers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-8">
      {/* Header with Title and Mode Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Admin Dashboard</h1>
        {/* You can add a ModeToggle component here if needed */}
      </div>

      {/* User Management Card */}
      <Card className="shadow-lg">
        <CardHeader>
          {/* You can place additional header content here if needed */}
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0 lg:space-x-4">
            <h1 className="text-xl font-semibold">User Management</h1>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full lg:w-auto">
              {/* Search Input */}
              <div className="relative w-full md:w-64">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <SearchIcon className="h-5 w-5" />
                </span>
              </div>

              {/* Date Range Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-auto justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      if (!range) {
                        setDateRange({ from: null, to: null });
                      } else if (!range.from || !range.to) {
                        setDateRange({ from: range.from || null, to: range.to || null });
                      } else {
                        setDateRange(range);
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              {/* Add User Button */}
              <Button
                variant="default"
                className="w-full md:w-auto flex items-center justify-center"
                onClick={() => setIsAddUserModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-md border">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-100">
                <TableRow >
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(itemsPerPage)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-6 w-[150px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[100px]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-24 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  filteredAndPaginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="flex items-center space-x-2">
                        <img
                          src={user.avatar || "/default-avatar.png"} // Provide a default avatar if none exists
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span>{user.name}</span>
                      </TableCell>
                      <TableCell>{user.designation}</TableCell>
                      <TableCell>
                        {format(new Date(user.created_at), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {/* Edit Button */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedUserForEdit(user);
                              setIsEditUserModalOpen(true);
                            }}
                            aria-label="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          {/* View QR Button */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewQR(user.id)}
                            aria-label="View QR"
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>

                          {/* View Insights Button */}
                          {/* <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewInsights(user.id)}
                            aria-label="View Insights"
                          >
                            <BarChart className="h-4 w-4" />
                          </Button> */}

                          {/* Delete Button */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setUserToDelete(user)}
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              {filteredUsers.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}{" "}
              to{" "}
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </p>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Users Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Pending User Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sign-Up Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(itemsPerPage)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-6 w-[150px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[200px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[100px]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-24 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  pendingUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {format(new Date(user.created_at), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleViewDetails(user)}
                        >
                          Verify
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Alert Dialog for Deletion Confirmation */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent className="max-w-lg mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{userToDelete?.name}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="px-4 py-2">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteUser(userToDelete.id);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modals */}
      <AddUser
        isOpen={isAddUserModalOpen}
        setIsOpen={setIsAddUserModalOpen}
        handleAddUser={handleAddUser}
      />

      {isEditUserModalOpen && (
        <EditUser
          isOpen={isEditUserModalOpen}
          setIsOpen={setIsEditUserModalOpen}
          handleEditUser={handleEditUser}
          selectedUserForEdit={selectedUserForEdit}
          setSelectedUserForEdit={setSelectedUserForEdit}
        />
      )}

      <ViewUserQR
        isOpen={isViewQRModalOpen}
        setIsOpen={setIsViewQRModalOpen}
        userId={selectedUserIdForQR}
      />

      {isUserDetailsModalOpen && selectedUserForDetails && (
        <UserDetailsModal
          isOpen={isUserDetailsModalOpen}
          setIsOpen={setIsUserDetailsModalOpen}
          user={selectedUserForDetails}
          onUserVerified={async () => {
            const updatedUser = {
              ...selectedUserForDetails,
              is_verified: true,
            };
            const { error } = await supabase
              .from("social_media_data")
              .update(updatedUser)
              .eq("id", selectedUserForDetails.id);
            
            if (error) {
              setError("Error verifying user");
              console.error("Error verifying user:", error);
            } else {
              setIsUserDetailsModalOpen(false);
            }
          }}
        />
      )}

      {isViewUserInsightsOpen && (
        <ViewUserInsights
          isOpen={isViewUserInsightsOpen}
          setIsOpen={setIsViewUserInsightsOpen}
          userId={selectedUserIdForInsights}
        />
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

export default AdminHome;

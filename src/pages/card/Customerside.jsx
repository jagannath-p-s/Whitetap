// src/pages/card/Customerside.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import BackgroundImageComponent from './BackgroundImageComponent';
import ProfileCardComponent from './ProfileCardComponent';
import SocialMediaComponent from './SocialMediaComponent';
import socialMediaUrls from './socialMediaUrls'; // Import socialMediaUrls
import supabase from "../../supabase";

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative; /* Add this to make sure BackgroundImageComponent covers the entire container */
`;

function Customerside() {
  const { userId } = useParams(); // Get the userId from the URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from("social_media_data")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          setError("Error fetching user data");
        } else if (data) {
          setUserData(data);
        } else {
          setError("No user data found");
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  return (
    <div>
      <CenteredContainer>
        <BackgroundImageComponent src={userData.background_image || socialMediaUrls.backgroundImage} />
        <ProfileCardComponent userData={userData} />
        <SocialMediaComponent userData={userData} />
      </CenteredContainer>
    </div>
  );
}

export default Customerside;

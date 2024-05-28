import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BackgroundImageComponent from './BackgroundImageComponent';
import ProfileCardComponent from './ProfileCardComponent';
import SocialMediaComponent from './SocialMediaComponent';
import supabase from '../../supabase'; // Import the supabase client

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative; /* Add this to make sure BackgroundImageComponent covers the entire container */
`;

function Customerside() {
  const [socialMediaUrls, setSocialMediaUrls] = useState(null);

  useEffect(() => {
    const fetchSocialMediaUserData = async () => {
      try {
        const url = window.location.pathname.replace(/\/+$/, ''); // Remove trailing slashes
        const segments = url.split('/');
        const profileIndex = segments.indexOf('profile');
        if (profileIndex !== -1 && profileIndex < segments.length - 1) {
          const userId = segments[profileIndex + 1];
          const { data, error } = await supabase
            .from('social_media_data')
            .select('*')
            .eq('id', userId)
            .single();
          if (error) {
            throw error;
          }
          if (data) {
            setSocialMediaUrls({
              avatar: data.avatar,
              name: data.name,
              designation: data.designation,
              phone: data.phone ? `tel:${data.phone}` : '',
              whatsapp: data.whatsapp,
              website: data.website,
              facebook: data.facebook,
              instagram: data.instagram,
              youtube: data.youtube,
              linkedin: data.linkedin,
              googleReviews: data.google_reviews,
              paytm: data.paytm,
              email: data.email ? `mailto:${data.email}` : '',
              maps: data.maps,
              backgroundImage: data.background_image,
              drive: data.drive_link
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchSocialMediaUserData();
  }, []); // Run once on component mount

  return (
    <div>
      <CenteredContainer>
        {socialMediaUrls && (
          <>
            <BackgroundImageComponent src={socialMediaUrls.backgroundImage} /> {/* Pass the background image URL */}
            <ProfileCardComponent />
            <SocialMediaComponent />
          </>
        )}
      </CenteredContainer>
    </div>
  );
}

export default Customerside;

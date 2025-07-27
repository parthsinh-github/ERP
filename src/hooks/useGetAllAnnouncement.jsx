import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
import { setAllAnnouncement } from '@/redux/announcementSlice';
import { ANNOUNCEMENT_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';

const useGetAllAnnouncement = () => {
  const dispatch = useDispatch();
  const {role , id} = useParams();
  const { searchedQuery } = useSelector(state => state.announcement);

  useEffect(() => {
    const fetchAllAnnouncements = async () => {
   try {
  const response = await fetch(
    `http://localhost:3000/api/v1/announcement/${id}`,
    {
      method: 'GET',
      credentials: 'include', // equivalent to axios' withCredentials: true
    }
  );

  const data = await response.json();
  

  if (Array.isArray(data)) {
    dispatch(setAllAnnouncement(data));
  } else {
    console.error("❌ Unexpected response format:", data);
  }
   }
 catch (error) {
        console.error("❌ Axios error occurred:", error.message);
        if (error.response) {
          console.error("❌ Server responded with:", error.response.data);
        } else if (error.request) {
          console.error("❌ Request made but no response received:", error.request);
        } else {
          console.error("❌ Error setting up request:", error.message);
        }
      }
    };

    fetchAllAnnouncements();
  }, [dispatch, searchedQuery]);
};

export default useGetAllAnnouncement;

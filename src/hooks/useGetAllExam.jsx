import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import axios from 'axios';
import { setAllExam } from '@/redux/examSlice';
import { EXAM_API_END_POINT } from '@/utils/constant';

const useGetAllExam = () => {
  const dispatch = useDispatch();

 useEffect(() => {
  const fetchAllExams = async () => {
    try {
      const response = await fetch(`${EXAM_API_END_POINT}/allExam`, {
        method: 'GET',
        credentials: 'include', // Ensures cookies/session tokens are sent
      });

      const data = await response.json();
      

      if (Array.isArray(data.data)) {
        dispatch(setAllExam(data.data));
      } else {
        console.error("❌ Unexpected response format:", data);
      }
    } catch (error) {
      console.error("❌ Fetch error occurred:", error.message);
    }
  };

  fetchAllExams();
}, [dispatch]);

};

export default useGetAllExam;

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllLeave } from '@/redux/leaveSlice';
import { LEAVE_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';

const useGetAllLeave = () => {
  
    const { role, id } = useParams();

  const dispatch = useDispatch();
  const { searchedQuery } = useSelector(state => state.leave);

  // ✅ Fetch logic wrapped in reusable function
  const fetchAllLeaves = async () => {
    try {
      const response = await fetch(`${LEAVE_API_END_POINT}/${id}`, {
        method: 'GET',
        credentials: 'include', // needed for cookie-based auth
      });

      const data = await response.json();

      if (Array.isArray(data.data)) {
        dispatch(setAllLeave(data.data));
      } else {
        console.error("❌ Unexpected response format:", data);
      }
    } catch (error) {
      console.error("❌ Fetch error occurred:", error.message);
    }
  };

  // ✅ Auto-fetch on mount or when searchedQuery changes
  useEffect(() => {
    fetchAllLeaves();
  }, [dispatch, searchedQuery]);

  // ✅ Return refresh function so it can be used manually
  return fetchAllLeaves;
};

export default useGetAllLeave;

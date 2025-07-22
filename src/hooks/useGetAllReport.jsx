import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAllReports } from '@/redux/reportSlice'; // ✅ ensure correct named export (plural)
import { REPORT_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';

const useGetAllReport = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
  const response = await fetch(`${REPORT_API_END_POINT}/${id}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
       
        

        if (Array.isArray(data.data)) {
          dispatch(setAllReports(data.data)); // ✅ corrected function name
        } else {
          console.error("❌ Unexpected response format:", data);
        }
      } catch (error) {
        console.error("❌ Fetch error occurred:", error.message);
      }
    };

    if (id) {
      fetchAllReports();
    }
  }, [dispatch, id]); // ✅ added `id` as dependency
};

export default useGetAllReport;

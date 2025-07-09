import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setAllReport } from '@/redux/ReportSlice';
import { REPORT_API_END_POINT } from '@/utils/constant';

const useGetAllReport = () => {
  const dispatch = useDispatch();

   useEffect(() => {
  const fetchAllReports = async () => {
    try {
      const response = await fetch(`${REPORT_API_END_POINT}/all`, {
        method: 'GET',
        credentials: 'include', // keep for cookie/session-based auth
      });

      const data = await response.json();

      if (Array.isArray(data.data)) {
        dispatch(setAllReport(data.data));
      } else {
        console.error("❌ Unexpected response format:", data);
      }
    } catch (error) {
      console.error("❌ Fetch error occurred:", error.message);
    }
  };

  fetchAllReports();
}, [dispatch]);
};

export default useGetAllReport;

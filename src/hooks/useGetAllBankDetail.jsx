// hooks/useGetAllAcademicDetails.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllBankDetails } from '../redux/bankDetailSlice'; // ✅ fixed path
import { useParams } from 'react-router-dom';

import { BANK_API_END_POINT } from '@/utils/constant';

const useGetAllBankDetail = () => {
  const dispatch = useDispatch();
  const { id, role } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${BANK_API_END_POINT}/${id}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (Array.isArray(data?.data)) {
          dispatch(setAllBankDetails(data.data));
        } else {
          dispatch(setAllBankDetails([]));
          console.warn("No bank details found.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (id) fetchDetails();
  }, [dispatch, id]);
};

export default useGetAllBankDetail;

// hooks/useGetAllAcademicDetails.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllAcademicDetails } from '../redux/acadamicDetailSlice.js'; // ✅ fixed path
import { useParams } from 'react-router-dom';

import { ACADAMIC_API_END_POINT } from '@/utils/constant';

const useGetAllAcademicDetails = () => {
  const dispatch = useDispatch();
  const { id, role } = useParams();
  const { searchedQuery } = useSelector(state => state.academicDetail || {});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${ACADAMIC_API_END_POINT}/${id}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (Array.isArray(data?.data)) {
          dispatch(setAllAcademicDetails(data.data));
        } else {
          dispatch(setAllAcademicDetails([]));
          console.warn("No academic details found.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (id) fetchDetails();
  }, [dispatch, id, searchedQuery]);
};

export default useGetAllAcademicDetails;

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllIdCard } from '@/redux/idcardSlice';  // Action to store data
import { ID_CARD_API_END_POINT } from '@/utils/constant';  // Make sure it's defined
import { useParams } from 'react-router-dom';

const useGetAllIdCard = () => {
  const {role , id } = useParams();
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchAllIdCards = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/id-card/all/${id}`, {
          method: 'GET',
          credentials: 'include', // include cookies/session if used
        });

        const data = await response.json();
        

        if (Array.isArray(data?.data)) {
  dispatch(setAllIdCard(data.data));
} else {
  dispatch(setAllIdCard([])); // ✅ fallback to empty array
}

      } catch (error) {
        console.error("❌ Failed to fetch ID cards:", error.message);
      }
    };

    fetchAllIdCards();
  }, [dispatch]);
};

export default useGetAllIdCard;

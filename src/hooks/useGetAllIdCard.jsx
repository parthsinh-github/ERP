import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAllIdCard } from '@/redux/idcardSlice';  // Action to store data
import { ID_CARD_API_END_POINT } from '@/utils/constant';  // Make sure it's defined

const useGetAllIdCard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllIdCards = async () => {
      try {
        const response = await fetch(`${ID_CARD_API_END_POINT}/all`, {
          method: 'GET',
          credentials: 'include', // include cookies/session if used
        });

        const data = await response.json();

        if (Array.isArray(data?.data)) {
          dispatch(setAllIdCard(data.data));
        } else {
          console.error("❌ Unexpected response format:", data);
        }
      } catch (error) {
        console.error("❌ Failed to fetch ID cards:", error.message);
      }
    };

    fetchAllIdCards();
  }, [dispatch]);
};

export default useGetAllIdCard;

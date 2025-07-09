import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
import { setAllUser } from '@/redux/userSlice';
import { USER_API_END_POINT } from '@/utils/constant';

const useGetAllUsers = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector(state => state.user);

 useEffect(() => {
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${USER_API_END_POINT}/all`, {
        method: 'GET',
        credentials: 'include', // same as withCredentials: true in axios
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.users)) {
        dispatch(setAllUser(data.users));
      } else {
        console.error("❌ Unexpected response format:", data);
      }
    } catch (error) {
      console.error("❌ Fetch error occurred:", error.message);
    }
  };

  fetchAllUsers();
}, [dispatch, searchedQuery]);

};

export default useGetAllUsers;

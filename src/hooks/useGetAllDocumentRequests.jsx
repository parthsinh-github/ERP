// hooks/useGetAllDocumentRequests.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAllRequests, setLoading, setError } from '../redux/documentSlice.js';
import { useParams } from 'react-router-dom';
import { DOCUMENT_API_END_POINT } from '@/utils/constant';


const useGetAllDocumentRequests = () => {
  const dispatch = useDispatch();
      
  const { role, id } = useParams();
      
          console.log("User : ",role);
          

  useEffect(() => {
    const fetchRequests = async () => {
  
      try {
        dispatch(setLoading());
        const res = await fetch(`${DOCUMENT_API_END_POINT}/${id}`, {
          credentials: 'include', // in case cookies or token
        });
        const data = await res.json();
          console.log("Data : ",data);
          
        

        if (data.success) {
          dispatch(setAllRequests(data.data));
        } else {
          dispatch(setError(data.error || 'Failed to fetch requests'));
        }
        
      } catch (err) {
        console.error(err);
        dispatch(setError('Server error while fetching requests'));
      }
    };

    fetchRequests();
  }, [dispatch]);
};

export default useGetAllDocumentRequests;

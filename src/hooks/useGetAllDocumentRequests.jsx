// hooks/useGetAllDocumentRequests.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAllRequests, setLoading, setError } from '../redux/documentSlice.js';
import { useParams } from 'react-router-dom';

const useGetAllDocumentRequests = () => {
  const dispatch = useDispatch();
      
  const { role, id } = useParams();
      
        

  useEffect(() => {
    const fetchRequests = async () => {
  
      try {
        dispatch(setLoading());
        const res = await fetch(`http://localhost:3000/api/v1/document/${id}`, {
          credentials: 'include', // in case cookies or token
        });
        const data = await res.json();
        
        

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

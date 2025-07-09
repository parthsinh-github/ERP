import { useState, useEffect } from 'react';
import { getAdminData } from '../api/admin'; // Make sure this import is correct

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdminData(); // Make sure this function is working
        setAdminData(data);
        console.log('Fetched Admin Data:', data); // Debugging line
      } catch (error) {
        setError('Failed to load admin data');
        console.error('Error fetching admin data:', error); // Debugging line
      }
    };

    fetchData();
  }, []);

  // Debugging line
  console.log('AdminData:', adminData);
  console.log('Error:', error);

  // If error occurs
  if (error) {
    return <div>{error}</div>;
  }

  // If data is not loaded yet
  if (!adminData) {
    return <div>Loading...</div>;
  }

  // If data is loaded
  return (
    <div>

    <div>
      <h1>Admin Dashboard</h1>
      <pre>{JSON.stringify(adminData, null, 2)}</pre>
    </div>
    <div>
      
    </div>
    </div>
  );
};

export default AdminDashboard;

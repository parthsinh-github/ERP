const API_URL = 'http://localhost:5000/api/faculty';  // Your backend API URL

// Function to fetch faculty data
export const getFacultyData = async () => {
  try {
    const response = await fetch(`${API_URL}/data`, {  // Replace '/data' with your specific route
      method: 'GET',
      credentials: 'include',  // if you are using cookies for authentication
    });
    
    if (!response.ok) {
      throw new Error('Error fetching faculty data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

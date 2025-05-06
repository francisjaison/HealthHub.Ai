import { useAuth } from '@/contexts/AuthContext'; // Assuming useAuth provides the token

// Base URL for your API (replace with actual backend URL)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper function to make authenticated API requests
const fetchAuthenticated = async (url: string, token: string | null, options: RequestInit = {}) => {
  if (!token) {
    throw new Error('Authentication token not available.');
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Attempt to parse error details from backend if available
    let errorDetail = `HTTP error! status: ${response.status}`;
    try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorDetail;
    } catch (e) { /* Ignore if response body is not JSON */ }
    throw new Error(errorDetail);
  }
  return response.json();
};

// --- API Functions --- 

// Fetch data for Summary Cards
export const fetchDashboardSummary = async (token: string | null) => {
  // TODO: Replace with actual endpoint call that returns trend data
  // Example endpoint: GET /dashboard/summary?includeTrend=true
  // await fetchAuthenticated('/dashboard/summary?includeTrend=true', token);
  
  console.log("Simulating fetchDashboardSummary with trend data");
  await new Promise(resolve => setTimeout(resolve, 800)); 
  
  // Example trend data (e.g., last 7 entries)
  const heartRateTrend = [
    { value: 70 }, { value: 72 }, { value: 71 }, { value: 75 }, 
    { value: 73 }, { value: 76 }, { value: 72 }
  ];
  const stepsTrend = [
    { value: 6500 }, { value: 8200 }, { value: 7300 }, { value: 9100 }, 
    { value: 8700 }, { value: 10200 }, { value: 8756 }
  ];
  const caloriesTrend = [
     { value: 1800 }, { value: 2100 }, { value: 1950 }, { value: 2300 }, 
     { value: 2250 }, { value: 2500 }, { value: 1925 }
  ];

  return {
    heartRate: { value: 72, change: 3, unit: 'BPM', trendData: heartRateTrend },
    steps: { value: 8756, change: 12, unit: '' , trendData: stepsTrend },
    calories: { value: 1925, change: -5, unit: '', trendData: caloriesTrend }, 
    temperature: { value: 98.6, change: 0, unit: '°F', trendData: [] }, // No trend for temp example
  };
};

// Fetch data for Heart Rate Chart
export const fetchHeartRateData = async (token: string | null, period: 'day' | 'week' | 'month') => {
  // TODO: Replace with actual endpoint call, passing the period
  // Example endpoint: GET /dashboard/charts/heart-rate?period={period}
  // await fetchAuthenticated(`/dashboard/charts/heart-rate?period=${period}`, token);
  
  console.log(`Simulating fetchHeartRateData for period: ${period}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  // Return different mock data based on period for demonstration
  if (period === 'day') {
      return [{ name: '00:00', value: 68 }, { name: '06:00', value: 70 }, { name: '12:00', value: 75 }, { name: '18:00', value: 72 }, { name: '23:59', value: 69 }];
  } else if (period === 'month') {
      return [{ name: 'Week 1', value: 71 }, { name: 'Week 2', value: 74 }, { name: 'Week 3', value: 72 }, { name: 'Week 4', value: 75 }];
  } 
  // Default to week data
  return [
    { name: 'Mon', value: 72 }, { name: 'Tue', value: 75 }, { name: 'Wed', value: 70 }, 
    { name: 'Thu', value: 73 }, { name: 'Fri', value: 78 }, { name: 'Sat', value: 76 }, 
    { name: 'Sun', value: 74 }
  ];
};

// Fetch data for Activity Chart
export const fetchActivityData = async (token: string | null, period: 'day' | 'week' | 'month') => {
  // TODO: Replace with actual endpoint call, passing the period
  // Example endpoint: GET /dashboard/charts/activity?period={period}
  // await fetchAuthenticated(`/dashboard/charts/activity?period=${period}`, token);
  
  console.log(`Simulating fetchActivityData for period: ${period}`);
  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay
  // Return different mock data based on period
  if (period === 'day') {
      return [{ name: 'Morning', steps: 2500, calories: 500 }, { name: 'Afternoon', steps: 4000, calories: 800 }, { name: 'Evening', steps: 1500, calories: 400 }];
  } else if (period === 'month') {
      return [{ name: 'Week 1', steps: 45000, calories: 12000 }, { name: 'Week 2', steps: 52000, calories: 14000 }, { name: 'Week 3', steps: 48000, calories: 13000 }, { name: 'Week 4', steps: 55000, calories: 15000 }];
  }
  // Default to week data
  return [
    { name: 'Mon', steps: 6500, calories: 1800 }, { name: 'Tue', steps: 8200, calories: 2100 },
    { name: 'Wed', steps: 7300, calories: 1950 }, { name: 'Thu', steps: 9100, calories: 2300 },
    { name: 'Fri', steps: 8700, calories: 2250 }, { name: 'Sat', steps: 10200, calories: 2500 },
    { name: 'Sun', steps: 5800, calories: 1650 }
  ];
};

// Fetch Upcoming Appointments
export const fetchUpcomingAppointments = async (token: string | null) => {
  // TODO: Replace with actual endpoint call
  // Example endpoint: GET /appointments?status=scheduled&limit=3&sort=asc
  // await fetchAuthenticated('/appointments?status=scheduled&limit=3&sort=asc', token);
  
  console.log("Simulating fetchUpcomingAppointments");
  await new Promise(resolve => setTimeout(resolve, 900)); // Simulate network delay
  // Return mock data similar to previous structure but with potentially more details
  return [
    {
      id: 1,
      title: 'Cardiology Checkup',
      doctorName: 'Dr. Robert Johnson',
      dateTime: '2025-08-01T10:00:00Z', // Use ISO strings
      type: 'consultation',
      icon: 'Heart' // Or map type to icon later
    },
    {
      id: 2,
      title: 'Fitness Assessment',
      doctorName: 'Sarah Williams, PT',
      dateTime: '2025-08-05T14:30:00Z',
      type: 'examination',
      icon: 'Activity'
    },
    {
      id: 3,
      title: 'Annual Physical',
      doctorName: 'Dr. Emily Chen',
      dateTime: '2025-08-12T09:00:00Z',
      type: 'consultation',
      icon: 'LineChart' // Example icon mapping
    }
  ];
}; 
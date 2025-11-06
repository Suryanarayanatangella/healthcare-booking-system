// Registration Test Utility
// Use this to test registration functionality

export const testRegistration = async () => {
  const testData = {
    email: 'test' + Date.now() + '@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'password123',
    role: 'patient'
  };

  try {
    console.log('🧪 Testing registration with data:', testData);
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration successful:', result);
      return { success: true, data: result };
    } else {
      console.error('❌ Registration failed:', result);
      return { success: false, error: result };
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return { success: false, error: error.message };
  }
};

// Test function you can call from browser console
window.testRegistration = testRegistration;
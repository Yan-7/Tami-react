import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://sdbrfxiprfitnpcmwhmg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYnJmeGlwcmZpdG5wY213aG1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1NzAyMDYsImV4cCI6MjAxMzE0NjIwNn0.3sxMQWZf16N9uGoPzeKzP21colvfWJJ0g50ZIlh4HQk';
const supabase = createClient(supabaseUrl, supabaseKey)

const UserDetailsComponent = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('userDetails')
          .select('*');
        if (error) throw error;
        setUserDetails(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <div>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Password</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {userDetails.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>{user.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserDetailsComponent;

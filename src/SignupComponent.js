import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://sdbrfxiprfitnpcmwhmg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYnJmeGlwcmZpdG5wY213aG1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1NzAyMDYsImV4cCI6MjAxMzE0NjIwNn0.3sxMQWZf16N9uGoPzeKzP21colvfWJJ0g50ZIlh4HQk';
const supabase = createClient(supabaseUrl, supabaseKey);

const SignupComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    // Use supabase.auth.signUp method to create a new user
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Signup successful');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Signup</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default SignupComponent;

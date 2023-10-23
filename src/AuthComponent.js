import { createClient } from '@supabase/supabase-js'
import { useState } from 'react';

// Initialize Supabase client
const supabaseUrl = 'https://sdbrfxiprfitnpcmwhmg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYnJmeGlwcmZpdG5wY213aG1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1NzAyMDYsImV4cCI6MjAxMzE0NjIwNn0.3sxMQWZf16N9uGoPzeKzP21colvfWJJ0g50ZIlh4HQk';
const supabase = createClient(supabaseUrl, supabaseKey)

const AuthComponent = () => {
    console.log(supabase.auth);
  const [form, setForm] = useState('login');  // login or register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Login successful');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Registration successful');
  };

  return (
    <div>
      {form === 'login' ? (
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Register</button>
        </form>
      )}
      {message && <div>{message}</div>}
      <button onClick={() => setForm(form === 'login' ? 'register' : 'login')}>
        Switch to {form === 'login' ? 'Register' : 'Login'}
      </button>
    </div>
  );
};

export default AuthComponent;

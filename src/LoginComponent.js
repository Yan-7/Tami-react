import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'

// Initialize Supabase client
const supabaseUrl = 'https://qngmdybyrtcajqjohpnt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuZ21keWJ5cnRjYWpxam9ocG50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMjE2NzEsImV4cCI6MjAxMTg5NzY3MX0.Jd6gPs09nEaWIIqsmO4ysYYzaW7hgQtRSxJ4EYRsRoA'
const supabase = createClient(supabaseUrl, supabaseKey)

const LoginComponent = () => {
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const {user, error} = await supabase.auth.signIn({
            email: email,
            password: password,
        });
        if (error) {
            setMessage(error.message)
        } else {
            setMessage('login succesful')
        }
    };

    return (
        <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
        {message && <div>{message}</div>}
      </form>
    );
};

export default LoginComponent

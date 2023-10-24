import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://sdbrfxiprfitnpcmwhmg.supabase.co';
const supabaseKey = 'your-supabase-key-here';
const supabase = createClient(supabaseUrl, supabaseKey);

const InitiativesComponent = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [error, setError] = useState(null);

  // Fetch initiatives data on component mount
  useEffect(() => {
    const fetchInitiatives = async () => {
      let { data, error } = await supabase
        .from('initiatives')
        .select('*');
      if (error) {
        setError(error.message);
      } else {
        setInitiatives(data);
      }
    };
    fetchInitiatives();
  }, []);

  // Handler function to insert a new initiative
  const handleInsert = async (newInitiative) => {
    const { data, error } = await supabase
      .from('initiatives')
      .insert([newInitiative])
      .single();
    if (error) {
      setError(error.message);
    } else {
      setInitiatives([...initiatives, data]);
    }
  };

  // Handler function to delete an initiative
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('initiatives')
      .delete()
      .eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      setInitiatives(initiatives.filter(initiative => initiative.id !== id));
    }
  };

  return (
    <div>
      {error && <div>Error: {error}</div>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Initiative Name</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {initiatives.map(initiative => (
            <tr key={initiative.id}>
              <td>{initiative.id}</td>
              <td>{initiative.initative_name}</td>
              <td>{initiative.created_at}</td>
              <td>
                <button onClick={() => handleDelete(initiative.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Form to insert new initiative */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const newInitiative = {
          initative_name: e.target.initiativeName.value,
        };
        handleInsert(newInitiative);
      }}>
        <input name="initiativeName" placeholder="New Initiative Name" required />
        <button type="submit">Add Initiative</button>
      </form>
    </div>
  );
};

export default InitiativesComponent;

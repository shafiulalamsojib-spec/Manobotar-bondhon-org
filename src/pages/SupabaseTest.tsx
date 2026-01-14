import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export default function SupabaseTest() {
  const [status, setStatus] = useState('Checking connection...');

  useEffect(() => {
    const check = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        setStatus('Supabase connection failed ❌');
        console.error(error);
      } else {
        setStatus('Supabase connected successfully ✅');
      }
    };
    check();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Supabase Test</h2>
      <p>{status}</p>
    </div>
  );
}

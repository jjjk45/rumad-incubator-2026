import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovtfppauvbqxjbibqnqq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92dGZwcGF1dmJxeGpiaWJxbnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4Mzg0NzcsImV4cCI6MjA4ODQxNDQ3N30.wGmazqLMovpJr0aCWk0T11HpQ1ue3GoCgh6wfnvqbwQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});


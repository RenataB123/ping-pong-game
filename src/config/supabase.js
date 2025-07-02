// src/config/supabase.js
import { createClient } from '@supabase/supabase-js'

// Substitua pelas suas credenciais do Supabase
const supabaseUrl = 'https://sxohxyjnypyneozdzgzh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4b2h4eWpueXB5bmVvemR6Z3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NzY4MDgsImV4cCI6MjA2NzA1MjgwOH0.AwWlFX1xH0iSMdmz9g-U6nWmy35IB5GPmYUmTaVXVnk'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Exemplo de como deveria ficar (substitua pelos seus valores):
// const supabaseUrl = 'https://xyzcompany.supabase.co'
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
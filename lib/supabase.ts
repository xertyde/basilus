import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://scompnbumndmuohgqefp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjb21wbmJ1bW5kbXVvaGdxZWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMzM5MzYsImV4cCI6MjA2MzkwOTkzNn0.Dyx-d-yEI0yX4BhZlkBaAIiHykzguz6YMfbnV5-iewI'
)
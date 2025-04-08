-- Create a function to generate YouTube-like IDs
CREATE OR REPLACE FUNCTION generate_project_id()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  result TEXT := '';
  i INTEGER;
  timestamp_part TEXT;
  random_part TEXT := '';
  combined TEXT;
BEGIN
  -- Generate a random string of 11 characters
  FOR i IN 1..11 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql; 
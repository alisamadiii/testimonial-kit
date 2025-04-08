-- Add date_testimonials column to store JSON array of date counts
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS date_testimonials json DEFAULT '[]'::json;

-- Create function to update date testimonials
CREATE OR REPLACE FUNCTION update_date_testimonials()
RETURNS TRIGGER AS $$
DECLARE
  date_str text;
  current_stats json;
  date_exists boolean;
  i integer;
  temp_array json[];
BEGIN
  -- Only proceed if this is an actual INSERT operation
  IF TG_OP != 'INSERT' THEN
    RETURN NEW;
  END IF;

  -- Get the date string in YYYY-MM-DD format
  date_str := to_char(NEW.created_at, 'YYYY-MM-DD');
  
  -- Get current stats
  SELECT date_testimonials INTO current_stats
  FROM analytics
  WHERE project_id = NEW.project_id;
  
  -- Initialize if null
  IF current_stats IS NULL THEN
    current_stats := '[]'::json;
  END IF;

  -- Check if date exists in array and update it
  temp_array := ARRAY[]::json[];
  date_exists := false;
  FOR i IN 0..json_array_length(current_stats)-1 LOOP
    IF (current_stats->i->>'date') = date_str THEN
      -- Update existing date count
      temp_array := array_append(temp_array,
        json_build_object(
          'date', date_str,
          'count', (current_stats->i->>'count')::integer + 1
        )::json
      );
      date_exists := true;
    ELSE
      -- Keep other dates as is
      temp_array := array_append(temp_array,
        json_build_object(
          'date', current_stats->i->>'date',
          'count', (current_stats->i->>'count')::integer
        )::json
      );
    END IF;
  END LOOP;
  
  -- Add new date if it doesn't exist
  IF NOT date_exists THEN
    temp_array := array_append(temp_array,
      json_build_object(
        'date', date_str,
        'count', 1
      )::json
    );
  END IF;
  
  -- Update analytics with array converted to json
  UPDATE analytics
  SET date_testimonials = array_to_json(temp_array)
  WHERE project_id = NEW.project_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for date stats on insert only
DROP TRIGGER IF EXISTS testimonial_date_stats_insert ON testimonials;
CREATE TRIGGER testimonial_date_stats_insert
  AFTER INSERT ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_date_testimonials();

-- Initialize date stats for existing testimonials
WITH date_counts AS (
  SELECT 
    project_id,
    to_char(created_at, 'YYYY-MM-DD') as date,
    COUNT(*) as count
  FROM testimonials
  GROUP BY project_id, to_char(created_at, 'YYYY-MM-DD')
)
UPDATE analytics a
SET date_testimonials = (
  SELECT json_agg(
    json_build_object(
      'date', dc.date,
      'count', dc.count
    )
  )
  FROM date_counts dc
  WHERE dc.project_id = a.project_id
);
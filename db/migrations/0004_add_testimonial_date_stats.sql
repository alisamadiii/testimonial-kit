-- Add date_testimonials column to store JSON array of timestamps
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS date_testimonials json DEFAULT '[]'::json;

-- Create function to update date testimonials
CREATE OR REPLACE FUNCTION update_date_testimonials()
RETURNS TRIGGER AS $$
DECLARE
  current_stats json;
BEGIN
  -- Only proceed if this is an actual INSERT operation
  IF TG_OP != 'INSERT' THEN
    RETURN NEW;
  END IF;

  -- Get current stats
  SELECT date_testimonials INTO current_stats
  FROM analytics
  WHERE project_id = NEW.project_id;
  
  -- Initialize if null
  IF current_stats IS NULL THEN
    current_stats := '[]'::json;
  END IF;

  -- Add new timestamp to array
  UPDATE analytics
  SET date_testimonials = (
    SELECT json_agg(t)
    FROM (
      SELECT DISTINCT unnest(array_append(ARRAY(SELECT json_array_elements_text(current_stats)), NEW.created_at::text)) as t
    ) as unique_timestamps
  )
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
UPDATE analytics a
SET date_testimonials = (
  SELECT json_agg(created_at::text)
  FROM (
    SELECT DISTINCT created_at
    FROM testimonials t
    WHERE t.project_id = a.project_id
  ) as unique_timestamps
);
-- Create a function to update the testimonial count
CREATE OR REPLACE FUNCTION update_testimonial_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Insert analytics record if it doesn't exist
    INSERT INTO analytics (project_id, total_testimonials, total_views)
    VALUES (NEW.project_id, 1, 0)
    ON CONFLICT (project_id) DO UPDATE
    SET total_testimonials = analytics.total_testimonials + 1;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE analytics 
    SET total_testimonials = total_testimonials - 1
    WHERE project_id = OLD.project_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for insert and delete
DROP TRIGGER IF EXISTS testimonial_count_insert ON testimonials;
CREATE TRIGGER testimonial_count_insert
  AFTER INSERT ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_testimonial_count();

DROP TRIGGER IF EXISTS testimonial_count_delete ON testimonials;
CREATE TRIGGER testimonial_count_delete
  AFTER DELETE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_testimonial_count();

-- Initialize analytics records for all projects that have testimonials
INSERT INTO analytics (project_id, total_testimonials, total_views)
SELECT DISTINCT project_id, COUNT(*), 0
FROM testimonials
GROUP BY project_id
ON CONFLICT (project_id) DO UPDATE
SET total_testimonials = EXCLUDED.total_testimonials; 
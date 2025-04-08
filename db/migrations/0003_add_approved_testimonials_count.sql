-- Add total_testimonials_approved column
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS total_testimonials_approved integer DEFAULT 0;

-- Update the trigger function to handle approved testimonials
CREATE OR REPLACE FUNCTION update_testimonial_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Insert analytics record if it doesn't exist
    INSERT INTO analytics (project_id, total_testimonials, total_testimonials_approved, total_views)
    VALUES (
      NEW.project_id, 
      1, 
      CASE WHEN NEW.status = 'approved' THEN 1 ELSE 0 END,
      0
    )
    ON CONFLICT (project_id) DO UPDATE
    SET 
      total_testimonials = analytics.total_testimonials + 1,
      total_testimonials_approved = analytics.total_testimonials_approved + 
        CASE WHEN NEW.status = 'approved' THEN 1 ELSE 0 END;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE analytics 
    SET 
      total_testimonials = total_testimonials - 1,
      total_testimonials_approved = total_testimonials_approved - 
        CASE WHEN OLD.status = 'approved' THEN 1 ELSE 0 END
    WHERE project_id = OLD.project_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status changes
    IF OLD.status != NEW.status THEN
      UPDATE analytics 
      SET total_testimonials_approved = total_testimonials_approved + 
        CASE 
          WHEN NEW.status = 'approved' THEN 1 
          WHEN OLD.status = 'approved' THEN -1 
          ELSE 0 
        END
      WHERE project_id = NEW.project_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updates
DROP TRIGGER IF EXISTS testimonial_count_update ON testimonials;
CREATE TRIGGER testimonial_count_update
  AFTER UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_testimonial_count();

-- Initialize approved counts for existing testimonials
UPDATE analytics a
SET total_testimonials_approved = (
  SELECT COUNT(*)
  FROM testimonials t
  WHERE t.project_id = a.project_id AND t.status = 'approved'
); 
-- Add tsvector column for full-text search on Proof
ALTER TABLE "Proof" ADD COLUMN "searchVector" tsvector;

-- Create GIN index for fast full-text search queries
CREATE INDEX "Proof_searchVector_idx" ON "Proof" USING GIN ("searchVector");

-- Create trigger function to automatically update searchVector
CREATE OR REPLACE FUNCTION "Proof_searchVector_update"() RETURNS trigger AS $$
BEGIN
  NEW."searchVector" := to_tsvector('english', coalesce(NEW.title, '') || ' ' || coalesce(NEW.description, '') || ' ' || coalesce(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to Proof table
CREATE TRIGGER "Proof_searchVector_trigger" BEFORE INSERT OR UPDATE ON "Proof"
FOR EACH ROW EXECUTE FUNCTION "Proof_searchVector_update()";

-- Populate searchVector for existing rows
UPDATE "Proof" SET "searchVector" = to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, ''));

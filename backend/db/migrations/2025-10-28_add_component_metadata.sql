-- Add new metadata columns to components table
-- Safe to run multiple times with IF NOT EXISTS checks

-- Model: free-text identifier like "5600X", "RTX 3080"
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'components' AND column_name = 'model'
    ) THEN
        ALTER TABLE components ADD COLUMN model VARCHAR(255);
    END IF;
END$$;

-- Speed: generic numeric speed metric (e.g., RAM MHz, GPU clock)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'components' AND column_name = 'speed'
    ) THEN
        ALTER TABLE components ADD COLUMN speed INTEGER;
    END IF;
END$$;

-- Description: human-friendly description, up to 2048 chars
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'components' AND column_name = 'description'
    ) THEN
        ALTER TABLE components ADD COLUMN description VARCHAR(2048);
    END IF;
END$$;

-- Verification query (copy-paste to psql)
-- SELECT column_name, data_type, character_maximum_length
-- FROM information_schema.columns
-- WHERE table_name='components'
--   AND column_name IN ('model','speed','description')
-- ORDER BY column_name;
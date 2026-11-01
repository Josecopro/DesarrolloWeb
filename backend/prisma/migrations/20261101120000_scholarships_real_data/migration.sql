-- Las 4 becas de demostración (con videos) se reemplazan por datos reales; el seed vuelve a llenar la tabla.
DELETE FROM "scholarships";

-- AlterEnum
BEGIN;
CREATE TYPE "ScholarshipType_new" AS ENUM ('government', 'credit', 'partnership', 'university');
ALTER TABLE "scholarships" ALTER COLUMN "type" TYPE "ScholarshipType_new" USING ("type"::text::"ScholarshipType_new");
ALTER TYPE "ScholarshipType" RENAME TO "ScholarshipType_old";
ALTER TYPE "ScholarshipType_new" RENAME TO "ScholarshipType";
DROP TYPE "ScholarshipType_old";
COMMIT;

-- AlterTable
ALTER TABLE "scholarships" DROP COLUMN "description",
DROP COLUMN "institution",
DROP COLUMN "video_url",
ADD COLUMN     "coverage" VARCHAR(600) NOT NULL,
ADD COLUMN     "deadline" DATE,
ADD COLUMN     "level" TEXT[],
ADD COLUMN     "note" VARCHAR(400),
ADD COLUMN     "provider" VARCHAR(160) NOT NULL,
ADD COLUMN     "requirements" TEXT[],
ADD COLUMN     "universities" TEXT[],
ADD COLUMN     "url" VARCHAR(300) NOT NULL;


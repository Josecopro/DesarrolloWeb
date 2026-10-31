-- AlterTable
ALTER TABLE "careers" DROP COLUMN "programs";

-- CreateTable
CREATE TABLE "programs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "level" VARCHAR(40) NOT NULL,
    "modality" VARCHAR(40) NOT NULL,
    "career_id" VARCHAR(60) NOT NULL,
    "university_id" INTEGER NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "programs_career_id_idx" ON "programs"("career_id");

-- CreateIndex
CREATE UNIQUE INDEX "programs_university_id_name_level_modality_key" ON "programs"("university_id", "name", "level", "modality");

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;


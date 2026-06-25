/*
  Warnings:

  - Added the required column `updatedAt` to the `MedicineSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "examName" TEXT NOT NULL,
    "examDate" DATETIME NOT NULL,
    "examDescription" TEXT NOT NULL,
    "examImage" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "medicineScheduleId" TEXT,
    CONSTRAINT "Exam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Exam_medicineScheduleId_fkey" FOREIGN KEY ("medicineScheduleId") REFERENCES "MedicineSchedule" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Exam" ("createdAt", "examDate", "examDescription", "examImage", "examName", "id", "updatedAt", "userId") SELECT "createdAt", "examDate", "examDescription", "examImage", "examName", "id", "updatedAt", "userId" FROM "Exam";
DROP TABLE "Exam";
ALTER TABLE "new_Exam" RENAME TO "Exam";
CREATE TABLE "new_MedicineSchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "medicineRoutineId" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MedicineSchedule_medicineRoutineId_fkey" FOREIGN KEY ("medicineRoutineId") REFERENCES "MedicineRoutine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MedicineSchedule" ("id", "medicineRoutineId", "time") SELECT "id", "medicineRoutineId", "time" FROM "MedicineSchedule";
DROP TABLE "MedicineSchedule";
ALTER TABLE "new_MedicineSchedule" RENAME TO "MedicineSchedule";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

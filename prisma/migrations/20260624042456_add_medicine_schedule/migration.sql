-- CreateTable
CREATE TABLE "MedicineRoutine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dose" TEXT NOT NULL,
    "intervalHours" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "MedicineRoutine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MedicineSchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "medicineRoutineId" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    CONSTRAINT "MedicineSchedule_medicineRoutineId_fkey" FOREIGN KEY ("medicineRoutineId") REFERENCES "MedicineRoutine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

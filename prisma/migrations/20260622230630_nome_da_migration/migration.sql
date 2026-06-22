/*
  Warnings:

  - You are about to alter the column `createdAt` on the `News` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.
  - You are about to alter the column `publishedAt` on the `News` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_News" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_News" ("authorId", "content", "createdAt", "id", "publishedAt", "title") SELECT "authorId", "content", "createdAt", "id", "publishedAt", "title" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

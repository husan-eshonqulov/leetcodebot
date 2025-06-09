/*
  Warnings:

  - You are about to drop the column `language_code` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "groups" ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "language_code";

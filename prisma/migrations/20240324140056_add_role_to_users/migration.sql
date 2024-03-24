-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBER', 'GHOST');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';

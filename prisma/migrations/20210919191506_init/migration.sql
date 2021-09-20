/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Ecole` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[login]` on the table `Enseignant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ecole_nom_key" ON "Ecole"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Enseignant_login_key" ON "Enseignant"("login");

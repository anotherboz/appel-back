-- CreateTable
CREATE TABLE "Appel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eleveId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "presence" INTEGER NOT NULL DEFAULT 3,
    CONSTRAINT "Appel_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "Eleve" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Eleve" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "enseignantId" INTEGER NOT NULL,
    "hide" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Eleve_enseignantId_fkey" FOREIGN KEY ("enseignantId") REFERENCES "Enseignant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Enseignant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ecoleId" INTEGER NOT NULL,
    CONSTRAINT "Enseignant_ecoleId_fkey" FOREIGN KEY ("ecoleId") REFERENCES "Ecole" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ecole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "code" TEXT NOT NULL
);

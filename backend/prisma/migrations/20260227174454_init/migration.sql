/*
  Warnings:

  - A unique constraint covering the columns `[telefone]` on the table `Contato` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contato_telefone_key" ON "Contato"("telefone");

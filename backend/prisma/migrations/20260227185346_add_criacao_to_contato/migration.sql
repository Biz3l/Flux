-- AlterTable
ALTER TABLE "Contato" ADD COLUMN     "criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Campanha" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "delayMin" INTEGER NOT NULL,
    "delayMax" INTEGER NOT NULL,
    "criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilaEnvio" (
    "id" SERIAL NOT NULL,
    "contatoId" INTEGER NOT NULL,
    "campanhaId" INTEGER NOT NULL,
    "enviado" BOOLEAN NOT NULL DEFAULT false,
    "agendadoPara" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FilaEnvio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fluxo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fluxo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FluxoEtapa" (
    "id" SERIAL NOT NULL,
    "fluxoId" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL,
    "mensagem" TEXT NOT NULL,
    "delayMin" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FluxoEtapa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecucaoFluxo" (
    "id" SERIAL NOT NULL,
    "contatoId" INTEGER NOT NULL,
    "fluxoId" INTEGER NOT NULL,
    "etapaAtual" INTEGER NOT NULL DEFAULT 0,
    "iniciadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ExecucaoFluxo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FilaEnvio" ADD CONSTRAINT "FilaEnvio_contatoId_fkey" FOREIGN KEY ("contatoId") REFERENCES "Contato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilaEnvio" ADD CONSTRAINT "FilaEnvio_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "Campanha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FluxoEtapa" ADD CONSTRAINT "FluxoEtapa_fluxoId_fkey" FOREIGN KEY ("fluxoId") REFERENCES "Fluxo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecucaoFluxo" ADD CONSTRAINT "ExecucaoFluxo_contatoId_fkey" FOREIGN KEY ("contatoId") REFERENCES "Contato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecucaoFluxo" ADD CONSTRAINT "ExecucaoFluxo_fluxoId_fkey" FOREIGN KEY ("fluxoId") REFERENCES "Fluxo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

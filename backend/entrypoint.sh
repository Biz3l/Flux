#!/bin/sh
set -e

echo "[INIT] Aguardando PostgreSQL inicializar completamente..."
sleep 15

echo "[INIT] Testando conexão com banco de dados..."
for i in {1..30}; do
  if npx prisma db execute --stdin < /dev/null 2>/dev/null; then
    echo "[INIT] ✅ Conexão com banco estabelecida!"
    break
  fi
  echo "[INIT] Tentativa $i/30 - Aguardando banco..."
  sleep 2
done

echo "[INIT] Executando reset do banco (drop + recreate)..."
npx prisma migrate reset --force --skip-generate 2>&1 || {
  echo "[INIT] Reset falhou, tentando deploy..."
  npx prisma migrate deploy --skip-generate
}

echo "[INIT] Gerando cliente Prisma..."
npx prisma generate

echo "[INIT] ✅ Banco pronto! Iniciando aplicação..."
exec "$@"


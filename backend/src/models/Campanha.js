// Model - Entidade Campanha (TypeORM / Prisma)

module.exports = {
  // Definir propriedades da entidade
  id: 'UUID ou ID',
  name: 'string - nome da campanha',
  description: 'string - descrição',
  status: 'enum - ativo, pausado, finalizado',
  fluxoId: 'foreign key para Fluxo',
  contatosIds: 'array de IDs de contatos',
  startDate: 'timestamp',
  endDate: 'timestamp (opcional)',
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

// Model - Entidade Fluxo (TypeORM / Prisma)

module.exports = {
  // Definir propriedades da entidade
  id: 'UUID ou ID',
  name: 'string - nome do fluxo',
  description: 'string - descrição',
  nodes: 'array de nós do fluxo',
  edges: 'array de conexões entre nós',
  startNode: 'ID do nó inicial',
  active: 'boolean',
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

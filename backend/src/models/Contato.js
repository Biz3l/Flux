// Model - Entidade Contato (TypeORM / Prisma)

module.exports = {
  // Definir propriedades da entidade
  id: 'UUID ou ID',
  phone: 'string - número do WhatsApp',
  name: 'string - nome do contato',
  email: 'string (opcional)',
  tags: 'array de tags',
  metadata: 'objeto com dados adicionais',
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

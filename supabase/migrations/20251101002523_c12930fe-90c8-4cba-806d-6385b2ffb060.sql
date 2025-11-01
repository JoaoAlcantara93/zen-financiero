-- Criar tipos enum para frequência e status
CREATE TYPE transaction_frequency AS ENUM ('fixed', 'variable', 'future');
CREATE TYPE transaction_status AS ENUM ('pending', 'confirmed');

-- Adicionar colunas à tabela transactions
ALTER TABLE transactions 
  ADD COLUMN frequency transaction_frequency DEFAULT 'fixed' NOT NULL,
  ADD COLUMN status transaction_status DEFAULT 'pending' NOT NULL;
# Roadmap do LimiteMEI

Este documento apresenta a direção funcional e técnica do projeto. As entregas estão organizadas por prioridade, começando pela segurança da base e seguindo até as automações fiscais e financeiras.

## Visão do produto

O LimiteMEI deve permitir que o microempreendedor responda rapidamente:

- Quanto faturei neste mês e neste ano?
- Quanto do limite anual já utilizei?
- Quanto ainda posso faturar?
- Mantendo a média atual, ultrapassarei o limite?
- Quanto entrou, quanto saiu e qual é meu saldo?
- Quais valores ainda tenho para receber ou pagar?
- Meu Relatório Mensal de Receitas Brutas está completo?
- Quais obrigações e vencimentos estão pendentes?

## Princípios do domínio

### Faturamento não é caixa

Notas e receitas brutas devem alimentar o acompanhamento do limite. Recebimentos e pagamentos devem alimentar o caixa. As duas informações podem estar relacionadas, mas não são equivalentes.

```text
Nota ou receita bruta
        ↓
Conta a receber
        ↓
Recebimento
        ↓
Movimento financeiro
```

Empréstimos, aportes, estornos e transferências entre contas precisam de classificações próprias para que não sejam somados indevidamente ao faturamento.

### As regras devem possuir vigência

Limites, prazos e modalidades podem mudar. Uma configuração de regra deve conter, no mínimo:

- Modalidade do MEI.
- Ano ou período de vigência.
- Limite anual.
- Valor proporcional mensal.
- Faixas de alerta e excesso.
- Fonte ou referência da regra.

Isso preserva relatórios antigos mesmo após uma alteração legal.

## Fase 0 — estabilização da base

Objetivo: tornar a fundação segura antes da criação dos módulos de negócio.

- [ ] Corrigir a atualização genérica para preservar ID e relacionamentos.
- [ ] Resolver usuário, empresa e categoria nos services, sem confiar em IDs livres enviados pelo cliente.
- [ ] Incluir e mapear a forma de pagamento dos movimentos.
- [ ] Configurar BCrypt para senhas.
- [ ] Implementar cadastro, login, renovação e encerramento de sessão.
- [ ] Implementar autorização por perfil.
- [ ] Isolar todas as consultas pela empresa autenticada.
- [ ] Substituir H2 por PostgreSQL nos ambientes persistentes.
- [ ] Adicionar migrations com Flyway ou Liquibase.
- [ ] Criar configurações separadas para desenvolvimento, teste e produção.
- [ ] Padronizar respostas de erro e códigos HTTP.
- [ ] Adicionar paginação, ordenação e filtros às listagens.
- [ ] Adicionar logs estruturados e auditoria básica.
- [ ] Corrigir a configuração do HttpClient no Angular.
- [ ] Corrigir o orçamento do bundle e revisar as dependências do frontend.
- [ ] Criar testes de service, repository, controller e autenticação.

## Fase 1 — MVP de faturamento e limite

Objetivo: entregar o principal valor do produto — acompanhar receitas e o teto do MEI.

### Empresa e enquadramento

- [ ] Cadastro de empresa e validação de CNPJ.
- [ ] Data de abertura e início no SIMEI.
- [ ] Modalidade geral ou modalidade com regra específica.
- [ ] Atividades de comércio, indústria, serviço e transporte.
- [ ] Cálculo do limite proporcional no ano de abertura.

### Receitas e notas

- [ ] Cadastro de receita bruta com e sem documento fiscal.
- [ ] Cadastro de cliente.
- [ ] Número, série, chave, emissão e competência da nota.
- [ ] Valor bruto e tipo de atividade.
- [ ] Status emitida, cancelada ou substituída.
- [ ] Anexos XML e PDF com armazenamento protegido.
- [ ] Importação manual por arquivo em uma etapa posterior do MVP.

### Dashboard do limite

- [ ] Receita bruta do mês e do ano.
- [ ] Limite aplicável no período.
- [ ] Percentual utilizado e valor restante.
- [ ] Evolução mensal do faturamento.
- [ ] Média mensal e projeção até dezembro.
- [ ] Alertas configuráveis em 70%, 80%, 90%, 100% e 120%.
- [ ] Explicação amigável da situação, sem caracterizar consultoria tributária.

### Relatório Mensal de Receitas Brutas

- [ ] Separação entre comércio, indústria e serviços.
- [ ] Separação entre receitas com e sem documento fiscal.
- [ ] Total mensal e acumulado anual.
- [ ] Conferência das receitas antes do fechamento.
- [ ] Geração em PDF.
- [ ] Registro da data de fechamento e do responsável.
- [ ] Reabertura com histórico de alterações.

## Fase 2 — gestão financeira

Objetivo: permitir o controle do dinheiro realizado e previsto.

### Contas financeiras

- [ ] Caixa, conta corrente, conta digital e carteira.
- [ ] Saldo inicial.
- [ ] Entrada, saída e transferência entre contas.
- [ ] Conciliação manual.
- [ ] Histórico de saldo.

### Contas a receber

- [ ] Vencimento e competência.
- [ ] Parcelas.
- [ ] Recebimento total ou parcial.
- [ ] Juros, multas e descontos.
- [ ] Situações em aberto, vencida, parcial e quitada.
- [ ] Vínculo opcional com nota ou receita bruta.

### Contas a pagar

- [ ] Fornecedor e categoria.
- [ ] Despesas fixas e variáveis.
- [ ] Parcelas e recorrências.
- [ ] Pagamento total ou parcial.
- [ ] Alertas de vencimento.

### Fluxo de caixa

- [ ] Visões diária, semanal e mensal.
- [ ] Comparação entre realizado e projetado.
- [ ] Filtros por conta e categoria.
- [ ] Demonstrativo de entradas, saídas e saldo.
- [ ] Exportação CSV, Excel e PDF.

## Fase 3 — obrigações e funcionário

Objetivo: apoiar a rotina administrativa do MEI.

### DASN-SIMEI

- [ ] Consolidado do ano-calendário.
- [ ] Totais por tipo de atividade.
- [ ] Registro da existência de empregado no período.
- [ ] Conferência com os relatórios mensais.
- [ ] Checklist e lembrete de prazo.
- [ ] Exportação dos dados de apoio à declaração.

### Funcionário

- [ ] Cadastro pessoal e contratual.
- [ ] Data de admissão e desligamento.
- [ ] Cargo, salário e piso informado.
- [ ] Férias e afastamentos.
- [ ] Documentos e histórico.
- [ ] Alerta para o limite de empregados permitido ao MEI.
- [ ] Registro de pagamentos relacionados à folha.

O sistema deverá atuar como apoio administrativo e não como substituto do eSocial ou de orientação trabalhista profissional.

## Fase 4 — automações e integrações

- [ ] Importação de notas fiscais.
- [ ] Importação de extratos OFX e CSV.
- [ ] Regras de conciliação automática.
- [ ] Notificações por e-mail e outros canais autorizados.
- [ ] Integrações bancárias via provedores adequados.
- [ ] Integrações com serviços fiscais, quando tecnicamente e legalmente disponíveis.
- [ ] Acesso de contador com permissões específicas.
- [ ] API pública com escopos e auditoria.

## Modelo de dados sugerido

Entidades principais previstas:

```text
Usuario
Empresa
UsuarioEmpresa
RegraLimiteMei
AtividadeEmpresa
Cliente
Fornecedor
DocumentoFiscal
ReceitaBruta
ContaReceber
ContaPagar
BaixaFinanceira
ContaFinanceira
MovimentoFinanceiro
Categoria
RelatorioMensal
Funcionario
DocumentoAnexo
RegistroAuditoria
```

`UsuarioEmpresa` permite que um titular, colaborador ou contador acesse empresas diferentes com papéis específicos. Toda entidade de negócio deve pertencer diretamente a uma empresa.

## Requisitos não funcionais

- [ ] Valores monetários com precisão e escala explícitas no banco.
- [ ] Datas e horários tratados consistentemente no fuso da empresa.
- [ ] Exclusão lógica para registros que precisem manter histórico.
- [ ] Idempotência em importações e integrações.
- [ ] Backup e teste periódico de restauração.
- [ ] Criptografia em trânsito e proteção de arquivos armazenados.
- [ ] Auditoria de inclusão, alteração, cancelamento e fechamento.
- [ ] Observabilidade, métricas e alertas da aplicação.
- [ ] Testes automatizados das regras de limite e relatórios.
- [ ] Acessibilidade e interface responsiva.
- [ ] Adequação à LGPD e política de privacidade.

## Critérios para considerar o MVP pronto

O MVP estará pronto para validação quando um usuário puder:

1. Criar uma conta e cadastrar seu MEI.
2. Entrar de forma segura e acessar apenas sua empresa.
3. Registrar receitas com e sem nota fiscal.
4. Consultar faturamento mensal e anual.
5. Visualizar limite, percentual utilizado, saldo restante e projeção.
6. Gerar o Relatório Mensal de Receitas Brutas.
7. Registrar entradas e saídas sem confundi-las com receita bruta.
8. Exportar seus dados.
9. Utilizar o sistema sem perda de dados após uma reinicialização.

## Fora do escopo inicial

Para manter o MVP viável, ficam inicialmente fora do escopo:

- Emissão oficial de nota fiscal dentro da plataforma.
- Transmissão automática da DASN-SIMEI.
- Folha de pagamento completa.
- Substituição do eSocial.
- Contabilidade completa ou consultoria tributária.
- Integração direta com todos os bancos.

Essas capacidades podem ser avaliadas depois que o fluxo principal estiver validado com usuários reais.

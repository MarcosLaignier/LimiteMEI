# LimiteMEI

O **LimiteMEI** é um projeto SaaS para ajudar Microempreendedores Individuais a organizar o negócio, acompanhar a receita bruta anual e reduzir o risco de ultrapassar o limite de faturamento do MEI.

O objetivo é reunir em um único lugar o controle de notas fiscais, receitas, despesas, contas a pagar e receber, fluxo de caixa, funcionário e relatórios mensais.

> O projeto está em desenvolvimento. Atualmente existem autenticação, empresa ativa, cadastros base e o início do módulo financeiro com lançamentos e baixas.

## Objetivos do produto

- Registrar notas fiscais e outras receitas do negócio.
- Separar faturamento, contas a receber e movimentações de caixa.
- Controlar entradas, saídas e saldo das contas financeiras.
- Acompanhar o percentual utilizado do limite anual do MEI.
- Considerar o limite proporcional no ano de abertura.
- Gerar o Relatório Mensal de Receitas Brutas.
- Preparar os dados utilizados na DASN-SIMEI.
- Controlar contas a pagar, contas a receber e vencimentos.
- Manter o cadastro e o histórico do funcionário do MEI.
- Exibir alertas e projeções de faturamento.

## Regra do limite

O limite geral vigente do MEI é expresso em reais: **R$ 81.000,00 por ano**. No ano de abertura, ele é proporcional ao número de meses de atividade, considerando R$ 6.750,00 por mês. Há regras específicas para algumas modalidades, como o MEI Transportador Autônomo de Cargas.

O percentual exibido pelo sistema deve ser calculado desta forma:

```text
percentual utilizado = receita bruta acumulada / limite aplicável * 100
```

As regras legais podem mudar. Por isso, valores, vigências e modalidades deverão ser configuráveis e versionados, em vez de ficarem fixos no código.

## Arquitetura atual

O repositório é dividido em duas aplicações:

```text
LimiteMEI/
├── limiteMEI-api/       # API REST em Spring Boot
├── limiteMEI-angular/   # Aplicação web em Angular
├── README.md
└── ROADMAP.md
```

### Backend

- Java 17
- Spring Boot 4
- Spring Web MVC
- Spring Data JPA
- Spring Security
- Jakarta Validation
- H2 no ambiente atual
- PostgreSQL disponível como dependência
- Maven Wrapper

### Frontend

- Angular 21
- TypeScript 5.9
- Bootstrap 5
- Font Awesome e Bootstrap Icons
- RxJS
- Vitest

### Padrão visual dos formulários

- Campos de texto utilizam largura padrão de **435px**, sempre respeitando `max-width: 100%` em telas menores.
- Datas utilizam a largura definida no componente compartilhado de data.
- Campos de seleção devem ter largura compatível com o conteúdo, evitando ocupar grandes espaços horizontais sem necessidade.
- Campos lado a lado devem manter espaçamento consistente e quebrar para a linha seguinte em telas menores.
- Máscaras, validações e controles devem reutilizar os componentes compartilhados antes da criação de implementações específicas por tela.

## Estado atual

Já estão presentes no backend:

- Entidades de usuário, empresa, categoria, pessoas, lançamentos e baixas financeiras.
- DTOs e mappers.
- Camadas de controller, service e repository.
- Estruturas genéricas para CRUD, validação e filtros.
- Teste de inicialização do contexto Spring.

No frontend estão presentes:

- Layout principal com menu lateral.
- Componentes reutilizáveis de formulário, grid, filtros e diálogos.
- Estrutura genérica de CRUD.
- CRUDs de empresas, categorias e pessoas.
- Lista e formulário de lançamentos financeiros com baixas totais ou parciais.
- Monitor financeiro com filtros, totais, vencimentos e baixa vinculada à conta financeira.
- Competência financeira informada por mês/ano e filtro reutilizável compartilhado entre lançamentos e monitor.
- Categorias com classificação de faturamento MEI, natureza da receita, exigência documental e vínculo opcional ou obrigatório com pessoas.
- Cadastro de contas financeiras por empresa, incluindo caixa, conta bancária, poupança e carteira digital.
- Extrato e saldo atual por conta, movimentações manuais, transferências e geração automática de entradas e saídas pelas baixas.
- Cancelamento auditado de lançamentos, estorno de baixas, histórico financeiro e proteção contra baixas simultâneas acima do saldo.
- Composição da baixa por principal, juros, multa e desconto, com movimentação bancária pelo valor efetivamente pago.

Antes de uso em produção ainda são necessários autenticação completa, isolamento de dados por empresa, banco persistente, migrations, testes de negócio e os módulos financeiros descritos no [roadmap](./ROADMAP.md).

## Como executar

### Pré-requisitos

- Java 17
- Node.js compatível com Angular 21
- npm 11 ou superior

Não é necessário instalar Maven globalmente, pois o projeto inclui o Maven Wrapper.

### API

```bash
cd limiteMEI-api
./mvnw spring-boot:run
```

A configuração atual utiliza um banco H2 em memória. Os dados são descartados quando a API é encerrada.

Para executar os testes:

```bash
cd limiteMEI-api
./mvnw test
```

### Frontend

```bash
cd limiteMEI-angular
npm ci
npm start
```

Para executar os testes:

```bash
npm test
```

Para gerar o bundle de produção:

```bash
npm run build
```

> No estado atual, o build de produção ultrapassa o orçamento configurado para o CSS do Font Awesome. Esse ajuste consta entre as pendências técnicas.

## Conceitos importantes do domínio

O sistema deve tratar separadamente três conceitos:

1. **Receita bruta:** valor usado para acompanhar o limite do MEI.
2. **Conta a receber:** obrigação do cliente, que pode estar aberta, parcialmente paga ou quitada.
3. **Movimento financeiro:** entrada ou saída efetiva de uma conta ou do caixa.

Uma nota emitida pode ainda não ter sido recebida. Da mesma forma, uma entrada de empréstimo, aporte ou transferência não deve ser considerada automaticamente como receita bruta do MEI.

## Segurança e privacidade

Por armazenar dados financeiros e empresariais, a aplicação deverá possuir:

- Senhas protegidas com hash seguro.
- Autenticação e autorização por perfil.
- Isolamento obrigatório dos dados de cada empresa.
- Trilhas de auditoria para alterações relevantes.
- Backups e política de retenção.
- Proteção de documentos fiscais e dados pessoais.
- Configuração de CORS por ambiente.
- Adequação à LGPD.

## Documentação do planejamento

A visão dos módulos, prioridades e critérios do MVP está disponível em [ROADMAP.md](./ROADMAP.md).

## Aviso

O LimiteMEI é uma ferramenta de apoio à organização financeira. Ele não substitui os portais oficiais, um contador ou orientação jurídica e tributária profissional.

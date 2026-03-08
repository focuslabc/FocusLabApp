2. ARQUITETURA DO SISTEMA E ENTIDADES PRINCIPAIS
2.1 Entidades Fundamentais
Usuário: perfil com dados cadastrais, preferências, histórico de ações, metas, conexões com outros usuários, e permissões para integrações externas.

RED (Núcleo de Ação): entidade diária obrigatória. Contém campos: data, status (concluída, parcial, quebrada), lista de hábitos mínimos configuráveis pelo usuário, horários planejados e realizados, e metadados para cálculo de consistência.

Objeto de Foco Trimestral: meta principal do trimestre, usada como filtro global do sistema. Armazena título, descrição, data de início e fim, ícone representativo, e relação com a Jornada de longo prazo.

Jornada: meta de longo prazo (6 meses a 2 anos). Contém título, descrição, data prevista, e é decomposta em múltiplos Objetos de Foco Trimestrais sequenciais.

Laboratório de Comportamento: módulo temporário (3-5 dias para Micro-Operações, 7-14 dias para Desafios Estratégicos). Cada laboratório possui regras próprias, checkpoints, critérios de conclusão, e pode estar vinculado a um Objeto de Foco ou a um conteúdo da Biblioteca.

Conteúdo (Biblioteca Estratégica): vídeos, textos ou áudios educacionais. Cada conteúdo pode estar associado a um tema (Foco, Procrastinação, Dopamina, Vícios, Energia Sexual, Disciplina, Sono, Emoções, Propósito, Finanças). Possui metadados como duração, nível, autor, e uma ação prática recomendada que o usuário deve registrar em até 48h.

Ação: registro de uma atividade concreta realizada pelo usuário, vinculada a um conteúdo ou a um desafio. Contém data, descrição, status, e pode gerar impacto em métricas.

Diário de Reconfiguração: entidade que armazena reflexões guiadas do usuário, com perguntas condicionais baseadas em falhas registradas na RED ou nos laboratórios. As respostas são usadas pela IA para ajustes.

Aliança: grupo de 3 a 5 usuários com objetivos comuns. Possui nome, emblema, constituição, mural de consistência coletivo, e desafios sincronizados.

Cápsula do Tempo: mensagem (texto, áudio, vídeo) do usuário para si mesmo no futuro, com data de abertura programada. Armazena mídia, data de criação, data de abertura, e contexto na criação (metas atuais, estado emocional, foto).

Mapa Estratégico: representação visual da Jornada de longo prazo, com marcos trimestrais e sprints mensais. Cada marco possui uma lista de laboratórios e conteúdos sugeridos.

Ritual de Passagem: evento automático gerado pela IA quando o usuário atinge um marco significativo. Contém animação, texto contextual, emblema desbloqueado, e possibilidade de compartilhamento.


3. MÓDULOS COM OTIMIZAÇÕES
3.1 RED — Núcleo de Ação
Implementação:

a red apresentada como uma roda de habilidades (skill wheel). Cada hábito mínimo é um segmento da roda. Ao ser concluído, o segmento acende em vermelho com animação de preenchimento e haptic feedback.

Quando todos os segmentos estão concluídos, a roda se transforma em uma chave que destranca visualmente as demais áreas do app, com som de mecanismo e animação de abertura.

A RED deve ser configurável pelo usuário: ele pode definir até 5 hábitos mínimos (ex: acordar até as 7h, meditar 5 min, treinar 20 min, planejar o dia, ler 10 páginas). Cada hábito pode ter horário opcional.

O sistema deve permitir registro rápido: um toque no segmento abre opções "Concluí", "Pulei" (com motivo), "Adiar". Motivos de falha alimentam o Diário.

A cada conclusão, a barra de Energia Disciplinar (global) é atualizada.

Visual:

Fundo preto, roda com contornos vermelhos. Quando ativa, brilho interno vermelho.

Texto em branco, fonte bold sans-serif.

Animação de partículas ao completar a roda.

3.2 Centro de Comando
Implementação:

Tela principal após destravamento da RED. Exibe o Objeto de Foco Trimestral como um emblema flutuante no topo (ex: ícone de livro para "Escrever livro", com barra de progresso ao redor).

Abaixo, cards dinâmicos com:

Próximo Laboratório recomendado (baseado no Objeto de Foco)

Conteúdo da Biblioteca relacionado

Status da Aliança (se houver)

Sugestão da IA (ex: "Que tal uma Micro-Operação de 3 dias sobre foco?")

Tocar no emblema expande para o Mapa Estratégico completo.

Visual:

Emblema em 3D suave (sombras), com efeito de partículas ao redor conforme dias de consistência.

Cards com bordas vermelhas, cantos arredondados, fundo escuro com leve gradiente.

3.3 Diário de Reconfiguração
Implementação:

Fluxo guiado que aparece automaticamente após uma falha na RED ou em um laboratório, ou pode ser acessado manualmente.

Interface de perguntas com opções visuais (ícones). Exemplo: "O que aconteceu hoje?" com ícones de cansaço, distração, imprevisto, falta de motivação.

Baseado nas respostas, o sistema ajusta as recomendações futuras e pode sugerir uma Recarga Prescritiva (conteúdo curto de recuperação).

O diário deve ter estética de grimório: fundo com textura de papel envelhecido, fonte serifada, animação de página virando ao mudar de pergunta, som de escrita à mão ao digitar.

Armazenamento:

Cada entrada do diário é armazenada com timestamp, tags extraídas das respostas, e usada pela IA para identificar padrões (ex: "falha sempre às quartas-feiras", "associada a cansaço").

3.4 Biblioteca Estratégica
Implementação:

Conteúdos organizados por temas (lista fixa: Foco, Procrastinação, Dopamina, Vícios, Energia Sexual, Disciplina, Sono, Emoções, Propósito, Finanças). Cada tema é uma categoria com capa personalizada.

Ao abrir um conteúdo, o usuário vê o player de vídeo (ou leitor de texto/áudio) e, abaixo, um campo obrigatório "Sua ação até 48h". O usuário deve digitar ou selecionar uma ação concreta que fará. Um cronômetro regressivo de 48h começa a contar.

Após registrar a ação, o conteúdo ganha um selo vermelho de "compromisso ativo". Quando a ação for marcada como concluída, o selo vira "concluído".

O sistema deve permitir que conteúdos recomendem automaticamente laboratórios ou ajustes na RED. Exemplo: após assistir um vídeo sobre sono, o app pergunta "Quer adicionar 'dormir até 23h' à sua RED?"

Visual:

Capas de tema como ilustrações dark com detalhes vermelhos.

Player de vídeo em tela cheia opcional, com controles mínimos.

Selos de compromisso como ícones de baú aberto/fechado.

3.5 Painel de Consistência (Energia Disciplinar)
Implementação:

Métrica calculada diariamente com base na regularidade da RED, conclusão de laboratórios, e registro de ações da biblioteca. Não é baseada em intensidade.

Visualizada como uma chama ou planta que cresce. Quanto mais dias consecutivos de RED completa, mais forte a chama (partículas, brilho, tamanho). Falhas reduzem a chama, mas não a zeram – ela encolhe gradualmente.

A Energia Disciplinar é mostrada no canto superior de todas as telas, como uma barra vertical ou ícone de chama.

Quando baixa, o sistema sugere Recargas Prescritivas: conteúdos curtos de recuperação, meditações guiadas, ou sugestão de descanso.

Lógica:

Energia = (dias consecutivos * peso) + (laboratórios concluídos no período * peso) - (falhas recentes * penalidade). A fórmula deve ser ajustável via administrador.

3.6 Estação de Desacoplamento
Implementação:

Módulo de acesso rápido (ícone flutuante ou na gaveta) com protocolos curtos para momentos de estresse, ansiedade ou sobrecarga.

Ao abrir, o usuário vê uma lista de "protocolos de descompressão": respiração guiada (1-3 min), exercício de grounding, áudio de relaxamento, ou simplesmente um timer de 5 minutos para fazer nada.

Pode ser acionado proativamente se a integração biométrica detectar picos de estresse (frequência cardíaca elevada, variabilidade baixa).

Visual: ambiente calmo, cores mais suaves (vermelho mais opaco, preto com nuances azuladas), sons ambientes.

3.7 Contratos Silenciosos
Implementação:

Pares ou pequenos grupos (até 3 pessoas) com visibilidade mínima de progresso. Não há chat público. Cada membro vê apenas se o outro concluiu a RED hoje (ícone de tocha acesa/apagada) e pode enviar mensagens privadas opcionais (texto curto, sem notificações push excessivas).

Para formar um contrato, o usuário envia convite por código ou contato. Ambos precisam aceitar.

A ideia é responsabilidade social leve, sem pressão social negativa.

4. NOVOS MÓDULOS ESTRATÉGICOS
4.1 Alianças
Descrição:
Grupos de 3 a 5 usuários que embarcam juntos em uma jornada de 30, 60 ou 90 dias. Cada Aliança possui um nome, um emblema personalizável (upload de imagem ou escolha de ícones do sistema), e uma "Constituição" – um documento curto escrito pelo grupo definindo valores, regras e objetivos compartilhados.

Implementação:

Tela da Aliança: visual de acampamento ou base compartilhada. Cada membro representado por avatar minimalista. Ao redor de uma fogueira virtual, tochas que acendem quando o membro conclui a RED no dia.

Desafios Sincronizados: todos os membros concordam em realizar uma Micro-Operação específica no mesmo dia (ex: "segunda-feira todos farão 20 minutos de leitura"). O sistema sincroniza timers e exibe progresso coletivo em barra unificada.

Mural de Consistência Coletivo: linha do tempo com marcos do grupo (ex: "Todos concluíram a RED por 7 dias seguidos"). Apenas marcos positivos são exibidos.

Comunicação: chat de texto simples, com moderação automática, mas não é o foco. Preferencialmente mensagens curtas e objetivas.

Ao final da jornada, a Aliança pode ser dissolvida ou renovada. O sistema gera um "relatório da Aliança" com estatísticas coletivas.

Banco de Dados:

Tabela aliancas (id, nome, emblema_url, constituicao_texto, data_inicio, data_fim, status)

Tabela alianca_membros (usuario_id, alianca_id, papel, data_entrada)

Tabela desafios_sincronizados (id, alianca_id, descricao, data, status_conclusao_por_membro)

4.2 Mapas Estratégicos
Descrição:
Visualização da Jornada de longo prazo (6 meses a 2 anos) como um mapa geográfico, com a meta final sendo uma fortaleza ou montanha no horizonte. Entre o ponto de partida e a meta, estações representam marcos trimestrais. Cada estação contém subestações (sprints mensais) com ícones de laboratórios e conteúdos.

Implementação:

O usuário define uma meta de longo prazo (título, descrição, data prevista). A IA quebra automaticamente essa meta em marcos trimestrais com base em análise semântica e em templates predefinidos. Ex: "Escrever um livro" gera marcos "Pesquisa", "Estrutura", "Escrita", "Revisão".

Para cada marco, o sistema sugere laboratórios e conteúdos da biblioteca. O usuário pode aceitar, modificar ou pular.

O mapa é interativo: tocar em uma estação expande detalhes do marco, mostrando o progresso (ex: quantos laboratórios concluídos). Concluir um marco acende a estação e revela o próximo trecho do caminho.

Visual: fundo escuro com linhas de relevo suaves, estações como pontos de luz vermelha, caminho percorrido em dourado/vermelho. Animações de deslocamento do avatar do usuário ao longo do mapa quando avança.

O mapa pode ser compartilhado com a Aliança ou mantido privado.

Regras de Negócio:

Cada marco trimestral deve conter pelo menos 1 laboratório ativo.

A IA ajusta automaticamente as sugestões se o usuário atrasar ou adiantar.

4.3 Cápsulas do Tempo
Descrição:
O usuário pode criar mensagens para si mesmo no futuro (texto, áudio, vídeo), com data de abertura programada (3 meses, 1 ano, 5 anos). Na data marcada, o sistema notifica e apresenta o conteúdo como um presente do passado.

Implementação:

Criação: tela minimalista com fundo simulando papel sendo dobrado. O usuário escolhe o tipo de mídia, grava/escreve, define a data de abertura (seleção em calendário). Pode anexar "contexto atual": foto do momento, estado emocional, metas atuais.

Armazenamento: criptografado, com timestamp de criação imutável.

Abertura: na data programada, o app envia uma notificação especial "Você recebeu uma Cápsula do Tempo". Ao abrir, animação de lacre se rompendo, música ambiente suave, e então exibição do conteúdo. Após a exibição, o sistema mostra um resumo do que aconteceu desde a criação: quantidade de REDs concluídas, marcos atingidos, evolução da Energia Disciplinar.

O usuário pode reagir à cápsula com um emoji ou reflexão, e pode compartilhar (se desejar) o momento de abertura.

Funcionalidades complementares: cápsulas coletivas (membros da Aliança criam juntas), cápsulas-surpresa (sistema sugere revisitar uma cápsula antiga), galeria de cápsulas abertas em linha do tempo.

Banco de Dados:

Tabela capsulas (id, usuario_id, tipo_midia, conteudo_criptografado, data_criacao, data_abertura, contexto_json, foi_aberta booleano)

Relação com usuarios para notificações programadas.

4.4 Trilha Sonora Personalizada
Descrição:
O sistema gera dinamicamente uma trilha sonora adaptada ao estado atual do usuário, baseada em dados biométricos, hora do dia, tipo de atividade no app, e preferências. Integração com Spotify/Apple Music para playlists externas, mas também com geração própria de ambientes sonoros.

Implementação:

Backend: serviço de recomendação musical que analisa variáveis: hora (manhã: energia, tarde: foco, noite: relaxamento), atividade (RED: ritmo acelerado, Diário: introspectivo, Mapa: épico), biométricas (se VFC baixa, sons calmantes), histórico (se o usuário costuma ouvir lo-fi durante laboratórios).

O app possui uma biblioteca interna de faixas ambientes (lo-fi, nature, binaural, ruído marrom, frequências) licenciadas ou geradas por IA.

O usuário pode ativar/desativar a trilha, escolher modo automático ou manual, e conectar sua conta do Spotify para recomendações baseadas em seus gostos.

Cada módulo do app tem uma identidade sonora sutil. Ao entrar na Biblioteca, uma música de fundo diferente da do Centro de Comando, mas com transição suave.

Funcionalidade "Trilha da Jornada": à medida que o usuário avança nos marcos do Mapa, novos instrumentos ou camadas são adicionados à trilha principal. Ao final da Jornada, ele pode exportar uma peça única representando sua evolução.

Integração Técnica:

APIs: Spotify Web API, Apple Music API. Para geração própria, usar bibliotecas de áudio adaptativo (ex: Web Audio API para web, ou soluções nativas para mobile).

4.5 Modo Xadrez
Descrição:
Camada opcional para usuários avançados que transforma a vida em um jogo de estratégia em tempo real. Cada área da vida é uma peça de xadrez com movimentos próprios baseados em consistência.

Implementação:

O usuário ativa o Modo Xadrez nas configurações. A tela principal alternativa se torna um tabuleiro de xadrez estilizado (8x8, mas as casas podem representar dias da semana ou áreas da vida).

Peças configuráveis:

Projeto principal: Rei (movimento limitado, mas essencial)

Hábitos diários: Peões (avançam um passo por dia de consistência)

Relacionamentos: Torres (movimento horizontal/vertical, representando conexões)

Saúde: Cavalos (movimento em L, surpreendente)

Finanças: Bispos (movimento diagonal, planejamento)

Cada peça tem regras de movimento: por exemplo, o peão do exercício só avança se o usuário treinou 3x na semana. Se não, fica imóvel.

O objetivo é "checkmate" na meta: o Rei (projeto) precisa alcançar a última fileira, mas para isso as outras peças precisam abrir caminho.

O sistema calcula diariamente os movimentos possíveis com base nas ações registradas. O usuário pode "jogar" arrastando peças, mas só pode mover conforme as regras.

Visual: tabuleiro minimalista preto com linhas vermelhas, peças em design elegante (formas geométricas). Animações de movimento suaves.

Lógica de Jogo:

Não é um jogo contra oponente, é um puzzle pessoal. O usuário tenta otimizar sua rotina para que as peças avancem.

A IA pode sugerir movimentos: "Se você treinar amanhã, seu Cavalo Saúde pode capturar a casa da procrastinação".

4.6 Rituais de Passagem
Descrição:
Eventos automáticos gerados pela IA quando o usuário atinge marcos significativos. Cada ritual é uma celebração personalizada dentro do app, com animação, música, texto contextual e recompensa visual.

Implementação:

Gatilhos para rituais:

Primeira vez que mantém a RED por 30 dias consecutivos.

Conclusão de um Desafio Estratégico inteiro.

Abertura de uma Cápsula do Tempo.

Evolução de nível em um tema (ex: 100 horas de foco profundo).

Superação de um padrão de falha (ex: depois de 3 meses, conseguiu acordar cedo 5x na semana).

Quando um gatilho é detectado, o sistema prepara uma tela especial: fundo com partículas, uma frase gerada pela IA baseada no histórico do diário (ex: "Há 30 dias você começou essa jornada. Lembra como estava? Hoje sua chama queima mais forte.").

Música ambiente exclusiva (variação da trilha sonora) toca durante o ritual.

O usuário recebe um emblema especial (ícone para o perfil) e pode opcionalmente escrever uma reflexão ou compartilhar com a Aliança.

Os rituais são armazenados em uma "Linha do Tempo de Rituais" no perfil, formando um mural de conquistas pessoais.

Banco de Dados:

Tabela rituais (id, usuario_id, tipo_gatilho, data, descricao_gerada, emblema_url, compartilhado boolean)

Relação com emblemas (tabela de conquistas visuais).

5. ASSISTENTE DE IA CONTEXTUAL
Descrição:
Não é um chatbot genérico, mas um sistema de recomendação interno treinado exclusivamente sobre os dados gerados dentro da plataforma. A IA acessa: registros do diário, histórico de consistência da RED, padrões semanais de falha, uso dos laboratórios, conteúdos consumidos, ações registradas, e o Objeto de Foco ativo.

Implementação:

Backend: modelo de machine learning (inicialmente baseado em regras e árvores de decisão, evoluindo para rede neural simples) que processa os dados do usuário e gera sugestões.

Tipos de sugestão:

Ajustes na RED: "Você tem falhado no hábito de leitura às quartas. Que tal mudar para quinta?"

Recomendação de Micro-Operações específicas baseadas em padrões de falha.

Ativação de Recargas Prescritivas quando a Energia Disciplinar está baixa.

Sugestão de conteúdos da Biblioteca alinhados ao momento.

Alertas preventivos: "Sua frequência cardíaca basal está alta. Considere uma sessão na Estação de Desacoplamento."

A IA deve ser capaz de fazer correlações simples: ex, "dias em que você registrou cansaço no diário coincidem com falhas na RED". Essas correlações são apresentadas ao usuário como insights.

A interface com a IA é um painel "Insights" no Centro de Comando, com cards de sugestões. O usuário pode aceitar, ignorar ou pedir mais detalhes.

Não há conversa livre; a IA apenas prescreve elementos já existentes na plataforma.

Requisitos Técnicos:

Todas as ações do usuário devem ser estruturadas em dados interpretáveis: timestamps, categorias, tags, métricas.

Backend deve ter pipelines de ETL diários para alimentar os modelos.

6. INTEGRAÇÕES BIOMÉTRICAS E DE CONTEXTO
Descrição:
Integração opcional com Apple Health, Google Fit e wearables (Garmin, Whoop, Oura) via APIs. Os dados importados (sono, VFC, atividade, frequência cardíaca basal) são normalizados e cruzados com métricas internas.

Implementação:

Módulo de conexão com health kits: solicitar permissões, ler dados dos últimos 7 dias, armazenar em tabela própria.

Normalização: mapear diferentes fontes para um schema unificado (ex: horas de sono, qualidade do sono, VFC média, passos, etc).

Regras de negócio:

Se a VFC estiver baixa ou sono insuficiente, o sistema pode reduzir automaticamente a exigência da RED (ex: sugerir pular um hábito não essencial naquele dia) para evitar quebra de consistência.

Se detectar picos de estresse (frequência cardíaca elevada por período prolongado), acionar sugestão de Estação de Desacoplamento.

Correlações: "Nos dias em que você dorme menos de 6h, sua Energia Disciplinar cai 20% no dia seguinte" – insight gerado pela IA.

Privacidade: dados biométricos são armazenados localmente ou criptografados, com opção de exclusão.

7. INTEGRAÇÕES COM ECOSSISTEMA EXTERNO
Descrição:
O app deve se conectar com ferramentas de produtividade para se tornar o centro de comando da vida digital do usuário.

Implementação:

Google Calendar: bloquear automaticamente horários da RED no calendário do usuário (com permissão). Também pode importar eventos para sugerir blocos de foco.

Todoist / Microsoft To Do / Notion: via APIs, importar tarefas como possíveis objetivos diários, ou exportar ações compromissadas como tarefas.

Spotify: integração para playlists (já descrita na Trilha Sonora).

Zapier / IFTTT: possibilidade de criar webhooks para ações personalizadas (ex: quando concluir a RED, enviar uma mensagem para um canal do Telegram).

A implementação deve ser modular, permitindo adicionar novas integrações via plugins.9.1 Notificações Criativas e Adaptativas
As notificações devem ter tom e conteúdo variável conforme contexto. Exemplo:

Manhã: "Bom dia, [nome]. Sua RED está esperando. Hoje é dia 5 da sua sequência."

Se o usuário não abriu o app até às 10h: "A RED ainda não foi ativada. O que está segurando você?" (tom provocativo, mas respeitoso).

Após falha: "Falhas acontecem. Que tal registrar no Diário e ajustar a rota?"

Conquista: "Parabéns! 30 dias de RED. Prepare-se para um Ritual de Passagem."

Usar agendamento inteligente: não enviar notificações em horários de descanso (identificados por biométrica ou padrão de uso).

9.2 Alarmes com Propósito
O alarme matinal, quando configurado, ao ser desligado abre diretamente a tela da RED com uma mensagem: "Pronto para mais um dia de jogo?"

Se integrado com wearable, o alarme pode ser no momento de sono leve.

9.3 Relatórios Automáticos para Terapeutas/Coaches
Funcionalidade opcional: o usuário pode autorizar a geração de um relatório PDF estruturado com estatísticas de consistência, padrões de falha, insights da IA, para compartilhar com profissional de apoio.

O relatório deve conter apenas dados não sensíveis (sem conteúdo do diário), mas métricas agregadas.

10. CONSIDERAÇÕES TÉCNICAS E PRIORIZAÇÃO
10.1 Stack Sugerida
Mobile: React Native (ou Flutter) para iOS/Android simultâneo.

Backend: Node.js com Express ou Python (FastAPI) para servir APIs e IA.

Banco de dados: PostgreSQL + Redis para cache e filas.

Armazenamento de mídia: AWS S3 ou similar.

IA: modelos em Python (scikit-learn inicial, depois TensorFlow/PyTorch) rodando em containers separados.

Notificações: Firebase Cloud Messaging (Android) e APNS (iOS).

10.2 Priorização por Fases
Fase 1 (MVP)

Módulos núcleo: RED, Centro de Comando, Diário, Biblioteca (com ação), Painel de Consistência, Estação de Desacoplamento, Contratos Silenciosos.

Autenticação, perfil, configurações básicas.

IA básica com regras (não ML) para sugestões.

Fase 2

Mapas Estratégicos.

Notificações criativas e alarmes.

Integração com Google Calendar e Todoist.

Fase 3

Alianças.

Trilha Sonora Personalizada (integração com Spotify e biblioteca própria).

Fase 4

Cápsulas do Tempo.

Rituais de Passagem.

Fase 5

Modo Xadrez.

Integrações biométricas avançadas.

10.3 Requisitos de Desempenho e Segurança
Criptografia em repouso e em trânsito para dados sensíveis (diário, cápsulas).

Conformidade com LGPD/GDPR: opção de exportar e excluir dados.

O app deve funcionar offline para registro da RED e do diário, sincronizando quando houver conexão.

Tempo de resposta das APIs < 200ms para ações crítica
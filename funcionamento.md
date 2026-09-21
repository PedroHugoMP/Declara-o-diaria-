# Funcionamento do programa

## 1. Visao geral

O projeto e uma aplicacao web estatica, executada inteiramente no navegador, sem backend e sem banco de dados remoto. Seu objetivo e apresentar diariamente uma declaracao romantica, uma fotografia, a quantidade de dias de relacionamento, uma playlist, memorias do casal e um link para planos futuros.

A aplicacao e composta por:

- `index.html`: estrutura semantica da pagina;
- `script.js`: logica de negocio, estado, eventos e persistencia;
- `style.css`: layout, temas, responsividade e animacoes;
- `fotos/photos.json`: catalogo das imagens;
- `manifest.json`: configuracao para instalacao como PWA;
- `sw.js`: service worker responsavel pelo cache basico;
- `fotos/`: diretorio que contem as fotografias utilizadas.

## 2. Estrutura da interface

O arquivo `index.html` organiza a interface em areas funcionais.

### 2.1 Cabecalho

O cabecalho apresenta o nome da aplicacao, um subtitulo e o botao de alternancia de tema. O tema inicial e definido pelo atributo `data-theme` do elemento `html`:

```html
<html lang="pt-BR" data-theme="light">
```

O JavaScript altera esse atributo para `light` ou `dark`, e o CSS aplica as variaveis visuais correspondentes.

### 2.2 Area principal

A area principal possui dois cartoes:

1. **Declaracao diaria**
   - `#day-label`: identifica o dia atual;
   - `#reason-title`: apresenta a mensagem principal;
   - `#reason-text`: apresenta o subtitulo ou a classificacao da mensagem;
   - `#counter`: mostra a quantidade de dias desde o inicio do relacionamento;
   - `#date-badge`: apresenta a data atual formatada.

2. **Fotografia do dia**
   - `#photo`: recebe dinamicamente a imagem selecionada;
   - legenda informando que a imagem pode ser clicada.

O `src` da imagem nao e definido inicialmente no HTML. Ele e atribuido pelo JavaScript depois que o catalogo e carregado e uma foto e escolhida.

### 2.3 Playlist do Spotify

Um `iframe` incorpora uma playlist externa do Spotify. O botao associado abre a playlist em uma nova aba do navegador.

O funcionamento da playlist depende de conexao com o Spotify. A reproducao automatica tambem pode ser bloqueada pelo navegador ate que o usuario interaja com a pagina.

### 2.4 Memorias

As memorias sao implementadas com os elementos nativos HTML `<details>` e `<summary>`, formando um acordeao sem dependencia de biblioteca JavaScript.

As categorias disponiveis sao:

- Eventos;
- Livros;
- Series;
- Filmes.

Cada item possui um titulo e uma informacao complementar, como autor, plataforma ou local.

### 2.5 Planos futuros

O cartao final contem um link externo para uma pasta do Google Drive. O link utiliza `target="_blank"` e `rel="noopener noreferrer"`, abrindo o destino em uma nova aba com protecao contra acesso indevido a janela original.

## 3. Fluxo de inicializacao

A execucao comeca pela funcao `init()` em `script.js`. A ordem de inicializacao e:

1. Criar valores iniciais no `localStorage`;
2. Carregar o tema salvo ou o tema preferido pelo sistema operacional;
3. Carregar o catalogo e selecionar a fotografia do dia;
4. Renderizar a mensagem, a data, o contador e a imagem;
5. Inicializar a integracao com o Spotify;
6. Registrar os eventos de interacao;
7. Inicializar as particulas do plano de fundo;
8. Registrar o service worker quando a pagina terminar de carregar.

A funcao `init()` e assincrona porque o catalogo de fotos e lido por meio de `fetch()`.

## 4. Catalogo e selecao de fotografias

### 4.1 Carregamento do catalogo

A funcao `loadPhotoCatalog()` tenta buscar o arquivo:

```text
fotos/photos.json
```

Quando a resposta e valida, o programa utiliza o array `photos`. Os itens podem ser strings ou objetos com as propriedades `src`, `url` ou `name`.

Se a requisicao falhar, o programa usa o array `defaultPhotoCatalog`, definido diretamente em `script.js`.

### 4.2 Montagem da URL

A funcao `resolvePhotoUrl()` converte o nome da imagem em uma URL. URLs HTTP, HTTPS e dados em formato `data:` sao mantidos sem alteracao. Para arquivos locais, o nome e codificado com `encodeURIComponent()` e combinado com a pasta `fotos`.

Isso permite carregar corretamente nomes que contenham espacos, parenteses e outros caracteres especiais.

### 4.3 Selecao sem repeticao imediata

A funcao `getPhotoSelection()` utiliza a data atual no formato `AAAA-MM-DD` e consulta os seguintes valores persistidos:

- `lastDate`: ultima data processada;
- `selectedPhoto`: foto selecionada para a data;
- `photoHistory`: historico das fotos utilizadas.

O algoritmo e:

1. Obter a data atual;
2. Ler a data, a foto e o historico salvos;
3. Se a data salva for igual a hoje e a foto ainda existir no catalogo, reutilizar essa foto;
4. Caso seja um novo dia, remover do catalogo as fotos presentes no historico;
5. Escolher aleatoriamente uma foto restante;
6. Adicionar a foto escolhida ao historico;
7. Salvar a data, a foto e o historico no `localStorage`;
8. Quando todas as fotos forem utilizadas, limpar o historico e iniciar um novo ciclo.

Esse processo evita que a mesma fotografia seja repetida antes de todo o catalogo ser percorrido.

## 5. Mensagens diarias

A funcao `getMessageForToday()` determina o texto apresentado ao usuario.

Primeiro, `getSpecialMessage()` verifica se existe uma mensagem associada a uma data especial. O codigo possui regras para:

- 1 de janeiro;
- 14 de fevereiro;
- 30 de maio;
- 25 de dezembro;
- Dia 1 de qualquer mes;
- Dia 30 de qualquer mes.

Se nao houver uma data especial, o programa procura uma mensagem associada ao nome da foto em `photoMessages`.

As mensagens utilizadas sao registradas em `messageHistory`. Para evitar repeticao, o programa considera as mensagens usadas nos ultimos 15 dias. Se a mensagem atual ja tiver sido utilizada recentemente, ele procura outra mensagem disponivel.

## 6. Renderizacao da declaracao

A funcao `renderReason()` executa as seguintes tarefas:

1. Obtem a data atual;
2. Formata a data com `toLocaleDateString("pt-BR")`;
3. Consulta a mensagem especial;
4. Consulta ou cria a mensagem diaria;
5. Atualiza titulo, subtitulo, contador, data e rotulo do dia;
6. Pre-carrega a imagem selecionada;
7. Troca a imagem atual com uma transicao de opacidade;
8. Define o texto alternativo da imagem.

A imagem e pre-carregada por um objeto `Image`. Quando o carregamento termina, a imagem exibida recebe a classe `is-fading`, seu `src` e atualizado e a classe e removida.

Se a imagem selecionada falhar, o programa tenta usar uma imagem do catalogo padrao. Se o fallback tambem falhar, o texto alternativo informa que a fotografia esta indisponivel.

## 7. Contador de dias

A funcao `getDaysTogether()` considera como inicio do relacionamento a data:

```javascript
const start = new Date(2026, 4, 30);
```

O valor `4` representa maio, pois os meses do JavaScript sao indexados a partir de zero.

A diferenca entre a data atual e a data inicial e convertida de milissegundos para dias:

```javascript
Math.floor(diff / (1000 * 60 * 60 * 24))
```

O resultado e exibido no formato:

```text
Estamos juntos ha ❤️ X dias ❤️
```

Como o calculo usa objetos `Date`, pequenas diferencas de horario ou fuso podem influenciar a virada exata do dia.

## 8. Persistencia no navegador

O programa utiliza `localStorage`, mecanismo de armazenamento local do navegador. Os dados permanecem associados ao dominio ou origem em que a pagina foi aberta.

As chaves utilizadas sao:

- `theme`: tema selecionado;
- `lastDate`: data da ultima selecao diaria;
- `selectedPhoto`: foto associada ao dia atual;
- `photoHistory`: lista de fotos ja utilizadas;
- `messageHistory`: historico das mensagens utilizadas.

Na primeira execucao, `ensureInitialState()` cria valores vazios ou arrays JSON vazios para essas chaves.

Nao existe sincronizacao entre dispositivos. O estado salvo em um navegador nao e automaticamente transferido para outro navegador ou celular.

## 9. Atualizacao automatica da data

A funcao `attachInteractions()` cria um intervalo executado a cada 60 segundos.

O intervalo compara a data atual com `lastDate`. Quando identifica a mudanca de dia, ele:

1. Remove `selectedPhoto`;
2. Remove `lastDate`;
3. Seleciona uma nova foto;
4. Renderiza novamente a declaracao.

Essa atualizacao ocorre somente enquanto a pagina permanece aberta. Se a pagina for fechada durante a virada do dia, o novo conteudo sera calculado na proxima abertura.

## 10. Tema claro e escuro

A funcao `loadTheme()` procura primeiro um tema salvo em `localStorage`. Quando nao existe um tema salvo, ela consulta a preferencia do sistema por meio de:

```javascript
window.matchMedia("(prefers-color-scheme: dark)")
```

O tema e aplicado no elemento raiz:

```javascript
document.documentElement.setAttribute("data-theme", theme);
```

O CSS possui dois conjuntos de variaveis:

- `:root`: tema claro;
- `:root[data-theme="dark"]`: tema escuro.

O botao de tema alterna entre os dois valores e salva a escolha no navegador.

## 11. Efeitos visuais

### 11.1 Explosao de coracoes

Ao clicar na fotografia, o evento chama `createHeartBurst()`.

A funcao cria elementos `span` com simbolos de coracao e os adiciona ao elemento `#heart-layer`. Cada coracao recebe valores aleatorios para:

- Posicao inicial;
- Tamanho;
- Opacidade;
- Duracao da animacao;
- Deslocamento horizontal e vertical;
- Rotacao;
- Escala inicial e final.

A regra CSS `@keyframes float-up` movimenta os coracoes e reduz sua opacidade. Depois do termino da animacao, cada elemento e removido do DOM.

O programa limita a quantidade de coracoes simultaneos a 72. Em dispositivos moveis e quando o usuario prefere reduzir movimentos, a quantidade criada e menor.

### 11.2 Particulas no canvas

A funcao `initParticles()` utiliza o elemento `<canvas id="bg-canvas">` para criar o plano de fundo animado.

Sao geradas 120 particulas. Cada uma possui:

- Posicao horizontal e vertical;
- Velocidade nos dois eixos;
- Tamanho;
- Transparencia.

A cada quadro de animacao:

1. O canvas e limpo;
2. As particulas sao deslocadas;
3. As particulas reagem a proximidade do ponteiro;
4. Particulas proximas sao conectadas por linhas;
5. `requestAnimationFrame()` agenda o proximo quadro.

O canvas ocupa a viewport inteira e permanece atras da interface por meio de `z-index`.

## 12. Integracao com o Spotify

`initSpotifyPlayer()` localiza o iframe e o botao da playlist.

O codigo acrescenta `autoplay=1` ao endereco do iframe. Ao clicar no botao, a playlist e aberta em uma nova aba usando `window.open()`.

A reproducao automatica pode ser bloqueada pelo navegador ou pelo Spotify, principalmente quando nao houve interacao previa do usuario.

## 13. Responsividade e estilos

O arquivo `style.css` utiliza CSS Grid, variaveis customizadas, transicoes e media queries.

Em telas grandes:

- A area principal e dividida em duas colunas;
- Os cartoes inferiores sao organizados em duas colunas;
- A imagem mantem proporcao `4 / 5`.

Em telas com largura de ate 900 pixels:

- As grades passam a utilizar uma coluna.

Em telas com largura de ate 640 pixels:

- O espacamento externo e reduzido;
- Os cartoes recebem menos padding;
- O cabecalho passa a se organizar verticalmente.

O fundo utiliza gradientes, efeitos radiais e transparencia. Os cartoes possuem bordas semitransparentes, sombra e `backdrop-filter`.

## 14. PWA e funcionamento offline

O arquivo `manifest.json` permite que a aplicacao seja reconhecida como uma Progressive Web App. Ele define:

- Nome completo;
- Nome curto;
- URL inicial;
- Modo de exibicao `standalone`;
- Cor de fundo;
- Cor do tema.

O manifesto ainda nao possui icones configurados.

O arquivo `sw.js` registra o cache `motivos-love-v1` e armazena inicialmente:

- `./`;
- `./index.html`;
- `./style.css`;
- `./script.js`;
- `./manifest.json`.

Nas requisicoes, a estrategia e cache-first: o navegador tenta retornar primeiro um recurso armazenado no cache e somente depois acessa a rede.

As fotografias e o arquivo `fotos/photos.json` nao sao adicionados explicitamente ao cache de instalacao. Portanto, o funcionamento offline completo das imagens nao e garantido.

O service worker normalmente exige um contexto seguro, como HTTPS ou `localhost`.

## 15. Pontos tecnicos e limitacoes atuais

### 15.1 Nomes das mensagens e das fotos

As chaves de `photoMessages` usam nomes como `Foto.1.jpeg`, enquanto o catalogo atual usa nomes iniciados por `WhatsApp Image`. Por isso, as mensagens especificas das fotografias atuais podem nao ser encontradas. Nesse caso, o programa utiliza o texto padrao:

```text
Uma nova foto para o seu dia.
```

### 15.2 Prioridade das datas especiais

Em `getSpecialMessage()`, as regras para o dia `01` e o dia `30` sao verificadas antes das datas completas. Consequentemente:

- 1 de janeiro pode usar "Primeiro dia do mes" em vez de "Ano Novo";
- 30 de maio pode usar "Dia 30" em vez de "Aniversario de namoro".

### 15.3 Elementos procurados mas ausentes

O JavaScript procura os elementos `#special-title`, `#special-text` e `#spotify-hint`, mas eles nao existem atualmente no HTML. O codigo verifica a existencia desses elementos antes de altera-los, portanto isso nao gera erro, mas essas partes nao produzem efeito visual.

### 15.4 Estilos sem componentes correspondentes

O CSS possui estilos para modal, galeria e alguns botoes que nao aparecem na estrutura atual do HTML. Esses estilos nao afetam a interface enquanto os elementos correspondentes nao forem adicionados.

### 15.5 Robustez do localStorage

Os historicos sao convertidos diretamente com `JSON.parse()`. Se algum valor armazenado for corrompido manualmente, a inicializacao pode gerar uma excecao. Uma implementacao mais robusta deveria validar ou recuperar valores invalidos.

## 16. Resumo do fluxo completo

O fluxo geral pode ser resumido da seguinte forma:

```text
Carregar index.html
        |
        v
Executar init()
        |
        +--> Inicializar localStorage
        |
        +--> Carregar tema
        |
        +--> Buscar fotos/photos.json
        |       |
        |       +--> Se falhar, usar catalogo padrao
        |
        +--> Selecionar foto do dia sem repeticao imediata
        |
        +--> Escolher mensagem especial ou mensagem da foto
        |
        +--> Renderizar texto, contador, data e imagem
        |
        +--> Configurar Spotify e interacoes
        |
        +--> Iniciar particulas e service worker
        |
        v
Pagina interativa e atualizada a cada mudanca de dia
```

Em resumo, o sistema e um diario romantico diario executado no cliente. Ele combina HTML semantico, CSS responsivo, JavaScript puro, `localStorage`, carregamento de dados JSON, animacoes CSS, canvas e integracoes externas para formar uma experiencia personalizada sem necessidade de servidor de aplicacao.

## 17. Album digital interativo

O projeto tambem possui uma experiencia de album romantico aberta pelo botao **Abrir album**. Ela funciona dentro da mesma pagina, em uma camada modal fullscreen, sem recarregar o documento e sem alterar o fluxo da declaracao diaria.

### 17.1 Estrutura e abertura

O HTML adiciona:

- Um cartao de entrada na secao inferior;
- O modal `#album-modal`;
- Uma capa frontal com o texto "PARA SEMPRE", a frase da historia e os nomes Pedro & Caio;
- Um palco central com livro, paginas duplas, lombada visual e controles;
- Botoes para pagina anterior, proxima pagina, reinicio e fechamento.

Ao abrir:

1. A pagina atual e carregada de `albumLastPage`;
2. O modal recebe `aria-hidden="false"`;
3. O scroll do documento e bloqueado;
4. O foco e enviado para o livro;
5. A capa ou a pagina salva e renderizada.

Ao fechar, o modal e ocultado, o scroll e liberado e o foco retorna ao botao que abriu o album.

### 17.2 Modelo de dados

As paginas ficam concentradas no array `albumPages`, em `script.js`. Cada item representa uma pagina dupla e possui os objetos `left` e `right`:

```javascript
{
        type: "spread",
        left: {
                layout: "photo-feature",
                title: "Titulo",
                text: "Texto da pagina",
                image: 1,
                caption: "Legenda"
        },
        right: {
                layout: "letter",
                title: "Carta",
                paragraphs: ["Primeiro paragrafo", "Segundo paragrafo"]
        }
}
```

Para adicionar uma nova pagina dupla, basta inserir um novo objeto no array. O campo `layout` escolhe a composicao visual. Os layouts existentes incluem `intro`, `letter`, `photo-feature`, `photo-poster`, `collage`, `quote`, `star-map`, `memory`, `photo-full`, `note`, `polaroid`, `closing` e `photo-final`.

### 17.3 Fotografias do album

O album reutiliza o catalogo carregado por `loadPhotoCatalog()` e o resolvedor existente `resolvePhotoUrl()`. Em vez de duplicar nomes de arquivos, cada pagina pode referenciar uma fotografia pelo indice no catalogo:

```javascript
image: 3
```

Tambem e possivel passar diretamente uma URL ou nome de arquivo. Se a imagem nao existir, o erro e registrado no console e a pagina exibe um placeholder elegante sem interromper a navegacao.

### 17.4 Contador e persistencia

O contador do album chama a mesma funcao `getDaysTogether()` usada na pagina principal. Nao existe um segundo calculo de relacionamento.

O album utiliza somente uma nova chave de armazenamento:

- `albumLastPage`: indice da pagina dupla atualmente visitada;

As chaves existentes de tema, foto e mensagens permanecem inalteradas. O botao **Inicio** grava `0` e permite recomecar pela capa.

### 17.5 Virada e navegacao

`nextAlbumPage()`, `previousAlbumPage()` e `goToAlbumPage()` controlam a navegacao. Durante a mudanca:

- A pagina gira em torno do eixo central;
- A perspectiva 3D e aplicada com `perspective` e `transform-style: preserve-3d`;
- A pagina utiliza `backface-visibility`;
- A sombra muda durante a rotacao;
- A nova pagina e renderizada ao final da animacao.

O album aceita:

- Clique no lado esquerdo para voltar;
- Clique no lado direito para avancar;
- Botao anterior e proximo;
- `ArrowLeft` e `ArrowRight` no teclado;
- `Escape` para fechar.

Em telas menores, somente uma pagina e exibida por vez, mantendo o mesmo estado e navegacao.

### 17.6 Acessibilidade e movimento reduzido

Os controles possuem `aria-label`, o modal informa `role="dialog"` e `aria-modal="true"`, as imagens recebem texto alternativo e o livro pode receber foco.

Quando o navegador indica `prefers-reduced-motion: reduce`, a duracao da virada e reduzida drasticamente e as transicoes visuais sao removidas ou simplificadas.

### 17.7 Arquivos alterados para o album

- `index.html`: ponto de entrada, modal e controles;
- `script.js`: dados, renderizacao, navegacao, persistencia e acessibilidade comportamental;
- `style.css`: capa, papel, lombada, paginas, sombras, mapa estelar, responsividade e animacao 3D;
- `sw.js`: cache atualizado para `motivos-love-v2`, garantindo que a versao com album seja distribuida pelo PWA.

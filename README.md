# Monitoramento Atmosférico do Espírito Santo

Aplicação interativa para o Google Earth Engine (GEE) que visualiza produtos atmosféricos do sensor TROPOMI, a bordo do satélite Sentinel-5P, sobre o estado do Espírito Santo e seus municípios.

O painel permite escolher o parâmetro atmosférico, consultar um único dia ou um intervalo de datas e selecionar todo o estado ou um município. Para cada consulta, o script filtra a coleção, calcula a média temporal das imagens disponíveis e recorta o resultado para a área escolhida.

## Estrutura

- `gee/monitoramento_atmosferico_es.js`: aplicação pronta para o Code Editor do GEE.
- `docs/metodologia.md`: roteiro metodológico, bases utilizadas, parâmetros e limitações.

## Como executar

1. Abra o [Google Earth Engine Code Editor](https://code.earthengine.google.com/).
2. Crie um novo script e cole o conteúdo de `gee/monitoramento_atmosferico_es.js`.
3. Confirme que sua conta possui acesso ao asset `projects/ee-aguascapixabas/assets/MUNICIPIOS_ES`.
4. Execute o script e configure a consulta no painel exibido no mapa.

O asset municipal precisa conter o campo `nome`, usado para preencher a lista de municípios. O código depende dos objetos globais `ee`, `ui`, `Map` e `print` disponibilizados pelo Code Editor e, por isso, não é executável diretamente em Node.js.

## Escopo

Os resultados representam médias de produtos orbitais de coluna atmosférica ou índice de aerossóis. As escalas de cores foram definidas para visualização e não equivalem diretamente aos padrões legais de concentração da qualidade do ar em superfície.

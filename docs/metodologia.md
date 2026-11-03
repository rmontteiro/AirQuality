# Roteiro metodológico e bases de dados

## Objetivo

O script disponibiliza uma interface cartográfica para consulta exploratória de constituintes atmosféricos no Espírito Santo. A análise pode abranger todo o estado ou um município e pode representar um dia ou a média de um período escolhido pelo usuário.

## Bases utilizadas

### Limites territoriais

O recorte espacial vem do asset `projects/ee-aguascapixabas/assets/MUNICIPIOS_ES`, carregado como `ee.FeatureCollection`. A união geométrica das feições forma o território estadual. Para consultas municipais, o script filtra a coleção pelo atributo `nome` e usa a geometria da feição correspondente.

Como esse asset pertence a um projeto específico, outros usuários precisam receber acesso ou substituir o identificador por uma base territorial equivalente que contenha o campo `nome`.

### Produtos atmosféricos

Todos os produtos são imagens de nível 3 do Sentinel-5P/TROPOMI, disponíveis no catálogo do Earth Engine.

| Parâmetro | Coleção GEE | Banda | Produto | Unidade exibida | Início configurado |
| --- | --- | --- | --- | --- | --- |
| Monóxido de carbono (CO) | `COPERNICUS/S5P/OFFL/L3_CO` | `CO_column_number_density` | OFFL | mol/m² | 28/06/2018 |
| Dióxido de nitrogênio (NO₂) | `COPERNICUS/S5P/NRTI/L3_NO2` | `tropospheric_NO2_column_number_density` | NRTI | mol/m² | 10/07/2018 |
| Formaldeído (HCHO) | `COPERNICUS/S5P/NRTI/L3_HCHO` | `tropospheric_HCHO_column_number_density` | NRTI | mol/m² | 02/10/2018 |
| Dióxido de enxofre (SO₂) | `COPERNICUS/S5P/NRTI/L3_SO2` | `SO2_column_number_density` | NRTI | mol/m² | 10/07/2018 |
| Metano (CH₄) | `COPERNICUS/S5P/OFFL/L3_CH4` | `CH4_column_volume_mixing_ratio_dry_air` | OFFL | ppb | 08/02/2019 |
| Ozônio (O₃) | `COPERNICUS/S5P/NRTI/L3_O3` | `O3_column_number_density` | NRTI | mol/m² | 10/07/2018 |
| Índice de aerossóis absorventes | `COPERNICUS/S5P/NRTI/L3_AER_AI` | `absorbing_aerosol_index` | NRTI | adimensional | 10/07/2018 |

`OFFL` identifica produtos processados em modo offline; `NRTI`, produtos de disponibilização próxima ao tempo real. Essa diferença deve ser considerada em comparações de atualidade e consistência temporal.

## Sequência de processamento

1. O asset municipal é carregado e suas geometrias são combinadas para formar o limite estadual.
2. O usuário escolhe o parâmetro, o modo temporal e o território.
3. A coleção correspondente é reduzida à banda configurada.
4. `filterDate` aplica o intervalo temporal. Para um único dia, o limite final é o dia seguinte. Para um período, a data final escolhida recebe um dia adicional, pois o limite final de `filterDate` é exclusivo.
5. `filterBounds` mantém as imagens que intersectam a área selecionada.
6. O número de imagens é avaliado; a rotina para quando a coleção está vazia.
7. `mean()` calcula a média temporal, pixel a pixel, das imagens disponíveis.
8. `clip()` limita a imagem resultante ao estado ou município.
9. O mapa exibe o raster, o contorno territorial, uma legenda específica e a quantidade de imagens utilizadas.

Por padrão, o seletor usa uma data de referência dez dias anterior à execução. No modo de período, a janela inicial cobre os 30 dias anteriores a essa referência. Essas escolhas reduzem a chance de selecionar dias ainda sem produto disponível, mas não garantem cobertura válida.

## Escalas de visualização

As faixas são fixadas no código: CO de 0 a 0,05 mol/m²; NO₂ de 0 a 0,0002 mol/m²; HCHO de 0 a 0,0003 mol/m²; SO₂ de 0 a 0,0005 mol/m²; CH₄ de 1.750 a 1.900 ppb; O₃ de 0 a 0,15 mol/m²; e índice de aerossóis de -1 a 2. Todos usam uma sequência de preto, azul, roxo, ciano, verde, amarelo e vermelho.

Esses limites controlam somente a renderização. Valores fora da faixa permanecem na imagem, mas aparecem saturados nas cores extremas.

## Limitações e cuidados de interpretação

- O resultado é uma média temporal por pixel; o script não calcula estatísticas municipais nem séries temporais.
- Não há filtro adicional por banda de qualidade, cobertura de nuvens ou incerteza além das máscaras já presentes nos produtos do catálogo.
- A resolução, a frequência de revisita e a disponibilidade de pixels variam entre os produtos.
- Grandezas de coluna atmosférica não representam diretamente concentrações medidas em superfície.
- A mistura de coleções NRTI e OFFL pode introduzir diferenças de latência e processamento entre parâmetros.
- O script não exporta imagens ou tabelas e não persiste os resultados fora da sessão do GEE.
- A média simples atribui o mesmo peso a todas as observações válidas; não há ponderação pela qualidade ou pelo tempo.

Antes de usar os resultados em análises regulatórias ou epidemiológicas, recomenda-se documentar a versão dos produtos, aplicar critérios de qualidade adequados a cada coleção e comparar os resultados com estações de monitoramento em superfície.

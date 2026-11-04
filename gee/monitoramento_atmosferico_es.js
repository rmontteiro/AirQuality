// ============================================================================
// MONITORAMENTO ATMOSFÉRICO - ESPÍRITO SANTO
// GOOGLE EARTH ENGINE
// SENTINEL-5P / TROPOMI
//
// VERSÃO COM SUAVIZAÇÃO ESPACIAL E ESCALA LOGARÍTMICA
//
// FUNCIONALIDADES:
//
// 1. Painel de controle ancorado no canto superior esquerdo.
// 2. Painel minimizável / expansível.
// 3. Seleção do parâmetro atmosférico.
// 4. Seleção temporal:
//      - Um dia
//      - Período
// 5. Seleção dinâmica de data.
// 6. Seleção territorial:
//      - Estado inteiro
//      - Município específico
// 7. Municípios obtidos automaticamente do campo "nome".
// 8. Legenda dinâmica específica para cada parâmetro.
// 9. Apenas a legenda correspondente ao parâmetro selecionado é mostrada.
// 10. Legenda contínua compatível com a transformação logarítmica.
// 11. Suavização espacial bicúbica e gaussiana para visualização.
// 12. Escala logarítmica deslocada, inclusive para valores negativos.
// 13. Asset territorial:
//      projects/ee-aguascapixabas/assets/MUNICIPIOS_ES
//
// ============================================================================



// ============================================================================
// 1. ÁREA DE INTERESSE
// ============================================================================

var municipiosES = ee.FeatureCollection(
  'projects/ee-aguascapixabas/assets/MUNICIPIOS_ES'
);


// Geometria correspondente ao território estadual.
var territorioES = municipiosES.geometry();


// Centralização inicial.
Map.centerObject(municipiosES, 8);



// ============================================================================
// 2. CONFIGURAÇÃO DOS PARÂMETROS ATMOSFÉRICOS
// ============================================================================

var parametros = {

  'Monóxido de Carbono (CO)': {

    collection:
      'COPERNICUS/S5P/OFFL/L3_CO',

    band:
      'CO_column_number_density',

    minDate:
      '2018-06-28',

    min:
      0,

    max:
      0.05,

    palette: [
      'black',
      'blue',
      'purple',
      'cyan',
      'green',
      'yellow',
      'red'
    ],

    legendTitle:
      'Monóxido de Carbono (CO)',

    legendSubtitle:
      'Densidade da coluna atmosférica',

    unit:
      'mol/m²',

    legendLabels: [
      '0,000',
      '0,008',
      '0,017',
      '0,025',
      '0,033',
      '0,042',
      '0,050'
    ]

  },


  'Dióxido de Nitrogênio (NO2)': {

    collection:
      'COPERNICUS/S5P/NRTI/L3_NO2',

    band:
      'tropospheric_NO2_column_number_density',

    minDate:
      '2018-07-10',

    min:
      0,

    max:
      0.0002,

    palette: [
      'black',
      'blue',
      'purple',
      'cyan',
      'green',
      'yellow',
      'red'
    ],

    legendTitle:
      'Dióxido de Nitrogênio (NO₂)',

    legendSubtitle:
      'Coluna troposférica',

    unit:
      'mol/m²',

    legendLabels: [
      '0',
      '0,000033',
      '0,000067',
      '0,000100',
      '0,000133',
      '0,000167',
      '0,000200'
    ]

  },


  'Formaldeído (HCHO)': {

    collection:
      'COPERNICUS/S5P/NRTI/L3_HCHO',

    band:
      'tropospheric_HCHO_column_number_density',

    minDate:
      '2018-10-02',

    min:
      0,

    max:
      0.0003,

    palette: [
      'black',
      'blue',
      'purple',
      'cyan',
      'green',
      'yellow',
      'red'
    ],

    legendTitle:
      'Formaldeído (HCHO)',

    legendSubtitle:
      'Coluna troposférica',

    unit:
      'mol/m²',

    legendLabels: [
      '0',
      '0,000050',
      '0,000100',
      '0,000150',
      '0,000200',
      '0,000250',
      '0,000300'
    ]

  },


  'Dióxido de Enxofre (SO2)': {

    collection:
      'COPERNICUS/S5P/NRTI/L3_SO2',

    band:
      'SO2_column_number_density',

    minDate:
      '2018-07-10',

    min:
      0,

    max:
      0.0005,

    palette: [
      'black',
      'blue',
      'purple',
      'cyan',
      'green',
      'yellow',
      'red'
    ],

    legendTitle:
      'Dióxido de Enxofre (SO₂)',

    legendSubtitle:
      'Densidade da coluna atmosférica',

    unit:
      'mol/m²',

    legendLabels: [
      '0',
      '0,000083',
      '0,000167',
      '0,000250',
      '0,000333',
      '0,000417',
      '0,000500'
    ]

  },


  'Metano (CH4)': {

    collection:
      'COPERNICUS/S5P/OFFL/L3_CH4',

    band:
      'CH4_column_volume_mixing_ratio_dry_air',

    minDate:
      '2019-02-08',

    min:
      1750,

    max:
      1900,

    palette: [
      'black',
      'blue',
      'purple',
      'cyan',
      'green',
      'yellow',
      'red'
    ],

    legendTitle:
      'Metano (CH₄)',

    legendSubtitle:
      'Razão de mistura em ar seco',

    unit:
      'ppb',

    legendLabels: [
      '1750',
      '1775',
      '1800',
      '1825',
      '1850',
      '1875',
      '1900'
    ]

  },


  'Ozônio (O3)': {

    collection:
      'COPERNICUS/S5P/NRTI/L3_O3',

    band:
      'O3_column_number_density',

    minDate:
      '2018-07-10',

    min:
      0,

    max:
      0.15,

    palette: [
      'black',
      'blue',
      'purple',
      'cyan',
      'green',
      'yellow',
      'red'
    ],

    legendTitle:
      'Ozônio (O₃)',

    legendSubtitle:
      'Coluna total de ozônio',

    unit:
      'mol/m²',

    legendLabels: [
      '0,000',
      '0,025',
      '0,050',
      '0,075',
      '0,100',
      '0,125',
      '0,150'
    ]

  },


  'Índice de Aerossóis': {

    collection:
      'COPERNICUS/S5P/NRTI/L3_AER_AI',

    band:
      'absorbing_aerosol_index',

    minDate:
      '2018-07-10',

    min:
      -1,

    max:
      2,

    palette: [
      'black',
      'blue',
      'purple',
      'cyan',
      'green',
      'yellow',
      'red'
    ],

    legendTitle:
      'Índice de Aerossóis',

    legendSubtitle:
      'Absorbing Aerosol Index',

    unit:
      'adimensional',

    legendLabels: [
      '-1,0',
      '-0,5',
      '0,0',
      '0,5',
      '1,0',
      '1,5',
      '2,0'
    ]

  }

};



// ============================================================================
// 3. PAINEL PRINCIPAL DE CONTROLE
// ============================================================================

var painel = ui.Panel({

  layout:
    ui.Panel.Layout.flow('vertical'),

  style: {

    position:
      'top-left',

    width:
      '350px',

    padding:
      '5px',

    margin:
      '0px',

    backgroundColor:
      'rgba(255,255,255,0.95)',

    border:
      '1px solid #888888'

  }

});



// ============================================================================
// 4. CABEÇALHO
// ============================================================================

var tituloPainel = ui.Label({

  value:
    'Monitoramento Atmosférico - ES',

  style: {

    fontSize:
      '15px',

    fontWeight:
      'bold',

    stretch:
      'horizontal',

    margin:
      '2px 3px 2px 1px',

    padding:
      '0px'

  }

});


var botaoMinimizar = ui.Button({

  label:
    '−',

  style: {

    width:
      '32px',

    height:
      '26px',

    margin:
      '0px',

    padding:
      '0px'

  }

});


var cabecalho = ui.Panel({

  widgets: [
    tituloPainel,
    botaoMinimizar
  ],

  layout:
    ui.Panel.Layout.flow('horizontal'),

  style: {

    stretch:
      'horizontal',

    margin:
      '0px',

    padding:
      '0px'

  }

});


painel.add(cabecalho);



// ============================================================================
// 5. CONTEÚDO RETRÁTIL
// ============================================================================

var conteudoPainel = ui.Panel({

  layout:
    ui.Panel.Layout.flow('vertical'),

  style: {

    stretch:
      'horizontal',

    margin:
      '0px',

    padding:
      '0px'

  }

});


painel.add(conteudoPainel);



// ============================================================================
// 6. MINIMIZAR / EXPANDIR
// ============================================================================

var painelAberto = true;


botaoMinimizar.onClick(function() {


  painelAberto =
    !painelAberto;


  conteudoPainel
    .style()
    .set(
      'shown',
      painelAberto
    );


  botaoMinimizar.setLabel(

    painelAberto
      ? '−'
      : '+'

  );


  painel
    .style()
    .set(
      'width',

      painelAberto
        ? '350px'
        : '275px'
    );

});



// ============================================================================
// 7. SUBTÍTULO
// ============================================================================

conteudoPainel.add(

  ui.Label({

    value:
      'Sentinel-5P / TROPOMI',

    style: {

      fontSize:
        '11px',

      margin:
        '0 0 5px 1px',

      padding:
        '0px'

    }

  })

);



// ============================================================================
// 8. PARÂMETRO ATMOSFÉRICO
// ============================================================================

conteudoPainel.add(

  ui.Label({

    value:
      '1. Parâmetro atmosférico:',

    style: {

      fontWeight:
        'bold',

      margin:
        '3px 0 2px 0',

      padding:
        '0px'

    }

  })

);


var parametroSelect = ui.Select({

  items:
    Object.keys(parametros),

  value:
    'Dióxido de Nitrogênio (NO2)',

  placeholder:
    'Selecione o parâmetro',

  style: {

    stretch:
      'horizontal',

    margin:
      '0px'

  }

});


conteudoPainel.add(parametroSelect);



// ============================================================================
// 9. DISPONIBILIDADE TEMPORAL
// ============================================================================

var disponibilidadeLabel = ui.Label({

  value:
    'Dados disponíveis desde: 10/07/2018',

  style: {

    fontSize:
      '10px',

    margin:
      '2px 0 4px 0',

    padding:
      '0px'

  }

});


conteudoPainel.add(disponibilidadeLabel);



// ============================================================================
// 10. TIPO DE CONSULTA TEMPORAL
// ============================================================================

conteudoPainel.add(

  ui.Label({

    value:
      '2. Tipo de consulta temporal:',

    style: {

      fontWeight:
        'bold',

      margin:
        '3px 0 2px 0',

      padding:
        '0px'

    }

  })

);


var tipoTemporalSelect = ui.Select({

  items: [
    'Um dia',
    'Período'
  ],

  value:
    'Um dia',

  style: {

    stretch:
      'horizontal',

    margin:
      '0px'

  }

});


conteudoPainel.add(tipoTemporalSelect);



// ============================================================================
// 11. PAINEL DINÂMICO DE DATAS
// ============================================================================

var painelDatas = ui.Panel({

  layout:
    ui.Panel.Layout.flow('vertical'),

  style: {

    stretch:
      'horizontal',

    margin:
      '2px 0 4px 0',

    padding:
      '0px'

  }

});


conteudoPainel.add(painelDatas);


var seletorDataInicio;
var seletorDataFim;



// ============================================================================
// 12. FUNÇÕES AUXILIARES DE DATA
// ============================================================================

var hoje = new Date();



function obterDataReferencia() {


  return new Date(

    hoje.getTime()

    -

    10 *
    24 *
    60 *
    60 *
    1000

  );

}



function formatarDataBR(timestamp) {


  var data =
    new Date(timestamp);


  var dia =
    data.getUTCDate();


  var mes =
    data.getUTCMonth() + 1;


  var ano =
    data.getUTCFullYear();


  if (dia < 10) {
    dia = '0' + dia;
  }


  if (mes < 10) {
    mes = '0' + mes;
  }


  return (

    dia +
    '/' +
    mes +
    '/' +
    ano

  );

}



// ============================================================================
// 13. CRIAÇÃO DO SELETOR TEMPORAL
// ============================================================================

function criarSeletorDatas() {


  var nomeParametro =
    parametroSelect.getValue();


  var config =
    parametros[nomeParametro];


  var tipoTemporal =
    tipoTemporalSelect.getValue();


  var dataReferencia =
    obterDataReferencia();


  var dataMinima =
    new Date(
      config.minDate + 'T00:00:00Z'
    );


  if (
    dataReferencia.getTime()
    <
    dataMinima.getTime()
  ) {

    dataReferencia =
      dataMinima;

  }



  // =========================================================================
  // UM DIA
  // =========================================================================

  if (
    tipoTemporal ===
    'Um dia'
  ) {


    var tituloDia = ui.Label({

      value:
        '3. Selecione o dia:',

      style: {

        fontWeight:
          'bold',

        margin:
          '2px 0 1px 0',

        padding:
          '0px'

      }

    });


    seletorDataInicio = ui.DateSlider({

      start:
        config.minDate,

      end:
        hoje,

      value:
        dataReferencia,

      period:
        1,

      style: {

        stretch:
          'horizontal',

        margin:
          '0px'

      }

    });


    painelDatas
      .widgets()
      .reset([

        tituloDia,

        seletorDataInicio

      ]);

  }



  // =========================================================================
  // PERÍODO
  // =========================================================================

  else {


    var tituloPeriodo = ui.Label({

      value:
        '3. Selecione a data inicial e final:',

      style: {

        fontWeight:
          'bold',

        margin:
          '2px 0 1px 0',

        padding:
          '0px'

      }

    });


    var inicioPeriodo =
      new Date(

        dataReferencia.getTime()

        -

        30 *
        24 *
        60 *
        60 *
        1000

      );


    if (
      inicioPeriodo.getTime()
      <
      dataMinima.getTime()
    ) {

      inicioPeriodo =
        dataMinima;

    }


    seletorDataInicio = ui.DateSlider({
      start: config.minDate,
      end: hoje,
      value: inicioPeriodo,
      period: 1,
      style: { stretch: 'horizontal', margin: '0px' }
    });

    seletorDataFim = ui.DateSlider({
      start: config.minDate,
      end: hoje,
      value: dataReferencia,
      period: 1,
      style: { stretch: 'horizontal', margin: '0px' }
    });


    painelDatas
      .widgets()
      .reset([

        tituloPeriodo,
        ui.Label({value: 'Início:', style: {fontSize: '11px', margin: '2px 0 0 1px'}}),
        seletorDataInicio,
        ui.Label({value: 'Fim:', style: {fontSize: '11px', margin: '2px 0 0 1px'}}),
        seletorDataFim

      ]);

  }

}



// ============================================================================
// 14. CRIAÇÃO INICIAL DO SELETOR TEMPORAL
// ============================================================================

criarSeletorDatas();



// ============================================================================
// 15. ALTERAÇÃO DO TIPO TEMPORAL
// ============================================================================

tipoTemporalSelect.onChange(

  function() {

    criarSeletorDatas();

  }

);



// ============================================================================
// 16. SELEÇÃO DA ÁREA
// ============================================================================

conteudoPainel.add(

  ui.Label({

    value:
      '4. Área de análise:',

    style: {

      fontWeight:
        'bold',

      margin:
        '3px 0 2px 0',

      padding:
        '0px'

    }

  })

);


var territorioSelect = ui.Select({

  items: [
    'Estado inteiro',
    'Município específico'
  ],

  value:
    'Estado inteiro',

  style: {

    stretch:
      'horizontal',

    margin:
      '0px'

  }

});


conteudoPainel.add(territorioSelect);



// ============================================================================
// 17. SELEÇÃO MUNICIPAL
// ============================================================================

var municipioTitulo = ui.Label({

  value:
    '5. Município:',

  style: {

    fontWeight:
      'bold',

    margin:
      '3px 0 2px 0',

    padding:
      '0px',

    shown:
      false

  }

});


var municipioSelect = ui.Select({

  items: [],

  placeholder:
    'Carregando municípios...',

  style: {

    stretch:
      'horizontal',

    margin:
      '0px',

    shown:
      false

  }

});


conteudoPainel.add(municipioTitulo);

conteudoPainel.add(municipioSelect);



// ============================================================================
// 18. CARREGAMENTO AUTOMÁTICO DOS MUNICÍPIOS
// ============================================================================

var listaMunicipios =
  municipiosES

    .filter(
      ee.Filter.notNull([
        'nome'
      ])
    )

    .aggregate_array(
      'nome'
    )

    .distinct()

    .sort();



listaMunicipios.evaluate(

  function(lista) {


    municipioSelect
      .items()
      .reset(lista);


    municipioSelect
      .setPlaceholder(
        'Selecione o município'
      );

  }

);



// ============================================================================
// 19. MOSTRAR / ESCONDER MUNICÍPIO
// ============================================================================

territorioSelect.onChange(

  function(valor) {


    var mostrarMunicipio =

      valor ===
      'Município específico';


    municipioTitulo
      .style()
      .set(
        'shown',
        mostrarMunicipio
      );


    municipioSelect
      .style()
      .set(
        'shown',
        mostrarMunicipio
      );

  }

);



// ============================================================================
// 20. STATUS
// ============================================================================

var statusLabel = ui.Label({

  value:
    'Configure a consulta e clique em PROCESSAR.',

  style: {

    fontSize:
      '10px',

    margin:
      '4px 0 3px 0',

    padding:
      '0px'

  }

});


conteudoPainel.add(statusLabel);



// ============================================================================
// 21. BOTÃO PROCESSAR
// ============================================================================

var botaoProcessar = ui.Button({

  label:
    'PROCESSAR',

  style: {

    stretch:
      'horizontal',

    fontWeight:
      'bold',

    margin:
      '4px 0 2px 0',

    padding:
      '0px'

  }

});


conteudoPainel.add(botaoProcessar);



// ============================================================================
// 22. PAINEL DE LEGENDA DINÂMICA
// ============================================================================

var painelLegenda = ui.Panel({

  layout:
    ui.Panel.Layout.flow('vertical'),

  style: {

    position:
      'bottom-right',

    width:
      '220px',

    padding:
      '7px',

    margin:
      '5px',

    backgroundColor:
      'rgba(255,255,255,0.93)',

    border:
      '1px solid #888888'

  }

});



// ============================================================================
// 23. FUNÇÃO DE ATUALIZAÇÃO DA LEGENDA
// ============================================================================

function obterEscalaLog(config) {

  var amplitude = config.max - config.min;
  var epsilon = amplitude * 0.01;

  if (epsilon <= 0) {
    epsilon = 1e-10;
  }

  var minLog = Math.log(epsilon) / Math.LN10;
  var maxLog = Math.log(amplitude + epsilon) / Math.LN10;
  var meioLog = (minLog + maxLog) / 2;
  var valorCentral =
    config.min + Math.pow(10, meioLog) - epsilon;

  return {
    epsilon: epsilon,
    min: minLog,
    max: maxLog,
    valorCentral: valorCentral
  };

}


function formatarValorLegenda(valor, config) {

  var amplitude = Math.abs(config.max - config.min);
  var casasDecimais =
    amplitude < 0.001 ? 6 :
    amplitude < 1 ? 3 :
    0;

  return valor
    .toFixed(casasDecimais)
    .replace('.', ',');

}


function atualizarLegenda(nomeParametro) {


  var config =
    parametros[nomeParametro];

  var escalaLog =
    obterEscalaLog(config);


  // Limpa a legenda anterior.
  painelLegenda.clear();



  // =========================================================================
  // TÍTULO
  // =========================================================================

  painelLegenda.add(

    ui.Label({

      value:
        config.legendTitle,

      style: {

        fontWeight:
          'bold',

        fontSize:
          '13px',

        margin:
          '0 0 2px 0',

        padding:
          '0px'

      }

    })

  );



  painelLegenda.add(

    ui.Label({

      value:
        'Visualização: log10 deslocada',

      style: {

        fontSize:
          '9px',

        margin:
          '0 0 5px 0',

        padding:
          '0px'

      }

    })

  );



  // =========================================================================
  // SUBTÍTULO
  // =========================================================================

  painelLegenda.add(

    ui.Label({

      value:
        config.legendSubtitle,

      style: {

        fontSize:
          '10px',

        margin:
          '0 0 1px 0',

        padding:
          '0px'

      }

    })

  );



  // =========================================================================
  // UNIDADE
  // =========================================================================

  painelLegenda.add(

    ui.Label({

      value:
        'Unidade: ' + config.unit,

      style: {

        fontSize:
          '10px',

        margin:
          '0 0 5px 0',

        padding:
          '0px'

      }

    })

  );



  // =========================================================================
  // GRADIENTE DA LEGENDA (CONTÍNUO)
  // =========================================================================

  var gradiente = ui.Thumbnail({
    image: ee.Image.pixelLonLat().select('longitude'),
    params: {
      bbox: [0, 0, 1, 0.1],
      dimensions: '200x12',
      format: 'png',
      min: 0,
      max: 1,
      palette: config.palette
    },
    style: {
      stretch: 'horizontal',
      margin: '0px 5px 2px 5px'
    }
  });

  painelLegenda.add(gradiente);



  // =========================================================================
  // RÓTULOS DA ESCALA
  // =========================================================================

  var painelRotulos = ui.Panel({
    widgets: [
      ui.Label(config.legendLabels[0], {fontSize: '10px', margin: '0px'}),
      ui.Label(formatarValorLegenda(escalaLog.valorCentral, config), {
        fontSize: '10px',
        textAlign: 'center',
        stretch: 'horizontal',
        margin: '0px'
      }),
      ui.Label(config.legendLabels[config.legendLabels.length - 1], {fontSize: '10px', margin: '0px'})
    ],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      margin: '0px 5px 5px 5px'
    }
  });

  painelLegenda.add(painelRotulos);



  // =========================================================================
  // AVISO
  // =========================================================================

  painelLegenda.add(

    ui.Label({

      value:
        'Escala de visualização do produto orbital. ' +
        'Não corresponde diretamente às faixas legais ' +
        'de concentração da qualidade do ar.',

      style: {

        fontSize:
          '9px',

        margin:
          '5px 0 0 0',

        padding:
          '0px'

      }

    })

  );

}



// ============================================================================
// 24. ALTERAÇÃO DO PARÂMETRO
// ============================================================================

parametroSelect.onChange(

  function(nomeParametro) {


    var config =
      parametros[nomeParametro];


    var partes =
      config.minDate.split('-');


    // Atualizar disponibilidade temporal.
    disponibilidadeLabel.setValue(

      'Dados disponíveis desde: '

      +

      partes[2] +
      '/' +
      partes[1] +
      '/' +
      partes[0]

    );


    // Atualizar seletor de datas.
    criarSeletorDatas();


    // Atualizar legenda específica.
    atualizarLegenda(
      nomeParametro
    );

  }

);



// ============================================================================
// 25. OBTER ÁREA SELECIONADA
// ============================================================================

function obterAreaSelecionada() {


  var tipoTerritorio =
    territorioSelect.getValue();



  // =========================================================================
  // ESTADO
  // =========================================================================

  if (
    tipoTerritorio ===
    'Estado inteiro'
  ) {


    return {

      roi:
        territorioES,

      nome:
        'Estado do Espírito Santo',

      tipo:
        'Estado'

    };

  }



  // =========================================================================
  // MUNICÍPIO
  // =========================================================================

  var municipio =
    municipioSelect.getValue();


  if (!municipio) {

    return null;

  }



  var municipioFC =
    municipiosES.filter(

      ee.Filter.eq(
        'nome',
        municipio
      )

    );



  return {

    roi:
      municipioFC.geometry(),

    nome:
      municipio,

    tipo:
      'Município'

  };

}



// ============================================================================
// 26. GERAR VISUALIZAÇÃO
// ============================================================================

function gerarVisualizacao(

  nomeParametro,

  config,

  area,

  startDate,

  endDate,

  textoPeriodo,

  modoTemporal

) {


  statusLabel.setValue(
    'Processando...'
  );



  // =========================================================================
  // COLEÇÃO
  // =========================================================================

  var colecao =
    ee.ImageCollection(
      config.collection
    )

    .select(
      config.band
    )

    .filterDate(
      startDate,
      endDate
    )

    .filterBounds(
      area.roi
    );



  // =========================================================================
  // VERIFICAÇÃO
  // =========================================================================

  colecao.size().evaluate(

    function(numeroImagens) {


      if (
        numeroImagens === 0
      ) {


        statusLabel.setValue(

          'Nenhuma imagem encontrada para esta seleção.'

        );


        return;

      }



      // =========================================================================
      // IMAGEM RESULTANTE
      // =========================================================================

      var imagemOriginal = colecao.mean();

      // Suavização cartográfica para continuidade visual. Este procedimento
      // não é krigagem, pois não estima nem aplica um variograma.
      var imagemSuavizada = imagemOriginal
        .resample('bicubic')
        .focalMean({
          radius: 2000,
          units: 'meters',
          kernelType: 'gaussian'
        });

      // A imagem é deslocada pelo mínimo da escala antes do log10. Isso
      // mantém o domínio positivo e permite visualizar parâmetros com valores
      // negativos, como o índice de aerossóis.
      var escalaLog = obterEscalaLog(config);
      var imagemLog = imagemSuavizada
        .max(config.min)
        .subtract(config.min)
        .add(escalaLog.epsilon)
        .log10();

      var imagemFinal = imagemLog.clip(area.roi);



      // =========================================================================
      // LIMPAR RESULTADOS ANTERIORES
      // =========================================================================

      Map.layers().reset([]);



      // =========================================================================
      // CAMADA ATMOSFÉRICA
      // =========================================================================

      Map.addLayer(

        imagemFinal,

        {

          min:
            escalaLog.min,

          max:
            escalaLog.max,

          palette:
            config.palette

        },

        nomeParametro + ' — suavização gaussiana / log10',

        true

      );



      // =========================================================================
      // CONTORNO
      // =========================================================================

      var contorno =
        ee.FeatureCollection([

          ee.Feature(
            area.roi
          )

        ])

        .style({

          color:
            'FFFFFF',

          fillColor:
            '00000000',

          width:
            2

        });



      Map.addLayer(

        contorno,

        {},

        'Área selecionada',

        true

      );



      // =========================================================================
      // CENTRALIZAÇÃO
      // =========================================================================

      Map.centerObject(

        area.roi,

        area.tipo === 'Estado'
          ? 8
          : 10

      );



      // =========================================================================
      // STATUS
      // =========================================================================

      statusLabel.setValue(

        modoTemporal
        +
        ' | '
        +
        area.nome
        +
        ' | '
        +
        textoPeriodo
        +
        ' | '
        +
        numeroImagens
        +
        ' imagens'

      );



      // Garantir legenda correspondente ao resultado.
      atualizarLegenda(
        nomeParametro
      );



      // =========================================================================
      // CONSOLE
      // =========================================================================

      print(
        'Modo temporal:',
        modoTemporal
      );


      print(
        'Parâmetro:',
        nomeParametro
      );


      print(
        'Área:',
        area.nome
      );


      print(
        'Data / período:',
        textoPeriodo
      );


      print(
        'Número de imagens:',
        numeroImagens
      );


      print(
        'Coleção filtrada:',
        colecao
      );


      print(
        'Imagem média original:',
        imagemOriginal
      );


      print(
        'Imagem suavizada (bicúbica + média focal gaussiana de 2 km):',
        imagemSuavizada
      );


      print(
        'Imagem final (log10 deslocada):',
        imagemFinal
      );

    }

  );

}



// ============================================================================
// 27. PROCESSAMENTO - UM DIA
// ============================================================================

function processarDia() {


  var nomeParametro =
    parametroSelect.getValue();


  var config =
    parametros[nomeParametro];


  var area =
    obterAreaSelecionada();



  if (!area) {


    statusLabel.setValue(
      'Selecione o município.'
    );


    return;

  }



  var valores =
    seletorDataInicio.getValue();


  var timestampDia =
    valores[0];



  var startDate =
    ee.Date(
      timestampDia
    );



  // Limite final exclusivo.
  var endDate =
    startDate.advance(
      1,
      'day'
    );



  var textoDia =
    formatarDataBR(
      timestampDia
    );



  gerarVisualizacao(

    nomeParametro,

    config,

    area,

    startDate,

    endDate,

    textoDia,

    'Um dia'

  );

}



// ============================================================================
// 28. PROCESSAMENTO - PERÍODO
// ============================================================================

function processarPeriodo() {


  var nomeParametro =
    parametroSelect.getValue();


  var config =
    parametros[nomeParametro];


  var area =
    obterAreaSelecionada();



  if (!area) {


    statusLabel.setValue(
      'Selecione o município.'
    );


    return;

  }



  var timestampInicio = seletorDataInicio.getValue()[0];
  var timestampFim = seletorDataFim.getValue()[0];



  if (
    timestampFim
    <
    timestampInicio
  ) {


    statusLabel.setValue(

      'A data final deve ser posterior à data inicial.'

    );


    return;

  }



  var startDate =
    ee.Date(
      timestampInicio
    );



  // Data final inclusiva para o usuário,
  // mas exclusiva no filterDate().
  var endDate =
    ee.Date(
      timestampFim
    )

    .advance(
      1,
      'day'
    );



  var textoPeriodo =

    formatarDataBR(
      timestampInicio
    )

    +

    ' a '

    +

    formatarDataBR(
      timestampFim
    );



  gerarVisualizacao(

    nomeParametro,

    config,

    area,

    startDate,

    endDate,

    textoPeriodo,

    'Período'

  );

}



// ============================================================================
// 29. FUNÇÃO PRINCIPAL DE PROCESSAMENTO
// ============================================================================

function processar() {


  var tipoTemporal =
    tipoTemporalSelect.getValue();



  if (
    tipoTemporal ===
    'Um dia'
  ) {


    processarDia();

  }


  else {


    processarPeriodo();

  }

}



// ============================================================================
// 30. ASSOCIAR BOTÃO PROCESSAR
// ============================================================================

botaoProcessar.onClick(
  processar
);



// ============================================================================
// 31. ADICIONAR PAINEL DE CONTROLE AO MAPA
// ============================================================================

Map.add(
  painel
);



// ============================================================================
// 32. ADICIONAR LEGENDA AO MAPA
// ============================================================================

Map.add(
  painelLegenda
);



// ============================================================================
// 33. LEGENDA INICIAL
// ============================================================================
//
// Como NO2 é o parâmetro inicial,
// sua legenda é apresentada ao carregar a aplicação.
//
// ============================================================================

atualizarLegenda(
  parametroSelect.getValue()
);



// ============================================================================
// 34. CAMADA INICIAL DOS MUNICÍPIOS
// ============================================================================

var limitesIniciais =
  municipiosES.style({

    color:
      'FFFFFF',

    fillColor:
      '00000000',

    width:
      1

  });



Map.addLayer(

  limitesIniciais,

  {},

  'Municípios do Espírito Santo',

  true

);



// ============================================================================
// 35. VERIFICAÇÕES NO CONSOLE
// ============================================================================

print(
  'Asset municipal:',
  municipiosES
);


print(
  'Número de feições municipais:',
  municipiosES.size()
);


print(
  'Território estadual:',
  territorioES
);

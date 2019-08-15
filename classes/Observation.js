/**
 * Representa a planilha Observação.
 * @constructor
 * @author Mikael Messias <mikaelmessias@alunos.utfpr.edu.br>
 */
function Observation() {
  // Armazena instâncias da classe Columns
  this.columns = [];

  /**
  * Representa o código e os dados de cada coluna da planilha Observação.
  * @constructor
  * @param {string} code - O código identificador da coluna
  * @param {string} unit - A unidade de medida da coluna
  * @author Mikael Messias <mikaelmessias@alunos.utfpr.edu.br>
  */
  this.Column = function(code, unit) {
    this.code = code;
    this.unit = unit;
    this.rows = [];
  }

}

/**
 * @description Imprime no Logger do Google Apps Script todos os registros de erros.
 */
Observation.prototype.output = function() {
  this.columns.forEach(function(item, index) {
    Logger.log("[" + index + "]");
    Logger.log(item);
  });
}

/**
 * @description Adiciona uma nova coluna com o código e a unidade de medida especificados.
 * @param {string} code - O código identificador da coluna
 * @param {string} unit - A unidade de medida da coluna
 * @returns {number} O indíce do valor adicionado ou 0 caso os parâmetros estejam em formatos incorretos.
 */
Observation.prototype.addColumn = function(code, unit) {
  var index = 0;

  if(typeof(code) === "string" && typeof(unit) == "string") {
    index = this.columns.length;
    Logger.log("Adding column " + code);
    this.columns.push(new Observacao.Column(code,unit));
  }

  return index;
}

/**
 * @description Pesquisa uma coluna pelo código identificador.
 * @param {string} code - O código identificador
 * @returns {number} Um inteiro positivo representado o índice da coluna, ou -1 caso não seja encontrada.
 */
Observation.prototype.findColumn = function(code) {
  var index = -1;

  this.columns.forEach(function(item, item_index) {
    if(item.code === code) {
      index = item_index;
    }
  });

  return index;
}

/**
 * @description Adiciona um valor a coluna identificada pelo código.
 * @param {string} code - O código identificador da coluna
 * @param {any} value - O valor ser adicionado
 * @returns {number} O índice da coluna do valor adicionado, ou -1 caso não seja encontrada nenhuma coluna com o código informado.
 */
Observation.prototype.addValue = function(code, value) {
  var index = this.findColumn(code);

  if(index >= 0) {
    this.columns[index].rows.push(value);
  }

  return -1;
}

/**
 * @description Verifica se um valor já foi adicionado a coluna.
 * @param {string} code - O código identificador da coluna
 * @param {any} value - O valor a ser pesquisado
 * @return 0 caso o valor não seja encontrado, e 1 caso seja encontrado.
 */
Observation.prototype.searchValue = function(code, value) {
  var code_index = -1;
  var row_index = -1;

  if(typeof(code) === "string") {
    code_index = this.findColumn(code);
  }

  if(code_index >= 0) {
    this.columns[code_index].rows.forEach(function(item, item_index) {
      if(item === value) {
        row_index = item_index;
      }
    });
  }

  if(row_index < 0) {
    return 0; // Valor não adicionado
  }

  return 1; // Valor já adicionado
}

/**
 * @description Verifica se a unidade de medida está correta para a coluna do código especificado.
 * @param {string} code - O código identificador da coluna
 * @param {number} unit - A unidade de medida da coluna
 * @returns {number} 0 caso a unidade de medida esteja errada, e 1 caso esteja correta.
 */
Observation.prototype.matchUnit = function(code, unit) {
  var index = 0;

  if(typeof(code) === "string") {
    if(/^erosao_frequencia_[0-9]+$/.test(code)) {
      // Código legado
      index = this.findColumn("erosao_frequencia_i");
    }
    else if(/^erosao_forma_[0-9]+$/.test(code)) {
      // Código legado
      index = this.findColumn("erosao_forma_i");
    }
    else if(/^erosa_profundid_[0-9]+$/.test(code)) {
      // Código legado
      index = this.findColumn("erosao_profundid_i");
    }
    else {
      index = this.findColumn(code);
    }
  }

  var matched = 0;

  // Previne que sejam acessadas posições inválidas do vetor.
  if(index >= 0) {
    if(this.columns[index].unit === '-' || this.columns[index].unit === unit) {
      matched = 1;
    }
  }

  return matched;
}

/**
 * Cria uma instância da classe Observacao e preenche com os dados da planilha de padrões do febr.
 * @constructor
 * @author Mikael Messias <mikaelmessias@alunos.utfpr.edu.br>
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadsheet - A planilha que será usada para criar a instância
 * @returns {Observation} Um objeto com os dados da planilha.
 */
function ObservationSTD(std_id) {
  var columns = {
    codes: {
      required: [],
      recommended: [],
      optional: []
    },
    units: []
  };

  if(LOG) {
    Logger.log("Obtendo os valores da planilha padrão...");
  }

  // Abre a planilha de padrões
  var spreadsheet = SpreadsheetApp.openById(std_id);

  // Abre a folha da planilha com os códigos
  var sheet = spreadsheet.getSheets()[0];
  var max_rows = sheet.getLastRow();

  var value = null;

  // Busca a coluna que possui o carater de cada código
  var carater_col = getColumnOfField(sheet, "campo_carater");

  for(var row = 2; row < max_rows && sheet.getRange(row, 1).getValue() === "observacao"; row++) {
    var carater = sheet.getRange(row, carater_col).getValue();

    value = sheet.getRange(row, 2).getValue().toString();

    switch(carater) {
      case "obrigatório":
        if(LOG) {
          Logger.log("Adicionando código obrigatório " + columns.codes.required.length + ": " + value);
        }
        columns.codes.required.push(value);
        break;
      case "recomendado":
        if(LOG) {
          Logger.log("Adicionando código recomendado " + columns.codes.recommended.length + ": " + value);
        }
        columns.codes.recommended.push(value);
        break;
      case "opcional":
        if(LOG) {
          Logger.log("Adicionando código opcional " + columns.codes.optional.length + ": " + value);
        }
        columns.codes.optional.push(value);
        break;
    }
  }

  // Abre a folha da planilha com as unidades de medida
  sheet = spreadsheet.getSheets()[1];
  max_rows = sheet.getLastRow();

  var unit_col = getColumnOfField(sheet, "campo_unidade");

  for(var row = 2; row <= max_rows; row++) {
    value = sheet.getRange(row, unit_col).getValue();

    if(LOG) {
      Logger.log("Adicionando unidade " + columns.units.length + ": " + value);
    }

    columns.units.push(sheet.getRange(row, unit_col).getValue()); 
  }

  this.log = function() {
    Logger.log("-------- Codes:");
    columns.codes.forEach(function(item, index) {
      Logger.log("[" + index + "]: " + item);
    });

    Logger.log("-------- Units:");
    columns.units.forEach(function(item, index) {
      Logger.log("[" + index + "]: " + item);
    });
  }
}

/**
 * @description Função temporária  utilizada para testar as funcionalidades das classes Observation e ObservationSTD.
 */
function teste() {
  var std = new ObservationSTD("1Dalqi5JbW4fg9oNkXw5TykZTA39pR5GezapVeV0lJZI");

//  var obs_sheet = SpreadsheetApp.getActive().getSheets()[0];
//  var obs_max_rows = obs_sheet.getLastRow();

  var obs_sheet = SpreadsheetApp.openById("1xhrj70CT2gTuohKJJU3smA7Yykba0pdVnEq9uxAvjSM").getSheets()[0];
  var obs_max_col = obs_sheet.getLastColumn();

  for(var i = 1; i <= obs_max_col; i++) {
    Logger.log(obs_sheet.getRange(1, i).getValues().toString());
  }

//  var obs = new Observation();

}
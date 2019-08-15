/**
 * Prepara o ambiente de validação.
 * @constructor
 * @param {string} sheet_name - O nome da tabela a ser validada
 */
function Validate(sheet_name) {
  // A planilha a ser validada
  this.sheet = SpreadsheetApp.getActive();

  // A chave para a planilha de padrões do febr
  this.std_id = "1Dalqi5JbW4fg9oNkXw5TykZTA39pR5GezapVeV0lJZI";

  this.name = sheet_name;
}

/**
 * @description Executa a validação de dados de acordo com o tipo especificado da tabela.
 */
Validate.prototype.run = function() {
  switch(this.name) {
    case "dataset": {
      if(LOG) {
        Logger.log("Validação da tabela dataset...");
      }
      break;
    }
    case "observacao": {
      ValidateObservation(this.sheet, this.std_id);
      if(LOG) {
        Logger.log("Validação da tabela observacao...");
      }
      break;
    }
    case "metadados": {
      if(LOG) {
        Logger.log("Validação da tabela metadados...");
      }
      break;
    }
    case "camada": {
      if(LOG) {
        Logger.log("Validação da tabela camada...");
      }
      break;
    }
    default: {
      if(LOG) {
        Logger.log("Tipo de tabela desconhecido.");
      }
      break;
    }
  }
}
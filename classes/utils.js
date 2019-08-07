/**
 * @description Procura a coluna de um campo na planilha.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} sheet - A planilha em que será pesquisado o campo
 * @param {string} field_name - O nome do campo a ser pesquisado
 * @returns {number} O identificador da coluna que contém do campo.
 * @author Mikael Messias <mikaelpmessias@gmail.com>
 */
function getColumnOfField(sheet, field_name) {
  for(var col = 1; col < sheet.getLastColumn(); col++) {
    var range_value = sheet.getRange(1,col).getValue();

    if(range_value === field_name) {
      return col;
    }
  }
}

/**
 * @description Procura a linha de um campo na planilha.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} sheet - A planilha em que será pesquisado o campo
 * @param {string} field_name - O nome do campo a ser pesquisado
 * @returns {number} O identificador da linha que contém do campo.
 * @author Mikael Messias <mikaelpmessias@gmail.com>
 */
function getRowOfField(sheet, field_name) {
  for(var row = 1; row < sheet.getLastRow(); row++) {
    var range_value = sheet.getRange(row,1).getValue();

    if(range_value === field_name) {
      return col;
    }
  }
}
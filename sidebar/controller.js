/**
 * @description Informa que deve ser feito quando o complemento for instalado.
 */
function onInstall() {
  onOpen();
}

/**
 * @description Informa que deve ser feito quando o complemento for aberto.
 */
function onOpen() {
  var menu = SpreadsheetApp.getUi().createAddonMenu(); 
  menu.addItem('Iniciar validação', 'showSidebar');
  menu.addToUi();
}

/**
 * @description Exibe a barra lateral do complemento.
 */
function showSidebar() {
  showPage("sidebar/html/welcome.html", "febr");
}

/**
 * @description Abre uma nova página na barra lateral.
 * @param {string} url - O endereço com o código HTML da página
 * @param {string} name - O nome da página a ser exibido na barra lateral
 */
function showPage(url, name) {
  var ui = SpreadsheetApp.getUi();

  ui.showSidebar(HtmlService.createTemplateFromFile(url).evaluate().setTitle(name));
}

//function showAlert(name) {
//  var ui = SpreadsheetApp.getUi(); // Same variations.
//
//  var result = ui.alert(name);
//}

function getTableName() {
  return SpreadsheetApp.getActiveSheet().getName();
}
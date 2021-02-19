function worldLoop(country, stat) {

  // set sheet that script will run in to be 'data'
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.setActiveSheet(sheet.getSheetByName('data'))

  // get all values in active sheet 'data'
  var all_values = SpreadsheetApp.getActiveSheet().getDataRange().getValues();

  // gets column B of active sheet 'data'
  // https://stackoverflow.com/questions/7848004/get-column-from-a-two-dimensional-array
  country_unfiltered = all_values.map(function(value) { return value[1]; });

  // discards A1 & A2 since it is empty
  // https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
  country = country_unfiltered.filter(Boolean);
  Logger.log(country);

  // grabs 2nd row of all_values (2nd row of active sheet 'data') and discards blank cells
  stat_unfiltered = all_values[1];
  stat = stat_unfiltered.filter(Boolean);
  Logger.log(stat);
  // stat = ['SP.POP.TOTL', 'EG.ELC.ACCS.ZS'];

  // execute world function for each country and each stat
  for (var i = 0; i < country.length; i++)
  {
    for (var j = 0; j < stat.length; j++)
    {
      returned_value = world(country[i], stat[j]);

      // store data into correct row and column
      var sheet = SpreadsheetApp.getActiveSheet();
      sheet.getRange(i+3,j+3).setValue(returned_value);
    }
  }

}

function world(country, stat) {

  // Call the worldbank API
  var response = UrlFetchApp.fetch("http://api.worldbank.org/v2/country/" + country + "/indicator/" + stat + "?format=JSON&mrv=1");

  // log to execution log
  Logger.log(response.getContentText());
  
  // Parse the JSON reply
  var json=response.getContentText();
  var data = JSON.parse(json);
  Logger.log(data);

  // first check if data is null, if so, replace with a string 'NA'
  // if not,
  // gets actual data, array position is based on where the worldbank api stores it
  // very specific to the current worldbank json format (Feb 19, 2021)

  if (data[1]) {
    actual_data = data[1][0].value;
  } else {
    actual_data = null;
  }

  // double check it's right
  Logger.log(actual_data);
  return actual_data;
}

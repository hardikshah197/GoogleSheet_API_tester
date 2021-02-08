const fs= require('fs');
const {google} = require('googleapis');
const old_token = "ya29.A0AfH6SMBRzHBdDHS94owpxLZuUAHrrgNxS7L_DwQpB5M_WXznj-JxhLtGu4OKDJP59laFoh_1uQr8m09vTTPaFmxTNsLRg4eiD0nnqq2u5Qz911GPWGZdR7AQt-qMf-QTFgSWrewEtuvMolDGB4Hm7AovEo_l";
const new_token = "ya29.a0AfH6SMBAgDG-MneTlBe4v4NNVolLtGSxAAhXCi2JRnq4gTVTfK3XTZaEEAtWJXKL9Kx2MRrZ5r2Cdjd3S4AqlYVQtCyd449IO4Ge0Klub1r3cbKICVYhFPhfe48ITxlhI4P_hL-nRnqF65a7De1VH15b-A_fSi9BsLOuBzC-mlM";
const bad_token = "bad_toke";

fs.readFile('./credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    console.log("Reading....");
    authorize(JSON.parse(content) , createSheet);
  });

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials;
  console.log("Authoriztion....");
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
    oAuth2Client.setCredentials({ "access_token": new_token});
    callback(oAuth2Client);
}

function listMajors(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
        spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        range: 'Class Data!A2:E',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const rows = res.data.values;
            if (rows.length) {
            console.log('Name, Class-Level:');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                console.log(`${row[0]}, ${row[2]}`);
            });
            } else {
            console.log('No data found.');
            }
        }
    );
}

function createSheet(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  const resource = {
    properties: {
      title: "LOL",
    },
  };
  sheets.spreadsheets.create({
    resource,
    fields: 'spreadsheetId',
  }, (err, spreadsheet) =>{
    if (err) {
      // Handle error.
      console.log(err);
    } else {
      console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
    }
  });
}


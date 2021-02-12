const fs= require('fs');
const {google} = require('googleapis');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const old_token = "ya29.A0AfH6SMBRzHBdDHS94owpxLZuUAHrrgNxS7L_DwQpB5M_WXznj-JxhLtGu4OKDJP59laFoh_1uQr8m09vTTPaFmxTNsLRg4eiD0nnqq2u5Qz911GPWGZdR7AQt-qMf-QTFgSWrewEtuvMolDGB4Hm7AovEo_l";
const new_token = "ya29.A0AfH6SMArkcUafDBbBfwQ7yKhbLtrAUNYC1QHwkMgsM1g2qJyEagHh12Do1u2RCAJ-hWz8K1YQyE6ba_fiqltUXbZaX-tD-g0wJn8_ov5LXdO6ow04xpHY3MDvqZ3uPxx-mkLBwT3PCnWOBf3-JCxcjYf_Y5ypQ";
const bad_token = "bad_toke";
let GSid = "";
const data = {
  "name": [
    "nitesh",
    "anmol",
    "test",
    "dfdfdf"
  ],
  "email": [
    "dffd@m",
    "hello@gmail",
    "hut@gmail",
    "sexy@hotmail"
  ],
  "skills": [
    {
      "java": 0,
      "aws": true,
      "python": 0
    },
    {
      "java": true,
      "aws": 0,
      "python": true
    },
    {
      "java": true,
      "aws": false,
      "python": false
    },
    {
      "java": true,
      "aws": 0,
      "python": 0
    }
  ]
};

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
      GSid = spreadsheet.data.spreadsheetId;
      console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
      AddDataToSheet(auth)
    }
  });
}

async function AddDataToSheet(oauth2Client){
  const doc = new GoogleSpreadsheet(GSid);
  doc.useOAuth2Client(oauth2Client);
  await doc.loadInfo();
  console.log(`Title: ${doc.title}`);

  const sheet = await doc.addSheet({ headerValues: ['Name', 'Email', 'Skills'] });
  for(var i=0;i<data.name.length;i++){
    var count = 0;
    for(var x in data.skills[i]){
      if(x) count++;
    }
    await sheet.addRow({ Name: data.name[i] , Email: data.email[i], Skills: count });
  }
  const rows = await sheet.getRows();
  console.log("New Sheet rows: ",rows[0]);
}

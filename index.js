var fs = require("fs");



fs.readFile('http_request_response.pdf', 'utf8', function(err, data) {
   
   
    const userData = data.toString('base64');
     console.log(userData)
});


// console.log("ghjkl;")


// const fs = require('fs');
// const { exec } = require('child_process');

// const inputFilePath = './http_request_response.pdf';
// const outputFilePath = './file.txt';

// exec(`pdftotext ${inputFilePath} ${outputFilePath}`, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error converting file: ${error}`);
//     return;
//   }
  
//   if (stderr) {
//     console.error(`Error converting file: ${stderr}`);
//     return;
//     }
    
//     console.log(stdout)

//   console.log('File converted successfully');
// });
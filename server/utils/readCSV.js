const csv = require('csv-parser');
const fs = require('fs');

exports.parseCSV = async (path, cb) => {
    var data = []
    await fs.createReadStream(path? path : 'metering_data.csv')
        .pipe(csv(["Serial","ReadingDateTimeUTC","WH","VARH"]))
        .on('data', (row) => {
            data.push(row)
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
             cb(data);
        });
}
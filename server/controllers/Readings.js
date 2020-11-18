const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const { parseCSV } = require('../utils/readCSV');
const asyncHandler = require('../middleware/async');
const fs = require("fs")

let capturedReadings = [];
let capturedReadingsSerials = "";

parseCSV(undefined, async (data) => {
    capturedReadings = data.slice(1)
    await createCapturedReadingsSerials()
});

createCapturedReadingsSerials = () => {
    capturedReadingsSerials = ""
    for(var i in capturedReadings){
        if(!capturedReadingsSerials.includes(capturedReadings[i].Serial)){
            capturedReadingsSerials = capturedReadingsSerials + data[i].Serial + ";"
        }
    }
}

exports.getReadings = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        count: capturedReadings.length,
        data: capturedReadings,
        serials: capturedReadingsSerials
    })
    return;
})

exports.createReadings = asyncHandler(async (req, res, next) => {
    // console.log(req.body)
    capturedReadings = [...capturedReadings, ...req.body.newData]
    await createCapturedReadingsSerials()
    res.status(200).json({
        success: true,
        count: capturedReadings.length,
        data: capturedReadings,
        serials: capturedReadingsSerials
    })
    return;
})

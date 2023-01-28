export const jsonToHTMLTable = async jsonData => {
    let dateRowStr = '';
    for (let dateKeys in jsonData) {
        let stnRowStr = '';
        for (let stnKeyc in jsonData[dateKeys]) {
            let trainDataArrForSingleJourney = jsonData[dateKeys][stnKeyc];
            let getJourneyRowTableStrData = getJourneyRowTableStr(trainDataArrForSingleJourney);
            let stnRowItem = getAsHTMLTableData(stnKeyc) + getAsHTMLTableData(getJourneyRowTableStrData);
            stnRowStr += getAsHTMLTableRow(stnRowItem);
        }
        let stnTable = getAsHTMLTable(stnRowStr);
        let dateRowItem = getAsHTMLTableData(dateKeys) + getAsHTMLTableData(stnTable);
        dateRowStr += getAsHTMLTableRow(dateRowItem);
    }
    let dateRowTable = getAsHTMLTable(dateRowStr);
    return getAsHTMLBody(dateRowTable);
};

const getJourneyRowTableStr = trainDataArrForSingleJourney => {
    let journeyRowStr = '';
    for (let index in trainDataArrForSingleJourney) {
        let item = trainDataArrForSingleJourney[index];
        let classAndFairInfoCardArr = item["classAndFairInfoCard"];
        let classFairHTML = getClassAndFairInfoAsTable(classAndFairInfoCardArr);
        let rowDataStr = getAsHTMLTableData(item["trainName"]) + getAsHTMLTableData(item["trainNumber"]) + getAsHTMLTableData(classFairHTML);
        journeyRowStr += getAsHTMLTableRow(rowDataStr);
    }
    let tableStr = getAsHTMLTable(journeyRowStr);
    return tableStr;
};

const getClassAndFairInfoAsTable = classAndFairInfo => {
    let rowStr = '';
    for (let index in classAndFairInfo) {
        let item = classAndFairInfo[index];
        let rowDataStr = getAsHTMLTableData(item["berthClass"]) + getAsHTMLTableData(item["cost"]) + getAsHTMLTableData(item["availibilty"]);
        rowStr += getAsHTMLTableRow(rowDataStr);
    }
    let tableStr = getAsHTMLTable(rowStr);
    return tableStr;
};


const getAsHTMLTableRow = data => `<tr>${data}</tr>`;
const getAsHTMLTableData = data => `<td style="border-style: solid;vertical-align: top;border-width:1px;color:green;padding: 2px 2px 2px 2px;">${data}</td>`;
const getAsHTMLTable = data => `<table  style="border-style: none;">${data}</table>`;
const getAsHTMLBody = data => `<html><body style="background-color: white;">${data}</body></html>`;

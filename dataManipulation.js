const fs = require('fs');
const data = require('./private/afel-dataset.json');

/* function formatJSONnestedData(dataset) {
    let transactions = [];
    Object.keys(dataset).map(key => {
        if (dataset[key].items) {
            const items = dataset[key].items;
            let itemsArray = [];
            items.forEach(i => itemsArray.push(i.sku));
            return transactions.push(itemsArray);
        }
    });
    return transactions;
}

const formatedData = formatJSONnestedData(data); */

function dataToTransactionFormat(dataset) {
    let transactions = [];
    Object.keys(dataset).map(key => {
        if (dataset[key].items) {
            const items = dataset[key].items;
            items.forEach(i => transactions.push({ 'tid': key, 'name': i.name, 'quantity': i.quantity }));
        }
    });
    return transactions;
}
const formatedData = dataToTransactionFormat(data);

const json = JSON.stringify(formatedData);
const write = fs.writeFile('private/dataset2.json', json, (err) => {
    if (err) console.log(err);
});
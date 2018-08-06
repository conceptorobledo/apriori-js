const { associationRules } = require('./associationRules');
require('./dataManipulation');
//const testdata2 = require('./private/data.json');
const testdata1 = [
    { tid: 1, name: 'a' },
    { tid: 1, name: 'b' },
    { tid: 1, name: 'c' },
    { tid: 2, name: 'a' },
    { tid: 2, name: 'c' },
    { tid: 3, name: 'a' },
    { tid: 3, name: 'd' },
    { tid: 4, name: 'b' },
    { tid: 4, name: 'e' },
    { tid: 4, name: 'f' },
];

const testdata = testdata1;

//Transform data to get the array from transaction 
groupedTransactions = (data) => {
    const groups = {};
    const transactions = [];
    for (let i = 0; i < data.length; i++) {
        const groupName = data[i].tid;
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(data[i].name);
    }
    for (const groupName in groups) {
        transactions.push(groups[groupName]);
    }
    return transactions;
}
//Frequent Item Generator Model
getItemsets = (transactions, iteration = 1) => {
    const allItems = transactions.reduce((a, b) => {
        return a.concat(b)
    });
    const itemset = [...new Set(allItems)]
    if (iteration === 1) {
        return itemset;
    } else {
        getCombos = (n, src, got, all) => {
            if (n == 0) {
                if (got.length > 0) {
                    all[all.length] = got;
                }
                return;
            }
            for (var j = 0; j < src.length; j++) {
                getCombos(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
            }
            return;
        }
        let all = [];
        getCombos(iteration, itemset, [], all);
        return all;
    }
}

isSubsetOfSet = (subset, set) => {
    let isSubset;
    //Array validation, it should be always an array but in first iteration.
    if (subset.constructor === Array) {
        isSubset = subset.every(val => set.includes(val));
    } else {
        isSubset = set.includes(subset);
    }
    return isSubset;
}

getSupportValues = (itemsets, transactions) => {
    let supportItemsetsVals = [];
    itemsets.forEach(item => {
        supportItemsetsVals.push({ name: item, count: 0 });
    });
    transactions.forEach(transactionItem => {
        itemsets.forEach(setItem => {
            const isSubset = isSubsetOfSet(setItem, transactionItem);
            if (isSubset) {
                let matchIndex;
                const match = supportItemsetsVals.find((i, index) => {
                    matchIndex = index;
                    return i.name === setItem;
                });
                if (match) {
                    supportItemsetsVals[matchIndex].count = supportItemsetsVals[matchIndex].count + 1;
                }
            } else {
                return;
            }
        });
    });
    return supportItemsetsVals;
}

//Filter itemset by minsup
clearMinsupItemsets = (supportVals, minsup) => {
    return supportVals.filter(itemset => itemset.count > minsup);
}


nextItemset = (newItemsets) => {
    return newItemsets.map(itemset => itemset.name);
}

getNewTransactions = (transactions, newItemsets) => {
    let nextTransactions = [];
    transactions.forEach(item => {
        for (let itemset of newItemsets) {
            if (isSubsetOfSet(itemset.name, item)) {
                nextTransactions.push(item);
                break;
            }
        }
    });
    return nextTransactions;
}

//REPETIR

function AprioriAlgorythm(data, config = { threshold: 0.5, iterations: 1, group: true }) {
    let transactionsByTID;
    if (config.group) transactionsByTID = groupedTransactions(data);
    else transactionsByTID = data;

    //TODO 
    //Implement immutability
    let currentTransactions = null;
    let currentItemset = null;
    let currentSupport = null;
    let prevSupport = null;

    const numberOfTransations = transactionsByTID.length;
    const minsup = numberOfTransations * config.threshold;

    currentTransactions = transactionsByTID;
    for (i = 0; i < config.iterations; i++) {
        prevSupport = currentSupport;
        const Cn = getItemsets(currentTransactions, i + 1);
        currentSupport = getSupportValues(Cn, currentTransactions);
        const Ln = clearMinsupItemsets(currentSupport, minsup);
        currentItemset = Ln;
        //Update current transaction by choosing the qualified itemsets to use to iterate from instead of the full transaction data.
        currentTransactions = getNewTransactions(currentTransactions, Ln);
    }
    return {
        filteredTransactions: currentTransactions,
        frequentItemsets: currentItemset,
        prevItemsets: prevSupport
    };
}

const config = {
    threshold: 0.0025,
    iterations: 2,
    group: true
}

//Frequent itemsets
const apriori = AprioriAlgorythm(testdata, config);
const fqis = apriori.frequentItemsets;
const prevItemsets = apriori.prevItemsets;

//Association Rules
const transactionsByTID = groupedTransactions(testdata);
const numberOfTransations = transactionsByTID.length;
const rules = associationRules(fqis, numberOfTransations, prevItemsets);
exports.associationRules = (frequentItemsets, nOfTransactions, prevItemsets) => {
    let associations = [];
    frequentItemsets.forEach(
        itemset => {
            const item = itemset.name;
            for (i = 0; i < item.length; i++) {
                const a = item[i];
                let b = [];
                item.map((el, index) => {
                    if (index !== i) {
                        return b.push(el);
                    } else return;
                });
                const ABsupport = itemset.count / nOfTransactions;
                //TODO 
                //Find support value in array of value pair object
                const aValue = prevItemsets.find((el) => {
                    return el.name === a;
                });
                const bValue = prevItemsets.find((el) => {
                    if (el.length < 2) return el.name === b[0];
                    else return el.name === b;
                });
                console.log(bValue);
                Asupport = aValue.count / nOfTransactions;
                associations.push({
                    'association': a + ' to ' + b,
                    'support': ABsupport.toFixed(4),
                    'confidence': (ABsupport / Asupport).toFixed(4)
                });
            }
        }
    );
    return associations;
}
if (!location.href.match('https://store.steampowered.com/account/history')) {
    window.alert('This script only works on the Steam account history page at https://store.steampowered.com/account/history/\n**Make sure you scroll to the bottom of the page and keep clicking "Load More Transactions"**');
} else {
    var totals = {};

    jQuery('.wallet_history_table .wallet_table_row').each(function() {
        var transaction = {
            date: jQuery('.wht_date', this).text(),
            currency: jQuery('.wht_total', this).text().replace(/[^A-Za-z]/g, ''),
            price: parseFloat(jQuery('.wht_total', this).text().replace(/[^0-9.,-]/g, '').replace(',', '.')),
            payment: jQuery('.wth_payment', this).text().trim().replace(/\s*\n\s*/g, ', ').replace(/\s+/g, ' '),
            description: jQuery('.wht_items', this).text().trim().replace(/\s*\n\s*/g, ', ')
        };

        if (transaction.currency.indexOf('Credit') === transaction.currency.length - 6) {
            transaction.price *= -1;
            transaction.currency = transaction.currency.substr(0, transaction.currency.length - 6);
        }

        if (!isNaN(transaction.price)) {
            if (typeof(totals[transaction.currency]) === 'undefined') {
                totals[transaction.currency] = [0, 0];
            }
            if (transaction.price >= 0) {
                totals[transaction.currency][0] += transaction.price;
            } else {
                totals[transaction.currency][1] += transaction.price;
            }
        }

        //console.log(transaction);
    });

    // Build the tables for the page
    var html = '<thead><tr><th>Currency</th><th>Debits</th><th>Credits</th><th>Total</th></tr></thead><tbody>';

    for (currency in totals) {
        html += '<tr><td>' + currency + '</td><td>' + totals[currency][0].toFixed(2) + '</td><td>' + totals[currency][1].toFixed(2) + '</td><td>' + (totals[currency][0] + totals[currency][1]).toFixed(2) + '</td></tr>';
    }

    html += '</tbody>';

    jQuery('.wallet_history_click_hint').remove();
    jQuery('.wallet_history_table').html(html);
}

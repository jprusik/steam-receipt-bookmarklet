if ((location.href === 'https://store.steampowered.com/account/') || ((location.href === 'https://store.steampowered.com/account'))) {
    var steamReceipt={'transactions':[], 'currencyList':[], 'currencyTotals':[], 'wallet':jQuery('.price')[0].innerHTML, 'transactionCount':0, 'externalCount':0, 'priceTotal':0, 'credits':0};
    jQuery('.transactionRow').each(function(){
        var transaction = {
            'date':jQuery(this).find('.transactionRowDate').text(),
            'currency':jQuery(this).find('.transactionRowPrice').text().replace(/[\w\s-.,]/g, ''),
            'price':Number(jQuery(this).find('.transactionRowPrice').text().replace(/[^\d.,-]/g, '').replace('\,','\.').replace('--','00').split('.').splice(0,2).join('.')),
            'event':jQuery(this).find('.transactionRowEvent').text(),
            'description':jQuery(this).find('.transactionRowEvent .transactionRowTitle').text(),
            'descriptionSub':jQuery(this).find('.transactionRowEvent .itemSubtext').text()
        };

        // Check if the transaction was a credit to the account
        if (jQuery(this).find('.transactionRowEvent').hasClass('walletcredit')){
            transaction.price *=-1;
            steamReceipt.credits +=1;
        }

        // Special case for Russian Rubles
        if (transaction.currency.toString() === 'уб'){
            transaction.currency = 'pуб';
        }

        // Find out how many currencies we're working with and sum them individually
        var currency_string = transaction.currency.toString();
        if ((jQuery.inArray(transaction.currency, steamReceipt.currencyList) === -1) && (transaction.currency)){
            steamReceipt.currencyList.push(currency_string);
            steamReceipt.currencyTotals[currency_string]=0;
        }
        if (transaction.currency){
            steamReceipt.currencyTotals[currency_string] += transaction.price;
        }

        // Add up the transactions
        if (transaction.price){
        }
        else{
            steamReceipt.externalCount += 1;
        }
        steamReceipt.transactionCount += 1;

        steamReceipt.transactions.push(transaction);
    });

    // Build the tables for the page
    jQuery('#steam_gauge_wrapper').remove();
    jQuery('.page_title_area').after('<div id="steam_gauge_wrapper"><p id="steam_gauge_receipt">You\'ve made '+steamReceipt.transactionCount+' transactions on Steam.<br/><br/>'+steamReceipt.externalCount+' of those are product redemptions on Steam for external purchases (Steam doesn\'t know how much you paid).<br/><br/>The total amount spent on your Steam account \(within Steam\) can be seen to the right. These totals include store purchases, wallet funding, gift purchases, and in-game purchases.<br/><br/>Your Steam wallet currently contains '+steamReceipt.wallet+'</p><table id="steam_gauge_receipt_table"><tbody><tr style="border-bottom: 1px solid #ddd;}"><th style="text-align:right;">Currency</th><th style="text-align:left;padding-left:0.5em;">Total Spent<br/>(negative values are credits)</th></tr></tbody></table><hr style="width:100%;margin:1em auto;clear:both;"><p style="display:block;width:100%;clear:both;text-align:center;font-weight:bold;">Steam Receipt was developed by <a href="http://www.mysteamgauge.com" style="text-decoration:underline;">Steam Gauge</a> and is in no way affiliated with Valve.</p></div>');
    jQuery(steamReceipt.currencyList).each(function(){
        jQuery('#steam_gauge_receipt_table tbody').append('<tr><td class="sg_col1">'+this+'</td><td class="sg_col2">'+Math.round(steamReceipt.currencyTotals[this]*100)/100+'</td>');
    });
    jQuery('head').append('<style type="text/css">#steam_gauge_wrapper{width:100%;margin:1em 0px;padding: 1em;background-color:slategray;}#steam_gauge_receipt{width:50%;float:left;}#steam_gauge_receipt_table{width:50%;float:right;border-width: 0px !important;border-collapse: collapse !important;}.sg_col1{text-align:right;}.sg_col2{text-align:left;padding-left: 0.5em;}.youraccount_tabs{clear:both;}</style>');
}
else{
    alert('This script only works at:\n\nhttps://store.steampowered.com/account/');
}

if (['https://store.steampowered.com/account/','https://store.steampowered.com/account'].indexOf(location.href) > -1) {
    var steamReceipt;
    (function() {
        function Currency(short,postfix) {
            var amounts = [];
            this.add = function(transaction) {
                amounts.push(transaction.price);
            };
            this.count = function() {
                return amounts.length;
            };
            this.getAverage = function() {
                var total = this.getTotal();
                return {
                    value: total.value/amounts.length,
                    toString: function() {
                        var amount = (Math.round(this.value*1E2)/1E2).toFixed(2);
                        return postfix ? amount + short : short + amount;
                    }
                };
            };
            this.getHighest = function() {
                return {
                    value: (function(a) { var b = 0; a.each(function(a) { b = isNaN(a) || a < b ? b : a; }); return b; })(amounts),
                    toString: function() {
                        var amount = (Math.round(this.value*1E2)/1E2).toFixed(2);
                        return postfix ? amount + short : short + amount;
                    }
                };
            };
            this.getTotal = function() {
                return {
                    value: (function(a) { var b = 0; a.each(function(a) { b += isNaN(a) ? 0 : a; }); return b; })(amounts),
                    toString: function() {
                        var amount = (Math.round(this.value*1E2)/1E2).toFixed(2);
                        return postfix ? amount + short : short + amount;
                    }
                };
            };
        }
        steamReceipt = {
            transactions: [],
            externals: [],
            credits: [],
            currency: {
                dollar: new Currency('$'),
                euro: new Currency('€',true),
                pound: new Currency('£'),
                ruble: new Currency('y6',true),
                reais: new Currency('R$')
            },
            wallet: {
                amount: Number(jQuery('.price').text().replace(/[^0-9\.\,]+/g,'').replace(',','.')),
                currency: jQuery('.price').text().indexOf('€') > -1 ? '€' : (jQuery('.price').text().indexOf('£') > -1 ? '£' : '$')
            }
        };

        jQuery('.transactionRow').each(function(id,element) {
            var $this = jQuery(this),
                transaction = {
                    date:           $this.find('.transactionRowDate').text(),
                    currency:       'dollar',
                    price:          Number($this.find('.transactionRowPrice').text().replace(/[^\d.,-]/g, '').replace('\,','\.').split('.').splice(0,2).join('.')),
                    event:          $this.find('.transactionRowEvent').text(),
                    description:    $this.find('.transactionRowEvent .transactionRowTitle').text(),
                    descriptionSub: $this.find('.transactionRowEvent .itemSubtext').text()
                };

            // Check if the transaction was a credit to the account
            if ($this.find('.transactionRowEvent').hasClass('walletcredit')) {
                transaction.price *= -1;
                steamReceipt.credits.push(transaction);
            }

            // Check if transaction is other than dollars
            var check = $this.find('.transactionRowPrice').text();
            if (check.indexOf('R$') > -1)
                transaction.currency = 'reais';
            else if (check.indexOf('уб') > -1)
                transaction.currency = 'ruble';
            else if (check.indexOf('£') > -1)
                transaction.currency = 'pound';
            else if (check.indexOf('€') > -1)
                transaction.currency = 'euro';

            // Check if the transaction was external
            if (transaction.price)
                steamReceipt.currency[transaction.currency].add(transaction);
            else
                steamReceipt.externals.push(transaction);

            steamReceipt.transactions.push(transaction);
        });
        // Build the tables for the page
        jQuery('#steam_gauge_wrapper,#steam_gauge_styles').remove();
        jQuery('.page_title_area').after('<div id="steam_gauge_wrapper"><p id="steam_gauge_receipt">You\'ve made ' + steamReceipt.transactions.length + ' transactions on Steam.<br/><br/>' + steamReceipt.externals.length + ' of those are product redemptions on Steam for external purchases (Steam doesn\'t know how much you paid).<br/><br/>The total amount spent on your Steam account \(within Steam\) can be seen to the right. These totals include store purchases, wallet funding, gift purchases, and in-game purchases.<br/><br/>Your Steam wallet currently contains ' + jQuery('.price').text() + '</p><table id="steam_gauge_receipt_table"><tbody><tr style="border-bottom: 1px solid #ddd;}"><th style="text-align:right;">Currency</th><th style="text-align:left;padding-left:0.5em;">Transactions</th><th style="text-align:left;padding-left:0.5em;">Total Spent<br/>(negative values are credits)</th><th style="text-align:left;padding-left:0.5em;">Highest</th><th style="text-align:left;padding-left:0.5em;">Average</th></tr></tbody></table><hr style="width:100%;margin:1em auto;clear:both;"><p style="display:block;width:100%;clear:both;text-align:center;font-weight:bold;">Steam Receipt was developed by <a href="http://www.mysteamgauge.com" style="text-decoration:underline;">Steam Gauge</a> and is in no way affiliated with Valve.</p></div>');
        if (steamReceipt.currency.dollar.getTotal().value !== 0)
            jQuery('#steam_gauge_receipt_table tbody').append('<tr><td class="sg_col1">$</td><td class="sg_col2">' + steamReceipt.currency.dollar.count() + '</td><td class="sg_col2">' + steamReceipt.currency.dollar.getTotal() + '</td><td class="sg_col2">' + steamReceipt.currency.dollar.getHighest() + '</td><td class="sg_col2">' + steamReceipt.currency.dollar.getAverage() + '</td>');
        if (steamReceipt.currency.euro.getTotal().value !== 0)
            jQuery('#steam_gauge_receipt_table tbody').append('<tr><td class="sg_col1">€</td><td class="sg_col2">' + steamReceipt.currency.euro.count() + '</td><td class="sg_col2">' + steamReceipt.currency.euro.getTotal() + '</td><td class="sg_col2">' + steamReceipt.currency.euro.getHighest() + '</td><td class="sg_col2">' + steamReceipt.currency.euro.getAverage() + '</td>');
        if (steamReceipt.currency.pound.getTotal().value !== 0)
            jQuery('#steam_gauge_receipt_table tbody').append('<tr><td class="sg_col1">€</td><td class="sg_col2">' + steamReceipt.currency.pound.count() + '</td><td class="sg_col2">' + steamReceipt.currency.pound.getTotal() + '</td><td class="sg_col2">' + steamReceipt.currency.pound.getHighest() + '</td><td class="sg_col2">' + steamReceipt.currency.pound.getAverage() + '</td>');
        if (steamReceipt.currency.ruble.getTotal().value !== 0)
            jQuery('#steam_gauge_receipt_table tbody').append('<tr><td class="sg_col1">y6</td><td class="sg_col2">' + steamReceipt.currency.ruble.count() + '</td><td class="sg_col2">' + steamReceipt.currency.ruble.getTotal() + '</td><td class="sg_col2">' + steamReceipt.currency.ruble.getHighest() + '</td><td class="sg_col2">' + steamReceipt.currency.ruble.getAverage() + '</td>');
        if (steamReceipt.currency.reais.getTotal().value !== 0)
            jQuery('#steam_gauge_receipt_table tbody').append('<tr><td class="sg_col1">R$</td><td class="sg_col2">' + steamReceipt.currency.reais.count() + '</td><td class="sg_col2">' + steamReceipt.currency.reais.getTotal() + '</td><td class="sg_col2">' + steamReceipt.currency.reais.getHighest() + '</td><td class="sg_col2">' + steamReceipt.currency.reais.getAverage() + '</td>');
        jQuery('head').append('<style type="text/css" id="steam_gauge_styles">#steam_gauge_wrapper{width:100%;margin:1em 0px;padding: 1em;background-color:slategray;border-radius:5px}#steam_gauge_receipt{width:50%;float:left;}#steam_gauge_receipt_table{width:50%;float:right;border-width: 0px !important;border-collapse: collapse !important;}.sg_col1{text-align:right;}.sg_col2{text-align:left;padding-left: 0.5em;}.youraccount_tabs{clear:both;}</style>');
    })();
} else alert('This script only works at:\n\nhttps://store.steampowered.com/account/');

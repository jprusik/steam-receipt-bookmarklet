if (['https://store.steampowered.com/account/','https://store.steampowered.com/account'].indexOf(location.href) > -1) {
    function beautifyPrice(amount,currency) {
        amount = (Math.round(amount*1E2)/1E2).toFixed(2);
        var spaces = new Array(12-amount.length).join(' ');
        if (currency === '£')
            return spaces + '£' + amount;
        if (currency === '€')
            return spaces + amount + '€';
        return spaces + '$' + amount;
    }
    var transaction_count = 0,
        external_count = 0,
        money_spent = {
            dollar: [],
            euro: [],
            pound: [],
            getAverage: function() {
                var total = this.getTotal();
                return {
                    dollar: this.dollar.length > 0 ? total.dollar/this.dollar.length : 0,
                    euro: this.euro.length > 0 ? total.euro/this.euro.length : 0,
                    pound: this.pound.length > 0 ? total.pound/this.pound.length : 0,
                    toString: function() { return beautifyPrice(this.dollar) + ' ' + beautifyPrice(this.euro,'€') + ' ' + beautifyPrice(this.pound,'£'); }
                };
            },
            getHighest: function() {
                return {
                    dollar: (function(a) { var b = 0; a.each(function(a) { b = isNaN(a) || a < b ? b : a; }); return b; })(this.dollar),
                    euro: (function(a) { var b = 0; a.each(function(a) { b = isNaN(a) || a < b ? b : a; }); return b; })(this.euro),
                    pound: (function(a) { var b = 0; a.each(function(a) { b = isNaN(a) || a < b ? b : a; }); return b; })(this.pound),
                    toString: function() { return beautifyPrice(this.dollar) + ' ' + beautifyPrice(this.euro,'€') + ' ' + beautifyPrice(this.pound,'£'); }
                };
            },
            getTotal: function() {
                return {
                    dollar: (function(a) { var b = 0; a.each(function(a) { b += isNaN(a) ? 0 : a; }); return b; })(this.dollar),
                    euro: (function(a) { var b = 0; a.each(function(a) { b += isNaN(a) ? 0 : a; }); return b; })(this.euro),
                    pound: (function(a) { var b = 0; a.each(function(a) { b += isNaN(a) ? 0 : a; }); return b; })(this.pound),
                    toString: function() { return beautifyPrice(this.dollar) + ' ' + beautifyPrice(this.euro,'€') + ' ' + beautifyPrice(this.pound,'£'); }
                };
            }
        },
        wallet = {
            amount: Number(jQuery('.price').text().replace(/[^0-9\.\,]+/g,'').replace(',','.')),
            currency: jQuery('.price').text().indexOf('€') > -1 ? '€' : (jQuery('.price').text().indexOf('£') > -1 ? '£' : '$')
        };
    jQuery('.transactionRowPrice').each(function(id,element) {
        if (['Free','Gratis'].indexOf(element.innerText) > -1){
            external_count += 1;
            transaction_count += 1;
        } else if (element.innerText != undefined) {
            money = Number(element.innerText.replace(/[^0-9\.\,]+/g,'').replace(',','.'));
            if (!isNaN(money)) {
                currency = element.innerText.indexOf('€') > -1 ? 'euro' : (element.innerText.indexOf('£') > -1 ? 'pound' : 'dollar');
                money_spent[currency].push(money);
                transaction_count += 1;
            }
        }
    });
    alert('You\'ve made ' + transaction_count + ' transactions on Steam.\n\n' +
          external_count + ' of those are product redemptions on Steam for external purchases (Steam doesn\'t know how much you paid).\n\n' +
          'Below you can see how much you have spent on your Steam account \(within Steam\)\n\n' +
          'Total:   ' + money_spent.getTotal().toString() + '\n' +
          'Highest: ' + money_spent.getHighest().toString() + '\n' +
          'Average: ' + money_spent.getAverage().toString() + '\n\n' +
          'This total includes store purchases, wallet funding, gift purchases, and in-game purchases.\n\n' +
          'Your Steam wallet currently contains ' + beautifyPrice(wallet.amount,wallet.currency));
} else alert('This script only works at:\n\nhttps://store.steampowered.com/account/');

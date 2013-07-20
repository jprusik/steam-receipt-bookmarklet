if ((location.href === 'https://store.steampowered.com/account/') || ((location.href === 'https://store.steampowered.com/account'))) {
    var listedprice = jQuery('.transactionRowPrice');
    var transaction_count = 0;
    var external_count = 0;
    var price_total = 0;
    var wallet = Number(jQuery('.price')[0].innerHTML.replace(/[^0-9\.]+/g,""));
    for (x in listedprice) {
        if (listedprice[x].innerHTML == 'Free'){
            external_count += 1;
            transaction_count += 1;
        }
        else if (listedprice[x].innerHTML != undefined){
            price_total += Number(listedprice[x].innerHTML.replace(/[^0-9\.]+/g,""));
            transaction_count += 1;
        }
        else{
        }
    }
    alert('You\'ve made '+transaction_count+' transactions on Steam.\n\n'+external_count+' of those are product redemptions on Steam for external purchases (Steam doesn\'t know how much you paid).\n\nThe total amount spent on your Steam account \(within Steam\) is $'+Math.round(price_total*100)/100+'\n\nThis total includes store purchases, wallet funding, gift purchases, and in-game purchases.\n\nYour Steam wallet currently contains $'+wallet);
}
else{
    alert('This script only works at:\n\nhttps://store.steampowered.com/account/');
}
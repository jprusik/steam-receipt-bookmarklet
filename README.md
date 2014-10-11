Steam Receipt Bookmarklet
=========================

Purpose
-------
Tools like [Steam Gauge](http://www.mysteamgauge.com) can only return the Steam store price of a game, and not the amount you actually paid for it. This is because Valve does not allow access to your Steam transaction history by outside parties. However, you can still see a transaction history of your account on Steam's website at: https://store.steampowered.com/account

Unfortunately, the transaction history isn't as straightforward as it could be. This javascript bookmarklet summarizes your account data quickly and easily.

Usage
-----
Simply create a new bookmark with the contents of the js file. When you're on one of your account transactions pages, click the bookmarklet to get a pop-up summary of your account spending.

Limitations/Known Issues
------------------------
Steam does track key redemptions (from game bundles, retail purchase, etc), but has no way of knowing how much you paid for it, so those costs are excluded.

Steam used to store all transaction types at a single url. Since the recent redesign, however, the transaction types have been split into separate pages, making a single aggregate summary from Steam Receipt of all transaction types impossible.

Author
------
Jonathan Prusik @jprusik [www.classynemesis.com](http://www.classynemesis.com)

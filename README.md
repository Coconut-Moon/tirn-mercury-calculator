# Mercury calculator for seaturtles.org.

Uses data from the FDA and EPA to calculate mercury and other risks of eating seafood.

[github](https://github.com/outerpress/tirn-mercury-calculator)

**Design notes**
[Initial Wireframes](https://projects.invisionapp.com/prototype/Mercury-Calculator-Prototype-ck9vl8l7500l1l901y8d0n3fc)

Custom icons are in the Assets folder. Edit with Affinity Designer.

**Running locally**

* Run on localhost.
* Use Sass to generate CSS files.

***Running on Wordpress***

* Upload files to root folder
* Enqueue main.js, main.css, and mustache in functions.php:
https://stackoverflow.com/questions/17967364/how-to-link-a-script-in-wordpress
* Add index.html content (marked between comments) to a wordpress HTML block

**Dependencies**
* Google spreadsheet delivers data as JSON
* Jquery
* Mustache.js
* Fontawesome Icons

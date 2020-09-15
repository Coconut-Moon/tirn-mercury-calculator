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

* Upload files to root
* Create a new page template
* Enqueue scripts and CSS in functions.php
https://stackoverflow.com/questions/17967364/how-to-link-a-script-in-wordpress
* Embed HTML content (between Body tags) in page using template

**Dependencies**
* Google spreadsheet delivers data as JSON
* Jquery - This is probably unnecessary. When we move from prototype to real thing, consider removing
* Mustache.js - This is making life very easy, converting from JSON to html. Replace if there's a better option
* Fontawesome Icons

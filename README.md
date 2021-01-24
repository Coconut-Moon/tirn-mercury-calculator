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

* [Enqueue scripts](https://stackoverflow.com/questions/17967364/how-to-link-a-script-in-wordpress) main.js, main.css, and mustache in functions.php of Salient child theme.

Example - enqueueing scripts so they only show up on the whats-the-catch page:

```
// Mercury Calculator
add_action('wp_enqueue_scripts', 'load_mercury_calculator');
function load_mercury_calculator() {
	if ( is_single('whats-the-catch') ) {

		wp_enqueue_style( 'calculator-styles', '/mercury-calculator-2020/css/main.css', array(), '1.0', 'all' );

		wp_enqueue_script( 'calculator-scripts', '/mercury-calculator-2020/main.js', array(), '1.0', true );

		wp_enqueue_script( 'mustache-js', 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.1.0/mustache.js', array(), '3.1.0', true );

	}
}
```

* Add index.html content (marked between comments) to a wordpress HTML block

**Dependencies**
* Google spreadsheet delivers data as JSON
* Jquery
* Mustache.js
* Fontawesome Icons

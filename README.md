# Mercury calculator for seaturtles.org.

Uses data from the FDA and EPA to calculate mercury and other risks of eating seafood. [github](https://github.com/outerpress/tirn-mercury-calculator)

**Dependencies**

* Google spreadsheet delivers seafood data as JSON
* Jquery
* Mustache.js
* Fontawesome icons
* Custom icons

**Running locally**

* Runs on localhost. If using Python run `python3 -m http.server`
* Uses Sass to generate CSS files. Run `sass --watch sass:css` inside mercury-calculator-2020 folder

**Running on Wordpress**

* Upload mercury-calculator-2020 folder to site root folder

* [Enqueue scripts](https://stackoverflow.com/questions/17967364/how-to-link-a-script-in-wordpress) main.js, main.css, and mustache in functions.php of Salient child theme.

Example - enqueueing scripts so they only show up on a single page (replace page-slug with):

```
// Mercury Calculator
add_action('wp_enqueue_scripts', 'load_mercury_calculator');
function load_mercury_calculator() {
	if ( is_single('page-slug') ) {

		wp_enqueue_style( 'calculator-styles', '/mercury-calculator-2020/css/main.css', array(), '1.0', 'all' );

		wp_enqueue_script( 'calculator-scripts', '/mercury-calculator-2020/main.js', array(), '1.0', true );

		wp_enqueue_script( 'mustache-js', 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.1.0/mustache.js', array(), '3.1.0', true );

	}
}
```

* Add index.html content (marked between comments) to a Salient Raw HTML block.

**Updating Custom icons**

Custom icons are in the [Assets folder](https://github.com/outerpress/tirn-mercury-calculator/tree/master/mercury-calculator-2020/assets). Editable with Affinity Designer.

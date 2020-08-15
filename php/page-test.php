<?php
/*
Template Name: Test Template
*/

get_header();
?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">

		<script src="main.js"></script>
    <main class="flex-grid">
      <div class="col">
        <h1>What's the catch?</h1>

        <div class="question-box question-one" id="questionOne">
          <p>
            Answer two questions to find out if your seafood choices are:
            <ul class="list">
              <li>Low in mercury and other toxins</li>
              <li>Fished sustainably</li>
            </ul>
          </p>
          <br />
          <label for="weight" class="y-1">What is your weight?</label>
          <input
            type="number"
            id="weight"
            name="weight"
            min="1"
            max="999"
            value="160"
            class="input input-number y-1"
            onclick="this.select();"
            required
          />
          <div class="btn-group">
            <input
              type="radio"
              class="btn-group-input weight-measure"
              name="weightUnits"
              id="Lbs"
              value="lbs"
              checked
            />
            <label for="Lbs" class="btn">Lbs</label>

            <input
              type="radio"
              class="btn-group-input weight-measure"
              name="weightUnits"
              id="Kgs"
              value="kgs"
            />
            <label for="Kgs" class="btn">Kgs</label>
          </div>
          <p class="note">Your weight determines how much mercury you can safely consume.</p>
          <button
            id="OpenFishList"
            class="btn btn-primary navigate-fish-list"
            onclick="storeWeight()"
          >
            Next question
          </button>

        </div>

        <!--  add back display-none -->
        <div class="question-box question-two" id="questionTwo">

          <p>
            What types of seafood do you eat <strong class="highlight"> in one week?</strong>
          </p>

          <input class="input input-lg input-text" type="text" id="filterFish" onclick="this.select();" onkeyup="filterFishList()" placeholder="Search for fish..."
          />

          <div class="list-wrapper">
            <table id="fishList"></table>
          </div>

          <script id="template" type="text/template">
            <tr class="header-fishlist">
              <th></th>
              <th class="asc"><a href="javascript:sortTable(1)">Fish</a></th>
              <th><a href="javascript:sortTable(2)">Mercury per oz</a></th>
            </tr>
            {{#.}}
            <tr>
              <td>
                <input class="fish" type="checkbox" id="fish_{{ index }}" name="fish" value="{{ name }}" data-index="{{ index }}">
              </td>
              <td>
                <label for="fish_{{ index }}">{{ name }}</label>
              </td>
              <td><label for="fish_{{ index }}" class="mercury-exposure mercury-rating-{{mercury-rating}}">{{ mercury }} <span class="dot" title="{{mercury-rating}}"></span></label></td>
            </tr>
            {{/.}}
          </script>

          <form id="servingSize" class="calculate-results">
            <h2 class="mb-0">Choose serving sizes</h2>
            <p class="mb-1"><a href="#servingModal" id="openServingModal">One serving is 6 to 8 ounces</a></p>

            <ul id="selectedFish" class="selected-fish">
              <p class="note text-center">Select a fish from the list.</p>
            </ul>

            <script id="selectedFishTemplate" type="text/template">
              {{#.}}
              <li id="selectedFish_{{ index }}" class="servings" data-index="{{ index }}">
                <span class="col col-2">
                  <label for="{{ name }}">{{ name }}</label>
                </span>
                <span class="col col-2 col-contents-right">
                  <input name="serving-amount" class="input input-number input-number-small" type="number" min="1" value="1" data-index="{{ index }}" onclick="this.select();">
                  <select class="input input-select" name="serving-ounces" data-index="{{ index }}">
                    <option value="8">Filet (8 oz)</option>
                    <option value="6">Can (6 oz)</option>
                    <option value="2">Sushi roll (2 oz)</option>
                    <option value="1">Ounces</option>
                    <option value="28.35">Grams</option>
                  </select>
                </span>
                <a class="icon-close-x" title="Remove fish" onClick="removeFish(this)" data-remove="{{ index }}"><span>&times;</span></a>
              </li>
              {{/.}}
              {{^.}}
                <p class="note text-center">Select a fish from the list.</p>
              {{/.}}
            </script>

          </form>

          <button id="showResults" class="btn btn-primary show-results" disabled="disabled">
            Show results
          </button>

          <button id="backToWeight" class="btn btn-secondary">BACK</button>
        </div>

        <!--  add back display-none -->
        <div class="question-box results" id="results">
          <h2>Results</h2>

          <p>Your mercury exposure is <span id="mercuryExposureMessage" class="highlight"></span> of the safe limit</p>
          <p class="note" style="margin-top:0;font-size:.75em;" id="weightResultsMessage"><p>
          <div id="chart"></div>

          <div id="chart-homemade">
            <svg version="1.2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="graph" aria-labelledby="title" role="img" height="260px">
              <title id="title">A line chart showing some information</title>
              <g>
                <text x="0" y="20">Your mercury</text>
                <rect width="400" height="50%" style="fill:rgba(255, 125, 127, 0.5)" />
              <g>
                <text x="0" y="160">Recommended mercury</text>
                <rect width="400" height="50%" y="50%" style="fill:rgb(125, 136, 255, 0.5)"></rect>
              </g>
            </svg>
          </div>

          <h2>Your choices</h2>

          <div id="fishResults">
            <p class="note">Select a fish from the list.</p>

          </div>

          <script id="fishResultsTemplate" type="text/template">
            {{#.}}
            <div class="card" id="fishResult_{{ index }}">
              <div class="row-2col">

                <span style="flex:3" class="col col-2 col-self-baseline"><h3>{{name}}</h3></span>

                <span class="col col-2 col-self-baseline col-contents-right">
                  <input id="{{ index }}_Servings" name="serving-amount" class="input input-number input-number-small" type="number" min="1" value="{{ serving-amount }}" data-index="{{ index }}" onclick="this.select();">
                  <select class="input input-select" name="serving-ounces" id="{{ index }}_ServingUnits" data-index="{{ index }}" data-servings="{{ serving-ounces }}">
                    <option value="8">Filet (8 oz)</option>
                    <option value="6">Can (6 oz)</option>
                    <option value="2">Sushi roll (2 oz)</option>
                    <option value="1">Ounces</option>
                    <option value="28.35">Grams</option>
                  </select>
                </span>

                <a class="icon-close-x" title="Remove fish" onClick="removeFish(this)" data-remove="{{ index }}"><span>&times;</span></a>

              </div>


              {{#message}}
                <div class="message">
                  <div class="message-content message-main">
                    <p>
                      {{message}}
                    </p>
                  </div>
                </div>
              {{/message}}

              <div class="message">
                <div class="icon toxin"></div>
                <div class="message-content">
                  <p><strong>Mercury</strong></p>
                  <p>
                   {{mercuryexposurepercent}}% of total mercury exposure
                  </p>
                  <div class="mercury-level-wrapper">
                    <div style="width:{{mercuryexposurepercent}}%;" class="mercury-level-percent"></div>
                  </div>
                </div>
              </div>

              {{#bycatch-message}}
                <div class="message">
                  <div class="icon bycatch"></div>
                  <div class="message-content">
                    <p><strong>{{bycatch-level}}</strong></p>
                    <p>
                      {{bycatch-message}}
                    </p>
                  </div>
                </div>
              {{/bycatch-message}}

              {{#microplastics-message}}
                <div class="message">
                  <div class="icon microplastics"></div>
                  <div class="message-content">
                    <p><strong>Microplastics</strong></p>
                    <p>
                      {{microplastics-message}}
                    </p>
                  </div>
                </div>
              {{/microplastics-message}}

              {{#footnote}}
                <p class="font-small">
                  {{footnote}}
                </p>
              {{/footnote}}

            </div>

            {{/.}}

            {{^.}}
            <p class="note">Select a fish from the list.</p>
            {{/.}}
          </script>
          <button class="btn btn-secondary navigate-fish-list" id="editFish">Edit selected fish</button>
          <button class="btn btn-secondary" id="backToStart">Start over</button>
        </div>
      </div>

    </main>

    <footer class="flex-grid">
      <button class="accordion">About this calculator</button>
      <div class="panel">
        <ul><li>The data and calculations in this table come from the United States Environmental Protection Agency and Food and Drug Administration. For more information see <a href="https://www.epa.gov/fish-tech/epa-fda-fish-advice-technical-information" target="_blank">EPA-FDA Fish Advice: Technical Information</a></li></ul>
      </div>
    </footer>

    <!-- The Modal -->
    <div id="servingModal" class="modal">
      <!-- Modal content -->
      <div class="modal-content">
        <span class="close icon-close-x">&times;</span>
        <h2>Common serving sizes</h2>
          <img src="mercury/img/serving-filet@2x.png" alt="large fish filet">
          <p>A typical serving of fish (steak or fillet) is about 6 to 8 ounces for an adult.</p>
          <br />
          <img src="mercury/img/serving-sushi@2x.png" alt="piece of sushi">
          <p>A sushi order is 2 to 4 ounces per type.</p>
          <br />
          <br />
					<img src="mercury/img/serving-can@2x.png" alt="Can of tuna">
          <p>A standard can of tuna contains 6 ounces.</p>
          <br />
          <br />
          <!-- <button class="btn btn-primary close">Close</button> -->

      </div>
    </div>

			<?php

			// Start the Loop.
			while ( have_posts() ) :
				the_post();

				get_template_part( 'template-parts/content/content', 'page' );

				// If comments are open or we have at least one comment, load up the comment template.
				if ( comments_open() || get_comments_number() ) {
					comments_template();
				}

			endwhile; // End the loop.
			?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();

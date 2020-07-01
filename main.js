// Navigate
$(function () {
  $("#NextQuestion").click(function () {
    $(".question-one").addClass("display-none")
    $(".question-two").removeClass("display-none")
  });
});

$(function () {
  $("#backToWeight").click(function () {
    $(".question-two").addClass("display-none")
    $(".question-one").removeClass("display-none")
  });
});

//$(function () {
//  $("#showResults").click(function () {
//    $(".question-two").addClass("display-none")
//    $(".results").removeClass("display-none")
//  });
// });

$(function () {
  $("#backToStart").click(function () {
    $(".results").addClass("display-none")
    $(".question-one").removeClass("display-none")
  });
});

// Store user's weight and units
function storeWeight() {
  var weight = document.getElementById('weight').value;

  //TODO: comment out log troubleshooting
  console.log(weight);

  var weightUnits = document.getElementsByName('weightUnits');

  //TODO: comment out log troubleshooting
  for (var i = 0, length = weightUnits.length; i < length; i++) {
    if (weightUnits[i].checked) {

      console.log(weightUnits[i].value);

      // only one radio can be logically checked, don't check the rest
      break;
    }
  }
}

// Render list of fish from json


var data = {};

$.getJSON("fish-list.json")
  .done(function (dat) {
    data = dat;
    console.log("success", dat)
    renderMustacheTemplate();

    runTheFishApp(data);
  })
  .fail(function () {
    console.log("error", arguments);
  })
  .always(function () {
    console.log("complete");
  });

function renderMustacheTemplate() {
  var template = $("#template").html();
  var html = Mustache.to_html(template, data);
  $('#fishList').html(html);
}

function runTheFishApp(allFishData) {
  allFishData = allFishData || [];

  // RETURN SELECTED FISH DATA
  // This takes the user's selections from the fish finder thingy
  // And matches the INDEX of that fish with the full json file of all fishy data
  // So that we can start building a new array of fish results to use to calculate the calculations
  // So that people don't die
  // BUT MORE IMPORTANTLY
  // Fish might not die
  function returnSelectedFishData(selectedFishData) {
    selectedFishData = selectedFishData || null;
    const selectedFishArray = [];
    // maps through the user's selections
    selectedFishData.map(selectedFish => {
      // maps through all of the the data
      allFishData.map(fish => {
        // conditional to compare the fish
        if (fish.index == selectedFish) {
          // add the data to the results array
          selectedFishArray.push(fish)
          console.log("!!!!!! fish mapping results", fish.index)
        }
      })
    })
    return selectedFishArray;
  }

  //Render serving selector for each selected fish
  // The box's status has changed.
  $(document).on('change', '.fish', function () {

    // This is the array of selected fish you are creating an array with to send to the returnSelectedFish function (logged out below)
    const selectedFishData = $("#fishList input:checkbox:checked").map(function () {
      return $(this).data("index");
    }).get();

    const selectedFish = returnSelectedFishData(selectedFishData);

    // THESE ARE YOUR FISHES!!!!!
    console.log("These are your returned fishes", selectedFish)

    function renderSelectedFishTemplate() {
      var template = $("#selectedFishTemplate").html();
      var html = Mustache.to_html(template, returnSelectedFishData(selectedFishData));
      $('#selectedFish').html(html);
    }

    renderSelectedFishTemplate();

    // calculate results when user clicks "Show Results"
    document.getElementById("showResults").addEventListener("click", function (event) {

      // Don't reload the page
      event.preventDefault()

      // An object array for serving sizes and quantities
      var fishAmounts = [];

      // In the selected fish list, pull the serving sizes and quantities into individual objects.
      $('#selectedFish li').each(function (index, value) {
        fishAmounts.push({
          servingAmount: $("input[name='serving-amount']", this).map(function () {
            return $(this).val();
          }).get(), servingSize: $("select[name='serving-size']", this).map(function () {
            return $(this).val();
          }).get()
        });
      });

      console.log("Amounts array", fishAmounts);

      // Merge our sizes and quantities with the selected fish
      let fishResults = fishAmounts.map((item, i) => Object.assign({}, item, selectedFish[i]));

      console.log("fish results", fishResults);

      // Sample data for testing. TODO - delete when this is working.
      var fishResultsStatic = [{
        "name": "Anchovies",
        "serving-amount": "6",
        "serving-measure": "ounces",
        "mercury": "0.103",
        "mercury-exposure": "25%",
        "message": "It is best to avoid anchovy caught in the Mediterranean due to them being caught at a rate that is too high for them to replenish, a phenomenon known as overfishing.",
        "index": "0"
      },
      {
        "name": "Bass - Freshwater",
        "serving-amount": "6",
        "serving-measure": "ounces",
        "mercury": "0.17",
        "mercury-exposure": "25%",
        "message": "Largemouth bass are one of the top recreational ﬁsh species in the U.S., resulting in being stocked throughout the U.S. to provide recreational fishing opportunities outside of their native range. Some countries have reported negative impacts resulting from the introduction of largemouth bass in non-native waters.",
        "index": "2"
      },
      {
        "name": "Mahi Mahi - Dorado - Dolphinfish",
        "serving-amount": "6",
        "serving-measure": "ounces",
        "mercury": "0.16",
        "mercury-exposure": "50%",
        "bycatch-level": "High impact on other species",
        "bycatch-message": "Most fisheries utilize longlines to catch Mahi Mahi -- a fishing method that is notorius for accidentally catching and injuring sea turtles, sharks, and seabirds.",
        "message": "Although Mahi Mahi is considered to have low to moderate mercury levels, most of the U.S. commercial harvest of Pacific mahi mahi comes from the Hawaii longline fishing fleet, the conditions of which have been likened to human trafficking, slavery and human rights abuses.",
        "index": "44"
      },
      {
        "name": "Monkfish",
        "serving-amount": "6",
        "serving-measure": "ounces",
        "mercury": "0.174",
        "mercury-exposure": "50%",
        "bycatch-level": "High impact on other species",
        "bycatch-message": "Monkfish are caught via bottom trawls or set gillnets in the U.S. These methods catch large rates of other species including at-risk fish species like Atlantic cod, flounder, and Atlantic sturgeon. Fishing limits are frequently exceeded."
      },
      {
        "name": "Orange Roughy - Red Roughy, Slimehead, Deep Sea Perch",
        "serving-amount": "6",
        "serving-measure": "ounces",
        "mercury": "0.513",
        "mercury-exposure": "50%",
        "bycatch-level": "High impact on other species",
        "bycatch-message": "Orange Roughy is caught by bottom trawls where ancient seamounts live, destroying this habitat in New Zealand and capturing high amounts of coral as well as black oreos and smooth oreos, vulnerable fish species.",
        "message": "It is best to avoid eating Orange Roughy. In addition to being high in mercury, Orange Roughy has seen dramatic declines in many fisheries."
      },
      {
        "name": "Oysters - Pacific",
        "serving-amount": "6",
        "serving-measure": "ounces",
        "mercury": "0.513",
        "mercury-exposure": "50%",
        "microplastics-message": "Filter feeders such as oysters draw in and filter out particles in seawater. Studies of microplastics in the deep sea found plastic particles in every single filter feeder that was studied.",
        "message": "Oysters can contain a higher amount of heavy metals in their bodies because they mainly grow on the ocean floor and can accumulate heavy metals from industrial pollution that have sunk to the bottom of the ocean."
      },
      {
        "name": "Sardine",
        "serving-amount": "6",
        "serving-measure": "ounces",
        "mercury": "0.079",
        "mercury-exposure": "50%",
        "message": "The Pacific sardine fishery was at one time the largest fishery in North America, but seasons have been continually postponed due to population collapse. Scientists worry that it could be a long road to sardine population recovery."
      },
      {
        "name": "Scallop",
        "serving-amount": "6",
        "serving-measure": "ounces",
        "mercury": "0.04",
        "mercury-exposure": "50%",
        "microplastics-message": "Filter feeders such as scallops draw in and filter out particles in seawater. Studies of microplastics in the deep sea found plastic particles in every single filter feeder that was studied.",
        "message": "Scallop dredges cause severe damage to seafloor habitat. In addition, endangered sea turtles and other species can be caught incidentally and are discarded, often dead or dying, as bycatch."
      },
      {
        "name": "Sole",
        "serving-amount": "6",
        "serving-measure": "ounces",
        "mercury": "0.086",
        "mercury-exposure": "50%",
        "bycatch-level": "High impact to other species and ocean floor",
        "bycatch-message": "Wild-caught sole is caught by bottom trawls, a non selective form of fishing that results in seafloor destruction. Bycatch includes some species that are depleted. Management is better in the U.S. than Canadian sources. farmed sole with wastewater treatment is the best choice",
        "message": "Because of high amounts of pollution and industrial waste, flatfish varieties like sole fish are more likely to contain dangerous contaminants that build up in the tissues of fish."
      },
      {
        "name": "Squid",
        "serving-amount": "6",
        "serving-measure": "ounces",
        "mercury": "0.044",
        "mercury-exposure": "50%",
        "bycatch-level": "High impact to other species",
        "bycatch-message": "Squid is caught off the California coast via purse seine, a non-selective fishing method that captures everything that it surrounds, including protected species like sea turtles. Squid is caught in Japan via purse seine and jig, or a ring of thin, very sharp barbless wire hooks. Rather than hooking the squid in the mouth, the wire hooks snag the squid's tentacles as the squid attacks the lure.",
        "message": "Many international squid fisheries are responsible for depleting squid at rates too high for the species to replenish, or are likely to catch these diminishing populations. Avoid squid caught in China, Indonesia, Thailand, and Argentina. "
      },
      {
        "name": "Tilapia",
        "serving-amount": "6",
        "serving-measure": "ounces",
        "mercury": "0.019",
        "mercury-exposure": "25%",
        "message": "Tilapia is a farmed fish. Avoid any Tilapia from China due to illegal use of antibiotics, invasiveness risk, and disease issues.",
        "microplastics-message": "Tilapia has been found to ingest microplastics.",
        "index": 67
      }];


      // Now that the data is in place, render the results list
      function render() {

        var template = $("#fishResultsTemplate").html();
        var html = Mustache.render(template, fishResults);
        $('#fishResults').html(html);
      }

      render();


    });

  });


}

// TODO Select all input text when we focus
$("input[type='number']").on("click", function () {
  $(this).select();
});

// TODO Select a fish by clicking anywhere in the row
$("#fishList td").on("click", function () {
  $(this).select();
});

// Le chart
$(function () {

  var options = {
    series: [{
      data: [50]
    }],
    chart: {
      type: 'bar',
      stacked: true,
      stackType: '100%',
      height: 350,
      width: "100%"
    },
    annotations: {
      yaxis: [{
        y: 100,
        borderColor: '#00E396',
        label: {
          borderColor: '#00E396',
          style: {
            color: '#fff',
            background: '#00E396',
          },
          text: 'Y annotation'
        }
      }]
    },
    plotOptions: {
      bar: {
        horizontal: false,
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: ['Mercury'],
    },
    grid: {
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    yaxis: {
      reversed: false,
      axisTicks: {
        show: true
      }
    }
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();

});


// Filter list of fish
function filterFishList() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("filterFish");
  filter = input.value.toUpperCase();
  table = document.getElementById("fishList");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// Sort by mercury level
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("fishList");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}


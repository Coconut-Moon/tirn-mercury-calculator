// Navigate
$(function(){
  $("#NextQuestion").click(function(){
    $(".question-one").addClass("display-none")
    $(".question-two").removeClass("display-none")
  });
});

$(function(){
  $("#backToStart").click(function(){
    $(".question-two").addClass("display-none")
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
$(function () {
  var data = {};
  $.getJSON("fish-list.json")
    .done(function (dat) {
      data = dat;
      console.log("success", dat)
      render();
    })
    .fail(function () {
      console.log("error", arguments);
    })
    .always(function () {
      console.log("complete");
    });

  function render() {
    var template = $("#template").html();
    var html = Mustache.to_html(template, data);
    $('#fishList').html(html);
  }
});

// Filter list of fish
function filterFish() {
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
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
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
      switchcount ++;
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

// Select a fish by clicking anywhere in the row {

//Render serving selector for each selected fish

// The box's status has changed.
$(document).on('change', '.fish', function () {
  //Get checked values
  event.preventDefault();
  var searchIDs = $("#fishList input:checkbox:checked").map(function(){
    return $(this).val();
  }).get(); // <----

  var chosenFish = {
      selectedFish: searchIDs
  };

  function render() {
    var template = $("#selectedFishTemplate").html();
    var html = Mustache.render(template, chosenFish);
    $('#selectedFish').html(html);
  }

  render();


});

// Select all input text when we focus
$("input[type='number']").on("click", function () {
  $(this).select();
});






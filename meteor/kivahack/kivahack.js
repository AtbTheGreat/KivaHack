Results = new Mongo.Collection("results");


if (Meteor.isClient) {
  var lender = "";
  var search_url = "";
  var options = {};
  var query_params = {};

  Template.body.helpers({
    results: function () {
      return Session.get("searchArray");
    }
  })
  Template.hello.events({
    "input .searchname": function (event) {
      console.log(event.target.value)
      Session.set("stringSearched", event.target.value);
      search_url = 'http://api.kivaws.org/v1/lenders/search.json';
      query_params = {
        q: Session.get("stringSearched"),
        sort_by: "newest",
        ids_only: "false"
      };
      options = {
        data: query_params,
        type: "GET",
        dataType: 'json'
      }

      request = $.ajax(search_url, options)
      request.done(showResponse);


      return false;
    }
  });
  Template.result.events({
    "click li": function(event) {
      console.log(this.lender_id + "has been clicked");
      $("li").hide()
      mapFunction(this.lender_id)
    }
  })

  var page = '';
  var loan_id = 'text';
  var lender_arr = []



  function showResponse(response) {
    RESPONSE = response;
    $.each(response.lenders, function(i, lenderData) {
      //Results.insert({lender_id: lenderData.lender_id, data: lenderData.name+", "+lenderData.whereabouts})
      if (i < 50) {
        lender_arr[i] = {lender_id: lenderData.lender_id, data: lenderData.name+", "+lenderData.whereabouts}
      }
      Session.set("searchArray", lender_arr)
    });
  }


  function makeListItems(key, val) {
    // Function found through sample code.
    var items = [];
    items.push('<b>' + key + '</b><br>');
    $.each(val, function (key, val) {
      if (typeof (val) == 'object') {
        items.push(makeListItems(key, val));
      } else {
        items.push(key + ': ' + val + '<br>');
      }
    });
    items.push('</ul></li>');
    return items.join('');
  }

  function indexCountry(array, row) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][0] == row) return i;
    }

    return -1;
  }

  var lenderID = "matt"
  var lendersite = "http://api.kivaws.org/v1/lenders/" + lenderID + "/loans.json" //URL for lender JSON data
  // Making the getJSON method not asynchronous
  var countries = [];

  function drawRegionsMap() {
    var countryData = google.visualization.arrayToDataTable(countries);
    var options = {};
    options['colors'] = [0x50C878, 0x228B22, 0x013220];
    options['width'] = "900px";
    options['height'] = '500px';
    var chart = new google.visualization.GeoMap(document.getElementById('regions_div'));
    chart.draw(countryData, options);
  }

  function mapFunction(lender_ID) {
    console.log("Made it to the mapFunction " + lender_ID)
    lendersite = "http://api.kivaws.org/v1/lenders/" + lender_ID + "/loans.json" //URL for lender JSON data

      $.getJSON(lendersite, function (data) {
        var items = [];
        var title = "Loan";
        items.push(makeListItems(title, data.loans));
        //document.write(items[0])
        //	var element = []; //Separate each line into a different element in an array
        entries = items[0].split("<br>")
        var countries = [
          ['Country', 'Popularity']
        ];
        var loanTotal = 0;
        for (i = 0; i < entries.length; i++) {
          //document.write(entries[i]+'<br>');
          if (entries[i].indexOf(": ") == -1) {} else {
            //document.write(entries[i] + "<br>") //debugging
            row = entries[i].split(": ")
            if (row[0] == "country") {
              var index = indexCountry(countries, row[1]);
              if (index == -1) countries.push([row[1], 1]);
              else countries[index][1]++;
            } else if (row[0] == "loan_amount") {
              loanTotal += parseInt(row[1]);
            }
          }
        } // end of for-loop
        document.write("<b>Total Loaned</b>: $" + loanTotal + "<br /><b>Number of Loans</b>: " + data.loans.length + "<br /><b>Average of Loans</b>: $" + Math.round(100 * loanTotal / data.loans.length) / 100 + "<br />");
      }).done(drawRegionsMap());
      google.load("visualization", "1", {
        packages: ["geomap"]
      });
      google.setOnLoadCallback(drawRegionsMap);



  }

  //});


};


if (Meteor.isServer) {

}

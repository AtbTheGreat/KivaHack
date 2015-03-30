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
    console.log(lender_arr);
  }

};


if (Meteor.isServer) {

}

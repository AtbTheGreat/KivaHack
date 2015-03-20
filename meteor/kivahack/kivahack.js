Results = new Mongo.Collection("results");


if (Meteor.isClient) {
  var lender = "";
  var search_url = "";
  var options = {};
  var query_params = {};

  Template.body.helpers({
    results: function () {
      return Results.find({});
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

      console.log("starting search call")
      request = $.ajax(search_url, options)
      request.done(showResponse);

      console.log("finished both search call")
      return false;
    }
  });

  var page = '';
  var loan_id = 'text';



  function showResponse(response) {
    RESPONSE = response;
    var list = Results.find({})
    console.log(list.Collection)
    $.each (list.Collection, function(i, data) {
      console.log(data)
      Results.remove(this._id)
    })

    $.each(response.lenders, function(i, lenderData) {
      Results.insert({lender_id: lenderData.lender_id, data: lenderData.name+", "+lenderData.whereabouts})
    });

  }

};


if (Meteor.isServer) {

}

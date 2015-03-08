Results = new Mongo.Collection("results");



if (Meteor.isClient) {
    var lender = "";
    var search_url = "";
    var options = {};
    var query_params = {};
    Template.body.helpers({
        results: function () {
            return Results.find({});
    }})
    Template.body.events({
        "submit .lenders": function (event) {
            // This function is called when the new task form is submitted
            lender = event.target.text.value;
            console.log(event.target.text.value);
            console.log("Lenders")
            // Clear form
            event.target.text.value = "";
        },
            "submit .searchname": function (event) {
            Session.set("stringSearched", event.target.q.value);
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
            
            Results.remove({})
            request = jQuery.ajax(search_url, options).done(showResponse);
            return false;
        }
    });

    var page = '';
    var loan_id = 'text';
   


    function showResponse(response) {
        RESPONSE = response;
        
        $.each(response.lenders, function(i, lenderData) {
            Results.insert({lender_id: lenderData.lender_id, data: lenderData.name+", "+lenderData.whereabouts})
        });

    }

};


if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
        return Meteor.methods({
            removeAllResults: function() {
                return Results.remove({});
      }

    });
    });
}


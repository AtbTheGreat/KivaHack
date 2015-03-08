Results = new Mongo.Collection("results");

function makeListItems(key, val) {
    var items = [];

    items.push('<li><b>' + key + '</b><ul>');

    $.each(val, function (key, val) {
        if (typeof (val) == 'object') {
            items.push(makeListItems(key, val));
        } else {
            items.push('<li class="' + key + '">' + key + ': ' + val + '</li>');
        }
    });

    items.push('</ul></li>');

    return items.join('');
}

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

    url = 'http://api.kivaws.org/v1/lenders/' + lender + '/loans.json';
    title = 'Loan';
    Meteor.call('removeAllResults')
    
    // Request loan data
    $.getJSON(url, function (data) {
        $('#content').append(data.loans);
        var items = [];

        // Build the list
        items.push('<ul>');
        items.push(makeListItems(title, data.loans));
        items.push('</ul>');

        $('#content').html(items.join(''));
        // Pagination
        var prev_page = '';
        if (data.paging.page > 1) {
            prev_page = '<a href="index.html?page=' + (data.paging.page - 1) + '">Previous Page</a>';
        }

        var next_page = '';
        if (data.paging.page < data.paging.pages) {
            next_page = '<a"test" href="index.html?page=' + (data.paging.page + 1) + '">Next Page</a>';
        }

        $('<div/>').html(prev_page + ' ' + data.paging.page + ' of ' + data.paging.pages + ' ' + next_page)
            .appendTo('#content');

        // Create links to loan pages
        $('.id').each(function () {
            $(this).wrapInner('<a href="index.html?loan_id=' + $(this).text().substring(4, $(this).text().length) + '" />');
        });
    });

    function showResponse(response) {
        RESPONSE = response;
        
        $.each(response.lenders, function(i, lenderData) {
            Results.insert({lender_id: lenderData.lender_id, data: lenderData.name+", "+lenderData.whereabouts})
        });
        /*
        if (this && this.url && (typeof (this.url) == "string")) {
            var anchor = jQuery("#url");
            anchor.text(this.url.toString());
            anchor.attr('href', this.url.toString());
        }
        jQuery("#content").text(JSON.stringify(response, null, '  '));
        */
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
function makeListItems(key, val) {
        var items = [];

        items.push('<li><b>' + key + '</b><ul>');

        $.each(val, function(key, val) {
            if (typeof(val) == 'object') {
                items.push(makeListItems(key, val));
            } else {
                items.push('<li class="' + key + '">' + key + ': ' + val + '</li>');
            }
        });

        items.push('</ul></li>');

        return items.join('');
    }

if (Meteor.isClient) {
    lender = "jeremy";
    Template.body.events({
        "submit .lenders": function (event) {
            // This function is called when the new task form is submitted
            lender = event.target.text.value;
            
            // Clear form
            event.target.text.value = "";
        }
        });
    
    console.log(lender);
    var page = '';
    var loan_id = 'text';

    url = 'http://api.kivaws.org/v1/lenders/' + lender +'/loans.json';
    title = 'Loan';

    // Request loan data
    $.getJSON(url, function(data) {
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
            prev_page = '<a href="index.html?page='+(data.paging.page-1)+'">Previous Page</a>';
        }

        var next_page = '';
        if (data.paging.page < data.paging.pages) {
            next_page = '<a href="index.html?page='+(data.paging.page+1)+'">Next Page</a>';
            }

        $('<div/>').html(prev_page+' '+data.paging.page+' of '+data.paging.pages+' '+next_page)
            .appendTo('#content');

        // Create links to loan pages
        $('.id').each(function () {
            $(this).wrapInner('<a href="index.html?loan_id='+$(this).text().substring(4,$(this).text().length)+'" />');
            });
    });

};


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

function makeListItems(key, val) {
	// Function found through sample code.
	var items = [];
	items.push('<b>' + key + '</b><br>');
	$.each(val, function(key, val) {
		if (typeof(val) == 'object') {
			items.push(makeListItems(key, val));
		} else {
			items.push(key + ': ' + val + '<br>');
		}
	});
	items.push('</ul></li>');
	return items.join('');
}
function indexCountry(array, row){
	
	for(var i = 0; i < array.length; i++){
		if(array[i][0] == row) return i;
	
	}
	
	return -1;
}
var lenderID = "matt" 
var lendersite = "http://api.kivaws.org/v1/lenders/" + lenderID+"/loans.json" //URL for lender JSON data
// Making the getJSON method not asynchronous
var countries = [];
$.ajax({
    complete: function(){
    	// loading google geochart below
		google.load("visualization", "1", {packages:["geomap"]});
		google.setOnLoadCallback(drawRegionsMap);
		function drawRegionsMap() {
			var countryData = google.visualization.arrayToDataTable(countries);
			var options = {};
			options['colors'] = [0x50C878, 0x228B22, 0x013220];
			options['width'] = "900px";
			options['height'] = '500px';
			var chart = new google.visualization.GeoMap(document.getElementById('regions_div'));
			chart.draw(countryData, options);
      }
	  // end of loading google geochart stuff
	  
	  // display loan information
	  document.write("<b>Total Loaned</b>: $" + loanTotal + "<br /><b>Number of Loans</b>: "+data.loans.length+"<br /><b>Average of Loans</b>: $" + Math.round(100*loanTotal/data.loans.length)/100 +"<br />");    
    }
    success: function(){
$.getJSON(lendersite, function( data ){
	var items = [];
	var title="Loan";
	items.push(makeListItems(title, data.loans));
	//document.write(items[0])
//	var element = []; //Separate each line into a different element in an array
	entries = items[0].split("<br>")
	var countries = [['Country', 'Popularity']];
	var loanTotal = 0;
	for (i=0;i<entries.length;i++) {
	//document.write(entries[i]+'<br>');
		if (entries[i].indexOf(": ") == -1) {
		}
		else {
			//document.write(entries[i] + "<br>") //debugging
			row = entries[i].split(": ")
			if (row[0]=="country"){
				var index = indexCountry(countries, row[1]);
				if(index == -1) countries.push([row[1], 1]);
				else countries[index][1]++;
			}
			else if(row[0] == "loan_amount"){
				loanTotal += parseInt(row[1]);
			}
		}
	} // end of for-loop
	});
}





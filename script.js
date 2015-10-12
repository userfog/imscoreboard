// app wide global
var app = {
	"selectorIndex": -1,
	"numTeams":13,
	"lastScrollTop": 0,
	"doScroll": true,
	inc : function(){
		this.selectorIndex = Math.min(12, (this.selectorIndex+1));
	},
	dec : function(){
		this.selectorIndex = Math.max(-1,(this.selectorIndex-1));
	}
};

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Make the actual CORS request.
function makeCorsRequest(source) {
  var xhr = createCORSRequest('GET', source);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }
  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    main(text);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}

// Convert a given row to an object
function convert_row(headers, row){
	var d = {};
	row = row.split(",");
	// JSON parse is important here otherwise strings
	// will look like ""house"", etc.
	$.each(row, function(i, val){d[JSON.parse(headers[i])] = JSON.parse(row[i]);});
	return d;
}

function down(){
	app.inc();
	$("section").eq(app.selectorIndex).addClass("active");
	var sec = $("section.active");
	$('html, body').animate({
			scrollTop: $(".active").offset().top
		}, 200);
	sec.removeClass("active");
}
function up(){
	var sec = $("section.active");
	sec.removeClass("active");
	app.dec();	
	if(app.selectorIndex == -1){
		$('html, body').animate({
  			scrollTop: $("div:first").offset().top
  		}, 200);
	}
	else{
		$("section").eq(app.selectorIndex).addClass("active");
		$('html, body').animate({
  			scrollTop: $(".active").offset().top
  		}, 200);
	}
}

function snap_to_section(){
	window.addEventListener('keyup', function(e){
		if (e.keyCode == 40) {
			down();
		}
		if(e.keyCode == 38){
			up();
		}
	});
}

// Convert Data to list of objects
function main(data){
	obs = []
	data = data.trim();
	data = data.split("\n");
	headers = $.map(data[0].split(","), function(val, i){return val.toLowerCase();});
	data.shift();

	$.each(data, function(i, val){
		var d = convert_row(headers, val);
		obs.push(d); 
	});

	obs.sort(function(a,b){
		return b.total - a.total;
	});
	
	
	var iso = $("#iso");

	$.each(obs, function(i, val){
		s = val.house + ".png";
		var el = '<a href="#'+ val.house +'"><img height="60" width="47" src='+ '"' + s + '"' +'></a>'
		iso.append(el);
	});

	
	var container = $("#container");
	$.each(obs, function(i, val){
		
		var el ='<section id="'+ val.house +'">' +
					'<div class="houseContainer">' +
						'<span class="houseInfo">' + val.house + '</br>' + val.total + '</span>' +
					'</div>' +
				'</section>';
		container.append(el);
	});


	$.each(obs, function(i,val){
		bkg = "rsz_" + val.house + "_bkgrd.jpg"
		var selector = "#" + val.house;
		$(selector).backstretch(bkg);
	});

	snap_to_section();
	jQuery(".houseContainer").fitText(1.2, { maxFontSize: '90px' });
	setTimeout(function(){
		NProgress.done();
	}, 2000);
	
}
// Build Dom
function setup(){
	NProgress.start();
	$.support.cors = true;
	var source = "https://docs.google.com/spreadsheets/d/1DwrxD-JTCQG4zuQgAVVma4E-K6DrYECyl25ZzrkI0ww";
	makeCorsRequest(source);
	$('#bigtext').fitText(.65, { maxFontSize: '120px' });
}
// Get the data from the Google Doc
$(document).ready(setup);

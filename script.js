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
	// window.addEventListener('scroll', function(){
	// 	var st = $(window).scrollTop();
	// 	console.log(st);
	// 	if(st>app.lastScrollTop){
	// 		console.log("Scroll Down");

	// 	}
	// 	else{
	// 		console.log("Scroll Up");
			
	// 	}
	// 	app.lastScrollTop = st;
	// });
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
		s = val.house + " (Mobile).gif";
		var el = '<a href="#'+ val.house +'"><img height="60" width="50" src='+ '"' + s + '"' +'></a>'
		iso.append(el);
	});

	
	var container = $("#container");
	$.each(obs, function(i, val){
		s = val.house + ".gif";
		bkg = val.house + "_bkgrd.jpg"
		var el ='<section style="background: url('+ bkg +') fixed; background-size: cover; background-repeat: no-repeat;">' +
					'<div id="'+ val.house +'" class="houseContainer">' +
						'<span class="houseInfo">' + val.house + '</br>' + val.total + '</span>' +
					'</div>' +
				'</section>';
		container.append(el);
	});
	snap_to_section();
	jQuery(".houseContainer").fitText(1.2, { maxFontSize: '90px' });

}
// Build Dom
function setup(){
	var source = "http://spreadsheets.google.com/tq?tqx=out:csv&tq=select *&key=0AgMRIqC2ExQudHAyX0sycXdac2dxb0pWSTlndS1RRGc";
	$.get(source, main);
	$('#bigtext').fitText(.65, { maxFontSize: '120px' });
}
// Get the data from the Google Doc
$(document).ready(setup);
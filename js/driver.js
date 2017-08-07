/*
	System Driver
	Author : Nan Cao (nancao.org)
*/
var correlate = vis.correlate(),
	runner = taskrunner();

var start_time = new Date(2016, 1, 3, 0, 59, 0).getTime() / 1000;
var static_time_win = 5 * 300;

// var sensor = {
// 	name:"FI_3702",
// 	c_sensors:[{
// 		name:"LI_3701"
// 	},{
// 		name:"PT_3703"
// 	}]
// };
var count=0;

var sensor = {};

// layout UI and setup events
$(document).ready(function() {
	// init data list
	var params = location.search
		.replace("?", "")
		.substr(1)
		.split("&"),
		idx = parseFloat(params[0].split("=")[1]);

	var first = true;

	correlate.container("main-view");

	d3.json("./data/finalfinal7.json", function(error, d) {
		if (error) {
			console.log(error)
			return;
		}

		runner.tasks(d);

	});


	d3.select("#control").on("click", function() {
		if (!first && !correlate.isReady()) {
			alert("Please brush !");
			return;
		}
		correlate.pushResult();
		var results=correlate.results();
		first = false;
		runner.stop(results);
		runner.next();
		runner.start();
	});

	runner.dispatch.on('start', function() {});
	runner.dispatch.on('stop', function() {
		correlate.clear();
	});
	runner.dispatch.on('next', function(d,did) {

		if (d) {
			display(d,count)
			count=count+1;
		}

	});

});

//////////////////////////////////////////////////////////////////////
// local functions

function display(d,coun) {
	// clean contents
	// d3.select("#view").selectAll("*").remove();

	// var data=$('#dataset').val();
	// if(!data||data==''){
	// 	return;
	// }
	var k=null;
	if(d.type=='positive')
	{
		k=1;
	}else{
		k=-1;
	}
	d1=d.sensors;

	var sensor_num = d1.length;

	var start_time = d1[0].data[0].t;

	sensor.name = d1[0].NNAME;

	sensor.c_sensors = [];

	var Ground_truth = {};

	for (var i = 1; i < sensor_num; i++) {
		var temp = {};
		temp.name = d1[i].NNAME;
		sensor.c_sensors.push(temp);

	}


	var sensor_data = {};

	for (var i = 0; i < sensor_num; i++) {
		sensor_data[d1[i].NNAME] = d1[i].data.filter(function(d) {
			d.v = parseFloat(d.v);
			return d.t >= start_time && d.t <= start_time + static_time_win;
		});

		Ground_truth[d1[i].NNAME] = d1[i].ground_truth;
	}

	correlate.sensor(sensor)
		.kind(k)
		.data(sensor_data)
		.truth(Ground_truth)
		.time_interval([parseInt(start_time * 1000), parseInt((start_time + static_time_win) * 1000)])
		.render();


	// load datasets

};
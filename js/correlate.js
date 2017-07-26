/*
	A code template for a visualization compsvg
	Author : Nan Cao (nancao.org)
*/

vis.correlate = function() {

	var component = {},
		truth = null,
		abnormal = null,
		container = null,
		data = null,
		sensor = null,
		time_interval = null,
		iter = null;

	var results = [];
	var dispatch = d3.dispatch("select", "mouseover", "mouseout");

	component.container = function(_) {
		if (!arguments.length) return container;
		container = _;
		return component;
	};

	component.truth = function(_) {
		if (!arguments.length) return container;
		truth = _;
		return component;
	};

	component.data = function(_) {
		if (!arguments.length) return data;
		data = _;
		return component;
	};

	component.sensor = function(_) {
		if (!arguments.length) return sensor;
		sensor = _;
		return component;
	};

	component.time_interval = function(_) {
		if (!arguments.length) return time_interval;
		time_interval = _;
		return component;
	};

	component.results = function(_) {
		if (!arguments.length) return results;
		results = _;
		return component;
	};

	component.iter = function(_) {
		if (!arguments.length) return iter;
		iter = _;
		return component;
	}

	component.dispatch = dispatch;

	///////////////////////////////////////////////////
	// Private Parameters
	var svg = null;
	var time_axis_g = null;
	var time_marker_g = null;
	var time_event_g = null;
	var chart_g = null;

	var sensor_index = {};
	var sensor_location = {};
	var sensors = [];
	var y_scales = {};
	var real_line_gen, upper_outer_area_gen, upper_median_area_gen, upper_inner_area_gen, median_line_gen,
		lower_inner_area_gen, lower_median_area_gen, lower_outer_area_gen;

	var chosen_time_interval;
	var correlations = [];

	var time_scale = d3.time.scale();
	var width = 0,
		height = 0;
	var margin = {
		left: 50,
		right: 100,
		top: 40,
		bottom: 40
	};
	var single_line_chart_height = 30;
	var single_line_chart_paddind = 4;
	var tool_size = 20;

	var time_axis_height = 20;
	var marker_size = time_axis_height * 0.95;

	var time_markers = [];
	var time_marker_index = {};
	var tick_format_1 = d3.time.format("%b %d");
	var tick_format_2 = d3.time.format("%H:%M:%S");

	var tick_per_length = 10;

	var pre_extent = {};

	var brush = d3.svg.brush()
		.x(time_scale)
		.on("brushend", brushed);

	var brush_appen = {};

	var baseline = [];

	var color_base="#ffffff";
	var color_sd="#238b45";
	var color_hd="#08519c";
	var color_su="#fe9929";
	var color_hu="#980043";



	///////////////////////////////////////////////////
	// Public Function
	component.layout = function() {

		return component;
	};

	component.render = function() {

		if (!container) {
			return;
		}



		var $container = $("#" + container);
		width = $container.width() - margin.left - margin.right;
		height = 1000 - margin.top - margin.bottom;

		time_scale.range([0, width]).domain(time_interval);

		d3.selectAll(".text").remove();

		d3.select("#" + container)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", 30)
			.attr("class","text")
			.append("text")
			.attr("transform","translate("+(width/2+margin.left)+",30)")
			.text("Task "+(iter+1)+"/108")


		svg = d3.select("#" + container)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + (margin.top) + ")");

		var time_axis_component = svg.append("g");
		time_axis_g = time_axis_component.append("g").attr("class", "x_axis");
		time_event_g = time_axis_component.append("g").attr("class", "time-event");
		time_marker_g = time_axis_component.append("g").attr("class", "time-marker");

		draw_time_axis(time_axis_g);

		time_interval.forEach(function(ele, i) {
			var marker = {
				time: ele,
				position: time_scale(ele),
				status: "fixed"
			};
			time_markers.push(marker);
			time_marker_index[parseInt(ele).toString()] = i;
		});

		y_scales[sensor.name] = d3.scale.linear()
			.domain(get_y_domain(data[sensor.name]))
			.range([single_line_chart_height, 0]);

		sensors.push({
			id: 0,
			name: sensor.name,
			type: "main"
		})

		sensor_index[sensor.name] = 0;
		sensor_location[sensor.name] = 0;

		sensor.c_sensors.forEach(function(c_sensor, i) {
			y_scales[c_sensor.name] = d3.scale.linear()
				.domain(get_y_domain(data[c_sensor.name]))
				.range([single_line_chart_height, 0]);

			sensors.push({
				id: i,
				name: c_sensor.name,
				type: "correlated"
			});

			sensor_index[c_sensor.name] = i + 1;
			sensor_location[c_sensor.name] = i + 1;
		});

		real_line_gen = d3.svg.line()
			.interpolate("basis")
			.x(function(d) {
				return time_scale(d.t * 1000);
			})
			.y(function(d) {
				return y_scales[d.name](d.v);
			});

		baseline = data[sensors[0].name].filter(function(d) {
			return d.t >= truth[sensors[0].name][0] && d.t <= truth[sensors[0].name][1];
		})

		// var svg2=d3.select("#test-view")
		// 	.append("svg")
		// 	.attr("width", width + margin.left + margin.right)
		// 	.attr("height", 160 + margin.top + margin.bottom)
		// 	.append("g")
		// 	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// var test_width=120;

		// var test_scale1=d3.time.scale().range([0, test_width]).domain(truth["main"]);

		// real_line_gen2 = d3.svg.line()
		// 	.interpolate("basis")
		// 	.x(function(d) {
		// 		return test_scale1(d.t);
		// 	})
		// 	.y(function(d) {
		// 		return y_scales[d.name](d.v);
		// 	});

		// svg2.append("g")
		// 	.attr("transform","translate(0,-8)")
		// 	.append("path")
		// 	.attr("d",real_line_gen2(baseline))
		// 	.attr("fill",'none')
		// 	.attr("stroke","black");

		// for(var i=1;i<baseline.length-1;i++){
		// 	//var delta_af=0
		// 	//if(i==0){
		// 	//	delta_af=baseline[i].v-temp;
		// 	//}else{
		// 		delta_af=baseline[i].v-baseline[i-1].v
		// 	//}
			
		// 	var delta_be=baseline[i+1].v-baseline[i].v;
		// 	var temp_color=null;
		// 	if(delta_af>=0){
		// 		if(delta_be<=0){
		// 			temp_color='#ef3b2c'
		// 		}else{
		// 			temp_color='#fed976'
		// 		}
		// 	}else{
		// 		if(delta_be<=0){
		// 			temp_color='#41ab5d'
		// 		}else{
		// 			temp_color='#2171b5'
		// 		}
		// 	}


		// 	svg2.append("rect")
		// 		.attr("x",test_scale1(baseline[i].t))
		// 		.attr("y",20)
		// 		.attr("width",3)
		// 		.attr("height",30)
		// 		.attr("fill",temp_color)
		// }

		// test_width=1200;

		// var test_scale2=d3.time.scale().range([0, test_width]).domain(time_interval);

		// var real_line_gen3 = d3.svg.line()
		// 	.interpolate("basis")
		// 	.x(function(d) {
		// 		return test_scale2(d.t * 1000);
		// 	})
		// 	.y(function(d) {
		// 		return y_scales[d.name](d.v);
		// 	});

		// var baseline2=data['sub0']

		// var line_data=baseline2.filter(function(d){
		// 	return d.t>=truth['sub0'][0]&&d.t<=truth['sub0'][1];
		// })

		// var D_temp=[];


		// for(var i=0;i<line_data.length;i++){
		// 	var d_temp={}
		// 	d_temp.t=line_data[i].t
		// 	d_temp.v=line_data[i].v-baseline[i].v+25;
		// 	d_temp.name='sub0'
		// 	D_temp.push(d_temp);
		// }

		// svg2.append("g")
		// 	.attr("transform","translate(0,60)")
		// 	.append("path")
		// 	.attr("d",real_line_gen3(line_data))
		// 	.attr("fill",'none')
		// 	.attr("stroke","black");

		// for(var i=1;i<baseline2.length-1;i++){
		// 	//var delta_af=0
		// 	//if(i==0){
		// 		//delta_af=baseline[i].v-temp;
		// 	//}else{
		// 		delta_af=baseline2[i].v-baseline2[i-1].v;
		// 	//}
			
		// 	var delta_be=baseline2[i+1].v-baseline2[i].v;
		// 	var temp_color=null;
		// 	if(delta_af>=0){
		// 		if(delta_be<=0){
		// 			temp_color='#ef3b2c'
		// 		}else{
		// 			temp_color='#fed976'
		// 		}
		// 	}else{
		// 		if(delta_be<=0){
		// 			temp_color='#41ab5d'
		// 		}else{
		// 			temp_color='#2171b5'
		// 		}
		// 	}


		// 	svg2.append("rect")
		// 		.attr("x",test_scale2(baseline2[i].t*1000))
		// 		.attr("y",85)
		// 		.attr("width",3)
		// 		.attr("height",30)
		// 		.attr("fill",temp_color)
		// }

		// var ab_interval = truth['sub0'];

		// var ab_bind = svg2.append("g")
		// 	.append("rect")
		// 	.attr("x", test_scale2(ab_interval[0] * 1000))
		// 	.attr("y", 60)
		// 	.attr("width", test_scale2(ab_interval[1] * 1000) - test_scale2(ab_interval[0] * 1000))
		// 	.attr("height", 70)
		// 	.attr("fill", "none")
		// 	.attr("stroke", "black")
		// 	.attr("stroke-opacity", 0.5);

		for(var i=0;i<sensors.length;i++){
			brush_appen[sensors[i].name]=d3.svg.brush()
				.x(time_scale)
				.on("brush",function(d){
					brush_move(d);
				})
				.on("brushend", function(d) {
					brushed_appen(d);
				});
		}


		var chart_component = svg.append("g");

		chart_component.append("g").selectAll("defs")
			.data(sensors)
			.enter()
			.append("defs")
			.append("clipPath")
			.attr("id", function(d) {
				return "inspection-clip-" + d.name;
			})
			.append("rect")
			.attr("width", width)
			.attr("height", single_line_chart_height);

		chart_g = chart_component.append("g").selectAll("g.chart")
			.data(sensors)
			.enter()
			.append("g")
			.attr("class", function(d) {
				return "chart " + d.name;
			})
			.attr("id",function(d){
				return "chart_"+d.name;
			})
			.attr("value", function(d) {
				return d.name;
			})
			.attr("transform", function(d) {
				return "translate(0," + ((single_line_chart_height + 2 * single_line_chart_paddind) * sensor_location[d.name] + single_line_chart_paddind) + ")";
			});

		chart_g.each(function(d) {
			var current_chart = d3.select(this);
			if (d.name == 'main') {
				results.push(0);
			}
			draw_single_chart(current_chart, d, data[d.name])
		})

		return component.update();
	};

	component.update = function() {

		return component;
	};

	component.draw_correlation = function() {
		if (chosen_time_interval) {
			var correlated_time_intervals = get_correlated_time_interval(sensor.name, sensor.c_sensors, chosen_time_interval);

			correlations[0]=(correlated_time_intervals);

			svg.selectAll(".correlation-g").remove();

			var correlation_g = svg.append("g")
				.attr("class", "correlation-g");

			// correlation_g.append("g")
			// 	.selectAll("rect")
			// 	.data(sensors)
			// 	.enter()
			// 	.append("rect")
			// 	.attr("width", function(d) {
			// 		return time_scale(correlated_time_intervals[d.name][1] * 1000) - time_scale(correlated_time_intervals[d.name][0] * 1000)
			// 	})
			// 	.attr("height", single_line_chart_height)
			// 	.attr("transform", function(d, i) {
			// 		return "translate(" + time_scale(correlated_time_intervals[d.name][0] * 1000) + "," + ((single_line_chart_height + 2 * single_line_chart_paddind) * (sensor_location[d.name]) + single_line_chart_paddind) + ")";
			// 	})
			// 	.attr("fill", "yellow")
			// 	.attr("fill-opacity", 0.3)
			// 	.attr("stroke", "yellow");

			for(var i=1;i<sensors.length;i++){
				var current_brush=brush_appen[sensors[i].name]
				current_brush.extent([correlated_time_intervals[sensors[i].name][0] * 1000, correlated_time_intervals[sensors[i].name][1] * 1000]);
  				current_brush(d3.select("#brush-" + sensors[i].name).transition());
    			current_brush.event(d3.select("#brush-" + sensors[i].name).transition().delay(1))
			}
			
			correlation_g.append("g")
				.selectAll("path")
				.data(sensors.filter(function(ele) {
					return ele.name != sensor.name;
				}))
				.enter()
				.append("path")
				.attr("stroke", "black")
				.attr("stroke-width",2)
				.attr("fill", "black")
				.attr("fill-opacity", 0.3)
				.attr("transform", function(d) {
					return "translate(0," + ((single_line_chart_height + 2 * single_line_chart_paddind) * (sensor_location[d.name] - 1) + single_line_chart_paddind + single_line_chart_height + ")");
				})
				.attr("d", function(d) {
					var prev_sensor = get_prev_sensor(d.name);
					var prev_interval = time_scale(correlated_time_intervals[prev_sensor][1] * 1000) - time_scale(correlated_time_intervals[prev_sensor][0] * 1000)
					var current_interval = time_scale(correlated_time_intervals[d.name][1] * 1000) - time_scale(correlated_time_intervals[d.name][0] * 1000);
					return "M" + (time_scale(correlated_time_intervals[prev_sensor][0] * 1000)) + ",0" +
						"L" + (time_scale(correlated_time_intervals[prev_sensor][0] * 1000) + prev_interval) + ",0" +
						"L" + (time_scale(correlated_time_intervals[d.name][0] * 1000) + current_interval) + "," + (2 * single_line_chart_paddind) +
						"L" + (time_scale(correlated_time_intervals[d.name][0] * 1000)) + "," + (2 * single_line_chart_paddind) + "Z";

				})

			// correlation_g.append("g")
			// 	.selectAll("path")



		} else {
			alert("please brush a time interval");
		}
	}

	// component.pushResult = function(){

	// 	var results=[];

	// 	for(var i=0;i<sensor.c_sensors.length;i++){
	// 		var current_brush = d3.select("#brush-"+sensor.c_sensors[i].name);
	// 		var current_x = parseFloat(current_brush.select(".extent").attr("x"));
	// 		var current_width = parseFloat(current_brush.select(".extent").attr("width"));

	// 		var true_x = time_scale(truth[sensor.c_sensors[i].name][0]*1000);
	// 		var true_width = time_scale(truth[sensor.c_sensors[i].name][1]*1000)-true_x;

	// 		var intersection = four_min(current_width, true_width, true_x+true_width-current_x, current_x+current_width-true_x);
	// 		var ratio = 0;
	// 		if(intersection>0){
	// 			var union = Math.max(true_x+true_width,current_x+current_width)-Math.min(true_x,current_x);
	// 			var ratio = intersection/union;
	// 		}
	// 		results.push(ratio);
	// 	}

	// 	var url_result = "data/results?radio="+ results;

	// 	$.get(url_result, function(d){
	// 		return ;
	// 	});

	// }

	component.isReady = function() {

		var num_sub = sensors.length - 1;
		for (var i = 0; i < num_sub; i++) {

			if (d3.select("#brush-" + sensors[i + 1].name).select(".extent").attr("width") == '0') {
				return false;
			}
		}

		return true;
	}

	component.clear = function() {
		svg = null;
		// svg.select(".brush .extent").attr("width",0).attr("x",0);
		// svg.select(".brush .resize").attr("translate(0,0)");
		brush.clear();
		for(var i=0;i<sensors.length;i++){
			brush_appen[sensors[i].name].clear();
		}
		
		d3.select("#" + container).selectAll("*").remove();
		correlations = [];
		sensor_index = {};
		sensors = [];
		y_scales = {};
		results = [];
		return component;
	}

	///////////////////////////////////////////////////
	// Private Functions

	function update_correlation(duration,opacity) {
		svg.selectAll(".correlation-g").each(function (ele,index){
			// d3.select(this).selectAll("rect")
			// 	.transition()
			// 	.duration(duration)
			// 	.attr("width",function(d){
			// 		return time_scale(correlations[0][d.name][1]*1000)-time_scale(correlations[0][d.name][0]*1000)
			// 	})
			// 	.attr("transform",function(d){
			// 		return "translate("+time_scale(correlations[0][d.name][0]*1000)+","+((single_line_chart_height + 2 * single_line_chart_paddind) * (sensor_location[d.name]) + single_line_chart_paddind)+")";
			// 	});
			d3.select(this).selectAll("path")
				.transition()
				.duration(duration)
				.attr("transform",function(d){
					return "translate(0," + ((single_line_chart_height + 2 * single_line_chart_paddind) * (sensor_location[d.name] - 1) + single_line_chart_paddind + single_line_chart_height) + ")";
				})
				.attr("d",function(d){
					var prev_sensor = get_prev_sensor(d.name);
					var prev_interval = time_scale(correlations[0][prev_sensor][1] * 1000) - time_scale(correlations[0][prev_sensor][0] * 1000);
					var current_interval = time_scale(correlations[0][d.name][1] * 1000) - time_scale(correlations[0][d.name][0] * 1000);
					 var d_path="M" + (time_scale(correlations[0][prev_sensor][0] * 1000)) + ",0" +
						"L" + (time_scale(correlations[0][prev_sensor][0] * 1000) + prev_interval) + ",0" +
						"L" + (time_scale(correlations[0][d.name][0] * 1000) + current_interval) + "," + (2 * single_line_chart_paddind) +
						"L" + (time_scale(correlations[0][d.name][0] * 1000)) + "," + (2 * single_line_chart_paddind) + "Z";
					return "M" + (time_scale(correlations[0][prev_sensor][0] * 1000)) + ",0" +
						"L" + (time_scale(correlations[0][prev_sensor][0] * 1000) + prev_interval) + ",0" +
						"L" + (time_scale(correlations[0][d.name][0] * 1000) + current_interval) + "," + (2 * single_line_chart_paddind) +
						"L" + (time_scale(correlations[0][d.name][0] * 1000)) + "," + (2 * single_line_chart_paddind) + "Z";
				})
				.style("stroke-opacity",opacity)
				.style("fill-opacity",opacity-0.3)
		});
	}

	function four_min(a, b, c, d) {
		var temp1 = Math.min(a, b);
		var temp2 = Math.min(c, d);
		var temp3 = Math.min(temp1, temp2);
		return temp3;
	}

	function draw_single_chart(container, sen, time_series) {

		var sub_chart = container.append("g")
			.attr("class", "sub-chart");


		if (sen.type != 'main') {
			// var checkbox = container.append("g")
			// 	.attr("transform","translate("+(width+5)+",0)")

			// checkbox.append("foreignObject")
			// 	.datum(sen)
			// 	.attr('x',0)
			// 	.attr('y',0)
			// 	.attr('width',30)
			// 	.attr('height',20)
			// 	.append("xhtml:body")
			// 	.html("<form><input type=checkbox id=check_"+sen.id+" disabled></input></form>")
			// 	.on("click", function(d){

			// 		var current_brush = d3.select("#brush-"+d.name);
			// 		var current_x = parseFloat(current_brush.select(".extent").attr("x"));
			// 		var current_width = parseFloat(current_brush.select(".extent").attr("width"));

			// 		if(current_width==0){
			// 			alert("Please brush !")
			// 			d3.select(this).attr("checked",false);
			// 		}else{
			// 			var true_x = time_scale(truth[d.name][0]*1000);
			// 			var true_width = time_scale(truth[d.name][1]*1000)-true_x;

			// 			var intersection = four_min(current_width, true_width, true_x+true_width-current_x, current_x+current_width-true_x);
			// 			var ratio = 0;
			// 			if(intersection>0){
			// 				var union = Math.max(true_x+true_width,current_x+current_width)-Math.min(true_x,current_x);
			// 				var ratio = intersection/union;
			// 			}
			// 			results[sensor_index[d.name]-1]=ratio;
			// 		}
			// 	})

			var floating = container.append("g")
				.attr("transform", "translate(" + (width + 5) + ",0)")
				.datum(sen);

			floating.append("text")
				.attr("transform", "translate(0," + (single_line_chart_height/2-9) + ")")
				.attr("font-family", "FontAwesome")
				.attr("font-size", tool_size)
				.text("\uf01b")
				.on("click", function(d) {
					if (sensor_location[d.name] == 0 || sensor_location[d.name] == 1) {
						alert("already up most");
					} else {
						var prev_sensor = get_prev_sensor(d.name);
						sensor_location[d.name] = sensor_location[d.name] - 1;
						sensor_location[prev_sensor] = sensor_location[prev_sensor] + 1;
						svg.selectAll(".chart")
							.transition()
							.duration(1000)
							.attr("transform", function(d) {
								return "translate(0," + ((single_line_chart_height + 2 * single_line_chart_paddind) * sensor_location[d.name] + single_line_chart_paddind) + ")";
							});

						update_correlation(100)

					}
				});

			floating.append("text")
				.attr("transform", "translate(0," + (single_line_chart_height/2+9) + ")")
				.attr("font-family","FontAwesome")
				.attr("font-size",tool_size)
				.text("\uf01a")
				.on("click",function(d){
					if (sensor_location[d.name]==0||sensor_location[d.name]==(sensors.length-1)){
						alert("already bottom most")
					}else{
						var next_sensor = get_next_sensor(d.name);
						sensor_location[d.name]=sensor_location[d.name]+1;
						sensor_location[next_sensor]=sensor_location[next_sensor]-1;
						svg.selectAll(".chart")
							.transition()
							.duration(1000)
							.attr("transform", function(d) {
								return "translate(0," + ((single_line_chart_height + 2 * single_line_chart_paddind) * sensor_location[d.name] + single_line_chart_paddind) + ")";
							});

						update_correlation(100)
					}
				})


		}



		if (sen.type == "main") {
			container.append("g")
				.attr("class", "x brush")
				.call(brush)
				.selectAll("rect")
				.attr("height", single_line_chart_height);
		} else {
			container.append("g")
				.datum(sen)
				.attr("class", "x brush")
				.attr("id", "brush-" + sen.name)
				.call(brush_appen[sen.name])
				.selectAll("rect")
				.attr("height", single_line_chart_height);
		}

		// sub_chart.each(function(d){
		var current_time_series = time_series.filter(function(ele) {
			return ele.t * 1000 <= time_markers[1].time && ele.t * 1000 >= time_markers[0].time;
		});

		// 	var current_point_density=current_time_series.length/((d[1].position-d[0].position)>0 ? (d[1].position-d[0].position):1);

		draw_line_chart(sub_chart, current_time_series, sen);
		// });
	}

	function draw_line_chart(container, time_series, sen) {
		container.attr("value", "line-chart");

		var ab_interval = truth[sen.name];

		if(sen.type=='main'){
		var ab_bind = container.append("g")
			.append("rect")
			.attr("x", time_scale(ab_interval[0] * 1000))
			.attr("y", 0)
			.attr("width", time_scale(ab_interval[1] * 1000) - time_scale(ab_interval[0] * 1000))
			.attr("height", single_line_chart_height)
			.attr("fill", "none")
			.attr("stroke", "black")
			.attr("stroke-opacity", 0.5);
		}


		var paths = container.append("g")
			.datum(time_series)
			.attr("clip-path", function(d) {
				return "url(#inspection-clip-" + d.name + ")"
			});

		paths.append("path").attr("class", "real-line").attr("d", real_line_gen(time_series));

		var y_axis = d3.svg.axis().scale(y_scales[sen.name]).orient("left").ticks(9);



		container.append("g")
			.attr("class", "y axis")
			.attr("transform", function(d) {
				return "translate(" + time_scale(time_interval[0]) + ",0)";
			})
			.call(y_axis);
	}

	function draw_time_axis(container) {
		container.append("path")
			.attr("d", "M0,0L" + width + ",0")
			.attr("stroke", "black")
			.attr("stroke-width", 2);
		draw_ticks(container);
	};

	function draw_ticks(container) {
		var ticks = calculate_ticks(time_scale.domain().map(function(d) {
			return d.getTime();
		}), time_scale.range());
		container.selectAll(".ticks").remove();

		var tick_g = container.selectAll(".ticks")
			.data(ticks)
			.enter()
			.append("g")
			.attr("class", "ticks");

		tick_g.each(function(data) {
			var tick = d3.select(this).selectAll(".tick")
				.data(data.map(function(ele) {
					return new Date(ele);
				}))
				.enter()
				.append("g")
				.attr("class", "tick")
				.attr("transform", function(d) {
					return "translate(" + time_scale(d) + ",0)";
				});

			tick.append("line")
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", 0)
				.attr("y2", function(d, i) {
					if (i == 0 || i == data.length - 1) {
						return -10;
					} else {
						if (i % 10 == 0) {
							return -6;
						} else {
							return -4;
						}
					}
				})
				.attr("stroke", "black")
				.attr("stroke-width", 1);

			tick.append("text")
				.attr("transform", "translate(0," + (-6 * 2.5) + ")")
				.style("text-anchor", "center")
				.text(function(d, i) {
					if (i == 0 || i == data.length - 1) {
						return "";
					} else {
						if (i % 10 == 0) {
							return tick_format_1(d);
						} else {
							return "";
						}
					}
				})
				.style("font-size", marker_size / 4)
				.style("text-anchor", "middle");

			tick.append("text")
				.attr("transform", "translate(0," + (-6 * 1.2) + ")")
				.style("text-anchor", "center")
				.text(function(d, i) {
					if (i == 0 || i == data.length - 1) {
						return "";
					} else {
						if (i % 10 == 0) {
							return tick_format_2(d);
						} else {
							return "";
						}
					}
				})
				.style("font-size", marker_size / 4)
				.style("text-anchor", "middle");

		});
	};

	function calculate_ticks(domain, range) {
		var ticks = [];
		for (var i = 0; i < domain.length - 1; i++) {
			ticks[i] = [];
			var start_time = domain[i];
			var end_time = domain[i + 1];
			var tick_unit = Math.floor((domain[i + 1] - domain[i]) / (range[i + 1] - range[i]) * tick_per_length);
			if (tick_unit > 60 * 1000) {
				tick_unit = Math.floor(tick_unit / (60 * 1000)) * (60 * 1000);
			}

			for (var current = start_time; current <= end_time; current += tick_unit) {
				ticks[i].push(current);
			}
			return ticks;
		}

		return ticks;
	}

	function get_y_domain(values) {
		var minimun = d3.min(values.map(function(d) {
			if (d.p_v && d.s) {
				return d3.min([d.v, d.p_v - 3 * d.s]);
			} else {
				return d.v;
			}
		}));

		var maximun = d3.max(values.map(function(d) {
			if (d.p_v && d.s) {
				return d3.max([d.v, d.p_v + 3 * d.s]);
			} else {
				return d.v;
			}
		}));

		var padding = (maximun - minimun) * 0.1;
		return [minimun - padding, maximun + padding];
	}

	function get_correlated_time_interval(sen, c_sens, chosen_time_interval) {
		var interval = chosen_time_interval[1] - chosen_time_interval[0];
		var time_span = 10 * 60;
		var shift_param = 30;

		var correlated_time_intervals = {};

		var start_time = time_interval[0] / 1000 > (chosen_time_interval[0] - time_span) ? (time_interval[0] / 1000) : (chosen_time_interval[0] - time_span);
		var end_time = time_interval[1] / 1000 < (chosen_time_interval[1] + time_span) ? (time_interval[1] / 1000) : (chosen_time_interval[1] + time_span);

		end_time = start_time + Math.floor((end_time - interval - start_time) / shift_param) * shift_param + interval;

		var main_values = data[sen].filter(function(ele) {
			return ele.t >= chosen_time_interval[0] && ele.t <= chosen_time_interval[1]
		}).map(function(ele) {
			return ele.v;
		});

		c_sens.forEach(function(c_sen) {

			correlated_time_intervals[c_sen.name] = [];
			var c_sen_values = data[c_sen.name].filter(function(ele) {
				return ele.t >= start_time && ele.t <= end_time
			});


			var dist = 100000;
			var iterations = parseInt((end_time - interval - start_time) / shift_param)
			for (var i = 0; i < iterations; i++) {
				var current_values = c_sen_values.filter(function(ele) {
					return ele.t >= (start_time + i * shift_param) && ele.t <= (start_time + i * shift_param + interval)
				}).map(function(ele) {
					return ele.v;
				});

				var dtw = DynamicWarping(main_values, current_values, function(a, b) {
					return Math.min(Math.abs(50 - a - b), Math.abs(a - b));
				});

				if (dtw < dist) {
					dist = dtw;
					correlated_time_intervals[c_sen.name] = [start_time + i * shift_param, start_time + i * shift_param + interval];
				}
			}

		});

		correlated_time_intervals[sen] = chosen_time_interval;

		return correlated_time_intervals;
	}

	function DynamicWarping(ts1, ts2, distanceFunction) {
		var ser1 = ts1;
		var ser2 = ts2;
		var distFunc = distanceFunction;
		var distance;
		var matrix;
		var path;

		matrix = [];
		for (var i = 0; i <= ser1.length; i++) {
			matrix[i] = [];
			for (var j = 0; j <= ser2.length; j++) {
				matrix[i][j] = Infinity;
			}
		}
		matrix[0][0] = 0;

		for (var i = 1; i <= ser1.length; i++) {
			// var low=Math.max(1,i-w);
			// var up=min(ser2.length,i+w);
			for (var j = 1; j <= ser2.length; j++) {
				var cost = distFunc(ser1[i - 1], ser2[j - 1]);
				var findMin = Math.min(matrix[i - 1][j], matrix[i][j - 1]);
				findMin = Math.min(findMin, matrix[i - 1][j - 1]);
				matrix[i][j] = cost + findMin;
			}
		}

		// for ( var i = 0; i < ser1.length; i++ ) {
		//   matrix[ i ] = [];
		//   for ( var j = 0; j < ser2.length; j++ ) {
		//     var cost = Infinity;
		//     if ( i > 0 ) {
		//       cost = Math.min( cost, matrix[ i - 1 ][ j ] );
		//       if ( j > 0 ) {
		//         cost = Math.min( cost, matrix[ i - 1 ][ j - 1 ] );
		//         cost = Math.min( cost, matrix[ i ][ j - 1 ] );
		//       }
		//     } else {
		//       if ( j > 0 ) {
		//         cost = Math.min( cost, matrix[ i ][ j - 1 ] );
		//       } else {
		//         cost = 0;
		//       }
		//     }
		//     matrix[ i ][ j ] = cost + distFunc( ser1[ i ], ser2[ j ] );
		//   }
		// }

		//console.log(matrix);
		//console.log(ser1.length);
		//console.log(ser2.length);

		return matrix[ser1.length][ser2.length];
	}

	function brushed() {
		chosen_time_interval = brush.extent();

		chosen_time_interval = chosen_time_interval.map(function(ele) {
			return ele.getTime() / 1000;
		})

		component.draw_correlation();
	}

	function brush_move(_){
		

		var Rect=d3.select("#brush-"+_.name+" .extent");

		var rect_x=parseFloat(Rect.attr("x"));
		var rect_width=parseFloat(Rect.attr("width"));
		var base_width=time_scale(truth["main"][1]*1000)-time_scale(truth["main"][0]*1000);


		var current_chart=d3.select("#chart_"+_.name);

		current_chart.selectAll(".cover").remove();

		current_chart.append("rect")
			.attr("class","cover")
			.attr("x",rect_x)
			.attr("y",0)
			.attr("height",single_line_chart_height)
			.attr("width",Math.min(rect_width,base_width))
			.style("fill","white");

		var current_interval=[time_scale.invert(rect_x).getTime()/1000,time_scale.invert(rect_x+Math.min(rect_width,base_width)).getTime()/1000];
		var interval_data=data[_.name].filter(function(d) {
					return d.t >= current_interval[0] && d.t <= current_interval[1];
				});
		var redraw_pos=[];
		var redraw_neg=[];
		var sum=0;

		for(var i=0;i<interval_data.length;i++){
			var temp1={};
			var temp2={};
			if(interval_data[i].v-baseline[i].v>=0){
				temp1.t=interval_data[i].t;
				temp1.v=interval_data[i].v-baseline[i].v;
				temp1.name=interval_data[i].name;
				temp2.t=interval_data[i].t;
				temp2.v=0;
				temp2.name=interval_data[i].name;	

				sum=sum+temp1.v;
			}else{
				temp1.t=interval_data[i].t;
				temp1.v=0;
				temp1.name=interval_data[i].name;
				temp2.t=interval_data[i].t;
				temp2.v=interval_data[i].v-baseline[i].v;
				temp2.name=interval_data[i].name;

				sum=sum-temp2.v;
			}
			redraw_pos.push(temp1);
			redraw_neg.push(temp2);
		}

		if(interval_data.length>=1){
			redraw_pos.push({'name':interval_data[0].name, 't':interval_data[interval_data.length-1].t, 'v':0})
			redraw_pos.push({'name':interval_data[0].name, 't':interval_data[0].t, 'v':0})
			redraw_neg.push({'name':interval_data[0].name, 't':interval_data[interval_data.length-1].t, 'v':0})
			redraw_neg.push({'name':interval_data[0].name, 't':interval_data[0].t, 'v':0})
		}else{}
		

		var test = y_scales[_.name].domain()[1]/6;

		if(sum/interval_data.length<(y_scales[_.name].domain()[1]-25)/6){
			Rect.style("stroke","yellow")
				.style("stroke-width",8)
		}else{
			Rect.style("stroke","black")
				.style("stroke-width",2)
		}

		var real_line_diff = d3.svg.line()
					.interpolate("linear")
					.x(function(d) {
						return time_scale(d.t * 1000);
					})
					.y(function(d) {
						return y_scales['main'](d.v+25);
					});

		current_chart.selectAll(".diff").remove();


		current_chart.append("path")
			.attr("class","diff")
			.attr("d",real_line_diff(redraw_pos))
			.style("stroke","red")
			.style("fill","red");

		current_chart.append("path")
			.attr("class","diff")
			.attr("d",real_line_diff(redraw_neg))
			.style("stroke","blue")
			.style("fill","blue");

		var Rect=d3.select("#brush-"+_.name+" .extent");

		var rect_x=parseFloat(Rect.attr("x"));
		var rect_width=parseFloat(Rect.attr("width"));
		var base_width=time_scale(truth["main"][1]*1000)-time_scale(truth["main"][0]*1000);

		correlations[0][_.name]=[time_scale.invert(rect_x).getTime()/1000,time_scale.invert(rect_x+rect_width).getTime()/1000];

		update_correlation(1,0.4);
	}

	function brushed_appen(_) {



		var current_rect = $("#brush-" + _.name + " .extent");

		var Rect=d3.select("#brush-"+_.name+" .extent");

		var rect_x=parseFloat(Rect.attr("x"));
		var rect_width=parseFloat(Rect.attr("width"));
		var base_width=time_scale(truth["main"][1]*1000)-time_scale(truth["main"][0]*1000);

		correlations[0][_.name]=[time_scale.invert(rect_x).getTime()/1000,time_scale.invert(rect_x+rect_width).getTime()/1000];

		update_correlation(100,1);



		current_rect.tipsy({
			trigger: 'hover',
			opacity: 1,
			html: true,
			title: function() {
				var temp = this.x.baseVal.value;

				var current_sensor = this.__data__

				var tipsy_width = 160;


				var base_line = baseline;
				var base_interval = truth["main"];

				var current_start = time_scale.invert(this.x.baseVal.value).getTime();
				var current_end = time_scale.invert(this.x.baseVal.value + this.width.baseVal.value).getTime();

				var current_interval = [current_start, current_end];
				var current_line = data[current_sensor.name].filter(function(d) {
					return d.t >= current_start / 1000 && d.t <= current_end / 1000;
				});


				var current_width = tipsy_width * (current_end - current_start) / (base_interval[1] * 1000 - base_interval[0] * 1000);
				var temp = base_interval.map(function(d) {
					return d * 1000;
				})

				var time_scale_base = d3.time.scale().range([0, tipsy_width]).domain(base_interval.map(function(d) {
					return d * 1000;
				}));
				var time_scale_current = d3.time.scale().range([0, current_width]).domain(current_interval);



				real_line_base = d3.svg.line()
					.interpolate("basis")
					.x(function(d) {
						var temp = time_scale_base(d.t * 1000)
						return time_scale_base(d.t * 1000);
					})
					.y(function(d) {
						return y_scales['main'](d.v);
					});

				real_line_current = d3.svg.line()
					.interpolate("basis")
					.x(function(d) {
						var temp = time_scale_current(d.t * 1000)
						return time_scale_current(d.t * 1000);
					})
					.y(function(d) {
						return y_scales['main'](d.v);
					});

				real_line_invert = d3.svg.line()
					.interpolate("basis")
					.x(function(d) {
						return time_scale_current(d.t * 1000);
					})
					.y(function(d) {
						return y_scales['main'](50 - d.v);
					});

				var temp = real_line_base(base_line);
				var temp = real_line_current(current_line);
				var temp = real_line_base(base_line);

				var hf = ''

				hf += "<div><svg id='tip' width='180' height='160' style='background:white'><g transform=translate(0,10)><path d=" + real_line_base(base_line) + " stroke='red' stroke-opacity=0.7 stroke-width=2 fill='none'></path><path d=" + real_line_current(current_line) + " stroke='blue' stroke-opacity=0.7 stroke-width=2 fill='none'></path></g><g transform=translate(0,90)><path d=" + real_line_base(base_line) + " stroke='red' stroke-opacity=0.7 stroke-width=2 fill='none'></path><path d=" + real_line_invert(current_line) + " stroke='green' stroke-opacity=0.7 stroke-width=2 fill='none'></path></g></svg></div>"

				return hf;
			}
		})

		// current_rect.on('mouseenter',function(){
		// 	 $('.tipsy').remove();
		//           var dd = $(this);
		//           dd.tipsy('show');
		// })
		// var current_check=$('#check_'+_)
		// var flag=current_check.attr('disabled',false);
		// if(current_check.attr('checked')){
		// 	var current_brush = d3.select("#brush-"+sensors[_].name);
		// 	current_brush.select(".extent").attr("x")=pre_extent[sensors[_].name][0];
		// 	current_brush.select(".extent").attr("width")=pre_extent[sensors[_].name][1];
		// }else{
		// 	var current_brush = d3.select("#brush-"+sensors[_].name);
		// 	pre_extent[sensors[_].name]=;
		// }
	}

	function get_prev_sensor(sensor) {
		var index = sensor_location[sensor];
		for (var attr in sensor_location) {
			if (sensor_location[attr] == index - 1) {
				return attr;
			}
		}
	}

	function get_next_sensor(sensor){
    var index = sensor_location[sensor];
    for(var attr in sensor_location){
      if(sensor_location[attr] == index + 1){
        return attr;
      }
    }
  }

	function private_function2() {

	};

	function private_function3() {

	};

	return component;
};
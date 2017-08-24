/*
	A code template for a visualization compsvg
	Author : Nan Cao (nancao.org)
*/

vis.correlate = function() {

	var component = {},
		truth = null,
		truth_order = null,
		abnormal = null,
		container = null,
		data = null,
		sensor = null,
		time_interval = null,
		kind = 1,
		iter = 1,
		num_id = null;

	var results = {};
	var dispatch = d3.dispatch("select", "mouseover", "mouseout");

	component.container = function(_) {
		if (!arguments.length) return container;
		container = _;
		return component;
	};

	component.kind = function(_) {
		if (!arguments.length) return kind;
		kind = _;
		return component;
	}

	component.truth = function(_) {
		if (!arguments.length) return container;
		truth = _;
		return component;
	};

	component.truth_order = function(_) {
		if (!arguments.length) return container;
		truth_order = _;
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

	component.num_id = function(_) {
		if (!arguments.length) return num_id;
		num_id = _;
		return component;
	}

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
	correlations[0] = {};

	var time_scale = d3.time.scale();
	var width = 0,
		height = 0;
	var margin = {
		left: 50,
		right: 100,
		top: 40,
		bottom: 40
	};
	var single_line_chart_height = 60;
	var single_line_chart_paddind = 20;
	var tool_size = 20;
	var flag = 0;

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

	var sensors_path = {};

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

		if (kind == 1) {
			var kind_text = "Positive"
		} else if (kind == -1) {
			var kind_text = "Negative"
		}

		d3.select("#" + container)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", 70)
			.attr("class", "text")
			.append("text")
			.attr("transform", "translate(" + (width / 2) + ",60)")
			.attr("font-size", 18)
			.text("Task " + (num_id) + "/72 ");


		svg = d3.select("#" + container)
			.append("svg")
			.attr("transform", "translate(" + 0 + "," + 20 + ")")
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

		for (var i = 0; i < sensors.length; i++) {
			brush_appen[sensors[i].name] = d3.svg.brush()
				.x(time_scale)
				.on("brush", function(d) {
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
			.attr("id", function(d) {
				return "chart_" + d.name;
			})
			.attr("value", function(d) {
				return d.name;
			})
			.attr("transform", function(d) {
				return "translate(0," + ((single_line_chart_height + 2 * single_line_chart_paddind) * sensor_location[d.name] + single_line_chart_paddind) + ")";
			});

		chart_g.each(function(d) {
				var current_chart = d3.select(this);
				draw_single_chart(current_chart, d, data[d.name])
			})
			// svg.append("text")
			//                   .attr("class", "click")
			//                   .attr("transform", "translate(" + width / 2 + ", " +  80 + ")")
			//                   .attr("dy", "1em")
			//                   .text(kind_text)
			//                   .transition()
			//                   .duration(1500)
			//                   .style("opacity", 0)
			//                   .remove();

		return component.update();
	};

	component.update = function() {

		return component;
	};

	component.draw_correlation = function() {
		if (chosen_time_interval) {
			if (iter != 1) {
				var correlated_time_intervals = get_correlated_time_interval(sensor.name, sensor.c_sensors, chosen_time_interval);
			} else {
				var correlated_time_intervals = {}
				correlated_time_intervals[sensor.name] = chosen_time_interval;
				for (var i = 0; i < sensor.c_sensors.length; i++) {
					correlated_time_intervals[sensor.c_sensors[i].name] = [time_interval[0], time_interval[0]]
				}
			}


			correlations[0] = (correlated_time_intervals);

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

			for (var i = 1; i < sensors.length; i++) {

				// sensors_path[sensors[i].name] = correlated_time_intervals[sensors[i].name].path;
				var current_brush = brush_appen[sensors[i].name];
				current_brush.extent([correlated_time_intervals[sensors[i].name][0] * 1000, correlated_time_intervals[sensors[i].name][1] * 1000]);
				current_brush(d3.select("#brush-" + sensors[i].name).transition());
				//current_brush.event(d3.select("#brush-" + sensors[i].name).transition())
			}

			for(var p=1; p< sensors.length; p++){
				var current_chart = d3.select("#chart_" + sensors[p].name);
				var current_interval = correlations[0][sensors[p].name]
				var rect_x = time_scale(current_interval[0] * 1000)
				var rect_width = time_scale(current_interval[1] * 1000) - time_scale(current_interval[0] * 1000);
				current_chart.selectAll(".cover").remove();
				current_chart.append("rect")
						.attr("class", "cover")
						.attr("x", rect_x)
						.attr("y", 0)
						.attr("height", single_line_chart_height)
						.attr("width", rect_width)
						.style("fill", "white");
			}

			for (var p = 1; p < sensors.length; p++) {


				var pre_sensor = get_prev_sensor(sensors[p].name);
				//var base_time_interval=chosen_time_interval;
				var base_time_interval = correlations[0][pre_sensor];
				var main_values = data[pre_sensor].filter(function(ele) {
					return ele.t >= base_time_interval[0] && ele.t <= base_time_interval[1]
				});

				var current_chart = d3.select("#chart_" + sensors[p].name);
				current_chart.selectAll(".cu_co").remove();
				current_chart.selectAll(".ba_co").remove();
				current_chart.selectAll(".connect").remove();
				current_chart.selectAll(".base_data").remove();
				current_chart.selectAll(".current_data").remove();
				// current_chart.selectAll(".grid").remove();

				var current_interval = correlations[0][sensors[p].name]

				var interval_data = data[sensors[p].name].filter(function(ele) {
					return ele.t >= current_interval[0] && ele.t <= current_interval[1];
				});

				var rect_x = time_scale(current_interval[0] * 1000)
				var rect_width = time_scale(current_interval[1] * 1000) - time_scale(current_interval[0] * 1000);



				if (kind == 1) {
					var dtw = DynamicWarping(main_values.map(function(ele) {
						return y_scales[ele.name](ele.v);
					}), interval_data.map(function(ele) {
						return y_scales[ele.name](ele.v);
					}), function(a, b) {
						return Math.abs(a - b);
					});
				}
				// var test = y_scales[_.name].domain()[1] / 6;

				// if (sum / interval_data.length < (y_scales[_.name].domain()[1] - 25) / 6) {
				// 	Rect.style("stroke", "black")
				// 		.style("stroke-width", 2)
				// } else {
				// 	Rect.style("stroke", "black")
				// 		.style("stroke-width", 2)
				// }

				if (iter == 1) {
					// current_chart.selectAll(".score").remove();
					// current_chart.append("g")
					// 	.attr("class","score")
					// 	.attr("transform","translate("+(width/2-40)+","+(single_line_chart_height+50)+")")
					// 	.append("text")
					// 	.text((dtw.score/interval_data.length).toFixed(4));

				} else if (iter == 2) {
					// current_chart.selectAll(".score").remove();
					// current_chart.append("g")
					// 	.attr("class","score")
					// 	.attr("transform","translate("+(width/2-40)+","+(single_line_chart_height+50)+")")
					// 	.append("text")
					// 	.text((dtw.score/interval_data.length).toFixed(4));

					var redraw_pos = [];
					var redraw_neg = [];
					var sum = 0;
					// var real_line_diff = d3.svg.line()
					// 	.interpolate("linear")
					// 	.x(function(d) {
					// 		return time_scale(d.t * 1000);
					// 	})
					// 	.y(function(d) {
					// 		var temp = d.v + single_line_chart_height / 2;

					// 		console.log("yes")
					// 		console.log(temp)
					// 			// if (temp < 0) {
					// 			// 	temp = 0;
					// 			// } else if (temp > single_line_chart_height) {
					// 			// 	temp = single_line_chart_height;
					// 			// }
					// 		return temp;
					// 	});

					var chart = d3.horizon()
						.width(rect_width)
						.height(single_line_chart_height / 2 - 3)
						.bands(2)
						.mode("mirror")
						.interpolate("basis")
						.position("bottom");


					// for (var i = 0; i < interval_data.length; i++) {
					// 	var temp1 = {};
					// 	var temp2 = {};
					// 	if (dtw.diff[i] >= 0) {
					// 		temp1.t = interval_data[i].t;
					// 		temp1.v = dtw.diff[i];
					// 		temp1.name = interval_data[i].name;
					// 		temp2.t = interval_data[i].t;
					// 		temp2.v = 0;
					// 		temp2.name = interval_data[i].name;

					// 		sum = sum + temp1.v;
					// 	} else {
					// 		temp1.t = interval_data[i].t;
					// 		temp1.v = 0;
					// 		temp1.name = interval_data[i].name;
					// 		temp2.t = interval_data[i].t;
					// 		temp2.v = dtw.diff[i];
					// 		temp2.name = interval_data[i].name;

					// 		sum = sum - temp2.v;
					// 	}
					// 	redraw_pos.push(temp1);
					// 	redraw_neg.push(temp2);
					// }

					// if (interval_data.length >= 1) {
					// 	redraw_pos.push({
					// 		'name': interval_data[0].name,
					// 		't': interval_data[interval_data.length - 1].t,
					// 		'v': 0
					// 	})
					// 	redraw_pos.push({
					// 		'name': interval_data[0].name,
					// 		't': interval_data[0].t,
					// 		'v': 0
					// 	})
					// 	redraw_neg.push({
					// 		'name': interval_data[0].name,
					// 		't': interval_data[interval_data.length - 1].t,
					// 		'v': 0
					// 	})
					// 	redraw_neg.push({
					// 		'name': interval_data[0].name,
					// 		't': interval_data[0].t,
					// 		'v': 0
					// 	})
					// } else {}
					var pos = [];
					// var diff_max=0;
					for (var i = 0; i < interval_data.length; i++) {
						var temp = [time_scale(interval_data[i].t * 1000), dtw.diff[i]];
						// if(Math.abs(dtw.diff[i])>diff_max){
						// 	diff_max=Math.abs(dtw.diff[i])
						// }
						pos.push(temp);
					}
					if (interval_data.length > 0) {
						var test = 1;
					}



					current_chart.selectAll(".diff").remove();

					// current_chart.append("path")
					// 	.attr("clip-path", function(d) {
					// 		return "url(#inspection-clip-" + d.name + ")"
					// 	})
					// 	.attr("class", "diff")
					// 	.attr("d", real_line_diff(redraw_pos))
					// 	.style("stroke", "#e41a1c")
					// 	.style("fill", "#e41a1c");

					// current_chart.append("path")
					// 	.attr("clip-path", function(d) {
					// 		return "url(#inspection-clip-" + d.name + ")"
					// 	})
					// 	.attr("class", "diff")
					// 	.attr("d", real_line_diff(redraw_neg))
					// 	.style("stroke", "#377eb8")
					// 	.style("fill", "#377eb8");
					var horizon_canvas = current_chart.append("g")
						.attr("class", "diff")
						.attr("transform", "translate(" + rect_x + ",0)");

					if (pos.length > 0) {
						horizon_canvas.data([pos]).call(chart);
					}

					current_chart.selectAll(".limit").remove();

					current_chart.append("g")
						.attr("transform", "translate(" + rect_x + "," + (single_line_chart_height / 2 - 3) + ")")
						.attr("class", "limit")
						.append("rect")
						.attr("x", 0)
						.attr("y", 0)
						.attr("width", rect_width)
						.attr("height", 3 * 2);

					if (pre_sensor != 'main') {
						rect_width = time_scale(base_time_interval[1] * 1000) - time_scale(base_time_interval[0] * 1000);
						rect_x = time_scale(base_time_interval[0] * 1000)

						var chart = d3.horizon()
							.width(rect_width)
							.height(single_line_chart_height / 2 - 3)
							.bands(2)
							.mode("mirror")
							.interpolate("basis")
							.position("top");

						var pos = [];
						// var diff_max=0;
						for (var i = 0; i < main_values.length; i++) {
							var temp = [time_scale(main_values[i].t * 1000), dtw.diff_before[i]];
							// if(Math.abs(dtw.diff[i])>diff_max){
							// 	diff_max=Math.abs(dtw.diff[i])
							// }
							pos.push(temp);
						}

						var prev_chart = d3.select("#chart_" + pre_sensor);

						prev_chart.selectAll(".diff_before").remove();

						var horizon_canvas = prev_chart.append("g")
							.attr("class", "diff_before")
							.attr("transform", "translate(" + rect_x + "," + (single_line_chart_height / 2 + 3) + ")");

						if (pos.length > 0) {
							horizon_canvas.data([pos]).call(chart);
						}
					}


					/*----------------------------------------------------------------------------*/

					// for(var i=0;i<interval_data.length;i++){
					// 	current_chart.append("line")
					// 		.attr("class","cu_co")
					// 		.attr("x1",time_scale(interval_data[i].t*1000))
					// 		.attr("y1",single_line_chart_height/2+2)
					// 		.attr("x2",time_scale(interval_data[i].t*1000))
					// 		.attr("y2",single_line_chart_height/2-2)
					// 		.style("stroke","black")
					// }

					// for(var i=0;i<main_values.length;i++){
					// 	current_chart.append("line")
					// 		.attr("class","ba_co")
					// 		.attr("x1",base_start+time_scale(main_values[i].t*1000)-time_scale(main_values[0].t*1000))
					// 		.attr("y1",0)
					// 		.attr("x2",base_start+time_scale(main_values[i].t*1000)-time_scale(main_values[0].t*1000))
					// 		.attr("y2",4)
					// 		.style("stroke","black")
					// }



					for (var i = 0; i < dtw.path.length; i++) {
						current_chart.append("line")
							.attr("class", "connect")
							.attr("x1", time_scale(main_values[dtw.path[i].row].t * 1000))
							.attr("y1", -2 * single_line_chart_paddind)
							.attr("x2", time_scale(interval_data[dtw.path[i].col].t * 1000))
							.attr("y2", 0)
							.style("stroke", "black")
							.style("stroke-opacity", 1)
							.style("stroke-dasharray", "0.9")
					}
				} else if (iter == 3) {
					// current_chart.selectAll(".score").remove();
					// current_chart.append("g")
					// 	.attr("class","score")
					// 	.attr("transform","translate("+(width/2-40)+","+(single_line_chart_height+50)+")")
					// 	.append("text")
					// 	.text((dtw.score/interval_data.length).toFixed(4));

					current_chart.selectAll(".cover").remove();
					current_chart.append("rect")
						.attr("class", "cover")
						.attr("x", rect_x)
						.attr("y", 0)
						.attr("height", single_line_chart_height)
						.attr("width", rect_width)
						.style("fill", "white");
					var test1 = [];

					for (var k = 0; k < dtw.path.length; k++) {
						var temp = {};
						temp.name = interval_data[0].name;
						temp.t = interval_data[dtw.path[k].col].t;
						if (kind == 1) {
							temp.v = main_values[dtw.path[k].row].v
						} else {
							temp.v = 50 - main_values[dtw.path[k].row].v;
						}

						test1.push(temp)
					}

					for (var k = 0; k < dtw.path.length; k++) {
						var temp = {};
						temp.name = interval_data[0].name;
						temp.t = interval_data[dtw.path[k].col].t;
						if (kind == 1) {
							temp.v = main_values[dtw.path[k].row].v
						} else {
							temp.v = 50 - main_values[dtw.path[k].row].v;
						}

						test1.push(temp)
					}

					current_chart.append("path")
						.attr("class", "base_data")
						.attr("d", real_line_gen(test1))
						.style("stroke", "#ff7f00")
						.style("stroke-width", 1)
						.style("fill", "none");

					current_chart.append("path")
						.attr("class", "current_data")
						.attr("d", real_line_gen(interval_data))
						.style("stroke", "#1f78b4")
						.style("stroke-width", 1)
						.style("fill", "none");
				}
			}

			correlation_g.append("g")
				.selectAll("path")
				.data(sensors.filter(function(ele) {
					return ele.name != sensor.name;
				}))
				.enter()
				.append("path")
				.attr("stroke", "#99999C")
				.attr("stroke-width", 2)
				.attr("fill", "none")
				.attr("fill-opacity", 0.3)
				.attr("transform", function(d) {
					return "translate(0," + ((single_line_chart_height + 2 * single_line_chart_paddind) * (sensor_location[d.name] - 1) + single_line_chart_paddind + single_line_chart_height + ")");
				})
				.attr("d", function(d) {

					var prev_sensor = get_prev_sensor(d.name);
					var prev_interval = time_scale(correlated_time_intervals[prev_sensor][1] * 1000) - time_scale(correlated_time_intervals[prev_sensor][0] * 1000)
					var current_interval = time_scale(correlated_time_intervals[d.name][1] * 1000) - time_scale(correlated_time_intervals[d.name][0] * 1000);
					var p = "M";
					if (prev_interval != 0) {
						if (current_interval != 0) {
							p += (time_scale(correlated_time_intervals[prev_sensor][0] * 1000)) + ",0" +
								"L" + (time_scale(correlated_time_intervals[prev_sensor][0] * 1000) + prev_interval) + ",0" +
								"L" + (time_scale(correlated_time_intervals[d.name][0] * 1000) + current_interval) + "," + (2 * single_line_chart_paddind) +
								"L" + (time_scale(correlated_time_intervals[d.name][0] * 1000)) + "," + (2 * single_line_chart_paddind) + "Z";
						} else {
							p += (time_scale(correlated_time_intervals[prev_sensor][0] * 1000)) + ",0" +
								"L" + (time_scale(correlated_time_intervals[prev_sensor][0] * 1000) + prev_interval) + ",0Z"
						}
					} else {
						if (current_interval != 0) {
							p += (time_scale(correlated_time_intervals[d.name][0] * 1000) + current_interval) + "," + (2 * single_line_chart_paddind) +
								"L" + (time_scale(correlated_time_intervals[d.name][0] * 1000)) + "," + (2 * single_line_chart_paddind) + "Z";
						} else {
							p += (time_scale(correlated_time_intervals[prev_sensor][0] * 1000)) + ",0Z"
						}
					}
					return p;

				})

			// correlation_g.append("g")
			// 	.selectAll("path")



		} else {
			alert("please brush a time interval");
		}
	}

	component.pushResult = function() {

		// 	var results=[];
		if (sensor) {
			var accuracy = [];
			for (var i = 0; i < sensor.c_sensors.length; i++) {
				var current_brush = d3.select("#brush-" + sensor.c_sensors[i].name);
				var current_x = parseFloat(current_brush.select(".extent").attr("x"));
				var current_width = parseFloat(current_brush.select(".extent").attr("width"));

				var true_x = time_scale(truth[sensor.c_sensors[i].name][0] * 1000);
				var true_width = time_scale(truth[sensor.c_sensors[i].name][1] * 1000) - true_x;

				var intersection = four_min(current_width, true_width, true_x + true_width - current_x, current_x + current_width - true_x);
				var ratio = 0;
				if (intersection > 0) {
					var union = Math.max(true_x + true_width, current_x + current_width) - Math.min(true_x, current_x);
					var ratio = intersection / union;
				}
				accuracy.push(ratio);
			}
			var entropy = []
			for (var i = 0; i < sensor.c_sensors.length; i++) {
				entropy.push(i);
			}
			for (var i = 0; i < sensor.c_sensors.length; i++) {
				entropy[truth_order[sensor.c_sensors[i].name] - 1] = sensor_location[sensor.c_sensors[i].name] - 1;
			}
			var cnt = 0;
			for (var i = 0; i < entropy.length; i++) {
				for (var j = i + 1; j < entropy.length; j++) {
					if (entropy[i] > entropy[j]) {
						cnt = cnt + 1;
					}
				}
			}

			results.accu = accuracy;

			results.order = cnt;
		}
		// 	var url_result = "data/results?radio="+ results;

		// 	$.get(url_result, function(d){
		// 		return ;
		// 	});

	}

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
		for (var i = 0; i < sensors.length; i++) {
			brush_appen[sensors[i].name].clear();
		}

		d3.select("#" + container).selectAll("*").remove();
		correlations = [];
		correlations[0] = {};
		sensor_index = {};
		sensors = [];
		y_scales = {};
		results = {};
		return component;
	}

	///////////////////////////////////////////////////
	// Private Functions

	function update_correlation(duration, opacity) {
		svg.selectAll(".correlation-g").each(function(ele, index) {
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
				.attr("transform", function(d) {
					return "translate(0," + ((single_line_chart_height + 2 * single_line_chart_paddind) * (sensor_location[d.name] - 1) + single_line_chart_paddind + single_line_chart_height) + ")";
				})
				.attr("d", function(d) {
					var prev_sensor = get_prev_sensor(d.name);
					var prev_interval = time_scale(correlations[0][prev_sensor][1] * 1000) - time_scale(correlations[0][prev_sensor][0] * 1000);
					var current_interval = time_scale(correlations[0][d.name][1] * 1000) - time_scale(correlations[0][d.name][0] * 1000);
					var p = "M";
					if (prev_interval != 0) {
						if (current_interval != 0) {
							p += (time_scale(correlations[0][prev_sensor][0] * 1000)) + ",0" +
								"L" + (time_scale(correlations[0][prev_sensor][0] * 1000) + prev_interval) + ",0" +
								"L" + (time_scale(correlations[0][d.name][0] * 1000) + current_interval) + "," + (2 * single_line_chart_paddind) +
								"L" + (time_scale(correlations[0][d.name][0] * 1000)) + "," + (2 * single_line_chart_paddind) + "Z";
						} else {
							p += (time_scale(correlations[0][prev_sensor][0] * 1000)) + ",0" +
								"L" + (time_scale(correlations[0][prev_sensor][0] * 1000) + prev_interval) + ",0Z"
						}
					} else {
						if (current_interval != 0) {
							p += (time_scale(correlations[0][d.name][0] * 1000) + current_interval) + "," + (2 * single_line_chart_paddind) +
								"L" + (time_scale(correlations[0][d.name][0] * 1000)) + "," + (2 * single_line_chart_paddind) + "Z";
						} else {
							p += time_scale(correlations[0][prev_sensor][0] * 1000) + ",0Z"
						}
					}
					return p;
				})
				.style("stroke-opacity", opacity)
				.style("fill-opacity", opacity - 0.3)
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

		var checkbox = container.append("g")
			.attr("transform", "translate(" + (width + 40) + "," + (single_line_chart_height / 2 + 10) + ")");

		checkbox.append("text")
			.text(sen.name)
			.attr("font-size", 20);

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
				.attr("transform", "translate(0," + (single_line_chart_height / 2 - 9) + ")")
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
						brush_move(d);
						brush_move(sensors[sensor_index[prev_sensor]]);
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
				.attr("transform", "translate(0," + (single_line_chart_height / 2 + 9) + ")")
				.attr("font-family", "FontAwesome")
				.attr("font-size", tool_size)
				.text("\uf01a")
				.on("click", function(d) {
					if (sensor_location[d.name] == 0 || sensor_location[d.name] == (sensors.length - 1)) {
						alert("already bottom most")
					} else {
						var next_sensor = get_next_sensor(d.name);
						sensor_location[d.name] = sensor_location[d.name] + 1;
						sensor_location[next_sensor] = sensor_location[next_sensor] - 1;
						brush_move(d);
						brush_move(sensors[sensor_index[next_sensor]]);
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
			// if (iter == 1) {
			container.append("g")
				.attr("class", "x brush")
				.call(brush)
				.selectAll("rect")
				.attr("height", single_line_chart_height);
			//}
		} else {
			container.append("g")
				.datum(sen)
				.attr("class", "x brush")
				.attr("id", "brush-" + sen.name)
				.call(brush_appen[sen.name])
				.selectAll("rect")
				.attr("height", single_line_chart_height);

			// $("#brush-" + sen.name + " .extent").tipsy({
			// 	opacity: 1,
			// 	html: true,
			// 	title: function() {
			// 		var temp = this.x.baseVal.value;

			// 		var current_sensor = this.__data__

			// 		var tipsy_width = 160;


			// 		var base_line = baseline;
			// 		var base_interval = truth["main"];

			// 		var current_start = time_scale.invert(this.x.baseVal.value).getTime();
			// 		var current_end = time_scale.invert(this.x.baseVal.value + this.width.baseVal.value).getTime();

			// 		var current_interval = [current_start, current_end];
			// 		var current_line = data[current_sensor.name].filter(function(d) {
			// 			return d.t >= current_start / 1000 && d.t <= current_end / 1000;
			// 		});


			// 		var current_width = tipsy_width * (current_end - current_start) / (base_interval[1] * 1000 - base_interval[0] * 1000);

			// 		var time_scale_base = d3.time.scale().range([0, tipsy_width]).domain(base_interval.map(function(d) {
			// 			return d * 1000;
			// 		}));
			// 		var time_scale_current = d3.time.scale().range([0, current_width]).domain(current_interval);



			// 		real_line_base = d3.svg.line()
			// 			.interpolate("basis")
			// 			.x(function(d) {
			// 				return time_scale_base(d.t * 1000);
			// 			})
			// 			.y(function(d) {
			// 				return y_scales['main'](d.v);
			// 			});

			// 		real_line_current = d3.svg.line()
			// 			.interpolate("basis")
			// 			.x(function(d) {
			// 				var temp = time_scale_current(d.t * 1000)
			// 				return time_scale_current(d.t * 1000);
			// 			})
			// 			.y(function(d) {
			// 				return y_scales['main'](d.v);
			// 			});

			// 		real_line_invert = d3.svg.line()
			// 			.interpolate("basis")
			// 			.x(function(d) {
			// 				return time_scale_current(d.t * 1000);
			// 			})
			// 			.y(function(d) {
			// 				return y_scales['main'](50 - d.v);
			// 			});


			// 		var hf = ''

			// 		hf += "<div><svg id='tip' width="+Math.max(current_width,tipsy_width)+" height='90' style='background:white'><g transform=translate(0,20)><path d=" + real_line_base(base_line) + " stroke='#66c2a5' stroke-opacity=0.7 stroke-width=2 fill='none'></path>"
			// 		if(kind==1){
			// 			if(current_line.length>0){
			// 				hf += "<path d=" + real_line_current(current_line) + " stroke='#d95f02' stroke-opacity=0.7 stroke-width=2 fill='none'></path>"
			// 			}

			// 		}else if(kind==-1){
			// 			if(current_line.length>0){
			// 				hf += "<path d=" + real_line_invert(current_line) + " stroke='#d95f02' stroke-opacity=0.7 stroke-width=2 fill='none'></path>"
			// 			}
			// 		}				
			// 		hf += "</g></svg></div>";
			// 		return hf;
			// 	}
			// })
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

		if (sen.type == 'main') {
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

		var y_axis = d3.svg.axis().scale(y_scales[sen.name]).orient("left").ticks(5);



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

		var correlated_time_intervals = {},
			path = null;

		var start_time = time_interval[0] / 1000 > (chosen_time_interval[0] - time_span) ? (time_interval[0] / 1000) : (chosen_time_interval[0] - time_span);
		var end_time = time_interval[1] / 1000 < (chosen_time_interval[1] + time_span) ? (time_interval[1] / 1000) : (chosen_time_interval[1] + time_span);

		end_time = start_time + Math.floor((end_time - interval - start_time) / shift_param) * shift_param + interval;

		var main_values = data[sen].filter(function(ele) {
			return ele.t >= chosen_time_interval[0] && ele.t <= chosen_time_interval[1]
		}).map(function(ele) {
			return y_scales[ele.name](ele.v);
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
					return y_scales[ele.name](ele.v);
				});

				if (kind == 1) {
					var dtw = DynamicWarping(main_values, current_values, function(a, b) {
						return Math.abs(a - b);
					});
				} else if (kind == -1) {
					var dtw = DynamicWarping(main_values, current_values, function(a, b) {
						return Math.abs(50 - a - b);
					});
				} else {}


				if (dtw.cost < dist) {
					dist = dtw.cost;
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


		var dtwpath = [];
		for (var i = 0; i <= ser1.length; i++) {
			dtwpath[i] = [];
			for (var j = 0; j <= ser2.length; j++) {
				dtwpath[i][j] = Infinity;
			}
		}

		var i = ser1.length;
		var j = ser2.length;
		if (i > 0 && j > 0) {
			if (kind == 1) {
				dtwpath[i][j] = ser1[i - 1] - ser2[j - 1];
			} else if (kind == -1) {
				dtwpath[i][j] = 50 - ser1[i - 1] - ser2[j - 1];
			}


			while (j > 1 || i > 1) {
				if (i > 1 && j > 1) {
					var m = Math.min(Math.min(matrix[i - 1][j], matrix[i][j - 1]), matrix[i - 1][j - 1]);
					if (m == matrix[i - 1][j]) {
						if (kind == 1) {
							dtwpath[i - 1][j] = ser1[i - 2] - ser2[j - 1];
						} else if (kind == -1) {
							dtwpath[i - 1][j] = 50 - ser1[i - 2] - ser2[j - 1];
						}

						i = i - 1;
					} else if (m == matrix[i - 1][j - 1]) {
						if (kind == 1) {
							dtwpath[i - 1][j - 1] = ser1[i - 2] - ser2[j - 2];
						} else if (kind == -1) {
							dtwpath[i - 1][j - 1] = 50 - ser1[i - 2] - ser2[j - 2];
						}

						i = i - 1;
						j = j - 1;
					} else {
						if (kind == 1) {
							dtwpath[i][j - 1] = ser1[i - 1] - ser2[j - 2];
						} else if (kind == -1) {
							dtwpath[i][j - 1] = 50 - ser1[i - 1] - ser2[j - 2];
						}

						j = j - 1;
					}
				} else if (i == 1) {
					if (kind == 1) {
						dtwpath[1][j - 1] = ser1[i - 1] - ser2[j - 2];
					} else if (kind == -1) {
						dtwpath[1][j - 1] = 50 - ser1[i - 1] - ser2[j - 2];
					}

					j = j - 1;
				} else {
					if (kind == 1) {
						dtwpath[i - 1][1] = ser1[i - 2] - ser2[j - 1];
					} else if (kind == -1) {
						dtwpath[i - 1][1] = 50 - ser1[i - 2] - ser2[j - 1];
					}

					i = i - 1;
				}
			}
		}

		var path = [];
		var diff = [];
		var diff_before = [];
		// for (var j = 1; j <= ser2.length; j++) {

		// 	var min = 1000000;
		// 	var temp = null;
		// 	for (var i = 1; i <= ser1.length; i++) {
		// 		if (Math.abs(dtwpath[i][j]) < min) {
		// 			temp = dtwpath[i][j];
		// 		}
		// 	}
		// 	path.push(temp);
		// }
		for (var j = 1; j <= ser2.length; j++) {

			var min = 1000000;
			var max = 0;
			var temp = null;
			var count = 0;
			var temp_sum = 0;
			for (var i = 1; i <= ser1.length; i++) {
				if (Math.abs(dtwpath[i][j]) < 1000000) {
					path.push({
						'row': i - 1,
						'col': j - 1,
						'val': dtwpath[i][j]
					});
					// temp
					if (Math.abs(dtwpath[i][j]) >= max) {
						max = Math.abs(dtwpath[i][j])
						temp = dtwpath[i][j];
					}
				}


			}
			diff.push(temp);
		}

		for (var i = 1; i <= ser1.length; i++) {

			var min = 1000000;
			var max = 0;
			var temp = null;
			for (var j = 1; j <= ser2.length; j++) {
				if (Math.abs(dtwpath[i][j]) < 1000000) {
					// temp
					if (Math.abs(dtwpath[i][j]) >= max) {
						max = Math.abs(dtwpath[i][j])
						temp = dtwpath[i][j];
					}
				}


			}
			diff_before.push(temp);
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

		return {
			'cost': matrix[ser1.length][ser2.length],
			'path': path,
			'diff': diff,
			'diff_before': diff_before,
			'score': matrix[ser1.length][ser2.length]
		};
	}

	function brushed() {
		chosen_time_interval = brush.extent();

		chosen_time_interval = chosen_time_interval.map(function(ele) {
			return ele.getTime() / 1000;
		})

		component.draw_correlation();
		correlations[0]["main"] = chosen_time_interval;

	}

	function brush_move(_) {

		var Rect = d3.select("#brush-" + _.name + " .extent");

		var rect_x = parseFloat(Rect.attr("x"));
		var rect_width = parseFloat(Rect.attr("width"));
		var pre_sensor = get_prev_sensor(_.name);


		//var base_time_interval=chosen_time_interval;
		var base_time_interval = correlations[0][pre_sensor];


		var main_values = data[pre_sensor].filter(function(ele) {
			return ele.t >= base_time_interval[0] && ele.t <= base_time_interval[1]
		});
		var base_width = time_scale(base_time_interval[1] * 1000) - time_scale(base_time_interval[0] * 1000);
		// var next_width = time_scale(next_time_interval[1] * 1000) - time_scale(next_time_interval[0] * 1000);

		// var base_start = rect_x + rect_width / 2 - base_width / 2;



		var current_chart = d3.select("#chart_" + _.name);


		current_chart.selectAll(".cu_co").remove();
		current_chart.selectAll(".ba_co").remove();
		current_chart.selectAll(".connect").remove();
		current_chart.selectAll(".base_data").remove();
		current_chart.selectAll(".current_data").remove();
		// current_chart.selectAll(".grid").remove();


		var current_interval = [time_scale.invert(rect_x).getTime() / 1000, time_scale.invert(rect_x + rect_width).getTime() / 1000];

		var interval_data = data[_.name].filter(function(ele) {
			return ele.t >= current_interval[0] && ele.t <= current_interval[1];
		});



		if (kind == 1) {
			var dtw = DynamicWarping(main_values.map(function(ele) {
				return y_scales[ele.name](ele.v);
			}), interval_data.map(function(ele) {
				return y_scales[ele.name](ele.v);
			}), function(a, b) {
				return Math.abs(a - b);
			});
		} else if (kind == -1) {
			var dtw = DynamicWarping(main_values.map(function(ele) {
				return y_scales[ele.name](ele.v);
			}), interval_data.map(function(ele) {
				return y_scales[ele.name](ele.v);
			}), function(a, b) {
				return Math.abs(50 - a - b);
			});
		} else {}



		// var test = y_scales[_.name].domain()[1] / 6;

		// if (sum / interval_data.length < (y_scales[_.name].domain()[1] - 25) / 6) {
		// 	Rect.style("stroke", "black")
		// 		.style("stroke-width", 2)
		// } else {
		// 	Rect.style("stroke", "black")
		// 		.style("stroke-width", 2)
		// }

		if (iter == 1) {
			// current_chart.selectAll(".score").remove();
			// current_chart.append("g")
			// 	.attr("class","score")
			// 	.attr("transform","translate("+(width/2-40)+","+(single_line_chart_height+50)+")")
			// 	.append("text")
			// 	.text((dtw.score/interval_data.length).toFixed(4));

		} else if (iter == 2) {
			// current_chart.selectAll(".score").remove();
			// current_chart.append("g")
			// 	.attr("class","score")
			// 	.attr("transform","translate("+(width/2-40)+","+(single_line_chart_height+50)+")")
			// 	.append("text")
			// 	.text((dtw.score/interval_data.length).toFixed(4));

			current_chart.selectAll(".cover").remove();
			current_chart.append("rect")
				.attr("class", "cover")
				.attr("x", rect_x)
				.attr("y", 0)
				.attr("height", single_line_chart_height)
				.attr("width", rect_width)
				.style("fill", "white");

			var redraw_pos = [];
			var redraw_neg = [];
			var sum = 0;

			var chart = d3.horizon()
				.width(rect_width)
				.height(single_line_chart_height / 2 - 3)
				.bands(2)
				.mode("mirror")
				.interpolate("basis");


			// for (var i = 0; i < interval_data.length; i++) {
			// 	var temp1 = {};
			// 	var temp2 = {};
			// 	if (dtw.diff[i] >= 0) {
			// 		temp1.t = interval_data[i].t;
			// 		temp1.v = dtw.diff[i];
			// 		temp1.name = interval_data[i].name;
			// 		temp2.t = interval_data[i].t;
			// 		temp2.v = 0;
			// 		temp2.name = interval_data[i].name;

			// 		sum = sum + temp1.v;
			// 	} else {
			// 		temp1.t = interval_data[i].t;
			// 		temp1.v = 0;
			// 		temp1.name = interval_data[i].name;
			// 		temp2.t = interval_data[i].t;
			// 		temp2.v = dtw.diff[i];
			// 		temp2.name = interval_data[i].name;

			// 		sum = sum - temp2.v;
			// 	}
			// 	redraw_pos.push(temp1);
			// 	redraw_neg.push(temp2);
			// }

			// if (interval_data.length >= 1) {
			// 	redraw_pos.push({
			// 		'name': interval_data[0].name,
			// 		't': interval_data[interval_data.length - 1].t,
			// 		'v': 0
			// 	})
			// 	redraw_pos.push({
			// 		'name': interval_data[0].name,
			// 		't': interval_data[0].t,
			// 		'v': 0
			// 	})
			// 	redraw_neg.push({
			// 		'name': interval_data[0].name,
			// 		't': interval_data[interval_data.length - 1].t,
			// 		'v': 0
			// 	})
			// 	redraw_neg.push({
			// 		'name': interval_data[0].name,
			// 		't': interval_data[0].t,
			// 		'v': 0
			// 	})
			// } else {}
			var pos = [];
			for (var i = 0; i < interval_data.length; i++) {
				var temp = [time_scale(interval_data[i].t * 1000), dtw.diff[i]];
				pos.push(temp);
			}



			current_chart.selectAll(".diff").remove();


			// current_chart.append("path")
			// 	.attr("clip-path", function(d) {
			// 		return "url(#inspection-clip-" + d.name + ")"
			// 	})
			// 	.attr("class", "diff")
			// 	.attr("d", real_line_diff(redraw_pos))
			// 	.style("stroke", "#e41a1c")
			// 	.style("fill", "#e41a1c");

			// current_chart.append("path")
			// 	.attr("clip-path", function(d) {
			// 		return "url(#inspection-clip-" + d.name + ")"
			// 	})
			// 	.attr("class", "diff")
			// 	.attr("d", real_line_diff(redraw_neg))
			// 	.style("stroke", "#377eb8")
			// 	.style("fill", "#377eb8");
			var horizon_canvas = current_chart.append("g")
				.attr("class", "diff")
				.attr("transform", "translate(" + rect_x + ",0)");

			if (pos.length > 0) {
				horizon_canvas.data([pos]).call(chart);
			}

			current_chart.selectAll(".limit").remove();

			current_chart.append("g")
				.attr("transform", "translate(" + rect_x + "," + (single_line_chart_height / 2 - 3) + ")")
				.attr("class", "limit")
				.append("rect")
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", rect_width)
				.attr("height", 3 * 2);

			if (pre_sensor != 'main') {
				rect_width = time_scale(base_time_interval[1] * 1000) - time_scale(base_time_interval[0] * 1000);
				rect_x = time_scale(base_time_interval[0] * 1000)

				var chart = d3.horizon()
					.width(rect_width)
					.height(single_line_chart_height / 2 - 3)
					.bands(2)
					.mode("mirror")
					.interpolate("basis")
					.position("top");

				var pos = [];
				// var diff_max=0;
				for (var i = 0; i < main_values.length; i++) {
					var temp = [time_scale(main_values[i].t * 1000), dtw.diff_before[i]];
					// if(Math.abs(dtw.diff[i])>diff_max){
					// 	diff_max=Math.abs(dtw.diff[i])
					// }
					pos.push(temp);
				}

				var prev_chart = d3.select("#chart_" + pre_sensor);

				prev_chart.selectAll(".diff_before").remove();

				var horizon_canvas = prev_chart.append("g")
					.attr("class", "diff_before")
					.attr("transform", "translate(" + rect_x + "," + (single_line_chart_height / 2 + 3) + ")");

				if (pos.length > 0) {
					horizon_canvas.data([pos]).call(chart);
				}
			}

			// if(pre_sensor!='main'){
			// 	var prev_chart = d3.select("#chart_" + pre_sensor);
			// 	var chart = d3.horizon()
			// 	.width(rect_width)
			// 	.height(single_line_chart_height/2-5)
			// 	.bands(2)
			// 	.mode("mirror")
			// 	.interpolate("basis");

			// 	var pos = [];
			// 	for (var i = 0; i < main_values.length; i++) {
			// 		var temp = [time_scale(main_values[i].t * 1000), dtw.diff_before[i]];
			// 		pos.push(temp);
			// 	}
			// 	current_chart.selectAll(".diff").remove();
			// 	var horizon_canvas = current_chart.append("g")
			// 		.attr("class", "diff")
			// 		.attr("transform", "translate(" + rect_x + ",0)");

			// 	if (pos.length > 0) {
			// 		horizon_canvas.data([pos]).call(chart);
			// 	}
			// }



			/*----------------------------------------------------------------------------*/

			// for(var i=0;i<interval_data.length;i++){
			// 	current_chart.append("line")
			// 		.attr("class","cu_co")
			// 		.attr("x1",time_scale(interval_data[i].t*1000))
			// 		.attr("y1",single_line_chart_height/2+2)
			// 		.attr("x2",time_scale(interval_data[i].t*1000))
			// 		.attr("y2",single_line_chart_height/2-2)
			// 		.style("stroke","black")
			// }

			// for(var i=0;i<main_values.length;i++){
			// 	current_chart.append("line")
			// 		.attr("class","ba_co")
			// 		.attr("x1",base_start+time_scale(main_values[i].t*1000)-time_scale(main_values[0].t*1000))
			// 		.attr("y1",0)
			// 		.attr("x2",base_start+time_scale(main_values[i].t*1000)-time_scale(main_values[0].t*1000))
			// 		.attr("y2",4)
			// 		.style("stroke","black")
			// }



			for (var i = 0; i < dtw.path.length; i++) {
				current_chart.append("line")
					.attr("class", "connect")
					.attr("x1", time_scale(main_values[dtw.path[i].row].t * 1000))
					.attr("y1", -2 * single_line_chart_paddind)
					.attr("x2", time_scale(interval_data[dtw.path[i].col].t * 1000))
					.attr("y2", 0)
					.style("stroke", "black")
					.style("stroke-opacity", 1)
					.style("stroke-dasharray", "0.9")
			}
		} else if (iter == 3) {
			// current_chart.selectAll(".score").remove();
			// current_chart.append("g")
			// 	.attr("class","score")
			// 	.attr("transform","translate("+(width/2-40)+","+(single_line_chart_height+50)+")")
			// 	.append("text")
			// 	.text((dtw.score/interval_data.length).toFixed(4));

			current_chart.selectAll(".cover").remove();
			current_chart.append("rect")
				.attr("class", "cover")
				.attr("x", rect_x)
				.attr("y", 0)
				.attr("height", single_line_chart_height)
				.attr("width", rect_width)
				.style("fill", "white");
			var test1 = [];

			for (var k = 0; k < dtw.path.length; k++) {
				var temp = {};
				temp.name = interval_data[0].name;
				temp.t = interval_data[dtw.path[k].col].t;
				if (kind == 1) {
					temp.v = main_values[dtw.path[k].row].v
				} else {
					temp.v = 50 - main_values[dtw.path[k].row].v;
				}

				test1.push(temp)
			}

			current_chart.append("path")
				.attr("class", "base_data")
				.attr("d", real_line_gen(test1))
				.style("stroke", "#ff7f00")
				.style("stroke-width", 1)
				.style("fill", "none");

			current_chart.append("path")
				.attr("class", "current_data")
				.attr("d", real_line_gen(interval_data))
				.style("stroke", "#1f78b4")
				.style("stroke-width", 1)
				.style("fill", "none");
		}


		/*-----------------------------------------------------------------------------*/
		if (sensor_location[_.name] != sensors.length - 1) {
			var next_sensor = get_next_sensor(_.name);
			var next_time_interval = correlations[0][next_sensor];
			var next_values = data[next_sensor].filter(function(ele) {
				return ele.t >= next_time_interval[0] && ele.t <= next_time_interval[1]
			});


			if (kind == 1) {
				var dtw_next = DynamicWarping(interval_data.map(function(ele) {
					return y_scales[ele.name](ele.v);
				}), next_values.map(function(ele) {
					return y_scales[ele.name](ele.v);
				}), function(a, b) {
					return Math.abs(a - b);
				});
			} else if (kind == -1) {
				var dtw_next = DynamicWarping(interval_data.map(function(ele) {
					return y_scales[ele.name](ele.v);
				}), next_values.map(function(ele) {
					return y_scales[ele.name](ele.v);
				}), function(a, b) {
					return Math.abs(50 - a - b);
				});
			} else {}

			var next_chart = d3.select("#chart_" + next_sensor);

			next_chart.selectAll(".cu_co").remove();
			next_chart.selectAll(".ba_co").remove();
			next_chart.selectAll(".connect").remove();
			next_chart.selectAll(".base_data").remove();
			next_chart.selectAll(".current_data").remove();

			if (iter == 1) {
				// current_chart.selectAll(".score").remove();
				// current_chart.append("g")
				// 	.attr("class","score")
				// 	.attr("transform","translate("+(width/2-40)+","+(single_line_chart_height+50)+")")
				// 	.append("text")
				// 	.text((dtw.score/interval_data.length).toFixed(4));

			} else if (iter == 2) {

				// for (var i = 0; i < next_values.length; i++) {
				// 	var temp1 = {};
				// 	var temp2 = {};
				// 	if (dtw_next.diff[i] >= 0) {
				// 		temp1.t = next_values[i].t;
				// 		temp1.v = dtw_next.diff[i];
				// 		temp1.name = next_values[i].name;
				// 		temp2.t = next_values[i].t;
				// 		temp2.v = 0;
				// 		temp2.name = next_values[i].name;

				// 		//sum = sum + temp1.v;
				// 	} else {
				// 		temp1.t = next_values[i].t;
				// 		temp1.v = 0;
				// 		temp1.name = next_values[i].name;
				// 		temp2.t = next_values[i].t;
				// 		temp2.v = dtw_next.diff[i];
				// 		temp2.name = next_values[i].name;

				// 		//sum = sum - temp2.v;
				// 	}
				// 	redraw_pos.push(temp1);
				// 	redraw_neg.push(temp2);
				// }

				// if (next_values.length >= 1) {
				// 	redraw_pos.push({
				// 		'name': next_values[0].name,
				// 		't': next_values[next_values.length - 1].t,
				// 		'v': 0
				// 	})
				// 	redraw_pos.push({
				// 		'name': next_values[0].name,
				// 		't': next_values[0].t,
				// 		'v': 0
				// 	})
				// 	redraw_neg.push({
				// 		'name': next_values[0].name,
				// 		't': next_values[next_values.length - 1].t,
				// 		'v': 0
				// 	})
				// 	redraw_neg.push({
				// 		'name': next_values[0].name,
				// 		't': next_values[0].t,
				// 		'v': 0
				// 	})
				// } else {}

				rect_x = parseFloat(Rect.attr("x"));
				rect_width = parseFloat(Rect.attr("width"));

				var chart = d3.horizon()
					.width(rect_width)
					.height(single_line_chart_height / 2 - 3)
					.bands(2)
					.mode("mirror")
					.interpolate("basis")
					.position("top");

				var pos = [];
				// var diff_max=0;
				for (var i = 0; i < interval_data.length; i++) {
					var temp = [time_scale(interval_data[i].t * 1000), dtw_next.diff_before[i]];
					// if(Math.abs(dtw.diff[i])>diff_max){
					// 	diff_max=Math.abs(dtw.diff[i])
					// }
					pos.push(temp);
				}

				current_chart.selectAll(".diff_before").remove();

				var horizon_canvas = current_chart.append("g")
					.attr("class", "diff_before")
					.attr("transform", "translate(" + rect_x + "," + (single_line_chart_height / 2 + 3) + ")");

				if (pos.length > 0) {
					horizon_canvas.data([pos]).call(chart);
				}


				var chart = d3.horizon()
					.width(time_scale(correlations[0][next_sensor][1] * 1000) - time_scale(correlations[0][next_sensor][0] * 1000))
					.height(single_line_chart_height / 2-3)
					.bands(2)
					.mode("mirror")
					.interpolate("basis");

				var pos = [];
				for (var i = 0; i < next_values.length; i++) {
					var temp = [time_scale(next_values[i].t * 1000), dtw_next.diff[i]];
					pos.push(temp);
				}


				next_chart.selectAll(".diff").remove();

				var horizon_canvas = next_chart.append("g")
					.attr("class", "diff")
					.attr("transform", "translate(" + time_scale(correlations[0][next_sensor][0] * 1000) + ",0)");

				if (pos.length > 0) {
					horizon_canvas.data([pos]).call(chart);
				}


				// next_chart.append("path")
				// 	.attr("clip-path", function(d) {
				// 		return "url(#inspection-clip-" + d.name + ")"
				// 	})
				// 	.attr("class", "diff")
				// 	.attr("d", real_line_diff(redraw_pos))
				// 	.style("stroke", "#e41a1c")
				// 	.style("fill", "#e41a1c");

				// next_chart.append("path")
				// 	.attr("clip-path", function(d) {
				// 		return "url(#inspection-clip-" + d.name + ")"
				// 	})
				// 	.attr("class", "diff")
				// 	.attr("d", real_line_diff(redraw_neg))
				// 	.style("stroke", "#377eb8")
				// 	.style("fill", "#377eb8");

				// for(var i=0;i<next_values.length;i++){
				// 	next_chart.append("line")
				// 		.attr("class","cu_co")
				// 		.attr("x1",time_scale(next_values[i].t*1000))
				// 		.attr("y1",single_line_chart_height/2+2)
				// 		.attr("x2",time_scale(next_values[i].t*1000))
				// 		.attr("y2",single_line_chart_height/2-2)
				// 		.style("stroke","black")
				// }

				// for(var i=0;i<interval_data.length;i++){
				// 	next_chart.append("line")
				// 		.attr("class","ba_co")
				// 		.attr("x1",base_start+time_scale(interval_data[i].t*1000)-time_scale(main_values[0].t*1000))
				// 		.attr("y1",0)
				// 		.attr("x2",base_start+time_scale(main_values[i].t*1000)-time_scale(main_values[0].t*1000))
				// 		.attr("y2",4)
				// 		.style("stroke","black")
				// }



				for (var i = 0; i < dtw_next.path.length; i++) {
					next_chart.append("line")
						.attr("class", "connect")
						.attr("x1", time_scale(interval_data[dtw_next.path[i].row].t * 1000))
						.attr("y1", -2 * single_line_chart_paddind)
						.attr("x2", time_scale(next_values[dtw_next.path[i].col].t * 1000))
						.attr("y2", 0)
						.style("stroke", "black")
						.style("stroke-opacity", 1)
						.style("stroke-dasharray", "0.9")
				}
			} else if (iter == 3) {
				// current_chart.selectAll(".score").remove();
				// current_chart.append("g")
				// 	.attr("class","score")
				// 	.attr("transform","translate("+(width/2-40)+","+(single_line_chart_height+50)+")")
				// 	.append("text")
				// 	.text((dtw.score/interval_data.length).toFixed(4));

				var test1 = [];

				for (var k = 0; k < dtw_next.path.length; k++) {
					var temp = {};
					temp.name = next_values[0].name;
					temp.t = next_values[dtw_next.path[k].col].t;
					if (kind == 1) {
						temp.v = interval_data[dtw_next.path[k].row].v
					} else {
						temp.v = 50 - interval_data[dtw_next.path[k].row].v;
					}

					test1.push(temp)
				}

				next_chart.append("path")
					.attr("class", "base_data")
					.attr("d", real_line_gen(test1))
					.style("stroke", "#ff7f00")
					.style("stroke-width", 1)
					.style("fill", "none");

				next_chart.append("path")
					.attr("class", "current_data")
					.attr("d", real_line_gen(next_values))
					.style("stroke", "#1f78b4")
					.style("stroke-width", 1)
					.style("fill", "none");
			}
		}else{
			current_chart.selectAll(".diff_before").remove();
		}



		// if(interval_data.length>0){
		// 	var start=time_scale(interval_data[0].t*1000)
		// 	var side=3;
		// 	for(var i=0;i<main_values.length;i++){
		// 		for(var j=0;j<interval_data.length;j++){
		// 			current_chart.append("rect")
		// 				.attr("class","grid")
		// 				.attr("x",j*side+start)
		// 				.attr("y",i*side)
		// 				.attr("width",side)
		// 				.attr("height",side)
		// 				.style("fill","none")
		// 				.style("stroke","black")
		// 				.style("stroke-width",1);
		// 		}
		// 	}

		// 	for(var k=0;k<dtw.path.length;k++){
		// 		current_chart.append("rect")
		// 			.attr("class","grid")
		// 			.attr("x",dtw.path[k].col*side+start)
		// 			.attr("y",dtw.path[k].row*side)
		// 			.attr("width",side)
		// 			.attr("height",side)
		// 			.style("fill","red")
		// 			.style("stroke","black")
		// 			.style("stroke-width",1);
		// 	}


		// }

		rect_x = parseFloat(Rect.attr("x"));
		rect_width = parseFloat(Rect.attr("width"));

		correlations[0][_.name] = [time_scale.invert(rect_x).getTime() / 1000, time_scale.invert(rect_x + rect_width).getTime() / 1000];

		// if (iter == 1) {

		update_correlation(1, 0.4);
		// }

		// var current_rect = $("#brush-" + _.name + " .extent");


		// current_rect.tipsy("hide");
		//   	current_rect.tipsy("show");

	}

	function brushed_appen(_) {

		var base_time_interval = truth["main"];



		var Rect = d3.select("#brush-" + _.name + " .extent");

		var rect_x = parseFloat(Rect.attr("x"));
		var rect_width = parseFloat(Rect.attr("width"));
		var base_width = time_scale(base_time_interval[1] * 1000) - time_scale(base_time_interval[0] * 1000);

		correlations[0][_.name] = [time_scale.invert(rect_x).getTime() / 1000, time_scale.invert(rect_x + rect_width).getTime() / 1000];

		update_correlation(100, 1);

		$("#brush-" + _.name + " .extent").tipsy("hide")

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

	function get_next_sensor(sensor) {
		var index = sensor_location[sensor];
		for (var attr in sensor_location) {
			if (sensor_location[attr] == index + 1) {
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
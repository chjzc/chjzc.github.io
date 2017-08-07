taskrunner = function() {

	var taskrunner = {},
		tasks = null,
		vis = vis,
		dispatch = d3.dispatch("start", "stop", "next");
	console.log(d3.dispatch)
	var did = -1,
		vid = 0,
		start = -1,
		end = -1,
		report = [];

	taskrunner.tasks = function(_) {

		if (arguments.length == 0) {
			return tasks;
		}
		tasks = _;

		return taskrunner;
	};

	taskrunner.start = function() {
		console.log(tasks)
		dispatch.start(tasks[did], did);

		start = new Date().getTime();

		return taskrunner;
	};

	taskrunner.stop = function(_) {

		if (start == -1) {
			return;
		}

		end = new Date().getTime();

		// var items = tasks[did].data.items,
		// 	answers = 0,
		// 	correct = 0;
		// console.log(tasks[vid][did])
		// for(var i = 0; i < items.length; ++i) {
		// 	if(items[i].outlier) {
		// 		answers ++;
		// 		if(items[i].selected) {
		// 			correct ++;
		// 		}
		// 	}
		// }

		var result = _;

		// var task_num=tasks[did].sensors.length-1;

		// var res = '' + did + ',' + tasks[did].params[0] + ',' + tasks[did].params[1] + ',' + tasks[did].params[2] + ',' + (end - start) + ',' + result + '\n';
		// var res = (end - start) + '';
		var res = '' + did + ',' + (end - start) + ',' + result.toString() + '\n';

		console.log(res);

		report.push(res);

		start = -1;
		end = -1;

		//dispatch.stop(res);
		dispatch.stop();


		return taskrunner;
	};

	taskrunner.reset = function() {
		start = -1;
		end = -1;
		report = [];
		did = -1;
		vid = 0;
		return taskrunner;
	};

	taskrunner.next = function() {

		if (did + 1 < tasks.length) {
			did++;
		}else{
			console.log(report);
			console.log(report.length);

			var d = new Date();
			var n = d.getTime();
			var blob = new Blob(report, {
				type: "text/plain;charset=utf-8"
			});
			saveAs(blob, "results[" + n + "].csv");

			return;
		}

		dispatch.next(tasks[did], did);

		return taskrunner;
	};

	taskrunner.report = function() {
		return report;
	};

	taskrunner.dispatch = dispatch;
	console.log(dispatch)
	return taskrunner;
}
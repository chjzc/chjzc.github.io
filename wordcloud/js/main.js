require.config({
	baseUrl:"js/wordcloud",
    paths: {
    	jquery:'../jquery-1.11.1.min',
    	wCloud:"wordcloud"
    }
});

require(["jquery","wCloud"], function($,w) {
    var wcld = w;
	var a="wordcloud wordcloud";
	function processData(strings) { 
		if(!strings) return;
		
		// strip stringified objects and punctuations from the string
		strings = strings.toLowerCase().replace(/object Object/g, '').replace(/[\+\.,\/#!$%\^&\*{}=_`~]/g,'');
		
		// convert the str back in an array 
		strings = strings.split(" "); 

		// Count frequency of word occurance
		var wordCount = {};
		for(var i = 0; i < strings.length; i++) {
		    if(!wordCount[strings[i]])
		        wordCount[strings[i]] = 0;
			
		    wordCount[strings[i]]++; // {'hi': 12, 'foo': 2 ...}
		}
		var wordCountArr = [];
		for(var prop in wordCount) {
			wordCountArr.push({"text": prop, "size": wordCount[prop],"otherMsg":"tip Messege"});
		}
		
		return wordCountArr;
	}
	
function quickSort(arr) {
    var pivot = arr[0];
    var i;
    var leftArr= [],rightArr = [];
    if(arr.length == 0) {
        return [];
    }
    if(arr.length == 1) {
        return arr;
    }
    for(i=1; i < arr.length; i++) {
        if(arr[i].size > pivot.size) {
            leftArr.push(arr[i]);
        } else {
            rightArr.push(arr[i]);
        }
    }
    return quickSort(leftArr).concat(pivot, quickSort(rightArr));
}

function reprocess(arr)
{
	for(i=1; i < arr.length; i++)
	{
       arr[i].size=50*arr[i].size/arr[0].size;
    }
}

function finalprocess(strings)
{
	var arr1=processData(strings);
	var arr2=quickSort(arr);
	reprocess(arr2);
	return arr2;
}
    var option = {
    	data:[
			{"text":"word","size":80},
			{"text":"algorithm","size":80},
			{"text":"words","size":75},
			{"text":"sprite","size":75},
			{"text":"operation","size":70},
			{"text":"placed","size":70},
			{"text":"layout","size":10},
			{"text":"slow","size":10},
			{"text":"important","size":10},
			{"text":"text","size":10},
			{"text":"font","size":10},
			{"text":"fact","size":10},
			{"text":"blocks","size":10},
			{"text":"bounding","size":55},
			{"text":"visual","size":55},
			{"text":"version","size":53},
			{"text":"collision","size":14},
			{"text":"step","size":14},
			{"text":"without","size":14},
			{"text":"position","size":14},
			{"text":"memory","size":14},
			{"text":"except","size":14},
			{"text":"open","size":14},
			{"text":"advantage","size":14},
			{"text":"license","size":12},
			{"text":"checks","size":12},
			{"text":"requires","size":12},
			{"text":"now","size":12},
			{"text":"doesnt","size":12},
			{"text":"large","size":65},
			{"text":"comparing","size":65},
			{"text":"retreve","size":63},
			{"text":"pixels","size":60},
			{"text":"possible","size":60},
			{"text":"masks","size":50},
			{"text":"detection","size":50},
			{"text":"think","size":45},
			{"text":"many","size":10},
			{"text":"my","size":8},
			{"text":"sizes","size":6},
			{"text":"speeds","size":5},
			{"text":"simple","size":45},
			{"text":"move","size":40},
			{"text":"box","size":40},
			{"text":"even","size":38},
			{"text":"word cloud","size":35},
			{"text":"near","size":35},
			{"text":"using","size":30},
			{"text":"somewhere","size":30},
			{"text":"license","size":30},
			{"text":"math","size":30},
			{"text":"separately","size":30},
			{"text":"placing","size":30},
			{"text":"rather","size":30},
			{"text":"output","size":30},
			{"text":"copy","size":30},
			{"text":"usually","size":30},
			{"text":"tried","size":30},
			{"text":"glyph","size":30},
			{"text":"event","size":17},
			{"text":"part","size":16},
			{"text":"every","size":16},
			{"text":"block","size":16},
			{"text":"times","size":20},
			{"text":"one","size":16},
			{"text":"source","size":16},
			{"text":"code","size":15},
			{"text":"point","size":15},
			{"text":"data","size":15},
			{"text":"without","size":15},
			{"text":"elastic","size":15},
			{"text":"along","size":15},
			{"text":"tree","size":15},
			{"text":"recollision","size":15},
			{"text":"test","size":28},
			{"text":"word","size":27},
			{"text":"word","size":25},
			{"text":"final","size":23},
			{"text":"force","size":21},
			{"text":"cloud","size":20},
			{"text":"instead","size":20},
			{"text":"per","size":20},
			{"text":"word","size":19},
			{"text":"possible","size":19},
			{"text":"cloud","size":20},
			{"text":"middle","size":20},
			{"text":"isnt","size":20},
			{"text":"doesnt","size":20},
			{"text":"shapes","size":19},
			{"text":"word","size":18},
			{"text":"loop","size":18},
			{"text":"checks","size":19},
			{"text":"spiral","size":19},
			{"text":"masks","size":19},
			{"text":"way","size":19},
			{"text":"path","size":19},
			{"text":"javascript","size":19},
			{"text":"draw","size":18},
			{"text":"d3cloud","size":18},
			{"text":"achieve","size":18},
			{"text":"lowlevel","size":18},
			
			
			]
    }
    var wd = wcld.init($("#wordcloud")[0]);
    console.log(wd);
    wd = wd.setOption(option);

});

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
			{"text":"word cloud","size":40},
			{"text":"word","size":30},
			{"text":"cloud","size":14},
			{"text":"stack","size":43},
			{"text":"graph","size":60},
			{"text":"visual","size":60},
			{"text":"word","size":19},
			{"text":"cloud","size":20},
			{"text":"my","size":10},
			{"text":"force","size":20},
			{"text":"233333","size":30},
			{"text":"666","size":15},

			]
    }
    var wd = wcld.init($("#wordcloud")[0]);
    console.log(wd);
    wd = wd.setOption(option);

});

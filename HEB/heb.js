var beta = 0.8;
var tree = {};
var data=[];
var interval;
var number = 0;
var radius = 400;
var paths = [];
var Paths = [];

var mySvg = document.getElementById('mySvg');

function layout(){
	d3.json("http://127.0.0.1:8000/flaredata.json", function (json) {

        var group;

        data = json;
        tree = madetree(tree, 0);
        interval = 2 * Math.PI / 257;

        var treenodes = Getnodes();
        bound(tree,treenodes);
        SetID(tree);
        SetPosition(tree);
		Drawtext(tree);
        paths = GetPaths();
        Draw();
    });
}

function madetree(tree,n){
	var j=0;
	if(n==0){
		tree={name:"flare",position:{x:500,y:500}};
		n++;
	}
	tree.children=[];
	for(var i=0;i<data.length;i++){
		var array=data[i].name.split(".");
		if(j==0){
			if(tree.name==array[n-1]&&n<array.length){
				tree.children[j]={name:array[n],position:{x:500,y:500}};
				j++;
			}
		}else if(tree.name==array[n-1]&&tree.children[j-1].name!=array[n]&&n<array.length){
			tree.children[j]={name:array[n],position:{x:500,y:500}};
			j++;
		}
	}
	for (var i=0;i<j;i++) {
        tree.children[i] = madetree(tree.children[i], n+1);
    }
    return tree;
}

function Getnodes() {

    var i,
        j=0,
        n,
        currentparent,
        nodes = [];


    for (i = 0; i < data.length; i++) {
        var array = data[i].name.split(".");
        n = array.length - 1;
        if (i == 0) {
            currentparent = array[n - 1];
        }
        if (currentparent == array[n - 1]) {
            nodes[i] = { name: array[n], id: j, position: { x: 0, y: 0 } };
        } else {
            nodes[i] = { name: array[n], id: ++j, position: { x: 0, y: 0 } };
            currentparent = array[n - 1];
        }
        nodes[i].position.x = 500 + radius * Math.cos(j * interval);
        nodes[i].position.y = 500 + radius * Math.sin(j * interval);
        ++j;
    }
    return nodes;
}

function bound(tree,treenodes){
	if (tree.children.length == 0) {
        tree.position = treenodes[number].position;
        tree.id = treenodes[number].id;
		number++;
    } else {
        for (var i = 0; i < tree.children.length; i++) {
            bound(tree.children[i],treenodes);
        }
    }
}

function SetID(tree) {
    if (tree.children.length != 0) {
        var leftId,
            rightId;
        var n,
            a = tree,
            b = tree;
        while (a.children.length != 0) {
            a = a.children[0];
            if (a.children.length == 0) {
                leftId = a.id;
            }
        }
        while (b.children.length != 0) {
            n = b.children.length;
            b = b.children[n - 1];
            if (b.children.length == 0) {
                rightId = b.id;
            }
        }
        tree.id = (leftId + rightId) / 2;
        for (var i = 0; i < tree.children.length; i++) {
            SetID(tree.children[i]);
        }
    }
}

function SetPosition(tree) {
    if (tree.children.length != 0 && tree.name != "flare") {
		var cos;
		for (var i = 0; i < data.length; i++) {
			var arr = data[i].name.split(".");
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] == tree.name) {
					cos=j / arr.length + 0.1;
				}
			}
		}
        tree.position.x = 500 + cos * radius * Math.cos(tree.id * interval);
        tree.position.y = 500 + cos * radius * Math.sin(tree.id * interval);
    }
    for (var i = 0; i < tree.children.length; i++) {
        SetPosition(tree.children[i]);
    }
}

function Drawtext(tree){
        if (tree.name != "flare") {
            var angle = tree.id * interval * 180 / Math.PI;
        } else {
            var angle = 0;
        }
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.innerHTML = tree.name;
        text.setAttribute("font-size", 12);
        text.setAttribute("font-family", "Arial");
        text.setAttribute("x", tree.position.x);
        text.setAttribute("y", tree.position.y);
        text.setAttribute("transform", "rotate(" + angle + "," + tree.position.x + "," + tree.position.y + ")");
        mySvg.appendChild(text);
    for (var i=0;i<tree.children.length; i++) {
        Drawtext(tree.children[i]);
    }
}

function GetPaths(){
	var paths=[];
	for(var i=0;i<data.length;i++){
		for(var j=0;j<data[i].imports.length;j++){
			paths.push(LCA(tree,data[i].name,data[i].imports[j]));
		}
	}
	return paths;
}

function LCA(tree,s1,s2){
	var path=[],
		a1=[],
		a2=[];
	a1 = s1.split(".");
    a2 = s2.split(".");
	for(var i=0;i<Math.min(a1.length,a2.length);i++){
		if(a1[i]!=a2[i]){
			break;
		}
	}
	for(var j=a1.length-1;j>=(i-1);j--){
		path.push(FindNode(tree, a1[j]));
	}
	for(var j=i;j<a2.length;j++){
		path.push(FindNode(tree, a2[j]));
	}
	return path;
}

function FindNode(tree,s){
	if(tree.name==s){
		var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        //text.innerHTML = tree.name;
        //text.setAttribute("font-size", 12);
       // text.setAttribute("font-family", "Arial");
        //text.setAttribute("x", tree.position.x);
        //text.setAttribute("y", tree.position.y);
        //text.setAttribute("transform", "rotate(" + angle + "," + tree.position.x + "," + tree.position.y + ")");
        //mySvg.appendChild(text);
		return tree.position;
	}
	for(var i=0;i<tree.children.length;i++){
		if (FindNode(tree.children[i], s) != undefined) {
			return	FindNode(tree.children[i],s);
		}
	}
}

function GetT(n){
	var t = [];
    for (var i = 0; i <= n + 3; i++) {
        if (i < 3) {
            t.push(0);
        }
        else if (i >= 3 && i <= n) {
            t.push(i-2);
        }
        else {
            t.push(n-1);
        }
    }
    var len = n-3+2;
    if (len != 0) {
        for (var i = 0; i < t.length; i++) {
            t[i]/=len;
        }
    }
    return t;
}

function B(i,pow,x,t){
	if (pow == 1) {
        if (x <= t[i+1] && x >= t[i]) {
            return 1;
        } else {
            return 0;
        }
    }
	var a1 = x - t[i];
    var a2 = t[i + pow - 1] - t[i];
    var b1 = t[i + pow] - x;
    var b2 = t[i + pow] - t[i + 1];
    if (a2 == 0) {
        a2 = 1;
    }
    if (b2 == 0) {
        b2 = 1;
    }
    return a1 / a2 * B(i, pow - 1, x, t) + b1 / b2 * B(i + 1, pow - 1,x, t);
}

function B_Spline(p, u) {
    var a = { x: 0, y: 0 };
    var t = GetT(p.length - 1);
    for (var i = 0; i < p.length; i++) {
        a.x += p[i].x * B(i, 3, u, t);
        a.y += p[i].y * B(i, 3, u, t);
    }
    return a;
}

function Fix(arr) {
    var n = arr.length;
    var newarr = [];
    for (var i = 0; i < n; i++) {

        newarr.push({ x: 0, y: 0 });
        newarr[i].x = (beta * arr[i].x) + (1 - beta) * (arr[0].x + (i / (n - 1)) * (arr[n - 1].x - arr[0].x));
        newarr[i].y = (beta * arr[i].y) + (1 - beta) * (arr[0].y + (i / (n - 1)) * (arr[n - 1].y - arr[0].y));
    }
    return newarr;
}

function Draw() {
    var k = 0;
    for (var k = 0; k < paths.length; k++) {
			var arr=paths[k];
            var _path = [];
			var n=arr.length;
			for (var i = 0; i < n; i++) {
				_path.push({ x: 0, y: 0 });
				_path[i].x = (beta * arr[i].x) + (1 - beta) * (arr[0].x + (i / (n - 1)) * (arr[n - 1].x - arr[0].x));
				_path[i].y = (beta * arr[i].y) + (1 - beta) * (arr[0].y + (i / (n - 1)) * (arr[n - 1].y - arr[0].y));
				//_path[i].x = arr[i].x;
				//_path[i].y = arr[i].y;
			}
			
			
            var path = document.createElementNS("http://www.w3.org/2000/svg", "path");

            var str="M";
			
			var list = [];

			for (var t = 0.01; t <= 1; t += 0.01) {
				list.push(B_Spline(_path, t));
			}

			for (var i = 0 ; i < list.length; i++) {
				if (i == 0) {
					str += list[i].x + "," + list[i].y;
				}
				else {
					str += "L" + list[i].x + "," + list[i].y;
				}
			}

            path.setAttribute("d", str);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "#f08080");
            path.setAttribute("stroke-opacity", 0.3);
            mySvg.appendChild(path);
    }

}

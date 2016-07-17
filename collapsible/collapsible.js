var minheight=10000;
var maxheight=-1;

var Width=1000;
var Height=900;
var _name="";
var svg=document.getElementById("display");
svg.setAttribute("width",Width);
svg.setAttribute("height",Height);
var tree={};
var current=[];
var num = 0;
var id = 0;

function Layout(){
	d3.json("flare.json",function(json){
		tree=json;
		initree(tree,0);
		ininode(tree);
		position(tree);
		draw(tree);
	});
}

function initree(tree,l){
	if(l==0){
		tree.extended="yes";
	}else {
		tree.extended="no";
	}
	
	tree.x=100+l*200;
	tree.y=400;
	tree.paths=[];
	tree.level=l;
	tree.numson=0;
	tree.height=100;
	if(tree.children!=undefined){
		for(var i=0;i<tree.children.length;i++){
			var path=document.createElementNS("http://www.w3.org/2000/svg", "path");
			tree.paths.push(path);
			svg.appendChild(tree.paths[i]);
			tree.children[i].father=tree;
			tree.numson++;
		}
	}
	
	if(tree.children!=undefined){
		for(var i=0;i<tree.children.length;i++){
			initree(tree.children[i],l+1);
		}
	}
}

function getcurrent(tree){
	if(current[tree.level]==undefined){
		current[tree.level]=[];
	}
	current[tree.level].push(tree);
	if(tree.children!=undefined&&tree.extended=="yes"){
		for(var i=0;i<tree.children.length;i++){
			getcurrent(tree.children[i]);
		}
	}
}

function Move(tree, dist) {
    if (tree.extended == "yes" && tree.children != undefined) {
        for (var i = 0; i < tree.children.length; i++) {

            tree.children[i].height += dist;
            Move(tree.children[i], dist);
        }
    }
}

function HeightInit(tree){
	if(tree.children!=undefined&&tree.extended=="yes"){
		for(var i=0;i<tree.children.length;i++){
			tree.children[i].height=parseInt(tree.height-tree.numson/2)+i;
			HeightInit(tree.children[i]);
		}
	}
}

function Heightupdate(tree){
	if(tree.children!=undefined&&tree.extended=="yes"){
		tree.height=(tree.children[0].height+tree.children[tree.children.length-1].height)/2;
	}
}

function position(tree){
	HeightInit(tree);
	current=[];
	getcurrent(tree);
	
	for(var t=0;t<4;t++){
		for(var i=current.length-1;i>0;i--){
			for(var j=0;j<(current[i].length-1);j++){
				if(current[i][j].height+1>current[i][j+1].height){
					var dist=current[i][j].height-current[i][j+1].height+2;
					current[i][j+1].height +=dist;
					Move(current[i][j+1],dist);
				}
			}
			for(var j=0;j<current[i-1].length;j++){
				Heightupdate(current[i-1][j]);
			}
		}
	}
	for(var i=0;i<current.length;i++){
		for(var j=0;j<current[i].length;j++){
			if(current[i][j].height>maxheight) maxheight=current[i][j].height;
			if(current[i][j].height<minheight) minheight=current[i][j].height;
		}
	}
	
	var h=(Height-10)/(maxheight-minheight);
	for(var i=0;i<current.length;i++){
		for(j=0;j<current[i].length;j++){
			current[i][j].y=h*(current[i][j].height-minheight)+5;
		}
	}
	
	if(maxheight==minheight) current[0][0].y=Height/2;
}

function ininode(tree) {
    tree.circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    tree.circle.setAttribute("onmousedown","num = "+ id +"")
    tree.circle.setAttribute("onmouseup", "change()");
    tree.id = id++;
    svg.appendChild(tree.circle);


    if (tree.children != undefined) {
        for (var i = 0; i < tree.children.length; i++) {
            ininode(tree.children[i]);
        }
    }
}


function draw(tree){
	if(tree.name=="flare"||tree.father.extended=="yes"){
		tree.circle.setAttribute("r",4);
		tree.circle.setAttribute("cx",tree.x);
		tree.circle.setAttribute("cy",tree.y);
		if(tree.children!=undefined){
			if(tree.extended=="yes"){
				tree.circle.setAttribute("stroke"," #6495ed");
				tree.circle.setAttribute("fill","white");
				
				for (var i=0;i<tree.children.length;i++) {
					var p = [];
					p[0] = { x: tree.x, y: tree.y };
					p[1] = { x: (2*tree.x/3 + tree.children[i].x/3), y: tree.y};
					p[2] = { x: (tree.x/2 + tree.children[i].x/2), y: tree.children[i].y };
					p[3] = { x: tree.children[i].x, y: tree.children[i].y };
					var s = BezierCurve(p);
					tree.paths[i].setAttribute("d", s);
					tree.paths[i].setAttribute("fill", "none");
					tree.paths[i].setAttribute("stroke", "black");
					tree.paths[i].setAttribute("stroke-opacity",0.5);
				}
			} else{
				tree.circle.setAttribute("fill", "#6495ed");
				tree.circle.setAttribute("fill-opacity",0.5);
				tree.circle.setAttribute("stroke", "#6495ed");
				for (var i=0;i<tree.children.length;i++) {
					var s = "M" + tree.x + "," + tree.y + "L" + tree.x + "," + tree.y;
					tree.paths[i].setAttribute("d",s);
					tree.paths[i].setAttribute("stroke","white");
					tree.paths[i].setAttribute("fill","none");
				}
			}
		} else{
			tree.circle.setAttribute("stroke","#6495ed");
			tree.circle.setAttribute("fill","white");
		}
	}else{
		tree.extended="no";
		tree.circle.setAttribute("cx", 0);
        tree.circle.setAttribute("cy", 0);
		tree.circle.setAttribute("fill","white");
		tree.circle.setAttribute("stroke","white");
		if(tree.children!=undefined){
			for(var i=0;i<tree.children.length;i++){
				var s="M"+tree.x+","+tree.y+"L"+tree.x+","+tree.y;
				tree.paths[i].setAttribute("d", s);
                tree.paths[i].setAttribute("fill", "none");
                tree.paths[i].setAttribute("stroke", "white");
			}
		}
	}
	if(tree.children!=undefined){
		for(var i=0;i<tree.children.length;i++){
			draw(tree.children[i]);
		}
	}
}

function BezierCurve(p) {
    var str = "M" + p[0].x + "," + p[0].y;
    for (var t = 0.02; t <= 1; t += 0.02) {
        var x1 = (1 - t) * p[0].x + t * p[1].x;
        var y1 = (1 - t) * p[0].y + t * p[1].y;
        var x2 = (1 - t) * p[1].x + t * p[2].x;
        var y2 = (1 - t) * p[1].y + t * p[2].y;
		var x3 = (1 - t) * p[2].x + t * p[3].x;
        var y3 = (1 - t) * p[2].y + t * p[3].y;
		var X1= (1 - t) * x1 + t * x2;
		var Y1= (1 - t) * y1 + t * y2;
		var X2= (1 - t) * x2 + t * x3;
		var Y2= (1 - t) * y2 + t * y3;
        var x = (1 - t) * X1 + t * X2;
        var y = (1 - t) * Y1 + t * Y2;
		
        str += "L" + x + "," + y;
    }
    return str;
}

function changenode(tree){
	if(tree.id==num){
		tree.extended= (tree.extended=="yes" ? "no":"yes");
	}else{
		if(tree.children!=undefined){
			for(var i=0;i<tree.children.length;i++){
				changenode(tree.children[i]);
			}
		}
	}
}

function change() {
    minheight = 10000;
    maxheight = -1;
    tree.height = 100;
    changenode(tree);
    position(tree);
    draw(tree);
}
var svg=document.getElementById("display");
var rects=[];
var selected=-1;
var drag=new Array(150);
for(var i=0;i<drag.length;i++){
	drag[i]=1;
}
var start={},stop={};
start.x=0;
start.y=0;
stop.x=0;
stop.y=0;

var num=[];
var points=[];
var min=[4,2.0,1,0];
var max=[8,4.5,7,2.5];
var len=[4,2.5,6,2.5];
var re=document.createElementNS("http://www.w3.org/2000/svg","rect");
re.setAttribute("x",0);
re.setAttribute("y",0);
re.setAttribute("width",0);
re.setAttribute("height",0);
re.setAttribute("stroke-opacity", "0.5");
re.setAttribute("stroke", "rgb(144,144,144)");
re.setAttribute("fill-opacity", "0.1");
re.setAttribute("fill", "rgb(144,144,144)");

var Top=0;
var Bottom=0;
var Right=0;
var Left=0;


document.onmousedown=function (e) {
	start.x=e.pageX;
	start.y=e.pageY;
	if(start.x>=5&&start.x<=155&&start.y>=5&&start.y<=155) selected=0;
	if(start.x>=5&&start.x<=155&&start.y>=160&&start.y<=310) selected=1;
	if(start.x>=5&&start.x<=155&&start.y>=315&&start.y<=465) selected=2;
	if(start.x>=5&&start.x<=155&&start.y>=470&&start.y<=620) selected=3;
	if(start.x>=160&&start.x<=310&&start.y>=5&&start.y<=155) selected=4;
	if(start.x>=160&&start.x<=310&&start.y>=160&&start.y<=310) selected=5;
	if(start.x>=160&&start.x<=310&&start.y>=315&&start.y<=465) selected=6;
	if(start.x>=160&&start.x<=310&&start.y>=470&&start.y<=620) selected=7;
	if(start.x>=315&&start.x<=465&&start.y>=5&&start.y<=155) selected=8;
	if(start.x>=315&&start.x<=465&&start.y>=160&&start.y<=310) selected=9;
	if(start.x>=315&&start.x<=465&&start.y>=315&&start.y<=465) selected=10;
	if(start.x>=315&&start.x<=465&&start.y>=470&&start.y<=620) selected=11;
	if(start.x>=470&&start.x<=620&&start.y>=5&&start.y<=155) selected=12;
	if(start.x>=470&&start.x<=620&&start.y>=160&&start.y<=310) selected=13;
	if(start.x>=470&&start.x<=620&&start.y>=315&&start.y<=465) selected=14;
	if(start.x>=470&&start.x<=620&&start.y>=470&&start.y<=620) selected=15;

	
}
document.onmousemove=function(e){
	stop.x=e.pageX;
	stop.y=e.pageY;
	if(selected!=-1){
		Top=Math.min(start.y,stop.y);
		Bottom=Math.max(start.y,stop.y);
		Right=Math.max(start.x,stop.x);
		Left=Math.min(start.x,stop.x);
		re.setAttribute("x",Left);
		re.setAttribute("y",Top);
		re.setAttribute("width",Right-Left);
		re.setAttribute("height",Bottom-Top);
						
		dragdot(selected);
		layout2();
	}
}
document.onmouseup=function(e){
	for(var k=0;k<drag.length;k++){
		drag[k]=1;
	}
	selected=-1;
	Top=0;
	Bottom=0;
	Right=0;
	Left=0;
}						
			


function drawrect(){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var rect=document.createElementNS("http://www.w3.org/2000/svg","rect");
			rect.setAttribute("x",5+155*i);
			rect.setAttribute("y",5+155*j);
			rect.setAttribute("width",150);
			rect.setAttribute("height",150);
			rect.setAttribute("stroke","black");
			rect.setAttribute("stroke-width",2);
			rect.setAttribute("fill","rgb(255,255,255)");
			
			var ID=4*i+j;
			rect.id=ID;
			rect.data=[];
			svg.appendChild(rect);
			
			
			rects.push(rect);
			
		}
	}
	svg.appendChild(re);
}


function dragdot(num){
	for(var i=0;i<rects[num].data.length;i++){
		var x=rects[num].data[i].getAttribute("cx");
		var y=rects[num].data[i].getAttribute("cy");
		if(x<Left||x>Right||y>Bottom||y<Top){ drag[i]=0; }
		else{ drag[i]=1; }
	}
}

function layout(){
	d3.csv("iris.csv",function(data){  
	for(var i=0;i<data.length;i++){  
		num.push(data[i]);  
	} 
	for(var i=0;i<num.length;i++){
		var point=[0,0,0,0,0];
		point[0]=num[i].species;
		point[1]=parseFloat(num[i].sepallength);
		point[2]=parseFloat(num[i].sepalwidth);
		point[3]=parseFloat(num[i].petallength);
		point[4]=parseFloat(num[i].petalwidth);
		points.push(point);
	}
	for(var k=0;k<points.length;k++){
		var color;
		if(points[k][0]=="setosa") color="#fa8072";
		if(points[k][0]=="versicolor") color="#8fbc8f";
		if(points[k][0]=="virginica") color="#6495ed";
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(points[k][i+1]<min[i]) points[k][i]=min[i];
				if(points[k][i+1]>max[i]) points[k][i]=max[i];
				if(points[k][j+1]<min[j]) points[k][j]=min[j];
				if(points[k][j+1]>max[j]) points[k][j]=max[j];
				var dot=document.createElementNS("http://www.w3.org/2000/svg","circle");
				var x=5*(i+1)+150*i+150*(points[k][i+1]-min[i])/len[i];
				var y=5*(j+1)+150*(j+1)-150*(points[k][j+1]-min[j])/len[j];
				dot.setAttribute("cx",x);
				dot.setAttribute("cy",y);
				dot.setAttribute("r",3);
				dot.setAttribute("fill",color);
				dot.setAttribute("fill-opacity",0.5);
				rects[i*4+j].data.push(dot);
				svg.appendChild(dot);
			}
		}
	}
 });
}
function layout2(){
	for(var i=0;i<rects.length;i++){
		for(var j=0;j<rects[i].data.length;j++){
			if(drag[j]==1){
				rects[i].data[j].setAttribute("fill-opacity",0.5);
			}
			else{
				rects[i].data[j].setAttribute("fill-opacity",0);
			}
		}
	}
}

 
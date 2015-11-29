var svg=document.getElementById("display");
var text1=["3","68 sq in","1613 lbs","46 hp","8 sec","9 mpg","70"];
var text2=["9","456 sq in","5141 lbs","231 hp","26 sec","48 mpg","83"];
var text3=["cylinders","displaycement","weight","horsepower","acceleration","mileage","year"];
var Cyl=new Object();
Cyl.min=3;
Cyl.max=9;
Cyl.len=6;
var Dsp=new Object();
Dsp.min=68;
Dsp.max=456;
Dsp.len=456-68;
var Lbs=new Object();
Lbs.min=1613;
Lbs.max=5141;
Lbs.len=5141-1613;
var Hp=new Object();
Hp.min=46;
Hp.max=231;
Hp.len=231-46;
var Acc=new Object();
Acc.min=8;
Acc.max=26;
Acc.len=18
var Mpg=new Object();
Mpg.min=9;
Mpg.max=48;
Mpg.len=39
var Year=new Object();
Year.min=70;
Year.max=83;
Year.len=13;
var define=[Cyl,Dsp,Lbs,Hp,Acc,Mpg,Year];
var min=[3,68,1613,46,8,9,70];
var max=[9,456,5141,231,26,48,83];
var start=new Object();
start.x=0;
start.y=0;
stop=new Object();
stop.x=0;
stop.y=0;
var isstart=0;
var rects=[];
var paths=[];
var whichbar;
document.onmousedown = function(e){
	start.y=e.pageY;
	if(start.y<=515&&start.y>=495){
		start.y=500;
	}
	if(start.y<=50&&start.y>=35){
		start.y=50;
	}
	if(start.y<=500&&start.y>=50){
		start.x=e.pageX;
		isstart=1;
		whichbar=Math.floor((start.x)/150);
	}
}
document.onmouseup = function(e){
	isstart=0;
}
document.onmousemove = function(e){
	stop.x=e.pageX;
	stop.y=e.pageY;
	if(stop.y<50) stop.y=50;
	if(stop.y>500) stop.y=500;
	if(isstart==1){
		var index=whichbar;
		min[index]=Math.round(Math.min(define[index].len*(500-start.y)/450+define[index].min,define[index].len*(500-stop.y)/450+define[index].min));
		max[index]=Math.round(Math.max(define[index].len*(500-start.y)/450+define[index].min,define[index].len*(500-stop.y)/450+define[index].min));
		rects[index].setAttribute("y",500-450*(max[index]-define[index].min)/(define[index].len));
		rects[index].setAttribute("height",450*(max[index]-min[index])/(define[index].len));
		layout2();
	}
}
function drawcoordinate(){
	for(var i=0;i<7;i++){
		var line=document.createElementNS("http://www.w3.org/2000/svg","line");
		line.setAttribute("x1",75+i*150);
		line.setAttribute("y1",50);
		line.setAttribute("x2",75+i*150);
		line.setAttribute("y2",500);
		line.setAttribute("stroke","black");
		line.setAttribute("stroke-width",2);
		svg.appendChild(line);
		var Text1=document.createElementNS("http://www.w3.org/2000/svg","text");
		Text1.textContent=text1[i];
		Text1.setAttribute("x",70+i*150);
		Text1.setAttribute("y",515);
		svg.appendChild(Text1);
		var Text2=document.createElementNS("http://www.w3.org/2000/svg","text");
		Text2.textContent=text2[i];
		Text2.setAttribute("x",70+i*150);
		Text2.setAttribute("y",45);
		svg.appendChild(Text2);
		var Text3=document.createElementNS("http://www.w3.org/2000/svg","text");
		Text3.textContent=text3[i];
		Text3.setAttribute("x",70+i*150);
		Text3.setAttribute("y",25);
		svg.appendChild(Text3);
	}
}
function drawrect(){
	for(var i=0;i<7;i++){
		var rect=document.createElementNS("http://www.w3.org/2000/svg","rect");
		rect.setAttribute("x",71+i*150);
		rect.setAttribute("y",500-450*(max[i]-define[i].min)/(define[i].len));
		rect.setAttribute("width",8);
		rect.setAttribute("height",450*(max[i]-min[i])/(define[i].len));
		rect.setAttribute("fill","#778899");
		rect.setAttribute("fill-opacity",0.5);
		svg.appendChild(rect);
		rects.push(rect);
	}
}
function layout(){
	var n=cars.length;
	for(var i=0;i<n;i++){
		if(cars[i].cyl==undefined){
			cars[i].cyl=define[0].min;
		}
		if(cars[i].dsp==undefined){
			cars[i].dsp=define[1].min;
		}
		if(cars[i].lbs==undefined){
			cars[i].lbs=define[2].min;
		}
		if(cars[i].hp==undefined){
			cars[i].hp=define[3].min;
		}
		if(cars[i].acc==undefined){
			cars[i].acc=define[4].min;
		}
		if(cars[i].mpg==undefined){
			cars[i].mpg=define[5].min;
		}
		if(cars[i].year==undefined){
			cars[i].year=define[6].min;
		}
		if(cars[i].cyl>=min[0]&&cars[i].cyl<=max[0]&&cars[i].dsp>=min[1]&&cars[i].dsp<=max[1]&&cars[i].lbs>=min[2]&&cars[i].lbs<=max[2]&&cars[i].hp>=min[3]&&cars[i].hp<=max[3]&&cars[i].acc>=min[4]&&cars[i].acc<=max[4]&&cars[i].mpg>=min[5]&&cars[i].mpg<=max[5]&&cars[i].year>=min[6]&&cars[i].year<=max[6]){
			var path=document.createElementNS("http://www.w3.org/2000/svg","polyline");
			var str=75+" "+(500-450*(cars[i].cyl-define[0].min)/(define[0].len))+",";
			str += 225+" "+(500-450*(cars[i].dsp-define[1].min)/(define[1].len))+",";
			str += 375+" "+(500-450*(cars[i].lbs-define[2].min)/(define[2].len))+",";
			str += 525+" "+(500-450*(cars[i].hp-define[3].min)/(define[3].len))+",";
			str += 675+" "+(500-450*(cars[i].acc-define[4].min)/(define[4].len))+",";
			str += 825+" "+(500-450*(cars[i].mpg-define[5].min)/(define[5].len))+",";
			str += 975+" "+(500-450*(cars[i].year-define[6].min)/(define[6].len));
			path.setAttribute("points",str);
			path.setAttribute("fill","none");
			path.setAttribute("stroke","grey");
			path.setAttribute("stroke-opacity",0.2);
			path.setAttribute("stroke-width",1);
			svg.appendChild(path);
			paths.push(path);
		}
		else{
			var k=0;
			
		}
	}
}
function layout2(){
	var n=paths.length;
	for(var i=0;i<n;i++){
		if(cars[i].cyl>=min[0]&&cars[i].cyl<=max[0]&&cars[i].dsp>=min[1]&&cars[i].dsp<=max[1]&&cars[i].lbs>=min[2]&&cars[i].lbs<=max[2]&&cars[i].hp>=min[3]&&cars[i].hp<=max[3]&&cars[i].acc>=min[4]&&cars[i].acc<=max[4]&&cars[i].mpg>=min[5]&&cars[i].mpg<=max[5]&&cars[i].year>=min[6]&&cars[i].year<=max[6]){
			paths[i].setAttribute("stroke","blue");
			paths[i].setAttribute("stroke-opacity",1);
		}
		else{
			paths[i].setAttribute("stroke","grey");
			paths[i].setAttribute("stroke-opacity",0.2);
		}
	}
}
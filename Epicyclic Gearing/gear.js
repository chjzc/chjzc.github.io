
var svg=document.getElementById("display");
var width=svg.getAttribute("width");
var height=svg.getAttribute("height");
var Check=document.getElementsByName("radio");
var gears=[];
var centers=[];
var an=0;
var w=3;
var flag=2;
function gearmade(N,radius,position){
	var path=document.createElementNS("http://www.w3.org/2000/svg","path");
	var cen=document.createElementNS("http://www.w3.org/2000/svg","circle");
	var str = "M" + (position.x + radius) + "," + position.y;
	var each=2*Math.PI/N;
	var angle;
	var p=[];
	for(var i=0;i<N;i++){
		angle=each*i;
		for(var j=0;j<8;j++){
			p[j]={x:0,y:0};
		}
		p[0].x=position.x+radius*Math.cos(angle);
		p[0].y=position.y+radius*Math.sin(angle);
		p[1].x=position.x+radius/Math.cos(each/4)*Math.cos(angle+each/4);
		p[1].y=position.y+radius/Math.cos(each/4)*Math.sin(angle+each/4);
		p[2].x=p[1].x+radius*Math.tan(each/4)*Math.cos(angle+each/2);
		p[2].y=p[1].y+radius*Math.tan(each/4)*Math.sin(angle+each/2);
		p[3].x=p[2].x+radius*Math.tan(each/4)*Math.cos(angle+each/2+Math.PI/6);
		p[3].y=p[2].y+radius*Math.tan(each/4)*Math.sin(angle+each/2+Math.PI/6);
		p[4].x=p[3].x-radius*Math.tan(each/4)*Math.sin(angle+each/2);
		p[4].y=p[3].y+radius*Math.tan(each/4)*Math.cos(angle+each/2);
		p[5].x=p[4].x-radius*Math.tan(each/4)*Math.cos(angle+each/2-Math.PI/6);
		p[5].y=p[4].y-radius*Math.tan(each/4)*Math.sin(angle+each/2-Math.PI/6);
		p[6].x=p[5].x-radius*Math.tan(each/4)*Math.cos(angle+3*each/4);
		p[6].y=p[5].y-radius*Math.tan(each/4)*Math.sin(angle+3*each/4);
		p[7].x=position.x+radius*Math.cos(angle+each);
		p[7].y=position.y+radius*Math.sin(angle+each);
		for(var j=0;j<8;j++){
			str += "L" + p[j].x + "," + p[j].y;
		}
	}
	path.setAttribute("d",str);
	path.setAttribute("stroke","black");
	path.setAttribute("fill-opacity","1");
	path.setAttribute("fill","#40e0d0");
	cen.setAttribute("cx",position.x);
	cen.setAttribute("cy",position.y);
	cen.setAttribute("r","8");
	cen.setAttribute("stroke","black");
	cen.setAttribute("fill","white");
	svg.appendChild(path);
	svg.appendChild(cen);
	gears.push(path);
	centers.push(cen);
}

function regearmade(N,radius,position){
	var path=document.createElementNS("http://www.w3.org/2000/svg","path");
	var cen=document.createElementNS("http://www.w3.org/2000/svg","circle");
	var str = "M" + (position.x + radius) + "," + position.y;
	var each=2*Math.PI/N;
	var angle;
	var p=[];
	for(var i=0;i<N;i++){
		angle=each*i+each/4;
		for(var j=0;j<8;j++){
			p[j]={x:0,y:0};
		}
		p[0].x=position.x+radius*Math.cos(angle);
		p[0].y=position.y+radius*Math.sin(angle);
		p[1].x=position.x+radius/Math.cos(each/4)*Math.cos(angle+each/4);
		p[1].y=position.y+radius/Math.cos(each/4)*Math.sin(angle+each/4);
		p[2].x=p[1].x-radius*Math.tan(each/4)*Math.cos(angle+each/2);
		p[2].y=p[1].y-radius*Math.tan(each/4)*Math.sin(angle+each/2);
		p[3].x=p[2].x-radius*Math.tan(each/4)*Math.cos(angle+each/2-Math.PI/6);
		p[3].y=p[2].y-radius*Math.tan(each/4)*Math.sin(angle+each/2-Math.PI/6);
		p[4].x=p[3].x-radius*Math.tan(each/4)*Math.sin(angle+each/2);
		p[4].y=p[3].y+radius*Math.tan(each/4)*Math.cos(angle+each/2);	
		p[5].x=p[4].x+radius*Math.tan(each/4)*Math.cos(angle+each/2+Math.PI/6);
		p[5].y=p[4].y+radius*Math.tan(each/4)*Math.sin(angle+each/2+Math.PI/6);
		p[6].x=p[5].x+radius*Math.tan(each/4)*Math.cos(angle+3*each/4);
		p[6].y=p[5].y+radius*Math.tan(each/4)*Math.sin(angle+3*each/4);
		p[7].x=position.x+radius*Math.cos(angle+each);
		p[7].y=position.y+radius*Math.sin(angle+each);
		for(var j=0;j<8;j++){
			str += "L" + p[j].x + "," + p[j].y;
		}
	}
	path.setAttribute("d",str);
	path.setAttribute("stroke","black");
	path.setAttribute("fill-opacity","1");
	path.setAttribute("fill","white");
	cen.setAttribute("cx",position.x);
	cen.setAttribute("cy",position.y);
	cen.setAttribute("r","8");
	cen.setAttribute("stroke","black");
	cen.setAttribute("fill","white");
	svg.appendChild(path);
	svg.appendChild(cen);
	gears.push(path);
	centers.push(cen);
}

function Display(){
	var strange=1.866;
	var fence=document.createElementNS("http://www.w3.org/2000/svg","circle");
	fence.setAttribute("cx",width/2);
	fence.setAttribute("cy",height/2);
	fence.setAttribute("r","300");
	fence.setAttribute("fill-opacity","0.8");
	fence.setAttribute("fill","#40e0d0");
	fence.setAttribute("stroke","black");
	svg.appendChild(fence);
	var r2=50,r3=100,r4=100,r5=100,r1=250+14.777*2;
	var N2=10,N3=20,N4=20,N5=20,N1=53;
	var position2={x:width/2,y:height/2},position3={x:width/2,y:height/2-150-14.777},position4={x:width/2-Math.sqrt(3)*(150+14.777)/2,y:height/2+(150+14.777)/2},position5={x:width/2+Math.sqrt(3)*(150+14.777)/2,y:height/2+(150+14.777)/2},position1={x:width/2,y:height/2};
	regearmade(N1,r1,position1);
	gearmade(N2,r2,position2);
	gearmade(N3,r3,position3);
	gears[2].setAttribute("fill-opacity", "0.6");
	gearmade(N4,r4,position4);
	gears[3].setAttribute("fill-opacity", "0.6");
	gearmade(N5,r5,position5);
	gears[4].setAttribute("fill-opacity", "0.6");
	Rotate();
}

function Rotate(){
	for(var i=0;i<Check.length;i++){     
		if(Check.item(i).checked){ 
			if(flag!=Check.item(i).getAttribute("value")){
				an=0;
				flag=Check.item(i).getAttribute("value");  
			}
		}
	}
	if(flag==2){
		gears[1].setAttribute("transform","rotate("+ an +","+width/2+","+height/2+")");
		gears[2].setAttribute("transform","rotate("+ (-an/2) +","+width/2+","+(height/2-150-14.777)+")");
		centers[2].setAttribute("transform","rotate("+0+","+(width/2)+","+(height/2)+")");
		gears[3].setAttribute("transform","rotate("+ (-an/2) +","+(width/2-Math.sqrt(3)*(150+14.777)/2)+","+(height/2+(150+14.777)/2)+")");
		centers[3].setAttribute("transform","rotate("+0+","+(width/2)+","+(height/2)+")");
		gears[4].setAttribute("transform","rotate("+ (-an/2) +","+(width/2+Math.sqrt(3)*(150+14.777)/2)+","+(height/2+(150+14.777)/2)+")");
		centers[4].setAttribute("transform","rotate("+0+","+(width/2)+","+(height/2)+")");
		gears[0].setAttribute("transform","rotate("+ (-an/5.28) +","+width/2+","+height/2+")");
	}
	if(flag==3){
		gears[1].setAttribute("transform","rotate("+ 0 +","+width/2+","+height/2+")");
		gears[2].setAttribute("transform","rotate("+(-an)+","+(width/2)+","+(height/2)+")"+","+"rotate("+ (-an/2) +","+width/2+","+(height/2-150-14.777)+")");
		centers[2].setAttribute("transform","rotate("+(-an)+","+(width/2)+","+(height/2)+")");
		gears[3].setAttribute("transform","rotate("+(-an)+","+(width/2)+","+(height/2)+")"+","+"rotate("+ (-an/2) +","+(width/2-Math.sqrt(3)*(150+14.777)/2)+","+(height/2+(150+14.777)/2)+")");
		centers[3].setAttribute("transform","rotate("+(-an)+","+(width/2)+","+(height/2)+")");
		gears[4].setAttribute("transform","rotate("+(-an)+","+(width/2)+","+(height/2)+")"+","+"rotate("+ (-an/2) +","+(width/2+Math.sqrt(3)*(150+14.777)/2)+","+(height/2+(150+14.777)/2)+")");
		centers[4].setAttribute("transform","rotate("+(-an)+","+(width/2)+","+(height/2)+")");
		gears[0].setAttribute("transform","rotate("+ (-6.28*an/5.28) +","+width/2+","+height/2+")");
	}
	if(flag==1){
		gears[1].setAttribute("transform","rotate("+ 6.3*an +","+width/2+","+height/2+")");
		gears[2].setAttribute("transform","rotate("+(an)+","+(width/2)+","+(height/2)+")"+","+"rotate("+ (-2.647*an) +","+width/2+","+(height/2-150-14.777)+")");
		centers[2].setAttribute("transform","rotate("+(an)+","+(width/2)+","+(height/2)+")");
		gears[3].setAttribute("transform","rotate("+(an)+","+(width/2)+","+(height/2)+")"+","+"rotate("+ (-2.647*an) +","+(width/2-Math.sqrt(3)*(150+14.777)/2)+","+(height/2+(150+14.777)/2)+")");
		centers[3].setAttribute("transform","rotate("+(an)+","+(width/2)+","+(height/2)+")");
		gears[4].setAttribute("transform","rotate("+(an)+","+(width/2)+","+(height/2)+")"+","+"rotate("+ (-2.647*an) +","+(width/2+Math.sqrt(3)*(150+14.777)/2)+","+(height/2+(150+14.777)/2)+")");
		centers[4].setAttribute("transform","rotate("+(an)+","+(width/2)+","+(height/2)+")");
		gears[0].setAttribute("transform","rotate("+ 0 +","+width/2+","+height/2+")");
	}
	if(an>=360){
		an=0;
	}
	an +=w;
	setTimeout("Rotate()",100);
	
}
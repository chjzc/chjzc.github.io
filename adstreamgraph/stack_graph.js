var stackGraph = function(){};
stackGraph.prototype = {
	Y:[],
	yList:[],
	Svg:Object(),
	Data:[],
	getPath: function(data)
	{
		var name="M"+"0"+",500 L"+data[0].x.toString() + "," + Math.ceil(data[0].y).toString() + " "+ "C" + (data[0].x+20).toString() + "," + Math.ceil(data[0].y).toString() + " " + (data[1].x-20).toString() + "," + Math.ceil(data[1].y).toString() + " " + data[1].x.toString() + "," + Math.ceil(data[1].y).toString() + " ";
        for(var i=1;i<n-1;i++){
            name +="L"+data[i].x.toString() + "," + Math.ceil(data[i].y).toString() + " "+ "C" + (data[i].x+20).toString() + "," + Math.ceil(data[i].y).toString() + " " + (data[i+1].x-20).toString() + "," + Math.ceil(data[i+1].y).toString() + " " + data[i+1].x.toString() + "," + Math.ceil(data[i+1].y).toString() + " ";
        }
		name+="L"+data[n-1].x.toString()+",500";
		return name;
	},
	makeStackGraph: function(svg,input)
	{
		svg.data = new Array();
        var data=input.data;
        var dg=input.g;
		var g0=[];
		var len = data.length;
		var DATA = new Array(len);
		for(var i=0;i<len;i++)
		{
			DATA[i]=new Array(data[0].length);
			for(var j=0;j<data[0].resource.length;j++)
			{
				DATA[i][j]={x:0,y:0}
			}
		}
        g0[0]={x:50,y:600};
		for(var i=0;i<dg.length;i++)
		{
			g0[i+1] = {x:0,y:0};
			var sum=0;
			g0[i+1].x=data[0].x;
			g0[i+1].y=g0[i]-dg[i];
		}
		for(var i=0;i<data,length;i++)
		{
			for(var j=0;j<data[0].length;j++)
			{
				if(i==0)
				{
					DATA[i][j].y = g0[j].y-data[i].y;
					DATA[i][j].x = data[i].x;
				}
				else
				{
					DATA[i][j].y = DATA[i-1][j].y-data[i].y;
					DATA[i][j].x = data[i].x;
				}
			}
		}
		for (var i=DATA.length-1;i>=0;i--){
			if (i % 2 == 0)  this.build(svg,"#556",DATA[i],i+1);
			else this.build(svg,"#aad",DATA[i],i+1);
		}
		this.build(svg,"white",g0,0);
	},
	
	build:function(svg,color,data,index)
	{
        var n = data.length;
        var d=this.getPath(data,"500");
        shape = document.getElementById("path" + (index).toString());
        if (!shape) shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
        shape.setAttributeNS(null, "d", d);
        shape.setAttributeNS(null,"id","path" + (index).toString());
        shape.setAttributeNS(null, "fill", color);
        shape.setAttributeNS(null, "stroke", "white");
        shape.setAttributeNS(null, "stroke-width", 0.2);
        if (color != "white") shape.setAttributeNS(null,"fill-opacity",0.8);
        else shape.setAttributeNS(null,"fill-opacity",1);
        svg.appendChild(shape);
	},
	Translate: function()
	{
		var data = this['Data'];
		var svg = this['Svg'];
		if (data == null) throw "translate error!";
		var len = data.length;
		var DATA = new Array(len);
		for(var i=0;i<len;i++)
		{
			DATA[i]=new Array(data[0].length);
			for(var j=0;j<data[0].resource.length;j++)
			{
				DATA[i][j]={x:0,y:0}
			}
		}
		var g0 = [];
		for(var i=0;i<data[0].resource.length;i++)
		{
			g0[i] = {x:0,y:0};
			var sum=0;
			for(var j=0;j<data.length;j++)
			{
				sum += data[j].resource[i].y
			}
			g0[i].x=data[0].resource[i].x;
			g0[i].y=sum/2.0+200;
		}
		for(var i=data.length-1,k=0;i>=0;i--,k++)
		{
			for(var j=0;j<data[0].resource.length;j++)
			{
				if(i==data.length-1)
				{
					DATA[k][j].y = g0[j].y-data[i].resource[j].y;
					DATA[k][j].x = data[i].resource[j].x;
				}
				else
				{
					DATA[k][j].y = DATA[k-1][j].y-data[i].resource[j].y;
					DATA[k][j].x = data[i].resource[j].x;
				}
			}
		}
		
		var path = svg.getElementsByTagName("path");
		for (var i=0;i<path.length;i++)
		{
			var animate = path[i].firstChild;
			if (animate != null) 
			{
				var newPath = animate.getAttribute("to");
				path[i].setAttributeNS(null,"d",newPath);
				path[i].removeChild(animate);
			}
			var d;
			if (i!=path.length-1) d = this.getPath(DATA[path.length-2-i]);
			else d = this.getPath(g0);
			animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
			animate.id = "animate";
			animate.setAttributeNS(null,"attributeName","d");
			animate.setAttributeNS(null,"to",d);
			animate.setAttributeNS(null,"begin","indefinite");
			animate.setAttributeNS(null,"dur","0.5s");
			animate.setAttributeNS(null,"fill","freeze");
			animate.setAttributeNS(null,"repeatCount","1");
			path[i].appendChild(animate);
			animate.beginElement();
		}
		var debug = 0;
		debug++;
	}
}


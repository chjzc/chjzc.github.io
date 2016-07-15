var stackGraph = function(){};
stackGraph.prototype = {
	Y:[],
	yList:[],
	Svg:Object(),
	Data:[],
	getPath: function(data)
	{
		/*var x = [];
		var y = [];
		var n = data.length;
	
		for (var i=0;i<n;i++){
			x[i] = data[i].x;
			y[i] = Y[i];
			Y[i] = Y[i] + data[i].y;
		}
		var h = [];
		var u = [];
		var lam = [];
		for (var i=0;i<n-1;i++){
			h[i] = x[i+1] - x[i];
		}
		u[0] = 0;
		lam[0] = 1;
		for (var i=1;i<n-1;i++){
			u[i] = h[i-1] / (h[i] + h[i-1]);
			lam[i] = h[i] / (h[i] + h[i-1]);
		}
		var a = [];
		var b = []
		var c = [];
		var m = [];
		for (var i=0;i<n;i++){
			m[i] = [];
		}
		for (var i=0;i<n;i++){
			for (var j=0;j<n;j++){
				m[i][j] = 0;
			}
			if (i==0)
			{
				m[i][0] = 2;
				m[i][1] = 1;
				
				b[0] = 2;
				c[0] = 1;
			}
			else if (i==(n-1))
			{
				m[i][n-2] = 1;
				m[i][n-1] = 2;
					
				a[n-1] = 1;
				b[n-1] = 2;
			}
			else
			{
				m[i][i-1] = lam[i];
				m[i][i] = 2;
				m[i][i+1] = u[i];
				
				a[i] = lam[i];
				b[i] = 2;
				c[i] = u[i];
			}
		}
		var g = [];
		g[0] = 3 * (y[1] - y[0]) / h[0];
		g[n-1] = 3 * (y[n-1] - y[n-2])/ h[n-2];
		for (var i=1;i<n-1;i++){
			g[i] = 3 * ((lam[i] * (y[i] - y[i-1])/h[i-1]) + u[i] * (y[i+1] - y[i])/h[i]);
		}	
		var p = [];
		var q = [];
		p[0] = b[0];
		for (var i=0;i<n-1;i++)
		{
			q[i] = c[i]/p[i];
		}
		for (var i=1;i<n;i++)
		{
			p[i] = b[i] - a[i] * q[i-1];
		}
		var su = [];
		var sq = [];
		var sx = [];
		su[0] = c[0]/b[0];
		sq[0] = g[0]/b[0];
		for (var i = 1; i < n - 1; i++){
			su[i] = c[i]/(b[i] - su[i-1]*a[i]);
		}
    
		for (var i = 1; i < n; i++){
			sq[i] = (g[i] - sq[i-1]*a[i])/(b[i] - su[i-1]*a[i]);
		}

		sx[n-1] = sq[n-1];
		for (var i = n - 2; i >= 0; i--){
			sx[i] = sq[i] - su[i]*sx[i+1];
		}
		var ph = h;
		var px = x;
		var psx = sx;
		var py = y;
		function func(k,vX,ph,px,psx,py)
		{
			var p1 = (ph[k] + 2.0 * (vX - px[k])) * ((vX - px[k+1]) * (vX - px[k+1])) * py[k] / (ph[k] *ph[k] * ph[k]);
			var p2 = (ph[k] - 2.0 * (vX - px[k+1])) * Math.pow((vX - px[k]), 2.0) * py[k+1] / Math.pow(ph[k], 3.0);
			var p3 =  (vX - px[k]) * Math.pow((vX - px[k+1]), 2.0) * psx[k] / Math.pow(ph[k], 2.0);
			var p4 =  (vX - px[k+1]) * Math.pow((vX - px[k]), 2.0) * psx[k+1] / Math.pow(ph[k], 2.0);
			return p1 + p2 + p3 + p4;
		}
		var name = "M" + x[0].toString() + "," + lowLimit + " ";
		yList = [];
		for (var i=0;i<n;i++)
		{
			if (i==0)
			{
				tmp = "L";
				tmp = tmp + x[i].toString() + "," + Math.ceil(y[i]).toString() + " ";
				name = name.concat(tmp);
			//alert(name);
			}
			else 
			{
				var delta = 0.1;
				for (var pointX = x[i-1];Math.abs(pointX - x[i]) > 0.00001;pointX +=delta)
				{
					var pointY = func(i-1,pointX,ph,px,psx,py);
					var tmp = Math.floor(pointX * 10);
					if (yList[tmp.toString()]) pointY = Math.min(pointY,yList[tmp.toString()]);
					yList[tmp.toString()] = pointY;
					//pointY = Math.max(pointY,yList[pointX]);
					//yList[pointX];
					tmp = "L";
					tmp = tmp + pointX.toString() + "," + Math.ceil(pointY).toString() + " ";
					name = name + tmp;
				//	alert(name);
				}
			}
		}
		name+="L" + x[n-1].toString() + "," + lowLimit;
		return name;*/
		var name="M"+"0"+",500 L"+data[0].x.toString() + "," + Math.ceil(data[0].y).toString() + " "+ "C" + (data[0].x+20).toString() + "," + Math.ceil(data[0].y).toString() + " " + (data[1].x-20).toString() + "," + Math.ceil(data[1].y).toString() + " " + data[1].x.toString() + "," + Math.ceil(data[1].y).toString() + " ";
        for(var i=1;i<n-1;i++){
            name +="L"+data[i].x.toString() + "," + Math.ceil(data[i].y).toString() + " "+ "C" + (data[i].x+20).toString() + "," + Math.ceil(data[i].y).toString() + " " + (data[i+1].x-20).toString() + "," + Math.ceil(data[i+1].y).toString() + " " + data[i+1].x.toString() + "," + Math.ceil(data[i+1].y).toString() + " ";
        }
		name+="L"+data[n-1].x.toString()+",500";
		return name;
	},
	/*makeStackGraph: function(svg,data)
	{
		svg.data = new Array();
		var g0 = [];
		for (var i=0;i<data[0].length;i++)
		{
			g0[i] = {x:0,y:0};
			var tmp = 0;
			for (var j=0;j<data.length;j++)
				tmp += data[j][i].y;
			tmp = tmp / data.length;
			g0[i].x = data[0][i].x;
			g0[i].y = (0-tmp) / 2;
		}
		var len = data[0].length;
		Y = new Array(len);
		height = svg.getAttribute("height") - 100;
		for (var i=0;i<len;i++) Y[i] = height-g0[i].y;
		for (var i=0;i<data.length;i++) 
			for (var j=0;j<data[i].length;j++) Y[j]-=data[i][j].y;
		for (var i=0;i<data.length;i++){
			if (i % 2 == 0)  this.makeShape(svg,"#556",data[i],i+1);
			else this.makeShape(svg,"#aad",data[i],i+1);
		}
		this.makeShape(svg,"white",g0,0);
	},
	
	makeShape:function(svg,color,data,index)
	{
		var d = this.getPath(data,"500");c
		var shape = document.getElementById("path" + index.toString());
		if (!shape) shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
		shape.setAttributeNS(null, "d", d);
		shape.setAttributeNS(null,"id","path" + index.toString());
		shape.setAttributeNS(null, "fill", color);
		shape.setAttributeNS(null, "stroke", "white");
		shape.setAttributeNS(null, "stroke-width", 0.2);
		if (color != "white") shape.setAttributeNS(null,"fill-opacity",0.8);
		else shape.setAttributeNS(null,"fill-opacity",1);
		svg.appendChild(shape);
	},*/
	makeStackGraph: function(svg,data)
	{
		svg.data = new Array();
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
		/*for (var i=0;i<data[0].length;i++)
		{
			g0[i] = {x:0,y:0};
			var tmp = 0;
			for (var j=0;j<data.length;j++)
				tmp += data[j][i].y;
			tmp = tmp / data.length;
			g0[i].x = data[0][i].x;
			g0[i].y = (0-tmp) / 2;
		}
		var len = data[0].length;
		Y = new Array(len);
		height = svg.getAttribute("height") - 100;
		for (var i=0;i<len;i++) Y[i] = height-g0[i].y;
		for (var i=0;i<data.length;i++) 
			for (var j=0;j<data[i].length;j++) Y[j]-=data[i][j].y;*/
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


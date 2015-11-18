var stackGraph = function(){};
stackGraph.prototype = {
	Y:[],
	yList:[],
	Svg:Object(),
	Data:[],
	getPath: function(data,lowLimit)
	{
		var n = data.length;
		var h = [];
		var u = [];
		var l = [];
		for (var i=0;i<n-1;i++){
			h[i] = data[i+1].x - data[i].x;
		}
		u[0] = 0;
		l[0] = 1;
		for (var i=1;i<n-1;i++){
			u[i] = h[i-1] / (h[i] + h[i-1]);
			l[i] = h[i] / (h[i] + h[i-1]);
		}
		var f1=[];
		f1[0]=6*(1-(data[0].y-data[1].y)/h[0])/(h[0]);
		for(var i=1;i<=n-2;i++)
		{
			f1[i]=6*((data[i-1].y-data[i].y)/h[i-1]-(data[i].y-data[i+1].y)/h[i])/(h[i-1]+h[i]);
		}
		f1[n-1]=6*((data[n-2].y-data[n-1].y)/h[n-2]-1)/h[n-2];
		var a=[];
		var b=[];
		var c=[];
		for (var i=0;i<n;i++){
			if (i==0)
			{
				b[0] = 2;
				c[0] = 1;
			}
			else if (i==(n-1))
			{	
				a[n-1] = 1;
				b[n-1] = 2;
			}
			else
			{
				a[i] = u[i];
				b[i] = 2;
				c[i] = l[i];
			}
		}
		var q=[];
		var p=[];
		q[0]=c[0]/b[0];
		p[0]=f1[0]/b[0];
		for(var i=1;i<n-1;i++)
		{
			q[i]=c[i]/(b[i]-a[i]*q[i-1]);
			p[i]=(f1[i]-a[i]*p[i-1])/(b[i]-a[i]*q[i-1]);
		}
		p[n-1]=(f1[n-1]-a[n-1]*p[n-2])/(b[n-1]-a[n-1]*q[n-2])
		var m=[];
		m[n-1]=p[n-1];
		for(var i=n-2;i>=0;i--)
		{
			m[i]=p[i]-m[i+1]*q[i];
		}
		
		
		
		var name = "M" + data[0].x.toString() + "," + "500" + " ";
		yList = [];
		for (var i=0;i<n;i++)
		{
			if (i==0)
			{
				tmp = "L" + data[0].x.toString() + "," + Math.ceil(data[0].y).toString() + " ";
				name = name.concat(tmp);
			//alert(name);
			}
			else 
			{
				for (var pointX = data[i-1].x;pointX - data[i].x <= 0;pointX++)
				{
					var pointY = data[i-1].y+((data[i].y-data[i-1].y)/(data[i].x-data[i-1].x)-(m[i]/6+m[i-1]/3)*(data[i].x-data[i-1].x))*(pointX-data[i-1].x)+m[i-1]*(pointX-data[i-1].x)*(pointX-data[i-1].x)/2+((m[i]-m[i-1])/(data[i].x-data[i-1].x))*Math.pow(pointX-data[i-1].x,3)/6;
					if (yList[pointX]) pointY = Math.min(pointY,yList[pointX]);
					yList[pointX] = pointY;
					tmp = "L" + pointX.toString() + "," + Math.ceil(pointY).toString() + " ";
					name = name + tmp;
				//	alert(name);
				}
		
			}
		}
		name+="L" + data[n-1].x.toString() + "," + lowLimit;
		return name;
	},
	makeStackGraph: function(svg,data)
	{
		svg.data = new Array();
		var g0=[];
		for(var i=0;i<data[0].length;i++)
		{
			g0[i] = {x:0,y:0};
			var sum=0;
			for(var j=0;j<data.length;j++)
			{
				sum += data[j][i].y
			}
			g0[i].x=data[0][i].x;
			g0[i].y=-sum/2.0+500;
		}
		for(var i=0;i<data.length;i++)
		{
			for(var j=0;j<data[0].length;j++)
			{
				if(i==0)
				{
					data[0][j].y = g0[j].y-data[0][j].y;
				}
				else
				{
					data[i][j].y = data[i-1][j].y-data[i][j].y;
				}
			}
		}
		for (var i=data.length-1;i>=0;i--){
			if (i % 2 == 0)  this.build(svg,"#556",data[i],i+1);
			else this.build(svg,"#aad",data[i],i+1);
		}
		this.build(svg,"white",g0,0);
	},
	
	build:function(svg,color,data,index)
	{
		var d = this.getPath(data,"500");
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
	},
	
	
}


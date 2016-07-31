var stackGraph = function(){};
stackGraph.prototype = {
	Y:[],
	yList:[],
	Svg:Object(),
	Data:[],
	getPath: function(data,index)
	{
        var n=data[0].length;
		var name="M"+data[index][0].x.toString()+","+Math.ceil(data[index][0].y).toString();
        for(var i=0;i<n-1;i++){
            name +="L"+data[index][i].x.toString() + "," + Math.ceil(data[index][i].y).toString() + " "+ "C" + (data[index][i].x+20).toString() + "," + Math.ceil(data[index][i].y).toString() + " " + (data[index][i+1].x-20).toString() + "," + Math.ceil(data[index][i+1].y).toString() + " " + data[index][i+1].x.toString() + "," + Math.ceil(data[index][i+1].y).toString() + " ";
        }
		name+="L"+data[index][n-1].x.toString()+","+Math.ceil(data[index][n-1].y).toString() + " ";
        for(var i=n-1;i>=1;i--){
            name +="L"+data[index-1][i].x.toString() + "," + Math.ceil(data[index-1][i].y).toString() + " "+ "C" + (data[index-1][i].x-20).toString() + "," + Math.ceil(data[index-1][i].y).toString() + " " + (data[index-1][i-1].x+20).toString() + "," + Math.ceil(data[index-1][i-1].y).toString() + " " + data[index-1][i-1].x.toString() + "," + Math.ceil(data[index-1][i-1].y).toString() + " ";
        }
        name+="L"+data[index-1][0].x.toString()+","+Math.ceil(data[index-1][0].y).toString() + " ";
        name+="L"+data[index][0].x.toString()+","+Math.ceil(data[index][0].y).toString();
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
		for(var i=0;i<=len;i++)
		{
			DATA[i]=new Array(data[0].length);
			for(var j=0;j<data[0].length;j++)
			{
				DATA[i][j]={x:0,y:0}
			}
		}
        g0[0]={x:data[0][0].x,y:500};
		for(var i=0;i<dg.length;i++)
		{
			g0[i+1] = {x:0,y:0};
			g0[i+1].x=data[0][i+1].x;
			g0[i+1].y=g0[i].y-dg[i];
		}
		for(var i=0;i<=data.length;i++)
		{
			for(var j=0;j<data[0].length;j++)
			{
				if(i==0)
				{
					DATA[i][j].y = g0[j].y
					DATA[i][j].x = g0[j].x;
				}
				else
				{
					DATA[i][j].y = DATA[i-1][j].y-data[i-1][j].y;
					DATA[i][j].x = data[i-1][j].x;
				}
			}
		}
		for (var i=1;i<DATA.length;i++){
            if (i % 3 == 0)  this.build(svg,"#2894FF",DATA,i);
            else if(i % 3 == 1) this.build(svg,"#82D900",DATA,i);
            else this.build(svg,"#F75000",DATA,i);
		}
        for (var i=1;i<DATA.length;i++){
           this.labeling(DATA[i],DATA[i-1],1,2,"stream",0.05)
        }
	},
	
	build:function(svg,color,data,index)
	{
        var n = data[0].length;
        var d=this.getPath(data,index);
        shape = document.getElementById("path" + (index+1).toString());
        if (!shape) shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
        shape.setAttributeNS(null, "d", d);
        shape.setAttributeNS(null,"id","path" + (index+1).toString());
        shape.setAttributeNS(null, "fill", color);
        shape.setAttributeNS(null, "stroke", "white");
        shape.setAttributeNS(null, "stroke-width", 0.2);
        if (color != "white") shape.setAttributeNS(null,"fill-opacity",0.8);
        else shape.setAttributeNS(null,"fill-opacity",1);
        svg.appendChild(shape);

	},
    labeling:function(t,b,minfont,maxfont,label,sigma)
    {
        var w=Math.round(maxfont*label.length);
        var w_min=Math.round(minfont*label.length);
        var step=2*Math.ceil((w/2)/40)+1;
        var imax=0,hmax=0;
        while(w>w_min)
        {
            imax=0;
            hmax=0;
            var T=this.maxSlidingWindow(t, t.length,step);
            var B =this.minSlidingWindow(b, b.length,step);
            for(var i=0;i< T.length;i++)
            {
                var temp=B[i]-T[i];
                if(temp>hmax)
                {
                    hmax=temp
                    imax=i;
                }
            }
            var center_x=imax*40;
            var center_y=(B[imax]+T[imax])/2+w*sigma/2;
            if(w*sigma<=hmax)
            {
                var Text=document.createElementNS("http://www.w3.org/2000/svg","text");
                Text.textContent=label;
                Text.setAttribute("x",center_x.toString());
                Text.setAttribute("y",center_y.toString());
                svg.appendChild(Text);
                break;
            }
            w=w-Math.max(0.5,Math.round(0.1*w));
        }
    },
    maxSlidingWindow:function(A,n,w)
    {
        var Q=[];
        var B=[];
        for(var i=0;i<w;i++)
        {
            while(Q.length>0&&A[i].y>=A[Q[Q.length-1]].y)
                 Q.pop();
            Q.push(i);
        }
        for(var i=w;i<n;i++)
        {
            B[i-w]=A[Q[0]].y;
            while(Q.length>0&&A[i].y>=A[Q[Q.length-1]].y)
                Q.pop();
            while(Q.length>0&&Q[0]<=(i-w))
                Q.shift();
            Q.push(i);
        }
        B[n-w]=A[Q[0]].y;
        return B;
    },
    minSlidingWindow:function(A,n,w)
    {
        var Q=[];
        var B=[];
        for(var i=0;i<w;i++)
        {
            while(Q.length>0&&A[i].y<=A[Q[Q.length-1]].y)
                Q.pop();
            Q.push(i);
        }
        for(var i=w;i<n;i++)
        {
            B[i-w]=A[Q[0]].y;
            while(Q.length>0&&A[i].y<=A[Q[Q.length-1]].y)
                Q.pop();
            while(Q.length>0&&Q[0]<=(i-w))
                Q.shift();
            Q.push(i);
        }
        B[n-w]=A[Q[0]].y;
        return B;
    },
	Translate: function()
	{
		var input = this['Data'];
		var svg = this['Svg'];
        var data=input.data;
        var dg=input.g;
		if (data == null) throw "translate error!";
		var len = data.length;
		var DATA = new Array(len);
		for(var i=0;i<=len;i++)
		{
			DATA[i]=new Array(data[0].length);
			for(var j=0;j<data[0].length;j++)
			{
				DATA[i][j]={x:0,y:0}
			}
		}
		var g0 = [];
        g0[0]={x:data[0][0].x,y:500};
        for(var i=0;i<dg.length;i++)
        {
            g0[i+1] = {x:0,y:0};
            g0[i+1].x=data[0][i+1].x;
            g0[i+1].y=g0[i].y-dg[i];
        }
        for(var i=0;i<=data.length;i++)
        {
            for(var j=0;j<data[0].length;j++)
            {
                if(i==0)
                {
                    DATA[i][j].y = g0[j].y
                    DATA[i][j].x = g0[j].x;
                }
                else
                {
                    DATA[i][j].y = DATA[i-1][j].y-data[i-1][j].y;
                    DATA[i][j].x = data[i-1][j].x;
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
			d = this.getPath(DATA,i+1);
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


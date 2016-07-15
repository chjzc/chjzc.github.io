var Treemap = function(){};
Treemap.prototype={
	Left:0,
	Top:0,
	Right:0,
	Bottom:0,
	result:[],
	squarify:function(svg,nodes,row)
	{
		var w=this.width();
		if(nodes[0]){
			var child=nodes[0];
			var rowadd=row.concat();
			rowadd.push(child);
			if((!row[0])||this.worst(row,w.len)>=this.worst(rowadd,w.len)){
				nodes.shift();
				this.squarify(svg,nodes,rowadd);
			}
			else{
				this.layoutrow(svg,row,w);
				this.squarify(svg,nodes,[]);
			}
		}
		else{
			this.layoutrow(svg,row,w);
		}
	},
	
	worst:function(row,w){
		var sum=0;
		var aspect=[];
		var n=row.length;
		for(var i=0;i<n;i++){
			sum = sum+row[i].size;
		}
		var side=sum/w;
		var others=[];
		for(var i=0;i<n;i++){
			others[i]=row[i].size/side;
		}
		for(var i=0;i<n;i++){
			if(others[i]/side>=1) aspect[i]=others[i]/side;
			else aspect[i]=side/others[i];
		}
		return Math.max.apply(null,aspect);
	},
	
	width:function(){
		var w=new Object();
		var height=this.Bottom-this.Top;
		var width=this.Right-this.Left;
		if(width>=height){
			w.flag=0;
			w.len=height;
		}
		else{
			w.flag=1;
			w.len=width;
		}
		return w;
	},
	
	layoutrow:function(svg,row,w){
		var sum=0;
		var aspect=[];
		var n=row.length;
		for(var i=0;i<n;i++){
			sum = sum+row[i].size;
		}
		var side=sum/w.len;
		var others=[];
		others[0]=0;
		for(var i=1;i<=n;i++){
			others[i]=row[i-1].size/side+others[i-1];
		}
		if(w.flag==0){
			for(var i=1;i<=n;i++){
				row[i-1].Left=this.Left;
				row[i-1].Right=this.Left+side;
				row[i-1].Top=this.Bottom-others[i];
				row[i-1].Bottom=this.Bottom-others[i-1];
				var shape=document.createElementNS("http://www.w3.org/2000/svg", "rect");
				shape.setAttributeNS(null, "x", this.Left.toString());
				shape.setAttributeNS(null,"y",(this.Bottom-others[i]).toString());
				shape.setAttributeNS(null, "width", side.toString());
				shape.setAttributeNS(null, "height", (others[i]-others[i-1]).toString());
				shape.setAttributeNS(null, "stroke", "white");
				shape.setAttributeNS(null, "stroke-width", 1.5);
				shape.setAttributeNS(null, "fill",row[i-1].color );
				svg.appendChild(shape);
				this.result.push(row[i-1]);
			}
			this.Left=this.Left+side;
		}
		if(w.flag==1){
			for(var i=1;i<=n;i++){
				row[i-1].Left=this.Left+others[i-1];
				row[i-1].Right=this.Left+others[i];
				row[i-1].Top=this.Bottom-side;
				row[i-1].Bottom=this.Bottom;
				var shape=document.createElementNS("http://www.w3.org/2000/svg", "rect");
				shape.setAttributeNS(null, "x", (this.Left+others[i-1]).toString());
				shape.setAttributeNS(null,"y",this.Bottom-side.toString());
				shape.setAttributeNS(null, "width", (others[i]-others[i-1]).toString());
				shape.setAttributeNS(null, "height", side.toString());
				shape.setAttributeNS(null, "stroke", "white");
				shape.setAttributeNS(null, "stroke-width", 1.5);
				shape.setAttributeNS(null, "fill", row[i-1].color);
				svg.appendChild(shape);
				this.result.push(row[i-1]);
			}
			this.Bottom=this.Bottom-side;
		}
	}
}
var Treemap = function(){};
Treemap.prototype={
	Left:100,
	Top:100,
	Right:300,
	Bottom:220,
	squarify:function(svg,nodes,row,w)
	{
		if(nodes[0]){
			var child=nodes[0];
			var rowadd=row.concat();
			rowadd.push(child);
			if((!row[0])||this.worst(row,w.len)>=this.worst(rowadd,w.len)){
				nodes.shift();
				this.squarify(svg,nodes,rowadd,w);
			}
			else{
				this.layoutrow(svg,row,w);
				this.squarify(svg,nodes,[],this.width());
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
			sum = sum+row[i];
		}
		var side=sum/w;
		var others=[];
		for(var i=0;i<n;i++){
			others[i]=row[i]/side;
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
			sum = sum+row[i];
		}
		var side=sum/w.len;
		var others=[];
		others[0]=0;
		for(var i=1;i<=n;i++){
			others[i]=row[i-1]/side+others[i-1];
		}
		if(w.flag==0){
			for(var i=1;i<=n;i++){
				var shape=document.createElementNS("http://www.w3.org/2000/svg", "rect");
				shape.setAttributeNS(null, "x", this.Left.toString());
				shape.setAttributeNS(null,"y",(this.Bottom-others[i]).toString());
				shape.setAttributeNS(null, "width", side.toString());
				shape.setAttributeNS(null, "height", (others[i]-others[i-1]).toString());
				shape.setAttributeNS(null, "stroke", "white");
				shape.setAttributeNS(null, "stroke-width", 0.2);
				shape.setAttributeNS(null, "fill", "#9370DB");
				svg.appendChild(shape);
			}
			this.Left=this.Left+side;
		}
		if(w.flag==1){
			for(var i=1;i<=n;i++){
				var shape=document.createElementNS("http://www.w3.org/2000/svg", "rect");
				shape.setAttributeNS(null, "x", (this.Left+others[i-1]).toString());
				shape.setAttributeNS(null,"y",this.Bottom-side.toString());
				shape.setAttributeNS(null, "width", (others[i]-others[i-1]).toString());
				shape.setAttributeNS(null, "height", side.toString());
				shape.setAttributeNS(null, "stroke", "white");
				shape.setAttributeNS(null, "stroke-width", 0.2);
				shape.setAttributeNS(null, "fill", "#9370DB");
				svg.appendChild(shape);
			}
			this.Bottom=this.Bottom-side;
		}
	}
}
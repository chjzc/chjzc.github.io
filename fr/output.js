
function graphui (frame)
{
	this.frame=frame;
	this.frame_width=parseInt(frame.getAttribute("width"));
    this.frame_height=parseInt(frame.getAttribute("height"));
	div = document.getElementById("div:"+frame.getAttribute("id"));
	this.frame_left = parseInt(div.offsetLeft);
	this.frame_top = parseInt(div.offsetTop);
	this.drawNodes = function() 
	{
		for( var i=0; i<graph.nodes.length; i++ ) 
		{
		  this.drawNode( graph.nodes[i] );
		}
	}

  // draw all edges
	this.drawEdges=function() 
	{
		for( var i=0; i<graph.nodes.length; i++ )
		{	
			for( var j=0; j<graph.nodes.length; j++ ) 
			{
				if ( graph.edges[i] && graph.edges[i][j] )
				{
					nodeI = graph.nodes[i];
					nodeJ = graph.nodes[j];
					this.drawEdge( nodeI, nodeJ);
				}
			}
       }
    }


  // draw the node at it's current position
	this.drawNode=function( node ) 
	{
		try 
		{
			var domNode = this.getNode(node.id);
			domNode.setAttributeNS(null,"cx",node.position.x);
			domNode.setAttributeNS(null,"cy",node.position.y);
		  //this.getNode(node.id).style.left = (this['frame_left'] + node['position']['x']);
		  //this.getNode(node.id).style.top = (this['frame_top'] + node['position']['y']);
		} catch( e ) {
		}
	}
	
	this.drawEdge=function ( nodeI, nodeJ) 
	{

    // edges should appear between center of nodes
		var i = new Object();
		i.x = nodeI.position.x;
		i.y = nodeI.position.y;
		i.r = nodeI.mass;
		
		var j = new Object();
		j.x = nodeJ.position.x;
		j.y = nodeJ.position.y;
		j.r = nodeJ.mass;
		// get a distance vector between nodes
		
		if (Math.abs(i.x - j.x) < 0.0001)
		{
			if (i.y > j.y)
			{
				var tmp = i;
				i = j;
				j = tmp;
			}
			x1 = i.x;
			x2 = j.x;
			y1 = i.y + i.r;
			y2 = j.y - j.r;
		}
		else
		{	
			if (i.x > j.x)
			{
				var tmp = i;
				i = j;
				j = tmp;
			}
			var k = (i.y - j.y)/(i.x - j.x);
			x1 = i.x + i.r / Math.sqrt(k*k+1);
			x2 = j.x - j.r / Math.sqrt(k*k+1);
			y1 = k * (x1 - i.x) + i.y;
			y2 = k * (x2 - i.x) + i.y;
		}
		
		//draw line
		edge = document.getElementById('edge'+nodeI.id+':'+nodeJ.id);
		path = "M" + x1.toString() + "," + y1.toString() + " L" + x2.toString() + "," + y2.toString();
		edge.setAttributeNS(null,"d",path);
		
  }
  // add an edge to the display
  this.addEdge=function( nodeI, nodeJ ) {
    var edge = document.createElementNS("http://www.w3.org/2000/svg", "path");
    edge.id = 'edge'+nodeI.id+':'+nodeJ.id;
	var path = "M" + nodeI.position.x.toString() + "," + nodeI.position.y.toString() + " L" +
			   nodeJ.position.x.toString() + "," + nodeJ.position.y;
	edge.setAttributeNS(null,"d",path);
	edge.setAttributeNS(null,"fill","none");
	edge.setAttributeNS(null,"stroke","#123");
	edge.setAttributeNS(null,"stroke-width",0.3);
    this.frame.appendChild(edge);
  },

  // add a node to the display
  this.addNode=function( node ) {
    var domNode=document.createElementNS("http://www.w3.org/2000/svg", "circle");
	domNode.setAttributeNS(null,"cx",parseInt(node.position.x));
	domNode.setAttributeNS(null,"cy",parseInt(node.position.y));
    domNode.setAttributeNS(null,"r",parseInt(node.mass));
	domNode.setAttributeNS(null,"fill","#FF7F24")
	domNode.id='node'+node.id;
	this.frame.appendChild(domNode);
    return domNode;
  },

  // return the UI representation of the graph node
  this.getNode=function( nodeId )
  {
	return document.getElementById( 'node' + nodeId );
  }

  // render an edge
  
}

function Node(id,mass,x,y)
{
	this.id=id;
	this.mass=mass;
	this.neighbor=0;
	this.position=new Object();
	this.position.x=x;
	this.position.y=y;
	this.force=new Object();
	this.force.x=0;
	this.force.y=0;
	this.speed=new Object();
	this.speed.x=0;
	this.speed.y=0;
}


function Distance(point1,point2)
{
	this.dx=point1.position.x-point2.position.x;
	this.dy=point1.position.y-point2.position.y;
	this.d=Math.sqrt(this.dx*this.dx+this.dy*this.dy);
}

function Graph(frame)
{
	this.frame_width=parseInt(frame.getAttribute("width"));
    this.frame_height=parseInt(frame.getAttribute("height"));
	this.origin = new Node( 'origin', 1, parseInt(this.frame_width/2), parseInt(this.frame_height/2));
    this.originWeight=15;
	this.selectednode=-1;

    // actually an _inverse_ gravity constant, used in calculating repulsive force
    this.gravity =30;

    // the maximum repulsive force that can be aqpplied in an iteration
    this.max_repulsive_force_distance = 512;

    // the UI that will listen to this graph
    this.ui;

    // parallel arrays
    this.nodes = new Array();
    this.edges = new Array();
	this.addnode=function(mass)
	{
		var x= this.frame_width/2-(Math.random()*100)+50;
		var y= this.frame_height/2-(Math.random()*100)+50;
		var id= this.nodes.length;
		var node=new Node(id,mass,x,y);
		this.nodes.push(node);
		this.ui.addNode(node);
		return node;
	}
	this.addedge=function(node1,node2,sig)
	{
		if(! this.edges[node1.id])
		{
			this.edges[node1.id]=new Object();
		}
		this.edges[node1.id][node2.id]=sig;
		this.ui.addEdge(node1,node2);
		node1.neighbor++;
		node2.neighbor++;
	}
	this.setUI=function( ui )
	{
		this['ui']=ui;
	}
	this.originforce = function(node)
	{
		var distance=new Distance(node,this.origin);
		var weight= 55;
		var originforce1 = (distance.d-weight)/weight;
		node.force.x -= originforce1*distance.dx/distance.d;
		node.force.y -= originforce1*distance.dy/distance.d;
		var originforce2=this.gravity*node.mass*1/Math.pow(distance.d,2);
		var df = this.max_repulsive_force_distance-distance.d;
		if ( df > 0 ) 
		{
			originforce2 *= (Math.log(df));
		}

        node.force.x += originforce2* distance.dx / distance.d;
        node.force.y += originforce2 * distance.dy / distance.d;
      
	}
	this.attractive=function(node1,node2)
	{
		var weight=this.edges[node1.id][node2.id];
		weight=weight+2*(node1.neighbor+node2.neighbor);
		var distance=new Distance(node1,node2);
		var attractiveforce=(distance.d-weight)/(weight);
		if(node1!=this.selectednode)
		{
			node1.force.x -= attractiveforce*distance.dx/distance.d;
			node1.force.y -= attractiveforce*distance.dy/distance.d;
		}
		if(node2!=this.selectednode)
		{
			node2.force.x += attractiveforce*distance.dx/distance.d;
			node2.force.y += attractiveforce*distance.dy/distance.d;
		}
	}
	this.repulsive=function( node1, node2)
	{
		var distance=new Distance(node1,node2);
		var repulsiveforce= this.gravity*node1.mass*node2.mass/Math.pow(distance.d,2);
		var df = this.max_repulsive_force_distance-distance.d;
		if ( df > 0 ) 
		{
		  repulsiveforce *= (Math.log(df));
		}
		if(node1!=this.selectednode)
		{
			node1.force.x += repulsiveforce * distance.dx/ distance.d;
			node1.force.y += repulsiveforce * distance.dy / distance.d;
		}
	}
	this.applyforce=function()
	{
		 try 
		{
			this.ui.drawNodes();
		} catch( e )
		{
			alert( "Error Drawing Nodes: " + e );
		}

	// draw edges
		try 
		{
			this.ui.drawEdges();
		} catch( e ) 
		{
			alert( "Error Drawing Edges: " + e );
		}
	

	// reposition nodes
		for( var i=0; i<this.nodes.length; i++ ) 
		{
			var nodeI = this['nodes'][i];
			this.originforce(nodeI);
			for( var j=0; j<this.nodes.length; j++ ) 
			{
				if ( i != j ) 
				{

					var nodeJ = this.nodes[j];

          // attractive force applied across an edge
					if ( this.edges[nodeI.id] && this.edges[nodeI.id][nodeJ.id] )
					{
						this.attractive(nodeI, nodeJ);
					}
          // repulsive force between any two nodes
					if(nodeI!=this.selectednode)
					{
						this.repulsive(nodeI, nodeJ);
					}
				}
			}
		}
		for (var i=0;i<this.nodes.length;i++)
		{
			var nodeI = this.nodes[i];
			if (Math.abs(nodeI.force.x) < 1) nodeI.force.x = 0;
			if (Math.abs(nodeI.force.y) < 1) nodeI.force.y = 0;
		  // add forces to node position
			nodeI.position.x += nodeI.speed.x + nodeI.force.x / 2;
			nodeI.position.y += nodeI.speed.y + nodeI.force.y / 2;
		
			nodeI.speed.x += nodeI.force.x / 30;
			nodeI.speed.y += nodeI.force.y / 30;
		  // wipe forces for iteration
			nodeI.force.x=0;
			nodeI.force.y=0;

		  // keep the node in our frame
		  this.bounds(nodeI);
		}
	}
	
	this.bounds=function(node)
	{
		var x=node.position.x;
		var y=node.position.y;
		if(x<0) node.position.x=0;
		if(x>this.frame_width) node.position.x=this.frame_width;
		if(y<0) node.position.y=0;
		if(y>this.frame_height) node.position.y=this.frame_height;
	}
	this.getSelected=function() 
	{
		return this.selectednode;
	}
	this.setSelected=function( nodeId ) 
	{
		this.selectednode = nodeId;
    }
	this.clearSelected=function() 
	{
		this.selectednode = -1;
	}
}


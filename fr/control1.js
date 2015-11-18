function usercontrol(timer,graph,ui)
{
	this.timer = timer;
    this.graph = graph;
    this.ui = ui;
	var context=this;
	document.onmousemove = function( e ) 
	{
		return(context.moveselected( e ));
    }

    document.onmouseup = function( e ) 
	{
		return(context.unselectnode( e ));
    }
	
	this.addedge=function( node1, node2, weight ) 
	{
		this.graph.addedge( node1, node2, weight );
	}
	
	this.selectNode=function( e, nodeid ) 
	{
		this.graph.setSelected( nodeid );
    }
  
	this.addnode=function( mass) 
	{

		var node;
    
    
		node = graph.addnode( mass);

		var domNode = this.ui.getNode( node.id );

		domNode.onmousedown=function(e) 
		{
			return(context.selectNode(e, node.id));
		}
		return node;
	}
	
	
	this.unselectnode=function() 
	{
		this.graph.clearSelected();
	}

  // handle mouse movement when a node is selected
	this.moveselected=function( e ) 
	{
		if ( context.graph.selectednode!=-1) 
		{
			var selectedNode = graph.getSelected();

			var X;
			var Y;
			
			
			X = e.pageX;
			Y = e.pageY;
				

			X -= graphui.frame_left;
			Y -= graphui.frame_top;

      // set the node position
			graph.nodes[selectedNode].position.x=X;
			graph.nodes[selectedNode].position.y=Y;
            graph.nodes[selectedNode].speed.x=0;
			graph.nodes[selectedNode].speed.y=0;
			this.graph.applyforce();

		}
	}
}
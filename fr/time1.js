
   function timecontrol(timeout){
	   this.time;
	   this.TIMEOUT=timeout;
	   this.interupt=true;
	   this.subscriber;
	   this.ontimeout=new EventHandler(this,
			function( context ) {
				context.notify();
				if ( !context.interupt ) { context.start(); }
			}
		  );
		this.start=function() {
			this.interupt=false;
			this.time = setTimeout(this.ontimeout,this.TIMEOUT);
		}
		this.stop = function() {
			this.interupt=true;
		}

      // add observers to subscribers queue
		this.subscribe = function( observer ) {
			this.subscriber=observer ;
		}

      // notify observers wen an event has occured
		this.notify = function() 
		{
			 this.subscriber.applyforce();
		}	
   }
      

 


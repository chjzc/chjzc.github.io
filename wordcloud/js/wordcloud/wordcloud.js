
define(function (require) {

	var self = {};
	 var idBase = new Date() - 0; //随机id
	 var DOM_WORDCLOUD_KEY = '_wCloud_instance_';
	 var instances = {};


	 self.init = function(dom){
		 dom = dom instanceof Array ? dom[0] : dom;
		 var key = dom.getAttribute(DOM_WORDCLOUD_KEY);
         if (!key) {
             key = idBase++;
             dom.setAttribute(DOM_WORDCLOUD_KEY, key);
         }

         instances = new WCloud(dom);
         instances.id = key;

		 return instances;
	 };
 
	function WCloud(dom){
        this.dom = dom;
        this.init();
	};

    function collision(wordImageData){
        var wdata, wy, widx, widxend, fidx, wv, fv;
        wdata = wordImageData.data;
        for (var wy = 0;wy<wdata.length;wy++){         
                if(wdata[wy]) {return true;}   
        };
        return false;
    };

    WCloud.prototype= {
        init:function(){
            //create my canvas
            var canvas = document.createElement("canvas");
            canvas.width=this.dom.scrollWidth;
            canvas.height=this.dom.scrollHeight;
            this.dom.appendChild(canvas);
            this.canvas = canvas;
            if ( canvas.getContext) {
                var ctx = this.ctx = canvas.getContext('2d');
            };
        },
  
        setOption:function(option){
                this.draw(option);
                return this;
        },
             
        
        draw:function(option){
            var data=option.data;
            var ctx = this.ctx;
            for (var i = 0; i < data.length; i++) { 
                ctx.save();  
                ctx.fillStyle = "#DEB887"; //color
                var fontsize ="Bold "+ data[i].size +"px 微软雅黑"; 
                ctx.font = fontsize; //size
                var text = data[i].text;               
                var tWidth = ctx.measureText(text).width;
                var tHeight = data[i].size;
                var angl=0;
				var ra=0;
                var x,y;
                while(true) {
                    x = ra*Math.cos(angl) - tWidth/2+this.canvas.width/2;  
                    y = ra*Math.sin(angl) - tHeight/2+this.canvas.height/2;   
                    var isCollision =collision(ctx.getImageData(x,y,tWidth+3,tHeight+3));
                    if (!isCollision)
					{
						break;
					}						
					ra += tWidth/180;
					angl += Math.PI/180;
                };
				ctx.fillText(text,x,y+tHeight);
                ctx.restore();
            };

        }
    }

	return self;
});
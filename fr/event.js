
    var EventHandler = function( context, handler ){
      return(
        function() {
          handler(context);
        }
      );
    };


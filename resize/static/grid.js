function dot(x,y,siga)
{
    this.x=x;
    this.y=y;
    this.siga=siga;
}
function edge(start,stop)
{
    this.start=start;
    this.stop=stop;
}
function face(vertex,siga)
{
    this.vertex=vertex;
    this.siga=siga;
}
function grid(row,col,vertex,edge,face)
{
	this.row=row;
	this.col=col;
    this.vertex=vertex;
    this.face=face;
    this.edge=edge;
}

function makeorgingrid(img)
{
    var amat=gradient(img);
    amat=nor(amat);
    var bmat=saliency(img);
    bmat=nor(bmat);
    var sigaMap=new cv.Mat(bmat.row,bmat.col,CV_64F,1);
    for(var i=0;i<sigaMap.data.length;i++)
        sigaMap.data[i]=bmat.data[i]*amat.data[i];
    sigaMap=nor(sigaMap);
	var test=nor(sigaMap)
    var col=img.col;
    var row=img.row;
    var dots=[];
    for(var j=0;j<row;j++)
    {
        for(var i=0;i<col;i++)
        {
            var temp=new dot(i,j,sigaMap.data[j*col+i]);
            dots.push(temp);
        }
    }
    var faces=[];
    var allvertexs=[];
    var alledges=[];

    var ynum=Math.round(row/32);
    var yrest=row-32*(ynum-1)-1;
    var xnum=Math.round(col/32);
    var xrest=col-32*(xnum-1)-1;


    for(var j=0;j<=ynum;j++)
    {
        var stepy;
        if(j!=ynum){
            stepy=32;
        }
        else{
            stepy=yrest;
        }
        for(var i=0;i<=xnum;i++)
        {
            var stepx;
            if(i!=xnum){
                stepx=32;
            }
            else{
                stepx=xrest;
            }
            allvertexs.push(dots[((j-1)*32+stepy)*col+(i-1)*32+stepx]);
        }
    }

    for(var j=0;j<ynum;j++)
    {
        var stepy;
        if(j!=ynum-1){
            stepy=32;
        }
        else{
            stepy=yrest;
        }
        for(var i=0;i<xnum;i++)
        {
            var stepx;
            if(i!=xnum-1){
                stepx=32;
            }
            else{
                stepx=xrest;
            }
                var tempvertexs=[],edges=[],allin=[];
                tempvertexs.push(j*(xnum+1)+i);
                tempvertexs.push(j*(xnum+1)+i+1);
                tempvertexs.push((j+1)*(xnum+1)+i);
                tempvertexs.push((j+1)*(xnum+1)+i+1);
                var sos=0;
                var num=0;
                alledges.push(new edge(j*(xnum+1)+i,j*(xnum+1)+i+1));
                alledges.push(new edge(j*(xnum+1)+i,(j+1)*(xnum+1)+i));
                if(i==xnum-1)
                    alledges.push(new edge(j*(xnum+1)+i+1,(j+1)*(xnum+1)+i+1));
                if(j==ynum-1)
                    alledges.push(new edge((j+1)*(xnum+1)+i,(j+1)*(xnum+1)+i+1));
                for(var m=0;m<=stepy;m++)
                {
                    for(var n=0;n<=stepx;n++)
                    {
                        num+=1;
                        sos+=dots[(j*32+m)*col+i*32+n].siga;
                    }
                }
			
            var tempF=new face(tempvertexs,sos/num);
            faces.push(tempF);
        }	
    }
	var max=-10000,min=10000;
    for(var j=0;j<ynum;j++)
    {
        for(var i=0;i<xnum;i++)
        {
            if(faces[j*xnum+i].siga>max)
            {
                max=faces[j*xnum+i].siga;
            }
            if(faces[j*xnum+i].siga<min)
                min=faces[j*xnum+i].siga;
        }
    }
	for(var j=0;j<ynum;j++)
    {
        for(var i=0;i<xnum;i++)
        {
            faces[j*xnum+i].siga=(faces[j*xnum+i].siga-min)/(max-min);
        }
    }
    var result=new grid(ynum,xnum,allvertexs,alledges,faces);
    return result;
}
function transfrom(grid)
{
	var result={};
	result["row"]=grid.row;
	result["col"]=grid.col;
	result["vertex"]=[];
	for(var i=0;i<grid.vertex.length;i++)
	{
		result["vertex"][i]={x:grid.vertex[i].x ,y:grid.vertex[i].y};
	}
	result["edge"]=[];
	for(var i=0;i<grid.edge.length;i++)
	{
		result["edge"][i]={start:grid.edge[i].start ,stop:grid.edge[i].stop};
	}
	result["face"]=[];
	for(var i=0;i<grid.face.length;i++)
	{
		result["face"][i]={vertex:grid.face[i].vertex ,siga:grid.face[i].siga};
	}
	return result;
}
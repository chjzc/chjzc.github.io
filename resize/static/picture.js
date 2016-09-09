function transtoshow(mat)
{
    var result=new cv.Mat(mat.row,mat.col,CV_GRAY);
    for(var i=0;i<result.data.length;i++)
        result.data[i]=mat.data[i]*4;
    return result;
}

function nor(mat)
{
    var mydata=mat.data;
    var col=mat.col;
    var row=mat.row;
    var max=-10000,min=10000;
    for(var j=0;j<row;j++)
    {
        for(var i=0;i<col;i++)
        {
            if(mydata[j*col+i]>max)
            {
                max=mydata[j*col+i];
            }
            if(mydata[j*col+i]<min)
                min=mydata[j*col+i];
        }
    }
    var result=new cv.Mat(row,col,CV_64F,1);
    for(var j=0;j<row;j++)
    {
        for(var i=0;i<col;i++)
        {
            result.data[j*col+i]=(mydata[j*col+i]-min)/(max-min);
        }
    }
    return result;
}


function gradient(orgin){
    var mat1 = cv.cvtColor(orgin, CV_RGBA2GRAY);
    var mat2 = cv.convertScaleAbs(cv.Sobel(mat1, 1, 0));
    var mat3 = cv.convertScaleAbs(cv.Sobel(mat1, 0, 1));
    var mat4 = addsum(mat2, mat3);
    return mat4;
}

function saliency(orgin)
{
    var mat0= RGBnormalize(orgin);
    var matR=artinormalize(orgin,"R");
    var matG=artinormalize(orgin,"G");
    var matB=artinormalize(orgin,"B");
    var matY=artinormalize(orgin,"Y");

    var matI1=guassDown(mat0);
    var matI2=guassDown(matI1);
    var matI3=guassDown(matI2);
    var matI4=guassDown(matI3);
    var matI5=guassDown(matI4);
    var matI6=guassDown(matI5);
    var matI7=guassDown(matI6);
    var matI8=guassDown(matI7);

    var matR1=guassDown(matR);
    var matR2=guassDown(matR1);
    var matR3=guassDown(matR2);
    var matR4=guassDown(matR3);
    var matR5=guassDown(matR4);
    var matR6=guassDown(matR5);
    var matR7=guassDown(matR6);
    var matR8=guassDown(matR7);

    var matG1=guassDown(matG);
    var matG2=guassDown(matG1);
    var matG3=guassDown(matG2);
    var matG4=guassDown(matG3);
    var matG5=guassDown(matG4);
    var matG6=guassDown(matG5);
    var matG7=guassDown(matG6);
    var matG8=guassDown(matG7);

    var matB1=guassDown(matB);
    var matB2=guassDown(matB1);
    var matB3=guassDown(matB2);
    var matB4=guassDown(matB3);
    var matB5=guassDown(matB4);
    var matB6=guassDown(matB5);
    var matB7=guassDown(matB6);
    var matB8=guassDown(matB7);

    var matY1=guassDown(matY);
    var matY2=guassDown(matY1);
    var matY3=guassDown(matY2);
    var matY4=guassDown(matY3);
    var matY5=guassDown(matY4);
    var matY6=guassDown(matY5);
    var matY7=guassDown(matY6);
    var matY8=guassDown(matY7);

    var matZ1=gaborDown(mat0,0);
    var matZ2=gaborDown(matZ1,0);
    var matZ3=gaborDown(matZ2,0);
    var matZ4=gaborDown(matZ3,0);
    var matZ5=gaborDown(matZ4,0);
    var matZ6=gaborDown(matZ5,0);
    var matZ7=gaborDown(matZ6,0);
    var matZ8=gaborDown(matZ7,0);

    var matQ1=gaborDown(mat0,45);
    var matQ2=gaborDown(matQ1,45);
    var matQ3=gaborDown(matQ2,45);
    var matQ4=gaborDown(matQ3,45);
    var matQ5=gaborDown(matQ4,45);
    var matQ6=gaborDown(matQ5,45);
    var matQ7=gaborDown(matQ6,45);
    var matQ8=gaborDown(matQ7,45);

    var matH1=gaborDown(mat0,90);
    var matH2=gaborDown(matH1,90);
    var matH3=gaborDown(matH2,90);
    var matH4=gaborDown(matH3,90);
    var matH5=gaborDown(matH4,90);
    var matH6=gaborDown(matH5,90);
    var matH7=gaborDown(matH6,90);
    var matH8=gaborDown(matH7,90);

    var matTQ1=gaborDown(mat0,135);
    var matTQ2=gaborDown(matTQ1,135);
    var matTQ3=gaborDown(matTQ2,135);
    var matTQ4=gaborDown(matTQ3,135);
    var matTQ5=gaborDown(matTQ4,135);
    var matTQ6=gaborDown(matTQ5,135);
    var matTQ7=gaborDown(matTQ6,135);
    var matTQ8=gaborDown(matTQ7,135);

    var I25=N(Abs(acrossSubtract(matI2,matI5)));
    var I26=N(Abs(acrossSubtract(matI2,matI6)));
    var I36=N(Abs(acrossSubtract(matI3,matI6)));
    var I37=N(Abs(acrossSubtract(matI3,matI7)));
    var I47=N(Abs(acrossSubtract(matI4,matI7)));
    var I48=N(Abs(acrossSubtract(matI4,matI8)));

    var RG25=N(Abs(acrossSubtract(subtract(matR2,matG2),subtract(matR5,matG5))));
    var RG26=N(Abs(acrossSubtract(subtract(matR2,matG2),subtract(matR6,matG6))));
    var RG36=N(Abs(acrossSubtract(subtract(matR3,matG3),subtract(matR6,matG6))));
    var RG37=N(Abs(acrossSubtract(subtract(matR3,matG3),subtract(matR7,matG7))));
    var RG47=N(Abs(acrossSubtract(subtract(matR4,matG4),subtract(matR7,matG7))));
    var RG48=N(Abs(acrossSubtract(subtract(matR4,matG4),subtract(matR8,matG8))));
    var BY25=N(Abs(acrossSubtract(subtract(matB2,matY2),subtract(matB5,matY5))));
    var BY26=N(Abs(acrossSubtract(subtract(matB2,matY2),subtract(matB6,matY6))));
    var BY36=N(Abs(acrossSubtract(subtract(matB3,matY3),subtract(matB6,matY6))));
    var BY37=N(Abs(acrossSubtract(subtract(matB3,matY3),subtract(matB7,matY7))));
    var BY47=N(Abs(acrossSubtract(subtract(matB4,matY4),subtract(matB7,matY7))));
    var BY48=N(Abs(acrossSubtract(subtract(matB4,matY4),subtract(matB8,matY8))));
    var C25=plus(RG25,BY25);
    var C26=plus(RG26,BY26);
    var C36=plus(RG36,BY36);
    var C37=plus(RG37,BY37);
    var C47=plus(RG47,BY47);
    var C48=plus(RG48,BY48);


    var Z25=N(Abs(acrossSubtract(matZ2,matZ5)));
    var Z26=N(Abs(acrossSubtract(matZ2,matZ6)));
    var Z36=N(Abs(acrossSubtract(matZ3,matZ6)));
    var Z37=N(Abs(acrossSubtract(matZ3,matZ7)));
    var Z47=N(Abs(acrossSubtract(matZ4,matZ7)));
    var Z48=N(Abs(acrossSubtract(matZ4,matZ8)));
    var Q25=N(Abs(acrossSubtract(matQ2,matQ5)));
    var Q26=N(Abs(acrossSubtract(matQ2,matQ6)));
    var Q36=N(Abs(acrossSubtract(matQ3,matQ6)));
    var Q37=N(Abs(acrossSubtract(matQ3,matQ7)));
    var Q47=N(Abs(acrossSubtract(matQ4,matQ7)));
    var Q48=N(Abs(acrossSubtract(matQ4,matQ8)));
    var H25=N(Abs(acrossSubtract(matH2,matH5)));
    var H26=N(Abs(acrossSubtract(matH2,matH6)));
    var H36=N(Abs(acrossSubtract(matH3,matH6)));
    var H37=N(Abs(acrossSubtract(matH3,matH7)));
    var H47=N(Abs(acrossSubtract(matH4,matH7)));
    var H48=N(Abs(acrossSubtract(matH4,matH8)));
    var TQ25=N(Abs(acrossSubtract(matTQ2,matTQ5)));
    var TQ26=N(Abs(acrossSubtract(matTQ2,matTQ6)));
    var TQ36=N(Abs(acrossSubtract(matTQ3,matTQ6)));
    var TQ37=N(Abs(acrossSubtract(matTQ3,matTQ7)));
    var TQ47=N(Abs(acrossSubtract(matTQ4,matTQ7)));
    var TQ48=N(Abs(acrossSubtract(matTQ4,matTQ8)));

    var I=N(acrossPlus(plus(I25,I26),acrossPlus(plus(I36,I37),plus(I47,I48),3),2));
    var C=N(acrossPlus(plus(C25,C26),acrossPlus(plus(C36,C37),plus(C47,C48),3),2));
    var OZ=N(acrossPlus(plus(Z25,Z26),acrossPlus(plus(Z36,Z37),plus(Z47,Z48),3),2));
    var OQ=N(acrossPlus(plus(Q25,Q26),acrossPlus(plus(Q36,Q37),plus(Q47,Q48),3),2));
    var OH=N(acrossPlus(plus(H25,H26),acrossPlus(plus(H36,H37),plus(H47,H48),3),2));
    var OTQ=N(acrossPlus(plus(TQ25,TQ26),acrossPlus(plus(TQ36,TQ37),plus(TQ47,TQ48),3),2));
    var O=N(plus(plus(OZ,OQ),plus(OH,OTQ)));
    var S=multi(plus(I,plus(C,O)),1/3);
    var result=upscale(mat0,S);
    // var matg=gaborDown(mat1,135);
   // iCanvas.width = 5000;
    //iCanvas.height = 5000;
    //iCtx.putImageData(cv.RGBA2ImageData(mat2), 0, 0);
    //iCtx.putImageData(cv.RGBA2ImageData(mat), 1500, 1500);
    //show(A);
    return result;
}

function multi(mat,c)
{
    var result=new cv.Mat(mat.row,mat.col,CV_64F,1);
    for(var i=0;i<mat.data.length;i++)
        result.data[i]=mat.data[i]*c;
    return result;
}
//a:large
function acrossSubtract(a,b){
    var temp=upscale(a,b);
    var result=subtract(a,temp);
    //result=Abs(result);
    return result;
}
//a:large;b:4 scale
function acrossPlus(a,b,scale){
    var num=4-scale;
    var temp=a;
    for(var i=0;i<num;i++)
    {
        temp=simpleDown(temp);
    }
   var  result=plus(temp,b);
    return result;
}

function Abs(mat)
{
    var result=new cv.Mat(mat.row,mat.col,CV_64F,1);
    for(var i=0;i<mat.data.length;i++)
        result.data[i]=Math.abs(mat.data[i]);
    return result;
}

function plus(mat1,mat2){
    if(mat1.row==mat2.row&&mat1.col==mat2.col)
    {
        var result=new cv.Mat(mat1.row,mat1.col,CV_64F,1);
        for(var i=0;i<mat1.data.length;i++)
            result.data[i]=mat1.data[i]+mat2.data[i];
        return result;
    }
    else{
        return;
    }
}

function subtract(mat1,mat2){
    if(mat1.row==mat2.row&&mat1.col==mat2.col)
    {
        var result=new cv.Mat(mat1.row,mat1.col,CV_64F,1);
        for(var i=0;i<mat1.data.length;i++)
            result.data[i]=mat1.data[i]-mat2.data[i];
        return result;
    }
    else{
        return;
    }
}

function upscale(large,small)
{
    var scol=small.col;
    var srow=small.row;
    var lcol=large.col;
    var lrow=large.row;
    var scale=Math.floor(lrow/srow);
    var withBorderMat = cv.copyMakeBorder(small,0,0,1,1);
    var mydata=withBorderMat.data;
    var col=withBorderMat.col;
    var row=withBorderMat.row;
    var result=new cv.Mat(lrow,lcol,CV_64F,1);
    for(var j=0;j<lrow;j++)
    {
        for(var i=0;i<lcol;i++)
        {
            var v=(j%scale)/scale;
            var u=(i%scale)/scale;
            var offsetR=(j-j%scale)/scale;
            var offsetC=(i-i%scale)/scale;
            result.data[j*lcol+i]=(1-v)*((1-u)*mydata[offsetR*col+offsetC]+u*mydata[offsetR*col+offsetC+1])+v*((1-u)*mydata[(offsetR+1)*col+offsetC]+u*mydata[(offsetR+1)*col+offsetC+1]);
        }
    }
    return result;
}

function simpleDown(__src)
{
    var width = __src.col,
        height = __src.row,
        dWidth = ((width & 1) + width) / 2,
        dHeight = ((height & 1) + height) / 2,
        sData = __src.data,
        dst = new cv.Mat(dHeight, dWidth, CV_64F,1),
        dstData = dst.data;
    var newValue, nowX, offsetY, offsetI, dOffsetI, i, j;
    for(i = dHeight; i--;){
        dOffsetI = i * dWidth;
        for(j = dWidth; j--;){
            dstData[j + dOffsetI]=sData[2*i*width+2*j];
        }
    }
    return dst;
}


function gaborDown(__src,theta){
    var x=[-10,-20/3,-10/3,0,10/3,20/3,10,
        -10,-20/3,-10/3,0,10/3,20/3,10,
        -10,-20/3,-10/3,0,10/3,20/3,10,
        -10,-20/3,-10/3,0,10/3,20/3,10,
        -10,-20/3,-10/3,0,10/3,20/3,10,
        -10,-20/3,-10/3,0,10/3,20/3,10,
        -10,-20/3,-10/3,0,10/3,20/3,10
    ];
    var y=[-10,-10,-10,-10,-10,-10,-10,
            -20/3,-20/3,-20/3,-20/3,-20/3,-20/3,-20/3,
            -10/3,-10/3,-10/3,-10/3,-10/3,-10/3,-10/3,
            0,0,0,0,0,0,0,
            10/3,10/3,10/3,10/3,10/3,10/3,10/3,
            20/3,20/3,20/3,20/3,20/3,20/3,20/3,
            10,10,10,10,10,10,10
    ];
    var x1=[],y1=[];
    theta=Math.PI*theta/180;
    for(var i=0;i<49;i++)
    {
        x1[i]=x[i]*Math.cos(theta)+y[i]*Math.sin(theta);
        y1[i]=y[i]*Math.cos(theta)-x[i]*Math.sin(theta);
    }
    var lambda= 2,gamma=1,sigma=1;
    var gaborKernal=[];
    var sum=0;
    for(var i=0;i<49;i++)
    {
        gaborKernal[i]=Math.exp(-(x1[i]*x1[i]+gamma*gamma*y1[i]*y1[i])/(2*sigma*sigma))*Math.cos(2*Math.PI*x1[i]/lambda);
        sum+=gaborKernal[i];
    }
    for(var i=0;i<49;i++)
    {
        gaborKernal[i]-=sum/49;
    }
    var width = __src.col,
        height = __src.row,
        dWidth = ((width & 1) + width) / 2,
        dHeight = ((height & 1) + height) / 2,
        sData = __src.data,
        dst = new cv.Mat(dHeight, dWidth, CV_64F,1),
        dstData = dst.data;
    var withBorderMat = cv.copyMakeBorder(__src, 3),
        mData = withBorderMat.data,
        mWidth = withBorderMat.col;
    var newValue, nowX, offsetY, offsetI, dOffsetI, i, j;
    var max=-1000,min=1000;
    for(i = dHeight; i--;){
        dOffsetI = i * dWidth;
        for(j = dWidth; j--;){
            //for(c = 3; c--;){
            newValue = 0;
            for(y = 7; y--;){
                offsetY = (y + i * 2) * mWidth;
                for(x = 7; x--;){
                    nowX = (x + j * 2);
                    newValue += (mData[offsetY + nowX] * gaborKernal[y * 7 + x]);
                }
            }
            dstData[j + dOffsetI] = newValue;
            if(newValue>max)
                max=newValue;
            if(newValue<min)
                min=newValue;
        }
    }
    for(var i=0;i<dstData.length;i++)
    {
        dstData[i]=256*(dstData[i]-min)/(max-min)
    }
    return dst;
}

function N(mat){
    var mydata=mat.data;
    var col=mat.col;
    var row=mat.row;
    var max=-1000,min=1000;
    var x,y;
    for(var j=0;j<row;j++)
    {
        for(var i=0;i<col;i++)
        {
            if(mydata[j*col+i]>max)
            {
                max=mydata[j*col+i];
                x=i;y=j;
            }
            if(mydata[j*col+i]<min)
                min=mydata[j*col+i];
        }
    }
    var result=new cv.Mat(row,col,CV_64F,1);
    //first
    for(var j=0;j<row;j++)
    {
        for(var i=0;i<col;i++)
        {
            result.data[j*col+i]=(mydata[j*col+i]-min)/(max-min);
        }
    }
    //second
    var num= 0,sum=0;
    for(var j=1;j<row-1;j++)
    {
        for(var i=1;i<col-1;i++)
        {
            if(result.data[j*col+i]>=result.data[j*col+i-1]&&result.data[j*col+i]>=result.data[j*col+i+1]&&result.data[j*col+i]>=result.data[(j-1)*col+i]&&result.data[j*col+i]>=result.data[(j+1)*col+i])
            {
                if(i!=x&&j!=y)
                {
                    sum+=result.data[j*col+i];
                    num+=1;
                }
            }
        }
    }
    var m=sum/num;
    //third
    for(var j=0;j<row;j++)
    {
        for(var i=0;i<col;i++)
        {
            result.data[j*col+i]=result.data[j*col+i]*(1-m)*(1-m);
        }
    }
    return result;
}

var guassDown = function(__src){
        var width = __src.col,
            height = __src.row,
            dWidth = ((width & 1) + width) / 2,
            dHeight = ((height & 1) + height) / 2,
            sData = __src.data,
            dst = new cv.Mat(dHeight, dWidth, CV_64F,1),
            dstData = dst.data;
        var withBorderMat = cv.copyMakeBorder(__src, 2),
            mData = withBorderMat.data,
            mWidth = withBorderMat.col;
        var newValue, nowX, offsetY, offsetI, dOffsetI, i, j;
        var kernel = [1,  4,  6,  4, 1,
            4, 16, 24, 16, 4,
            6, 24, 36, 24, 6,
            4, 16, 24, 16, 4,
            1,  4,  6,  4, 1
        ];
        for(i = dHeight; i--;){
            dOffsetI = i * dWidth;
            for(j = dWidth; j--;){
                //for(c = 3; c--;){
                    newValue = 0;
                    for(y = 5; y--;){
                        offsetY = (y + i * 2) * mWidth;
                        for(x = 5; x--;){
                            nowX = (x + j * 2);
                            newValue += (mData[offsetY + nowX] * kernel[y * 5 + x]);
                        }
                    }
                    dstData[j + dOffsetI] = newValue / 256;
            }
        }
    return dst;
};


function show(__mat){
    iCanvas.width = __mat.col;
    iCanvas.height = __mat.row;
    iCtx.putImageData(cv.RGBA2ImageData(__mat), 0, 0);
}

var RGBnormalize=function(mat){
    var height = mat.row,
        width = mat.col,
        channel = mat.channel;
    var newmat=new cv.Mat(height,width,CV_64F,1);
    var j=0;
    for(var i=0;i<height*width*channel-3;i=i+4)
    {
        newmat.data[j]=mat.data[i]+mat.data[i+1]+mat.data[i+2]
        j++;
    }
    return newmat;
}

var artinormalize=function(mat,colortype){
    var height = mat.row,
        width = mat.col,
        channel = mat.channel;
    var newmat=new cv.Mat(height,width,CV_64F,1);
    switch(colortype)
    {
        case "R":
            var j=0;
            for(var i=0;i<height*width*channel-3;i=i+4)
            {
                newmat.data[j]=mat.data[i]-(mat.data[i+1]+mat.data[i+2])/2;
                j++;
            }
            break;
        case "G":
            var j=0;
            for(var i=0;i<height*width*channel-3;i=i+4)
            {
                newmat.data[j]=mat.data[i+1]-(mat.data[i]+mat.data[i+2])/2;
                j++;
            }
            break;
        case "B":
            var j=0;
            for(var i=0;i<height*width*channel-3;i=i+4)
            {
                newmat.data[j]=mat.data[i+2]-(mat.data[i]+mat.data[i+1])/2;
                j++;
            }
            break;
        case "Y":
            var j=0;
            for(var i=0;i<height*width*channel-3;i=i+4)
            {
                newmat.data[j]=(mat.data[i]+mat.data[i+1])/2-Math.abs(mat.data[i]-mat.data[i+1])/2-mat.data[i+2];
                j++;
            }
            break;
    }
    return newmat;
}


var addsum = function(__src1, __src2){
    var height = __src1.row,
        width = __src1.col,
        channel = __src1.channel;
    var test=__src1.depth();
    if(__src1.type.match(/CV\_\d+/))
        dst = new cv.Mat(height, width, CV_64F, 1);
    else
        dst = new cv.Mat(height, width, CV_64F,1);
    var dData = dst.data,
        s1Data = __src1.data,
        s2Data = __src2.data;
    var i;
    for(i = height * width * channel; i--;)
        dData[i] =  Math.sqrt(s1Data[i]*s1Data[i] + s2Data[i]*s2Data[i]);
    return dst;
};



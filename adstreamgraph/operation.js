function operate(a)
{
    var dg=baseline(a);
    var ordering=resort(a);
    return {g:dg,data:ordering};
}

function baseline(layer)
{
    var n=layer.length;
    var dg=[];
    for(var j=1;j<layer[0].length;j++)
    {
        var w=new Array(n+1);
        var p=new Array(n+1);
        p[0]=0;
        w[0]=(0+layer[0][j].y)/2;
        w[n]=(layer[n-1][j].y+0)/2;
        for(var i=0;i<=(n-2);i++)
        {
            p[i+1]=p[i]-(layer[i][j].y-layer[i][j-1].y);
            w[i+1]=(layer[i][j].y+layer[i+1][j].y)/2;
        }
        p[n]=p[n-1]-(layer[n-1][j].y-layer[n-1][j-1].y);
        var temp=[];
        for(var k=0;k< p.length;k++)
        {
            temp[k]={element:p[k],iin:k};
        }
        temp.sort(function(a,b){
            return a.element- b.element;
        });
        var P=[];
        var W=[];
        for(var k=0;k<temp.length;k++)
        {
            P[k]=temp[k].element;
            W[k]=w[temp[k].iin];
        }
        var result=optimal(W,P);
        dg.push(result);
    }
    return dg;
}
function optimal(w,p)
{
    var d=0;
    var n= w.length;
    for(var i=0;i< n;i++)
    {
        d -= w[i];
    }
    for(var i=0;i<n;i++)
    {
        d += 2*w[i];
        if(d>=0) return p[i];
    }
}
/*-------------------------------------------------------------*/


function resort(layer)
{
    var first=initial(layer);
    var result=twoOpt(first.order,first.middle);
    return result;
}
function add(a,b)
{
    var result=[];
    for(var i=0;i< a.length;i++)
    {
        result[i]=a[i]+b[i];
    }
    return result;
}
function dele(a,b)
{
    var result=[];
    for(var i=0;i< a.length;i++)
    {
        result[i]=a[i]-b[i];
    }
    return result;
}
function initial(layer)
{
    var re=[];
    var graph=[];
    var m=0;
    var line=new Array(layer[0].length);
    for(var i=0;i<layer[0].length;i++)
    {
        line[i]=0;
    }
    graph.push(line);
    var n=layer.length;
    for(var i=0;i<n;i++)
    {
        var current1=[];
        var current2=[];
        for(var j=0;j<graph.length;j++)
        {
            current1.push(graph[j]);
            current2.push(graph[j]);
        }
        var la=[];
        for(var k=0;k<layer[i].length;k++)
        {
            la[k]=layer[i][k].y;
        }
        current1.push(add(graph[i],la));
        current2.unshift(dele(graph[0],la));
        var wig1=wiggle(current1);
        var wig2=wiggle(current2);
        if(wig1<=wig2)
        {
            if(!re)
                m=0;
            re.push(layer[i]);
            graph.push(add(graph[i],la));
        }
        else
        {
            if(!re)
                m=0;
            else
                m=m+1;
            re.unshift(layer[i]);
            graph.unshift(dele(graph[0],la));
        }
    }
    return {order:re,middle:m};
}

function wiggle(graph)
{
    var wig=0;
    var dg0=derivative(graph[0]);
    var n=graph.length-1;
    for(var j=1;j<graph[0].length;j++)
    {
        var x_co=0;
        var w=[];
        var p=[];
        p[0]=0;
        w[0]=(0+graph[1][j]-graph[0][j])/2;
        w[n]=(graph[n][j]-graph[n-1][j]+0)/2;
        for(var i=0;i<=(n-2);i++)
        {
            p[i+1]=p[i]-(graph[i+1][j]-graph[i][j]-graph[i+1][j-1]+graph[i][j-1]);
            w[i+1]=(graph[i+2][j]-graph[i][j])/2;
        }
        p[n]=p[n-1]-(graph[n][j]-graph[n-1][j]-graph[n][j-1]+graph[n-1][j-1]);
        for(var i=0;i<n+1;i++)
        {
            x_co=x_co+w[i]*Math.abs(dg0[j-1]-p[i]);
        }
        wig=wig+x_co;
    }
    return wig;
}

function derivative(line)
{
    var result=[];
    for(var i=1;i<line.length;i++)
        result[i - 1] = line[i] - line[i - 1];
    return result;
}

function twoOpt(init,m)
{
    var n=init.length;
    var bestWiggle=10000000;
    var bestOrdering=[];
    var ordering=[];
    for(var k=0;k<30;k++)
    {
        for(var i=0;i< init.length;i++)
        {
            ordering[i]=i;
        }
       if(k>=1)
            shuffle(ordering);
        for(var s=0;s<45;s++)
        {
            for(var j=m;j<n-1;j++)
            {
                var res=cmp(j,j+1,ordering,init);
                if(res>0)
                {
                    var temp=ordering[j];
                    ordering[j]=ordering[j+1];
                    ordering[j+1]=temp;
                }
            }
            for(var j=m-1;j>0;j--)
            {
                var res=cmp(j,j-1,ordering,init);
                if(res>0)
                {
                    var temp=ordering[j];
                    ordering[j]=ordering[j-1];
                    ordering[j-1]=temp;
                }
            }
        }
        var graph=middlelineGraph(ordering,init,m);
        var currentWiggle=wiggle(graph);
        if(currentWiggle<bestWiggle)
        {
            bestWiggle=currentWiggle;
            for(var p=0;p<ordering.length;p++)
                bestOrdering[p]=ordering[p];
        }
    }
    var result=[];
   for(var i=0;i<bestOrdering.length;i++)
   {
       result.push(init[bestOrdering[i]]);
   }
    return result;
}
function shuffle(ordering)
{
    var n=ordering.length;
    for (var i = n-1;i>=1;i--)
   {
       var t1 = Math.floor(Math.random()*(i+1));
       var temp=ordering[i];
       ordering[i]=ordering[t1];
       ordering[t1]=temp;
    }
}
function cmp(flat,distor,ordering,init)
{
    var res=0;
    var graph1=[];
    var graph2=[];
    var line1=[];
    var line2=[];
    for(var i=0;i<init[0].length;i++)
    {
        line1[i]=0;
        line2[i]=0
    }
    graph1.push(line1);
    graph2.push(line2);
    var f=[];
    var s=[];
    for(var j=0;j<init[0].length;j++)
    {
        f[j]=init[ordering[flat]][j].y;
        s[j]=init[ordering[distor]][j].y;
    }
    graph1.push(f);
    graph1.push(add(graph1[1],s));
    graph2.push(s);
    graph2.push(add(graph2[1],f));
    res=wiggle(graph1)-wiggle(graph2);
    return res;
}
function middlelineGraph(ordering,init,m)
{
    var graph=[];
    var line=[];
    var n=init.length;
    for(var i=0;i<init[0].length;i++)
    {
        line[i]=0;
    }
    graph.push(line);
    var k=0;
    for(var j=m;j<n;j++)
    {
        var next=[];
        for(var l=0;l<init[0].length;l++)
        {
            next[l]=init[ordering[j]][l].y;
        }
        graph.push(add(next,graph[k]));
        k++;
    }
    for(var j=m-1;j>=0;j--)
    {
        var next=[];
        for(var l=0;l<init[0].length;l++)
        {
            next[l]=init[ordering[j]][l].y;
        }
        graph.unshift(dele(graph[0],next));
    }
    return graph;
}
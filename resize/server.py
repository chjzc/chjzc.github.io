# -*- coding: utf-8 -*-
import numpy as np
import math
import scipy
import scipy.optimize
from flask import Flask, jsonify, request
import json
app = Flask(__name__)

@app.route('/dataconvector')
def dataConvector():
    myscale=json.loads(request.args.get('mykey'))
    scalex=myscale['xscale']
    scaley=myscale['yscale']
    f=file("static/data.json")
    mydata=json.load(f)
    bver=mydata['vertex']
    row=mydata['row']
    col=mydata['col']
    bx=[]
    by=[]
    ax=[]
    ay=[]
    bondX=[]
    bondY=[]
    for i in range(len(bver)):
        temp={'x':0,'y':0}
        temp['x']=int(round(bver[i]['x']*scalex))
        temp['y']=int(round(bver[i]['y']*scaley))
        if(i%(col+1)==0 or i%(col+1)==col):
            stepx=0
        else:
            stepx=15
        if(i/(col+1)==0 or i/(col+1)==row):
            stepy=0
        else:
            stepy=15
        box=(temp['x']-stepx*scalex,temp['x']+stepx*scalex)
        boy=(temp['y']-stepy*scaley,temp['y']+stepy*scaley)
        bondX.append(box)
        bondY.append(boy)
        bx.append(bver[i]['x'])
        by.append(bver[i]['y'])
        ax.append(temp['x'])
        ay.append(temp['y'])
        #print aver[1]['x']
    edge=mydata['edge']
    face=mydata['face']
    Bx=np.array(bx)
    By=np.array(by)
    Ax=np.array(ax)
    Ay=np.array(ay)

    for i in range(30):
        sf=getSF(Bx,By,Ax,Ay,face)
        li=getLI(Bx,By,Ax,Ay,edge)
        myfunx=makefunction(Bx,edge,face,sf,li)
        myprimx=makefprim(Bx,edge,face,sf,li)
        x,f1,d1=scipy.optimize.fmin_l_bfgs_b(func=myfunx,x0=Ax,fprime=myprimx,bounds=bondX,approx_grad=0)

        myfuny=makefunction(By,edge,face,sf,li)
        myprimy=makefprim(By,edge,face,sf,li)
        y,f2,d2=scipy.optimize.fmin_l_bfgs_b(func=myfuny,x0=Ay,fprime=myprimy,bounds=bondY,approx_grad=0)
        print f1
        print f2
        for i in range(len(x)):
            if x[i]<Ax[i]:
                Ax[i]=int(x[i]-0.5)
            elif x[i]>Ax[i]:
                Ax[i]=int(x[i]+0.5)
            else:
                Ax[i]=x[i]
        for i in range(len(y)):
            if y[i]<Ay[i]:
                Ay[i]=int(y[i]-0.5)
            elif y[i]>Ay[i]:
                Ay[i]=int(y[i]+0.5)
            else:
                Ay[i]=y[i]

    final=[]
    for i in range(len(Ax)):
        temp={'x':Ax[i],'y':Ay[i]}
        final.append(temp)
    return jsonify(result={'vertex':final})

def getSF(Bx,By,Ax,Ay,face):
	sf=[]
	for each in face:
		up=0
		down=0
		up +=(Bx[each['vertex'][0]]-Bx[each['vertex'][1]])*(Ax[each['vertex'][0]]-Ax[each['vertex'][1]]) + (By[each['vertex'][0]]-By[each['vertex'][1]])*(Ay[each['vertex'][0]]-Ay[each['vertex'][1]])
		up +=(Bx[each['vertex'][1]]-Bx[each['vertex'][2]])*(Ax[each['vertex'][1]]-Ax[each['vertex'][2]]) + (By[each['vertex'][1]]-By[each['vertex'][2]])*(Ay[each['vertex'][1]]-Ay[each['vertex'][2]])
		up +=(Bx[each['vertex'][2]]-Bx[each['vertex'][3]])*(Ax[each['vertex'][2]]-Ax[each['vertex'][3]]) + (By[each['vertex'][2]]-By[each['vertex'][3]])*(Ay[each['vertex'][2]]-Ay[each['vertex'][3]])
		up +=(Bx[each['vertex'][3]]-Bx[each['vertex'][0]])*(Ax[each['vertex'][3]]-Ax[each['vertex'][0]]) + (By[each['vertex'][3]]-By[each['vertex'][0]])*(Ay[each['vertex'][3]]-Ay[each['vertex'][0]])
		down +=(Bx[each['vertex'][0]]-Bx[each['vertex'][1]])*(Bx[each['vertex'][0]]-Bx[each['vertex'][1]]) + (By[each['vertex'][0]]-By[each['vertex'][1]])*(By[each['vertex'][0]]-By[each['vertex'][1]])
		down +=(Bx[each['vertex'][1]]-Bx[each['vertex'][2]])*(Bx[each['vertex'][1]]-Bx[each['vertex'][2]])+(By[each['vertex'][1]]-By[each['vertex'][2]])*(By[each['vertex'][1]]-By[each['vertex'][2]])
		down +=(Bx[each['vertex'][2]]-Bx[each['vertex'][3]])*(Bx[each['vertex'][2]]-Bx[each['vertex'][3]])+(By[each['vertex'][2]]-By[each['vertex'][3]])*(By[each['vertex'][2]]-By[each['vertex'][3]])
		down +=(Bx[each['vertex'][3]]-Bx[each['vertex'][0]])*(Bx[each['vertex'][3]]-Bx[each['vertex'][0]])+(By[each['vertex'][3]]-By[each['vertex'][0]])*(By[each['vertex'][3]]-By[each['vertex'][0]])
		sf.append((up+0.0)/down)
	return sf

def getLI(Bx,By,Ax,Ay,edge):
	li=[]
	for each in edge:
		up=math.sqrt((Ax[each['start']]-Ax[each['stop']])**2+(Ay[each['start']]-Ay[each['stop']])**2)
		down=math.sqrt((Bx[each['start']]-Bx[each['stop']])**2+(By[each['start']]-By[each['stop']])**2)
		li.append((up+0.0)/down)
	return li

def makefprim(orgin,edge,face,sf,li):
    def fprim(x):
        result=np.zeros(x.size)
        for i in range(len(face)):
            result[face[i]['vertex'][0]] +=face[i]['siga']*2*(x[face[i]['vertex'][0]]-x[face[i]['vertex'][1]]-sf[i]*(orgin[face[i]['vertex'][0]]-orgin[face[i]['vertex'][1]]))
            result[face[i]['vertex'][1]] +=face[i]['siga']*2*(x[face[i]['vertex'][1]]-x[face[i]['vertex'][0]]-sf[i]*(orgin[face[i]['vertex'][1]]-orgin[face[i]['vertex'][0]]))
            result[face[i]['vertex'][1]] +=face[i]['siga']*2*(x[face[i]['vertex'][1]]-x[face[i]['vertex'][2]]-sf[i]*(orgin[face[i]['vertex'][1]]-orgin[face[i]['vertex'][2]]))
            result[face[i]['vertex'][2]] +=face[i]['siga']*2*(x[face[i]['vertex'][2]]-x[face[i]['vertex'][1]]-sf[i]*(orgin[face[i]['vertex'][2]]-orgin[face[i]['vertex'][1]]))
            result[face[i]['vertex'][2]] +=face[i]['siga']*2*(x[face[i]['vertex'][2]]-x[face[i]['vertex'][3]]-sf[i]*(orgin[face[i]['vertex'][2]]-orgin[face[i]['vertex'][3]]))
            result[face[i]['vertex'][3]] +=face[i]['siga']*2*(x[face[i]['vertex'][3]]-x[face[i]['vertex'][2]]-sf[i]*(orgin[face[i]['vertex'][3]]-orgin[face[i]['vertex'][2]]))
            result[face[i]['vertex'][3]] +=face[i]['siga']*2*(x[face[i]['vertex'][3]]-x[face[i]['vertex'][0]]-sf[i]*(orgin[face[i]['vertex'][3]]-orgin[face[i]['vertex'][0]]))
            result[face[i]['vertex'][0]] +=face[i]['siga']*2*(x[face[i]['vertex'][0]]-x[face[i]['vertex'][3]]-sf[i]*(orgin[face[i]['vertex'][0]]-orgin[face[i]['vertex'][3]]))

        for i in range(len(edge)):
            result[edge[i]['start']] +=	2*(x[edge[i]['start']]-x[edge[i]['stop']]-li[i]*(orgin[edge[i]['start']]-orgin[edge[i]['stop']]))
            result[edge[i]['stop']] +=	2*(x[edge[i]['stop']]-x[edge[i]['start']]-li[i]*(orgin[edge[i]['stop']]-orgin[edge[i]['start']]))

        return result
    return fprim

def makefunction(orgin,edge,face,sf,li):
	def fun(x):
			sumDu=0
			sumDl=0
			for i in range(len(face)):
				temp=0;
				temp+=((x[face[i]['vertex'][0]]-x[face[i]['vertex'][1]])-sf[i]*(orgin[face[i]['vertex'][0]]-orgin[face[i]['vertex'][1]]))**2
				temp+=((x[face[i]['vertex'][1]]-x[face[i]['vertex'][2]])-sf[i]*(orgin[face[i]['vertex'][1]]-orgin[face[i]['vertex'][2]]))**2
				temp+=((x[face[i]['vertex'][2]]-x[face[i]['vertex'][3]])-sf[i]*(orgin[face[i]['vertex'][2]]-orgin[face[i]['vertex'][3]]))**2
				temp+=((x[face[i]['vertex'][3]]-x[face[i]['vertex'][0]])-sf[i]*(orgin[face[i]['vertex'][3]]-orgin[face[i]['vertex'][0]]))**2
				temp=temp*face[i]['siga']
				sumDu+=temp
			for i in range(len(edge)):
				sumDl+=((x[edge[i]['start']]-x[edge[i]['stop']])-li[i]*(orgin[edge[i]['start']]-orgin[edge[i]['stop']]))**2
			#print sumDu
			#print sumDl
			#print sumDu+sumDl
			return sumDl+sumDu
	return fun

if __name__=="__main__":
    app.run(debug = True)

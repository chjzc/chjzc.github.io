
(x[face[i]['vertex'][0]]-x[face[i]['vertex'][1]]-sf[i]*(orgin[face[i]['vertex'][0]]-orgin[face[i]['vertex'][1]]))
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
#! /Users/yasmine/IDVX/time-series/related
# Filename : hellotym.py
import pylab
import random
import numpy as np 
import json 
import time
import math

##define 3stigma algorithm 
def normal(mu,stigma,data):
	if data>mu-3*stigma and data<mu+3*stigma:
		return True 


def abnormal(mu,stigma,data):
	if data<mu-3*stigma or data>mu+3*stigma:
		return True 

##def normal and abnormal generator 
def normal_generator(mu,stigma):
	value=random.normalvariate(mu,stigma)
	while normal(mu,stigma,value)==True:
		break 
	return value 


def abnormal_generator(mu,stigma):
	value=random.normalvariate(mu,stigma)
	while abnormal(mu,stigma,value)==True:
		break 
	return value 

##def interval (data set)
def normal_interval(list,data_list):	
	number=30
	mu=25
	stigma=0.5
	##data_list=[]
	for i in range(number):
		value=normal_generator(mu,stigma)
		data={}
		data['t']=0
		data['s']="normal"
		data['v']=value 
		##data['name']='main'
		list.append(data)
		data_list.append(value)
	print "low normal interval"
	return list,data_list

def abnormal_interval(list,data_list):
	number=30
	mu=25
	stigma=0.5
	##data_list=[]
	for x in range(number):
		value=normal_generator(mu,stigma)
		data={}
		noise={}
		data['t']=0
		data['s']="abnormal"
		data['v']=value
		##data['name']='main'
		##noise_value=value+np.random.normal(0,1)
		##noise['s']="abnormal"
		##noise['v']=noise_value 
		data_list.append(value)
		##noise_list.append(noise)
		list.append(data)	
	print "low abnormal interval"
	##print noise_list	
	return list,data_list##,noise_list

def average(x):
    assert len(x) > 0
    return float(sum(x)) / len(x)

def pearson_def(x, y):
    assert len(x) == len(y)
    n = len(x)
    assert n > 0
    avg_x = average(x)
    avg_y = average(y)
    diffprod = 0
    xdiff2 = 0
    ydiff2 = 0
    for idx in range(n):
        xdiff = x[idx] - avg_x
        ydiff = y[idx] - avg_y
        diffprod += xdiff * ydiff
        xdiff2 += xdiff * xdiff
        ydiff2 += ydiff * ydiff

    return diffprod / math.sqrt(xdiff2 * ydiff2)

duration = 10
mu = random.randint(1,100)
stigma = 0.010
x = range(duration)
main = []
sub=[]
data_list=[]
nextDelta=0
m=random.randint(1,duration)
print m

##generate main sensor 
for i in x:
	if i==m-1:
		abnormal_interval(main,data_list)
	else:
		normal_interval(main,data_list)
##print data_list

##generate the sublist 



# temp=m
# print temp
# for i in x:
# 	if i==temp:
# 		for item in main :
# 			if item['s']=='abnormal':
# 				noise['s']='abnormal'
# 				noise['t']=0
# 				noise['v']=item['v']
# 				##noise['name']='sub_a'
# 				sub_a.append(noise)	
# 	else:
# 		normal_interval(sub_a,data_list)
final=[]


##add time sequence 
j=len(main)
i=0
start_time='2017-7-1 00:00:00'
start_stamp=time.mktime(time.strptime(start_time,'%Y-%m-%d %H:%M:%S'))
while i<j:
	main[i]['t']=start_stamp	
	start_stamp+=5
	i+=1

##def abnormal series 
truth_range=[]
start=(m-1)*30*5+start_stamp-5*j
stop=start+145
truth_range.append(start)
truth_range.append(stop)

##add name 
	
for item in main:
	item['name']='main'

final_main={'NNAME':'main','data':main,'ground_truth':truth_range}
final.append(final_main)

count_append=0
repetition=1
##generate sub data 
while True:
	
	sub_a=[]
	sub_data_list=[]
	temp=random.choice([m-1,m+1,m+2])
	print temp
	for i in x:
		if i!=temp:
			normal_interval(sub_a,sub_data_list)
		else:
			for item in main:
				if item['s']=='abnormal':
					noise={}
					noise['s']='abnormal'
					noise['v']=(50-item['v'])*random.normalvariate(1,0.005)
					sub_a.append(noise)
					sub_data_list.append(noise['v'])
	#print sub_data_list

	
	##add time sequence 
	j=len(sub_a)
	count=0
	start_time='2017-7-1 00:00:00'
	start_stamp=time.mktime(time.strptime(start_time,'%Y-%m-%d %H:%M:%S'))
	while count<j:
		sub_a[count]['t']=start_stamp 
		start_stamp+=5
		count+=1
    # # ##def ground truth
	ground_truth=[]
	begin=0
	end=0
	for item in sub_a:
		item['name']='sub'+str(repetition)

	for item in sub_a:	
		if item['s']=='abnormal':
			begin=item['t']
			end=begin+145
			ground_truth.append(begin)
			ground_truth.append(end)
			break

	
	repetition+=1
	if pearson_def(data_list,sub_data_list)>0.1 and pearson_def(data_list,sub_data_list)<0.3:
		final_sub={'NNAME':'sub'+str(count_append),'data':sub_a,'ground_truth':ground_truth}		
		final.append(final_sub)
		print 'yes'
		for item in sub_a:
			item['name']='sub'+str(count_append)
		count_append+=1
	if count_append==5:
		break 

combine={'fre':'5s','num':'15','SD_between':'','SD_within':'3.0','sensors':final}
combine_set=[]
combine_set.append(combine)
with open('lowfre.json', 'w') as outfile:
        json.dump(combine_set, outfile)
##pylab.plot(x,y,'og-')
pylab.xlabel("Time")
pylab.ylabel("Value")

##pylab.savefig("lineGraph.png")
##pylab.show()








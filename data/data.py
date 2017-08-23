#! /Users/yasmine/IDVX/time-series/related
# Filename : hellotym.py
import pylab
import random
import numpy as np 
import json 
import time
import math

##define 3stigma algorithm 
# def normal(mu,stigma,data):
# 	if data>mu-3*stigma and data<mu+3*stigma:
# 		return True 


# def abnormal(mu,stigma,data):
# 	if data<mu-3*stigma or data>mu+3*stigma:
# 		return True 

# ##def normal and abnormal generator 
# def normal_generator(mu,stigma):
# 	value=random.normalvariate(mu,stigma)
# 	while normal(mu,stigma,value)==True:
# 		break 
# 	return value 


# def abnormal_generator(mu,stigma):
# 	value=random.normalvariate(mu,stigma)
# 	while abnormal(mu,stigma,value)==True:
# 		break 
# 	return value 

def normal_interval(dlist,data_list,number):	
	#number=15
	mu=25
	stigma=1.0
	##data_list=[]
	for i in range(number):
		#value=normal_generator(mu,stigma)
		data={}
		data['t']=0.0
		data['s']="normal"
		
		value=random.uniform(mu-3*stigma,mu+3*stigma)
		data['v']=value 
		dlist.append(data)
		data_list.append(value)
		##data['name']='main'

		# while True:
		# 	value=random.normalvariate(mu,stigma)
		# 	if value>mu-3*stigma and value<mu+3*stigma:
		# 		data['v']=value 
		# 		list.append(data)
		# 		data_list.append(value)
		# 		break	
	print "low normal interval"
	return dlist,data_list
	
def abnormal_interval(period_low,dlist,data_list,number):
	#number=15
	mu=25
	stigma=1.0
	##data_list=[]
	for x in range(number):
		data={}
		noise={}
		data['t']=0.0
		data['s']="abnormal"
		choose=random.choice([1,2])
		if choose==1:
			value=random.uniform(mu-3.5*stigma,mu-3*stigma)
		if choose==2:
			value=random.uniform(mu+3*stigma,mu+3.5*stigma)
		data['v']=value
		dlist.append(data)
		data_list.append(value)
		period_low.append(value)
		# while True:
		# 	value=random.normalvariate(mu,stigma)
		# 	if value<mu-3*stigma and value>mu+3*stigma
		# 	data['v']=value
		# 	list.append(data
		# 	data_list.append(value)
		# 	break
	print "low abnormal interval"
	##print noise_list	
	return dlist,data_list,period_low##,noise_list

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


def generator(finalout,number,fre,relation,count_max):
	duration = 7
	period_high=[]
	period_low=[]
	mu = random.randint(1,100)
	stigma = 0.010
	x = range(duration)
	main = []
	sub=[]
	data_list=[]
	nextDelta=0
	m=random.randint(3,5)
	print m

	##generate main sensor 
	for i in x:
		if i==m-1:
			abnormal_interval(period_low,main,data_list,number)
		else:
			normal_interval(main,data_list,number)
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
	# 		normal_interval(sub_a,data_list2)
	final=[]
	


	##add time sequence 
	j=len(main)
	i=0
	start_time='2017-7-1 00:00:00'
	start_stamp=time.mktime(time.strptime(start_time,'%Y-%m-%d %H:%M:%S'))
	while i<j:
		main[i]['t']=start_stamp	
		start_stamp+=fre
		i+=1

	##def abnormal series 
	truth_range=[]
	for item in main:
		if item['s']=='abnormal':
			start=item['t']
			stop=start+fre*(number-1)
			truth_range.append(start)
			truth_range.append(stop)
			break
	for item in main:
		item['name']='main'
	final_main={'NNAME':'main','data':main,'ground_truth':truth_range,}
	final.append(final_main)
	
	count_append=0
	repetition=1




	last=[]
	last_range=[]
	last_data_list=[]
	for i in x:
		if i!=m-1:
			normal_interval(last,last_data_list,number)
		else:
			for item in main:
				if item['s']=='abnormal':
					last_item={}
					temp=random.normalvariate(1,relation)
					if temp>1:
						temp=1
					last_item['v']=(item['v']-25)*temp+25
					period_high.append(last_item['v'])
					last_item['s']=item['s']
					last.append(last_item)
	move_num=random.randint(2,5)
	for i in range(15*move_num):
			first=last.pop(0)
			last.append(first)
	j=len(last)
	count=0
	start_time='2017-7-1 00:00:00'
	start_stamp=time.mktime(time.strptime(start_time,'%Y-%m-%d %H:%M:%S'))
	while count<j:
		last[count]['t']=start_stamp 
		start_stamp+=fre
		count+=1
	for item in last:
		item['name']='last'
		if item['s']=='abnormal':
			a=item['t']
			b=a+fre*(number-1)
			period_high.append(item['v'])
			last_range.append(a)
			last_range.append(b)
	final_last={'NNAME':'last','data':last,'ground_truth':last_range,'order':count_max}

	
	while True:
		
		sub_a=[]
		sub_data_list=[]
		for i in x:
			if i!=m:
				normal_interval(sub_a,sub_data_list,number)
			else:
				count_period=0
				count_length=len(period_low)
				if count_max==4:
					sequence=[0.2,0.4,0.6,0.8]
					random.shuffle(sequence)
				while count_period<count_length:
					noise={}
					noise['s']='abnormal'
					# if count_max==1:
					# 	sequence=[0.5]
						
					# 	#multiple=sequence[count_append]
					# 	order=multiple/0.5
					# 	#noise['v']=period_high[count_period]
					# 	#noise['v']=period_low[count_period]*multiple+period_high[count_period]*(1-multiple)
					# 	#sub_a.append(noise)
					# 	#sub_data_list.append(noise['v'])
					# if count_max==2:
					# 	sequence=[0.33,0.66]
					# 	random.shuffle(sequence)
					# 	#multiple=sequence[count_append]
					# 	order=multiple/0.33
					# 	#noise['v']=period_high[count_period]
					# 	#noise['v']=period_low[count_period]*multiple+period_high[count_period]*(1-multiple)
					# 	sub_a.append(noise)
					# 	sub_data_list.append(noise['v'])
						#noise['v']=period_high[count_period]
					multiple=sequence[count_append]
					if count_max==4:
						order=multiple/0.2
					noise['v']=period_low[count_period]*multiple+period_high[count_period]*(1-multiple)
					sub_a.append(noise)
					sub_data_list.append(noise['v'])
					# if count_max==6:
					# 	sequence=[0.14,0.28,0.42,0.56,0.7,0.84]
					# 	random.shuffle(sequence)
					# 	multiple=sequence[count_append]
					# 	#noise['v']=period_high[count_period]
					# 	order=multiple/0.14
					# 	noise['v']=period_low[count_period]*multiple+period_high[count_period]*(1-multiple)
					# 	sub_a.append(noise)
					# 	sub_data_list.append(noise['v'])
					count_period+=1
				# for item in main:
				# 	if item['s']=='abnormal':
				# 		noise={}
				# 		noise['s']='abnormal'
				# 		temp=random.normalvariate(1,relation)
				# 		if temp>1:
				# 			temp=1
				# 		# if type==0:
				# 		# 	noise['v']=50-(item['v']-25)*temp-25
				# 		# if type==1:

				# 		noise['v']=(item['v']-25)*temp+25
				# 		#noise['v']=(item['v']-25)*temp+25
						# noise['v']=50-(item['v']-25)*temp-25
						#choice=random.choice([1,2])
						# if choice==1:
						# 	noise['v']=(50-item['v'])*random.normalvariate(1,0.01)
						# if choice==2:
						# 	noise['v']=item['v']*random.normalvariate(1,0.01)
							
		move_num=random.randint(2,5)
		for i in range(25*move_num):
			first=sub_a.pop(0)
			# print first
			# print len(sub_a)
			sub_a.append(first)
			#print len(sub_a)


		##add time sequence 
		j=len(sub_a)
		count=0
		start_time='2017-7-1 00:00:00'
		start_stamp=time.mktime(time.strptime(start_time,'%Y-%m-%d %H:%M:%S'))
		while count<j:
			sub_a[count]['t']=start_stamp 
			start_stamp+=fre
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
				end=begin+fre*(number-1)
				ground_truth.append(begin)
				ground_truth.append(end)
				break

		repetition+=1
		after_exchange=[]
		length=len(sub_a)
		random_start=random.uniform(30,100)
		if pearson_def(data_list,sub_data_list)>0.1 and pearson_def(data_list,sub_data_list)<0.3:
			final_sub={'NNAME':'sub'+str(count_append),'data':sub_a,'ground_truth':ground_truth,'order':order}		
			final.append(final_sub)
			print 'yes'
			for item in sub_a:
				item['name']='sub'+str(count_append)
			count_append+=1

		if count_append==count_max:
			break 
	#final.append(final_last)
	combine_set={'scale':'0','number':count_append,'fre':fre,'noise':relation,'sensors':final}
	return combine_set

result=[]
finaloutput=[]
repetition=3
design=1

for i in range(repetition*design):
	result.append(generator(finaloutput,25,12,1.5,4))
# for i in range(repetition*design):
# 	result.append(generator(finaloutput,25,12,1.5,4))
# for i in range(repetition*design):
# 	result.append(generator(finaloutput,25,12,1.5,6))
# for i in range(repetition*design):
# 	result.append(generator(finaloutput,50,6,1.5,2))
# for i in range(repetition*design):
# 	result.append(generator(finaloutput,50,6,1.5,4))
# for i in range(repetition*design):
# 	result.append(generator(finaloutput,50,6,1.5,6))
# for i in range(repetition*design):
# 	result.append(generator(finaloutput,100,3,1.5,2))
# for i in range(repetition*design):
# 	result.append(generator(finaloutput,100,3,1.5,4))
# for i in range(repetition*design):
# 	result.append(generator(finaloutput,100,3,1.5,6))

# for i in range(repetition*design):
# 	result.append(generator(finaloutput,100,3,1.5,2))
# for i in range(repetition*design):
# 	result.append(generator(finaloutput,50,6,1.5,2))
# for i in range(repetition*design):
# 	result.append(generator(finaloutput,50,6,1.5,4))



with open('final1.json', 'w') as outfile:
        json.dump(result, outfile)
##pylab.plot(x,y,'og-')
pylab.xlabel("Time")
pylab.ylabel("Value")

##pylab.savefig("lineGraph.png")
##pylab.show()








window.onload = function(){
    document.getElementById("next").onclick = next;
} 
var taskArr = [
    "task1-1","task1-4","task1-7",
    "task2-2","task2-5","task2-8",
    "task4-3","task4-6","task4-9"
];
var report = [];
var startTime, endTime;
var currentTask;

function next(){
    if(!startTime){
        startTime = new Date();
        showNextTask();
        document.getElementById('count').innerHTML = "1 / 9";
    }
    else{
        var answer = getRadioValue("answer");
        if(!answer) return;

        if(taskArr.length) {
            document.getElementById('count').innerHTML = 9 - taskArr.length + 1 + " / 9";
            showNextTask();
        }else{
            alert("Answer: 1.A 2.B 3.C 4.Longer 5.Same 6.Shorter 7.5 8.1 9.3" )
        }
    }

}

var rand = 0;
function showNextTask(){
    var nextTask = taskArr.splice(rand, 1)[0];
    var type = nextTask.split("-")[0];

    currentTask = nextTask;
    document.getElementById('mainview').src = "";
    document.getElementById('mainview').src = "http://xumaoran.com/GraphComp/example/" + nextTask + ".jpeg";

    if(type == "task1"){
        document.getElementById('choice').innerHTML = 
            `<span>Given a cluster of nodes in G1 highlighted, find the corresponding cluster in G2.</span>
            <br>
            <input type="radio" name="answer" value="A" />A
            <input type="radio" name="answer" value="B"/>B
            <input type="radio" name="answer" value="C" />C
            <input type="radio" name="answer" value="Uncertain" />Uncertain`;
    }else if(type == "task2"){
        document.getElementById('choice').innerHTML = 
            `<span>Given the same two highlighted nodes in each graph, 
            determine whether the distance between the two nodes are shorter or longer from G1 to G2.</span>
            <br>
            <input type="radio" name="answer" value="Shorter" />Shorter
            <input type="radio" name="answer" value="Same"/>Same
            <input type="radio" name="answer" value="Longer" />Longer
            <input type="radio" name="answer" value="Uncertain" />Uncertain`;
    }else if(type == "task4"){
        document.getElementById('choice').innerHTML = 
            `<span>Score the similarity between G1 and G2, from 1 to 5.</span>
            <br>
            <input type="radio" name="answer" value="1" />1
            <input type="radio" name="answer" value="2" />2
            <input type="radio" name="answer" value="3" />3
            <input type="radio" name="answer" value="4" />4
            <input type="radio" name="answer" value="5" />5
            <input type="radio" name="answer" value="Uncertain" />Uncertain
            `;
    }
}

function getRadioValue(radioName){
    var radios = document.getElementsByName(radioName);
    var value;
    for(var i=0;i<radios.length;i++){
        if(radios[i].checked){
            value = radios[i].value;
            break;
        }
    }
    return value;
}
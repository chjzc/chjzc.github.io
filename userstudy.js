window.onload = function(){
    document.getElementById("next").onclick = next;
    initTasks();
} 
var taskArr = [];
var report = [];
var startTime, endTime;
var currentTask;

function saveCsv(){
    var blob = new Blob(report, {type: "text/plain;charset=utf-8"});
    saveAs(blob, "result.csv");
}

function addRow(taskid, result, time){
    report.push(taskid + "," + result +"," + time +"\n");
}

function initTasks(){
    for(var i = 1; i <= 36; i++){
        taskArr.push("task1-" + i);
    }
    for(var i = 1; i <= 72; i++){
        taskArr.push("task2-" + i);
    }
    for(var i = 1; i <= 72; i++){
        taskArr.push("task4-" + i);
    }
    addRow("taskid", "answer", "time");
}

function next(){
    if(!startTime){
        startTime = new Date();
        showNextTask();
        document.getElementById('count').innerHTML = "1 / 180";
    }
    else{
        var answer = getRadioValue("answer");
        if(!answer) return;
        endTime = new Date();
        addRow(currentTask, answer, endTime - startTime);
        if(taskArr.length) {
            startTime = endTime;
            document.getElementById('count').innerHTML = 180 - taskArr.length + 1 + " / 180";
            showNextTask();
        }else saveCsv();
    }

}

function showNextTask(){
    var rand = Math.floor(Math.random() * taskArr.length); 

    var nextTask = taskArr.splice(rand, 1)[0];
    var type = nextTask.split("-")[0];

    currentTask = nextTask;
    document.getElementById('mainview').src = "";
    document.getElementById('mainview').src = "img/" + nextTask + ".jpeg";//http://xumaoran.com/GraphComp/

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
            <input type="radio" name="answer" value="Uncertain" />Uncertain`;
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
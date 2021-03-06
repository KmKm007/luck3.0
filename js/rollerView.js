/**
 * Created by Administrator on 2016/2/19.
 */
function RollerView() {
    this.stop = true;
    this.personArray;
    this.index;
    this.rollerBK;
}
RollerView.prototype.turntable = document.getElementById("rollerSpan");
RollerView.prototype.result = document.getElementById('result');
RollerView.prototype.resultTable = document.getElementById("result2-table");
RollerView.prototype.startButton = document.getElementById("startButton")
RollerView.prototype.stopButton = document.getElementById("stopButton");
RollerView.prototype.count = document.getElementById("count");
RollerView.prototype.award = document.getElementById("hContent");
RollerView.prototype.roller = document.getElementById("roller");

RollerView.prototype.init = function(personArray, index, award) {
    this.personArray = personArray;
    this.turntable.innerText = personArray[index];
    document.title = award;
    this.award.innerHTML = award;
    this.initBK();
}

RollerView.prototype.reset = function(personArray) {
    this.personArray = personArray;
}

RollerView.prototype.initBK = function() {
    this.rollerBK = new Array();
    var rollerBK = this.rollerBK;
    rollerBK.push("bk1");
    rollerBK.push("bk2");
    rollerBK.push("bk3");
    rollerBK.push("bk4");
    rollerBK.push("bk5");
}

RollerView.prototype.roll = function(index) {
    var that = this;
    that.index = index;

    function a() {
        that.stop = false;
        that.changeValue();
    }
    return a;
}


RollerView.prototype.changeValue = function() {
    var frame = 40;
    var that = this;
    if (this.stop) {
        return;
    } else {
        this.index++;
        if (this.index == this.personArray.length) {
            this.index = 0;
        }
        this.turntable.innerText = this.personArray[this.index];
        var temp = this.index % 5;
        this.roller.className = this.rollerBK[temp];
        window.setTimeout(function() {
            that.changeValue();
        }, frame);
    }
}

RollerView.prototype.stopRoll = function() {
    this.stop = true;
}

RollerView.prototype.getIndex = function() {
    var index = this.index;
    return index;
}
RollerView.prototype.showResult = function(amount, isSingle, array, nameArray) {
    this.showCommonPrice(amount, isSingle, array, nameArray);
}

RollerView.prototype.showCommonPrice = function(amount, isSingle, array, nameArray) {
    // if (isSingle) {
    //     amount = 1;
    // }
    var className, resultClass, perRow;
    switch (amount) {
        case 50:
            className = 'r50';
            resultClass = 'result50';
            perRow = 5;
            break;
        case 40:
            className = 'r40';
            resultClass = 'result40';
            perRow = 4;
            break;
        case 30:
            className = 'r30';
            resultClass = 'result30';
            perRow = 3;
            break;
        case 20:
          className = 'r20';
          resultClass = 'result20';
          perRow = 5;
          break;
        case 15:
            className = 'r15';
            resultClass = 'result15';
            perRow = 5;
            break;
        case 10:
            className = 'r10';
            resultClass = 'result10';
            perRow = 4;
            break;
        case 6:
            className = 'r3';
            resultClass = 'result3';
            perRow = 2;
            break;
        case 5:
            className = 'r5';
            resultClass = 'result5';
            perRow = 2;
            break;
        case 2:
            className = 'r2';
            resultClass = 'result2';
            perRow = 1;
            break;
        case 1:
            className = 'r4';
            resultClass = 'result4';
            perRow = 1;
            break;
    }
    var result = this.result;
    var table = this.resultTable;
    var tr, td;
    var content;
    result.className = resultClass;
    for (var i = 0, length = array.length; i < length; i++) {
        if (i % perRow == 0) {
            tr = document.createElement("tr");
        }
        td = document.createElement("td");
        td.className = className;
        content = array[i];
        if(nameArray){
          content = content + '(' + nameArray[i] + ')';
        }
        td.innerHTML = content;
        tr.appendChild(td);
        if (i % perRow == (perRow - 1) || i == (array.length - 1)) {
            table.appendChild(tr);
        }
    }
}

RollerView.prototype.showLuckyPrice = function(array) {
    var table = this.resultTable;
    var tr, td, outString;
    tr = document.createElement("tr");
    td = document.createElement("td");
    outString = array[0] + "-" + array[array.length - 1];
    td.innerHTML = outString;
    td.className = "r";
    tr.appendChild(td);
    table.appendChild(tr);
}

RollerView.prototype.showForthPrice = function(array) {
    var table = this.resultTable;
    var tr, td;
    for (var i = 0, length = array.length; i < length; i++) {
        if (i % 4 == 0) {
            tr = document.createElement("tr");
        }
        td = document.createElement("td");
        td.className = "r2";
        td.innerHTML = array[i];
        tr.appendChild(td);
        if (i % 4 == 3 || i == (array.length - 1)) {
            table.appendChild(tr);
        }
    }
}

RollerView.prototype.showThirdPrice = function(array) {
    var table = this.resultTable;
    var tr, td;
    for (var i = 0, length = array.length; i < length; i++) {
        if (i % 2 == 0) {
            tr = document.createElement("tr");
        }
        td = document.createElement("td");
        td.className = "r3";
        td.innerHTML = array[i];
        tr.appendChild(td);
        if (i % 2 == 1 || i == (array.length - 1)) {
            table.appendChild(tr);
        }
    }
}

RollerView.prototype.showSecondPrice = function(array) {
    var table = this.resultTable;
    var tr, td, outString;
    for (var i = 0; i < array.length; i++) {
        tr = document.createElement("tr");
        td = document.createElement("td");
        outString = array[i];
        td.innerHTML = outString;
        td.className = "r";
        tr.appendChild(td);
        table.appendChild(tr);
    }
}

RollerView.prototype.showFirstPrice = function(array) {
    var table = this.resultTable;
    var tr, td, outString;
    tr = document.createElement("tr");
    td = document.createElement("td");
    outString = array[0];
    td.innerHTML = outString;
    td.className = "r";
    tr.appendChild(td);
    table.appendChild(tr);
}

RollerView.prototype.showSpecialPrice = function(array) {
    var table = this.resultTable;
    var tr, td, outString;
    tr = document.createElement("tr");
    td = document.createElement("td");
    outString = array[0];
    td.innerHTML = outString;
    td.className = "r4";
    tr.appendChild(td);
    table.appendChild(tr);
}

RollerView.prototype.showCash3000 = function(array) {
    var table = this.resultTable;
    var tr, td, outString;
    for (var i = 0; i < array.length; i++) {
        tr = document.createElement("tr");
        td = document.createElement("td");
        outString = array[i];
        td.innerHTML = outString;
        td.className = "r5";
        tr.appendChild(td);
        table.appendChild(tr);
    }
}

RollerView.prototype.showCash5000 = function(array) {
    var table = this.resultTable;
    var tr, td;
    for (var i = 0, length = array.length; i < length; i++) {
        if (i % 2 == 0) {
            tr = document.createElement("tr");
        }
        td = document.createElement("td");
        td.className = "r3";
        td.innerHTML = array[i];
        tr.appendChild(td);
        if (i % 2 == 1 || i == (array.length - 1)) {
            table.appendChild(tr);
        }
    }
}

RollerView.prototype.showCash200 = function(array) {
    var table = this.resultTable;
    var tr, td;
    for (var i = 0, length = array.length; i < length; i++) {
        if (i % 4 == 0) {
            tr = document.createElement("tr");
        }
        td = document.createElement("td");
        td.className = "r2";
        td.innerHTML = array[i];
        tr.appendChild(td);
        if (i % 4 == 3 || i == (array.length - 1)) {
            table.appendChild(tr);
        }
    }
}

RollerView.prototype.changeButton = function(flag) {
    if (flag == 0) {
        this.startButton.className = "bottom";
        this.stopButton.className = "top";
    } else if (flag == 1) {
        this.startButton.className = "top";
        this.stopButton.className = "bottom";
    }
}

RollerView.prototype.updateCount = function(count) {
    var last = parseInt(this.count.innerHTML);
    var total = last + count;
    this.count.innerHTML = total;
}

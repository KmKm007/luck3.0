/**
 * Created by Administrator on 2016/2/19.
 */
function RollerModel() {
    this.noWonPersonsList;
    this.luckyList;
    this.nameMap;
    // this.priceType;
    this.index = 0;
    this.flowIndex;
    this.flow;
    this.resultCache = new Array();
    this.award;
    this.retry;
    this.links;
    this.isSendToServer;
}
RollerModel.prototype.init = function(object) {
    this.flowIndex = this.getRequest('index') || '0';
    this.flow = flow[this.flowIndex];
    if(object){
      this.initListFromData(object);
    }else{
      this.initListFromStorage();
    }
    this.initStorage();
    this.initAward();
    this.initLuckyList();
    this.initIndex();
    this.initRetry();
}

RollerModel.prototype.initIndex = function() {
    var isSegment = this.flow.isSegment;
    if (isSegment) {
        this.index = Math.floor(Math.random() * (this.luckyList.length - 1));
    } else {
        this.index = Math.floor(Math.random() * (this.noWonPersonsList.length - 1));
    }
}

RollerModel.prototype.initRetry = function() {
    this.retry = this.getRequest("re");
}

RollerModel.prototype.initAward = function() {
    this.award = this.flow.award;
}

RollerModel.prototype.initLinks = function() {
    this.links = [""];
}

RollerModel.prototype.initListFromStorage = function () {
  var noWonListInStorage = localStorage.getItem("noWonList");
  var noWonListJSON = JSON.parse(noWonListInStorage);
  var noWonList = noWonListJSON.noWon;
  this.noWonPersonsList = noWonList;
  this.nameMap = localStorage.getItem("nameMap");
  if (this.flow.isSegment) {
      this.noWonPersonsList.sort(this.sortNumber);
      this.initLuckyList();

  } else {
      this.noWonPersonsList.sort(this.random);
  }
}

RollerModel.prototype.initListFromData = function (object) {
  this.noWonPersonsList = new Array();
  var manArray = this.noWonPersonsList;
  if (typeof(object) === 'number') {
      var wei = 0;
      for (var w = 0;; w++) {
          if (object / (Math.pow(10, w)) >= 1) {
              wei++;
          } else {
              break;
          }
      }
      for (var i = 1, temp = ""; i <= object; i++) {
          temp = "" + i;
          for (var twei = wei; twei > 1; twei--) {
              if (i < Math.pow(10, twei - 1)) {
                  temp = '0' + temp;
              }
          }
          manArray.push(temp);
          temp = "";
      }
  } else {
      var dataList = object.dataList;
      var nameMap = new Object();
      for (var p in dataList) {
          manArray.push(dataList[p].number);
          nameMap[dataList[p].number] = dataList[p].name;
      }
      this.nameMap = nameMap;
  }
  if (this.flow.isSegment) {
      this.noWonPersonsList.sort(this.sortNumber);
      this.initLuckyList();

  } else {
      this.noWonPersonsList.sort(this.random);
  }
}

RollerModel.prototype.isStorageExist = function () {
    var noWonListInStorage = localStorage.getItem("noWonList");
    return noWonListInStorage ? true : false;
}

RollerModel.prototype.getAward = function() {
    return this.award;
}

RollerModel.prototype.random = function() {
    return Math.random() > .5 ? -1 : 1; //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
}

RollerModel.prototype.initStorage = function() {
    var storageAll = localStorage.getItem("allList");
    if (!storageAll) {
        var json = {
            all: []
        };
        var string = JSON.stringify(json);
        localStorage.setItem("allList", string);
    }
    var storageList = localStorage.getItem("wonList");
    var json;
    if (!storageList) {
        json = {};
    } else {
        json = JSON.parse(storageList);
    }
    for (var i = 0, length = flow.length; i < length; i++) {
        if (!json[i]) {
            json[i] = new Array();
        }
    }

    // console.log(json);
    var jsonString = (JSON.stringify(json));
    localStorage.setItem("wonList", jsonString);
    // console.log(this.noWonPersonsList);
}

//RollerModel.prototype.addWonList = function(index){
//    var person = this.noWonPersonsList[index];
//    var type = this.priceType;
//    if(!type){
//        type = this.priceType;
//    }
//    var storageList = localStorage.getItem("wonList");
//    var wonList = JSON.parse(storageList);
//    var luckyList = wonList[type];
//    luckyList.push(person);
//    wonList[type] = luckyList;
//    localStorage.setItem("wonList",JSON.stringify(wonList));
//    var all = localStorage.getItem("allList");
//    var allList= JSON.parse(all);
//    allList.all.push(person);
//    allList.all.sort(this.sortNumber);
//    localStorage.setItem("allList",JSON.stringify(allList));
//    return true;
//}

RollerModel.prototype.isInList = function(index) {
    var all = localStorage.getItem("allList");
    var allList = JSON.parse(all);
    var list = allList.all;
    var person = this.noWonPersonsList[index];
    // var type = this.priceType;
    for (var i = 0, length = list.length; i < length; i++) {
        var temp = list[i];
        if (person == temp) {
            return true;
        }
        // if (type == "luckyPrice") {
        //     var personsArray = this.noWonPersonsList;
        //     for (var j = index + 1, t = 0; t < 50; t++, j++) {
        //         if (j >= personsArray.length) {
        //             j = 0;
        //         }
        //         if (personsArray[j] == temp) {
        //             return true;
        //         }
        //     }
        // }
    }
    return false;
}


//好像没被调用了
RollerModel.prototype.removeResultInList = function(index) {
    var array;
    if (this.priceType == "luckyPrice") {
        //var delta = this.noWonPersonsList.length - index - 1;
        //if(delta >= 50){
        //    array = this.noWonPersonsList.slice(index,index+50);
        //    this.noWonPersonsList.splice(index,50);
        //}else{
        //    var over = 50 - delta;
        //    array = this.noWonPersonsList.slice(index,delta);
        //    array.concat(this.noWonPersonsList.slice(0,over));
        //    this.noWonPersonsList.splice(index,delta);
        //    this.noWonPersonsList.splice(0,over);
        //}
        var luckyList = this.luckyList;
        var noWonList = this.noWonPersonsList;
        var value = luckyList[index];
        noWonList.sort(this.sortNumber);
        for (var i = 0, length = noWonList.length; i < length; i++) {
            if (noWonList[i] == value) {
                array = noWonList.slice(i, i + 50);
                noWonList.splice(i, 50);
                this.initLuckyList();
                var max = (this.luckyList.length - 1);
                this.index = Math.floor(Math.random() * max);
                break;
            }
        }
        //找出在总名单里对应的50个数
        //for(var i = index,length = this.noWonPersonsList.length; i < length ; i++ ){
        //    if(luckyList[index] == noWonList[i]){
        //        array = noWonList.slice(i,i + 50);
        //        noWonList.splice(i,50);
        //        this.initLuckyList();
        //        var max = (this.luckyList.length-1);
        //        this.index = Math.floor(Math.random() * max);
        //        break;
        //    }
        //}
    } else {
        array = this.noWonPersonsList.slice(index, index + 1);
        this.noWonPersonsList.splice(index, 1);
        var max = (this.noWonPersonsList.length - 1);
        this.index = Math.floor(Math.random() * max);
    }
    this.resultCache = this.resultCache.concat(array);
    return array;
}

RollerModel.prototype.addWonList = function(array) {
    var index = this.flowIndex;
    var storageList = localStorage.getItem("wonList");
    var wonList = JSON.parse(storageList);
    var luckyList = wonList[index];
    luckyList = luckyList.concat(array);
    wonList[index] = luckyList;
    localStorage.setItem("wonList", JSON.stringify(wonList));
    var all = localStorage.getItem("allList");
    var allList = JSON.parse(all);
    allList.all = allList.all.concat(array);
    allList.all.sort(this.sortNumber);
    localStorage.setItem("allList", JSON.stringify(allList));
    return true;
}

RollerModel.prototype.saveNoWonList = function() {
    var json = {
        noWon: this.noWonPersonsList
    }
    var jsonString = JSON.stringify(json);
    localStorage.setItem("noWonList", jsonString);
}


RollerModel.prototype.getRequest = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return (r[2]);
    else {
        return null;
    }
}

RollerModel.prototype.sortNumber = function(a, b) {
    return a - b;
}

RollerModel.prototype.clearResultCache = function() {
    this.resultCache = this.resultCache.splice(0, 0);
}

RollerModel.prototype.initLuckyList = function() {
    var noWonPersonsList = this.noWonPersonsList;
    var luckyList = new Array();
    for (var length = noWonPersonsList.length, i = 0, next49, temp; i < length - 50;) {
        temp = noWonPersonsList[i];
        next49 = noWonPersonsList[i + 49];
        if (next49 - temp == 49) {
            luckyList.push(temp);
        }
        i++;
    }
    luckyList.sort(this.random);
    this.luckyList = luckyList;
}


RollerModel.prototype.getNoWonList = function() {
    if (this.priceType == "luckyPrice") {
        return this.luckyList;
    } else {
        return this.noWonPersonsList;
    }
}

RollerModel.prototype.getNextLink = function() {
    var flowIndex = parseInt(this.flowIndex);
    var nextIndex = flowIndex + 1;
    if (!flow[nextIndex]) {
        alert('抽奖流程已结束！');
        return null;
    }
    uri = 'index.html?index=' + nextIndex;
    return uri;
}

/**
 * Created by KmKm_hxm on 2016/2/19.
 */
function Roller() {
    this.config = config;
    this.partId = null;
}
Roller.prototype.rollerModel = new RollerModel();
Roller.prototype.rollerView = new RollerView();
Roller.prototype.init = function() {
    var a = function (isLoadData) {
      if(isLoadData){
        this.rollerModel.init(data);
      }else{
        this.rollerModel.init();
      }
      var personArray = this.rollerModel.getNoWonList();
      var index = this.rollerModel.index;
      var award = this.rollerModel.award;
      this.rollerView.init(personArray, index, award);
      this.addListener();
    }
    if(this.rollerModel.isStorageExist()){
        a.bind(this)(false);
    }else{
      if(this.config.isLuckListFromServer){
        getLuckyData(a.bind(this));
      }else{
        data = 350;
        a.bind(this)(true);
      }
    }
}

Roller.prototype.addListener = function() {
    var that = this;
    var startButton = document.getElementById("startButton")
    var stopButton = document.getElementById("stopButton");
    var resetButton = document.getElementById("restartButton");
    var nextButton = document.getElementById("nextButton");
    startButton.onclick = function() {
        that.roll();
        that.rollerView.changeButton(0);
    }
    stopButton.onclick = function() {
        that.stop();
        that.rollerView.changeButton(1);
    }
    resetButton.onclick = function() {
        that.toReTry();
    }
    nextButton.onclick = function() {
        var link = that.rollerModel.getNextLink();
        if (link)
            window.location.href = link;
    }
    document.onkeydown = function(e) {
        var code = e.keyCode;
        if (code == 32) {
            if (that.rollerView.stop == true) {
                that.roll();
                that.rollerView.changeButton(0);
            } else {
                that.stop();
                that.rollerView.changeButton(1);
            }
        } else if (code == 13) {
            that.toReTry();
        } else if (code == 39) {
            var link = that.rollerModel.getNextLink();
            if (link)
                window.location.href = link;
        } else if (code == 80) {
            var result = confirm("确定要清空中奖名单吗？")
            var params = {
                code: that.config.code,
                activityId: that.config.activityId
            }
            var url = that.config.url.removeActivityRecords;
            if (result) {
                localStorage.clear();
                $.ajax({
                        url: url,
                        type: 'POST',
                        dataType: 'json',
                        data: params
                    })
                    .done(function() {
                        alert("清除成功");
                    })
                    .fail(function() {
                        console.log("error");
                    })
                    .always(function() {
                        console.log("complete");
                    });
            }
        }
    }

}


Roller.prototype.roll = function() {
    var index = this.getModelIndex();
    this.rollerModel.clearResultCache();
    this.rollerView.roll(index)();
}

Roller.prototype.stop = function() {
    var type = this.rollerModel.priceType;
    var retry = this.rollerModel.retry;
    if (retry == 1) {
        this.stopMultiTimes(1);
    } else {
        var isSingle = this.rollerModel.flow.isSingle;
        var amount = this.rollerModel.flow.amount;
        if (isSingle) {
            this.stopMultiTimes(1);
        } else {
            this.stopMultiTimes(amount);
        }
        // if (type == "cash200") {
        //     this.stopMultiTimes(20);
        // } else if (type == "forthPrice") {
        //     this.stopMultiTimes(30);
        // } else if (type == "thirdPrice") {
        //     this.stopMultiTimes(6);
        // } else if (type == "secondPrice") {
        //     this.stopMultiTimes(2);
        // } else if (type == "firstPrice") {
        //     this.stopMultiTimes(1);
        // } else if (type == "cash5000") {
        //     this.stopMultiTimes(10);
        // } else if (type == "cash3000") {
        //     this.stopMultiTimes(3);
        // } else if (type == "specialPrice") {
        //     this.stopMultiTimes(1);
        // } else if (type == "luckyPrice") {
        //     this.stopForLuckyPrice();
        // }
    }

}

//Roller.prototype.stopRoll = function(){
//    var view = this.rollerView;
//    var model = this.rollerModel;
//    view.stopRoll();
//    var result = view.getIndex();
//    var isInList = model.isInList(result);
//    if(isInList){
//        var that = this;
//        setTimeout(function(){
//            that.roll();
//        },60                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              );
//        setTimeout(function(){
//            that.stopRoll();
//        },300);
//
//    }else{
//        model.addWonList(result);
//    }
//    return;
//}

Roller.prototype.stopRoll = function() {
    var view = this.rollerView;
    view.stopRoll();
    var viewIndex = view.getIndex();
    this.handleData(viewIndex);
    return;
}

Roller.prototype.handleData = function(index) {
    var model = this.rollerModel;
    var removedArray = model.removeResultInList(index);
    model.addWonList(removedArray);
    model.saveNoWonList();
}

Roller.prototype.getModelIndex = function() {
    return this.rollerModel.index;
}

Roller.prototype.stopMultiTimes = function(times) {
    this.stopRoll();
    var max;
    var random;
    for (var i = 1; i < times; i++) {
        max = (this.rollerModel.noWonPersonsList.length - 1);
        random = Math.floor(Math.random() * max);
        this.handleData(random);
    }
    //}
    var flow = this.rollerModel.flow;
    var resultArray = this.rollerModel.resultCache;

    var nameArray = flow.amount <= 2 ? this.getNameArray(resultArray) : null;
    this.rollerView.showResult(flow.amount, flow.isSingle, resultArray, nameArray);
    this.rollerView.updateCount(resultArray.length);
    if (this.config.isSendToServer) {
        var award = this.rollerModel.getAward();
        this.sendToServer(award, resultArray);
    }
}

Roller.prototype.getNameArray = function (resultArray) {
    return this.rollerModel.getNameArray(resultArray);
}

Roller.prototype.stopForLuckyPrice = function() {
    var view = this.rollerView;
    var model = this.rollerModel;
    view.stopRoll();
    var index = view.getIndex();
    var removedArray = model.removeResultInList(index);
    model.addWonList(removedArray);
    model.saveNoWonList();
    view.reset(model.luckyList);
    var resultArray = this.rollerModel.resultCache;
    this.rollerView.showResult(resultArray, this.rollerModel.priceType);
    this.rollerView.updateCount(resultArray.length);
}

Roller.prototype.sendToServer = function(award, winnerList) {
    var _this = this;
    var url = this.config.url.addWinners;
    var winnerMapList = [];
    var tempWinner;
    var nameMap = this.rollerModel.nameMap;
    var tempNumber;
    for (var i in winnerList) {
        tempWinner = new Object();
        tempNumber = winnerList[i];
        tempWinner.number = tempNumber;
        if (nameMap) {
            tempWinner.name = nameMap[tempNumber];
        }
        winnerMapList.push(tempWinner);
    }
    var params = {
        code: this.config.code,
        activityId: this.config.activityId,
        winnerList: winnerMapList,
        award: award
    }
    if (this.partId) {
        params.partId = this.partId;
    }
    $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                paramsJSONString: JSON.stringify(params)
            },
        })
        .done(function(data) {
            _this.partId = data.partId;
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
}

Roller.prototype.toReTry = function() {
    window.location.href += "&re=1";
}

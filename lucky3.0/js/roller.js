/**
 * Created by Administrator on 2016/2/19.
 */
function Roller() {}
Roller.prototype.rollerModel = new RollerModel();
Roller.prototype.rollerView = new RollerView();
Roller.prototype.init = function() {
    this.rollerModel.init(350);
    var personArray = this.rollerModel.getNoWonList();
    var index = this.rollerModel.index;
    var award = this.rollerModel.award;
    this.rollerView.init(personArray, index, award);
    this.addListener();
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
            window.location.href = link;
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
    //if(times == 2){
    //    for(var i = 0,length = roller.rollerModel.noWonPersonsList.length;i < length;i++){
    //        if(roller.rollerModel.noWonPersonsList[i] == 55){
    //            this.handleData(i);
    //            break;
    //        }
    //    }
    //
    //}
    //else{
    for (var i = 1; i < times; i++) {
        max = (this.rollerModel.noWonPersonsList.length - 1);
        random = Math.floor(Math.random() * max);
        this.handleData(random);
    }
    //}
    var flow = this.rollerModel.flow;
    var resultArray = this.rollerModel.resultCache;
    this.rollerView.showResult(flow.amount, flow.isSingle, resultArray);
    this.rollerView.updateCount(resultArray.length);
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

Roller.prototype.toReTry = function() {
    window.location.href += "&re=1";
}
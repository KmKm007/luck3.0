function getLuckyData(callback){
	$.ajax({
		url: 'http://localhost:8888/Authentication/employee/list',
		type: 'GET',
		success: function (result) {
			var data = [];
			var dataList = result.dataList;
			var tempData;
			for(var i = 0,length = dataList.length; i < length; i++){
				tempData = dataList[i];
				data.push({
					name: tempData.name,
					number: tempData.code
				})
			}
			dataFinish = true;
			window.data = {
				dataList: data
			}
			callback(true);
		}
	});
}

var classDataStore = {
};

classDataStore.UUID_LENGTH = 6;

var ClassData = function(data){
	this.pk = data[0];
	this.uuid = data[1];
	this.name = data[2];
	this.owner = data[3];
	this.timestamp = new Date(data[4] * 1000);
	this.description = data[5];
	this.members = data[6];
};

classDataStore.setUIPage = function(page) {
	classDataStore.uipage = page;
};

var classActiveDataList = [
	new ClassData([1, '111111', 'Level 1, Class 1', 'Teacher A', 1410985475, 'This is a one month program for $100', 20]),
	new ClassData([2, '222222', 'Level 1, Class 2', 'Teacher B', 1410085475, 'This is a one week program for $999', 20]),
	new ClassData([3, '333333', 'Level 2, Class 1', 'Teacher C', 1410585475, 'This is a one year program for free', 30]),
	new ClassData([4, '444444', 'Level 3, Class 1', 'Teacher D', 1411585475, 'Welcome to hell<br/><br/><br/><br/><br/><br/>ww', 10])
];

var classPendingDataList = [
];

classDataStore.getActiveDataList = function() {
	dataContext.getClass(function(result, err) {
		console.log(result, err);
	});
	return classActiveDataList;
};

classDataStore.getPendingDataList = function() {
	return classPendingDataList;
};

classDataStore.validateClassUuid = function(uuid) {
	return true;
};

classDataStore.getClassContent = function(uuid, okFunc, errFunc) {
	var data = new ClassData([99, uuid, 'Level new, Class new', 'Teacher new', (new Date()).valueOf(), 'This is a new class', 99]);
	okFunc(data);
};

classDataStore.joinClass = function(uuid, okFunc, errFunc) {
	var data = classDataStore.getClassContent(uuid, function(data) {
		classPendingDataList.push(data);
		classDataStore.uipage.trigger('listchanged', [true]);
		okFunc();
	}, function (err) {
		errFunc(err);
	});
};

classDataStore.activeClass = function(uuid) {
	var n = classPendingDataList.length;
	for (var i = 0; i < n; ++i) {
		var data = classPendingDataList[i];
		if (data.uuid == uuid) {
			classPendingDataList.splice(i, 1);
			data.isActive = true;
			classActiveDataList.push(data);
			classDataStore.uipage.trigger('listchanged', [false]);
			classDataStore.uipage.trigger('listchanged', [true]);
			break;
		}
	}
};

classDataStore.quitClass = function(uuid) {
	var n = classActiveDataList.length;
	for (var i = 0; i < n; ++i) {
		var data = classActiveDataList[i];
		if (data.uuid == uuid) {
			classActiveDataList.splice(i, 1);
			classDataStore.uipage.trigger('listchanged', [false]);
			break;
		}
	}

	n = classPendingDataList.length;
	for (var i = 0; i < n; ++i) {
		var data = classPendingDataList[i];
		if (data.uuid == uuid) {
			classPendingDataList.splice(i, 1);
			classDataStore.uipage.trigger('listchanged', [true]);
			break;
		}
	}
};

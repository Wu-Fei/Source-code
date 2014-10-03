var inboxDataStore = {
};

var InboxData = function(data){
	this.pk = data[0];
	this.timestamp = new Date(data[1] * 1000);
	this.subject = data[2];
	this.content = data[3];
	this.isMarked = data[4];
	this.isRead = data[5];
	this.isPrivate = data[6];

	this.setRead = function() {
		this.isRead = true;
		inboxDataStore.uipage.trigger('listchanged', [this.isPrivate]);
	};
	this.setMarked = function(isMarked) {
		this.isMarked = isMarked;
		inboxDataStore.uipage.trigger('listchanged', [this.isPrivate]);
	};
};

inboxDataStore.setUIPage = function(page) {
	inboxDataStore.uipage = page;
};

var inboxPublicDataList = [
	new InboxData([1, 1410985475, 'You got an assignment from class B1', 'Here is the assignment', false, false, false])
];

var inboxPrivateDataList = [
	new InboxData([2, 1410905475, 'Welcome to class B1', 'Welcome', false, true, true]),
	new InboxData([3, 1410805475, 'You requested to join class B1, pending approval', 'Waiting...', true, true, true])
];

inboxDataStore.getPublicDataList = function() {
	return inboxPublicDataList;
};

inboxDataStore.getPrivateDataList = function() {
	return inboxPrivateDataList;
};

var inboxDataStore = {
};

var InboxData = function(data){
	this.pk = data[0];
	this.timestamp = new Date(data[1] * 1000);
	this.subject = data[2];
	this.content = data[3];
	this.isMarked = data[4];
	this.isRead = data[5];
	this.isNotification = data[6];

	this.setRead = function() {
		this.isRead = true;
		inboxDataStore.uipage.trigger('listchanged', [this.isNotification]);
	};
	this.setMarked = function(isMarked) {
		this.isMarked = isMarked;
		inboxDataStore.uipage.trigger('listchanged', [this.isNotification]);
	};
};

inboxDataStore.setUIPage = function(page) {
	inboxDataStore.uipage = page;
};

var inboxNotificationDataList = [
	new InboxData([1, 1410985475, 'You got an assignment from class B1', 'Here is the assignment', false, false, true])
];

var inboxMessageDataList = [
	new InboxData([2, 1410905475, 'Welcome to class B1', 'Welcome', false, true, false]),
	new InboxData([3, 1410805475, 'You requested to join class B1, pending approval', 'Waiting...', true, true, false])
];

inboxDataStore.getNotificationDataList = function() {
	return inboxNotificationDataList;
};

inboxDataStore.getMessageDataList = function() {
	return inboxMessageDataList;
};

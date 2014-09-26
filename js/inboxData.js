var InboxData = function(data){
	this.pk = data[0];
	this.timestamp = new Date(data[1] * 1000);
	this.subject = data[2];
	this.content = data[3];
	this.isMarked = data[4];
	this.isRead = data[5];

	this.setRead = function() {
		this.isRead = true;
	};
};

var dtStr = function(dt, today) {
	if (!today) {
		today = new Date();
		today.setHours(0, 0, 0, 0);
	}

	var thisday = new Date(dt.valueOf());
	thisday.setHours(0, 0, 0, 0);
	if (thisday.getTime() == today.getTime()) {
		return dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
	} else {
		return thisday.getFullYear() + '/' + (thisday.getMonth() + 1) + '/' + thisday.getDate();
	}
};

var dtFullStr = function(dt) {
	return [
		dt.getFullYear(),
		'/',
		dt.getMonth() + 1,
		'/',
		dt.getDate(),
		' ',
		dt.getHours(),
		':',
		dt.getMinutes(),
		':',
		dt.getSeconds()
	].join('');
};

var inboxList = [
	new InboxData([1, 1410985475, 'You got an assignment from class B1', 'Here is the assignment', false, false]),
	new InboxData([2, 1410905475, 'Welcome to class B1', 'Welcome', false, true]),
	new InboxData([3, 1410805475, 'You requested to join class B1, pending approval', 'Waiting...', true, true])
];


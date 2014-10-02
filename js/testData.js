var testDataStore = {
};

var TestData = function(data){
	this.pk = data[0];
	this.name = data[1];
	this.isRead = data[2];
	this.isExam = data[3];

	this.setRead = function() {
		this.isRead = true;
		testDataStore.uipage.trigger('listchanged');
	};
};

testDataStore.setUIPage = function(page) {
	testDataStore.uipage = page;
};

var testDataList = [
	new TestData([1, '2014 Final Test', false, true]),
	new TestData([2, '2014 Middle Test', true, true]),
	new TestData([3, '1.1 Assignment', true, false]),
	new TestData([4, '1.2 Assignment', true, false]),
	new TestData([5, '2.1 Assignment', true, false]),
	new TestData([6, '2.2 Assignment', true, false]),
	new TestData([7, '2.3 Assignment', true, false]),
	new TestData([8, '3.1 Assignment', true, false])
];

testDataStore.getAll = function() {
	return testDataList;
};


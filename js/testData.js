var testDataStore = {
};

var TestData = function(data){
	this.pk = data[0];
	this.clazz = data[1];
	this.name = data[2];
	this.isRead = data[3];
	this.isExam = data[4];

	this.setRead = function() {
		this.isRead = true;
		testDataStore.uipage.trigger('listchanged', [this.isExam]);
	};
};

testDataStore.setUIPage = function(page) {
	testDataStore.uipage = page;
};

var testAssignmentDataList = [
	new TestData([3, 1, '1.1 Assignment', true, false]),
	new TestData([4, 1, '1.2 Assignment', true, false]),
	new TestData([5, 2, '2.1 Assignment', true, false]),
	new TestData([6, 3, '2.2 Assignment', true, false]),
	new TestData([7, 2, '2.3 Assignment', true, false]),
	new TestData([8, 1, '3.1 Assignment', true, false])
];

var testExamDataList = [
	new TestData([1, 3, '2014 Final Test', false, true]),
	new TestData([2, 1, '2014 Middle Test', true, true])
];

testDataStore.getAssignmentDataList = function() {
	return testAssignmentDataList;
};

testDataStore.getExamDataList = function() {
	return testExamDataList;
};

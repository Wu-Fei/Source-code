
var _localeStrList = {
};

_localeStrList['cn_zh'] = {
	'Login': '登录',
	'Inbox': '邮箱',
	'Test': '测试',
	'Q &amp; A': '答疑',
	'Class': '班级',
	'Settings': '设置',
	'Back': '返回',
	'Prev': '上一个',
	'Next': '下一个',
	'Submit': '递交',
	'Notification': '通知',
	'Message': '私信',
	'Assignment': '作业',
	'Exam': '考题',
	'Login': '登录',
	'Register': '注册',
	'User ID:': '用户名:',
	'Password:': '密码:',
	'Password Confirm:': '确认密码:',
	'Name:': '姓名:',
	'Email:': '电邮地址:',
	'Phone:': '电话号码:',
	'legal conditions and terms': '法定条件和条款',
	'Legal Conditions &amp; Terms': '法定条件和条款',
	'Read legal conditions and terms': '阅读法定条件和条款',
	'By registering, I hereby agree the': '通过注册帐号，我默认同意相关',
	'Listening': '听力',
	'Grammar': '语法',
	'Reading': '阅读',
	'Writing': '写作',
	'True or False': '是非题',
	'Single Choice': '单选题',
	'Multiple Choices': '多选题',
	'Fill Blanks': '填空题',
	'True': '对',
	'False': '错',
	'Score:': '分数：',
	'Raise Question': '提问',
	'Class ...': '班级 ...',
	'Active': '已注册',
	'Pending': '申请中',
	'Join Class': '申请加入',
	'Quit': '退出',
	'Created By:': '创建者:',
	'Created At:': '创建于:',
	'Members:': '成员数:',
	'QR Code': '二维码',
	'Account': '帐户',
	'Language': '语言',
	'Change Details': '更改信息',
	'Change Password': '更改密码',
	'Logout': '退出登录',
	'Failed to login.': '登录失败。',
	'The user name or password is incorrect.': '用户帐号或密码不正确',
	'Invalid user ID.': '用户帐号无效。',
	'Invalid password.': '密码不正确。',
	'Password is not confirmed.': '密码未确认。',
	'Please enter your name.': '请输入您的姓名。',
	'Register user succeeded.': '注册用户成功。',
	'Failed to register user.': '注册用户失败。',
	'Failed to load test content.': '获取题目内容失败。',
	'The test is not completed yet. Do you still want to submit?': '试题没有全部完成。仍然递交答案吗?',
	'Your answer was successfully submitted.': '您的答案已成功递交',
	'Failed to submit. Please check your Internet connection and try again.': '答案递交失败，请检查网络连接，稍后再试。',
	'Sorry, no similar questions were found.': '对不起，没有找到类似问题。',
	'Please choose a class.': '请选择一个班级。',
	'Please enter your question.': '请填写问题内容。',
	'Failed to send your question. Please check your Internet connection and try again.': '问题发送失败，请检查网络连接，稍后再试。',
	'Sorry, you entered an invalid class registration code.': '对不起，您输入了无效的班级注册码。',
	'Sorry, you captured an invalid class registration QR code.': '对不起，您扫描的二维班级注册码无效。',
	'Failed to capture QR code, please try again.': '对不起，扫描二维班级码失败，请再试一次。',
	'The class registration code is invalid.': '输入的班级注册码无效。',
	'You have successfully joined a new class.': '您成功加入了一个新班级。',
	'Sorry, failed to join the class.': '对不起，加入班级申请失败。',
	'Are you sure you want to quit from this class?': '您确定要退出这个班级吗?',
	'Are you sure you want to logout?': '您确定要退出登录吗?'

};

_localeStrList['fr_fr'] = {
    'Inbox': 'Inbox',
    'Test': 'Test',
    'Q &amp; A': 'Q &amp; A',
    'Back': 'Retourner',
    'Submit': 'Soumettre',
    'Raise Question': 'Poser une question',
    'Sorry, no similar questions were found.': 'Désole，réponse non-trouvée.',
    'Please enter your question.': 'Replissez votre question',
    'Failed to send your question. Please check your Internet connection and try again.': 'Envoi echoue，merci de verifiez la connexion internet et reessayer。'

};

var _localeLangeCode = '';
var _localeLang = [];

var getLocale = function(s) {
	return _localeLang[s] || s;
}

var localize = function(e, s) {
	e.addClass('lang').data('lang', s).html(_localeLang[s] || s);
}

var localizeAll = function(e) {
	e.find('.lang').each(function() {
		var self = $(this);
		var s = self.html();
		self.data('lang', s).html(_localeLang[s] || s);
	});
}

var getLocaleLanguage = function() {
	return _localeLangeCode;
}

var setLocaleLanguage = function(lang) {
	_localeLang = _localeStrList[_localeLangeCode = lang] || [];

	$('.lang').each(function() {
		var self = $(this);
		var s = self.data('lang');
		self.html(_localeLang[s] || s);
	});
};


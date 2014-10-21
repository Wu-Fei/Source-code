var DataContext = function DataContext() {
    //var host = 'http://eclasso2o.azurewebsites.net';
    var host = 'http://localhost:56360'
    var dataurl = host + '/breeze/eClassO2OApi';
    
    var manager = new breeze.EntityManager(dataurl);
    var connection = true;
    var user;
    var islocal = false;
    var isconnected = true;
    var datacontext = {
        signin: signin,
        register: register,
        configureBreeze: configureBreeze,
        setAccessToken: setAccessToken,
        getAccessToken: getAccessToken,
        user: user,
        connection: connection,
        getClass: getClass
    }
    return datacontext;
    function signin(username, password) {
        //var rst;
        if (!getAccessToken()) {
            return $.post(host + '/token',
                {
                    grant_type: 'password',
                    username: username,
                    password: password
                })

        };
    }

    function register(username, password, name, email, phone)
    {
        return $.ajax({
            url: host + '/api/account/register',
            type: 'POST',
            dataType: 'json',
            data: {
                'userName': username,
                'password': password,
                'confirmPassword': password,
                'name': name,
                'email': email,
                'phone': phone
            }
        });
    }

    function configureBreeze() {
        breeze.NamingConvention.camelCase.setAsDefault();
        var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
        ajaxAdapter.defaultSettings = {
            beforeSend: function (xhr, settings) {
                if (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + getAccessToken());
                }
            }
        }
    }
    function setAccessToken(accessToken) {
        sessionStorage.setItem("accessToken", accessToken);
    };

    function getAccessToken() {
        return sessionStorage.getItem("accessToken");
    };

    function getClass() {
        var query = breeze.EntityQuery
                    .from("Classes");
        return manager.executeQuery(query);
    }
};

var data = new DataContext();
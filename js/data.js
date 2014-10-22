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
        create:create,
        save: save,
        getClass: getClass,
        getQuestion: getQuestion,
        rollback: rejectChanges
    }
    return datacontext;

    function save(entity, area) {
        var baseQ = getBaseQuery(area);
        currentmanager.attachEntity(model(), model().entityAspect.entityState);
        return currentmanager.saveChanges();
    }

    function rejectChanges() {
        manager.rejectChanges();
    }

    function signin(username, password,callback) {
        //var rst;
        if (!getAccessToken()) {
            return $.post(host + '/token',
                {
                    grant_type: 'password',
                    username: username,
                    password: password
                }).done(function (result) {
                    if (result.access_token) {
                        data.setAccessToken(result.access_token);
                        data.configureBreeze();
                        getCurrentUser(callback);
                    }
                    else {
                        callback(result);
                    }
                }).fail(function(result) {callback(result)});

        };
    }

    function create(modelname) {
        var result = manager.createEntity(modelname);
        return result;
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
                'phone': phone,
                'role': 'S'
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

    function getCurrentUser(callback) {
        var query = breeze.EntityQuery.from("currentUser");
        manager.executeQuery(query).then
            (function (result) {
                user = result.results[0];
                callback()
            });
    }

    function getClass() {
        var query = breeze.EntityQuery
                    .from("Classes");
        return manager.executeQuery(query);
    }

    function getQuestion() {
        var query = breeze.EntityQuery
                    .from("Questions");
        return manager.executeQuery(query);
    }


};

var data = new DataContext();
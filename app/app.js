var myTodoApp = angular.module('myTodoApp',[]);

/*myTodoApp.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider){
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/home',{
            templateUrl: 'views/home.html'
        })
        .when('/tasks',{
            templateUrl: 'views/tasks.html',
            controller:'TodoController'
        })
        .otherwise({
            redirectTo: '/home'
        })
}]);*/


myTodoApp.controller('TodoController',['$scope','$http',function($scope,$http){
    $http.get('http://ngtasktracker.herokuapp.com/identity').
        then(function(respon){
            $scope.user = respon.data;
            $http.post('http://ngtasktracker.herokuapp.com/api/user/',$scope.user).
                then(function(response) {
                    $scope.tasks =[];
                    $scope.historytasks=[];
                    var dt = new Date();
                    var dtstr= dt.getDate()+ "/" +(dt.getMonth() +1)   + "/" + dt.getFullYear()
                    response.data.forEach(function(task){
                        var sttime = task.start.split(":");
                        var entime = task.end.split(":");
                        //console.log(sttime);
                        var newtask = {
                            _id: task._id,
                            text: task.text,
                            starthour: parseInt(sttime[0]),
                            startmin: parseInt(sttime[1]),
                            endhour: parseInt(entime[0]),
                            endmin: parseInt(entime[1]),
                            date:task.date,
                            user_id:task.user_id
                        };
                        console.log(newtask);
                        if(dtstr == newtask.date){
                            $scope.tasks.push(newtask);
                        }
                        else{
                            $scope.historytasks.push(newtask);
                        }
                        });
            });
            /*$http.get('http://localhost:3000/api/').
                then(function(response) {

                    $scope.tasks =[];
                    $scope.historytasks=[];
                    var dt = new Date();
                    var dtstr= dt.getDate()+ "/" +(dt.getMonth() +1)   + "/" + dt.getFullYear()
                    response.data.forEach(function(task){
                        var sttime = task.start.split(":");
                        var entime = task.end.split(":");
                        //console.log(sttime);
                        var newtask = {
                            _id: task._id,
                            text: task.text,
                            starthour: parseInt(sttime[0]),
                            startmin: parseInt(sttime[1]),
                            endhour: parseInt(entime[0]),
                            endmin: parseInt(entime[1]),
                            date:task.date,
                            
                        };
                        console.log(newtask);
                        if(dtstr == newtask.date){
                            $scope.tasks.push(newtask);
                        }
                        else{
                            $scope.historytasks.push(newtask);
                        }
                        
                    });*/
           // $scope.tasks = response.data;
    });

   

    $scope.editedText=function(task){
        task.editing = false;
        var sttime = task.starthour.toString().padStart(2,"0")+":"+task.startmin.toString().padStart(2,"0");
        var endtime = task.endhour.toString().padStart(2,"0")+":"+task.endmin.toString().padStart(2,"0");
        var itemtoadd={
            _id:task._id,
            text: task.text,
            start: sttime,
            end: endtime,
            date: task.date,
            user_id: task.user_id
            
        };

        $http.put('http://ngtasktracker.herokuapp.com/api/'+task._id,itemtoadd).
            then(function(response) {
                
        });
        
    }
    $scope.editTask= function(task){
        task.editing = true;
        
    }

    $scope.removeTask = function(task){
        $http.delete('http://ngtasktracker.herokuapp.com/api/'+task._id).
            then(function(response) {
               var removedTaskIndex = $scope.tasks.indexOf(task);
               $scope.tasks.splice(removedTaskIndex, 1);
        });
        
    }
    $scope.addTask = function(){
        var dt = new Date();
        var sttime = $scope.newtask.starthour.toString().padStart(2,"0")+":"+$scope.newtask.startmin.toString().padStart(2,"0");
        var endtime = $scope.newtask.endhour.toString().padStart(2,"0")+":"+$scope.newtask.endmin.toString().padStart(2,"0");
        var itemtoadd={
            text: $scope.newtask.text,
            start: sttime,
            end: endtime,
            date: dt.getDate()+ "/" +(dt.getMonth() +1)   + "/" + dt.getFullYear(),
            user_id: $scope.user._id
            
        };
        var itemtopush={
            text: $scope.newtask.text,
            starthour: $scope.newtask.starthour,
            startmin:  $scope.newtask.startmin,
            endhour: $scope.newtask.endhour,
            endmin:  $scope.newtask.endmin,
            date: dt.getDate()+ "/" +(dt.getMonth() +1)   + "/" + dt.getFullYear(),
            user_id: $scope.user._id
        }
        //console.log(itemtoadd);
        $http.post('http://ngtasktracker.herokuapp.com/api/',itemtoadd).
            then(function(response) {
                $scope.tasks.push(itemtopush);
        });
        //console.log(itemtoadd);
        
        $scope.newtask.text="";
        $scope.newtask.starthour="";
        $scope.newtask.startmin="";
        $scope.newtask.endhour="";
        $scope.newtask.endmin="";

    }
    


    
    

    
}]);
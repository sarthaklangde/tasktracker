var myTodoApp = angular.module('myTodoApp',['ngRoute']);

myTodoApp.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider){
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
}]);


myTodoApp.controller('TodoController',['$scope','$http',function($scope,$http){
    
    $scope.editedText=function(task){
        task.editing = false;
        var sttime = task.starthour.toString().padStart(2,"0")+":"+task.startmin.toString().padStart(2,"0");
        var endtime = task.endhour.toString().padStart(2,"0")+":"+task.endmin.toString().padStart(2,"0");
        var itemtoadd={
            _id:task._id,
            text: task.text,
            start: sttime,
            end: endtime,
            date: task.date
            
        };

        $http.put('http://localhost:3000/api/'+task._id,itemtoadd).
            then(function(response) {
                
        });
        
    }
    $scope.editTask= function(task){
        task.editing = true;
        
    }

    $scope.removeTask = function(task){
        $http.delete('http://localhost:3000/api/'+task._id).
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
            date: dt.getDate()+ "/" +(dt.getMonth() +1)   + "/" + dt.getFullYear()
            
        };
        
        console.log(itemtoadd);
        $http.post('http://localhost:3000/api/',itemtoadd).
            then(function(response) {
                $scope.tasks.push(itemtoadd);
        });
        //console.log(itemtoadd);
        
        $scope.newtask.text="";
        $scope.newtask.starthour="";
        $scope.newtask.startmin="";
        $scope.newtask.endhour="";
        $scope.newtask.endmin="";

    }

    $http.get('http://localhost:3000/api/').
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
                if(dtstr == newtask.date){
                    $scope.tasks.push(newtask);
                }
                else{
                    $scope.historytasks.push(newtask);
                }
                
            });
           // $scope.tasks = response.data;
    });
    
    

    
}]);
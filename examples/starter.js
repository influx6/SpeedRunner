var sp = SpeedRunner.init("SampleTest","Speed Runner Basic Test");

//report and exec will throw errors out on browser if there is no tests or if test 
//have not being executed yet
sp.report();
sp.exec();

//adding test to sp to execute

sp.addSpeedTests({
   slap: { 
           "desc":"simple function calling console.log",
           "fn": function(){ console.log("calling slap");}
      },
   desker: { 
           "desc":"simple function calling console.log 5 times",
           "fn": function(){ var i =100000;  while(i--){console.log("calling slap");}}
      },
   throttle: {
           "desc":"a function that requires arguments",
           "fn": function(name,place) { console.log("Accepted:",name,"Location:",place); },
           "args":["alex","lagos"]
      }
});

//to execute all tests
sp.exec();

//to display reports on tests
sp.report();

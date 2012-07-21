var SpeedRunner = (function(global){

   var su = global.Stubs.SU;

   //local push copy frequently used function
   
   var _ = {};
   _.proxy = su.proxy;
   _.pusher = Array.prototype.push;
   _.explode = su.explodeObject;

   _.createReportFragment = function(name,desc,start,end,elapse){
       return {
            name:name,
            description:desc,
            starttime:start,
            endtime:end,
            elapsetime:elapse+" milliseconds"
       };
   };
   
   _.speedFunctionWrapper = function(report,name,desc,fn,args){
     return function(){
         var starttime = new Date();
         fn.apply(this,args);
         var endtime = new Date();
         var elapse = endtime.getTime() - starttime.getTime();
         report[name] = _.createReportFragment(name,desc,starttime,endtime,elapse);
      };
   };

   //accepts three arguments
   // 1. the object containing all the tests to be created
   // 2. the store object to store all the Test
   // 3. the report object to store all reports to
   
   _.extendTests = function(suit,store,report){
         if(!su.matchType(suit,"object")) return;

         su.onEach(suit,function(e,i,b){
              if(!e.desc || !e.fn){ throw new Error("Test Objects are not following convection! Please Rectify");}
              if(!e.args){  e.args = []; }
              if(!su.isArray(e.args)){ e.args = [e.args];}
              var g = _.speedFunctionWrapper(report,i,e.desc,e.fn,e.args);
              _.pusher.call(store,g);
         });
   };


   var SpeedTester = function(name,desc){
      this.name = name;
      this.desc = desc;
      this.isRunned = false;
   };
   su.extends(SpeedTester.prototype,{

      _generatedTests: {
         length:0
      },

      _generatedReports:{},

      exec: function(){
         if(this._generatedTests.length == 0){
            console.error("No Tests Available for execution,add some first!");
            return;
         }
         su.explode(this._generatedReports);
         su.onEach(this._generatedTests,function(e,i,b){
               e();
         });
         this.isRunned = true;
      },

      //addSpeedTests requires 3 arguments
      //1. an object literal containing all test to be runned 
      //2. a object literal containing any possible list of arguments to be
           //passed to the methods like a fixtures/mockdata
           
      addSpeedTests: function(testlist){
         if(!su.matchType(testlist,"object")) return;
         _.extendTests(testlist,this._generatedTests,this._generatedReports);
      },

      // generates a short report on the status
      report: function(){
         if(!this.isRunned){ console.error("Tests have not being executed yet, Please execute them first!"); return;}

         console.log("Reporting",this.name,"Results");
         console.log("Description:",this.desc);
         su.onEach(this._generatedReports, function(e,i,b){
               console.log("\n");
               console.log("I Have Tested:",e.name);
               console.log("Test Started:",e.starttime);
               console.log("Test Ended:",e.endtime);
               console.log("Time Taken to Execute:",e.elapsetime);
         });
      }
   });
   
   return {
      init: function(name,desc){
         return new SpeedTester(name,desc);
      }
      
   }
}(window));

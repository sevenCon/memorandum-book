var calender = {
        dataCalender:{
            now:{
                year:2017,
                month:2,
                monthString: "02"
            },
            monthDate:[
            ]
        },
        remindEvents:[
            {
                time:"2017-1-2 10:20",
                eventName:["高三二班上课"]
            },
            {
                time:"2017-1-2 12:30",
                eventName:["高三二班考试"]
            }
        ]
        ,
        // mode :-1 上一个月， mode:1 下一个月， mode:0 本月
        changeMonthData:function(mode){
            switch(mode){
                case -1:
                    var isFirstMonth = vm.dataCalender.now.month == 1? true : false;
                    isFirstMonth && vm.dataCalender.now.year--,
                    isFirstMonth && (vm.dataCalender.now.month = 12) || vm.dataCalender.now.month--;
                    break;
                case 1:
                    var isLastMonth = vm.dataCalender.now.month == 12? true : false;
                    isLastMonth && vm.dataCalender.now.year++,
                    isLastMonth && (vm.dataCalender.now.month = 1) || vm.dataCalender.now.month++;
                    break;
                case 0:
                    vm.dataCalender.now.year = new Date().getFullYear();
                    vm.dataCalender.now.month = new Date().getMonth()+1;
                    break;
            }

            var _montoString = vm.dataCalender.now.month.toString();
            vm.dataCalender.now.monthString = _montoString.length == 1 && '0' + _montoString || _montoString;
        },
        initialMonthDate:function(){

            var _year = vm.dataCalender.now.year,
                lastYear = _year - 1,
                nextYear = _year + 1,
                _mouth = vm.dataCalender.now.month,
                _monthString = _mouth.toString().length == 1 && '0' + _mouth || _mouth.toString(),
                
                lastMonth = { // 上一个月的信息
                    month: _mouth - 1 == 0 ? 12 :_mouth-1,
                    isLastYear: _mouth-1 == 0 ? true : false
                },
                nextMonth = { // 下一个月的信息
                    month: _mouth + 1 == 13 ? 1 :_mouth + 1,
                    isNextYear: _mouth+1 == 13 ? true : false
                };

            vm.dataCalender.now.year = _year;
            vm.dataCalender.now.month = _mouth;
            vm.dataCalender.now.monthString = _monthString;

            _days = getDatesInMonth(_year,_mouth);

            var lastMonthDates = getDatesInMonth(lastMonth.isLastYear?lastYear:_year,lastMonth.month); // 上一个月有多少天
            var nextMonthDates = getDatesInMonth(nextMonth.isLastYear?nextYear:_year,nextMonth.month); // 下一个月有多少天

            var firsDateInWeek = new Date(_year+"-"+_monthString+"-01").getDay(),
                lastDateInWeek = new Date(_year+"-"+_monthString+"-"+_days).getDay(),
                lastMonthNeeded = firsDateInWeek,
                nextMonthNeeded = lastDateInWeek == 6 && 7 || 7 - 1 - lastDateInWeek;
            
            // 前补齐的number列表,[1,2] 格式，数字
            var preDaysNum = lastMonthNeeded && Object.keys(Array.apply(null, {length: lastMonthDates + 1})).slice(-lastMonthNeeded).map(function(item){
                return {m:lastMonth.month,date:+item,events:[{time:"10-30",eventName:"上课"},{time:"11-30",eventName:"下课"}]};
            }) ||[]; 

            var thisMonthDaysNum = Object.keys(Array.apply(null, {length: _days + 1})).slice(1).map(function(item){
                return {m:_mouth,date:+item};
            }); 
            // 后补齐的number列表
            var subDaysNum = Object.keys(Array.apply(null, {length: nextMonthNeeded + 1})).slice(1, nextMonthNeeded+1).map(function(item){
                return {m:nextMonth.month,date:+item};
            }); 
            var _allDays = preDaysNum.concat(thisMonthDaysNum,subDaysNum);

            vm.dataCalender.monthDate = group(_allDays,7);

            console.log("前补齐number",vm.dataCalender.monthDate);

            // 判断天数是否缺一行，一共6行
            var isLess = vm.dataCalender.monthDate.length < 6 && true;
            if(isLess){
                var lessDates =[];
                var lastObjMonth =  subDaysNum[nextMonthNeeded-1].m;
                var lastObjDate =  subDaysNum[nextMonthNeeded-1].date;
                lessDates = Object.keys(Array.apply(null,{length:lastObjDate + 7 + 1})).slice(lastObjDate+1).map(function(item){
                    return {m:lastObjMonth,date:+item};
                });
                vm.dataCalender.monthDate.push(lessDates);
            }

        },
        initNextMonth:function(){
            vm.changeMonthData(1);
            vm.initialMonthDate();
        },
        initLastMonth:function(){
            vm.changeMonthData(-1);
            vm.initialMonthDate();
        },
        cheakEvent:function(element,elem){
            var _element = element.time.split('-');
            return  elem.m == element.time.split('-')[1] &&
                    dataCalender.now.year == element.time.split('-')[0] && 
                    elem.date == element.time.split('-')[2];
        },
        $opts:{
            type:2
        },
    };
    
    // 根据年月获取该月的天数
    function getDatesInMonth(year,_mouth){
        var _days;
        // 当前月的天数
        if(_mouth == 2){
            _days= year % 4 == 0 ? 29 : 28;
        }
        else if(_mouth == 1 || _mouth == 3 || _mouth == 5 || _mouth == 7 || _mouth == 8 || _mouth == 10 || _mouth == 12){
            //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31
            _days= 31;
        }
        else{
            //其他月份，天数为：30.
            _days= 30;
        }
        return _days;
    }
    // 数组分组方法
    function group(arr, num){
      num = num*1 || 1;
      var ret = [];
      arr.forEach(function(item, i){
        if(i % num === 0){
          ret.push([]);
        }
        ret[ret.length - 1].push(item);
      });
      return ret;
    }
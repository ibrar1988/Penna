angular.module('pennaApp').controller('myperformancectrl', function ($scope, $rootScope, $uibModal, $log, $state, $window, ctrlComm, request) {
    var doughnutOptions = {
        segmentShowStroke: true,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2,
        "paletteColors": "#feca08,#555555,#42cbfd,#c0c0c1",
        percentageInnerCutout: 85,
        animation: true,
        animationSteps: 100,
        animationEasing: "easeOutBounce",
        animateRotate: true,
        animateScale: true,
        onAnimationComplete: function () {}
    }

    function getOutStandingCreditDetails(cb) {
        $scope.netWork(function (status) {
            if (status) {
                $scope.loader(true);
                request.service('getODOS', 'post', $scope.currUser, function (res) {
                    $scope.loader(false);
                    $scope.out_stand = res;
                    request.setObj('outstanding', $scope.out_stand.CreditLimit[0]);
                    if ($scope.ifMobile) {
                        $scope.getOfflineDataFromLocal('performance', function (data) {
                            if (!data)
                                data = {}
                            data.odos = res
                            $scope.addOfflineDataInLocal('performance', data, function () {
                                if (cb) cb();
                            });
                        });
                    } else {
                        if (cb) cb();
                    }
                });
            } else {
                $scope.getOfflineDataFromLocal('performance', function (data) {
                    $rootScope.safeApply(function () {
                        if (data) {
                            if (data.odos) {
                                $scope.out_stand = data.odos;
                                request.setObj('outstanding', $scope.out_stand.CreditLimit[0]);
                            }
                            if (data.performance) {
                                assignPerformance(data.performance);
                                applySecondMonthPerformance(data.performance);
                                applythirdMonthPerformance(data.performance);
                                applyFirstQuart(data.performance);
                                applySecondQuart(data.performance);
                                applythridQuart(data.performance);
                                applyFirstYear(data.performance);
                                applySecondYear(data.performance);
                                applythridYear(data.performance);
                            }
                        }
                    });
                });
            }
        });
    }

    getOutStandingCreditDetails(function () {
        getMyPerformance(function () {
            myperformancemonth(function () {
                myperformancethridmonth(function () {
                    myperformancequart(function () {
                        myperformance_quart(function () {
                            myperformance_thridquart(function () {
                                myperformanceyearly(function () {
                                    myperformance_yearly(function () {
                                        myperformance_thridyearly()
                                        $scope.loader(false);
                                    })
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    var newColors = {
        OPC43: '#feca08',
        PSC: '#42cbfd',
        PPC: '#c0c0c1',
        OPC53: '#555555'
    }


    function getMyPerformance(cb) {
        $scope.netWork(function (status) {
            if (status) {
                // $scope.loader(true);
                request.service('myPerformance', 'post', $scope.currUser, function (res) {
                    // $scope.loader(false);
                    $scope.res_myPerformance = res;


                    if (res.statusCode == 200) {
                        if (res.Payments_Month) {
                            if ($scope.ifMobile) {
                                $scope.getOfflineDataFromLocal('performance', function (data) {
                                    $rootScope.safeApply(function () {
                                        data.performance = angular.copy(res);
                                        $scope.addOfflineDataInLocal('performance', data);
                                        assignPerformance(res);
                                    })
                                });
                            } else {
                                assignPerformance(res);
                            }
                        }
                    } else if (res.dupLogin) {
                        $scope.logout();
                    }
                    if (cb) cb();
                });
            }
        });
    }

    function assignPerformance(res) {
        $scope.outStanding = request.getObj('outstanding');
        if ($scope.outStanding) {
            $scope.CreditDetails_Month1 = $scope.outStanding.CreditDetails_Month1.creditLimit;
        }

        $scope.months = {};
        for (m in res.Sales_Month) {
            angular.forEach(res.Sales_Month[m], function (k, v) {
                res.Sales_Month[m].monthName = v.split('_').join(' ');
                res.Sales_Month[m].monthVal = k
            })
        }
        for (m in res.Payments_Month) {
            angular.forEach(res.Payments_Month[m], function (k, v) {
                res.Payments_Month[m].monthName = v.split('_').join(' ');
                res.Payments_Month[m].monthVal = k
            })
        }

        $scope.months.sales = res.Sales_Month;
        $scope.months.payment = res.Payments_Month;

        //product mix -----------------
        $scope.ProductMix_Month = res.ProductMix_Month;

        $scope.product = [];
        $scope.datas66 = [];


        if ($scope.ProductMix_Month) {


            $scope.month_prolist = $scope.ProductMix_Month[0].Month;

            for (k = 0; k < $scope.month_prolist.length; k++) {


                var pro_name = $scope.month_prolist[k].ProdName;
                $scope.product.push(pro_name);


                var product_data = $scope.month_prolist[k][pro_name][0];
                var value_pp = Object.keys(product_data);
                var final_value = Number($scope.rounddata(product_data[value_pp]));
                final_value = ( final_value * 10 ) / 10;
                $scope.datas66.push({
                    label: pro_name,
                    value: final_value,
                    color: newColors[$scope.month_prolist[k].ProdName],
                });
            }

            $scope.total_quanty = $scope.datas66[0].value + $scope.datas66[1].value + $scope.datas66[2].value + $scope.datas66[3].value;

        }



        if (document.getElementById("doughnutChart"))
            var ctx = document.getElementById("doughnutChart").getContext("2d");
        var mydoughnutChart = new Chart(ctx).Doughnut($scope.datas66, doughnutOptions);
    }

    // Second Month
    function myperformancemonth(cb) {
        // $scope.loader(true);
        /*request.service('myPerformance', 'post', $scope.currUser, function (res) {*/
        // $scope.loader(false);
        if ($scope.res_myPerformance.statusCode == 200) {
            applySecondMonthPerformance($scope.res_myPerformance);
            if (cb) cb();
        } else if ($scope.res_myPerformance.dupLogin) {
            $scope.logout();
        }

        /* });*/
    }

    function applySecondMonthPerformance(res) {
        $scope.outStanding = request.getObj('outstanding');
        if ($scope.outStanding)
            $scope.CreditDetails_Month2 = $scope.outStanding.CreditDetails_Month2.creditLimit;
        //month sales---------------
        $scope.month2 = res.Sales_Month;
        if ($scope.month2) {
            for (i = 0; i < $scope.month2.length; i++) {
                $scope.present_month2 = $scope.month2;
            }
            var value_pp = Object.keys($scope.present_month2[1])[0];
            var myarray = value_pp.split('_');

            for (var i = 0; i < myarray.length; i++) {
                $scope.month02 = myarray[0];
                $scope.year02 = myarray[1];
            }
        }


        $scope.Payments2 = res.Payments_Month;
        if ($scope.Payments2) {
            for (j = 0; j < $scope.Payments2.length; j++) {
                var keys2 = Object.keys($scope.Payments2[1]);
                $scope.value_payment2 = $scope.Payments2[1][keys2];
            }
        }


        //product mix -----------------
        $scope.ProductMix_Month = res.ProductMix_Month;

        $scope.product = [];
        $scope.datas77 = [];



        if ($scope.ProductMix_Month) {


            $scope.month_prolist = $scope.ProductMix_Month[0].Month;



            for (k = 0; k < $scope.month_prolist.length; k++) {


                var pro_name = $scope.month_prolist[k].ProdName;
                $scope.product.push(pro_name);


                var product_data = $scope.month_prolist[k][pro_name][1];
                var value_pp = Object.keys(product_data);
                var final_value =Number($scope.rounddata(product_data[value_pp]));

                final_value = ( final_value * 10 ) / 10;

                $scope.datas77.push({
                    label: pro_name,
                    value: final_value,
                    color: newColors[$scope.month_prolist[k].ProdName],
                    //highlight: colors[r].highlight
                });



            }

            $scope.total_quanty1 = $scope.datas77[0].value + $scope.datas77[1].value + $scope.datas77[2].value + $scope.datas77[3].value;
        }




        if (document.getElementById("doughnutChart1"))
            var ctx = document.getElementById("doughnutChart1").getContext("2d");
        var mydoughnutChart = new Chart(ctx).Doughnut($scope.datas77, doughnutOptions);
    }
    //3rd month   

    function myperformancethridmonth(cb) {
        // $scope.loader(true);
        /*request.service('myPerformance', 'post', $scope.currUser, function (res) {*/
        // $scope.loader(false);
        if ($scope.res_myPerformance.statusCode == 200) {
            applythirdMonthPerformance($scope.res_myPerformance);
            if (cb) cb()
        } else if ($scope.res_myPerformance.dupLogin) {
            $scope.logout();
        }

        /*});*/
    }

    function applythirdMonthPerformance(res) {
        $scope.outStanding = request.getObj('outstanding');
        if ($scope.outStanding)
            $scope.CreditDetails_Month3 = $scope.outStanding.CreditDetails_Month3.creditLimit;

        //month sales---------------
        $scope.month3 = res.Sales_Month;
        if ($scope.month3) {
            for (i = 0; i < $scope.month3.length; i++) {
                $scope.present_month3 = $scope.month3;
            }
            var value_pp = Object.keys($scope.present_month3[2])[0];
            var myarray = value_pp.split('_');

            for (var i = 0; i < myarray.length; i++) {
                $scope.month003 = myarray[0];
                $scope.year003 = myarray[1];
            }
        }


        $scope.Payments3 = res.Payments_Month;
        if ($scope.Payments3) {
            for (j = 0; j < $scope.Payments3.length; j++) {
                var keys3 = Object.keys($scope.Payments3[2]);
                $scope.value_payment03 = $scope.Payments3[2][keys3];
            }
        }


        //product mix -----------------
        $scope.ProductMix_Month = res.ProductMix_Month;

        $scope.product = [];
        $scope.datas177 = [];



        if ($scope.ProductMix_Month) {


            $scope.month_prolist = $scope.ProductMix_Month[0].Month;



            for (k = 0; k < $scope.month_prolist.length; k++) {


                var pro_name = $scope.month_prolist[k].ProdName;
                $scope.product.push(pro_name);


                var product_data = $scope.month_prolist[k][pro_name][2];
                var value_pp = Object.keys(product_data);
                var final_value = Number($scope.rounddata(product_data[value_pp]));

                final_value = ( final_value * 10 ) / 10;

                $scope.datas177.push({
                    label: pro_name,
                    value: final_value,
                    color: newColors[$scope.month_prolist[k].ProdName],
                    //highlight: colors[r].highlight
                });


            }
            $scope.total_quanty2 = $scope.datas177[0].value + $scope.datas177[1].value + $scope.datas177[2].value + $scope.datas177[3].value;

        }



        if (document.getElementById("doughnutChart11"))
            var ctx = document.getElementById("doughnutChart11").getContext("2d");
        var mydoughnutChart = new Chart(ctx).Doughnut($scope.datas177, doughnutOptions);
    }






    // First Quart
    function myperformancequart(cb) {
        // $scope.loader(true)
        /*request.service('myPerformance', 'post', $scope.currUser, function (res) {*/
        // $scope.loader(false);
        if ($scope.res_myPerformance.statusCode == 200) {
            applyFirstQuart($scope.res_myPerformance)
            if (cb) cb();
        } else if ($scope.res_myPerformance.dupLogin) {
            $scope.logout();
        }

        /* });*/
    }

    function applyFirstQuart(res) {
        $scope.outStanding = request.getObj('outstanding');

        if ($scope.outStanding)
            $scope.CreditDetails_Quarter1 = $scope.outStanding.CreditDetails_Quarter1.creditLimit;
        $scope.quarter1 = res.Sales_Quarter;
        if ($scope.quarter1) {
            for (i = 0; i < $scope.quarter1.length; i++) {
                $scope.present_quarter1 = $scope.quarter1;
            }
            var value_pp = Object.keys($scope.present_quarter1[0])[0];
            var myarray = value_pp.split('_');
            for (var i = 0; i < myarray.length; i++) {
                $scope.month03 = myarray[0];
                $scope.year03 = myarray[1];
                $scope.qyear03 = myarray[2];
            }
        }

        $scope.Payments3 = res.Payments_Quarter;
        if ($scope.Payments3) {
            for (j = 0; j < $scope.Payments3.length; j++) {
                var keys3 = Object.keys($scope.Payments3[0]);
                $scope.value_payment3 = $scope.Payments3[0][keys3];
            }
        }


        //product mix -----------------
        $scope.ProductMix_Quarter = res.ProductMix_Quarter;

        $scope.product = [];
        $scope.datas88 = [];



        if ($scope.ProductMix_Quarter) {


            $scope.Quarter_prolist = $scope.ProductMix_Quarter[0].Quarter;



            for (k = 0; k < $scope.Quarter_prolist.length; k++) {


                var pro_name = $scope.Quarter_prolist[k].ProdName;
                $scope.product.push(pro_name);


                var product_data = $scope.Quarter_prolist[k][pro_name][0];
                var value_pp = Object.keys(product_data);
                var final_value = Number($scope.rounddata(product_data[value_pp]));

                final_value = ( final_value * 10 ) / 10;


                $scope.datas88.push({
                    label: pro_name,
                    value: final_value,
                    color: newColors[$scope.month_prolist[k].ProdName],
                    //highlight: colors[r].highlight
                });


            }

            $scope.total_quanty3 = $scope.datas88[0].value + $scope.datas88[1].value + $scope.datas88[2].value + $scope.datas88[3].value;
        }


        if (document.getElementById("doughnutChart2"))
            var graph = document.getElementById("doughnutChart2").getContext("2d");
        var mydoughnutChart = new Chart(graph).Doughnut($scope.datas88, doughnutOptions);
    }

    // Second Quart
    function myperformance_quart(cb) {
        // $scope.loader(true);
        /* request.service('myPerformance', 'post', $scope.currUser, function (res) {*/
        // $scope.loader(false);
        if ($scope.res_myPerformance.statusCode == 200) {
            applySecondQuart($scope.res_myPerformance)
            if (cb) cb();
        } else if ($scope.res_myPerformance.dupLogin) {
            $scope.logout();
        }
        /* });*/
    }

    function applySecondQuart(res) {
        $scope.outStanding = request.getObj('outstanding');
        if ($scope.outStanding)
            $scope.CreditDetails_Quarter2 = $scope.outStanding.CreditDetails_Quarter2.creditLimit;
        //month sales---------------
        $scope.quarter2 = res.Sales_Quarter;
        if ($scope.quarter2) {
            for (i = 0; i < $scope.quarter2.length; i++) {
                $scope.present_quarter2 = $scope.quarter2;
            }
            var value_pp = Object.keys($scope.present_quarter2[1])[0];
            var myarray = value_pp.split('_');
            for (var i = 0; i < myarray.length; i++) {
                $scope.month04 = myarray[0];
                $scope.year04 = myarray[1];
                $scope.qyear04 = myarray[2];
            }
        }

        $scope.Payments4 = res.Payments_Quarter;
        if ($scope.Payments4) {
            for (j = 0; j < $scope.Payments4.length; j++) {
                var keys4 = Object.keys($scope.Payments4[1]);
                $scope.value_payment4 = $scope.Payments4[1][keys4];
            }
        }


        //product mix -----------------
        $scope.ProductMix_Quarter = res.ProductMix_Quarter;

        $scope.product = [];
        $scope.datas99 = [];



        if ($scope.ProductMix_Quarter) {


            $scope.Quarter_prolist = $scope.ProductMix_Quarter[0].Quarter;



            for (k = 0; k < $scope.Quarter_prolist.length; k++) {


                var pro_name = $scope.Quarter_prolist[k].ProdName;
                $scope.product.push(pro_name);


                var product_data = $scope.Quarter_prolist[k][pro_name][1];
                var value_pp = Object.keys(product_data);
                var final_value = Number($scope.rounddata(product_data[value_pp]));

                final_value = ( final_value * 10 ) / 10;


                $scope.datas99.push({
                    label: pro_name,
                    value: final_value,
                    color: newColors[$scope.month_prolist[k].ProdName],
                    //highlight: colors[r].highlight
                });



            }
            $scope.total_quanty4 = $scope.datas99[0].value + $scope.datas99[1].value + $scope.datas99[2].value + $scope.datas99[3].value;

        }



        if (document.getElementById("doughnutChart3"))
            var graph = document.getElementById("doughnutChart3").getContext("2d");
        var mydoughnutChart = new Chart(graph).Doughnut($scope.datas99, doughnutOptions);
    }
    //3rd quater -------




    function myperformance_thridquart(cb) {
        // $scope.loader(true);
        /* request.service('myPerformance', 'post', $scope.currUser, function (res) {*/
        // $scope.loader(false);
        if ($scope.res_myPerformance.statusCode == 200) {
            applythridQuart($scope.res_myPerformance)
            if (cb) cb();
        } else if ($scope.res_myPerformance.dupLogin) {
            $scope.logout();
        }
        /* });*/
    }

    function applythridQuart(res) {
        $scope.outStanding = request.getObj('outstanding');
        if ($scope.outStanding)
            $scope.CreditDetails_Quarter3 = $scope.outStanding.CreditDetails_Quarter3.creditLimit;
        //month sales---------------
        $scope.quarter3 = res.Sales_Quarter;
        if ($scope.quarter3) {
            for (i = 0; i < $scope.quarter3.length; i++) {
                $scope.present_quarter3 = $scope.quarter3;
            }
            var value_pp = Object.keys($scope.present_quarter3[2])[0];
            var myarray = value_pp.split('_');
            for (var i = 0; i < myarray.length; i++) {
                $scope.month004 = myarray[0];
                $scope.year004 = myarray[1];
                $scope.qyear004 = myarray[2];
            }
        }

        $scope.Payments5 = res.Payments_Quarter;
        if ($scope.Payments5) {
            for (j = 0; j < $scope.Payments5.length; j++) {
                var keys5 = Object.keys($scope.Payments5[2]);
                $scope.value_payment05 = $scope.Payments5[2][keys5];
            }
        }


        //product mix -----------------
        $scope.ProductMix_Quarter = res.ProductMix_Quarter;

        $scope.product = [];
        $scope.datas199 = [];



        if ($scope.ProductMix_Quarter) {


            $scope.Quarter_prolist = $scope.ProductMix_Quarter[0].Quarter;



            for (k = 0; k < $scope.Quarter_prolist.length; k++) {


                var pro_name = $scope.Quarter_prolist[k].ProdName;
                $scope.product.push(pro_name);


                var product_data = $scope.Quarter_prolist[k][pro_name][2];
                var value_pp = Object.keys(product_data);
                var final_value = Number($scope.rounddata(product_data[value_pp]));

                final_value = ( final_value * 10 ) / 10;


                $scope.datas199.push({
                    label: pro_name,
                    value: final_value,
                    color: newColors[$scope.month_prolist[k].ProdName],
                    //highlight: colors[r].highlight
                });




            }
            $scope.total_quanty5 = $scope.datas199[0].value + $scope.datas199[1].value + $scope.datas199[2].value + $scope.datas199[3].value;

        }

        if (document.getElementById("doughnutChart13"))
            var graph = document.getElementById("doughnutChart13").getContext("2d");
        var mydoughnutChart = new Chart(graph).Doughnut($scope.datas199, doughnutOptions);
    }





    // First Year
    function myperformanceyearly(cb) {
        // $scope.loader(true);
        /* request.service('myPerformance', 'post', $scope.currUser, function (res) {*/
        // $scope.loader(false);
        if ($scope.res_myPerformance.statusCode == 200) {
            applyFirstYear($scope.res_myPerformance)
            if (cb) cb();
        } else if ($scope.res_myPerformance.dupLogin) {
            $scope.logout();

        }
        /*});*/
    }

    function applyFirstYear(res) {
        $scope.outStanding = request.getObj('outstanding');
        if ($scope.outStanding)
            $scope.CreditDetails_Year1 = $scope.outStanding.CreditDetails_Year1.creditLimit;

        //month sales---------------
        $scope.year5 = res.Sales_Year;
        if ($scope.year5) {
            for (i = 0; i < $scope.year5.length; i++) {
                $scope.present_year5 = $scope.year5;
            }
        }

        $scope.Payments5 = res.Payments_Year;
        if ($scope.Payments5) {
            for (j = 0; j < $scope.Payments5.length; j++) {
                var keys5 = Object.keys($scope.Payments5[0]);
                $scope.value_payment5 = $scope.Payments5[0][keys5];
            }
        }


        //product mix -----------------
        $scope.ProductMix_Year = res.ProductMix_Year;

        $scope.product = [];
        $scope.datas109 = [];



        if ($scope.ProductMix_Year) {

            $scope.Year_prolist = $scope.ProductMix_Year[0].Year;



            for (k = 0; k < $scope.Year_prolist.length; k++) {


                var pro_name = $scope.Year_prolist[k].ProdName;
                $scope.product.push(pro_name);


                var product_data = $scope.Year_prolist[k][pro_name][0];
                var value_pp = Object.keys(product_data);
                var final_value = Number($scope.rounddata(product_data[value_pp]));

                final_value = ( final_value * 10 ) / 10;


                $scope.datas109.push({
                    label: pro_name,
                    value: final_value,
                    color: newColors[$scope.month_prolist[k].ProdName],
                    //highlight: colors[r].highlight
                });



            }

            $scope.total_quanty6 = $scope.datas109[0].value + $scope.datas109[1].value + $scope.datas109[2].value + $scope.datas109[3].value;

        }


        if (document.getElementById("doughnutChart4"))
            var graph = document.getElementById("doughnutChart4").getContext("2d");
        var mydoughnutChart = new Chart(graph).Doughnut($scope.datas109, doughnutOptions);
    }

    // Second Year
    function myperformance_yearly(cb) {
        // $scope.loader(true);
        /*  request.service('myPerformance', 'post', $scope.currUser, function (res) {*/
        // $scope.loader(false);
        if ($scope.res_myPerformance.statusCode == 200) {
            applySecondYear($scope.res_myPerformance)
            if (cb) cb();
        } else if ($scope.res_myPerformance.dupLogin) {
            $scope.logout();
        }
        /* });*/
    }

    function applySecondYear(res) {
        $scope.outStanding = request.getObj('outstanding');
        if ($scope.outStanding)
            $scope.CreditDetails_Year2 = $scope.outStanding.CreditDetails_Year2.creditLimit;
        //month sales---------------
        $scope.year6 = res.Sales_Year;

        if ($scope.year6) {
            for (i = 0; i < $scope.year6.length; i++) {
                $scope.present_year6 = $scope.year6;
            }
        }

        //Payments pay ment 
        $scope.Payments6 = res.Payments_Year;
        if ($scope.Payments6) {
            for (j = 0; j < $scope.Payments6.length; j++) {
                var keys6 = Object.keys($scope.Payments6[1]);
                $scope.value_payment6 = $scope.Payments6[1][keys6];
            }
        }


        //product mix -----------------
        $scope.ProductMix_Year = res.ProductMix_Year;

        $scope.product = [];
        $scope.datas119 = [];



        if ($scope.ProductMix_Year) {


            $scope.Year_prolist = $scope.ProductMix_Year[0].Year;



            for (k = 0; k < $scope.Year_prolist.length; k++) {


                var pro_name = $scope.Year_prolist[k].ProdName;
                $scope.product.push(pro_name);


                var product_data = $scope.Year_prolist[k][pro_name][1];
                var value_pp = Object.keys(product_data);
                var final_value = Number($scope.rounddata(product_data[value_pp]));


                final_value =( final_value * 10 ) / 10;
                $scope.datas119.push({
                    label: pro_name,
                    value: final_value,
                    color: newColors[$scope.month_prolist[k].ProdName],
                    //highlight: colors[r].highlight
                });



            }
            $scope.total_quanty7 = $scope.datas119[0].value + $scope.datas119[1].value + $scope.datas119[2].value + $scope.datas119[3].value;

        }



        if (document.getElementById("doughnutChart5"))
            var graph = document.getElementById("doughnutChart5").getContext("2d");
        var mydoughnutChart = new Chart(graph).Doughnut($scope.datas119, doughnutOptions);
    }
    //3rd year

    function myperformance_thridyearly() {

        if ($scope.res_myPerformance.statusCode == 200) {
            applythridYear($scope.res_myPerformance)
        } else if ($scope.res_myPerformance.dupLogin) {
            $scope.logout();
        }
        /* });*/
    }

    function applythridYear(res) {
        $scope.outStanding = request.getObj('outstanding');
        if ($scope.outStanding)
            $scope.CreditDetails_Year3 = $scope.outStanding.CreditDetails_Year3.creditLimit;

        //month sales---------------
        $scope.year7 = res.Sales_Year;
        if ($scope.year7) {
            for (i = 0; i < $scope.year7.length; i++) {
                $scope.present_year7 = $scope.year7;
            }
        }

        //Payments pay ment 
        $scope.Payments7 = res.Payments_Year;
        if ($scope.Payments7) {
            for (j = 0; j < $scope.Payments7.length; j++) {
                var keys7 = Object.keys($scope.Payments7[2]);
                $scope.value_payment7 = $scope.Payments7[2][keys7];
            }
        }


        //product mix -----------------
        $scope.ProductMix_Year = res.ProductMix_Year;

        $scope.product = [];
        $scope.datas118 = [];



        if ($scope.ProductMix_Year) {

            $scope.Year_prolist = $scope.ProductMix_Year[0].Year;



            for (k = 0; k < $scope.Year_prolist.length; k++) {


                var pro_name = $scope.Year_prolist[k].ProdName;
                $scope.product.push(pro_name);


                var product_data = $scope.Year_prolist[k][pro_name][2];
                var value_pp = Object.keys(product_data);
                var final_value = Number($scope.rounddata(product_data[value_pp]));

                final_value =( final_value * 10 ) / 10;
                $scope.datas118.push({
                    label: pro_name,
                    value: final_value,
                    color: newColors[$scope.month_prolist[k].ProdName],
                    //highlight: colors[r].highlight
                });



            }
            $scope.total_quanty8 = $scope.datas118[0].value + $scope.datas118[1].value + $scope.datas118[2].value + $scope.datas118[3].value;

        }


        if (document.getElementById("doughnutChart15"))
            var graph = document.getElementById("doughnutChart15").getContext("2d");
        var mydoughnutChart = new Chart(graph).Doughnut($scope.datas118, doughnutOptions);
    }


});

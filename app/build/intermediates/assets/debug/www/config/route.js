// configure our routes
var pennaApp = angular.module('pennaApp', ['ui.router', 'ui.bootstrap', 'ImageCropper', 'angularMoment']);

pennaApp.config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		'self',
        //'https://caredevelopment.pennacement.com/data/termsandconditions/**'
        'https://customerportal.pennacement.com/data/termsandconditions/**'
    ]);
	$urlRouterProvider.otherwise('/login')
	$stateProvider

		.state('dashboard', {
			url: '/dashboard',
			templateUrl: 'pages/dashboard/dashboard.html',
			access: {
				loginRequired: true
			}
		})
		.state('dashboard.company-updates', {
			url: '/company-updates',
			templateUrl: 'pages/dashboard/company-updates.html',
			access: {
				loginRequired: true
			}
		})
		.state('dashboard.order-statuses', {
			url: '/order-statuses',
			templateUrl: 'pages/dashboard/order-statuses.html',
			access: {
				loginRequired: true
			}
		})
		.state('dashboard.credit-details', {
			url: '/credit-details',
			templateUrl: 'pages/dashboard/credit-details.html',
			access: {
				loginRequired: true
			}
		})
		.state('dashboard.pending-pod-detail', {
			url: '/pending-pod-detail',
			templateUrl: 'pages/dashboard/pending-pod-detail.html',
			access: {
				loginRequired: true
			}
		})
		.state('dashboard.pending-pod-detailedit', {
			url: '/pending-pod-detailedit',
			templateUrl: 'pages/dashboard/pending-pod-detailedit.html',
			access: {
				loginRequired: true
			}
		})
		.state('dashboard.order-status-detail', {
			url: '/order-status-detail',
			templateUrl: 'pages/dashboard/order-status-detail.html',
			access: {
				loginRequired: true
			}
		})
		.state('dashboard.pending-pod', {
			url: '/pending-pod',
			templateUrl: 'pages/dashboard/pending-pod.html',
			access: {
				loginRequired: true
			}
		})

	.state('dashboard.list-of-orders-detail', {
		url: '/list-of-orders-detail-dash',
		templateUrl: 'pages/dashboard/list-of-orders-detail-dashboard.html',
		access: {
			loginRequired: true
		}
	})

	.state('dashboard.invoice', {
			url: '/invoice',
			templateUrl: 'pages/dashboard/invoice.html',
			access: {
				loginRequired: true
			}
		})
		.state('dashboard.orders-details', {
			url: '/order-details',
			templateUrl: 'pages/dashboard/orders-details.html',
			access: {
				loginRequired: true
			}
		})



	.state('orders', {
			url: '/orders',
			templateUrl: 'pages/orders/orders.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.create-new-order', {
			url: '/create-new-order',
			templateUrl: 'pages/orders/create-new-order.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.create-new-order.select-product-tab', {
			url: '/select-product-tab',
			templateUrl: 'pages/orders/select-product-tab.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.create-new-order.order-details-tab', {
			url: '/order-details-tab',
			templateUrl: 'pages/orders/order-details-tab.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.create-new-order.order-summary-tab', {
			url: '/order-summary-tab',
			templateUrl: 'pages/orders/order-summary-tab.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.create-new-order.order-confirmation-tab', {
			url: '/order-confirmation-tab',
			templateUrl: 'pages/orders/order-confirmation-tab.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.list-of-orders', {
			url: '/list-of-orders',
			templateUrl: 'pages/orders/list-of-orders.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.list-of-orders-detail', {
			url: '/list-of-orders-detail',
			templateUrl: 'pages/orders/list-of-orders-detail.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.list-of-orders-detail.order-detail-confirm', {
			url: '/order-detail-confirm',
			templateUrl: 'pages/orders/order-detail-confirm.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.new-enquiry-quote', {
			url: '/new-enquiry-quote',
			templateUrl: 'pages/orders/new-enquiry-quote.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.list-of-enquiries', {
			url: '/list-of-enquiries',
			templateUrl: 'pages/orders/list-of-enquiries.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.my-quotes', {
			url: '/my-quotes',
			templateUrl: 'pages/orders/my-quotes.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.my-quotes-detail', {
			url: '/my-quotes-detail',
			templateUrl: 'pages/orders/my-quotes-detail.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.my-quotes-detail-undereval', {
			url: '/my-quotes-detail-undereval',
			templateUrl: 'pages/orders/my-quotes-detail-under-eval.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.quoteconfirm', {
			url: '/quote-confirm',
			templateUrl: 'pages/orders/orderConfirmNotification.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.quotereject', {
			url: '/quote-reject',
			templateUrl: 'pages/orders/orderRejectNotification.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.proof-of-delivery', {
			url: '/proof-of-delivery',
			templateUrl: 'pages/orders/proof-of-delivery.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.pod-conform-details', {
			url: '/pod-conform-details',
			templateUrl: 'pages/orders/pod-conform-details.html',
			controller: 'orderspodsctrl',
			access: {
				loginRequired: true
			}
		})
       .state('orders.pdfinvoices', {
			url: '/pdf-invoices',
			templateUrl: 'pages/accounts/pdf-invoices.html',
            controller: 'orderspdfctrl',
			access: {
				loginRequired: true
			}
		})
       .state('orders.pending-pod-detailedit', {
			url: '/pending-pod-detailedit',
			templateUrl: 'pages/dashboard/pending-pod-detailedit.html',
            controller: 'orderspodsctrl',
			access: {
				loginRequired: true
			}
		})
		.state('orders.invoice', {
			url: '/invoice',
			templateUrl: 'pages/orders/invoice.html',
			access: {
				loginRequired: true
			}
		})


	.state('orders.pdf-invoices', {
		url: '/orderspdf-invoices',
		templateUrl: 'pages/orders/pdf_invoice.html',
		access: {
			loginRequired: true
		}
	})

	.state('orders.quote', {
			url: '/quote',
			templateUrl: 'pages/orders/quote.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.quote-notification', {
			url: '/quote-notification',
			templateUrl: 'pages/orders/quote-notification.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.orders-details', {
			url: '/orders-details',
			templateUrl: 'pages/orders/orders-details.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.enquiry-detail', {
			url: '/enquiry-detail',
			templateUrl: 'pages/enquiry-detail.html',
			access: {
				loginRequired: true
			}
		})
		.state('orders.quote-acceptance', {
			url: '/quote-acceptance',
			templateUrl: 'pages/quote-acceptance.html',
			access: {
				loginRequired: true
			}
		})
		.state('profile', {
			url: '/profile',
			templateUrl: 'pages/profile/profile.html',
			controller: 'profileCtrl',
			access: {
				loginRequired: true
			}
		})
		.state('others', {
			url: '/others',
			templateUrl: 'pages/others/others.html',
			controller: 'othersCtrl',
			access: {
				loginRequired: true
			}
		})
		.state('others.faq', {
			url: '/faq',
			templateUrl: 'pages/others/faq.html',
			controller: 'othersCtrl',
			access: {
				loginRequired: true
			}
		})
		// .state('account.statements', {
		//     url: '/statements',
		//     templateUrl: 'pages/accounts/statements.html',
		//     access: {
		//         loginRequired: true
		//     }
		// })
		// .state('account.payments', {
		//     url: '/payments',
		//     templateUrl: 'pages/accounts/payments.html',
		//     access: {
		//         loginRequired: true
		//     }
		// })
		// .state('account.invoices', {
		//     url: '/invoices',
		//     templateUrl: 'pages/accounts/invoices.html',
		//     access: {
		//         loginRequired: true
		//     }
		// })
		.state('login', {
			url: '/login',
			templateUrl: 'pages/login.html'
		})
		.state('login.register', {
			url: '/register',
			templateUrl: 'pages/register.html',
			controller: 'createuser'
		})
		.state('login.forgot-password', {
			url: '/forgot-password',
			templateUrl: 'pages/forgot-password.html'
		})
		.state('login.enquiry', {
			url: '/enquiry',
			templateUrl: 'pages/enquiry.html'
		})
		.state('login.create-newpass', {
			url: '/create-newpass',
			templateUrl: 'pages/create-newpass.html'
		})
		.state('login.pre-login-enquiry', {
			url: '/pre-login-enquiry',
			templateUrl: 'pages/pre-login-enquiry.html'
		})
		.state('profile.my-profile', {
			url: '/my-profile',
			templateUrl: 'pages/profile/myProfile/myProfile.html',
			// controller: 'profileCtrl',
			access: {
				loginRequired: true
			}
		})
		.state('notifications', {
			url: '/notifications',
			templateUrl: 'pages/notifications.html',
			access: {
				loginRequired: true
			}
		})
		.state('profile.ship-address', {
			url: '/ship-address',
			templateUrl: 'pages/profile/shipToAddress/shipToAddress.html',
			controller: 'shipaddressctrl',
			access: {
				loginRequired: true
			}
		})
		.state('profile.bank-details', {
			url: '/bank-details',
			templateUrl: 'pages/profile/bankDetails/bankDetails.html',
			controller: 'bankAccountctrl',
			access: {
				loginRequired: true
			}
		})
		.state('profile.tax-information', {
			url: '/tax-information',
			templateUrl: 'pages/profile/Taxinfo/taxInformation.html',
			access: {
				loginRequired: true
			}
		})
		.state('profile.security-deposit', {
			url: '/security-deposit',
			templateUrl: 'pages/profile/securityDeposite/securityDeposit.html',
			access: {
				loginRequired: true
			}
		})
		.state('profile.my-performance', {
			url: '/my-performance',
			templateUrl: 'pages/profile/myPerformance/myPerformance.html',
			access: {
				loginRequired: true
			}
		})
		.state('profile.my-rewards', {
			url: '/my-rewards',
			templateUrl: 'pages/profile/myRewards/myRewards.html',
			access: {
				loginRequired: true
			}
		})
		.state('profile.suggestions', {
			url: '/suggestions',
			templateUrl: 'pages/profile/suggestions/suggestions.html',
			controller: 'suggestionCtrl',
			access: {
				loginRequired: true
			}
		})
		.state('profile.service-list', {
			url: '/service-list',
			templateUrl: 'pages/profile/suggestions/suggestionsServiceList.html',
			controller: 'suggestionCtrl',
			access: {
				loginRequired: true
			}
		})
		.state('profile.my-profile-edit', {
			url: '/my-profile-edit',
			templateUrl: 'pages/profile/myProfile/editProfile.html',
			controller: 'profileCtrl',
			access: {
				loginRequired: true
			}
		})
    .state('profile.pennavisits', {
			url: '/penna-visits',
			templateUrl: 'pages/profile/pennavisits/pennavisits.html',
			controller: 'pennavisitsCtrl',
			access: {
				loginRequired: true
			}
		})
		.state('saveOfflineData', {
			url: '/saveOfflineData',
			templateUrl: 'pages/saveOfflineData.html',
			controller: 'saveOfflineDataCtrl',
			access: {
				loginRequired: true
			}
		})
		.state('accounts', {
			url: '/accounts',
			templateUrl: 'pages/accounts/accounts.html',
            controller:'statementsctrl',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.statements', {
			url: '/statements',
			templateUrl: 'pages/accounts/statements.html',
            controller:'statementsctrl',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.statements.party-confirmation', {
			url: '/party-confirmation',
			templateUrl: 'pages/accounts/party-confirmation.html',
			access: {
				loginRequired: true
			}
		})
        .state('accounts.statements.party-confirmation-taxable', {
			url: '/party-confirmationtaxable',
			templateUrl: 'pages/accounts/party-confirmation-taxable.html',
			access: {
				loginRequired: true
			}
		})
       .state('accounts.statements.party-confirmationfileshow', {
			url: '/party-confirmationfileshow',
			templateUrl: 'pages/accounts/party-confirmationfileshow.html',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.statements.party-confirmation.instrument-detail', {
			url: '/instrument-detail',
			templateUrl: 'pages/accounts/instrument-detail.html',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.statements.party-confirmation.accounts-invoice', {
			url: '/accounts-invoice',
			templateUrl: 'pages/accounts/accounts-invoice.html',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.statements.account-statement', {
			url: '/account-statement',
			templateUrl: 'pages/accounts/account-statement.html',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.payments', {
			url: '/payments',
			templateUrl: 'pages/accounts/payments.html',
			controller: 'newPaymentCtrl',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.payments.new-payment', {
			url: '/new-payment',
			templateUrl: 'pages/accounts/new-payment.html',
			controller: 'newPaymentCtrl',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.payments.new-payment.payment-details', {
			url: '/payment-details',
			templateUrl: 'pages/accounts/payment-details.html',
			access: {
				loginRequired: true
			}
		})

	.state('payment-confirmation', {
			url: '/payment-confirmation',
			templateUrl: 'pages/accounts/payment-confirmation.html',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.accounts-credit-details', {
			url: '/accounts-credit-details',
			templateUrl: 'pages/accounts/accounts-credit-details.html',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.payments.payment-history', {
			url: '/payment-history',
			templateUrl: 'pages/accounts/payment-history.html',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.payments.payment-history.payment-history-details', {
			url: '/payment-history-details',
			templateUrl: 'pages/accounts/payment-history-details.html',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.invoices', {
			url: '/invoices',
			templateUrl: 'pages/accounts/invoices.html',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.invoices-details', {
			url: '/invoices-details',
			templateUrl: 'pages/orders/pod-conform-details.html',
			controller: 'invoicectrl',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.pdfinvoices', {
			url: '/pdf-invoices',
			templateUrl: 'pages/accounts/pdf-invoices.html',
             controller: 'invoicepdfctrl',
			access: {
				loginRequired: true
			}
		})
		.state('accounts.monthparty', {
			url: '/monthparty-conformation',
			templateUrl: 'pages/accounts/monthparty-conformation.html',
			access: {
				loginRequired: true
			}
		})

	.state('accounts.monthpartypdf', {
			url: '/monthparty-conformationpdf',
			templateUrl: 'pages/accounts/monthparty-conformationpdf.html',
			access: {
				loginRequired: true
			}
		})
		.state('paymentNotify', {
			url: '/paymentNotify',
			templateUrl: 'pages/paymentNotify.html',
			access: {
				loginRequired: true
			}
		})
		.state('changePassword', {
			url: '/changePassword',
			templateUrl: 'pages/ChangePassword.html',
			controller: 'ChangePasswordController',
			access: {
				loginRequired: true
			}
		})
		.state('contactUs', {
			url: '/contactUs',
			templateUrl: 'pages/contactUs.html',
			controller: 'othersCtrl',
			access: {
				loginRequired: true
			}
		});
})

pennaApp.run(function ($state, $rootScope, $window) {
	$rootScope.$state = $state;

	$rootScope.online = navigator.onLine;
	$window.addEventListener("offline", function () {
		$rootScope.$apply(function () {
			$rootScope.online = false;
		});
	}, false);

	$window.addEventListener("online", function () {
		$rootScope.$apply(function () {
			$rootScope.online = true;
		});
	}, false);

	$rootScope.safeApply = function (fn) {
		var phase = this.$root.$$phase;
		if (phase == '$apply' || phase == '$digest')
			this.$eval(fn);
		else
			this.$apply(fn);
	};

});

pennaApp.filter('INR', function () {
	return function (input) {
		if (!isNaN(input)) {
			var currencySymbol = '';

			var result = input.toString().split('.');

			var lastThree = result[0].substring(result[0].length - 3);
			var otherNumbers = result[0].substring(0, result[0].length - 3);
			if (otherNumbers != '')
				lastThree = ',' + lastThree;
			var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

			if (result.length > 1) {
				output += "." + result[1];
			}

			return currencySymbol + output;
		}
	}
});

moment.lang('en', {
	relativeTime: {
		future: "in %s",
		past: "%s ago",
		s: 'a few seconds',
		ss: '%d seconds',
		m: "a minute",
		mm: "%d minutes",
		h: "an hour",
		hh: "%d hours",
		d: "a day",
		dd: "%d days",
		M: "a month",
		MM: "%d months",
		y: "a year",
		yy: "%d years"
	}
});

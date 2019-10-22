
var headPage = Vue.extend({
	template: '#head-temp',
	mixins: [headBaseMix]
});

var applyPage = Vue.extend({
	template: '#apply-temp',
	mixins: [applyBaseMix]
});

var detailPage = Vue.extend({
	template: '#detail-temp',
	mixins: [detailBaseMix]
});

var historyPage = Vue.extend({
	template: '#history-temp',
	mixins: [historyBaseMix],
});

var router = new VueRouter()
	router.redirect({
		'/': '/head'
	})
	router.map({		
		'/head': {
			name: 'head',
			component: headPage,
			title:"发票管理",
			subRoutes: {
                '/detail': {
                	name: 'detail',
                    component: detailPage,
                    title:"抬头详情"
                }
            }
		},
		'/apply': {
			component: applyPage,
			name: 'apply',
			title:"申请发票"
		},
		'/history': {
			component: historyPage,
			name: 'history',
			title:"历史记录"
		}
	})

var App = Vue.extend({
	mixins: [mainBaseMix]
})
router.start(App, '#app')

router.afterEach(function (transition) {
    if (transition.to.title) {
        document.title = transition.to.title;
    }
});

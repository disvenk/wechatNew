
var addressPage = Vue.extend({
	template: '#address-temp',
	mixins: [addressMix]
});

var editPage = Vue.extend({
	template: '#edit-temp',
	mixins: [editMix]
});

var mapPage = Vue.extend({
	template: '#map-temp',
	mixins: [mapMix],
});

var router = new VueRouter()
	router.redirect({
		'/': '/address'
	})
	router.map({		
		'/address': {
			name: 'address',
			component: addressPage
		},
		'/edit': {
			name: 'edit',
			component: editPage		
		},
		'/map': {
			name: 'map',
			component: mapPage	
		}
	})

var App = Vue.extend({
	mixins: [mainBaseMix]
})
router.start(App, '#app')

//router.afterEach(function (transition) {
//  if (transition.to.title) {
//      document.title = transition.to.title;
//  }
//});

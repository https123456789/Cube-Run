document.onready = () => {
	var ss = document.getElementsByTagName("script");
	for (var i = 0; i < ss.length; i++) {
		var s = ss[i];
		if (s.getAttribute("data-src")) {
			s.setAttribute("src", s.getAttribute("data-src"));
		}
	}
}
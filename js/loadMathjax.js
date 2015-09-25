(function () {
  var head = document.getElementsByTagName("head")[0], script;
  script = document.createElement("script");
  script.type = "text/x-mathjax-config";
  script[(window.opera ? "innerHTML" : "text")] =
        "MathJax.Hub.Config({\n" +
		"config: ['MMLorHTML.js'],\n" +
		"extensions: ['tex2jax.js','TeX/AMSmath.js','TeX/AMSsymbols.js'],\n" +
		"jax: ['input/TeX'],\n" +
		"tex2jax: {\n" +
		"inlineMath: [ ['$','$'] ],\n" +
		"displayMath: [ ['$$','$$'] ]," +
		"processEscapes: false" +
		"}," +
		"TeX: {" +
		"TagSide: 'right'," +
		"TagIndent: '.8em'," +
		"MultLineWidth: '85%'," +
		"equationNumbers: {" +
		"autoNumber: 'AMS'," +
		"}," +
		"unicode: {" +
		"}" +
		"}," +
		"showProcessingMessages: false" +
		"});"

	head.appendChild(script);
	script = document.createElement("script");
	script.type = "text/javascript";
	script.src  = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
	head.appendChild(script);
})();

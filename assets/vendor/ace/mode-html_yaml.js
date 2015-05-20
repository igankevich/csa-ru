define('ace/mode/html_yaml',
	["require","exports","module","ace/lib/oop","ace/mode/html_yaml_highlight_rules",
	"ace/mode/html", "ace/mode/yaml"],
	function(require, exports, module) {

var oop = require("../lib/oop");
var HtmlMode = require("ace/mode/html").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var HtmlYamlHighlightRules = require('ace/mode/html_yaml_highlight_rules').HtmlYamlHighlightRules;


var Mode = function() {
    this.$tokenizer = new Tokenizer(new HtmlYamlHighlightRules().getRules());
};

oop.inherits(Mode, HtmlMode);

(function() {
	this.$id = "ace/mode/html_yaml";
}).call(Mode.prototype);

exports.Mode = Mode;
});

define('ace/mode/html_yaml_highlight_rules',
	["require","exports","module","ace/lib/oop","ace/mode/html_highlight_rules","ace/mode/yaml_highlight_rules"],
	function(require, exports, module) {

var HtmlHighlightRules = require("ace/mode/html_highlight_rules").HtmlHighlightRules;
var oop = require("../lib/oop");
var YamlHighlightRules = require("ace/mode/yaml_highlight_rules").YamlHighlightRules;

var HtmlYamlHighlightRules = function() {
    HtmlHighlightRules.call(this);

	this.$rules = {
		start: [{
        	token: "keyword",
        	regex: "^---\\s*$",
        	next: "yml-start"
		}]
	}

	this.embedRules(YamlHighlightRules, 'yml-', [{
        token: "keyword",
        regex: "^---\\s*$",
        next: "start"
	}])

};

oop.inherits(HtmlYamlHighlightRules, HtmlHighlightRules);

exports.HtmlYamlHighlightRules = HtmlYamlHighlightRules;
});

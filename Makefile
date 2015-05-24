build:
	@echo "\\033[1mBuilding\\033[0m ... \c"
	@bower install
	@[ -f ./node_modules/uglify-js/bin/uglifyjs ] || npm install uglify-js
	@cat bower_components/promise.js/promise.js > tester.js
	@cat src/*.js >> tester.js
	@./node_modules/uglify-js/bin/uglifyjs tester.js -o tester.js
	@echo "\\033[32mOK\\033[0m"


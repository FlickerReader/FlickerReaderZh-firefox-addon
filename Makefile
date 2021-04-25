# icons: src/logo.svg
# 	mkdir -p build/icons
# 	convert -resize 48x48 src/logo.svg build/icons/logo48.png
# 	convert -resize 96x96 src/logo.svg build/icons/logo96.png

build: packageGoApi
	mkdir -p build
	cp -R ./src/* ./build

package: build
	cd build && zip -r ../extension.zip . && cd ..
	mv extension.zip  ./extension.xpi

clean:
	rm -R ./build/*
	rm extension.xpi

buildGoApi:
	cd gojieba && GOOS=js GOARCH=wasm  go build  -o static/main.wasm .

packageGoApi: buildGoApi
	mv gojieba/static/main.wasm  ./src/main.wasm
	cp -f gojieba/dict.txt ./src/dict.txt
	cp -f "$(shell go env GOROOT)/misc/wasm/wasm_exec.js" ./src/wasm_exec.js

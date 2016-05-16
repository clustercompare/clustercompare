# clustercompare

A tool to visualize software modularizations and compare them to multiple clustering results

https://clustercompare.jan-melcher.de/about/

## How to build

* Download and install [node.js](https://nodejs.org/en/)
* Download this repository recursively (`git clone --recursive git@github.com:clustercompare/clustercompare`) or fetch the submodules afterwards (`git submodule update --init`)
* Open a shell (on Windows, the shell needs admin rights to create a symlink)
* Run `grunt webserver`
* Open a browser at `http://localhost:8000`

Grunt will rebuild the app when you change the code, and the browser will refresh itself automatically.

'use strict'
const {LinkedList, Node} = require('./linkedlist.js')
const Promise = require('bluebird');
function loadList(list, logSources) {
	let p = logSources.map((logSource, index) => {
		if(!logSource) return Promise.resolve();
		return logSource.popAsync()
			.then(log => {
				if(log) {
					return new Node(logSource, log);
				} else {
					logSources[index] = null;
				}
			})
	})
	return Promise.all(p)
	  .filter(node => node)
	  .map(node => list.insert(node))
}
/** Drain the link list and insert new entries on insert.
 * @param {LinkedList} list 
 * @param {any} printer 
 * @returns
 */
function processLogs(list, logSources, printer) {

	// buffer to ensure that log sources are not being processed
	let node;
	let srcs = logSources.filter(src => src)
	while(srcs.reduce((out, src) => out && list.srcCountFor(src) > 2, true)) {
		node = list.pop()
		if(!node) break;
		printer.print(node.log);
	}
	if(srcs.length === 0) return;
	return loadList(list, logSources)
	  .then(() => {
		return processLogs(list, logSources, printer);
	  })
}
module.exports = (logSources, printer) => {
	let list = new LinkedList();
    return loadList(list, logSources)
		.then(() => processLogs(list, logSources, printer))
		.then(() => printer.done())
}

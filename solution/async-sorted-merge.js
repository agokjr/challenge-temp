'use strict'
const {LinkedList, Node} = require('./linkedlist.js')
const Promise = require('bluebird');
const process = require('process');

/**
 *
 */
async function loadFromSrc(list, logSource) {
	let log;
	do {
		// let nother promise work if more then 1000 items.
		// this is to keep from loading from Log source if another log is way before it.
		if (list.srcCountFor(logSource) > 1000) await Promise.delay(1)
	  log = await logSource.popAsync()
		if (log) list.insert(new Node(logSource, log))
	} while(log);
}
function loadList(list, logSources) {
	let p = logSources.map((logSource, index) => {
		return loadFromSrc(list, logSource)
		  .then(() => logSources[index] = null)
	})
	return Promise.all(p)
}
/** Drain the link list and insert new entries on insert.
 * @param {LinkedList} list 
 * @param {any} printer 
 * @returns
 */
async function processLogs(list, logSources, printer) {

	// buffer to ensure that log sources are not being processed
	let node;

	let srcs = logSources.filter(src => src)
	do {

		while(srcs.length === 0 || srcs.reduce((out, src) => out && list.srcCountFor(src) > 2, true)) {
			node = list.pop()
			if (!node) break;
			printer.print(node.log);
		}
		await Promise.delay(1); // Give up controll to allow inserting;
		srcs = logSources.filter(src => src);
	} while(srcs.length > 0 || list.size > 0)
}
module.exports = (logSources, printer) => {
	let list = new LinkedList();
	return Promise.all([
		loadList(list, logSources),
		processLogs(list, logSources, printer)])
		.then(() => printer.done())
}

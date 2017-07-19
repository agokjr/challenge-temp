'use strict'
const {LinkedList, Node} = require('./linkedlist.js')
module.exports = (logSources, printer) => {
	let list = new LinkedList();
	for (let logSource of logSources) {
		// log source and current message in que.
		let log = logSource.pop();
		let node = new Node(logSource, log);
		list.insert(node);
	}
	// throw new Error('Not implemented yet!  That part is up to you!'
	let node = list.pop();
	while (node) {
		printer.print(node.log)
		// console.log(node.log.date.valueOf());
		let log = node.logSource.pop();
		if (log) {
			list.insert(new Node(node.logSource, log))
		}
		node = list.pop();
	}
	printer.done();
}

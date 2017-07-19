const assert = require('assert')
module.exports.LinkedList = class LinkedList {
	constructor() {
		this.head = null;
        this.size = 0;
		this.srcs = new Map();
	}
    /** inserts Node into linked list.
     * @param {Node} node 
     */
	insert(node) {
		let count = this.srcs.has(node.logSource) ? this.srcs.get(node.logSource) : 0;
		this.srcs.set(node.logSource, count + 1);
		if (!this.head) {
			this.head = node;
		} else if(this.head.before(node)) {
			node.next = this.head;
			this.head = node;
		} else {
			this.head.insert(node);
		}
        this.size++;
	}
	srcCountFor(logSource) {
		if(!this.srcs.has(logSource)) return 0
		return this.srcs.get(logSource);
	}
	/** Removes head item from linked list.
	 * @returns {Node} former head from link list.
	 * @memberof LinkedList
	 */
	pop() {
        if (!this.head) return null;
        this.size--;
		let node = this.head;
		this.head = node.next;
		node.next = null;
		let count = this.srcs.has(node.logSource) ? this.srcs.get(node.logSource) : 0;
		this.srcs.set(node.logSource, count - 1);
		return node;
	}
}

module.exports.Node = class Node {
	constructor(logSource, log) {
        assert(log);
		Object.assign(this, {logSource, log})
		this.next = null;
	}
	/** Recursively Adds item to link list.
	 * @param {Node} node - node to insert. 
	 * @memberof Node
	 */
	insert(node) {
		if (this.next) {
			if (this.next.before(node)) {
				node.next = this.next;
				this.next = node;
			} else {
				this.next.insert(node);
			}
		} else {
			this.next = node;
		}
	}
	/** Accesser short hand for getting date value of log.
	 * @readonly
	 * @memberof Node
	 */
	get index () {
		return this.log.date.valueOf()
	}
	/** Checks if node belongs before current node.
	 * @param {any} node 
	 * @returns 
	 * 
	 * @memberof Node
	 */
	before(node) {
		return this.index > node.index
	}
}
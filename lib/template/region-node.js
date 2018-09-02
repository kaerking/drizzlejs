"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
class RegionNode extends node_1.Node {
    constructor(id = 'default') {
        super();
        this.isChildren = false;
        this.id = id;
    }
    init(context) {
        this.children.forEach(it => {
            it.parent = this.parent;
            it.init(context);
        });
        const me = this;
        context.region(this.id, {
            get item() {
                return me.item;
            },
            show(name, state) {
                me.isChildren = false;
                return me.show(name, state);
            },
            _showNode(nodes, ctx) {
                me.isChildren = false;
                return me.showNode(nodes, ctx);
            },
            _showChildren() {
                if (!me.context)
                    return Promise.resolve();
                me.isChildren = true;
                return this._showNode(me.children, me.context);
            },
            close() {
                me.isChildren = false;
                return me.close();
            }
        });
    }
    render(context) {
        if (this.rendered)
            return;
        this.rendered = true;
        this.context = context;
        if (this.isChildren)
            this.nodes.forEach(it => it.render(context));
    }
    update(context) {
        if (!this.rendered)
            return;
        this.context = context;
        if (this.isChildren)
            this.nodes.forEach(it => it.update(context));
    }
    destroy(context) {
        if (!this.rendered)
            return;
        if (this.nodes)
            this.nodes.forEach(it => it.destroy(context));
        if (this.item)
            context.delay(this.item.destroy());
        this.rendered = false;
    }
    showNode(nodes, context) {
        if (!this.rendered)
            return;
        this.context = context;
        return this.close().then(() => {
            this.nodes = nodes;
            this.nodes.forEach(it => {
                it.parent = this.parent;
                it.render(context);
            });
            return context.end();
        });
    }
    show(name, state) {
        if (!this.rendered)
            return;
        return this.close().then(() => this.context.create(name, state)).then(item => {
            this.item = item;
            return item._render(this.parent).then(() => item);
        });
    }
    close() {
        if (!this.nodes && !this.item)
            return Promise.resolve();
        return Promise.resolve().then(() => {
            this.nodes.forEach(it => it.destroy(this.context));
            return this.context.end();
        }).then(() => {
            if (this.item)
                return this.item.destroy();
        }).then(() => {
            this.nodes = null;
            this.item = null;
        });
    }
}
exports.RegionNode = RegionNode;
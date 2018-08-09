import { Node } from './node'
import { Delay } from './template'
import { setAttribute } from './attributes'

export class StaticNode extends Node {
    name: string
    attributes: [string, string][]

    constructor(name: string, attributes: [string, string][] = [], id?: string) {
        super(id)
        this.name = name
        this.attributes = attributes
    }

    render (context: object, delay: Delay) {
        if (this.rendered) return
        this.rendered = true
        /* FIXME
        if (this.nextSibling && this.nextSibling.element) {
            this.parent.element.insertBefore(this.element, this.nextSibling.element)
        } else {
            this.parent.element.appendChild(this.element)
        }*/
        this.parent.element.appendChild(this.element)
        this.children.forEach(it => it.render(context, delay))
    }

    update (context: object, delay: Delay) {
        this.children.forEach(it => it.update(context, delay))
    }

    destroy (delay: Delay) {
        if (!this.rendered) return
        super.destroy(delay)

        this.parent.element.removeChild(this.element)
        this.rendered = false
    }

    create () {
        const element = document.createElement(this.name)
        this.attributes.forEach(it =>  setAttribute(element, it[0], it[1]))
        return element
    }
}
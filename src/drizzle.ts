import {
    IfHelper, UnlessHelper, Helper, DelayHelper, ConcatHelper, EchoHelper
} from './template/helper'
import { IfBlock, UnlessBlock } from './template/if-block'
import { EachBlock } from './template/each-block'
import { Loader } from './loader'
import {
    customEvents, components, Attribute, AttributeValue, ModuleTemplate,
    ViewTemplate, NormalValue, ValueType,
} from './template/template'
import { Application } from './application'
import { StaticNode } from './template/static-node'
import { DynamicNode } from './template/dynamic-node'
import { TextNode } from './template/text-node'
import { ReferenceNode } from './template/reference-node'
import { RegionNode } from './template/region-node'
import { Node } from './template/node'
import { TransformerItem, Transformer } from './template/transformer'

export interface Disposable {
    dispose (): void
}

const helpers = {
    echo: EchoHelper, if: IfHelper, unless: UnlessHelper, concat: ConcatHelper
}

const blocks = {
    if: IfBlock, unless: UnlessBlock, each: EachBlock
}

const loaders = {
    default: Loader
}

const SN = (name: string, id: string, ...attributes: [string, string][]) => {
    return new StaticNode(name, attributes || [], id)
}
const DN = (name: string, id: string, ...attributes: [string, string][]) => {
    return new DynamicNode(name, attributes || [], id)
}
const DA = (d: DynamicNode, name: string, ...hs: Helper[]) => {
    d.attribute(name, hs)
}
const BD = (d: DynamicNode | ReferenceNode, from: string, to: string) => {
    d.bind(from, to)
}
const EV = (d: DynamicNode | ReferenceNode, event: string, method: string, ...attrs: Attribute[]) => {
    d.on(event, method, attrs)
}
const AC = (d: DynamicNode | ReferenceNode, event: string, method: string, ...attrs: Attribute[]) => {
    d.action(event, method, attrs)
}
const CO = (d: DynamicNode, name: string, ...hs: Helper[]) => {
    d.component(name, hs)
}

const TX = (...ss: (string | Helper)[]) => new TextNode(...ss)
const RG = (id: string = 'default') => new RegionNode(id)
const REF = (name: string, statics: [string, any][], id: string) => {
    const ss = statics.reduce((acc, it) => {
        acc[it[0]] = it[1]
        return acc
    }, {})
    return new ReferenceNode(name, ss, id)
}

const NDA = (v: string) => [null, [1, v]] as Attribute
const NSA = (v: string) => [null, [0, v]] as Attribute

const SV = (v: string) => [ValueType.STATIC, v] as NormalValue
const DV = (v: string) => [ValueType.DYNAMIC, v] as NormalValue
const AT = (n: string, v: AttributeValue) => [n, v] as Attribute
const KV = (k: string, v?: string) => [k, v || k]

const H = (n: string | AttributeValue) => Array.isArray(n) ? new EchoHelper(n) : new EchoHelper(DV(n))
const HH = (n: string, ...args: AttributeValue[]) => {
    if (helpers[n]) return new helpers[n](...args)
    return new DelayHelper(n, ...args)
}
const HIF = (...args: AttributeValue[]) => HH('if', ...args)
const HUN = (...args: AttributeValue[]) => HH('unless', ...args)

const EACH = (args: string[], trueNode: () => Node, falseNode?: Node) => new EachBlock(args, trueNode, falseNode)
const IF = (n: string, trueNode: Node, falseNode?: Node) => new IfBlock([DV(n)], trueNode, falseNode)
const IFC = (args: AttributeValue[], trueNode: Node, falseNode?: Node) => new IfBlock(args, trueNode, falseNode)
const UN = (n: string, trueNode: Node, falseNode?: Node) => new UnlessBlock([DV(n)], trueNode, falseNode)
const C = (parent: Node, ...children: Node[]) => parent.setChildren(children)

const TI = (name: string, ...args: NormalValue[]) => new TransformerItem(name, args)
const TV = (value: string, end?: NormalValue, ...items: TransformerItem[]) =>
    [ValueType.TRANSFORMER, new Transformer(value, items, end)] as AttributeValue

export default {
    helpers, blocks, loaders, customEvents, components,
    lifecycles: {module: [], view: []},
    ModuleTemplate, ViewTemplate, Application, Loader,
    factory: {
        SN, DN, TX, RG, REF, NDA, NSA, SV, DV, AT, KV, H, HH, HIF, HUN,
        EACH, IF, IFC, UN, C, DA, BD, EV, AC, CO, TI, TV
    }
}

import {ItemOptions, Module} from '../module'
import { Delay, Template } from './template'

export class ModuleTemplate extends Template<Module> {
    exportedModels: string[] = []

    constructor(exportedModels: string[]) {
        super()
        const me = this
        this.life = {
            stage: 'template',
            init (this: Module) { Delay.also(d => me.init(this, d)) },
            beforeRender (this: Module) { Delay.also(d => me.render(this.get(), d)) },
            updated (this: Module) { Delay.also(d => me.update(this.get(), d)) },
            beforeDestroy () { Delay.also(d => me.destroy(d)) }
        }
    }
}
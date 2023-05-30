import { track, trigger } from "./effect"

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);



function createGetter(isReadonly = false){
    return function(target,key){
        const res = Reflect.get(target,key)
        if(!isReadonly){
            // 依赖收集
            track(target,key) 
        }
        return res
    }
}

function createSetter(){
    return function(target,key,value){
        const bool = Reflect.set(target,key,value)

        // 触发依赖
        trigger(target,key)
        return bool
    }
}

export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target,key,value){
        console.warn(`key:${key} set失败,因为target是 readonly `,target)
        return true;
    }
}

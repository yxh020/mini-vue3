import { extend, isObject } from "../shared";
import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true,true);


function createGetter(isReadonly = false,shallow = false){
    return function(target,key){
        
        if(key === ReactiveFlags.IS_REACTIVE){
            return !isReadonly
        }else if(key === ReactiveFlags.IS_READONLY){
            return isReadonly
        }

        const res = Reflect.get(target,key)

        if(shallow){
            return res
        }

        // 看看res是不是object
        if(isObject(res)){
            return isReadonly ? readonly(res) : reactive(res)
        }
      

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

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
})
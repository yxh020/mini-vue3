import { isReactive,isReadonly,shallowReadonly } from "../reactive"


describe('shallowReadonly', () => { 
    test('should first', () => {
        const props = shallowReadonly({ n: { foo: 1}})
        expect(isReadonly(props)).toBe(true)
        expect(isReadonly(props.n)).toBe(false)

    })    
})
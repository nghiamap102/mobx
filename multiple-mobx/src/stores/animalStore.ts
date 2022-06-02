import { computed, configure, makeAutoObservable, when } from "mobx"

export default class AnimalStore {
    name
    energyLevel
    constructor(name: string) {
        this.name = name
        this.energyLevel = 100
        makeAutoObservable(this)
        when(
            () => this.isHungry,
            () => this.a
        )
        configure({
            useProxies: "never",
            computedRequiresReaction: true
        })
    }

    @computed reduceEnergy() {
        this.energyLevel -= 10
    }

    get isHungry() {
        return this.energyLevel < 10
    }
    get a() {
        return this.energyLevel < 100;
    }
}

// const giraffe = new AnimalStore("Gary")

// reaction(() => giraffe.a, isHungry => {
//     console.log(isHungry);
//     if (isHungry) {
//         console.log("Now I'm hungry!")
//     } else {
//         console.log("I'm not hungry!")
//     }
//     console.log("Energy level:", giraffe.energyLevel)
// }
// )

// for (let i = 0; i < 10; i++) {
//     giraffe.reduceEnergy()
// }

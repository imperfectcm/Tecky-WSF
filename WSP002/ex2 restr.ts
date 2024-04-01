class Monster {
    private hp: number;
    private name: string;

    constructor() {
        this.hp = 300;
        this.name = `monster`
    }

    injure(damage: number) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
        }
    }

    getHP() {
        return this.hp
    }

    getName() {
        return this.name
    }
    // You can use the `Monster` before
}

const monster = new Monster();

interface Attack {
    damage: number;
    name: string;
    punch(): void
}

class BowAndArrow implements Attack {
    damage: number;
    name: string
    constructor(damage: number) {
        this.damage = damage
        this.name = "Bow And Arrow"
    }
    punch() { monster.injure(this.damage) }
}

class ThrowingSpear implements Attack {
    damage: number;
    name: string
    constructor(damage: number) {
        this.damage = damage
        this.name = "Throwing Spear"
    }
    punch() { monster.injure(this.damage) }
}

class Swords implements Attack {
    damage: number;
    name: string
    constructor(damage: number) {
        this.damage = damage
        this.name = "Swords"
    }
    punch() { monster.injure(this.damage) }
}

class MagicSpells implements Attack {
    damage: number;
    name: string
    constructor(damage: number) {
        this.damage = damage
        this.name = "Magic Spells"
    }
    punch() { monster.injure(this.damage) }
}

// class Job {
//     primary: Attack;
//     secondary: Attack;
//     constructor(primary: Attack, secondary: Attack) {
//         this.primary = primary;
//         this.secondary = secondary;
//     }
// }

// const Amazon = new Job(new BowAndArrow(30), new ThrowingSpear(40));
// const Paladin = new Job(new Swords(50), new MagicSpells(25));
// const Barbarian = new Job (new Swords(55), new ThrowingSpear(30));

class Player {
    private primary!: Attack;
    private secondary!: Attack;
    private usePrimaryAttack: boolean;
    private jobTitle!: string
    constructor(name: string, job: string) {
        this.usePrimaryAttack = true;
        this.jobTitle = name
        switch (job) {
            case `Amazon`:
                this.primary = new BowAndArrow(30);
                this.secondary = new ThrowingSpear(40);

                break;
            case `Paladin`:
                this.primary = new Swords(50);
                this.secondary = new MagicSpells(25);

                break;
            case `Barbarian`:
                this.primary = new Swords(55);
                this.secondary = new ThrowingSpear(30);

                break;
        }
        // TODO: set the default value of usePrimaryAttack
    }

    attack(monster: Monster): void {
        if (this.usePrimaryAttack) {
            this.primary.punch()
            console.log(`Player ${this.jobTitle} attacks a ${monster.getName()} with using ${this.primary.name} (HP: ${monster.getHP()})`)
            this.gainExperience(Math.random())
            // TODO: use primary attack
        } else {
            this.secondary.punch()
            console.log(`Player ${this.jobTitle} attacks a ${monster.getName()} with using ${this.secondary.name} (HP: ${monster.getHP()})`)
            this.gainExperience(Math.random())
            // TODO: use secondary attack
        }
    }

    switchAttack() {
        if (this.usePrimaryAttack == true) {
            this.usePrimaryAttack = false
        } else {
            this.usePrimaryAttack = true
        }
        // TODO: Change the attack mode for this player
    }

    gainExperience(exp: number) {
        if (exp > 0.5) {
            this.switchAttack()
        }
    }
}

const amazon = new Player(`Alice`, `Amazon`);
const paladin = new Player(`Ben`, `Paladin`);
const barbarian = new Player(`Chris`, `Barbarian`);

function AllAttack() {
    while (monster.getHP() > 0) {
        amazon.attack(monster);
        paladin.attack(monster);
        barbarian.attack(monster);
    }
}

AllAttack()
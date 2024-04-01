class Monster {
    private hp: number;
    private name: string;

    constructor() {
        this.hp = 200;
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
    action: () => void
}

class BowAndArrow implements Attack {
    damage: number;
    name: string
    constructor(damage: number) {
        this.damage = damage
        this.name = "Bow And Arrow"
    }
    action() {
        monster.injure(this.damage)
    }
}

class ThrowingSpear implements Attack {
    damage: number;
    name: string
    constructor(damage: number) {
        this.damage = damage
        this.name = "Throwing Spear"
    }
    action(){
        monster.injure(this.damage)
    }
}

class Swords implements Attack {
    damage: number;
    name: string
    constructor(damage: number) {
        this.damage = damage
        this.name = "Swords"
    }
    action() {
        monster.injure(this.damage)
    }
}

class MagicSpells implements Attack {
    damage: number;
    name: string
    constructor(damage: number) {
        this.damage = damage
        this.name = "Magic Spells"
    }
    action() {
        monster.injure(this.damage)
    }
}

interface Player {
    attack(monster: Monster): void;
    switchAttack(): void;
    gainExperience(exp: number): void;
}

class Amazon implements Player {
    protected primary: Attack;
    protected secondary: Attack;
    private usePrimaryAttack: boolean;
    constructor() {
        this.primary = new BowAndArrow(30/*Need some params here*/);
        this.secondary = new ThrowingSpear(40/*Need some params here*/);
        this.usePrimaryAttack = true;
        // TODO: set the default value of usePrimaryAttack
    }


    attack(monster: Monster): void {
        if (this.usePrimaryAttack) {
            this.primary.action()
            console.log(`Player ${this.constructor.name} attacks a ${monster.getName()} with using ${this.primary.name} (HP: ${monster.getHP()})`)
            this.gainExperience(Math.random())
            // TODO: use primary attack
        } else {
            this.secondary.action()
            console.log(`Player ${this.constructor.name} attacks a ${monster.getName()} with using ${this.secondary.name} (HP: ${monster.getHP()})`)
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
    //.. The remaining methods.
}

class Paladin extends Amazon {
    constructor() {
        super()
        this.primary = new Swords(50);
        this.secondary = new MagicSpells(25);
    }
}

class Barbarian extends Amazon {
    constructor() {
        super()
        this.primary = new Swords(55);
        this.secondary = new ThrowingSpear(30);
    }
}

const amazon = new Amazon();
const paladin = new Paladin();
const barbarian = new Barbarian();

function Attack() {
    while (monster.getHP() != 0) {
        amazon.attack(monster);
        paladin.attack(monster);
        barbarian.attack(monster);
    }
}

Attack()


// Declaration of Class and its methods
class Player {
    private strength: number;
    private name: string;
    private exp: number;

    constructor(strength: number, name: string) {
        this.strength = strength;
        this.name = name;
        this.exp = 0;
    }

    attack(monster: Monster) {
        if (this.exp < 1) {
            monster.injure(this.strength);
            console.log(`Player ${player.getName()} attacks a ${monster.getName()} (HP: ${monster.getHP()})`)
        } else {
            monster.injure(this.strength);
            monster.injure(this.strength);
            console.log(`Player ${player.getName()} attacks a ${monster.getName()} (HP: ${monster.getHP()}) [CRITICAL]`)
            this.exp = 0;
        }
        this.gainExperience(Math.random());
    }

    gainExperience(exp: number) {
        this.exp += exp;
    }

    getName() {
        return this.name
    }

    getExp() {
        return this.exp
    }
}

class Monster {
    private hp: number;
    private name: string;

    constructor() {
        this.hp = 100;
        this.name = `monster`
    }

    injure(damage: number) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
        }
        
    }
    // Think of how to write injure

    getHP() {
        return this.hp
    }

    getName() {
        return this.name
    }
}

// Invocations of the class and its methods
const player = new Player(10, "Peter");
const monster = new Monster();
// player.attack(monster);
// English counterpart: Player attacks monster

function Attack() {
    while (monster.getHP() != 0) {
        player.attack(monster);
    } 
}

Attack()
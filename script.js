import { placementMapStart }  from "./placement.js"
import { healthImage, heroImage, wallImage, enemyImage, floorImage, swordImage } from "./items.js"


// ?     движение игрока идёт так:
// *     у нас есть график x, y
// *     + x   = вправо
// *     - x   = влево
// *     + y   = вниз
// *     - y   = вверх





var cellSize = 20
var mapWidth = 580
var mapHeight = 400
var cellRow = 29
var cellCol = 20


//  ? Контроллер движений героя
let isKeyPressed = false;

document.addEventListener('keydown', (event) => {
    if (!isKeyPressed) {
        isKeyPressed = true;
        const keydown = event.key;
        hero.listenerKeyBoard(keydown);
    }
    event.preventDefault();
});

document.addEventListener('keyup', () => {
    isKeyPressed = false;
});

const hpDiv = document.getElementById('hp')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const container = document.querySelector('.container')

canvas.width = mapWidth
canvas.height = mapHeight









function returnRandomCol() {
    const randomCol = Math.floor(Math.random() * cellCol)
    return randomCol
}

function returnRandomRow() {
    const randomRow = Math.floor(Math.random() * cellRow)
    return randomRow
}










class Map {
    constructor() {

    }
    renderMap() {
        for (let col = 0; col < placementMapStart.length; col++) {
            for (let row = 0; row < placementMapStart[col].length; row++) {
                if (placementMapStart[col][row] === 0) {
                    ctx.drawImage(floorImage, (row * cellSize), (col * cellSize), cellSize, cellSize)
                } else {
                    ctx.drawImage(wallImage, (row * cellSize), (col * cellSize), cellSize, cellSize)
                }
            }
        }
    }
    canMoveUp(heroPositionCol, heroPositionRow) {
        if (placementMapStart[heroPositionCol - 1][heroPositionRow] === 0) {
            return true
        } else {
            return false
        }
    }
    canMoveBack(heroPositionCol, heroPositionRow) {
        if (placementMapStart[heroPositionCol + 1][heroPositionRow] === 0) {
            return true
        } else {
            return false
        }
    }
    canMoveLeft(heroPositionCol, heroPositionRow) {
        if (placementMapStart[heroPositionCol][heroPositionRow - 1] === 0) {
            return true
        } else {
            return false
        }
    }
    canMoveRight(heroPositionCol, heroPositionRow) {
        if (placementMapStart[heroPositionCol][heroPositionRow + 1] === 0) {
            return true
        } else {
            return false
        }
    }

    checkEnemyAround(heroPositionCol, heroPositionRow) {
        const rows = placementMapStart.length
        const columns = placementMapStart[0].length

        const results = {
            positionI: null,
            positionY: null,
            result: false
        }

        for (let i = heroPositionCol - 1; i <= heroPositionCol + 1; i++) {
            for (let j = heroPositionRow - 1; j <= heroPositionRow + 1; j++) {
                if (i >= 0 && i < rows && j >= 0 && j < columns && (i !== heroPositionCol || j !== heroPositionRow)) {
                    if (placementMapStart[i][j] === 3) {
                        results.positionI = i
                        results.positionY = j
                        results.result = true
                        return results
                    }
                }
            }
        }
        return false;
    }

    canTakeObject(heroPositionCol, heroPositionRow) {
        const rows = placementMapStart.length
        const columns = placementMapStart[0].length

        const results = {
            positionI: null,
            positionY: null,
            result: false
        }

        for (let i = heroPositionCol - 1; i <= heroPositionCol + 1; i++) {
            for (let j = heroPositionRow - 1; j <= heroPositionRow + 1; j++) {
                if (i >= 0 && i < rows && j >= 0 && j < columns && (i !== heroPositionCol || j !== heroPositionRow)) {
                    if (placementMapStart[i][j] === 4 || placementMapStart[i][j] === 5) {
                        results.positionI = i
                        results.positionY = j
                        results.result = true
                        return results
                    }
                }
            }
        }
        return false;
    }
}


class Hero {
    heroPositionCol = null
    heroPositionRow = null


    damage = 30
    hp = 200
    constructor() {
        hpDiv.style.width = (this.hp / 8) + 'px'
        hpDiv.style.top = (this.heroPositionCol * cellSize) + 'px'
        hpDiv.style.left = (this.heroPositionRow * cellSize) + 'px'
        hpDiv.style.transform = `translate(${(this.heroPositionRow * cellSize)}px, 0px)`
    }

    renderHero() {
        const randomCol = returnRandomCol()
        const randomRow = returnRandomRow()
        

        if (placementMapStart[randomCol][randomRow] === 0) {
            this.heroPositionCol = randomCol
            this.heroPositionRow = randomRow
            placementMapStart[randomCol][randomRow] = 2
            ctx.drawImage(heroImage, (randomRow * cellSize), (randomCol * cellSize), cellSize, cellSize)
        } else {
            this.renderHero()
        }

        hpDiv.style.top = (this.heroPositionCol * cellSize) + 'px'
        hpDiv.style.left = (this.heroPositionRow * cellSize) + 'px'
        hpDiv.style.transform = `translate(${(this.heroPositionRow * cellSize)}, 5)`
    }
    attack() {
        if (map.checkEnemyAround(this.heroPositionCol, this.heroPositionRow)) {
            console.log('атаковать!')
            const result = map.checkEnemyAround(this.heroPositionCol, this.heroPositionRow)
            enemy.getDamage(result.positionI, result.positionY, this.damage)
        } else {
            console.log('некого атаковать!')
        }
    }
    listenerKeyBoard(keyboard) {
        if (keyboard === 'w' || keyboard === 'ц') {
            if (map.canMoveUp(this.heroPositionCol, this.heroPositionRow)) {
                // ? 1 старую клетку делаем полом в массиве
                placementMapStart[this.heroPositionCol][this.heroPositionRow] = 0

                // ? 2 изменяем местоположение героя на актуальное
                ctx.drawImage(heroImage, (this.heroPositionRow * cellSize), ((this.heroPositionCol - 1) * cellSize), cellSize, cellSize)

                // ? 3 стираем старого героя полом
                ctx.drawImage(floorImage, (this.heroPositionRow * cellSize), (this.heroPositionCol * cellSize), cellSize, cellSize)
                
                // ? 4 изменяем координаты в классе
                this.heroPositionCol = this.heroPositionCol - 1

                // ? 5 изменяем новое положение в массиве
                placementMapStart[this.heroPositionCol][this.heroPositionRow] = 2
            }
        }

        if (keyboard === 's' || keyboard === 'ы') {
            if (map.canMoveBack(this.heroPositionCol, this.heroPositionRow)) {
                // ? 1 старую клетку делаем полом в массиве
                placementMapStart[this.heroPositionCol][this.heroPositionRow] = 0

                // ? 2 изменяем местоположение героя на актуальное
                ctx.drawImage(heroImage, (this.heroPositionRow * cellSize), ((this.heroPositionCol + 1) * cellSize), cellSize, cellSize)

                // ? 3 стираем старого героя полом
                ctx.drawImage(floorImage, (this.heroPositionRow * cellSize), (this.heroPositionCol * cellSize), cellSize, cellSize)
                
                // ? 4 изменяем координаты в классе
                this.heroPositionCol = this.heroPositionCol + 1

                // ? 5 изменяем новое положение в массиве
                placementMapStart[this.heroPositionCol][this.heroPositionRow] = 2
            }
        }

        if (keyboard === 'a' || keyboard === 'ф') {
            if (map.canMoveLeft(this.heroPositionCol, this.heroPositionRow)) {
                // ? 1 старую клетку делаем полом в массиве
                placementMapStart[this.heroPositionCol][this.heroPositionRow] = 0

                // ? 2 изменяем местоположение героя на актуальное
                ctx.drawImage(heroImage, ((this.heroPositionRow - 1) * cellSize), (this.heroPositionCol * cellSize), cellSize, cellSize)

                // ? 3 стираем старого героя полом
                ctx.drawImage(floorImage, (this.heroPositionRow * cellSize), (this.heroPositionCol * cellSize), cellSize, cellSize)
                
                // ? 4 изменяем координаты в классе
                this.heroPositionRow = this.heroPositionRow - 1

                // ? 5 изменяем новое положение в массиве
                placementMapStart[this.heroPositionCol][this.heroPositionRow] = 2
            }
        }

        if (keyboard === 'd' || keyboard === 'в') {
            if (map.canMoveRight(this.heroPositionCol, this.heroPositionRow)) {
                // ? 1 старую клетку делаем полом в массиве
                placementMapStart[this.heroPositionCol][this.heroPositionRow] = 0

                // ? 2 изменяем местоположение героя на актуальное
                ctx.drawImage(heroImage, ((this.heroPositionRow + 1) * cellSize), (this.heroPositionCol * cellSize), cellSize, cellSize)

                // ? 3 стираем старого героя полом
                ctx.drawImage(floorImage, (this.heroPositionRow * cellSize), (this.heroPositionCol * cellSize), cellSize, cellSize)
                
                // ? 4 изменяем координаты в классе
                this.heroPositionRow = this.heroPositionRow + 1

                // ? 5 изменяем новое положение в массиве
                placementMapStart[this.heroPositionCol][this.heroPositionRow] = 2
            }
        }

        if (keyboard === ' ') {
            this.attack()
        }

        if (keyboard === 'e' || keyboard === 'у') {
            if (map.canTakeObject(this.heroPositionCol, this.heroPositionRow)) {
                const result = map.canTakeObject(this.heroPositionCol, this.heroPositionRow)
                if (placementMapStart[result.positionI][result.positionY] === 4) {
                    placementMapStart[result.positionI][result.positionY] = 0
                    this.getHeath()
                    ctx.clearRect((result.positionY * cellSize), (result.positionI * cellSize), cellSize, cellSize)
                    ctx.drawImage(floorImage,(result.positionY * cellSize), (result.positionI * cellSize), cellSize, cellSize)
                }
                if (placementMapStart[result.positionI][result.positionY] === 5) {
                    placementMapStart[result.positionI][result.positionY] = 0
                    this.getSword()
                    ctx.clearRect((result.positionY * cellSize), (result.positionI * cellSize), cellSize, cellSize)
                    ctx.drawImage(floorImage,(result.positionY * cellSize), (result.positionI * cellSize), cellSize, cellSize)
                }
            }
        }

        hpDiv.style.top = (this.heroPositionCol * cellSize) + 'px'
        hpDiv.style.left = (this.heroPositionRow * cellSize) + 'px'
        hpDiv.style.transform = `translate(${(this.heroPositionRow * cellSize)}, 5)`


        if (enemy.enemies.length < 1) {
            setTimeout(() => {
                alert('you win')
            }, 500)
            setTimeout(() => {
                location.reload()
            }, 1500)
        }
    }
    attackedFromEnemy() {
        if (this.hp < 1) {
            alert('Вы проиграли!')
            location.reload()
        }
        this.hp = this.hp - 30

        hpDiv.style.backgroundColor = 'red'
        setTimeout(() => {
            hpDiv.style.backgroundColor = 'green'
        }, 1500)

        hpDiv.style.width = (this.hp / 8) + 'px'
    }

    getHeath() {
        this.hp = this.hp + 20  
        hpDiv.style.width = (this.hp / 8) + 'px'                                  
    }
    getSword() {
        this.damage = this.damage + 20
    }
}


class Enemy {
    enemyPositionCol = null
    enemyPositionRow = null
    enemies = []
    hp = 100
    damage = 50
    constructor() {
    }
    renderEnemy() {
        const randomCol = returnRandomCol()
        const randomRow = returnRandomRow()
        if (placementMapStart[randomCol][randomRow] === 0) {

            const hpDiv = document.createElement('div')
            hpDiv.classList.add('hpEnemyDiv')
            container.appendChild(hpDiv)


            this.enemyPositionCol = randomCol
            this.enemyPositionRow = randomRow
            this.enemies.push({x: this.enemyPositionCol, y: this.enemyPositionRow, hp: this.hp, damage: this.damage, hpDiv: hpDiv})
            placementMapStart[randomCol][randomRow] = 3
            ctx.drawImage(enemyImage, (randomRow * cellSize), (randomCol * cellSize), cellSize, cellSize)
        } else {
            this.renderEnemy()
        }

    }
    getDamage(positionX, positionY, damage) {
        this.enemies.forEach((enemy, index) => {
            if (enemy.x == positionX && enemy.y == positionY) {
                console.log('меня атаковать', enemy)
                enemy.hp = enemy.hp - damage
                if (enemy.hp < 1) {
                    this.enemies[index].hp = 0
                    this.enemies[index].hpDiv.style.opacity = '0%'
                    this.enemies = this.enemies.filter((item) => item.hp > 1)
                    placementMapStart[enemy.x][enemy.y] = 0
                    ctx.drawImage(floorImage, (enemy.y * cellSize), (enemy.x * cellSize), cellSize, cellSize)
                }
            }
        })
    }
    move() {
        for (let i = 0; i < this.enemies.length; i++) {
            const randomDirection = ['w', 's', 'a', 'd']
            const randomDirectionIndex = Math.floor(Math.random() * randomDirection.length)

            if (randomDirection[randomDirectionIndex] === 'w') {
                if (placementMapStart[this.enemies[i].x - 1][this.enemies[i].y] === 0 ) {
                    // 1
                    placementMapStart[this.enemies[i].x][this.enemies[i].y] = 0
                    // 2 nemyImage
                    ctx.drawImage(enemyImage, (this.enemies[i].y * cellSize), ((this.enemies[i].x - 1) * cellSize), cellSize, cellSize)
                    // 3
                    ctx.drawImage(floorImage, (this.enemies[i].y *  cellSize), (this.enemies[i].x * cellSize), cellSize, cellSize)
                    // 4 
                    this.enemies[i].x = this.enemies[i].x - 1
                    // 5
                    placementMapStart[this.enemies[i].x][this.enemies[i].y] = 3
                } 
                if (placementMapStart[this.enemies[i].x - 1][this.enemies[i].y] === 2 ) {
                    hero.attackedFromEnemy()
                }
            }

            if (randomDirection[randomDirectionIndex] === 's') {
                if (placementMapStart[this.enemies[i].x + 1][this.enemies[i].y] === 0 ) {
                    // 1
                    placementMapStart[this.enemies[i].x][this.enemies[i].y] = 0
                    // 2 nemyImage
                    ctx.drawImage(enemyImage, (this.enemies[i].y * cellSize), ((this.enemies[i].x + 1) * cellSize), cellSize, cellSize)
                    // 3
                    ctx.drawImage(floorImage, (this.enemies[i].y *  cellSize), (this.enemies[i].x * cellSize), cellSize, cellSize)
                    // 4 
                    this.enemies[i].x = this.enemies[i].x + 1
                    // 5
                    placementMapStart[this.enemies[i].x][this.enemies[i].y] = 3
                } 
                if (placementMapStart[this.enemies[i].x + 1][this.enemies[i].y] === 2 ) {
                    hero.attackedFromEnemy()
                }
            }

            if (randomDirection[randomDirectionIndex] === 'a') {
                if (placementMapStart[this.enemies[i].x][this.enemies[i].y - 1] === 0 ) {
                    // 1
                    placementMapStart[this.enemies[i].x][this.enemies[i].y] = 0
                    // 2 nemyImage
                    ctx.drawImage(enemyImage, ((this.enemies[i].y - 1) * cellSize), (this.enemies[i].x * cellSize), cellSize, cellSize)
                    // 3
                    ctx.drawImage(floorImage, (this.enemies[i].y *  cellSize), (this.enemies[i].x * cellSize), cellSize, cellSize)
                    // 4 
                    this.enemies[i].y = this.enemies[i].y - 1
                    // 5
                    placementMapStart[this.enemies[i].x][this.enemies[i].y] = 3
                } 
                if (placementMapStart[this.enemies[i].x][this.enemies[i].y - 1] === 2 ) {
                    hero.attackedFromEnemy()
                }
            }

            if (randomDirection[randomDirectionIndex] === 'd') {
                if (placementMapStart[this.enemies[i].x][this.enemies[i].y + 1] === 0 ) {
                    // 1
                    placementMapStart[this.enemies[i].x][this.enemies[i].y] = 0
                    // 2 nemyImage
                    ctx.drawImage(enemyImage, ((this.enemies[i].y + 1) * cellSize), (this.enemies[i].x * cellSize), cellSize, cellSize)
                    // 3
                    ctx.drawImage(floorImage, (this.enemies[i].y *  cellSize), (this.enemies[i].x * cellSize), cellSize, cellSize)
                    // 4 
                    this.enemies[i].y = this.enemies[i].y + 1
                    // 5
                    placementMapStart[this.enemies[i].x][this.enemies[i].y] = 3
                } 
                if (placementMapStart[this.enemies[i].x][this.enemies[i].y + 1] === 2 ) {
                    hero.attackedFromEnemy()
                }
            }

            this.enemies[i].hpDiv.style.top = (this.enemies[i].x * cellSize) + 'px'
            this.enemies[i].hpDiv.style.left = (this.enemies[i].y * cellSize) + 'px'
            this.enemies[i].hpDiv.style.width = (this.enemies[i].hp / 7) + 'px'
        }
    }
}




class Health{
    constructor() {

    }
    renderHealth() {

        const randomCol = returnRandomCol()
        const randomRow = returnRandomRow()
        if (placementMapStart[randomCol][randomRow] === 0) {


            placementMapStart[randomCol][randomRow] = 4
            ctx.drawImage(healthImage, (randomRow * cellSize), (randomCol * cellSize), cellSize, cellSize)
        } else {
            this.renderHealth()
        }
    }
}


class Sword{
    constructor() {

    }
    renderSword() {


        const randomCol = returnRandomCol()
        const randomRow = returnRandomRow()
        if (placementMapStart[randomCol][randomRow] === 0) {


            placementMapStart[randomCol][randomRow] = 5
            ctx.drawImage(swordImage, (randomRow * cellSize), (randomCol * cellSize), cellSize, cellSize)
        } else {
            this.renderSword()
        }
    }
}


const map = new Map()
map.renderMap()

const health = new Health()
health.renderHealth()
health.renderHealth()
health.renderHealth()
health.renderHealth()
health.renderHealth()
health.renderHealth()
health.renderHealth()
health.renderHealth()
health.renderHealth()
health.renderHealth()

const sword = new Sword()
sword.renderSword()
sword.renderSword()

const hero = new Hero()
hero.renderHero()

const enemy = new Enemy()
enemy.renderEnemy()
enemy.renderEnemy()
enemy.renderEnemy()
enemy.renderEnemy()
enemy.renderEnemy()
enemy.renderEnemy()
enemy.renderEnemy()
enemy.renderEnemy()
enemy.renderEnemy()

setInterval(() => {
    enemy.move()

}, 750)




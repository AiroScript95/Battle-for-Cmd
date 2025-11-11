const { clear } = require("node:console");
const rl = require("node:readline");
const prompt = rl.createInterface({
    input: process.stdin,
    output: process.stdout
});

const { cenaAtaqueMamori, cenaDefesaMamori, bodyPlayer, bodyEnnemy, vs } = require('./animacoes');
const { player, ennemy } = require('./personagem');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function combatVisual() {
    console.clear();
    console.log("🧠 Preparando combate...");
    await delay(1000);
    console.log(bodyEnnemy);
    await delay(1000);
    console.log(vs);
    await delay(1000);
    console.log(bodyPlayer);
    await delay(1000);
    console.clear();
}

function exibirStatus() {
    console.log(`\n📊 Status de ${player.name}: HP=${player.heath.toFixed(2)}, DEF=${player.defender.toFixed(2)}, RES=${player.resitence.toFixed(2)}`);
    console.log(`📊 Status de ${ennemy.name}: HP=${ennemy.heath.toFixed(2)}, DEF=${ennemy.defender.toFixed(2)}, RES=${ennemy.resitence.toFixed(2)}\n`);
}

function atacarEnemy() {
    let dano = player.attack - (ennemy.defender / 10);
    dano = dano > 0 ? dano : 1;
    ennemy.heath -= dano;
    console.log(`🗡️ ${player.name} causou ${dano.toFixed(2)} de dano a ${ennemy.name}.`);
}
function atacarPlayer() {
    let dano = ennemy.attack - (player.defender / 10);
    dano = dano > 0 ? dano : 1;
    player.heath -= dano;
    console.log(`🗡️ ${ennemy.name} causou ${dano.toFixed(2)} de dano a ${player.name}.`);
}

function defesaPlayer() {
    let res = player.heath + player.defender + player.resitence;
    res = (res - 15) / 3;
    player.heath = res;
    player.defender = res;
    player.resitence = res;
    console.log(`🛡️ - Defesa de ${player.name} redistribuída: ${res.toFixed(2)} em cada atributo defensivo.`);
}
function defesaEnnemy() {
    let res = ennemy.heath + ennemy.defender + ennemy.resitence;
    res = (res - 15) / 3;
    ennemy.heath = res;
    ennemy.defender = res;
    ennemy.resitence = res;
    console.log(`🛡️ - Defesa de ${ennemy.name} redistribuída: ${res.toFixed(2)} em cada atributo defensivo.`);
}

function verificarFim() {
    if (ennemy.heath <= 0) {
        console.log(`🎉 Você derrotou ${ennemy.name}!`);
        prompt.close();
        return true;
    } else if (player.heath <= 0) {
        console.log(`💀 ${player.name} foi derrotado...`);
        prompt.close();
        return true;
    }
    return false;
}

function menuDeAcao() {
    console.log("╔══════════════════════╗");
    console.log("║     MENU DE AÇÃO     ║");
    console.log("╠══════════════════════╣");
    console.log("║ 1. Atacar            ║");
    console.log("║ 2. Defender          ║");
    console.log("║ 3. Fugir             ║");
    console.log("╚══════════════════════╝");
}

function turnoEnemyAttack() {
    console.log(`${ennemy.name} Vai atacar`);
    cenaAtaqueMamori();
    atacarPlayer();
}
function turnoEnemyDefender() {
    console.log(`${ennemy.name} Defendeu-se`);
    cenaDefesaMamori();
    defesaEnnemy();
}

function turnoEnemy() {
    console.log(bodyEnnemy);
    console.log("Turno Oponente");
    const acao = Math.random() < 0.5 ? "atacar" : "defender";
    if (acao === "atacar") {
        turnoEnemyAttack();
    } else {
        turnoEnemyDefender();
    }
}
function turnoPlayer() {
    console.log(bodyPlayer);
    console.log("Turno do player");
    menuDeAcao();
    prompt.question("Escolha uma opção (1-3): ", resposta => {
        switch (resposta.trim()) {
            case "1":
                console.log("🗡️ Você escolheu atacar!");
                atacarEnemy();
                turnoEnemy();
                break;
            case "2":
                console.log("🛡️ Você escolheu defender!");
                defesaPlayer();
                turnoEnemy();
                break;
            case "3":
                console.log("🏃 Você fugiu da batalha!");
                prompt.close();
                return;
            default:
                console.log("❌ Opção inválida. Tente novamente.");
                return turnoPlayer();
        }
        exibirStatus();


        if (!verificarFim()) {
            turnoPlayer();
        }
    });
}

prompt.question('Deseja lutar (Y / N): ', async answer => {
    const option = answer.toLowerCase();
    switch (option) {
        case "y":
            await combatVisual();
            turnoPlayer();
            break;
        case "n":
            console.log("Combate cancelado");
            prompt.close();
            break;
        default:
            console.warn('!Erro!');
            console.log("#Valor Invalido#");
            prompt.close();
            break;
    }
});

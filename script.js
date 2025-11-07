const suits = [
    { symbol: '♥', color: 'red' },
    { symbol: '♦', color: 'red' },
    { symbol: '♣', color: 'black' },
    { symbol: '♠', color: 'black' }
];
const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

// Бесконечная колода — берём случайную карту
function randomCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    return { value, suit };
}

function cardValue(value) {
    if (value === 'A') return 14;
    if (value === 'K') return 13;
    if (value === 'Q') return 12;
    if (value === 'J') return 11;
    return parseInt(value);
}

let player1Card = null;
let player2Card = null;

// Получаем элементы для игрока
function getElems(player) {
    if (player === 1) {
        return {
            inner: document.getElementById('cardInner1'),
            front: document.getElementById('cardFront1')
        };
    } else {
        return {
            inner: document.getElementById('cardInner2'),
            front: document.getElementById('cardFront2')
        };
    }
}

// Один переворот (для одной карты)
function showCardOnce(player, card, isFinal) {
    const { inner, front } = getElems(player);

    // Обновляем содержимое лицевой стороны до переворота
    front.className = 'card-face card-front ' + card.suit.color;
    front.innerHTML = `
        <div class="corner top">${card.value}<br>${card.suit.symbol}</div>
        <div class="center">${card.suit.symbol}</div>
        <div class="corner bottom">${card.value}<br>${card.suit.symbol}</div>
    `;

    // Запускаем переворот: показываем front
    inner.classList.add('flip');

    // Если это не финальная карта — возвращаемся к рубашке
    if (!isFinal) {
        setTimeout(() => {
            inner.classList.remove('flip');
        }, 600);
    }
}

// Пролистывание нескольких карт
function drawCards(player, count) {
    const flipDuration = 700; // мс между картами
    let delay = 0;
    let finalCard = null;

    for (let i = 0; i < count; i++) {
        const card = randomCard();
        finalCard = card;
        const isFinal = (i === count - 1);

        setTimeout(() => {
            showCardOnce(player, card, isFinal);
        }, delay);

        delay += flipDuration;
    }

    // После последнего переворота фиксируем финальную карту игрока
    setTimeout(() => {
        if (player === 1) {
            player1Card = finalCard;
        } else {
            player2Card = finalCard;
        }
        checkWinner();
    }, delay + 50);
}

// Определяем победителя
function checkWinner() {
    const resultDiv = document.getElementById('result');

    if (player1Card && player2Card) {
        const v1 = cardValue(player1Card.value);
        const v2 = cardValue(player2Card.value);

        if (v1 > v2) {
            resultDiv.textContent = '🏆 Победил Игрок 1!';
            resultDiv.style.color = 'lime';
        } else if (v2 > v1) {
            resultDiv.textContent = '🏆 Победил Игрок 2!';
            resultDiv.style.color = 'gold';
        } else {
            resultDiv.textContent = '🤝 Ничья!';
            resultDiv.style.color = 'white';
        }

        // Сброс через 3.5 секунды
        setTimeout(() => {
            player1Card = null;
            player2Card = null;
            resultDiv.textContent = '';

            // Возвращаем обе карты в состояние рубашки
            resetCard(1);
            resetCard(2);
        }, 3500);
    }
}

function resetCard(player) {
    const { inner, front } = getElems(player);
    inner.classList.remove('flip');
    front.className = 'card-face card-front';
    front.innerHTML = ''; // спрятана, видна рубашка
}

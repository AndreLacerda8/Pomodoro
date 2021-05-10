//deixar mudar os valores iniciais de trabalho, pausa e sessões
const more = document.querySelectorAll('.more-or-less i:first-child')
const less = document.querySelectorAll('.more-or-less i:last-child')
let value

more.forEach(item => item.addEventListener('click', updateValue))
less.forEach(item => item.addEventListener('click', updateValue))

function updateValue(e){
    const card = e.target.parentNode.nextElementSibling.children[0]
    let value = Number(card.innerText)
    if(e.target.classList[1] == "fa-arrow-alt-circle-up")
        value += 1
    else{
        if(value <= 1) return
        value -= 1
    }
    card.innerText = value
}

//ir para o pomodoro.html passando os valores na url
function goPomodoro(){
    const workTime = Number(document.querySelector('.work .value').innerText)
    const pauseTime = Number(document.querySelector('.pause .value').innerText)
    const sessions = Number(document.querySelector('.sessions .value').innerText)
    window.location.href = `pomodoro.html?=${workTime}=${pauseTime}=${sessions}`
}
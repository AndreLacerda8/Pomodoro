let values = window.location.search.split('=')
values = values == '' ? ['?', '25', '5', '3'] : values
let time//vai ser o setInterval, está aqui para poder limpá-lo quando pausar.

const Values = {
    workTime: Number(values[1]),
    pauseTime: Number(values[2]),
    sessions: Number(values[3]),
    options: document.querySelector('.options'),
    clock: document.querySelector('.time span'),
    seconds: 0,
    currentMode: 'work',
}


const Initialize = {
    //Colocar o tempo de trabalho e quantidade de sessões
    initialize(){
        Values.clock.innerText = `${Values.workTime}:00`;

        for(let i = Values.sessions; i > 0; i--){
            const span = document.createElement('span')
            document.querySelector('.complete-sessions').appendChild(span)
        }
    },

    goHome(){
        window.location.assign('index.html')
    }
}


const Pomodoro = {
    completeWorks: 0,
    completePauses: 0,

    startPomodoro(){
        document.querySelector('button.play').style.display = 'none'
        document.querySelector('button.pause').style.display = 'block'
        time = setInterval(Pomodoro.decreasesTime, 1000)
    },

    stopPomodoro(){
        document.querySelector('button.play').style.display = 'block'
        document.querySelector('button.pause').style.display = 'none'
        clearInterval(time)
    },

    timer: Values.currentMode == 'work' ? Values.workTime : Values.pauseTime,

    decreasesTime(){
        if(Values.seconds > 0){
            Values.seconds -= 1
        }
        else{
            Values.seconds = 59
            Pomodoro.timer -= 1
        }
        //Mostrar o tempo na tela
        Values.seconds = Values.seconds > 9 ? Values.seconds : `0${Values.seconds}`
        Values.clock.innerText = `${Pomodoro.timer}:${Values.seconds}`

        Pomodoro.updateProgress()

        //Se terminar o tempo, muda o modo, atualiza as sessões completas e zera o timer.
        if (Pomodoro.timer == 0 && Values.seconds == 0) {
            if(Values.currentMode == 'work'){
                Pomodoro.completeWorks += 1
                Values.currentMode = 'pause'
            } else {
                Pomodoro.completePauses += 1
                Values.currentMode = 'work'
            }
            Pomodoro.changeMode(Values.currentMode)
            Pomodoro.timer = Values.currentMode == 'work' ? Values.workTime : Values.pauseTime
        }
    },

    updateProgress(){
        //variáveis para modificar os linear-gradiente no css
        let progress = document.querySelector('.time')
        let totalSeconds = (Values.workTime * 60)
        let currentSeconds = (Pomodoro.timer * 60) + Values.seconds
        let currentProgress = Values.currentMode == 'work' ? 
            - (((currentSeconds * 100) / totalSeconds) - 100) : 
            (currentSeconds * 100) / totalSeconds
        let deg = 90 + (currentProgress * 3.6)
        let direction = currentProgress < 51 ? 'right' : 'left'
        let colorMode = Values.currentMode == 'work' ? 'green' : 'yellow'
        let color = currentProgress < 51 ? 'blue' : colorMode

        //linear-gradiente para dar efeito de load circular.
        progress.style.background = `
            linear-gradient(
                to ${direction},
                var(--${color}) 50%,
                transparent 50%,
                transparent
            ),
            linear-gradient(${deg.toFixed(1)}deg, var(--${colorMode}) 50%, var(--blue) 50%)
        `
    },

    changeMode(mode){
        document.getElementById('end-session').play()
        
        const time = document.querySelector('.time')
        const status = document.querySelector('.status h3')
        const completeSessions = document.querySelector('.complete-sessions')
        const completeSessionsBall = document.querySelectorAll('.complete-sessions span')
        
        //Colorir as bolinhas indicando quantas sessões foram completas
        let i = mode == 'pause' ? Pomodoro.completeWorks : Pomodoro.completePauses
        for(i = i - 1; i >= 0; i--){
            completeSessionsBall[i].classList.add('complete')
        }
        //Quando terminar todas as sessões dar os parabens
        if (Pomodoro.completeWorks == Values.sessions) {
            this.stopPomodoro()
            setTimeout(() => {
                document.getElementById('end').play()
                document.querySelector('main').innerHTML = '<strong>Parabéns, você completou todas as Sessões!</strong>'
            }, 2000)
            return
        }

        //Mudar os elementos(cores, texto, qtd de bolinhas) de acordo com o momento(trabalho ou pausa).
        if(mode == 'pause'){
            setTimeout(() => {
                time.classList.add('pause')
                status.classList.add('pause')
                document.querySelector('.time').style.background = 'var(--yellow)'
                completeSessions.classList.remove('complete-work')
                completeSessions.classList.add('complete-pause')
                completeSessionsBall[Pomodoro.completeWorks - 1].classList.remove('complete')
                status.innerText = 'Pausa'
                Values.clock.innerText = `${Values.pauseTime}:00`;
            }, 2000)
        }
        else{
            setTimeout(() => {
                time.classList.remove('pause')
                status.classList.remove('pause')
                document.querySelector('.time').style.background = 'var(--green)'
                completeSessions.classList.remove('complete-pause')
                completeSessions.classList.add('complete-work')
                status.innerText = 'Trabalho'
                Values.clock.innerText = `${Values.workTime}:00`;
            }, 2000)
        }

        this.stopPomodoro()
    }
}

Initialize.initialize()
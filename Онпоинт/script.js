/* КОНФИГУРАЦИИ */
let width = 1024; // ширина картинки
let sliderWrapper = document.querySelector("#wrapper")
let slides = sliderWrapper.querySelectorAll('.slide');
let position = 1024; // положение ленты прокрутки
let sperms = document.querySelectorAll("[name='sperm']")
let details = document.querySelector(".message_wrapper_3_3");
let fogOfWar = document.querySelector(".fog_of_war");
let swipeLock = false
details.hidden = fogOfWar.hidden = true


/* ФУНКЦИИ СВАЙП, ЗАКРЫТЬ */

let prevSlide = function() {
    position += width;
    position = Math.min(position, 0);    
    sliderWrapper.style.marginLeft = position + 'px';
        /* ОТКАТИТЬ АНИМАЦИЮ СПЕРМАТОЗОИДОВ */
        if (position == 0) {
            for (let sperm of sperms) {
                sperm.classList.remove("animate");
            }
        }   
}

let nextSlide = function() {
    position -= width;
    position = Math.max(position, -width * (slides.length-1));    
    sliderWrapper.style.marginLeft = position + 'px';
        /* ЗАПУСТИТЬ АНИМАЦИЮ СПЕРМАТОЗОИДОВ */
        if (position == -width) {
            for (let sperm of sperms) {
                sperm.classList.add("animate");
            }
        }   
}

let hideDetails = function (e) {

    details.style.animationName = "disappear"
    fogOfWar.style.animationName = "disappear"

    let changeData = function() {
        details.hidden = true
        fogOfWar.hidden = true
    }
    setTimeout(changeData, 600);

    document.querySelector(".title_3_message").innerHTML = "Ключевое сообщение"
}

let showDetails = function (e) {
    
    details.style.animationName = "appear"
    fogOfWar.style.animationName = "appear"
    
    details.hidden = false
    fogOfWar.hidden = false

    document.querySelector(".title_3_message").innerHTML = "Преимущества"
}

/* ОБРАБОТЧИКИ СВАЙПА и КНОПОК */

document.addEventListener('touchstart', function (e) {TouchStart(e)});
document.addEventListener('touchmove', function (e) {TouchMove(e)});
document.addEventListener('touchend', function (e) {TouchEnd(e)});

var touchStart = null; //Точка начала касания
var touchPosition = null; //Текущая позиция
var sensitivity = 10; // Чувствительность к "свайпу"

function TouchStart(e) {
    touchStart = {
        x: e.changedTouches[0].clientX, 
        y: e.changedTouches[0].clientY 
    };
    touchPosition = { 
        x: touchStart.x, 
        y: touchStart.y 
    };

    /* Если начали на слайдере, то отменяем свайп */
    if (e.target.closest("#thumb")) {swipeLock = true; console.log(1)}
    else {swipeLock = false}
    
    /* КНОПКА "ДОМОЙ" */
    if (e.changedTouches[0].target.closest('.header > nav')){
        sliderWrapper.style.marginLeft = position = 0;
        prevSlide();
    }
    
    /* КНОПКА "Что дельше?" */
    if (e.changedTouches[0].target.closest("[name='S1'] .button")) {
        nextSlide();
    }

    /* КНОПКА КРЕСТА "ЗАКРЫТЬ" */
    if (e.changedTouches[0].target.closest(".remove-button")) {
        hideDetails();
    }

    /* КНОПКА КРЕСТА "ПОДРОБНЕЕ" */
    if (e.changedTouches[0].target.closest("[name='S3'] .button_3_1")) {
        showDetails();
    }
}

function TouchMove(e) {
    //Получаем новую позицию
    touchPosition = {
        x: e.changedTouches[0].clientX, 
        y: e.changedTouches[0].clientY 
    };
}

function TouchEnd(e) {
    CheckAction(); //Определяем, какой жест совершил пользователь
    //Очищаем позиции
    touchStart = null;
    touchPosition = null;
}

function CheckAction()
{
    if (swipeLock) return //Если начали на слайдере, то отменяем свайп 

    let difference = {//Получаем расстояния от начальной до конечной точек по обеим осям
   	 x: touchStart.x - touchPosition.x,
   	 y: touchStart.y - touchPosition.y
    };

    if(Math.abs(difference.x) < Math.abs(difference.y)) return //Проверяем, что движение по оси Х было длиннее
    if(Math.abs(difference.x) < sensitivity) return //Проверяем, было ли движение достаточно длинным
   	 {
   		 if(difference.x > 0) //Если значение больше нуля, значит пользователь двигал пальцем справа налево
   		 {
            nextSlide();
   		 }
   		 else //Иначе он двигал им слева направо
   		 {
   			prevSlide();
   		 }
   	 }

    /* ПОВЕДЕНИЕ СЛАЙДЕРА */
 
    thumb.ontouchstart = function(event) {

      event.preventDefault();

      let shiftY = event.changedTouches[0].clientY - thumb.getBoundingClientRect().top;

      thumb.addEventListener('touchmove', onMouseMove);
      thumb.addEventListener('touchend', onMouseUp)
         
      function moveAt(pageY) {
        let newTop = pageY - shiftY - slider.getBoundingClientRect().top - 175;
        if (newTop < 0) {newTop = 0}
        let bottomEdge = slider.offsetHeight - thumb.offsetHeight
        if (newTop > bottomEdge) { newTop = bottomEdge; }
        thumb.style.top = newTop  + 'px';

        let sliderProgress = (newTop/(slider.offsetHeight- thumb.offsetHeight));
        let text = document.querySelector(".message_text")
        text.scrollTop = (text.scrollHeight-text.offsetHeight)*sliderProgress
      }

      function onMouseMove (event) {
        moveAt(event.changedTouches[0].screenY);
      }

      function onMouseUp () {
        document.removeEventListener('touchmove', onMouseMove);
        document.removeEventListener('touchend', onMouseUp)
        thumb.ontouchend = null;
      };
    }

    thumb.ondragstart = function() {
      return false;
    };
}

prevSlide();
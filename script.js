// Swiper-slider
var swiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
    effect: "fade",
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
});


// Accordion
function mySpollers() {
	const spollersArray = document.querySelectorAll('[data-spollers]');

	if (spollersArray.length > 0) {
		// Получение обычных спойлеров
		const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
			return !item.dataset.spollers.split(",")[0];
		});
		// Инициализация обычных спойлеров
		if (spollersRegular.length > 0) {
			initSpollers(spollersRegular);
		}

		// Получение спойлеров с медиа запросами
		const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
			return item.dataset.spollers.split(",")[0];
		});

		// Инициализация спойлеров с медиа запросами
		if (spollersMedia.length > 0) {
			const breakpointsArray = [];
			spollersMedia.forEach(item => {
				const params = item.dataset.spollers;
				const breakpoint = {};
				const paramsArray = params.split(",");
				breakpoint.value = paramsArray[0];
				breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
				breakpoint.item = item;
				breakpointsArray.push(breakpoint);
			});

			// Получаем уникальные брейкпоинты
			let mediaQueries = breakpointsArray.map(function (item) {
				return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
			});
			mediaQueries = mediaQueries.filter(function (item, index, self) {
				return self.indexOf(item) === index;
			});

			// Работаем с каждым брейкпоинтом
			mediaQueries.forEach(breakpoint => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);

				// Объекты с нужными условиями
				const spollersArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				// Событие
				matchMedia.addListener(function () {
					initSpollers(spollersArray, matchMedia);
				});
				initSpollers(spollersArray, matchMedia);
			});
		}
		// Инициализация
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach(spollersBlock => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add('_init');
					initSpollerBody(spollersBlock);
					spollersBlock.addEventListener("click", setSpollerAction);
				} else {
					spollersBlock.classList.remove('_init');
					initSpollerBody(spollersBlock, false);
					spollersBlock.removeEventListener("click", setSpollerAction);
				}
			});
		}
		// Работа с контентом
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
			if (spollerTitles.length > 0) {
				spollerTitles.forEach(spollerTitle => {
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabindex');
						if (!spollerTitle.classList.contains('_active')) {
							spollerTitle.nextElementSibling.hidden = true;
						}
					} else {
						spollerTitle.setAttribute('tabindex', '-1');
						spollerTitle.nextElementSibling.hidden = false;
					}
				});
			}
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
				const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
				const spollersBlock = spollerTitle.closest('[data-spollers]');
				const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
				if (!spollersBlock.querySelectorAll('._slide').length) {
					if (oneSpoller && !spollerTitle.classList.contains('_active')) {
						hideSpollersBody(spollersBlock);
					}
					spollerTitle.parentElement.classList.toggle('_active');
					spollerTitle.classList.toggle('_active');
					_slideToggle(spollerTitle.nextElementSibling, 500);
				}
				e.preventDefault();
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
			if (spollerActiveTitle) {
				spollerActiveTitle.parentElement.classList.remove('_active');
				spollerActiveTitle.classList.remove('_active');
				_slideUp(spollerActiveTitle.nextElementSibling, 500);
			}
		}
	}

	let _slideUp = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = target.offsetHeight + 'px';
			target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout(() => {
				target.hidden = true;
				target.style.removeProperty('height');
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);
		}
	}
	let _slideDown = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			if (target.hidden) {
				target.hidden = false;
			}
			let height = target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + 'ms';
			target.style.height = height + 'px';
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			window.setTimeout(() => {
				target.style.removeProperty('height');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);
		}
	}
	let _slideToggle = (target, duration = 500) => {
		if (target.hidden) {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}
}
mySpollers();


// TABS
const tabsBtns = document.querySelectorAll('.tabs-nav button');
const tabsItems = document.querySelectorAll('.tabs .tabs-item');

// функция скрывает табы и убирает active у кнопок
function hideTabs() {
    tabsItems.forEach(item => item.classList.add('hide'));
    tabsBtns.forEach(item => item.classList.remove('activetab'));
}
// функция показывает переданный номер таба и делает соответствующую ему кнопку активной.
function showTab(index) {
    tabsItems[index].classList.remove('hide');
    tabsBtns[index].classList.add('activetab');
}

hideTabs();
showTab(0);

tabsBtns.forEach((btn, index) => btn.addEventListener("click", () => {
    hideTabs();
    showTab(index);
}));


// Anchors
const anchors = document.querySelectorAll('.provider-tariff__link');

anchors.forEach(anc => {
    anc.addEventListener("click", function(event) {
        event.preventDefault();

        const id = anc.getAttribute('href');
        const elem = document.querySelector(id);

        window.scroll({
            top: elem.offsetTop,
            behavior: 'smooth'
        });
    });
});


// Модальные окна

//кнопки тарифов(Отправить) => открытие модалки с телефоном
const tariffBtns = document.querySelectorAll('.tariff-banner__form-btn');
const modalPhone = document.querySelector('.modal-phone');
tariffBtns.forEach(e => e.addEventListener('click', function() {
	modalPhone.classList.add('open');
}))

//кнопка формы блока "есть вопросы" (Оплатить тариф) => открытие модалки с телефоном
const requestBtn = document.querySelector('.request__form-btn');
requestBtn.addEventListener("click", function() {
    modalPhone.classList.add('open');
})
//кнопка модалки с калькулятором (Расчитать) => открывает следуюзую модалку с телефоном
const modalCalculatorBtn = document.querySelector('.calculator__button');
modalCalculatorBtn.addEventListener("click", function() {
    modalPhone.classList.add('open');
})

//кнопка модалки с телефоном (Закрыть) => закрывает модалку
const modalPhoneBtn = document.querySelector('.phone__button');
modalPhoneBtn.addEventListener("click", function() {
    modalPhone.classList.remove('open');
})

//клик вне модалки с телефоном
// document.querySelector('.modal-phone .modal__box-phone').addEventListener("click", event => {
//     event._isClickWithInModal = true;
// });
// modalPhone.addEventListener("click", event => {
//     if (event._isClickWithInModal) return;
//     event.currentTarget.classList.remove('open');
// });

//кнопка блока промоушен(Условия акции) => открывает модалку с акцией
const promotionBtn = document.querySelector('.promotion__button');
const modalPromotion = document.querySelector('.modal-present');
promotionBtn.addEventListener("click", function() {
    modalPromotion.classList.add('open');
})

////кнопка модалки с акцией (Закрыть) => закрывает модалку с акцией
const modalPromotionBtn = document.querySelector('.present__button');
modalPromotionBtn.addEventListener("click", function() {
    modalPromotion.classList.remove('open');
})

//клик вне модалки с акцией
document.querySelector('.modal-present .modal__box-present').addEventListener("click", event => {
    event._isClickWithInModal = true;
});
modalPromotion.addEventListener("click", event => {
    if (event._isClickWithInModal) return;
    event.currentTarget.classList.remove('open');
});


// const modal = document.querySelector('.modal');
// modal.childElement.addEventListener("click", event => {
//     event._isClickWithInModal = true;
// });
// modal.addEventListener("click", event => {
//     if (event._isClickWithInModal) return;
//     event.currentTarget.classList.remove('open');
// });















document.querySelectorAll('.welcome__button')[1].addEventListener("click", function() {
    document.querySelector('.modal-calculator').classList.add('open')
})
document.querySelector('.calculator__button').addEventListener("click", function() {
    document.querySelector('.modal-calculator').classList.remove('open')
})
document.querySelector('.modal-calculator .modal__box-calculator').addEventListener("click", event => {
    event._isClickWithInModal = true;
});
document.querySelector('.modal-calculator').addEventListener("click", event => {
    if (event._isClickWithInModal) return;
    event.currentTarget.classList.remove('open');
});



//посмотреть все возможности
document.querySelector('.card__link').addEventListener("click", function() {
    document.querySelector('.card-possibilities').classList.add('show');
})
document.querySelector('.card-possibilities__button').addEventListener("click", function() {
    document.querySelector('.card-possibilities').classList.remove('show');
})

// все магазины
const headerDropdown = document.querySelector('.header__dropdown');
const headerDropdownContent = document.querySelector('.header__dropdown-content');
headerDropdown.addEventListener("click", function() {
    headerDropdownContent.classList.toggle('show');
})

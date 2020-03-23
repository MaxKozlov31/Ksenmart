"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

$(document).ready(function () {
  /**
   * Глобальные переменные, которые используются многократно
   */
  var globalOptions = {
    // Время для анимаций
    time: 200,
    // Контрольные точки адаптива
    desktopXlSize: 1920,
    desktopLgSize: 1600,
    desktopSize: 1280,
    tabletLgSize: 1024,
    tabletSize: 768,
    mobileLgSize: 640,
    mobileSize: 480,
    // Точка перехода попапов на фулскрин
    popupsBreakpoint: 768,
    // Время до сокрытия фиксированных попапов
    popupsFixedTimeout: 5000,
    // Проверка touch устройств
    isTouch: $.browser.mobile,
    lang: $('html').attr('lang')
  }; // Брейкпоинты адаптива
  // @example if (globalOptions.breakpointTablet.matches) {} else {}

  var breakpoints = {
    breakpointDesktopXl: window.matchMedia("(max-width: ".concat(globalOptions.desktopXlSize - 1, "px)")),
    breakpointDesktopLg: window.matchMedia("(max-width: ".concat(globalOptions.desktopLgSize - 1, "px)")),
    breakpointDesktop: window.matchMedia("(max-width: ".concat(globalOptions.desktopSize - 1, "px)")),
    breakpointTabletLg: window.matchMedia("(max-width: ".concat(globalOptions.tabletLgSize - 1, "px)")),
    breakpointTablet: window.matchMedia("(max-width: ".concat(globalOptions.tabletSize - 1, "px)")),
    breakpointMobileLgSize: window.matchMedia("(max-width: ".concat(globalOptions.mobileLgSize - 1, "px)")),
    breakpointMobile: window.matchMedia("(max-width: ".concat(globalOptions.mobileSize - 1, "px)"))
  };
  $.extend(true, globalOptions, breakpoints);
  $(window).load(function () {
    if (globalOptions.isTouch) {
      $('body').addClass('touch').removeClass('no-touch');
    } else {
      $('body').addClass('no-touch').removeClass('touch');
    } // if ($('textarea').length > 0) {
    //     autosize($('textarea'));
    // }

  });
  /**
   * Подключение js partials
   */

  /* form_style.js должен быть выполнен перед form_validation.js */

  /**
   * Расширение animate.css
   * @param  {String} animationName название анимации
   * @param  {Function} callback функция, которая отработает после завершения анимации
   * @return {Object} объект анимации
   * 
   * @see  https://daneden.github.io/animate.css/
   * 
   * @example
   * $('#yourElement').animateCss('bounce');
   * 
   * $('#yourElement').animateCss('bounce', function() {
   *     // Делаем что-то после завершения анимации
   * });
   */

  $.fn.extend({
    animateCss: function animateCss(animationName, callback) {
      var animationEnd = function (el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd'
        };

        for (var t in animations) {
          if (el.style[t] !== undefined) {
            return animations[t];
          }
        }
      }(document.createElement('div'));

      this.addClass('animated ' + animationName).one(animationEnd, function () {
        $(this).removeClass('animated ' + animationName);
        if (typeof callback === 'function') callback();
      });
      return this;
    }
  });
  /**
   * Стилизует селекты с помощью плагина select2
   * https://select2.github.io
   */

  var CustomSelect = function CustomSelect($elem) {
    var self = this;

    self.init = function ($initElem) {
      $initElem.each(function () {
        if ($(this).hasClass('select2-hidden-accessible')) {
          return;
        } else {
          var selectSearch = $(this).data('search');
          var minimumResultsForSearch;

          if (selectSearch) {
            minimumResultsForSearch = 1; // показываем поле поиска
          } else {
            minimumResultsForSearch = Infinity; // не показываем поле поиска
          }

          $(this).select2({
            minimumResultsForSearch: minimumResultsForSearch,
            selectOnBlur: true,
            dropdownCssClass: 'error'
          });
          $(this).on('change', function (e) {
            // нужно для вылидации на лету
            $(this).find("option[value=\"".concat($(this).context.value, "\"]")).click();
          });
        }
      });
    };

    self.update = function ($updateElem) {
      $updateElem.select2('destroy');
      self.init($updateElem);
    };

    self.init($elem);
  };
  /**
   * Стилизует file input
   * http://gregpike.net/demos/bootstrap-file-input/demo.html
   */


  $.fn.customFileInput = function () {
    this.each(function (i, elem) {
      var $elem = $(elem); // Maybe some fields don't need to be standardized.

      if (typeof $elem.attr('data-bfi-disabled') !== 'undefined') {
        return;
      } // Set the word to be displayed on the button


      var buttonWord = 'Browse';
      var className = '';

      if (typeof $elem.attr('title') !== 'undefined') {
        buttonWord = $elem.attr('title');
      }

      if (!!$elem.attr('class')) {
        className = ' ' + $elem.attr('class');
      } // Now we're going to wrap that input field with a button.
      // The input will actually still be there, it will just be float above and transparent (done with the CSS).


      $elem.wrap("<div class=\"custom-file\"><a class=\"btn ".concat(className, "\"></a></div>")).parent().prepend($('<span></span>').html(buttonWord));
    }) // After we have found all of the file inputs let's apply a listener for tracking the mouse movement.
    // This is important because the in order to give the illusion that this is a button in FF we actually need to move the button from the file input under the cursor. Ugh.
    .promise().done(function () {
      // As the cursor moves over our new button we need to adjust the position of the invisible file input Browse button to be under the cursor.
      // This gives us the pointer cursor that FF denies us
      $('.custom-file').mousemove(function (cursor) {
        var input, wrapper, wrapperX, wrapperY, inputWidth, inputHeight, cursorX, cursorY; // This wrapper element (the button surround this file input)

        wrapper = $(this); // The invisible file input element

        input = wrapper.find('input'); // The left-most position of the wrapper

        wrapperX = wrapper.offset().left; // The top-most position of the wrapper

        wrapperY = wrapper.offset().top; // The with of the browsers input field

        inputWidth = input.width(); // The height of the browsers input field

        inputHeight = input.height(); //The position of the cursor in the wrapper

        cursorX = cursor.pageX;
        cursorY = cursor.pageY; //The positions we are to move the invisible file input
        // The 20 at the end is an arbitrary number of pixels that we can shift the input such that cursor is not pointing at the end of the Browse button but somewhere nearer the middle

        moveInputX = cursorX - wrapperX - inputWidth + 20; // Slides the invisible input Browse button to be positioned middle under the cursor

        moveInputY = cursorY - wrapperY - inputHeight / 2; // Apply the positioning styles to actually move the invisible file input

        input.css({
          left: moveInputX,
          top: moveInputY
        });
      });
      $('body').on('change', '.custom-file input[type=file]', function () {
        var fileName;
        fileName = $(this).val(); // Remove any previous file names

        $(this).parent().next('.custom-file__name').remove();

        if (!!$(this).prop('files') && $(this).prop('files').length > 1) {
          fileName = $(this)[0].files.length + ' files';
        } else {
          fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
        } // Don't try to show the name if there is none


        if (!fileName) {
          return;
        }

        var selectedFileNamePlacement = $(this).data('filename-placement');

        if (selectedFileNamePlacement === 'inside') {
          // Print the fileName inside
          $(this).siblings('span').html(fileName);
          $(this).attr('title', fileName);
        } else {
          // Print the fileName aside (right after the the button)
          $(this).parent().after("<span class=\"custom-file__name\">".concat(fileName, " </span>"));
        }
      });
    });
  };

  $('input[type="file"]').customFileInput(); // $('select').customSelect();

  var customSelect = new CustomSelect($('select'));

  if ($('.js-label-animation').length > 0) {
    /**
     * Анимация элемента label при фокусе полей формы
     */
    $('.js-label-animation').each(function (index, el) {
      var field = $(el).find('input, textarea');

      if ($(field).val().trim() != '') {
        $(el).addClass('is-filled');
      }

      $(field).on('focus', function (event) {
        $(el).addClass('is-filled');
      }).on('blur', function (event) {
        if ($(this).val().trim() === '') {
          $(el).removeClass('is-filled');
        }
      });
    });
  }

  var locale = globalOptions.lang == 'ru-RU' ? 'ru' : 'en';
  Parsley.setLocale(locale);
  /* Настройки Parsley */

  $.extend(Parsley.options, {
    trigger: 'blur change',
    // change нужен для select'а
    validationThreshold: '0',
    errorsWrapper: '<div></div>',
    errorTemplate: '<p class="parsley-error-message"></p>',
    classHandler: function classHandler(instance) {
      var $element = instance.$element;
      var type = $element.attr('type'),
          $handler;

      if (type == 'checkbox' || type == 'radio') {
        $handler = $element; // то есть ничего не выделяем (input скрыт), иначе выделяет родительский блок
      } else if ($element.hasClass('select2-hidden-accessible')) {
        $handler = $('.select2-selection--single', $element.next('.select2'));
      }

      return $handler;
    },
    errorsContainer: function errorsContainer(instance) {
      var $element = instance.$element;
      var type = $element.attr('type'),
          $container;

      if (type == 'checkbox' || type == 'radio') {
        $container = $("[name=\"".concat($element.attr('name'), "\"]:last + label")).next('.errors-placement');
      } else if ($element.hasClass('select2-hidden-accessible')) {
        $container = $element.next('.select2').next('.errors-placement');
      } else if (type == 'file') {
        $container = $element.closest('.custom-file').next('.errors-placement');
      } else if ($element.closest('.js-datepicker-range').length) {
        $container = $element.closest('.js-datepicker-range').next('.errors-placement');
      } else if ($element.attr('name') == 'is_recaptcha_success') {
        $container = $element.parent().next('.g-recaptcha').next('.errors-placement');
      }

      return $container;
    }
  }); // Кастомные валидаторы
  // Только русские буквы, тире, пробелы

  Parsley.addValidator('nameRu', {
    validateString: function validateString(value) {
      return /^[а-яё\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы А-Я, а-я, " ", "-"',
      en: 'Only simbols А-Я, а-я, " ", "-"'
    }
  }); // Только латинские буквы, тире, пробелы

  Parsley.addValidator('nameEn', {
    validateString: function validateString(value) {
      return /^[a-z\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, " ", "-"',
      en: 'Only simbols A-Z, a-z, " ", "-"'
    }
  }); // Только латинские и русские буквы, тире, пробелы

  Parsley.addValidator('name', {
    validateString: function validateString(value) {
      return /^[а-яёa-z\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, А-Я, а-я, " ", "-"',
      en: 'Only simbols A-Z, a-z, А-Я, а-я, " ", "-"'
    }
  }); // Только цифры и русские буквы

  Parsley.addValidator('numLetterRu', {
    validateString: function validateString(value) {
      return /^[0-9а-яё]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы А-Я, а-я, 0-9',
      en: 'Only simbols А-Я, а-я, 0-9'
    }
  }); // Только цифры, латинские и русские буквы

  Parsley.addValidator('numLetter', {
    validateString: function validateString(value) {
      return /^[а-яёa-z0-9]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, А-Я, а-я, 0-9',
      en: 'Only simbols A-Z, a-z, А-Я, а-я, 0-9'
    }
  }); // Телефонный номер

  Parsley.addValidator('phone', {
    validateString: function validateString(value) {
      return /^[-+0-9() ]*$/i.test(value);
    },
    messages: {
      ru: 'Некорректный телефонный номер',
      en: 'Incorrect phone number'
    }
  }); // Только цифры

  Parsley.addValidator('number', {
    validateString: function validateString(value) {
      return /^[0-9]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы 0-9',
      en: 'Only simbols 0-9'
    }
  }); // Почта без кириллицы

  Parsley.addValidator('email', {
    validateString: function validateString(value) {
      return /^([A-Za-zА-Яа-я0-9\-](\.|_|-){0,1})+[A-Za-zА-Яа-я0-9\-]\@([A-Za-zА-Яа-я0-9\-])+((\.){0,1}[A-Za-zА-Яа-я0-9\-]){1,}\.[a-zа-я0-9\-]{2,}$/.test(value);
    },
    messages: {
      ru: 'Некорректный почтовый адрес',
      en: 'Incorrect email address'
    }
  }); // Формат даты DD.MM.YYYY

  Parsley.addValidator('date', {
    validateString: function validateString(value) {
      var regTest = /^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})$/,
          regMatch = /(\d{1,2})\.(\d{1,2})\.(\d{4})/,
          min = arguments[2].$element.data('dateMin'),
          max = arguments[2].$element.data('dateMax'),
          minDate,
          maxDate,
          valueDate,
          result;

      if (min && (result = min.match(regMatch))) {
        minDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      if (max && (result = max.match(regMatch))) {
        maxDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      if (result = value.match(regMatch)) {
        valueDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      return regTest.test(value) && (minDate ? valueDate >= minDate : true) && (maxDate ? valueDate <= maxDate : true);
    },
    messages: {
      ru: 'Некорректная дата',
      en: 'Incorrect date'
    }
  }); // Файл ограниченного размера

  Parsley.addValidator('fileMaxSize', {
    validateString: function validateString(value, maxSize, parsleyInstance) {
      var files = parsleyInstance.$element[0].files;
      return files.length != 1 || files[0].size <= maxSize * 1024;
    },
    requirementType: 'integer',
    messages: {
      ru: 'Файл должен весить не более, чем %s Kb',
      en: 'File size can\'t be more then %s Kb'
    }
  }); // Ограничения расширений файлов

  Parsley.addValidator('fileExtension', {
    validateString: function validateString(value, formats) {
      var fileExtension = value.split('.').pop();
      var formatsArr = formats.split(', ');
      var valid = false;

      for (var i = 0; i < formatsArr.length; i++) {
        if (fileExtension === formatsArr[i]) {
          valid = true;
          break;
        }
      }

      return valid;
    },
    messages: {
      ru: 'Допустимы только файлы формата %s',
      en: 'Available extensions are %s'
    }
  }); // Создаёт контейнеры для ошибок у нетипичных элементов

  Parsley.on('field:init', function () {
    var $element = this.$element,
        type = $element.attr('type'),
        $block = $('<div/>').addClass('errors-placement'),
        $last;

    if (type == 'checkbox' || type == 'radio') {
      $last = $("[name=\"".concat($element.attr('name'), "\"]:last + label"));

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.hasClass('select2-hidden-accessible')) {
      $last = $element.next('.select2');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if (type == 'file') {
      $last = $element.closest('.custom-file');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.closest('.js-datepicker-range').length) {
      $last = $element.closest('.js-datepicker-range');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.attr('name') == 'is_recaptcha_success') {
      $last = $element.parent().next('.g-recaptcha');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    }
  }); // Инициирует валидацию на втором каледарном поле диапазона

  Parsley.on('field:validated', function () {
    var $element = $(this.element);
  });
  $('form[data-validate="true"]').parsley();
  /**
   * Добавляет маски в поля форм
   * @see  https://github.com/RobinHerbots/Inputmask
   *
   * @example
   * <input class="js-phone-mask" type="tel" name="tel" id="tel">
   */

  $('.js-phone-mask').inputmask('+7(999) 999-99-99', {
    clearMaskOnLostFocus: true,
    showMaskOnHover: false
  });
  $(".flagman-request__date").datepicker();
  /**
   * Костыль для обновления xlink у svg-иконок после обновления DOM (для IE)
   * функцию нужно вызывать в событиях, которые вносят изменения в элементы уже после формирования DOM-а
   * (например, после инициализации карусели или открытии попапа)
   *
   * @param  {Element} element элемент, в котором необходимо обновить svg (наприм $('#some-popup'))
   */

  function updateSvg(element) {
    var $useElement = element.find('use');
    $useElement.each(function (index) {
      if ($useElement[index].href && $useElement[index].href.baseVal) {
        $useElement[index].href.baseVal = $useElement[index].href.baseVal; // trigger fixing of href
      }
    });
  }

  var datepickerDefaultOptions = {
    dateFormat: 'dd.mm.yy',
    showOtherMonths: true
  };
  /**
   * Делает выпадющие календарики
   * @see  http://api.jqueryui.com/datepicker/
   *
   * @example
   * // в data-date-min и data-date-max можно задать дату в формате dd.mm.yyyy
   * <input type="text" name="dateInput" id="" class="js-datepicker" data-date-min="06.11.2015" data-date-max="10.12.2015">
   */

  var Datepicker = function Datepicker() {
    var datepicker = $('.js-datepicker');
    datepicker.each(function () {
      var minDate = $(this).data('date-min');
      var maxDate = $(this).data('date-max');
      var itemOptions = {
        minDate: minDate || null,
        maxDate: maxDate || null,
        onSelect: function onSelect() {
          $(this).change();
          $(this).closest('.field').addClass('is-filled');
        }
      };
      $.extend(true, itemOptions, datepickerDefaultOptions);
      $(this).datepicker(itemOptions);
    });
  };

  var datepicker = new Datepicker(); // Диапазон дат

  var DatepickerRange = function DatepickerRange() {
    var datepickerRange = $('.js-datepicker-range');
    datepickerRange.each(function () {
      var fromItemOptions = {};
      var toItemOptions = {};
      $.extend(true, fromItemOptions, datepickerDefaultOptions);
      $.extend(true, toItemOptions, datepickerDefaultOptions);
      var dateFrom = $(this).find('.js-range-from').datepicker(fromItemOptions);
      var dateTo = $(this).find('.js-range-to').datepicker(toItemOptions);
      dateFrom.on('change', function () {
        dateTo.datepicker('option', 'minDate', getDate(this));
        dateTo.prop('required', true);

        if ($(this).hasClass('parsley-error') && $(this).parsley().isValid()) {
          $(this).parsley().validate();
        }
      });
      dateTo.on('change', function () {
        dateFrom.datepicker('option', 'maxDate', getDate(this));
        dateFrom.prop('required', true);

        if ($(this).hasClass('parsley-error') && $(this).parsley().isValid()) {
          $(this).parsley().validate();
        }
      });
    });

    function getDate(element) {
      var date;

      try {
        date = $.datepicker.parseDate(datepickerDefaultOptions.dateFormat, element.value);
      } catch (error) {
        date = null;
      }

      return date;
    }
  };

  var datepickerRange = new DatepickerRange();
  /**
   * Реализует переключение табов
   *
   * @example
   * <ul class="tabs js-tabs">
   *     <li class="tabs__item">
   *         <span class="is-active tabs__link js-tab-link">Tab name</span>
   *         <div class="tabs__cnt">
   *             <p>Tab content</p>
   *         </div>
   *     </li>
   * </ul>
   */

  var TabSwitcher = function TabSwitcher() {
    var self = this;
    var tabs = $('.js-tabs');
    tabs.each(function () {
      $(this).find('.js-tab-link.is-active').next().addClass('is-open');
    });
    tabs.on('click', '.js-tab-link', function (event) {
      self.open($(this), event); // return false;
    });
    /**
     * Открывает таб по клику на какой-то другой элемент
     *
     * @example
     * <span data-tab-open="#tab-login">Open login tab</span>
     */

    $(document).on('click', '[data-tab-open]', function (event) {
      var tabElem = $(this).data('tab-open');
      self.open($(tabElem), event);

      if ($(this).data('popup') == undefined) {
        return false;
      }
    });
    /**
     * Открывает таб
     * @param  {Element} elem элемент .js-tab-link, на который нужно переключить
     *
     * @example
     * // вызов метода open, откроет таб
     * tabSwitcher.open($('#some-tab'));
     */

    self.open = function (elem, event) {
      if (!elem.hasClass('is-active')) {
        event.preventDefault();
        var parentTabs = elem.closest(tabs);
        parentTabs.find('.is-open').removeClass('is-open');
        elem.next().toggleClass('is-open');
        parentTabs.find('.is-active').removeClass('is-active');
        elem.addClass('is-active');
      } else {
        event.preventDefault();
      }
    };
  };

  var tabSwitcher = new TabSwitcher();
  /**
   * Скрывает элемент hiddenElem при клике за пределами элемента targetElem
   *
   * @param  {Element}   targetElem
   * @param  {Element}   hiddenElem
   * @param  {Function}  [optionalCb] отрабатывает сразу не дожидаясь завершения анимации
   */

  function onOutsideClickHide(targetElem, hiddenElem, optionalCb) {
    $(document).bind('mouseup touchend', function (e) {
      if (!targetElem.is(e.target) && $(e.target).closest(targetElem).length == 0) {
        hiddenElem.stop(true, true).fadeOut(globalOptions.time);

        if (optionalCb) {
          optionalCb();
        }
      }
    });
  }
  /**
   * Хэлпер для показа, скрытия или чередования видимости элементов
   *
   * @example
   * <button type="button" data-visibility="show" data-show="#elemId1"></button>
   *
   * или
   * <button type="button" data-visibility="hide" data-hide="#elemId2"></button>
   *
   * или
   * <button type="button" data-visibility="toggle" data-toggle="#elemId3"></button>
   *
   * или
   * <button type="button" data-visibility="show" data-show="#elemId1|#elemId3"></button>
   *
   * или
   * // если есть атрибут data-queue="show", то будет сначала скрыт элемент #elemId2, а потом показан #elemId1
   * <button type="button" data-visibility="show" data-show="#elemId1" data-visibility="hide" data-hide="#elemId2" data-queue="show"></button>
   *
   * <div id="elemId1" style="display: none;">Text</div>
   * <div id="elemId2">Text</div>
   * <div id="elemId3" style="display: none;">Text</div>
   */


  var visibilityControl = function visibilityControl() {
    var settings = {
      types: ['show', 'hide', 'toggle']
    };

    if ($('[data-visibility]').length > 0) {
      /**
       * Устанавливает видимость
       * @param {String}  visibilityType тип отображения
       * @param {Array}   list массив элементов, с которым работаем
       * @param {Number}  delay задержка при показе элемента в ms
       */
      var setVisibility = function setVisibility(visibilityType, list, delay) {
        for (var i = 0; i < list.length; i++) {
          if (visibilityType == settings.types[0]) {
            $(list[i]).delay(delay).fadeIn(globalOptions.time);
          }

          if (visibilityType == settings.types[1]) {
            $(list[i]).fadeOut(globalOptions.time);
          }

          if (visibilityType == settings.types[2]) {
            if ($(list[i]).is(':visible')) {
              $(list[i]).fadeOut(globalOptions.time);
            } else {
              $(list[i]).fadeIn(globalOptions.time);
            }
          }
        }
      };

      $(document).on('click', '[data-visibility]', function () {
        var dataType;

        for (var i = 0; i < settings.types.length; i++) {
          dataType = settings.types[i];

          if ($(this).data(dataType)) {
            var visibilityList = $(this).data(dataType).split('|'),
                delay = 0;

            if ($(this).data('queue') == 'show') {
              delay = globalOptions.time;
            } else {
              delay = 0;
            }

            setVisibility(dataType, visibilityList, delay);
          }
        }

        if (!$(this).hasClass('tabs__link') && $(this).attr('type') != 'radio' && $(this).attr('type') != 'checkbox') {
          return false;
        }
      });
    }
  };

  visibilityControl();
  /**
   * Делает слайдер
   * @see  http://api.jqueryui.com/slider/
   *
   * @example
   * // в data-min и data-max задаются минимальное и максимальное значение
   * // в data-step шаг,
   * // в data-values дефолтные значения "min, max"
   * <div class="slider js-range">
   *      <div class="slider__range" data-min="0" data-max="100" data-step="1" data-values="10, 55"></div>
   * </div>
   */

  var Slider = function Slider() {
    var slider = $('.js-range');
    var min, max, step, values;
    slider.each(function () {
      var self = $(this),
          range = self.find('.slider__range');
      min = range.data('min');
      max = range.data('max');
      step = range.data('step');
      values = range.data('values').split(', ');
      range.slider({
        range: true,
        min: min || null,
        max: max || null,
        step: step || 1,
        values: values,
        slide: function slide(event, ui) {
          self.find('.ui-slider-handle').children('span').remove();
          self.find('.ui-slider-handle:nth-child(2)').append("<span>".concat(ui.values[0], "</span>"));
          self.find('.ui-slider-handle:nth-child(3)').append("<span>".concat(ui.values[1], "</span>"));
        }
      });
      self.find('.ui-slider-handle:nth-child(2)').append("<span>".concat(range.slider('values', 0), "</span>"));
      self.find('.ui-slider-handle:nth-child(3)').append("<span>".concat(range.slider('values', 1), "</span>"));
    });
  };

  var slider = new Slider();

  window.onload = function () {
    var Persons = document.querySelectorAll('.team_persons_photo');
    Persons.forEach(function (node) {
      node.addEventListener('click', function (element) {
        Persons.forEach(function (node) {
          node.style.width = '13%';
        });
        var current = element.target;
        current.style.width = "18%";
        current.nextElementSibling.style.width = "16%";
        current.previousElementSibling.style.width = "16%";
        current.nextElementSibling.nextElementSibling.style.width = "14%";
        current.previousElementSibling.previousElementSibling.style.width = "14%";
      });
    });
  };

  $(".modal_dialog_content_item").not(":first").hide();
  $(".modal_dialog_content .modal_button").click(function () {
    $(".modal_dialog_content .modal_button").removeClass("active").eq($(this).index()).addClass("active");
    $(".modal_dialog_content_item").hide().eq($(this).index()).fadeIn();
  }).eq(0).addClass("active");
  var modalCall = $("[data-modal]");
  var modalClose = $("[data-close]");
  modalCall.on("click", function (event) {
    event.preventDefault();
    var $this = $(this);
    var modalId = $this.data('modal');
    $(modalId).addClass('show');
    $("body").addClass('no-scroll');
    setTimeout(function () {
      $(modalId).find(".location").css({
        transform: "scale(1)"
      });
    }, 100);
  });
  modalClose.on("click", function (event) {
    event.preventDefault();
    var $this = $(this);
    var modalParent = $this.parents('.modal');
    modalParent.find(".location").css({
      transform: "scale(0)"
    });
    setTimeout(function () {
      modalParent.removeClass('show');
      $("body").removeClass('no-scroll');
    }, 100);
  });
  $(".modal").on("click", function (event) {
    var $this = $(this);
    $this.find(".location").css({
      transform: "scale(0)"
    });
    setTimeout(function () {
      $this.removeClass('show');
      $("body").removeClass('no-scroll');
    }, 200);
  });
  $(".location").on("click", function (event) {
    event.stopPropagation();
  });
  var doc = document.querySelectorAll('.contr');
  doc.forEach(function (node) {
    node.addEventListener('click', function (element) {
      doc.forEach(function (node) {
        node.style.width = '223px';
      });
      var current = element.target;
      current.style.width = "284px";
    });
  });
  $('a[href^="#"]').on('click', function (event) {
    // отменяем стандартное действие
    event.preventDefault();
    var sc = $(this).attr("href"),
        dn = $(sc).offset().top;
    /*
    * sc - в переменную заносим информацию о том, к какому блоку надо перейти
    * dn - определяем положение блока на странице
    */

    $('html, body').animate({
      scrollTop: dn
    }, 1000);
    /*
    * 1000 скорость перехода в миллисекундах
    */
  });
  /*window.onload = function () {
        window.Nodes = document.querySelectorAll('.cases_content_item');
      let i = -1;
      let count = 0;
      let flag = false;
      document.addEventListener('scroll', () => {
          if (window.scrollY > Nodes[0].getBoundingClientRect().y) {
              flag = true;
          }
      },
       {
          passive: false
      }
      );
        document.addEventListener('wheel', (event) => {
          if (flag == true) {
              console.log('scroll' + window.scrollY);
              count++;
              console.log(count);
              if (count > 10) {
                  if (i < Nodes.length - 1) {
                      i++;
                      Nodes[i].scrollIntoView({
                          behavior: 'smooth'
                      });
                      count = 0;
                  }else{
                      flag=false;
                  }
              
              }
              event.preventDefault();
              event.stopPropagation();
          }
      }, {
          passive: false
      });
  }
  */
  // $(".cases_sidebar_list_item").click(function(e) {
  //     e.preventDefault();
  //     $(".cases_sidebar_list_item").removeClass('active');
  //     $(this).addClass('active');
  // });

  $(document).ready(function () {
    $(".intro_cases").hide();
  });
  $("#op").click(function (e) {
    e.preventDefault(); // $(".intro_items").removeClass('active');
    // $(this).addClass('active');
    // $(".intro_items").addClass('display_none');

    $(".intro_items").hide();
    $(".intro_cases").show('speed');
  }); // $(document).ready(function(){
  // 	$("#op").click(function(){
  // 		$(".intro_items").toggleClass("display_none"); return false;
  // 	});
  // });
  // $("#btn-drop").click(function() {
  //     if (flag['drop'] = !flag['drop']) {
  //         $("#test-drop").hide("drop", { direction: "right" }, 1000);
  //     }
  //     else {
  //         $("#test-drop").show("drop", { direction: "down" }, 500);
  //     }
  // });

  /**
   * Фиксированный хедер
   */
  // $(window).on('scroll', toggleFixedHeader);
  // function toggleFixedHeader() {
  //     const $header = $('.header');
  //     const $main = $('.header').next();
  //     if (window.pageYOffset > 0) {
  //         $header.addClass('is-fixed');
  //         $main.css({ marginTop: $header.outerHeight() });
  //     } else {
  //         $header.removeClass('is-fixed');
  //         $main.css({ marginTop: 0 });
  //     }
  // }

  !function (i) {
    "use strict";

    "function" == typeof define && define.amd ? define(["jquery"], i) : "undefined" != typeof exports ? module.exports = i(require("jquery")) : i(jQuery);
  }(function (i) {
    "use strict";

    var e = window.Slick || {};
    (e = function () {
      var e = 0;
      return function (t, o) {
        var s,
            n = this;
        n.defaults = {
          accessibility: !0,
          adaptiveHeight: !1,
          appendArrows: i(t),
          appendDots: i(t),
          arrows: !0,
          asNavFor: null,
          prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
          nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
          autoplay: !1,
          autoplaySpeed: 3e3,
          centerMode: !1,
          centerPadding: "50px",
          cssEase: "ease",
          customPaging: function customPaging(e, t) {
            return i('<button type="button" />').text(t + 1);
          },
          dots: !1,
          dotsClass: "slick-dots",
          draggable: !0,
          easing: "linear",
          edgeFriction: .35,
          fade: !1,
          focusOnSelect: !1,
          focusOnChange: !1,
          infinite: !0,
          initialSlide: 0,
          lazyLoad: "ondemand",
          mobileFirst: !1,
          pauseOnHover: !0,
          pauseOnFocus: !0,
          pauseOnDotsHover: !1,
          respondTo: "window",
          responsive: null,
          rows: 1,
          rtl: !1,
          slide: "",
          slidesPerRow: 1,
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 500,
          swipe: !0,
          swipeToSlide: !1,
          touchMove: !0,
          touchThreshold: 5,
          useCSS: !0,
          useTransform: !0,
          variableWidth: !1,
          vertical: !1,
          verticalSwiping: !1,
          waitForAnimate: !0,
          zIndex: 1e3
        }, n.initials = {
          animating: !1,
          dragging: !1,
          autoPlayTimer: null,
          currentDirection: 0,
          currentLeft: null,
          currentSlide: 0,
          direction: 1,
          $dots: null,
          listWidth: null,
          listHeight: null,
          loadIndex: 0,
          $nextArrow: null,
          $prevArrow: null,
          scrolling: !1,
          slideCount: null,
          slideWidth: null,
          $slideTrack: null,
          $slides: null,
          sliding: !1,
          slideOffset: 0,
          swipeLeft: null,
          swiping: !1,
          $list: null,
          touchObject: {},
          transformsEnabled: !1,
          unslicked: !1
        }, i.extend(n, n.initials), n.activeBreakpoint = null, n.animType = null, n.animProp = null, n.breakpoints = [], n.breakpointSettings = [], n.cssTransitions = !1, n.focussed = !1, n.interrupted = !1, n.hidden = "hidden", n.paused = !0, n.positionProp = null, n.respondTo = null, n.rowCount = 1, n.shouldClick = !0, n.$slider = i(t), n.$slidesCache = null, n.transformType = null, n.transitionType = null, n.visibilityChange = "visibilitychange", n.windowWidth = 0, n.windowTimer = null, s = i(t).data("slick") || {}, n.options = i.extend({}, n.defaults, o, s), n.currentSlide = n.options.initialSlide, n.originalSettings = n.options, void 0 !== document.mozHidden ? (n.hidden = "mozHidden", n.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (n.hidden = "webkitHidden", n.visibilityChange = "webkitvisibilitychange"), n.autoPlay = i.proxy(n.autoPlay, n), n.autoPlayClear = i.proxy(n.autoPlayClear, n), n.autoPlayIterator = i.proxy(n.autoPlayIterator, n), n.changeSlide = i.proxy(n.changeSlide, n), n.clickHandler = i.proxy(n.clickHandler, n), n.selectHandler = i.proxy(n.selectHandler, n), n.setPosition = i.proxy(n.setPosition, n), n.swipeHandler = i.proxy(n.swipeHandler, n), n.dragHandler = i.proxy(n.dragHandler, n), n.keyHandler = i.proxy(n.keyHandler, n), n.instanceUid = e++, n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, n.registerBreakpoints(), n.init(!0);
      };
    }()).prototype.activateADA = function () {
      this.$slideTrack.find(".slick-active").attr({
        "aria-hidden": "false"
      }).find("a, input, button, select").attr({
        tabindex: "0"
      });
    }, e.prototype.addSlide = e.prototype.slickAdd = function (e, t, o) {
      var s = this;
      if ("boolean" == typeof t) o = t, t = null;else if (t < 0 || t >= s.slideCount) return !1;
      s.unload(), "number" == typeof t ? 0 === t && 0 === s.$slides.length ? i(e).appendTo(s.$slideTrack) : o ? i(e).insertBefore(s.$slides.eq(t)) : i(e).insertAfter(s.$slides.eq(t)) : !0 === o ? i(e).prependTo(s.$slideTrack) : i(e).appendTo(s.$slideTrack), s.$slides = s.$slideTrack.children(this.options.slide), s.$slideTrack.children(this.options.slide).detach(), s.$slideTrack.append(s.$slides), s.$slides.each(function (e, t) {
        i(t).attr("data-slick-index", e);
      }), s.$slidesCache = s.$slides, s.reinit();
    }, e.prototype.animateHeight = function () {
      var i = this;

      if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
        var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
        i.$list.animate({
          height: e
        }, i.options.speed);
      }
    }, e.prototype.animateSlide = function (e, t) {
      var o = {},
          s = this;
      s.animateHeight(), !0 === s.options.rtl && !1 === s.options.vertical && (e = -e), !1 === s.transformsEnabled ? !1 === s.options.vertical ? s.$slideTrack.animate({
        left: e
      }, s.options.speed, s.options.easing, t) : s.$slideTrack.animate({
        top: e
      }, s.options.speed, s.options.easing, t) : !1 === s.cssTransitions ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft), i({
        animStart: s.currentLeft
      }).animate({
        animStart: e
      }, {
        duration: s.options.speed,
        easing: s.options.easing,
        step: function step(i) {
          i = Math.ceil(i), !1 === s.options.vertical ? (o[s.animType] = "translate(" + i + "px, 0px)", s.$slideTrack.css(o)) : (o[s.animType] = "translate(0px," + i + "px)", s.$slideTrack.css(o));
        },
        complete: function complete() {
          t && t.call();
        }
      })) : (s.applyTransition(), e = Math.ceil(e), !1 === s.options.vertical ? o[s.animType] = "translate3d(" + e + "px, 0px, 0px)" : o[s.animType] = "translate3d(0px," + e + "px, 0px)", s.$slideTrack.css(o), t && setTimeout(function () {
        s.disableTransition(), t.call();
      }, s.options.speed));
    }, e.prototype.getNavTarget = function () {
      var e = this,
          t = e.options.asNavFor;
      return t && null !== t && (t = i(t).not(e.$slider)), t;
    }, e.prototype.asNavFor = function (e) {
      var t = this.getNavTarget();
      null !== t && "object" == _typeof(t) && t.each(function () {
        var t = i(this).slick("getSlick");
        t.unslicked || t.slideHandler(e, !0);
      });
    }, e.prototype.applyTransition = function (i) {
      var e = this,
          t = {};
      !1 === e.options.fade ? t[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase : t[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase, !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
    }, e.prototype.autoPlay = function () {
      var i = this;
      i.autoPlayClear(), i.slideCount > i.options.slidesToShow && (i.autoPlayTimer = setInterval(i.autoPlayIterator, i.options.autoplaySpeed));
    }, e.prototype.autoPlayClear = function () {
      var i = this;
      i.autoPlayTimer && clearInterval(i.autoPlayTimer);
    }, e.prototype.autoPlayIterator = function () {
      var i = this,
          e = i.currentSlide + i.options.slidesToScroll;
      i.paused || i.interrupted || i.focussed || (!1 === i.options.infinite && (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1 ? i.direction = 0 : 0 === i.direction && (e = i.currentSlide - i.options.slidesToScroll, i.currentSlide - 1 == 0 && (i.direction = 1))), i.slideHandler(e));
    }, e.prototype.buildArrows = function () {
      var e = this;
      !0 === e.options.arrows && (e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow"), e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow"), e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows), e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), !0 !== e.options.infinite && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
        "aria-disabled": "true",
        tabindex: "-1"
      }));
    }, e.prototype.buildDots = function () {
      var e,
          t,
          o = this;

      if (!0 === o.options.dots) {
        for (o.$slider.addClass("slick-dotted"), t = i("<ul />").addClass(o.options.dotsClass), e = 0; e <= o.getDotCount(); e += 1) {
          t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
        }

        o.$dots = t.appendTo(o.options.appendDots), o.$dots.find("li").first().addClass("slick-active");
      }
    }, e.prototype.buildOut = function () {
      var e = this;
      e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), e.slideCount = e.$slides.length, e.$slides.each(function (e, t) {
        i(t).attr("data-slick-index", e).data("originalStyling", i(t).attr("style") || "");
      }), e.$slider.addClass("slick-slider"), e.$slideTrack = 0 === e.slideCount ? i('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(), e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(), e.$slideTrack.css("opacity", 0), !0 !== e.options.centerMode && !0 !== e.options.swipeToSlide || (e.options.slidesToScroll = 1), i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"), e.setupInfinite(), e.buildArrows(), e.buildDots(), e.updateDots(), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), !0 === e.options.draggable && e.$list.addClass("draggable");
    }, e.prototype.buildRows = function () {
      var i,
          e,
          t,
          o,
          s,
          n,
          r,
          l = this;

      if (o = document.createDocumentFragment(), n = l.$slider.children(), l.options.rows > 1) {
        for (r = l.options.slidesPerRow * l.options.rows, s = Math.ceil(n.length / r), i = 0; i < s; i++) {
          var d = document.createElement("div");

          for (e = 0; e < l.options.rows; e++) {
            var a = document.createElement("div");

            for (t = 0; t < l.options.slidesPerRow; t++) {
              var c = i * r + (e * l.options.slidesPerRow + t);
              n.get(c) && a.appendChild(n.get(c));
            }

            d.appendChild(a);
          }

          o.appendChild(d);
        }

        l.$slider.empty().append(o), l.$slider.children().children().children().css({
          width: 100 / l.options.slidesPerRow + "%",
          display: "inline-block"
        });
      }
    }, e.prototype.checkResponsive = function (e, t) {
      var o,
          s,
          n,
          r = this,
          l = !1,
          d = r.$slider.width(),
          a = window.innerWidth || i(window).width();

      if ("window" === r.respondTo ? n = a : "slider" === r.respondTo ? n = d : "min" === r.respondTo && (n = Math.min(a, d)), r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
        s = null;

        for (o in r.breakpoints) {
          r.breakpoints.hasOwnProperty(o) && (!1 === r.originalSettings.mobileFirst ? n < r.breakpoints[o] && (s = r.breakpoints[o]) : n > r.breakpoints[o] && (s = r.breakpoints[o]));
        }

        null !== s ? null !== r.activeBreakpoint ? (s !== r.activeBreakpoint || t) && (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : null !== r.activeBreakpoint && (r.activeBreakpoint = null, r.options = r.originalSettings, !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e), l = s), e || !1 === l || r.$slider.trigger("breakpoint", [r, l]);
      }
    }, e.prototype.changeSlide = function (e, t) {
      var o,
          s,
          n,
          r = this,
          l = i(e.currentTarget);

      switch (l.is("a") && e.preventDefault(), l.is("li") || (l = l.closest("li")), n = r.slideCount % r.options.slidesToScroll != 0, o = n ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll, e.data.message) {
        case "previous":
          s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide - s, !1, t);
          break;

        case "next":
          s = 0 === o ? r.options.slidesToScroll : o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide + s, !1, t);
          break;

        case "index":
          var d = 0 === e.data.index ? 0 : e.data.index || l.index() * r.options.slidesToScroll;
          r.slideHandler(r.checkNavigable(d), !1, t), l.children().trigger("focus");
          break;

        default:
          return;
      }
    }, e.prototype.checkNavigable = function (i) {
      var e, t;
      if (e = this.getNavigableIndexes(), t = 0, i > e[e.length - 1]) i = e[e.length - 1];else for (var o in e) {
        if (i < e[o]) {
          i = t;
          break;
        }

        t = e[o];
      }
      return i;
    }, e.prototype.cleanUpEvents = function () {
      var e = this;
      e.options.dots && null !== e.$dots && (i("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", i.proxy(e.interrupt, e, !0)).off("mouseleave.slick", i.proxy(e.interrupt, e, !1)), !0 === e.options.accessibility && e.$dots.off("keydown.slick", e.keyHandler)), e.$slider.off("focus.slick blur.slick"), !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide), e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler), e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))), e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler), e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler), e.$list.off("touchend.slick mouseup.slick", e.swipeHandler), e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler), e.$list.off("click.slick", e.clickHandler), i(document).off(e.visibilityChange, e.visibility), e.cleanUpSlideEvents(), !0 === e.options.accessibility && e.$list.off("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().off("click.slick", e.selectHandler), i(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange), i(window).off("resize.slick.slick-" + e.instanceUid, e.resize), i("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault), i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition);
    }, e.prototype.cleanUpSlideEvents = function () {
      var e = this;
      e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1));
    }, e.prototype.cleanUpRows = function () {
      var i,
          e = this;
      e.options.rows > 1 && ((i = e.$slides.children().children()).removeAttr("style"), e.$slider.empty().append(i));
    }, e.prototype.clickHandler = function (i) {
      !1 === this.shouldClick && (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault());
    }, e.prototype.destroy = function (e) {
      var t = this;
      t.autoPlayClear(), t.touchObject = {}, t.cleanUpEvents(), i(".slick-cloned", t.$slider).detach(), t.$dots && t.$dots.remove(), t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()), t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()), t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function () {
        i(this).attr("style", i(this).data("originalStyling"));
      }), t.$slideTrack.children(this.options.slide).detach(), t.$slideTrack.detach(), t.$list.detach(), t.$slider.append(t.$slides)), t.cleanUpRows(), t.$slider.removeClass("slick-slider"), t.$slider.removeClass("slick-initialized"), t.$slider.removeClass("slick-dotted"), t.unslicked = !0, e || t.$slider.trigger("destroy", [t]);
    }, e.prototype.disableTransition = function (i) {
      var e = this,
          t = {};
      t[e.transitionType] = "", !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
    }, e.prototype.fadeSlide = function (i, e) {
      var t = this;
      !1 === t.cssTransitions ? (t.$slides.eq(i).css({
        zIndex: t.options.zIndex
      }), t.$slides.eq(i).animate({
        opacity: 1
      }, t.options.speed, t.options.easing, e)) : (t.applyTransition(i), t.$slides.eq(i).css({
        opacity: 1,
        zIndex: t.options.zIndex
      }), e && setTimeout(function () {
        t.disableTransition(i), e.call();
      }, t.options.speed));
    }, e.prototype.fadeSlideOut = function (i) {
      var e = this;
      !1 === e.cssTransitions ? e.$slides.eq(i).animate({
        opacity: 0,
        zIndex: e.options.zIndex - 2
      }, e.options.speed, e.options.easing) : (e.applyTransition(i), e.$slides.eq(i).css({
        opacity: 0,
        zIndex: e.options.zIndex - 2
      }));
    }, e.prototype.filterSlides = e.prototype.slickFilter = function (i) {
      var e = this;
      null !== i && (e.$slidesCache = e.$slides, e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.filter(i).appendTo(e.$slideTrack), e.reinit());
    }, e.prototype.focusHandler = function () {
      var e = this;
      e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", function (t) {
        t.stopImmediatePropagation();
        var o = i(this);
        setTimeout(function () {
          e.options.pauseOnFocus && (e.focussed = o.is(":focus"), e.autoPlay());
        }, 0);
      });
    }, e.prototype.getCurrent = e.prototype.slickCurrentSlide = function () {
      return this.currentSlide;
    }, e.prototype.getDotCount = function () {
      var i = this,
          e = 0,
          t = 0,
          o = 0;
      if (!0 === i.options.infinite) {
        if (i.slideCount <= i.options.slidesToShow) ++o;else for (; e < i.slideCount;) {
          ++o, e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
        }
      } else if (!0 === i.options.centerMode) o = i.slideCount;else if (i.options.asNavFor) for (; e < i.slideCount;) {
        ++o, e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
      } else o = 1 + Math.ceil((i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll);
      return o - 1;
    }, e.prototype.getLeft = function (i) {
      var e,
          t,
          o,
          s,
          n = this,
          r = 0;
      return n.slideOffset = 0, t = n.$slides.first().outerHeight(!0), !0 === n.options.infinite ? (n.slideCount > n.options.slidesToShow && (n.slideOffset = n.slideWidth * n.options.slidesToShow * -1, s = -1, !0 === n.options.vertical && !0 === n.options.centerMode && (2 === n.options.slidesToShow ? s = -1.5 : 1 === n.options.slidesToShow && (s = -2)), r = t * n.options.slidesToShow * s), n.slideCount % n.options.slidesToScroll != 0 && i + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow && (i > n.slideCount ? (n.slideOffset = (n.options.slidesToShow - (i - n.slideCount)) * n.slideWidth * -1, r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1) : (n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1, r = n.slideCount % n.options.slidesToScroll * t * -1))) : i + n.options.slidesToShow > n.slideCount && (n.slideOffset = (i + n.options.slidesToShow - n.slideCount) * n.slideWidth, r = (i + n.options.slidesToShow - n.slideCount) * t), n.slideCount <= n.options.slidesToShow && (n.slideOffset = 0, r = 0), !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow ? n.slideOffset = n.slideWidth * Math.floor(n.options.slidesToShow) / 2 - n.slideWidth * n.slideCount / 2 : !0 === n.options.centerMode && !0 === n.options.infinite ? n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth : !0 === n.options.centerMode && (n.slideOffset = 0, n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2)), e = !1 === n.options.vertical ? i * n.slideWidth * -1 + n.slideOffset : i * t * -1 + r, !0 === n.options.variableWidth && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow), e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, !0 === n.options.centerMode && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow + 1), e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, e += (n.$list.width() - o.outerWidth()) / 2)), e;
    }, e.prototype.getOption = e.prototype.slickGetOption = function (i) {
      return this.options[i];
    }, e.prototype.getNavigableIndexes = function () {
      var i,
          e = this,
          t = 0,
          o = 0,
          s = [];

      for (!1 === e.options.infinite ? i = e.slideCount : (t = -1 * e.options.slidesToScroll, o = -1 * e.options.slidesToScroll, i = 2 * e.slideCount); t < i;) {
        s.push(t), t = o + e.options.slidesToScroll, o += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
      }

      return s;
    }, e.prototype.getSlick = function () {
      return this;
    }, e.prototype.getSlideCount = function () {
      var e,
          t,
          o = this;
      return t = !0 === o.options.centerMode ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0, !0 === o.options.swipeToSlide ? (o.$slideTrack.find(".slick-slide").each(function (s, n) {
        if (n.offsetLeft - t + i(n).outerWidth() / 2 > -1 * o.swipeLeft) return e = n, !1;
      }), Math.abs(i(e).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll;
    }, e.prototype.goTo = e.prototype.slickGoTo = function (i, e) {
      this.changeSlide({
        data: {
          message: "index",
          index: parseInt(i)
        }
      }, e);
    }, e.prototype.init = function (e) {
      var t = this;
      i(t.$slider).hasClass("slick-initialized") || (i(t.$slider).addClass("slick-initialized"), t.buildRows(), t.buildOut(), t.setProps(), t.startLoad(), t.loadSlider(), t.initializeEvents(), t.updateArrows(), t.updateDots(), t.checkResponsive(!0), t.focusHandler()), e && t.$slider.trigger("init", [t]), !0 === t.options.accessibility && t.initADA(), t.options.autoplay && (t.paused = !1, t.autoPlay());
    }, e.prototype.initADA = function () {
      var e = this,
          t = Math.ceil(e.slideCount / e.options.slidesToShow),
          o = e.getNavigableIndexes().filter(function (i) {
        return i >= 0 && i < e.slideCount;
      });
      e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
        "aria-hidden": "true",
        tabindex: "-1"
      }).find("a, input, button, select").attr({
        tabindex: "-1"
      }), null !== e.$dots && (e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function (t) {
        var s = o.indexOf(t);
        i(this).attr({
          role: "tabpanel",
          id: "slick-slide" + e.instanceUid + t,
          tabindex: -1
        }), -1 !== s && i(this).attr({
          "aria-describedby": "slick-slide-control" + e.instanceUid + s
        });
      }), e.$dots.attr("role", "tablist").find("li").each(function (s) {
        var n = o[s];
        i(this).attr({
          role: "presentation"
        }), i(this).find("button").first().attr({
          role: "tab",
          id: "slick-slide-control" + e.instanceUid + s,
          "aria-controls": "slick-slide" + e.instanceUid + n,
          "aria-label": s + 1 + " of " + t,
          "aria-selected": null,
          tabindex: "-1"
        });
      }).eq(e.currentSlide).find("button").attr({
        "aria-selected": "true",
        tabindex: "0"
      }).end());

      for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++) {
        e.$slides.eq(s).attr("tabindex", 0);
      }

      e.activateADA();
    }, e.prototype.initArrowEvents = function () {
      var i = this;
      !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.off("click.slick").on("click.slick", {
        message: "previous"
      }, i.changeSlide), i.$nextArrow.off("click.slick").on("click.slick", {
        message: "next"
      }, i.changeSlide), !0 === i.options.accessibility && (i.$prevArrow.on("keydown.slick", i.keyHandler), i.$nextArrow.on("keydown.slick", i.keyHandler)));
    }, e.prototype.initDotEvents = function () {
      var e = this;
      !0 === e.options.dots && (i("li", e.$dots).on("click.slick", {
        message: "index"
      }, e.changeSlide), !0 === e.options.accessibility && e.$dots.on("keydown.slick", e.keyHandler)), !0 === e.options.dots && !0 === e.options.pauseOnDotsHover && i("li", e.$dots).on("mouseenter.slick", i.proxy(e.interrupt, e, !0)).on("mouseleave.slick", i.proxy(e.interrupt, e, !1));
    }, e.prototype.initSlideEvents = function () {
      var e = this;
      e.options.pauseOnHover && (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)));
    }, e.prototype.initializeEvents = function () {
      var e = this;
      e.initArrowEvents(), e.initDotEvents(), e.initSlideEvents(), e.$list.on("touchstart.slick mousedown.slick", {
        action: "start"
      }, e.swipeHandler), e.$list.on("touchmove.slick mousemove.slick", {
        action: "move"
      }, e.swipeHandler), e.$list.on("touchend.slick mouseup.slick", {
        action: "end"
      }, e.swipeHandler), e.$list.on("touchcancel.slick mouseleave.slick", {
        action: "end"
      }, e.swipeHandler), e.$list.on("click.slick", e.clickHandler), i(document).on(e.visibilityChange, i.proxy(e.visibility, e)), !0 === e.options.accessibility && e.$list.on("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler), i(window).on("orientationchange.slick.slick-" + e.instanceUid, i.proxy(e.orientationChange, e)), i(window).on("resize.slick.slick-" + e.instanceUid, i.proxy(e.resize, e)), i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault), i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition), i(e.setPosition);
    }, e.prototype.initUI = function () {
      var i = this;
      !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.show(), i.$nextArrow.show()), !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.show();
    }, e.prototype.keyHandler = function (i) {
      var e = this;
      i.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === i.keyCode && !0 === e.options.accessibility ? e.changeSlide({
        data: {
          message: !0 === e.options.rtl ? "next" : "previous"
        }
      }) : 39 === i.keyCode && !0 === e.options.accessibility && e.changeSlide({
        data: {
          message: !0 === e.options.rtl ? "previous" : "next"
        }
      }));
    }, e.prototype.lazyLoad = function () {
      function e(e) {
        i("img[data-lazy]", e).each(function () {
          var e = i(this),
              t = i(this).attr("data-lazy"),
              o = i(this).attr("data-srcset"),
              s = i(this).attr("data-sizes") || n.$slider.attr("data-sizes"),
              r = document.createElement("img");
          r.onload = function () {
            e.animate({
              opacity: 0
            }, 100, function () {
              o && (e.attr("srcset", o), s && e.attr("sizes", s)), e.attr("src", t).animate({
                opacity: 1
              }, 200, function () {
                e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading");
              }), n.$slider.trigger("lazyLoaded", [n, e, t]);
            });
          }, r.onerror = function () {
            e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), n.$slider.trigger("lazyLoadError", [n, e, t]);
          }, r.src = t;
        });
      }

      var t,
          o,
          s,
          n = this;
      if (!0 === n.options.centerMode ? !0 === n.options.infinite ? s = (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) + n.options.slidesToShow + 2 : (o = Math.max(0, n.currentSlide - (n.options.slidesToShow / 2 + 1)), s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide) : (o = n.options.infinite ? n.options.slidesToShow + n.currentSlide : n.currentSlide, s = Math.ceil(o + n.options.slidesToShow), !0 === n.options.fade && (o > 0 && o--, s <= n.slideCount && s++)), t = n.$slider.find(".slick-slide").slice(o, s), "anticipated" === n.options.lazyLoad) for (var r = o - 1, l = s, d = n.$slider.find(".slick-slide"), a = 0; a < n.options.slidesToScroll; a++) {
        r < 0 && (r = n.slideCount - 1), t = (t = t.add(d.eq(r))).add(d.eq(l)), r--, l++;
      }
      e(t), n.slideCount <= n.options.slidesToShow ? e(n.$slider.find(".slick-slide")) : n.currentSlide >= n.slideCount - n.options.slidesToShow ? e(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow)) : 0 === n.currentSlide && e(n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow));
    }, e.prototype.loadSlider = function () {
      var i = this;
      i.setPosition(), i.$slideTrack.css({
        opacity: 1
      }), i.$slider.removeClass("slick-loading"), i.initUI(), "progressive" === i.options.lazyLoad && i.progressiveLazyLoad();
    }, e.prototype.next = e.prototype.slickNext = function () {
      this.changeSlide({
        data: {
          message: "next"
        }
      });
    }, e.prototype.orientationChange = function () {
      var i = this;
      i.checkResponsive(), i.setPosition();
    }, e.prototype.pause = e.prototype.slickPause = function () {
      var i = this;
      i.autoPlayClear(), i.paused = !0;
    }, e.prototype.play = e.prototype.slickPlay = function () {
      var i = this;
      i.autoPlay(), i.options.autoplay = !0, i.paused = !1, i.focussed = !1, i.interrupted = !1;
    }, e.prototype.postSlide = function (e) {
      var t = this;
      t.unslicked || (t.$slider.trigger("afterChange", [t, e]), t.animating = !1, t.slideCount > t.options.slidesToShow && t.setPosition(), t.swipeLeft = null, t.options.autoplay && t.autoPlay(), !0 === t.options.accessibility && (t.initADA(), t.options.focusOnChange && i(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()));
    }, e.prototype.prev = e.prototype.slickPrev = function () {
      this.changeSlide({
        data: {
          message: "previous"
        }
      });
    }, e.prototype.preventDefault = function (i) {
      i.preventDefault();
    }, e.prototype.progressiveLazyLoad = function (e) {
      e = e || 1;
      var t,
          o,
          s,
          n,
          r,
          l = this,
          d = i("img[data-lazy]", l.$slider);
      d.length ? (t = d.first(), o = t.attr("data-lazy"), s = t.attr("data-srcset"), n = t.attr("data-sizes") || l.$slider.attr("data-sizes"), (r = document.createElement("img")).onload = function () {
        s && (t.attr("srcset", s), n && t.attr("sizes", n)), t.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), !0 === l.options.adaptiveHeight && l.setPosition(), l.$slider.trigger("lazyLoaded", [l, t, o]), l.progressiveLazyLoad();
      }, r.onerror = function () {
        e < 3 ? setTimeout(function () {
          l.progressiveLazyLoad(e + 1);
        }, 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), l.$slider.trigger("lazyLoadError", [l, t, o]), l.progressiveLazyLoad());
      }, r.src = o) : l.$slider.trigger("allImagesLoaded", [l]);
    }, e.prototype.refresh = function (e) {
      var t,
          o,
          s = this;
      o = s.slideCount - s.options.slidesToShow, !s.options.infinite && s.currentSlide > o && (s.currentSlide = o), s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0), t = s.currentSlide, s.destroy(!0), i.extend(s, s.initials, {
        currentSlide: t
      }), s.init(), e || s.changeSlide({
        data: {
          message: "index",
          index: t
        }
      }, !1);
    }, e.prototype.registerBreakpoints = function () {
      var e,
          t,
          o,
          s = this,
          n = s.options.responsive || null;

      if ("array" === i.type(n) && n.length) {
        s.respondTo = s.options.respondTo || "window";

        for (e in n) {
          if (o = s.breakpoints.length - 1, n.hasOwnProperty(e)) {
            for (t = n[e].breakpoint; o >= 0;) {
              s.breakpoints[o] && s.breakpoints[o] === t && s.breakpoints.splice(o, 1), o--;
            }

            s.breakpoints.push(t), s.breakpointSettings[t] = n[e].settings;
          }
        }

        s.breakpoints.sort(function (i, e) {
          return s.options.mobileFirst ? i - e : e - i;
        });
      }
    }, e.prototype.reinit = function () {
      var e = this;
      e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"), e.slideCount = e.$slides.length, e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll), e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0), e.registerBreakpoints(), e.setProps(), e.setupInfinite(), e.buildArrows(), e.updateArrows(), e.initArrowEvents(), e.buildDots(), e.updateDots(), e.initDotEvents(), e.cleanUpSlideEvents(), e.initSlideEvents(), e.checkResponsive(!1, !0), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.setPosition(), e.focusHandler(), e.paused = !e.options.autoplay, e.autoPlay(), e.$slider.trigger("reInit", [e]);
    }, e.prototype.resize = function () {
      var e = this;
      i(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay), e.windowDelay = window.setTimeout(function () {
        e.windowWidth = i(window).width(), e.checkResponsive(), e.unslicked || e.setPosition();
      }, 50));
    }, e.prototype.removeSlide = e.prototype.slickRemove = function (i, e, t) {
      var o = this;
      if (i = "boolean" == typeof i ? !0 === (e = i) ? 0 : o.slideCount - 1 : !0 === e ? --i : i, o.slideCount < 1 || i < 0 || i > o.slideCount - 1) return !1;
      o.unload(), !0 === t ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(i).remove(), o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), o.$slideTrack.append(o.$slides), o.$slidesCache = o.$slides, o.reinit();
    }, e.prototype.setCSS = function (i) {
      var e,
          t,
          o = this,
          s = {};
      !0 === o.options.rtl && (i = -i), e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px", t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px", s[o.positionProp] = i, !1 === o.transformsEnabled ? o.$slideTrack.css(s) : (s = {}, !1 === o.cssTransitions ? (s[o.animType] = "translate(" + e + ", " + t + ")", o.$slideTrack.css(s)) : (s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)", o.$slideTrack.css(s)));
    }, e.prototype.setDimensions = function () {
      var i = this;
      !1 === i.options.vertical ? !0 === i.options.centerMode && i.$list.css({
        padding: "0px " + i.options.centerPadding
      }) : (i.$list.height(i.$slides.first().outerHeight(!0) * i.options.slidesToShow), !0 === i.options.centerMode && i.$list.css({
        padding: i.options.centerPadding + " 0px"
      })), i.listWidth = i.$list.width(), i.listHeight = i.$list.height(), !1 === i.options.vertical && !1 === i.options.variableWidth ? (i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow), i.$slideTrack.width(Math.ceil(i.slideWidth * i.$slideTrack.children(".slick-slide").length))) : !0 === i.options.variableWidth ? i.$slideTrack.width(5e3 * i.slideCount) : (i.slideWidth = Math.ceil(i.listWidth), i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0) * i.$slideTrack.children(".slick-slide").length)));
      var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
      !1 === i.options.variableWidth && i.$slideTrack.children(".slick-slide").width(i.slideWidth - e);
    }, e.prototype.setFade = function () {
      var e,
          t = this;
      t.$slides.each(function (o, s) {
        e = t.slideWidth * o * -1, !0 === t.options.rtl ? i(s).css({
          position: "relative",
          right: e,
          top: 0,
          zIndex: t.options.zIndex - 2,
          opacity: 0
        }) : i(s).css({
          position: "relative",
          left: e,
          top: 0,
          zIndex: t.options.zIndex - 2,
          opacity: 0
        });
      }), t.$slides.eq(t.currentSlide).css({
        zIndex: t.options.zIndex - 1,
        opacity: 1
      });
    }, e.prototype.setHeight = function () {
      var i = this;

      if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
        var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
        i.$list.css("height", e);
      }
    }, e.prototype.setOption = e.prototype.slickSetOption = function () {
      var e,
          t,
          o,
          s,
          n,
          r = this,
          l = !1;
      if ("object" === i.type(arguments[0]) ? (o = arguments[0], l = arguments[1], n = "multiple") : "string" === i.type(arguments[0]) && (o = arguments[0], s = arguments[1], l = arguments[2], "responsive" === arguments[0] && "array" === i.type(arguments[1]) ? n = "responsive" : void 0 !== arguments[1] && (n = "single")), "single" === n) r.options[o] = s;else if ("multiple" === n) i.each(o, function (i, e) {
        r.options[i] = e;
      });else if ("responsive" === n) for (t in s) {
        if ("array" !== i.type(r.options.responsive)) r.options.responsive = [s[t]];else {
          for (e = r.options.responsive.length - 1; e >= 0;) {
            r.options.responsive[e].breakpoint === s[t].breakpoint && r.options.responsive.splice(e, 1), e--;
          }

          r.options.responsive.push(s[t]);
        }
      }
      l && (r.unload(), r.reinit());
    }, e.prototype.setPosition = function () {
      var i = this;
      i.setDimensions(), i.setHeight(), !1 === i.options.fade ? i.setCSS(i.getLeft(i.currentSlide)) : i.setFade(), i.$slider.trigger("setPosition", [i]);
    }, e.prototype.setProps = function () {
      var i = this,
          e = document.body.style;
      i.positionProp = !0 === i.options.vertical ? "top" : "left", "top" === i.positionProp ? i.$slider.addClass("slick-vertical") : i.$slider.removeClass("slick-vertical"), void 0 === e.WebkitTransition && void 0 === e.MozTransition && void 0 === e.msTransition || !0 === i.options.useCSS && (i.cssTransitions = !0), i.options.fade && ("number" == typeof i.options.zIndex ? i.options.zIndex < 3 && (i.options.zIndex = 3) : i.options.zIndex = i.defaults.zIndex), void 0 !== e.OTransform && (i.animType = "OTransform", i.transformType = "-o-transform", i.transitionType = "OTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), void 0 !== e.MozTransform && (i.animType = "MozTransform", i.transformType = "-moz-transform", i.transitionType = "MozTransition", void 0 === e.perspectiveProperty && void 0 === e.MozPerspective && (i.animType = !1)), void 0 !== e.webkitTransform && (i.animType = "webkitTransform", i.transformType = "-webkit-transform", i.transitionType = "webkitTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), void 0 !== e.msTransform && (i.animType = "msTransform", i.transformType = "-ms-transform", i.transitionType = "msTransition", void 0 === e.msTransform && (i.animType = !1)), void 0 !== e.transform && !1 !== i.animType && (i.animType = "transform", i.transformType = "transform", i.transitionType = "transition"), i.transformsEnabled = i.options.useTransform && null !== i.animType && !1 !== i.animType;
    }, e.prototype.setSlideClasses = function (i) {
      var e,
          t,
          o,
          s,
          n = this;

      if (t = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), n.$slides.eq(i).addClass("slick-current"), !0 === n.options.centerMode) {
        var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
        e = Math.floor(n.options.slidesToShow / 2), !0 === n.options.infinite && (i >= e && i <= n.slideCount - 1 - e ? n.$slides.slice(i - e + r, i + e + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = n.options.slidesToShow + i, t.slice(o - e + 1 + r, o + e + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === i ? t.eq(t.length - 1 - n.options.slidesToShow).addClass("slick-center") : i === n.slideCount - 1 && t.eq(n.options.slidesToShow).addClass("slick-center")), n.$slides.eq(i).addClass("slick-center");
      } else i >= 0 && i <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(i, i + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : t.length <= n.options.slidesToShow ? t.addClass("slick-active").attr("aria-hidden", "false") : (s = n.slideCount % n.options.slidesToShow, o = !0 === n.options.infinite ? n.options.slidesToShow + i : i, n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - i < n.options.slidesToShow ? t.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false") : t.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));

      "ondemand" !== n.options.lazyLoad && "anticipated" !== n.options.lazyLoad || n.lazyLoad();
    }, e.prototype.setupInfinite = function () {
      var e,
          t,
          o,
          s = this;

      if (!0 === s.options.fade && (s.options.centerMode = !1), !0 === s.options.infinite && !1 === s.options.fade && (t = null, s.slideCount > s.options.slidesToShow)) {
        for (o = !0 === s.options.centerMode ? s.options.slidesToShow + 1 : s.options.slidesToShow, e = s.slideCount; e > s.slideCount - o; e -= 1) {
          t = e - 1, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
        }

        for (e = 0; e < o + s.slideCount; e += 1) {
          t = e, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
        }

        s.$slideTrack.find(".slick-cloned").find("[id]").each(function () {
          i(this).attr("id", "");
        });
      }
    }, e.prototype.interrupt = function (i) {
      var e = this;
      i || e.autoPlay(), e.interrupted = i;
    }, e.prototype.selectHandler = function (e) {
      var t = this,
          o = i(e.target).is(".slick-slide") ? i(e.target) : i(e.target).parents(".slick-slide"),
          s = parseInt(o.attr("data-slick-index"));
      s || (s = 0), t.slideCount <= t.options.slidesToShow ? t.slideHandler(s, !1, !0) : t.slideHandler(s);
    }, e.prototype.slideHandler = function (i, e, t) {
      var o,
          s,
          n,
          r,
          l,
          d = null,
          a = this;
      if (e = e || !1, !(!0 === a.animating && !0 === a.options.waitForAnimate || !0 === a.options.fade && a.currentSlide === i)) if (!1 === e && a.asNavFor(i), o = i, d = a.getLeft(o), r = a.getLeft(a.currentSlide), a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft, !1 === a.options.infinite && !1 === a.options.centerMode && (i < 0 || i > a.getDotCount() * a.options.slidesToScroll)) !1 === a.options.fade && (o = a.currentSlide, !0 !== t ? a.animateSlide(r, function () {
        a.postSlide(o);
      }) : a.postSlide(o));else if (!1 === a.options.infinite && !0 === a.options.centerMode && (i < 0 || i > a.slideCount - a.options.slidesToScroll)) !1 === a.options.fade && (o = a.currentSlide, !0 !== t ? a.animateSlide(r, function () {
        a.postSlide(o);
      }) : a.postSlide(o));else {
        if (a.options.autoplay && clearInterval(a.autoPlayTimer), s = o < 0 ? a.slideCount % a.options.slidesToScroll != 0 ? a.slideCount - a.slideCount % a.options.slidesToScroll : a.slideCount + o : o >= a.slideCount ? a.slideCount % a.options.slidesToScroll != 0 ? 0 : o - a.slideCount : o, a.animating = !0, a.$slider.trigger("beforeChange", [a, a.currentSlide, s]), n = a.currentSlide, a.currentSlide = s, a.setSlideClasses(a.currentSlide), a.options.asNavFor && (l = (l = a.getNavTarget()).slick("getSlick")).slideCount <= l.options.slidesToShow && l.setSlideClasses(a.currentSlide), a.updateDots(), a.updateArrows(), !0 === a.options.fade) return !0 !== t ? (a.fadeSlideOut(n), a.fadeSlide(s, function () {
          a.postSlide(s);
        })) : a.postSlide(s), void a.animateHeight();
        !0 !== t ? a.animateSlide(d, function () {
          a.postSlide(s);
        }) : a.postSlide(s);
      }
    }, e.prototype.startLoad = function () {
      var i = this;
      !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.hide(), i.$nextArrow.hide()), !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.hide(), i.$slider.addClass("slick-loading");
    }, e.prototype.swipeDirection = function () {
      var i,
          e,
          t,
          o,
          s = this;
      return i = s.touchObject.startX - s.touchObject.curX, e = s.touchObject.startY - s.touchObject.curY, t = Math.atan2(e, i), (o = Math.round(180 * t / Math.PI)) < 0 && (o = 360 - Math.abs(o)), o <= 45 && o >= 0 ? !1 === s.options.rtl ? "left" : "right" : o <= 360 && o >= 315 ? !1 === s.options.rtl ? "left" : "right" : o >= 135 && o <= 225 ? !1 === s.options.rtl ? "right" : "left" : !0 === s.options.verticalSwiping ? o >= 35 && o <= 135 ? "down" : "up" : "vertical";
    }, e.prototype.swipeEnd = function (i) {
      var e,
          t,
          o = this;
      if (o.dragging = !1, o.swiping = !1, o.scrolling) return o.scrolling = !1, !1;
      if (o.interrupted = !1, o.shouldClick = !(o.touchObject.swipeLength > 10), void 0 === o.touchObject.curX) return !1;

      if (!0 === o.touchObject.edgeHit && o.$slider.trigger("edge", [o, o.swipeDirection()]), o.touchObject.swipeLength >= o.touchObject.minSwipe) {
        switch (t = o.swipeDirection()) {
          case "left":
          case "down":
            e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(), o.currentDirection = 0;
            break;

          case "right":
          case "up":
            e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(), o.currentDirection = 1;
        }

        "vertical" != t && (o.slideHandler(e), o.touchObject = {}, o.$slider.trigger("swipe", [o, t]));
      } else o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide), o.touchObject = {});
    }, e.prototype.swipeHandler = function (i) {
      var e = this;
      if (!(!1 === e.options.swipe || "ontouchend" in document && !1 === e.options.swipe || !1 === e.options.draggable && -1 !== i.type.indexOf("mouse"))) switch (e.touchObject.fingerCount = i.originalEvent && void 0 !== i.originalEvent.touches ? i.originalEvent.touches.length : 1, e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold, !0 === e.options.verticalSwiping && (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold), i.data.action) {
        case "start":
          e.swipeStart(i);
          break;

        case "move":
          e.swipeMove(i);
          break;

        case "end":
          e.swipeEnd(i);
      }
    }, e.prototype.swipeMove = function (i) {
      var e,
          t,
          o,
          s,
          n,
          r,
          l = this;
      return n = void 0 !== i.originalEvent ? i.originalEvent.touches : null, !(!l.dragging || l.scrolling || n && 1 !== n.length) && (e = l.getLeft(l.currentSlide), l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX, l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY, l.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))), r = Math.round(Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))), !l.options.verticalSwiping && !l.swiping && r > 4 ? (l.scrolling = !0, !1) : (!0 === l.options.verticalSwiping && (l.touchObject.swipeLength = r), t = l.swipeDirection(), void 0 !== i.originalEvent && l.touchObject.swipeLength > 4 && (l.swiping = !0, i.preventDefault()), s = (!1 === l.options.rtl ? 1 : -1) * (l.touchObject.curX > l.touchObject.startX ? 1 : -1), !0 === l.options.verticalSwiping && (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1), o = l.touchObject.swipeLength, l.touchObject.edgeHit = !1, !1 === l.options.infinite && (0 === l.currentSlide && "right" === t || l.currentSlide >= l.getDotCount() && "left" === t) && (o = l.touchObject.swipeLength * l.options.edgeFriction, l.touchObject.edgeHit = !0), !1 === l.options.vertical ? l.swipeLeft = e + o * s : l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s, !0 === l.options.verticalSwiping && (l.swipeLeft = e + o * s), !0 !== l.options.fade && !1 !== l.options.touchMove && (!0 === l.animating ? (l.swipeLeft = null, !1) : void l.setCSS(l.swipeLeft))));
    }, e.prototype.swipeStart = function (i) {
      var e,
          t = this;
      if (t.interrupted = !0, 1 !== t.touchObject.fingerCount || t.slideCount <= t.options.slidesToShow) return t.touchObject = {}, !1;
      void 0 !== i.originalEvent && void 0 !== i.originalEvent.touches && (e = i.originalEvent.touches[0]), t.touchObject.startX = t.touchObject.curX = void 0 !== e ? e.pageX : i.clientX, t.touchObject.startY = t.touchObject.curY = void 0 !== e ? e.pageY : i.clientY, t.dragging = !0;
    }, e.prototype.unfilterSlides = e.prototype.slickUnfilter = function () {
      var i = this;
      null !== i.$slidesCache && (i.unload(), i.$slideTrack.children(this.options.slide).detach(), i.$slidesCache.appendTo(i.$slideTrack), i.reinit());
    }, e.prototype.unload = function () {
      var e = this;
      i(".slick-cloned", e.$slider).remove(), e.$dots && e.$dots.remove(), e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(), e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(), e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "");
    }, e.prototype.unslick = function (i) {
      var e = this;
      e.$slider.trigger("unslick", [e, i]), e.destroy();
    }, e.prototype.updateArrows = function () {
      var i = this;
      Math.floor(i.options.slidesToShow / 2), !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && !i.options.infinite && (i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === i.currentSlide ? (i.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - i.options.slidesToShow && !1 === i.options.centerMode ? (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - 1 && !0 === i.options.centerMode && (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")));
    }, e.prototype.updateDots = function () {
      var i = this;
      null !== i.$dots && (i.$dots.find("li").removeClass("slick-active").end(), i.$dots.find("li").eq(Math.floor(i.currentSlide / i.options.slidesToScroll)).addClass("slick-active"));
    }, e.prototype.visibility = function () {
      var i = this;
      i.options.autoplay && (document[i.hidden] ? i.interrupted = !0 : i.interrupted = !1);
    }, i.fn.slick = function () {
      var i,
          t,
          o = this,
          s = arguments[0],
          n = Array.prototype.slice.call(arguments, 1),
          r = o.length;

      for (i = 0; i < r; i++) {
        if ("object" == _typeof(s) || void 0 === s ? o[i].slick = new e(o[i], s) : t = o[i].slick[s].apply(o[i].slick, n), void 0 !== t) return t;
      }

      return o;
    };
  });
  $(document).ready(function () {
    $('.banners-slider').slick({
      infinite: false,
      dots: false,
      prevArrow: '<button class="prev arrow"></button>',
      nextArrow: '<button class="next arrow"></button>',
      responsive: [{
        breakpoint: 1024,
        settings: {
          dots: false,
          // prevArrow: false,
          // nextArrow: false,
          arrows: false,
          infinite: true,
          autoplay: true,
          autoplaySpeed: 3000
        }
      }, // {
      //     breakpoint: 600,
      //     settings: {
      //     slidesToShow: 2,
      //     slidesToScroll: 2
      //     }
      // },
      {
        breakpoint: 320,
        settings: {
          dots: false,
          prevArrow: false,
          nextArrow: false,
          arrows: false
        }
      } // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
      ]
    });
  });
  $(document).ready(function () {
    $('.product-slider').slick({
      dots: false,
      // кастомные точки(цифры) customPaging: (slider, i) => `<a>${i + 1}</a>`
      // колонки rows:
      infinite: false,
      speed: 400,
      slidesToShow: 4,
      slidesToScroll: 4,
      prevArrow: '<button class="prev arrow"></button>',
      nextArrow: '<button class="next arrow"></button>',
      responsive: [{
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: true
        }
      }, {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }, {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        }
      }, {
        breakpoint: 320,
        settings: {
          dots: true,
          prevArrow: false,
          nextArrow: false,
          arrows: false
        }
      } // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
      ]
    });
    $('.SOMEcategory-slider').slick({
      rows: 2,
      dots: true,
      customPaging: function customPaging(slider, i) {
        return "<a>".concat(i + 1, "</a>");
      },
      infinite: false,
      arrows: false,
      speed: 600,
      slidesToShow: 3,
      slidesToScroll: 3
    });
  }); // $(function(){
  //     $('.product-list-expend').click(function(){
  //         $('.product-list').toggleClass('product-slider');
  //     });
  // });

  $(function () {
    $("#filter__range").slider({
      min: 0,
      max: 50000,
      values: [25000, 35000],
      range: true,
      stop: function stop(event, ui) {
        $("input#priceMin").val($("#filter__range").slider("values", 0));
        $("input#priceMax").val($("#filter__range").slider("values", 1));
      },
      slide: function slide(event, ui) {
        $("input#priceMin").val($("#filter__range").slider("values", 0));
        $("input#priceMax").val($("#filter__range").slider("values", 1));
      }
    });
    $("input#priceMin").on('change', function () {
      var value1 = $("input#priceMin").val();
      var value2 = $("input#priceMax").val();

      if (parseInt(value1) > parseInt(value2)) {
        value1 = value2;
        $("input#priceMin").val(value1);
      }

      $("#filter__range").slider("values", 0, value1);
    });
    $("input#priceMax").on('change', function () {
      var value1 = $("input#priceMin").val();
      var value2 = $("input#priceMax").val();

      if (value2 > 50000) {
        value2 = 50000;
        $("input#priceMax").val(50000);
      }

      if (parseInt(value1) > parseInt(value2)) {
        value2 = value1;
        $("input#priceMax").val(value2);
      }

      $("#filter__range").slider("values", 1, value2);
    });
  });
  $('.prod-description-picture__img-max').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    infinite: false,
    fade: true,
    asNavFor: '.prod-description-picture__img-min'
  });
  $('.prod-description-picture__img-min').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    asNavFor: '.prod-description-picture__img-max',
    // arrows: true,
    prevArrow: '<button class="prev_up arrow arrow_product"></button>',
    nextArrow: '<button class="next_down arrow arrow_product"></button>',
    dots: false,
    vertical: true,
    verticalSwiping: true,
    // centerMode: true,
    focusOnSelect: true
  }); // Лайк

  $('.btn-like').on('click', function (e) {
    e.preventDefault;
    $('.fa-heart').toggleClass('fas');
  }); // Категории

  $('.header__catalog-btn').on('click', function (e) {
    e.preventDefault;
    $(this).toggleClass('header__catalog-btn_active');
  }); // Аккордеонб сайдбар-фильтр

  $(document).ready(function () {
    $('.tab-header').click(function () {
      $(this).toggleClass('collapse-btn__active').next().slideToggle(); // $('.tab-header').not(this).removeClass('collapse-btn__active').next().slideUp();
    });
  });
  $(document).ready(function () {
    // $('.filter__more').click(function () {
    //     $('.custom-checkbox').toggleClass('custom-checkbox__active');
    //     // $('.tab-header').not(this).removeClass('collapse-btn__active').next().slideUp();
    // });
    $('.btn__more').click(function () {
      $(this).prev().toggleClass('filter__active'); // $('.tab-header').not(this).removeClass('collapse-btn__active').next().slideUp();
    });
  }); // button quantity

  $('.add').click(function () {
    if ($(this).prev().val() < 10) {
      $(this).prev().val(+$(this).prev().val() + 1);
    }
  });
  $('.sub').click(function () {
    if ($(this).next().val() > 1) {
      if ($(this).next().val() > 1) $(this).next().val(+$(this).next().val() - 1);
    }
  }); // Сменяющаяся

  $('.btn_change').click(function () {
    $(this).text(function (i, text) {
      return text === "Показать еще" ? "Скрыть" : "Показать еще";
    });
  });
  $('.btn_basket').click(function () {
    $(this).text(function (i, text) {
      return text === "В корзину" ? "Удалить из корзины" : "В корзину";
    });
  }); // var rating = document.querySelector('.star'),
  //     ratingItem = document.querySelectorAll('.star-item');
  // rating.onclick = function(e){
  //   var target = e.target;
  //   if(target.classList.contains('star-item')){
  //     removeClass(ratingItem,'active')
  //     target.classList.add('active');
  //   }
  // };
  // function removeClass(elements, className) {
  //   for (var i = 0; i < elements.length; i++) {
  //      elements[i].classList.remove(className);
  //   }
  // };
  // const circle = document.querySelector('.rating-ring__circle');
  // const radius = circle.r.baseVal.value;
  // const circumference = 2 * Math.PI * radius;
  // circle.style.strokeDashoffset = circumference;
  // circle.style.strokeDasharray = circumference;
  // function setProgress(percent) {
  //     const offset = circumference - percent / 100 * circumference;
  //     circle.style.strokeDashoffset = offset;
  // }
  // setProgress(64);

  /**
   * Фиксированный хедер
   */
  // $(window).on('scroll', toggleFixedHeader);
  // function toggleFixedHeader() {
  //     const $header = $('.header');
  //     const $main = $('.header').next();
  //     if (window.pageYOffset > 0) {
  //         $header.addClass('is-fixed');
  //         $main.css({ marginTop: $header.outerHeight() });
  //     } else {
  //         $header.removeClass('is-fixed');
  //         $main.css({ marginTop: 0 });
  //     }
  // }

  ;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wWGxTaXplIiwiZGVza3RvcExnU2l6ZSIsImRlc2t0b3BTaXplIiwidGFibGV0TGdTaXplIiwidGFibGV0U2l6ZSIsIm1vYmlsZUxnU2l6ZSIsIm1vYmlsZVNpemUiLCJwb3B1cHNCcmVha3BvaW50IiwicG9wdXBzRml4ZWRUaW1lb3V0IiwiaXNUb3VjaCIsImJyb3dzZXIiLCJtb2JpbGUiLCJsYW5nIiwiYXR0ciIsImJyZWFrcG9pbnRzIiwiYnJlYWtwb2ludERlc2t0b3BYbCIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJicmVha3BvaW50RGVza3RvcExnIiwiYnJlYWtwb2ludERlc2t0b3AiLCJicmVha3BvaW50VGFibGV0TGciLCJicmVha3BvaW50VGFibGV0IiwiYnJlYWtwb2ludE1vYmlsZUxnU2l6ZSIsImJyZWFrcG9pbnRNb2JpbGUiLCJleHRlbmQiLCJsb2FkIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImZuIiwiYW5pbWF0ZUNzcyIsImFuaW1hdGlvbk5hbWUiLCJjYWxsYmFjayIsImFuaW1hdGlvbkVuZCIsImVsIiwiYW5pbWF0aW9ucyIsImFuaW1hdGlvbiIsIk9BbmltYXRpb24iLCJNb3pBbmltYXRpb24iLCJXZWJraXRBbmltYXRpb24iLCJ0Iiwic3R5bGUiLCJ1bmRlZmluZWQiLCJjcmVhdGVFbGVtZW50Iiwib25lIiwiQ3VzdG9tU2VsZWN0IiwiJGVsZW0iLCJzZWxmIiwiaW5pdCIsIiRpbml0RWxlbSIsImVhY2giLCJoYXNDbGFzcyIsInNlbGVjdFNlYXJjaCIsImRhdGEiLCJtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCIsIkluZmluaXR5Iiwic2VsZWN0MiIsInNlbGVjdE9uQmx1ciIsImRyb3Bkb3duQ3NzQ2xhc3MiLCJvbiIsImUiLCJmaW5kIiwiY29udGV4dCIsInZhbHVlIiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbUZpbGVJbnB1dCIsImkiLCJlbGVtIiwiYnV0dG9uV29yZCIsImNsYXNzTmFtZSIsIndyYXAiLCJwYXJlbnQiLCJwcmVwZW5kIiwiaHRtbCIsInByb21pc2UiLCJkb25lIiwibW91c2Vtb3ZlIiwiY3Vyc29yIiwiaW5wdXQiLCJ3cmFwcGVyIiwid3JhcHBlclgiLCJ3cmFwcGVyWSIsImlucHV0V2lkdGgiLCJpbnB1dEhlaWdodCIsImN1cnNvclgiLCJjdXJzb3JZIiwib2Zmc2V0IiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwicGFnZVgiLCJwYWdlWSIsIm1vdmVJbnB1dFgiLCJtb3ZlSW5wdXRZIiwiY3NzIiwiZmlsZU5hbWUiLCJ2YWwiLCJuZXh0IiwicmVtb3ZlIiwicHJvcCIsImxlbmd0aCIsImZpbGVzIiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJzZWxlY3RlZEZpbGVOYW1lUGxhY2VtZW50Iiwic2libGluZ3MiLCJhZnRlciIsImN1c3RvbVNlbGVjdCIsImluZGV4IiwiZmllbGQiLCJ0cmltIiwiZXZlbnQiLCJsb2NhbGUiLCJQYXJzbGV5Iiwic2V0TG9jYWxlIiwib3B0aW9ucyIsInRyaWdnZXIiLCJ2YWxpZGF0aW9uVGhyZXNob2xkIiwiZXJyb3JzV3JhcHBlciIsImVycm9yVGVtcGxhdGUiLCJjbGFzc0hhbmRsZXIiLCJpbnN0YW5jZSIsIiRlbGVtZW50IiwidHlwZSIsIiRoYW5kbGVyIiwiZXJyb3JzQ29udGFpbmVyIiwiJGNvbnRhaW5lciIsImNsb3Nlc3QiLCJhZGRWYWxpZGF0b3IiLCJ2YWxpZGF0ZVN0cmluZyIsInRlc3QiLCJtZXNzYWdlcyIsInJ1IiwiZW4iLCJyZWdUZXN0IiwicmVnTWF0Y2giLCJtaW4iLCJhcmd1bWVudHMiLCJtYXgiLCJtaW5EYXRlIiwibWF4RGF0ZSIsInZhbHVlRGF0ZSIsInJlc3VsdCIsIm1hdGNoIiwiRGF0ZSIsIm1heFNpemUiLCJwYXJzbGV5SW5zdGFuY2UiLCJzaXplIiwicmVxdWlyZW1lbnRUeXBlIiwiZm9ybWF0cyIsImZpbGVFeHRlbnNpb24iLCJzcGxpdCIsInBvcCIsImZvcm1hdHNBcnIiLCJ2YWxpZCIsIiRibG9jayIsIiRsYXN0IiwiZWxlbWVudCIsInBhcnNsZXkiLCJpbnB1dG1hc2siLCJjbGVhck1hc2tPbkxvc3RGb2N1cyIsInNob3dNYXNrT25Ib3ZlciIsImRhdGVwaWNrZXIiLCJ1cGRhdGVTdmciLCIkdXNlRWxlbWVudCIsImhyZWYiLCJiYXNlVmFsIiwiZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zIiwiZGF0ZUZvcm1hdCIsInNob3dPdGhlck1vbnRocyIsIkRhdGVwaWNrZXIiLCJpdGVtT3B0aW9ucyIsIm9uU2VsZWN0IiwiY2hhbmdlIiwiRGF0ZXBpY2tlclJhbmdlIiwiZGF0ZXBpY2tlclJhbmdlIiwiZnJvbUl0ZW1PcHRpb25zIiwidG9JdGVtT3B0aW9ucyIsImRhdGVGcm9tIiwiZGF0ZVRvIiwiZ2V0RGF0ZSIsImlzVmFsaWQiLCJ2YWxpZGF0ZSIsImRhdGUiLCJwYXJzZURhdGUiLCJlcnJvciIsIlRhYlN3aXRjaGVyIiwidGFicyIsIm9wZW4iLCJ0YWJFbGVtIiwicHJldmVudERlZmF1bHQiLCJwYXJlbnRUYWJzIiwidG9nZ2xlQ2xhc3MiLCJ0YWJTd2l0Y2hlciIsIm9uT3V0c2lkZUNsaWNrSGlkZSIsInRhcmdldEVsZW0iLCJoaWRkZW5FbGVtIiwib3B0aW9uYWxDYiIsImJpbmQiLCJpcyIsInRhcmdldCIsInN0b3AiLCJmYWRlT3V0IiwidmlzaWJpbGl0eUNvbnRyb2wiLCJzZXR0aW5ncyIsInR5cGVzIiwic2V0VmlzaWJpbGl0eSIsInZpc2liaWxpdHlUeXBlIiwibGlzdCIsImRlbGF5IiwiZmFkZUluIiwiZGF0YVR5cGUiLCJ2aXNpYmlsaXR5TGlzdCIsIlNsaWRlciIsInNsaWRlciIsInN0ZXAiLCJ2YWx1ZXMiLCJyYW5nZSIsInNsaWRlIiwidWkiLCJjaGlsZHJlbiIsImFwcGVuZCIsIm9ubG9hZCIsIlBlcnNvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsIm5vZGUiLCJhZGRFdmVudExpc3RlbmVyIiwiY3VycmVudCIsIm5leHRFbGVtZW50U2libGluZyIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJub3QiLCJoaWRlIiwiZXEiLCJtb2RhbENhbGwiLCJtb2RhbENsb3NlIiwiJHRoaXMiLCJtb2RhbElkIiwic2V0VGltZW91dCIsInRyYW5zZm9ybSIsIm1vZGFsUGFyZW50IiwicGFyZW50cyIsInN0b3BQcm9wYWdhdGlvbiIsImRvYyIsInNjIiwiZG4iLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwic2hvdyIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJyZXF1aXJlIiwialF1ZXJ5IiwiU2xpY2siLCJvIiwicyIsIm4iLCJkZWZhdWx0cyIsImFjY2Vzc2liaWxpdHkiLCJhZGFwdGl2ZUhlaWdodCIsImFwcGVuZEFycm93cyIsImFwcGVuZERvdHMiLCJhcnJvd3MiLCJhc05hdkZvciIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsImF1dG9wbGF5IiwiYXV0b3BsYXlTcGVlZCIsImNlbnRlck1vZGUiLCJjZW50ZXJQYWRkaW5nIiwiY3NzRWFzZSIsImN1c3RvbVBhZ2luZyIsInRleHQiLCJkb3RzIiwiZG90c0NsYXNzIiwiZHJhZ2dhYmxlIiwiZWFzaW5nIiwiZWRnZUZyaWN0aW9uIiwiZmFkZSIsImZvY3VzT25TZWxlY3QiLCJmb2N1c09uQ2hhbmdlIiwiaW5maW5pdGUiLCJpbml0aWFsU2xpZGUiLCJsYXp5TG9hZCIsIm1vYmlsZUZpcnN0IiwicGF1c2VPbkhvdmVyIiwicGF1c2VPbkZvY3VzIiwicGF1c2VPbkRvdHNIb3ZlciIsInJlc3BvbmRUbyIsInJlc3BvbnNpdmUiLCJyb3dzIiwicnRsIiwic2xpZGVzUGVyUm93Iiwic2xpZGVzVG9TaG93Iiwic2xpZGVzVG9TY3JvbGwiLCJzcGVlZCIsInN3aXBlIiwic3dpcGVUb1NsaWRlIiwidG91Y2hNb3ZlIiwidG91Y2hUaHJlc2hvbGQiLCJ1c2VDU1MiLCJ1c2VUcmFuc2Zvcm0iLCJ2YXJpYWJsZVdpZHRoIiwidmVydGljYWwiLCJ2ZXJ0aWNhbFN3aXBpbmciLCJ3YWl0Rm9yQW5pbWF0ZSIsInpJbmRleCIsImluaXRpYWxzIiwiYW5pbWF0aW5nIiwiZHJhZ2dpbmciLCJhdXRvUGxheVRpbWVyIiwiY3VycmVudERpcmVjdGlvbiIsImN1cnJlbnRMZWZ0IiwiY3VycmVudFNsaWRlIiwiZGlyZWN0aW9uIiwiJGRvdHMiLCJsaXN0V2lkdGgiLCJsaXN0SGVpZ2h0IiwibG9hZEluZGV4IiwiJG5leHRBcnJvdyIsIiRwcmV2QXJyb3ciLCJzY3JvbGxpbmciLCJzbGlkZUNvdW50Iiwic2xpZGVXaWR0aCIsIiRzbGlkZVRyYWNrIiwiJHNsaWRlcyIsInNsaWRpbmciLCJzbGlkZU9mZnNldCIsInN3aXBlTGVmdCIsInN3aXBpbmciLCIkbGlzdCIsInRvdWNoT2JqZWN0IiwidHJhbnNmb3Jtc0VuYWJsZWQiLCJ1bnNsaWNrZWQiLCJhY3RpdmVCcmVha3BvaW50IiwiYW5pbVR5cGUiLCJhbmltUHJvcCIsImJyZWFrcG9pbnRTZXR0aW5ncyIsImNzc1RyYW5zaXRpb25zIiwiZm9jdXNzZWQiLCJpbnRlcnJ1cHRlZCIsImhpZGRlbiIsInBhdXNlZCIsInBvc2l0aW9uUHJvcCIsInJvd0NvdW50Iiwic2hvdWxkQ2xpY2siLCIkc2xpZGVyIiwiJHNsaWRlc0NhY2hlIiwidHJhbnNmb3JtVHlwZSIsInRyYW5zaXRpb25UeXBlIiwidmlzaWJpbGl0eUNoYW5nZSIsIndpbmRvd1dpZHRoIiwid2luZG93VGltZXIiLCJvcmlnaW5hbFNldHRpbmdzIiwibW96SGlkZGVuIiwid2Via2l0SGlkZGVuIiwiYXV0b1BsYXkiLCJwcm94eSIsImF1dG9QbGF5Q2xlYXIiLCJhdXRvUGxheUl0ZXJhdG9yIiwiY2hhbmdlU2xpZGUiLCJjbGlja0hhbmRsZXIiLCJzZWxlY3RIYW5kbGVyIiwic2V0UG9zaXRpb24iLCJzd2lwZUhhbmRsZXIiLCJkcmFnSGFuZGxlciIsImtleUhhbmRsZXIiLCJpbnN0YW5jZVVpZCIsImh0bWxFeHByIiwicmVnaXN0ZXJCcmVha3BvaW50cyIsInByb3RvdHlwZSIsImFjdGl2YXRlQURBIiwidGFiaW5kZXgiLCJhZGRTbGlkZSIsInNsaWNrQWRkIiwidW5sb2FkIiwiYXBwZW5kVG8iLCJpbnNlcnRCZWZvcmUiLCJpbnNlcnRBZnRlciIsInByZXBlbmRUbyIsImRldGFjaCIsInJlaW5pdCIsImFuaW1hdGVIZWlnaHQiLCJvdXRlckhlaWdodCIsImFuaW1hdGVTbGlkZSIsImFuaW1TdGFydCIsImR1cmF0aW9uIiwiTWF0aCIsImNlaWwiLCJjb21wbGV0ZSIsImNhbGwiLCJhcHBseVRyYW5zaXRpb24iLCJkaXNhYmxlVHJhbnNpdGlvbiIsImdldE5hdlRhcmdldCIsInNsaWNrIiwic2xpZGVIYW5kbGVyIiwic2V0SW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwiYnVpbGRBcnJvd3MiLCJyZW1vdmVBdHRyIiwiYWRkIiwiYnVpbGREb3RzIiwiZ2V0RG90Q291bnQiLCJmaXJzdCIsImJ1aWxkT3V0Iiwid3JhcEFsbCIsInNldHVwSW5maW5pdGUiLCJ1cGRhdGVEb3RzIiwic2V0U2xpZGVDbGFzc2VzIiwiYnVpbGRSb3dzIiwiciIsImwiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwiZCIsImEiLCJjIiwiZ2V0IiwiYXBwZW5kQ2hpbGQiLCJlbXB0eSIsImRpc3BsYXkiLCJjaGVja1Jlc3BvbnNpdmUiLCJpbm5lcldpZHRoIiwiaGFzT3duUHJvcGVydHkiLCJ1bnNsaWNrIiwicmVmcmVzaCIsImN1cnJlbnRUYXJnZXQiLCJtZXNzYWdlIiwiY2hlY2tOYXZpZ2FibGUiLCJnZXROYXZpZ2FibGVJbmRleGVzIiwiY2xlYW5VcEV2ZW50cyIsIm9mZiIsImludGVycnVwdCIsInZpc2liaWxpdHkiLCJjbGVhblVwU2xpZGVFdmVudHMiLCJvcmllbnRhdGlvbkNoYW5nZSIsInJlc2l6ZSIsImNsZWFuVXBSb3dzIiwic3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIiwiZGVzdHJveSIsImZhZGVTbGlkZSIsIm9wYWNpdHkiLCJmYWRlU2xpZGVPdXQiLCJmaWx0ZXJTbGlkZXMiLCJzbGlja0ZpbHRlciIsImZpbHRlciIsImZvY3VzSGFuZGxlciIsImdldEN1cnJlbnQiLCJzbGlja0N1cnJlbnRTbGlkZSIsImdldExlZnQiLCJmbG9vciIsIm9mZnNldExlZnQiLCJvdXRlcldpZHRoIiwiZ2V0T3B0aW9uIiwic2xpY2tHZXRPcHRpb24iLCJwdXNoIiwiZ2V0U2xpY2siLCJnZXRTbGlkZUNvdW50IiwiYWJzIiwiZ29UbyIsInNsaWNrR29UbyIsInBhcnNlSW50Iiwic2V0UHJvcHMiLCJzdGFydExvYWQiLCJsb2FkU2xpZGVyIiwiaW5pdGlhbGl6ZUV2ZW50cyIsInVwZGF0ZUFycm93cyIsImluaXRBREEiLCJpbmRleE9mIiwicm9sZSIsImlkIiwiZW5kIiwiaW5pdEFycm93RXZlbnRzIiwiaW5pdERvdEV2ZW50cyIsImluaXRTbGlkZUV2ZW50cyIsImFjdGlvbiIsImluaXRVSSIsInRhZ05hbWUiLCJrZXlDb2RlIiwib25lcnJvciIsInNyYyIsInNsaWNlIiwicHJvZ3Jlc3NpdmVMYXp5TG9hZCIsInNsaWNrTmV4dCIsInBhdXNlIiwic2xpY2tQYXVzZSIsInBsYXkiLCJzbGlja1BsYXkiLCJwb3N0U2xpZGUiLCJmb2N1cyIsInByZXYiLCJzbGlja1ByZXYiLCJicmVha3BvaW50Iiwic3BsaWNlIiwic29ydCIsImNsZWFyVGltZW91dCIsIndpbmRvd0RlbGF5IiwicmVtb3ZlU2xpZGUiLCJzbGlja1JlbW92ZSIsInNldENTUyIsInNldERpbWVuc2lvbnMiLCJwYWRkaW5nIiwic2V0RmFkZSIsInBvc2l0aW9uIiwicmlnaHQiLCJzZXRIZWlnaHQiLCJzZXRPcHRpb24iLCJzbGlja1NldE9wdGlvbiIsImJvZHkiLCJXZWJraXRUcmFuc2l0aW9uIiwiTW96VHJhbnNpdGlvbiIsIm1zVHJhbnNpdGlvbiIsIk9UcmFuc2Zvcm0iLCJwZXJzcGVjdGl2ZVByb3BlcnR5Iiwid2Via2l0UGVyc3BlY3RpdmUiLCJNb3pUcmFuc2Zvcm0iLCJNb3pQZXJzcGVjdGl2ZSIsIndlYmtpdFRyYW5zZm9ybSIsIm1zVHJhbnNmb3JtIiwiY2xvbmUiLCJzd2lwZURpcmVjdGlvbiIsInN0YXJ0WCIsImN1clgiLCJzdGFydFkiLCJjdXJZIiwiYXRhbjIiLCJyb3VuZCIsIlBJIiwic3dpcGVFbmQiLCJzd2lwZUxlbmd0aCIsImVkZ2VIaXQiLCJtaW5Td2lwZSIsImZpbmdlckNvdW50Iiwib3JpZ2luYWxFdmVudCIsInRvdWNoZXMiLCJzd2lwZVN0YXJ0Iiwic3dpcGVNb3ZlIiwiY2xpZW50WCIsImNsaWVudFkiLCJzcXJ0IiwicG93IiwidW5maWx0ZXJTbGlkZXMiLCJzbGlja1VuZmlsdGVyIiwiQXJyYXkiLCJhcHBseSIsInZhbHVlMSIsInZhbHVlMiIsInNsaWRlVG9nZ2xlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBVztBQUN6Qjs7O0FBR0EsTUFBSUMsYUFBYSxHQUFHO0FBQ2hCO0FBQ0FDLElBQUFBLElBQUksRUFBRyxHQUZTO0FBSWhCO0FBQ0FDLElBQUFBLGFBQWEsRUFBRSxJQUxDO0FBTWhCQyxJQUFBQSxhQUFhLEVBQUUsSUFOQztBQU9oQkMsSUFBQUEsV0FBVyxFQUFJLElBUEM7QUFRaEJDLElBQUFBLFlBQVksRUFBSSxJQVJBO0FBU2hCQyxJQUFBQSxVQUFVLEVBQU0sR0FUQTtBQVVoQkMsSUFBQUEsWUFBWSxFQUFJLEdBVkE7QUFXaEJDLElBQUFBLFVBQVUsRUFBTSxHQVhBO0FBYWhCO0FBQ0FDLElBQUFBLGdCQUFnQixFQUFFLEdBZEY7QUFnQmhCO0FBQ0FDLElBQUFBLGtCQUFrQixFQUFFLElBakJKO0FBbUJoQjtBQUNBQyxJQUFBQSxPQUFPLEVBQUVkLENBQUMsQ0FBQ2UsT0FBRixDQUFVQyxNQXBCSDtBQXNCaEJDLElBQUFBLElBQUksRUFBRWpCLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVWtCLElBQVYsQ0FBZSxNQUFmO0FBdEJVLEdBQXBCLENBSnlCLENBNkJ6QjtBQUNBOztBQUNBLE1BQU1DLFdBQVcsR0FBRztBQUNoQkMsSUFBQUEsbUJBQW1CLEVBQUVDLE1BQU0sQ0FBQ0MsVUFBUCx1QkFBaUNuQixhQUFhLENBQUNFLGFBQWQsR0FBOEIsQ0FBL0QsU0FETDtBQUVoQmtCLElBQUFBLG1CQUFtQixFQUFFRixNQUFNLENBQUNDLFVBQVAsdUJBQWlDbkIsYUFBYSxDQUFDRyxhQUFkLEdBQThCLENBQS9ELFNBRkw7QUFHaEJrQixJQUFBQSxpQkFBaUIsRUFBRUgsTUFBTSxDQUFDQyxVQUFQLHVCQUFpQ25CLGFBQWEsQ0FBQ0ksV0FBZCxHQUE0QixDQUE3RCxTQUhIO0FBSWhCa0IsSUFBQUEsa0JBQWtCLEVBQUVKLE1BQU0sQ0FBQ0MsVUFBUCx1QkFBaUNuQixhQUFhLENBQUNLLFlBQWQsR0FBNkIsQ0FBOUQsU0FKSjtBQUtoQmtCLElBQUFBLGdCQUFnQixFQUFFTCxNQUFNLENBQUNDLFVBQVAsdUJBQWlDbkIsYUFBYSxDQUFDTSxVQUFkLEdBQTJCLENBQTVELFNBTEY7QUFNaEJrQixJQUFBQSxzQkFBc0IsRUFBRU4sTUFBTSxDQUFDQyxVQUFQLHVCQUFpQ25CLGFBQWEsQ0FBQ08sWUFBZCxHQUE2QixDQUE5RCxTQU5SO0FBT2hCa0IsSUFBQUEsZ0JBQWdCLEVBQUVQLE1BQU0sQ0FBQ0MsVUFBUCx1QkFBaUNuQixhQUFhLENBQUNRLFVBQWQsR0FBMkIsQ0FBNUQ7QUFQRixHQUFwQjtBQVVBWCxFQUFBQSxDQUFDLENBQUM2QixNQUFGLENBQVMsSUFBVCxFQUFlMUIsYUFBZixFQUE4QmdCLFdBQTlCO0FBS0FuQixFQUFBQSxDQUFDLENBQUNxQixNQUFELENBQUQsQ0FBVVMsSUFBVixDQUFlLFlBQU07QUFDakIsUUFBSTNCLGFBQWEsQ0FBQ1csT0FBbEIsRUFBMkI7QUFDdkJkLE1BQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVStCLFFBQVYsQ0FBbUIsT0FBbkIsRUFBNEJDLFdBQTVCLENBQXdDLFVBQXhDO0FBQ0gsS0FGRCxNQUVPO0FBQ0hoQyxNQUFBQSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVUrQixRQUFWLENBQW1CLFVBQW5CLEVBQStCQyxXQUEvQixDQUEyQyxPQUEzQztBQUNILEtBTGdCLENBT2pCO0FBQ0E7QUFDQTs7QUFDSCxHQVZEO0FBYUE7Ozs7QUFHQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQWVBaEMsRUFBQUEsQ0FBQyxDQUFDaUMsRUFBRixDQUFLSixNQUFMLENBQVk7QUFDUkssSUFBQUEsVUFBVSxFQUFFLG9CQUFTQyxhQUFULEVBQXdCQyxRQUF4QixFQUFrQztBQUMxQyxVQUFJQyxZQUFZLEdBQUksVUFBU0MsRUFBVCxFQUFhO0FBQzdCLFlBQUlDLFVBQVUsR0FBRztBQUNiQyxVQUFBQSxTQUFTLEVBQUUsY0FERTtBQUViQyxVQUFBQSxVQUFVLEVBQUUsZUFGQztBQUdiQyxVQUFBQSxZQUFZLEVBQUUsaUJBSEQ7QUFJYkMsVUFBQUEsZUFBZSxFQUFFO0FBSkosU0FBakI7O0FBT0EsYUFBSyxJQUFJQyxDQUFULElBQWNMLFVBQWQsRUFBMEI7QUFDdEIsY0FBSUQsRUFBRSxDQUFDTyxLQUFILENBQVNELENBQVQsTUFBZ0JFLFNBQXBCLEVBQStCO0FBQzNCLG1CQUFPUCxVQUFVLENBQUNLLENBQUQsQ0FBakI7QUFDSDtBQUNKO0FBQ0osT0Fia0IsQ0FhaEIzQyxRQUFRLENBQUM4QyxhQUFULENBQXVCLEtBQXZCLENBYmdCLENBQW5COztBQWVBLFdBQUtoQixRQUFMLENBQWMsY0FBY0ksYUFBNUIsRUFBMkNhLEdBQTNDLENBQStDWCxZQUEvQyxFQUE2RCxZQUFXO0FBQ3BFckMsUUFBQUEsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRZ0MsV0FBUixDQUFvQixjQUFjRyxhQUFsQztBQUVBLFlBQUksT0FBT0MsUUFBUCxLQUFvQixVQUF4QixFQUFvQ0EsUUFBUTtBQUMvQyxPQUpEO0FBTUEsYUFBTyxJQUFQO0FBQ0g7QUF4Qk8sR0FBWjtBQTBCQTs7Ozs7QUFJQSxNQUFJYSxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFTQyxLQUFULEVBQWdCO0FBQy9CLFFBQUlDLElBQUksR0FBRyxJQUFYOztBQUVBQSxJQUFBQSxJQUFJLENBQUNDLElBQUwsR0FBWSxVQUFTQyxTQUFULEVBQW9CO0FBQzVCQSxNQUFBQSxTQUFTLENBQUNDLElBQVYsQ0FBZSxZQUFXO0FBQ3RCLFlBQUl0RCxDQUFDLENBQUMsSUFBRCxDQUFELENBQVF1RCxRQUFSLENBQWlCLDJCQUFqQixDQUFKLEVBQW1EO0FBQy9DO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsY0FBSUMsWUFBWSxHQUFHeEQsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFReUQsSUFBUixDQUFhLFFBQWIsQ0FBbkI7QUFDQSxjQUFJQyx1QkFBSjs7QUFFQSxjQUFJRixZQUFKLEVBQWtCO0FBQ2RFLFlBQUFBLHVCQUF1QixHQUFHLENBQTFCLENBRGMsQ0FDZTtBQUNoQyxXQUZELE1BRU87QUFDSEEsWUFBQUEsdUJBQXVCLEdBQUdDLFFBQTFCLENBREcsQ0FDaUM7QUFDdkM7O0FBRUQzRCxVQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVE0RCxPQUFSLENBQWdCO0FBQ1pGLFlBQUFBLHVCQUF1QixFQUFFQSx1QkFEYjtBQUVaRyxZQUFBQSxZQUFZLEVBQUUsSUFGRjtBQUdaQyxZQUFBQSxnQkFBZ0IsRUFBRTtBQUhOLFdBQWhCO0FBTUE5RCxVQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVErRCxFQUFSLENBQVcsUUFBWCxFQUFxQixVQUFTQyxDQUFULEVBQVk7QUFDN0I7QUFDQWhFLFlBQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUWlFLElBQVIsMEJBQThCakUsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRa0UsT0FBUixDQUFnQkMsS0FBOUMsVUFBeURDLEtBQXpEO0FBQ0gsV0FIRDtBQUlIO0FBQ0osT0F4QkQ7QUEwQkgsS0EzQkQ7O0FBNkJBakIsSUFBQUEsSUFBSSxDQUFDa0IsTUFBTCxHQUFjLFVBQVNDLFdBQVQsRUFBc0I7QUFDaENBLE1BQUFBLFdBQVcsQ0FBQ1YsT0FBWixDQUFvQixTQUFwQjtBQUNBVCxNQUFBQSxJQUFJLENBQUNDLElBQUwsQ0FBVWtCLFdBQVY7QUFDSCxLQUhEOztBQUtBbkIsSUFBQUEsSUFBSSxDQUFDQyxJQUFMLENBQVVGLEtBQVY7QUFDSCxHQXRDRDtBQXdDQTs7Ozs7O0FBSUFsRCxFQUFBQSxDQUFDLENBQUNpQyxFQUFGLENBQUtzQyxlQUFMLEdBQXVCLFlBQVc7QUFFOUIsU0FBS2pCLElBQUwsQ0FBVSxVQUFTa0IsQ0FBVCxFQUFZQyxJQUFaLEVBQWtCO0FBRXhCLFVBQU12QixLQUFLLEdBQUdsRCxDQUFDLENBQUN5RSxJQUFELENBQWYsQ0FGd0IsQ0FJeEI7O0FBQ0EsVUFBSSxPQUFPdkIsS0FBSyxDQUFDaEMsSUFBTixDQUFXLG1CQUFYLENBQVAsS0FBMkMsV0FBL0MsRUFBNEQ7QUFDeEQ7QUFDSCxPQVB1QixDQVN4Qjs7O0FBQ0EsVUFBSXdELFVBQVUsR0FBRyxRQUFqQjtBQUNBLFVBQUlDLFNBQVMsR0FBRyxFQUFoQjs7QUFFQSxVQUFJLE9BQU96QixLQUFLLENBQUNoQyxJQUFOLENBQVcsT0FBWCxDQUFQLEtBQStCLFdBQW5DLEVBQWdEO0FBQzVDd0QsUUFBQUEsVUFBVSxHQUFHeEIsS0FBSyxDQUFDaEMsSUFBTixDQUFXLE9BQVgsQ0FBYjtBQUNIOztBQUVELFVBQUksQ0FBQyxDQUFDZ0MsS0FBSyxDQUFDaEMsSUFBTixDQUFXLE9BQVgsQ0FBTixFQUEyQjtBQUN2QnlELFFBQUFBLFNBQVMsR0FBRyxNQUFNekIsS0FBSyxDQUFDaEMsSUFBTixDQUFXLE9BQVgsQ0FBbEI7QUFDSCxPQW5CdUIsQ0FxQnhCO0FBQ0E7OztBQUNBZ0MsTUFBQUEsS0FBSyxDQUFDMEIsSUFBTixxREFBcURELFNBQXJELG9CQUE4RUUsTUFBOUUsR0FBdUZDLE9BQXZGLENBQStGOUUsQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQitFLElBQW5CLENBQXdCTCxVQUF4QixDQUEvRjtBQUNILEtBeEJELEVBMEJBO0FBQ0E7QUEzQkEsS0E0QkNNLE9BNUJELEdBNEJXQyxJQTVCWCxDQTRCZ0IsWUFBVztBQUV2QjtBQUNBO0FBQ0FqRixNQUFBQSxDQUFDLENBQUMsY0FBRCxDQUFELENBQWtCa0YsU0FBbEIsQ0FBNEIsVUFBU0MsTUFBVCxFQUFpQjtBQUV6QyxZQUFJQyxLQUFKLEVBQVdDLE9BQVgsRUFDSUMsUUFESixFQUNjQyxRQURkLEVBRUlDLFVBRkosRUFFZ0JDLFdBRmhCLEVBR0lDLE9BSEosRUFHYUMsT0FIYixDQUZ5QyxDQU96Qzs7QUFDQU4sUUFBQUEsT0FBTyxHQUFHckYsQ0FBQyxDQUFDLElBQUQsQ0FBWCxDQVJ5QyxDQVN6Qzs7QUFDQW9GLFFBQUFBLEtBQUssR0FBR0MsT0FBTyxDQUFDcEIsSUFBUixDQUFhLE9BQWIsQ0FBUixDQVZ5QyxDQVd6Qzs7QUFDQXFCLFFBQUFBLFFBQVEsR0FBR0QsT0FBTyxDQUFDTyxNQUFSLEdBQWlCQyxJQUE1QixDQVp5QyxDQWF6Qzs7QUFDQU4sUUFBQUEsUUFBUSxHQUFHRixPQUFPLENBQUNPLE1BQVIsR0FBaUJFLEdBQTVCLENBZHlDLENBZXpDOztBQUNBTixRQUFBQSxVQUFVLEdBQUdKLEtBQUssQ0FBQ1csS0FBTixFQUFiLENBaEJ5QyxDQWlCekM7O0FBQ0FOLFFBQUFBLFdBQVcsR0FBR0wsS0FBSyxDQUFDWSxNQUFOLEVBQWQsQ0FsQnlDLENBbUJ6Qzs7QUFDQU4sUUFBQUEsT0FBTyxHQUFHUCxNQUFNLENBQUNjLEtBQWpCO0FBQ0FOLFFBQUFBLE9BQU8sR0FBR1IsTUFBTSxDQUFDZSxLQUFqQixDQXJCeUMsQ0F1QnpDO0FBQ0E7O0FBQ0FDLFFBQUFBLFVBQVUsR0FBR1QsT0FBTyxHQUFHSixRQUFWLEdBQXFCRSxVQUFyQixHQUFrQyxFQUEvQyxDQXpCeUMsQ0EwQnpDOztBQUNBWSxRQUFBQSxVQUFVLEdBQUdULE9BQU8sR0FBR0osUUFBVixHQUFzQkUsV0FBVyxHQUFHLENBQWpELENBM0J5QyxDQTZCekM7O0FBQ0FMLFFBQUFBLEtBQUssQ0FBQ2lCLEdBQU4sQ0FBVTtBQUNOUixVQUFBQSxJQUFJLEVBQUVNLFVBREE7QUFFTkwsVUFBQUEsR0FBRyxFQUFFTTtBQUZDLFNBQVY7QUFJSCxPQWxDRDtBQW9DQXBHLE1BQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVStELEVBQVYsQ0FBYSxRQUFiLEVBQXVCLCtCQUF2QixFQUF3RCxZQUFXO0FBRS9ELFlBQUl1QyxRQUFKO0FBQ0FBLFFBQUFBLFFBQVEsR0FBR3RHLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXVHLEdBQVIsRUFBWCxDQUgrRCxDQUsvRDs7QUFDQXZHLFFBQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUTZFLE1BQVIsR0FBaUIyQixJQUFqQixDQUFzQixvQkFBdEIsRUFBNENDLE1BQTVDOztBQUNBLFlBQUksQ0FBQyxDQUFDekcsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRMEcsSUFBUixDQUFhLE9BQWIsQ0FBRixJQUEyQjFHLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUTBHLElBQVIsQ0FBYSxPQUFiLEVBQXNCQyxNQUF0QixHQUErQixDQUE5RCxFQUFpRTtBQUM3REwsVUFBQUEsUUFBUSxHQUFHdEcsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRLENBQVIsRUFBVzRHLEtBQVgsQ0FBaUJELE1BQWpCLEdBQTBCLFFBQXJDO0FBQ0gsU0FGRCxNQUVPO0FBQ0hMLFVBQUFBLFFBQVEsR0FBR0EsUUFBUSxDQUFDTyxTQUFULENBQW1CUCxRQUFRLENBQUNRLFdBQVQsQ0FBcUIsSUFBckIsSUFBNkIsQ0FBaEQsRUFBbURSLFFBQVEsQ0FBQ0ssTUFBNUQsQ0FBWDtBQUNILFNBWDhELENBYS9EOzs7QUFDQSxZQUFJLENBQUNMLFFBQUwsRUFBZTtBQUNYO0FBQ0g7O0FBRUQsWUFBSVMseUJBQXlCLEdBQUcvRyxDQUFDLENBQUMsSUFBRCxDQUFELENBQVF5RCxJQUFSLENBQWEsb0JBQWIsQ0FBaEM7O0FBQ0EsWUFBSXNELHlCQUF5QixLQUFLLFFBQWxDLEVBQTRDO0FBQ3hDO0FBQ0EvRyxVQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVFnSCxRQUFSLENBQWlCLE1BQWpCLEVBQXlCakMsSUFBekIsQ0FBOEJ1QixRQUE5QjtBQUNBdEcsVUFBQUEsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRa0IsSUFBUixDQUFhLE9BQWIsRUFBc0JvRixRQUF0QjtBQUNILFNBSkQsTUFJTztBQUNIO0FBQ0F0RyxVQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVE2RSxNQUFSLEdBQWlCb0MsS0FBakIsNkNBQTBEWCxRQUExRDtBQUNIO0FBQ0osT0EzQkQ7QUE2QkgsS0FqR0Q7QUFtR0gsR0FyR0Q7O0FBdUdBdEcsRUFBQUEsQ0FBQyxDQUFDLG9CQUFELENBQUQsQ0FBd0J1RSxlQUF4QixHQS9QeUIsQ0FnUXpCOztBQUNBLE1BQUkyQyxZQUFZLEdBQUcsSUFBSWpFLFlBQUosQ0FBaUJqRCxDQUFDLENBQUMsUUFBRCxDQUFsQixDQUFuQjs7QUFFQSxNQUFJQSxDQUFDLENBQUMscUJBQUQsQ0FBRCxDQUF5QjJHLE1BQXpCLEdBQWtDLENBQXRDLEVBQXlDO0FBQ3JDOzs7QUFHQTNHLElBQUFBLENBQUMsQ0FBQyxxQkFBRCxDQUFELENBQXlCc0QsSUFBekIsQ0FBOEIsVUFBUzZELEtBQVQsRUFBZ0I3RSxFQUFoQixFQUFvQjtBQUM5QyxVQUFNOEUsS0FBSyxHQUFHcEgsQ0FBQyxDQUFDc0MsRUFBRCxDQUFELENBQU0yQixJQUFOLENBQVcsaUJBQVgsQ0FBZDs7QUFFQSxVQUFJakUsQ0FBQyxDQUFDb0gsS0FBRCxDQUFELENBQVNiLEdBQVQsR0FBZWMsSUFBZixNQUF5QixFQUE3QixFQUFpQztBQUM3QnJILFFBQUFBLENBQUMsQ0FBQ3NDLEVBQUQsQ0FBRCxDQUFNUCxRQUFOLENBQWUsV0FBZjtBQUNIOztBQUVEL0IsTUFBQUEsQ0FBQyxDQUFDb0gsS0FBRCxDQUFELENBQVNyRCxFQUFULENBQVksT0FBWixFQUFxQixVQUFTdUQsS0FBVCxFQUFnQjtBQUNqQ3RILFFBQUFBLENBQUMsQ0FBQ3NDLEVBQUQsQ0FBRCxDQUFNUCxRQUFOLENBQWUsV0FBZjtBQUNILE9BRkQsRUFFR2dDLEVBRkgsQ0FFTSxNQUZOLEVBRWMsVUFBU3VELEtBQVQsRUFBZ0I7QUFDMUIsWUFBSXRILENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXVHLEdBQVIsR0FBY2MsSUFBZCxPQUF5QixFQUE3QixFQUFpQztBQUM3QnJILFVBQUFBLENBQUMsQ0FBQ3NDLEVBQUQsQ0FBRCxDQUFNTixXQUFOLENBQWtCLFdBQWxCO0FBQ0g7QUFDSixPQU5EO0FBT0gsS0FkRDtBQWVIOztBQUVELE1BQUl1RixNQUFNLEdBQUdwSCxhQUFhLENBQUNjLElBQWQsSUFBc0IsT0FBdEIsR0FBZ0MsSUFBaEMsR0FBdUMsSUFBcEQ7QUFFQXVHLEVBQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkYsTUFBbEI7QUFFQTs7QUFDQXZILEVBQUFBLENBQUMsQ0FBQzZCLE1BQUYsQ0FBUzJGLE9BQU8sQ0FBQ0UsT0FBakIsRUFBMEI7QUFDdEJDLElBQUFBLE9BQU8sRUFBRSxhQURhO0FBQ0U7QUFDeEJDLElBQUFBLG1CQUFtQixFQUFFLEdBRkM7QUFHdEJDLElBQUFBLGFBQWEsRUFBRSxhQUhPO0FBSXRCQyxJQUFBQSxhQUFhLEVBQUUsdUNBSk87QUFLdEJDLElBQUFBLFlBQVksRUFBRSxzQkFBU0MsUUFBVCxFQUFtQjtBQUM3QixVQUFNQyxRQUFRLEdBQUdELFFBQVEsQ0FBQ0MsUUFBMUI7QUFDQSxVQUFJQyxJQUFJLEdBQUdELFFBQVEsQ0FBQy9HLElBQVQsQ0FBYyxNQUFkLENBQVg7QUFBQSxVQUNJaUgsUUFESjs7QUFFQSxVQUFJRCxJQUFJLElBQUksVUFBUixJQUFzQkEsSUFBSSxJQUFJLE9BQWxDLEVBQTJDO0FBQ3ZDQyxRQUFBQSxRQUFRLEdBQUdGLFFBQVgsQ0FEdUMsQ0FDbEI7QUFDeEIsT0FGRCxNQUdLLElBQUlBLFFBQVEsQ0FBQzFFLFFBQVQsQ0FBa0IsMkJBQWxCLENBQUosRUFBb0Q7QUFDckQ0RSxRQUFBQSxRQUFRLEdBQUduSSxDQUFDLENBQUMsNEJBQUQsRUFBK0JpSSxRQUFRLENBQUN6QixJQUFULENBQWMsVUFBZCxDQUEvQixDQUFaO0FBQ0g7O0FBRUQsYUFBTzJCLFFBQVA7QUFDSCxLQWpCcUI7QUFrQnRCQyxJQUFBQSxlQUFlLEVBQUUseUJBQVNKLFFBQVQsRUFBbUI7QUFDaEMsVUFBTUMsUUFBUSxHQUFHRCxRQUFRLENBQUNDLFFBQTFCO0FBQ0EsVUFBSUMsSUFBSSxHQUFHRCxRQUFRLENBQUMvRyxJQUFULENBQWMsTUFBZCxDQUFYO0FBQUEsVUFDSW1ILFVBREo7O0FBR0EsVUFBSUgsSUFBSSxJQUFJLFVBQVIsSUFBc0JBLElBQUksSUFBSSxPQUFsQyxFQUEyQztBQUN2Q0csUUFBQUEsVUFBVSxHQUFHckksQ0FBQyxtQkFBV2lJLFFBQVEsQ0FBQy9HLElBQVQsQ0FBYyxNQUFkLENBQVgsc0JBQUQsQ0FBb0RzRixJQUFwRCxDQUF5RCxtQkFBekQsQ0FBYjtBQUNILE9BRkQsTUFHSyxJQUFJeUIsUUFBUSxDQUFDMUUsUUFBVCxDQUFrQiwyQkFBbEIsQ0FBSixFQUFvRDtBQUNyRDhFLFFBQUFBLFVBQVUsR0FBR0osUUFBUSxDQUFDekIsSUFBVCxDQUFjLFVBQWQsRUFBMEJBLElBQTFCLENBQStCLG1CQUEvQixDQUFiO0FBQ0gsT0FGSSxNQUdBLElBQUkwQixJQUFJLElBQUksTUFBWixFQUFvQjtBQUNyQkcsUUFBQUEsVUFBVSxHQUFHSixRQUFRLENBQUNLLE9BQVQsQ0FBaUIsY0FBakIsRUFBaUM5QixJQUFqQyxDQUFzQyxtQkFBdEMsQ0FBYjtBQUNILE9BRkksTUFHQSxJQUFJeUIsUUFBUSxDQUFDSyxPQUFULENBQWlCLHNCQUFqQixFQUF5QzNCLE1BQTdDLEVBQXFEO0FBQ3REMEIsUUFBQUEsVUFBVSxHQUFHSixRQUFRLENBQUNLLE9BQVQsQ0FBaUIsc0JBQWpCLEVBQXlDOUIsSUFBekMsQ0FBOEMsbUJBQTlDLENBQWI7QUFDSCxPQUZJLE1BR0EsSUFBSXlCLFFBQVEsQ0FBQy9HLElBQVQsQ0FBYyxNQUFkLEtBQXlCLHNCQUE3QixFQUFxRDtBQUN0RG1ILFFBQUFBLFVBQVUsR0FBR0osUUFBUSxDQUFDcEQsTUFBVCxHQUFrQjJCLElBQWxCLENBQXVCLGNBQXZCLEVBQXVDQSxJQUF2QyxDQUE0QyxtQkFBNUMsQ0FBYjtBQUNIOztBQUVELGFBQU82QixVQUFQO0FBQ0g7QUF4Q3FCLEdBQTFCLEVBN1J5QixDQXdVekI7QUFFQTs7QUFDQWIsRUFBQUEsT0FBTyxDQUFDZSxZQUFSLENBQXFCLFFBQXJCLEVBQStCO0FBQzNCQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNyRSxLQUFULEVBQWdCO0FBQzVCLGFBQU8sZ0JBQWdCc0UsSUFBaEIsQ0FBcUJ0RSxLQUFyQixDQUFQO0FBQ0gsS0FIMEI7QUFJM0J1RSxJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLDRCQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBSmlCLEdBQS9CLEVBM1V5QixDQXFWekI7O0FBQ0FwQixFQUFBQSxPQUFPLENBQUNlLFlBQVIsQ0FBcUIsUUFBckIsRUFBK0I7QUFDM0JDLElBQUFBLGNBQWMsRUFBRSx3QkFBU3JFLEtBQVQsRUFBZ0I7QUFDNUIsYUFBTyxlQUFlc0UsSUFBZixDQUFvQnRFLEtBQXBCLENBQVA7QUFDSCxLQUgwQjtBQUkzQnVFLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsNEJBREU7QUFFTkMsTUFBQUEsRUFBRSxFQUFFO0FBRkU7QUFKaUIsR0FBL0IsRUF0VnlCLENBZ1d6Qjs7QUFDQXBCLEVBQUFBLE9BQU8sQ0FBQ2UsWUFBUixDQUFxQixNQUFyQixFQUE2QjtBQUN6QkMsSUFBQUEsY0FBYyxFQUFFLHdCQUFTckUsS0FBVCxFQUFnQjtBQUM1QixhQUFPLG1CQUFtQnNFLElBQW5CLENBQXdCdEUsS0FBeEIsQ0FBUDtBQUNILEtBSHdCO0FBSXpCdUUsSUFBQUEsUUFBUSxFQUFFO0FBQ05DLE1BQUFBLEVBQUUsRUFBRSxzQ0FERTtBQUVOQyxNQUFBQSxFQUFFLEVBQUU7QUFGRTtBQUplLEdBQTdCLEVBald5QixDQTJXekI7O0FBQ0FwQixFQUFBQSxPQUFPLENBQUNlLFlBQVIsQ0FBcUIsYUFBckIsRUFBb0M7QUFDaENDLElBQUFBLGNBQWMsRUFBRSx3QkFBU3JFLEtBQVQsRUFBZ0I7QUFDNUIsYUFBTyxnQkFBZ0JzRSxJQUFoQixDQUFxQnRFLEtBQXJCLENBQVA7QUFDSCxLQUgrQjtBQUloQ3VFLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsdUJBREU7QUFFTkMsTUFBQUEsRUFBRSxFQUFFO0FBRkU7QUFKc0IsR0FBcEMsRUE1V3lCLENBc1h6Qjs7QUFDQXBCLEVBQUFBLE9BQU8sQ0FBQ2UsWUFBUixDQUFxQixXQUFyQixFQUFrQztBQUM5QkMsSUFBQUEsY0FBYyxFQUFFLHdCQUFTckUsS0FBVCxFQUFnQjtBQUM1QixhQUFPLG1CQUFtQnNFLElBQW5CLENBQXdCdEUsS0FBeEIsQ0FBUDtBQUNILEtBSDZCO0FBSTlCdUUsSUFBQUEsUUFBUSxFQUFFO0FBQ05DLE1BQUFBLEVBQUUsRUFBRSxpQ0FERTtBQUVOQyxNQUFBQSxFQUFFLEVBQUU7QUFGRTtBQUpvQixHQUFsQyxFQXZYeUIsQ0FpWXpCOztBQUNBcEIsRUFBQUEsT0FBTyxDQUFDZSxZQUFSLENBQXFCLE9BQXJCLEVBQThCO0FBQzFCQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNyRSxLQUFULEVBQWdCO0FBQzVCLGFBQU8saUJBQWlCc0UsSUFBakIsQ0FBc0J0RSxLQUF0QixDQUFQO0FBQ0gsS0FIeUI7QUFJMUJ1RSxJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLCtCQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBSmdCLEdBQTlCLEVBbFl5QixDQTRZekI7O0FBQ0FwQixFQUFBQSxPQUFPLENBQUNlLFlBQVIsQ0FBcUIsUUFBckIsRUFBK0I7QUFDM0JDLElBQUFBLGNBQWMsRUFBRSx3QkFBU3JFLEtBQVQsRUFBZ0I7QUFDNUIsYUFBTyxZQUFZc0UsSUFBWixDQUFpQnRFLEtBQWpCLENBQVA7QUFDSCxLQUgwQjtBQUkzQnVFLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsYUFERTtBQUVOQyxNQUFBQSxFQUFFLEVBQUU7QUFGRTtBQUppQixHQUEvQixFQTdZeUIsQ0F1WnpCOztBQUNBcEIsRUFBQUEsT0FBTyxDQUFDZSxZQUFSLENBQXFCLE9BQXJCLEVBQThCO0FBQzFCQyxJQUFBQSxjQUFjLEVBQUUsd0JBQVNyRSxLQUFULEVBQWdCO0FBQzVCLGFBQU8sd0lBQXdJc0UsSUFBeEksQ0FBNkl0RSxLQUE3SSxDQUFQO0FBQ0gsS0FIeUI7QUFJMUJ1RSxJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLDZCQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBSmdCLEdBQTlCLEVBeFp5QixDQWthekI7O0FBQ0FwQixFQUFBQSxPQUFPLENBQUNlLFlBQVIsQ0FBcUIsTUFBckIsRUFBNkI7QUFDekJDLElBQUFBLGNBQWMsRUFBRSx3QkFBU3JFLEtBQVQsRUFBZ0I7QUFDNUIsVUFBSTBFLE9BQU8sR0FBRyxrVEFBZDtBQUFBLFVBQ0lDLFFBQVEsR0FBRywrQkFEZjtBQUFBLFVBRUlDLEdBQUcsR0FBR0MsU0FBUyxDQUFDLENBQUQsQ0FBVCxDQUFhZixRQUFiLENBQXNCeEUsSUFBdEIsQ0FBMkIsU0FBM0IsQ0FGVjtBQUFBLFVBR0l3RixHQUFHLEdBQUdELFNBQVMsQ0FBQyxDQUFELENBQVQsQ0FBYWYsUUFBYixDQUFzQnhFLElBQXRCLENBQTJCLFNBQTNCLENBSFY7QUFBQSxVQUlJeUYsT0FKSjtBQUFBLFVBSWFDLE9BSmI7QUFBQSxVQUlzQkMsU0FKdEI7QUFBQSxVQUlpQ0MsTUFKakM7O0FBTUEsVUFBSU4sR0FBRyxLQUFLTSxNQUFNLEdBQUdOLEdBQUcsQ0FBQ08sS0FBSixDQUFVUixRQUFWLENBQWQsQ0FBUCxFQUEyQztBQUN2Q0ksUUFBQUEsT0FBTyxHQUFHLElBQUlLLElBQUosQ0FBUyxDQUFDRixNQUFNLENBQUMsQ0FBRCxDQUFoQixFQUFxQkEsTUFBTSxDQUFDLENBQUQsQ0FBTixHQUFZLENBQWpDLEVBQW9DLENBQUNBLE1BQU0sQ0FBQyxDQUFELENBQTNDLENBQVY7QUFDSDs7QUFDRCxVQUFJSixHQUFHLEtBQUtJLE1BQU0sR0FBR0osR0FBRyxDQUFDSyxLQUFKLENBQVVSLFFBQVYsQ0FBZCxDQUFQLEVBQTJDO0FBQ3ZDSyxRQUFBQSxPQUFPLEdBQUcsSUFBSUksSUFBSixDQUFTLENBQUNGLE1BQU0sQ0FBQyxDQUFELENBQWhCLEVBQXFCQSxNQUFNLENBQUMsQ0FBRCxDQUFOLEdBQVksQ0FBakMsRUFBb0MsQ0FBQ0EsTUFBTSxDQUFDLENBQUQsQ0FBM0MsQ0FBVjtBQUNIOztBQUNELFVBQUlBLE1BQU0sR0FBR2xGLEtBQUssQ0FBQ21GLEtBQU4sQ0FBWVIsUUFBWixDQUFiLEVBQW9DO0FBQ2hDTSxRQUFBQSxTQUFTLEdBQUcsSUFBSUcsSUFBSixDQUFTLENBQUNGLE1BQU0sQ0FBQyxDQUFELENBQWhCLEVBQXFCQSxNQUFNLENBQUMsQ0FBRCxDQUFOLEdBQVksQ0FBakMsRUFBb0MsQ0FBQ0EsTUFBTSxDQUFDLENBQUQsQ0FBM0MsQ0FBWjtBQUNIOztBQUVELGFBQU9SLE9BQU8sQ0FBQ0osSUFBUixDQUFhdEUsS0FBYixNQUF3QitFLE9BQU8sR0FBR0UsU0FBUyxJQUFJRixPQUFoQixHQUEwQixJQUF6RCxNQUFtRUMsT0FBTyxHQUFHQyxTQUFTLElBQUlELE9BQWhCLEdBQTBCLElBQXBHLENBQVA7QUFDSCxLQW5Cd0I7QUFvQnpCVCxJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsRUFBRSxFQUFFLG1CQURFO0FBRU5DLE1BQUFBLEVBQUUsRUFBRTtBQUZFO0FBcEJlLEdBQTdCLEVBbmF5QixDQThiekI7O0FBQ0FwQixFQUFBQSxPQUFPLENBQUNlLFlBQVIsQ0FBcUIsYUFBckIsRUFBb0M7QUFDaENDLElBQUFBLGNBQWMsRUFBRSx3QkFBU3JFLEtBQVQsRUFBZ0JxRixPQUFoQixFQUF5QkMsZUFBekIsRUFBMEM7QUFDdEQsVUFBSTdDLEtBQUssR0FBRzZDLGVBQWUsQ0FBQ3hCLFFBQWhCLENBQXlCLENBQXpCLEVBQTRCckIsS0FBeEM7QUFDQSxhQUFPQSxLQUFLLENBQUNELE1BQU4sSUFBZ0IsQ0FBaEIsSUFBc0JDLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBUzhDLElBQVQsSUFBaUJGLE9BQU8sR0FBRyxJQUF4RDtBQUNILEtBSitCO0FBS2hDRyxJQUFBQSxlQUFlLEVBQUUsU0FMZTtBQU1oQ2pCLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsd0NBREU7QUFFTkMsTUFBQUEsRUFBRSxFQUFFO0FBRkU7QUFOc0IsR0FBcEMsRUEvYnlCLENBMmN6Qjs7QUFDQXBCLEVBQUFBLE9BQU8sQ0FBQ2UsWUFBUixDQUFxQixlQUFyQixFQUFzQztBQUNsQ0MsSUFBQUEsY0FBYyxFQUFFLHdCQUFTckUsS0FBVCxFQUFnQnlGLE9BQWhCLEVBQXlCO0FBQ3JDLFVBQUlDLGFBQWEsR0FBRzFGLEtBQUssQ0FBQzJGLEtBQU4sQ0FBWSxHQUFaLEVBQWlCQyxHQUFqQixFQUFwQjtBQUNBLFVBQUlDLFVBQVUsR0FBR0osT0FBTyxDQUFDRSxLQUFSLENBQWMsSUFBZCxDQUFqQjtBQUNBLFVBQUlHLEtBQUssR0FBRyxLQUFaOztBQUVBLFdBQUssSUFBSXpGLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd3RixVQUFVLENBQUNyRCxNQUEvQixFQUF1Q25DLENBQUMsRUFBeEMsRUFBNEM7QUFDeEMsWUFBSXFGLGFBQWEsS0FBS0csVUFBVSxDQUFDeEYsQ0FBRCxDQUFoQyxFQUFxQztBQUNqQ3lGLFVBQUFBLEtBQUssR0FBRyxJQUFSO0FBQ0E7QUFDSDtBQUNKOztBQUVELGFBQU9BLEtBQVA7QUFDSCxLQWRpQztBQWVsQ3ZCLElBQUFBLFFBQVEsRUFBRTtBQUNOQyxNQUFBQSxFQUFFLEVBQUUsbUNBREU7QUFFTkMsTUFBQUEsRUFBRSxFQUFFO0FBRkU7QUFmd0IsR0FBdEMsRUE1Y3lCLENBaWV6Qjs7QUFDQXBCLEVBQUFBLE9BQU8sQ0FBQ3pELEVBQVIsQ0FBVyxZQUFYLEVBQXlCLFlBQVc7QUFDaEMsUUFBSWtFLFFBQVEsR0FBRyxLQUFLQSxRQUFwQjtBQUFBLFFBQ0lDLElBQUksR0FBR0QsUUFBUSxDQUFDL0csSUFBVCxDQUFjLE1BQWQsQ0FEWDtBQUFBLFFBRUlnSixNQUFNLEdBQUdsSyxDQUFDLENBQUMsUUFBRCxDQUFELENBQVkrQixRQUFaLENBQXFCLGtCQUFyQixDQUZiO0FBQUEsUUFHSW9JLEtBSEo7O0FBS0EsUUFBSWpDLElBQUksSUFBSSxVQUFSLElBQXNCQSxJQUFJLElBQUksT0FBbEMsRUFBMkM7QUFDdkNpQyxNQUFBQSxLQUFLLEdBQUduSyxDQUFDLG1CQUFXaUksUUFBUSxDQUFDL0csSUFBVCxDQUFjLE1BQWQsQ0FBWCxzQkFBVDs7QUFDQSxVQUFJLENBQUNpSixLQUFLLENBQUMzRCxJQUFOLENBQVcsbUJBQVgsRUFBZ0NHLE1BQXJDLEVBQTZDO0FBQ3pDd0QsUUFBQUEsS0FBSyxDQUFDbEQsS0FBTixDQUFZaUQsTUFBWjtBQUNIO0FBQ0osS0FMRCxNQUtPLElBQUlqQyxRQUFRLENBQUMxRSxRQUFULENBQWtCLDJCQUFsQixDQUFKLEVBQW9EO0FBQ3ZENEcsTUFBQUEsS0FBSyxHQUFHbEMsUUFBUSxDQUFDekIsSUFBVCxDQUFjLFVBQWQsQ0FBUjs7QUFDQSxVQUFJLENBQUMyRCxLQUFLLENBQUMzRCxJQUFOLENBQVcsbUJBQVgsRUFBZ0NHLE1BQXJDLEVBQTZDO0FBQ3pDd0QsUUFBQUEsS0FBSyxDQUFDbEQsS0FBTixDQUFZaUQsTUFBWjtBQUNIO0FBQ0osS0FMTSxNQUtBLElBQUloQyxJQUFJLElBQUksTUFBWixFQUFvQjtBQUN2QmlDLE1BQUFBLEtBQUssR0FBR2xDLFFBQVEsQ0FBQ0ssT0FBVCxDQUFpQixjQUFqQixDQUFSOztBQUNBLFVBQUksQ0FBQzZCLEtBQUssQ0FBQzNELElBQU4sQ0FBVyxtQkFBWCxFQUFnQ0csTUFBckMsRUFBNkM7QUFDekN3RCxRQUFBQSxLQUFLLENBQUNsRCxLQUFOLENBQVlpRCxNQUFaO0FBQ0g7QUFDSixLQUxNLE1BS0EsSUFBSWpDLFFBQVEsQ0FBQ0ssT0FBVCxDQUFpQixzQkFBakIsRUFBeUMzQixNQUE3QyxFQUFxRDtBQUN4RHdELE1BQUFBLEtBQUssR0FBR2xDLFFBQVEsQ0FBQ0ssT0FBVCxDQUFpQixzQkFBakIsQ0FBUjs7QUFDQSxVQUFJLENBQUM2QixLQUFLLENBQUMzRCxJQUFOLENBQVcsbUJBQVgsRUFBZ0NHLE1BQXJDLEVBQTZDO0FBQ3pDd0QsUUFBQUEsS0FBSyxDQUFDbEQsS0FBTixDQUFZaUQsTUFBWjtBQUNIO0FBQ0osS0FMTSxNQUtBLElBQUlqQyxRQUFRLENBQUMvRyxJQUFULENBQWMsTUFBZCxLQUF5QixzQkFBN0IsRUFBcUQ7QUFDeERpSixNQUFBQSxLQUFLLEdBQUdsQyxRQUFRLENBQUNwRCxNQUFULEdBQWtCMkIsSUFBbEIsQ0FBdUIsY0FBdkIsQ0FBUjs7QUFDQSxVQUFJLENBQUMyRCxLQUFLLENBQUMzRCxJQUFOLENBQVcsbUJBQVgsRUFBZ0NHLE1BQXJDLEVBQTZDO0FBQ3pDd0QsUUFBQUEsS0FBSyxDQUFDbEQsS0FBTixDQUFZaUQsTUFBWjtBQUNIO0FBQ0o7QUFDSixHQWhDRCxFQWxleUIsQ0FvZ0J6Qjs7QUFDQTFDLEVBQUFBLE9BQU8sQ0FBQ3pELEVBQVIsQ0FBVyxpQkFBWCxFQUE4QixZQUFXO0FBQ3JDLFFBQUlrRSxRQUFRLEdBQUdqSSxDQUFDLENBQUMsS0FBS29LLE9BQU4sQ0FBaEI7QUFDSCxHQUZEO0FBSUFwSyxFQUFBQSxDQUFDLENBQUMsNEJBQUQsQ0FBRCxDQUFnQ3FLLE9BQWhDO0FBQ0E7Ozs7Ozs7O0FBT0FySyxFQUFBQSxDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUFvQnNLLFNBQXBCLENBQThCLG1CQUE5QixFQUFtRDtBQUMvQ0MsSUFBQUEsb0JBQW9CLEVBQUUsSUFEeUI7QUFFL0NDLElBQUFBLGVBQWUsRUFBRTtBQUY4QixHQUFuRDtBQUtBeEssRUFBQUEsQ0FBQyxDQUFFLHdCQUFGLENBQUQsQ0FBOEJ5SyxVQUE5QjtBQUdBOzs7Ozs7OztBQU9BLFdBQVNDLFNBQVQsQ0FBbUJOLE9BQW5CLEVBQTRCO0FBQ3hCLFFBQUlPLFdBQVcsR0FBR1AsT0FBTyxDQUFDbkcsSUFBUixDQUFhLEtBQWIsQ0FBbEI7QUFFQTBHLElBQUFBLFdBQVcsQ0FBQ3JILElBQVosQ0FBaUIsVUFBVTZELEtBQVYsRUFBa0I7QUFDL0IsVUFBSXdELFdBQVcsQ0FBQ3hELEtBQUQsQ0FBWCxDQUFtQnlELElBQW5CLElBQTJCRCxXQUFXLENBQUN4RCxLQUFELENBQVgsQ0FBbUJ5RCxJQUFuQixDQUF3QkMsT0FBdkQsRUFBZ0U7QUFDNURGLFFBQUFBLFdBQVcsQ0FBQ3hELEtBQUQsQ0FBWCxDQUFtQnlELElBQW5CLENBQXdCQyxPQUF4QixHQUFrQ0YsV0FBVyxDQUFDeEQsS0FBRCxDQUFYLENBQW1CeUQsSUFBbkIsQ0FBd0JDLE9BQTFELENBRDRELENBQ087QUFDdEU7QUFDSixLQUpEO0FBS0g7O0FBQ0QsTUFBTUMsd0JBQXdCLEdBQUc7QUFDN0JDLElBQUFBLFVBQVUsRUFBRSxVQURpQjtBQUU3QkMsSUFBQUEsZUFBZSxFQUFFO0FBRlksR0FBakM7QUFLQTs7Ozs7Ozs7O0FBUUEsTUFBSUMsVUFBVSxHQUFHLFNBQWJBLFVBQWEsR0FBVztBQUN4QixRQUFJUixVQUFVLEdBQUd6SyxDQUFDLENBQUMsZ0JBQUQsQ0FBbEI7QUFFQXlLLElBQUFBLFVBQVUsQ0FBQ25ILElBQVgsQ0FBZ0IsWUFBWTtBQUN4QixVQUFJNEYsT0FBTyxHQUFHbEosQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFReUQsSUFBUixDQUFhLFVBQWIsQ0FBZDtBQUNBLFVBQUkwRixPQUFPLEdBQUduSixDQUFDLENBQUMsSUFBRCxDQUFELENBQVF5RCxJQUFSLENBQWEsVUFBYixDQUFkO0FBRUEsVUFBSXlILFdBQVcsR0FBRztBQUNkaEMsUUFBQUEsT0FBTyxFQUFFQSxPQUFPLElBQUksSUFETjtBQUVkQyxRQUFBQSxPQUFPLEVBQUVBLE9BQU8sSUFBSSxJQUZOO0FBR2RnQyxRQUFBQSxRQUFRLEVBQUUsb0JBQVc7QUFDakJuTCxVQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVFvTCxNQUFSO0FBQ0FwTCxVQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVFzSSxPQUFSLENBQWdCLFFBQWhCLEVBQTBCdkcsUUFBMUIsQ0FBbUMsV0FBbkM7QUFDSDtBQU5hLE9BQWxCO0FBU0EvQixNQUFBQSxDQUFDLENBQUM2QixNQUFGLENBQVMsSUFBVCxFQUFlcUosV0FBZixFQUE0Qkosd0JBQTVCO0FBRUE5SyxNQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVF5SyxVQUFSLENBQW1CUyxXQUFuQjtBQUNILEtBaEJEO0FBaUJILEdBcEJEOztBQXNCQSxNQUFJVCxVQUFVLEdBQUcsSUFBSVEsVUFBSixFQUFqQixDQTVrQnlCLENBbWxCekI7O0FBQ0EsTUFBSUksZUFBZSxHQUFHLFNBQWxCQSxlQUFrQixHQUFXO0FBQzdCLFFBQUlDLGVBQWUsR0FBR3RMLENBQUMsQ0FBQyxzQkFBRCxDQUF2QjtBQUVBc0wsSUFBQUEsZUFBZSxDQUFDaEksSUFBaEIsQ0FBcUIsWUFBWTtBQUM3QixVQUFJaUksZUFBZSxHQUFHLEVBQXRCO0FBQ0EsVUFBSUMsYUFBYSxHQUFHLEVBQXBCO0FBRUF4TCxNQUFBQSxDQUFDLENBQUM2QixNQUFGLENBQVMsSUFBVCxFQUFlMEosZUFBZixFQUFnQ1Qsd0JBQWhDO0FBQ0E5SyxNQUFBQSxDQUFDLENBQUM2QixNQUFGLENBQVMsSUFBVCxFQUFlMkosYUFBZixFQUE4QlYsd0JBQTlCO0FBRUEsVUFBSVcsUUFBUSxHQUFHekwsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRaUUsSUFBUixDQUFhLGdCQUFiLEVBQStCd0csVUFBL0IsQ0FBMENjLGVBQTFDLENBQWY7QUFFQSxVQUFJRyxNQUFNLEdBQUcxTCxDQUFDLENBQUMsSUFBRCxDQUFELENBQVFpRSxJQUFSLENBQWEsY0FBYixFQUE2QndHLFVBQTdCLENBQXdDZSxhQUF4QyxDQUFiO0FBRUFDLE1BQUFBLFFBQVEsQ0FBQzFILEVBQVQsQ0FBWSxRQUFaLEVBQXNCLFlBQVc7QUFDN0IySCxRQUFBQSxNQUFNLENBQUNqQixVQUFQLENBQWtCLFFBQWxCLEVBQTRCLFNBQTVCLEVBQXVDa0IsT0FBTyxDQUFDLElBQUQsQ0FBOUM7QUFFQUQsUUFBQUEsTUFBTSxDQUFDaEYsSUFBUCxDQUFZLFVBQVosRUFBd0IsSUFBeEI7O0FBRUEsWUFBSTFHLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXVELFFBQVIsQ0FBaUIsZUFBakIsS0FBcUN2RCxDQUFDLENBQUMsSUFBRCxDQUFELENBQVFxSyxPQUFSLEdBQWtCdUIsT0FBbEIsRUFBekMsRUFBc0U7QUFDbEU1TCxVQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVFxSyxPQUFSLEdBQWtCd0IsUUFBbEI7QUFDSDtBQUNKLE9BUkQ7QUFVQUgsTUFBQUEsTUFBTSxDQUFDM0gsRUFBUCxDQUFVLFFBQVYsRUFBb0IsWUFBVztBQUMzQjBILFFBQUFBLFFBQVEsQ0FBQ2hCLFVBQVQsQ0FBb0IsUUFBcEIsRUFBOEIsU0FBOUIsRUFBeUNrQixPQUFPLENBQUMsSUFBRCxDQUFoRDtBQUVBRixRQUFBQSxRQUFRLENBQUMvRSxJQUFULENBQWMsVUFBZCxFQUEwQixJQUExQjs7QUFFQSxZQUFJMUcsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRdUQsUUFBUixDQUFpQixlQUFqQixLQUFxQ3ZELENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXFLLE9BQVIsR0FBa0J1QixPQUFsQixFQUF6QyxFQUFzRTtBQUNsRTVMLFVBQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXFLLE9BQVIsR0FBa0J3QixRQUFsQjtBQUNIO0FBQ0osT0FSRDtBQVNILEtBOUJEOztBQWdDQSxhQUFTRixPQUFULENBQWlCdkIsT0FBakIsRUFBMEI7QUFDdEIsVUFBSTBCLElBQUo7O0FBRUEsVUFBSTtBQUNBQSxRQUFBQSxJQUFJLEdBQUc5TCxDQUFDLENBQUN5SyxVQUFGLENBQWFzQixTQUFiLENBQXVCakIsd0JBQXdCLENBQUNDLFVBQWhELEVBQTREWCxPQUFPLENBQUNqRyxLQUFwRSxDQUFQO0FBQ0gsT0FGRCxDQUVFLE9BQU02SCxLQUFOLEVBQWE7QUFDWEYsUUFBQUEsSUFBSSxHQUFHLElBQVA7QUFDSDs7QUFFRCxhQUFPQSxJQUFQO0FBQ0g7QUFDSixHQTlDRDs7QUFnREEsTUFBSVIsZUFBZSxHQUFHLElBQUlELGVBQUosRUFBdEI7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFhQSxNQUFJWSxXQUFXLEdBQUcsU0FBZEEsV0FBYyxHQUFXO0FBQ3pCLFFBQU05SSxJQUFJLEdBQUcsSUFBYjtBQUNBLFFBQU0rSSxJQUFJLEdBQUdsTSxDQUFDLENBQUMsVUFBRCxDQUFkO0FBRUFrTSxJQUFBQSxJQUFJLENBQUM1SSxJQUFMLENBQVUsWUFBVztBQUNqQnRELE1BQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUWlFLElBQVIsQ0FBYSx3QkFBYixFQUF1Q3VDLElBQXZDLEdBQThDekUsUUFBOUMsQ0FBdUQsU0FBdkQ7QUFDSCxLQUZEO0FBSUFtSyxJQUFBQSxJQUFJLENBQUNuSSxFQUFMLENBQVEsT0FBUixFQUFpQixjQUFqQixFQUFpQyxVQUFTdUQsS0FBVCxFQUFnQjtBQUM3Q25FLE1BQUFBLElBQUksQ0FBQ2dKLElBQUwsQ0FBVW5NLENBQUMsQ0FBQyxJQUFELENBQVgsRUFBbUJzSCxLQUFuQixFQUQ2QyxDQUc3QztBQUNILEtBSkQ7QUFNQTs7Ozs7OztBQU1BdEgsSUFBQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWThELEVBQVosQ0FBZSxPQUFmLEVBQXdCLGlCQUF4QixFQUEyQyxVQUFTdUQsS0FBVCxFQUFnQjtBQUN2RCxVQUFNOEUsT0FBTyxHQUFHcE0sQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFReUQsSUFBUixDQUFhLFVBQWIsQ0FBaEI7QUFDQU4sTUFBQUEsSUFBSSxDQUFDZ0osSUFBTCxDQUFVbk0sQ0FBQyxDQUFDb00sT0FBRCxDQUFYLEVBQXNCOUUsS0FBdEI7O0FBRUEsVUFBSXRILENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXlELElBQVIsQ0FBYSxPQUFiLEtBQXlCWCxTQUE3QixFQUF3QztBQUNwQyxlQUFPLEtBQVA7QUFDSDtBQUNKLEtBUEQ7QUFTQTs7Ozs7Ozs7O0FBUUFLLElBQUFBLElBQUksQ0FBQ2dKLElBQUwsR0FBWSxVQUFTMUgsSUFBVCxFQUFlNkMsS0FBZixFQUFzQjtBQUM5QixVQUFJLENBQUM3QyxJQUFJLENBQUNsQixRQUFMLENBQWMsV0FBZCxDQUFMLEVBQWlDO0FBQzdCK0QsUUFBQUEsS0FBSyxDQUFDK0UsY0FBTjtBQUNBLFlBQUlDLFVBQVUsR0FBRzdILElBQUksQ0FBQzZELE9BQUwsQ0FBYTRELElBQWIsQ0FBakI7QUFDQUksUUFBQUEsVUFBVSxDQUFDckksSUFBWCxDQUFnQixVQUFoQixFQUE0QmpDLFdBQTVCLENBQXdDLFNBQXhDO0FBRUF5QyxRQUFBQSxJQUFJLENBQUMrQixJQUFMLEdBQVkrRixXQUFaLENBQXdCLFNBQXhCO0FBQ0FELFFBQUFBLFVBQVUsQ0FBQ3JJLElBQVgsQ0FBZ0IsWUFBaEIsRUFBOEJqQyxXQUE5QixDQUEwQyxXQUExQztBQUNBeUMsUUFBQUEsSUFBSSxDQUFDMUMsUUFBTCxDQUFjLFdBQWQ7QUFDSCxPQVJELE1BUU87QUFDSHVGLFFBQUFBLEtBQUssQ0FBQytFLGNBQU47QUFDSDtBQUNKLEtBWkQ7QUFhSCxHQWxERDs7QUFvREEsTUFBSUcsV0FBVyxHQUFHLElBQUlQLFdBQUosRUFBbEI7QUFFQTs7Ozs7Ozs7QUFPQSxXQUFTUSxrQkFBVCxDQUE0QkMsVUFBNUIsRUFBd0NDLFVBQXhDLEVBQW9EQyxVQUFwRCxFQUFnRTtBQUM1RDVNLElBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVk0TSxJQUFaLENBQWlCLGtCQUFqQixFQUFxQyxVQUFTN0ksQ0FBVCxFQUFZO0FBQzdDLFVBQUksQ0FBQzBJLFVBQVUsQ0FBQ0ksRUFBWCxDQUFjOUksQ0FBQyxDQUFDK0ksTUFBaEIsQ0FBRCxJQUE0Qi9NLENBQUMsQ0FBQ2dFLENBQUMsQ0FBQytJLE1BQUgsQ0FBRCxDQUFZekUsT0FBWixDQUFvQm9FLFVBQXBCLEVBQWdDL0YsTUFBaEMsSUFBMEMsQ0FBMUUsRUFBNkU7QUFDekVnRyxRQUFBQSxVQUFVLENBQUNLLElBQVgsQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsRUFBNEJDLE9BQTVCLENBQW9DOU0sYUFBYSxDQUFDQyxJQUFsRDs7QUFDQSxZQUFJd00sVUFBSixFQUFnQjtBQUNaQSxVQUFBQSxVQUFVO0FBQ2I7QUFDSjtBQUNKLEtBUEQ7QUFRSDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJBLE1BQUlNLGlCQUFpQixHQUFHLFNBQXBCQSxpQkFBb0IsR0FBVztBQUMvQixRQUFJQyxRQUFRLEdBQUc7QUFDWEMsTUFBQUEsS0FBSyxFQUFFLENBQ0gsTUFERyxFQUVILE1BRkcsRUFHSCxRQUhHO0FBREksS0FBZjs7QUFRQSxRQUFJcE4sQ0FBQyxDQUFDLG1CQUFELENBQUQsQ0FBdUIyRyxNQUF2QixHQUFnQyxDQUFwQyxFQUF1QztBQXlCbkM7Ozs7OztBQXpCbUMsVUErQjFCMEcsYUEvQjBCLEdBK0JuQyxTQUFTQSxhQUFULENBQXVCQyxjQUF2QixFQUF1Q0MsSUFBdkMsRUFBNkNDLEtBQTdDLEVBQW9EO0FBQ2hELGFBQUssSUFBSWhKLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcrSSxJQUFJLENBQUM1RyxNQUF6QixFQUFpQ25DLENBQUMsRUFBbEMsRUFBc0M7QUFDbEMsY0FBSThJLGNBQWMsSUFBSUgsUUFBUSxDQUFDQyxLQUFULENBQWUsQ0FBZixDQUF0QixFQUF5QztBQUNyQ3BOLFlBQUFBLENBQUMsQ0FBQ3VOLElBQUksQ0FBQy9JLENBQUQsQ0FBTCxDQUFELENBQVdnSixLQUFYLENBQWlCQSxLQUFqQixFQUF3QkMsTUFBeEIsQ0FBK0J0TixhQUFhLENBQUNDLElBQTdDO0FBQ0g7O0FBRUQsY0FBSWtOLGNBQWMsSUFBSUgsUUFBUSxDQUFDQyxLQUFULENBQWUsQ0FBZixDQUF0QixFQUF5QztBQUNyQ3BOLFlBQUFBLENBQUMsQ0FBQ3VOLElBQUksQ0FBQy9JLENBQUQsQ0FBTCxDQUFELENBQVd5SSxPQUFYLENBQW1COU0sYUFBYSxDQUFDQyxJQUFqQztBQUNIOztBQUVELGNBQUlrTixjQUFjLElBQUlILFFBQVEsQ0FBQ0MsS0FBVCxDQUFlLENBQWYsQ0FBdEIsRUFBeUM7QUFDckMsZ0JBQUlwTixDQUFDLENBQUN1TixJQUFJLENBQUMvSSxDQUFELENBQUwsQ0FBRCxDQUFXc0ksRUFBWCxDQUFjLFVBQWQsQ0FBSixFQUErQjtBQUMzQjlNLGNBQUFBLENBQUMsQ0FBQ3VOLElBQUksQ0FBQy9JLENBQUQsQ0FBTCxDQUFELENBQVd5SSxPQUFYLENBQW1COU0sYUFBYSxDQUFDQyxJQUFqQztBQUNILGFBRkQsTUFFTztBQUNISixjQUFBQSxDQUFDLENBQUN1TixJQUFJLENBQUMvSSxDQUFELENBQUwsQ0FBRCxDQUFXaUosTUFBWCxDQUFrQnROLGFBQWEsQ0FBQ0MsSUFBaEM7QUFDSDtBQUNKO0FBQ0o7QUFDSixPQWpEa0M7O0FBRW5DSixNQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZOEQsRUFBWixDQUFlLE9BQWYsRUFBd0IsbUJBQXhCLEVBQTZDLFlBQVc7QUFDcEQsWUFBSTJKLFFBQUo7O0FBQ0EsYUFBSyxJQUFJbEosQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRzJJLFFBQVEsQ0FBQ0MsS0FBVCxDQUFlekcsTUFBbkMsRUFBMkNuQyxDQUFDLEVBQTVDLEVBQWdEO0FBQzVDa0osVUFBQUEsUUFBUSxHQUFHUCxRQUFRLENBQUNDLEtBQVQsQ0FBZTVJLENBQWYsQ0FBWDs7QUFFQSxjQUFJeEUsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFReUQsSUFBUixDQUFhaUssUUFBYixDQUFKLEVBQTRCO0FBQ3hCLGdCQUFJQyxjQUFjLEdBQUczTixDQUFDLENBQUMsSUFBRCxDQUFELENBQVF5RCxJQUFSLENBQWFpSyxRQUFiLEVBQXVCNUQsS0FBdkIsQ0FBNkIsR0FBN0IsQ0FBckI7QUFBQSxnQkFDSTBELEtBQUssR0FBRyxDQURaOztBQUdBLGdCQUFJeE4sQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFReUQsSUFBUixDQUFhLE9BQWIsS0FBeUIsTUFBN0IsRUFBcUM7QUFDakMrSixjQUFBQSxLQUFLLEdBQUdyTixhQUFhLENBQUNDLElBQXRCO0FBQ0gsYUFGRCxNQUVPO0FBQ0hvTixjQUFBQSxLQUFLLEdBQUcsQ0FBUjtBQUNIOztBQUNESCxZQUFBQSxhQUFhLENBQUNLLFFBQUQsRUFBV0MsY0FBWCxFQUEyQkgsS0FBM0IsQ0FBYjtBQUNIO0FBQ0o7O0FBRUQsWUFBSSxDQUFDeE4sQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRdUQsUUFBUixDQUFpQixZQUFqQixDQUFELElBQW1DdkQsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRa0IsSUFBUixDQUFhLE1BQWIsS0FBd0IsT0FBM0QsSUFBc0VsQixDQUFDLENBQUMsSUFBRCxDQUFELENBQVFrQixJQUFSLENBQWEsTUFBYixLQUF3QixVQUFsRyxFQUE4RztBQUMxRyxpQkFBTyxLQUFQO0FBQ0g7QUFDSixPQXJCRDtBQWlESDtBQUNKLEdBN0REOztBQStEQWdNLEVBQUFBLGlCQUFpQjtBQUVqQjs7Ozs7Ozs7Ozs7OztBQVlBLE1BQUlVLE1BQU0sR0FBRyxTQUFUQSxNQUFTLEdBQVc7QUFDcEIsUUFBTUMsTUFBTSxHQUFHN04sQ0FBQyxDQUFDLFdBQUQsQ0FBaEI7QUFDQSxRQUFJK0ksR0FBSixFQUNJRSxHQURKLEVBRUk2RSxJQUZKLEVBR0lDLE1BSEo7QUFLQUYsSUFBQUEsTUFBTSxDQUFDdkssSUFBUCxDQUFZLFlBQVk7QUFFcEIsVUFBTUgsSUFBSSxHQUFHbkQsQ0FBQyxDQUFDLElBQUQsQ0FBZDtBQUFBLFVBQ0lnTyxLQUFLLEdBQUc3SyxJQUFJLENBQUNjLElBQUwsQ0FBVSxnQkFBVixDQURaO0FBR0E4RSxNQUFBQSxHQUFHLEdBQUdpRixLQUFLLENBQUN2SyxJQUFOLENBQVcsS0FBWCxDQUFOO0FBQ0F3RixNQUFBQSxHQUFHLEdBQUcrRSxLQUFLLENBQUN2SyxJQUFOLENBQVcsS0FBWCxDQUFOO0FBQ0FxSyxNQUFBQSxJQUFJLEdBQUdFLEtBQUssQ0FBQ3ZLLElBQU4sQ0FBVyxNQUFYLENBQVA7QUFDQXNLLE1BQUFBLE1BQU0sR0FBR0MsS0FBSyxDQUFDdkssSUFBTixDQUFXLFFBQVgsRUFBcUJxRyxLQUFyQixDQUEyQixJQUEzQixDQUFUO0FBRUFrRSxNQUFBQSxLQUFLLENBQUNILE1BQU4sQ0FBYTtBQUNURyxRQUFBQSxLQUFLLEVBQUUsSUFERTtBQUVUakYsUUFBQUEsR0FBRyxFQUFFQSxHQUFHLElBQUksSUFGSDtBQUdURSxRQUFBQSxHQUFHLEVBQUVBLEdBQUcsSUFBSSxJQUhIO0FBSVQ2RSxRQUFBQSxJQUFJLEVBQUVBLElBQUksSUFBSSxDQUpMO0FBS1RDLFFBQUFBLE1BQU0sRUFBRUEsTUFMQztBQU1URSxRQUFBQSxLQUFLLEVBQUUsZUFBUzNHLEtBQVQsRUFBZ0I0RyxFQUFoQixFQUFvQjtBQUN2Qi9LLFVBQUFBLElBQUksQ0FBQ2MsSUFBTCxDQUFVLG1CQUFWLEVBQStCa0ssUUFBL0IsQ0FBd0MsTUFBeEMsRUFBZ0QxSCxNQUFoRDtBQUNBdEQsVUFBQUEsSUFBSSxDQUFDYyxJQUFMLENBQVUsZ0NBQVYsRUFBNENtSyxNQUE1QyxpQkFBNERGLEVBQUUsQ0FBQ0gsTUFBSCxDQUFVLENBQVYsQ0FBNUQ7QUFDQTVLLFVBQUFBLElBQUksQ0FBQ2MsSUFBTCxDQUFVLGdDQUFWLEVBQTRDbUssTUFBNUMsaUJBQTRERixFQUFFLENBQUNILE1BQUgsQ0FBVSxDQUFWLENBQTVEO0FBQ0g7QUFWUSxPQUFiO0FBYUE1SyxNQUFBQSxJQUFJLENBQUNjLElBQUwsQ0FBVSxnQ0FBVixFQUE0Q21LLE1BQTVDLGlCQUE0REosS0FBSyxDQUFDSCxNQUFOLENBQWEsUUFBYixFQUF1QixDQUF2QixDQUE1RDtBQUNBMUssTUFBQUEsSUFBSSxDQUFDYyxJQUFMLENBQVUsZ0NBQVYsRUFBNENtSyxNQUE1QyxpQkFBNERKLEtBQUssQ0FBQ0gsTUFBTixDQUFhLFFBQWIsRUFBdUIsQ0FBdkIsQ0FBNUQ7QUFFSCxLQTFCRDtBQTJCSCxHQWxDRDs7QUFvQ0EsTUFBSUEsTUFBTSxHQUFHLElBQUlELE1BQUosRUFBYjs7QUFFQXZNLEVBQUFBLE1BQU0sQ0FBQ2dOLE1BQVAsR0FBYyxZQUFVO0FBQ3BCLFFBQUlDLE9BQU8sR0FBRXJPLFFBQVEsQ0FBQ3NPLGdCQUFULENBQTBCLHFCQUExQixDQUFiO0FBQ0FELElBQUFBLE9BQU8sQ0FBQ0UsT0FBUixDQUFnQixVQUFBQyxJQUFJLEVBQUk7QUFDcEJBLE1BQUFBLElBQUksQ0FBQ0MsZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsVUFBQ3RFLE9BQUQsRUFBYTtBQUN4Q2tFLFFBQUFBLE9BQU8sQ0FBQ0UsT0FBUixDQUFnQixVQUFBQyxJQUFJLEVBQUk7QUFDcEJBLFVBQUFBLElBQUksQ0FBQzVMLEtBQUwsQ0FBV2tELEtBQVgsR0FBaUIsS0FBakI7QUFDSCxTQUZEO0FBSUEsWUFBSTRJLE9BQU8sR0FBQ3ZFLE9BQU8sQ0FBQzJDLE1BQXBCO0FBQ0E0QixRQUFBQSxPQUFPLENBQUM5TCxLQUFSLENBQWNrRCxLQUFkLEdBQW9CLEtBQXBCO0FBQ0E0SSxRQUFBQSxPQUFPLENBQUNDLGtCQUFSLENBQTJCL0wsS0FBM0IsQ0FBaUNrRCxLQUFqQyxHQUF1QyxLQUF2QztBQUNBNEksUUFBQUEsT0FBTyxDQUFDRSxzQkFBUixDQUErQmhNLEtBQS9CLENBQXFDa0QsS0FBckMsR0FBMkMsS0FBM0M7QUFDQTRJLFFBQUFBLE9BQU8sQ0FBQ0Msa0JBQVIsQ0FBMkJBLGtCQUEzQixDQUE4Qy9MLEtBQTlDLENBQW9Ea0QsS0FBcEQsR0FBMEQsS0FBMUQ7QUFDQTRJLFFBQUFBLE9BQU8sQ0FBQ0Usc0JBQVIsQ0FBK0JBLHNCQUEvQixDQUFzRGhNLEtBQXRELENBQTREa0QsS0FBNUQsR0FBa0UsS0FBbEU7QUFDSCxPQVhEO0FBWUgsS0FiRDtBQWNILEdBaEJEOztBQWtCQS9GLEVBQUFBLENBQUMsQ0FBQyw0QkFBRCxDQUFELENBQWdDOE8sR0FBaEMsQ0FBb0MsUUFBcEMsRUFBOENDLElBQTlDO0FBQ0EvTyxFQUFBQSxDQUFDLENBQUMscUNBQUQsQ0FBRCxDQUF5Q29FLEtBQXpDLENBQStDLFlBQVc7QUFDekRwRSxJQUFBQSxDQUFDLENBQUMscUNBQUQsQ0FBRCxDQUF5Q2dDLFdBQXpDLENBQXFELFFBQXJELEVBQStEZ04sRUFBL0QsQ0FBa0VoUCxDQUFDLENBQUMsSUFBRCxDQUFELENBQVFtSCxLQUFSLEVBQWxFLEVBQW1GcEYsUUFBbkYsQ0FBNEYsUUFBNUY7QUFDQS9CLElBQUFBLENBQUMsQ0FBQyw0QkFBRCxDQUFELENBQWdDK08sSUFBaEMsR0FBdUNDLEVBQXZDLENBQTBDaFAsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRbUgsS0FBUixFQUExQyxFQUEyRHNHLE1BQTNEO0FBQ0EsR0FIRCxFQUdHdUIsRUFISCxDQUdNLENBSE4sRUFHU2pOLFFBSFQsQ0FHa0IsUUFIbEI7QUFJQSxNQUFNa04sU0FBUyxHQUFHalAsQ0FBQyxDQUFDLGNBQUQsQ0FBbkI7QUFDQSxNQUFNa1AsVUFBVSxHQUFHbFAsQ0FBQyxDQUFDLGNBQUQsQ0FBcEI7QUFFQWlQLEVBQUFBLFNBQVMsQ0FBQ2xMLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLFVBQVN1RCxLQUFULEVBQWdCO0FBQ2xDQSxJQUFBQSxLQUFLLENBQUMrRSxjQUFOO0FBRUEsUUFBSThDLEtBQUssR0FBR25QLENBQUMsQ0FBQyxJQUFELENBQWI7QUFDQSxRQUFJb1AsT0FBTyxHQUFHRCxLQUFLLENBQUMxTCxJQUFOLENBQVcsT0FBWCxDQUFkO0FBRUF6RCxJQUFBQSxDQUFDLENBQUNvUCxPQUFELENBQUQsQ0FBV3JOLFFBQVgsQ0FBb0IsTUFBcEI7QUFDQS9CLElBQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVStCLFFBQVYsQ0FBbUIsV0FBbkI7QUFFQXNOLElBQUFBLFVBQVUsQ0FBQyxZQUFXO0FBQ2xCclAsTUFBQUEsQ0FBQyxDQUFDb1AsT0FBRCxDQUFELENBQVduTCxJQUFYLENBQWdCLFdBQWhCLEVBQTZCb0MsR0FBN0IsQ0FBaUM7QUFDN0JpSixRQUFBQSxTQUFTLEVBQUU7QUFEa0IsT0FBakM7QUFHSCxLQUpTLEVBSVAsR0FKTyxDQUFWO0FBUUgsR0FqQkQ7QUFvQkFKLEVBQUFBLFVBQVUsQ0FBQ25MLEVBQVgsQ0FBYyxPQUFkLEVBQXVCLFVBQVN1RCxLQUFULEVBQWdCO0FBQ25DQSxJQUFBQSxLQUFLLENBQUMrRSxjQUFOO0FBRUEsUUFBSThDLEtBQUssR0FBR25QLENBQUMsQ0FBQyxJQUFELENBQWI7QUFDQSxRQUFJdVAsV0FBVyxHQUFHSixLQUFLLENBQUNLLE9BQU4sQ0FBYyxRQUFkLENBQWxCO0FBRUFELElBQUFBLFdBQVcsQ0FBQ3RMLElBQVosQ0FBaUIsV0FBakIsRUFBOEJvQyxHQUE5QixDQUFrQztBQUM5QmlKLE1BQUFBLFNBQVMsRUFBRTtBQURtQixLQUFsQztBQUlBRCxJQUFBQSxVQUFVLENBQUMsWUFBVztBQUNsQkUsTUFBQUEsV0FBVyxDQUFDdk4sV0FBWixDQUF3QixNQUF4QjtBQUNBaEMsTUFBQUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVZ0MsV0FBVixDQUFzQixXQUF0QjtBQUNILEtBSFMsRUFHUCxHQUhPLENBQVY7QUFPSCxHQWpCRDtBQW1CQWhDLEVBQUFBLENBQUMsQ0FBQyxRQUFELENBQUQsQ0FBWStELEVBQVosQ0FBZSxPQUFmLEVBQXdCLFVBQVN1RCxLQUFULEVBQWdCO0FBQ3BDLFFBQUk2SCxLQUFLLEdBQUduUCxDQUFDLENBQUMsSUFBRCxDQUFiO0FBRUFtUCxJQUFBQSxLQUFLLENBQUNsTCxJQUFOLENBQVcsV0FBWCxFQUF3Qm9DLEdBQXhCLENBQTRCO0FBQ3hCaUosTUFBQUEsU0FBUyxFQUFFO0FBRGEsS0FBNUI7QUFJQUQsSUFBQUEsVUFBVSxDQUFDLFlBQVc7QUFDbEJGLE1BQUFBLEtBQUssQ0FBQ25OLFdBQU4sQ0FBa0IsTUFBbEI7QUFDQWhDLE1BQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVWdDLFdBQVYsQ0FBc0IsV0FBdEI7QUFDSCxLQUhTLEVBR1AsR0FITyxDQUFWO0FBS0gsR0FaRDtBQWNBaEMsRUFBQUEsQ0FBQyxDQUFDLFdBQUQsQ0FBRCxDQUFlK0QsRUFBZixDQUFrQixPQUFsQixFQUEyQixVQUFTdUQsS0FBVCxFQUFnQjtBQUN2Q0EsSUFBQUEsS0FBSyxDQUFDbUksZUFBTjtBQUNILEdBRkQ7QUFHQSxNQUFJQyxHQUFHLEdBQUV6UCxRQUFRLENBQUNzTyxnQkFBVCxDQUEwQixRQUExQixDQUFUO0FBQ0FtQixFQUFBQSxHQUFHLENBQUNsQixPQUFKLENBQVksVUFBQUMsSUFBSSxFQUFJO0FBQ2hCQSxJQUFBQSxJQUFJLENBQUNDLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCLFVBQUN0RSxPQUFELEVBQWE7QUFDeENzRixNQUFBQSxHQUFHLENBQUNsQixPQUFKLENBQVksVUFBQUMsSUFBSSxFQUFJO0FBQ2hCQSxRQUFBQSxJQUFJLENBQUM1TCxLQUFMLENBQVdrRCxLQUFYLEdBQWlCLE9BQWpCO0FBQ0gsT0FGRDtBQUlBLFVBQUk0SSxPQUFPLEdBQUN2RSxPQUFPLENBQUMyQyxNQUFwQjtBQUNBNEIsTUFBQUEsT0FBTyxDQUFDOUwsS0FBUixDQUFja0QsS0FBZCxHQUFvQixPQUFwQjtBQUVILEtBUkQ7QUFTSCxHQVZEO0FBWUEvRixFQUFBQSxDQUFDLENBQUMsY0FBRCxDQUFELENBQWtCK0QsRUFBbEIsQ0FBcUIsT0FBckIsRUFBOEIsVUFBU3VELEtBQVQsRUFBZ0I7QUFDMUM7QUFDQUEsSUFBQUEsS0FBSyxDQUFDK0UsY0FBTjtBQUVBLFFBQUlzRCxFQUFFLEdBQUczUCxDQUFDLENBQUMsSUFBRCxDQUFELENBQVFrQixJQUFSLENBQWEsTUFBYixDQUFUO0FBQUEsUUFDSTBPLEVBQUUsR0FBRzVQLENBQUMsQ0FBQzJQLEVBQUQsQ0FBRCxDQUFNL0osTUFBTixHQUFlRSxHQUR4QjtBQUVBOzs7OztBQUtBOUYsSUFBQUEsQ0FBQyxDQUFDLFlBQUQsQ0FBRCxDQUFnQjZQLE9BQWhCLENBQXdCO0FBQUNDLE1BQUFBLFNBQVMsRUFBRUY7QUFBWixLQUF4QixFQUF5QyxJQUF6QztBQUVBOzs7QUFHSCxHQWhCRDtBQWtCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E1UCxFQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDeEJGLElBQUFBLENBQUMsQ0FBQyxjQUFELENBQUQsQ0FBa0IrTyxJQUFsQjtBQUNILEdBRkQ7QUFLQS9PLEVBQUFBLENBQUMsQ0FBQyxLQUFELENBQUQsQ0FBU29FLEtBQVQsQ0FBZSxVQUFTSixDQUFULEVBQVk7QUFDdkJBLElBQUFBLENBQUMsQ0FBQ3FJLGNBQUYsR0FEdUIsQ0FFdkI7QUFDQTtBQUVBOztBQUNBck0sSUFBQUEsQ0FBQyxDQUFDLGNBQUQsQ0FBRCxDQUFrQitPLElBQWxCO0FBQ0EvTyxJQUFBQSxDQUFDLENBQUMsY0FBRCxDQUFELENBQWtCK1AsSUFBbEIsQ0FBdUIsT0FBdkI7QUFDSCxHQVJELEVBeGdDeUIsQ0FraEN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTs7O0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUMsVUFBU3ZMLENBQVQsRUFBVztBQUFDOztBQUFhLGtCQUFZLE9BQU93TCxNQUFuQixJQUEyQkEsTUFBTSxDQUFDQyxHQUFsQyxHQUFzQ0QsTUFBTSxDQUFDLENBQUMsUUFBRCxDQUFELEVBQVl4TCxDQUFaLENBQTVDLEdBQTJELGVBQWEsT0FBTzBMLE9BQXBCLEdBQTRCQyxNQUFNLENBQUNELE9BQVAsR0FBZTFMLENBQUMsQ0FBQzRMLE9BQU8sQ0FBQyxRQUFELENBQVIsQ0FBNUMsR0FBZ0U1TCxDQUFDLENBQUM2TCxNQUFELENBQTVIO0FBQXFJLEdBQTlKLENBQStKLFVBQVM3TCxDQUFULEVBQVc7QUFBQzs7QUFBYSxRQUFJUixDQUFDLEdBQUMzQyxNQUFNLENBQUNpUCxLQUFQLElBQWMsRUFBcEI7QUFBdUIsS0FBQ3RNLENBQUMsR0FBQyxZQUFVO0FBQUMsVUFBSUEsQ0FBQyxHQUFDLENBQU47QUFBUSxhQUFPLFVBQVNwQixDQUFULEVBQVcyTixDQUFYLEVBQWE7QUFBQyxZQUFJQyxDQUFKO0FBQUEsWUFBTUMsQ0FBQyxHQUFDLElBQVI7QUFBYUEsUUFBQUEsQ0FBQyxDQUFDQyxRQUFGLEdBQVc7QUFBQ0MsVUFBQUEsYUFBYSxFQUFDLENBQUMsQ0FBaEI7QUFBa0JDLFVBQUFBLGNBQWMsRUFBQyxDQUFDLENBQWxDO0FBQW9DQyxVQUFBQSxZQUFZLEVBQUNyTSxDQUFDLENBQUM1QixDQUFELENBQWxEO0FBQXNEa08sVUFBQUEsVUFBVSxFQUFDdE0sQ0FBQyxDQUFDNUIsQ0FBRCxDQUFsRTtBQUFzRW1PLFVBQUFBLE1BQU0sRUFBQyxDQUFDLENBQTlFO0FBQWdGQyxVQUFBQSxRQUFRLEVBQUMsSUFBekY7QUFBOEZDLFVBQUFBLFNBQVMsRUFBQyxrRkFBeEc7QUFBMkxDLFVBQUFBLFNBQVMsRUFBQywwRUFBck07QUFBZ1JDLFVBQUFBLFFBQVEsRUFBQyxDQUFDLENBQTFSO0FBQTRSQyxVQUFBQSxhQUFhLEVBQUMsR0FBMVM7QUFBOFNDLFVBQUFBLFVBQVUsRUFBQyxDQUFDLENBQTFUO0FBQTRUQyxVQUFBQSxhQUFhLEVBQUMsTUFBMVU7QUFBaVZDLFVBQUFBLE9BQU8sRUFBQyxNQUF6VjtBQUFnV0MsVUFBQUEsWUFBWSxFQUFDLHNCQUFTeE4sQ0FBVCxFQUFXcEIsQ0FBWCxFQUFhO0FBQUMsbUJBQU80QixDQUFDLENBQUMsMEJBQUQsQ0FBRCxDQUE4QmlOLElBQTlCLENBQW1DN08sQ0FBQyxHQUFDLENBQXJDLENBQVA7QUFBK0MsV0FBMWE7QUFBMmE4TyxVQUFBQSxJQUFJLEVBQUMsQ0FBQyxDQUFqYjtBQUFtYkMsVUFBQUEsU0FBUyxFQUFDLFlBQTdiO0FBQTBjQyxVQUFBQSxTQUFTLEVBQUMsQ0FBQyxDQUFyZDtBQUF1ZEMsVUFBQUEsTUFBTSxFQUFDLFFBQTlkO0FBQXVlQyxVQUFBQSxZQUFZLEVBQUMsR0FBcGY7QUFBd2ZDLFVBQUFBLElBQUksRUFBQyxDQUFDLENBQTlmO0FBQWdnQkMsVUFBQUEsYUFBYSxFQUFDLENBQUMsQ0FBL2dCO0FBQWloQkMsVUFBQUEsYUFBYSxFQUFDLENBQUMsQ0FBaGlCO0FBQWtpQkMsVUFBQUEsUUFBUSxFQUFDLENBQUMsQ0FBNWlCO0FBQThpQkMsVUFBQUEsWUFBWSxFQUFDLENBQTNqQjtBQUE2akJDLFVBQUFBLFFBQVEsRUFBQyxVQUF0a0I7QUFBaWxCQyxVQUFBQSxXQUFXLEVBQUMsQ0FBQyxDQUE5bEI7QUFBZ21CQyxVQUFBQSxZQUFZLEVBQUMsQ0FBQyxDQUE5bUI7QUFBZ25CQyxVQUFBQSxZQUFZLEVBQUMsQ0FBQyxDQUE5bkI7QUFBZ29CQyxVQUFBQSxnQkFBZ0IsRUFBQyxDQUFDLENBQWxwQjtBQUFvcEJDLFVBQUFBLFNBQVMsRUFBQyxRQUE5cEI7QUFBdXFCQyxVQUFBQSxVQUFVLEVBQUMsSUFBbHJCO0FBQXVyQkMsVUFBQUEsSUFBSSxFQUFDLENBQTVyQjtBQUE4ckJDLFVBQUFBLEdBQUcsRUFBQyxDQUFDLENBQW5zQjtBQUFxc0IzRSxVQUFBQSxLQUFLLEVBQUMsRUFBM3NCO0FBQThzQjRFLFVBQUFBLFlBQVksRUFBQyxDQUEzdEI7QUFBNnRCQyxVQUFBQSxZQUFZLEVBQUMsQ0FBMXVCO0FBQTR1QkMsVUFBQUEsY0FBYyxFQUFDLENBQTN2QjtBQUE2dkJDLFVBQUFBLEtBQUssRUFBQyxHQUFud0I7QUFBdXdCQyxVQUFBQSxLQUFLLEVBQUMsQ0FBQyxDQUE5d0I7QUFBZ3hCQyxVQUFBQSxZQUFZLEVBQUMsQ0FBQyxDQUE5eEI7QUFBZ3lCQyxVQUFBQSxTQUFTLEVBQUMsQ0FBQyxDQUEzeUI7QUFBNnlCQyxVQUFBQSxjQUFjLEVBQUMsQ0FBNXpCO0FBQTh6QkMsVUFBQUEsTUFBTSxFQUFDLENBQUMsQ0FBdDBCO0FBQXcwQkMsVUFBQUEsWUFBWSxFQUFDLENBQUMsQ0FBdDFCO0FBQXcxQkMsVUFBQUEsYUFBYSxFQUFDLENBQUMsQ0FBdjJCO0FBQXkyQkMsVUFBQUEsUUFBUSxFQUFDLENBQUMsQ0FBbjNCO0FBQXEzQkMsVUFBQUEsZUFBZSxFQUFDLENBQUMsQ0FBdDRCO0FBQXc0QkMsVUFBQUEsY0FBYyxFQUFDLENBQUMsQ0FBeDVCO0FBQTA1QkMsVUFBQUEsTUFBTSxFQUFDO0FBQWo2QixTQUFYLEVBQWk3QmxELENBQUMsQ0FBQ21ELFFBQUYsR0FBVztBQUFDQyxVQUFBQSxTQUFTLEVBQUMsQ0FBQyxDQUFaO0FBQWNDLFVBQUFBLFFBQVEsRUFBQyxDQUFDLENBQXhCO0FBQTBCQyxVQUFBQSxhQUFhLEVBQUMsSUFBeEM7QUFBNkNDLFVBQUFBLGdCQUFnQixFQUFDLENBQTlEO0FBQWdFQyxVQUFBQSxXQUFXLEVBQUMsSUFBNUU7QUFBaUZDLFVBQUFBLFlBQVksRUFBQyxDQUE5RjtBQUFnR0MsVUFBQUEsU0FBUyxFQUFDLENBQTFHO0FBQTRHQyxVQUFBQSxLQUFLLEVBQUMsSUFBbEg7QUFBdUhDLFVBQUFBLFNBQVMsRUFBQyxJQUFqSTtBQUFzSUMsVUFBQUEsVUFBVSxFQUFDLElBQWpKO0FBQXNKQyxVQUFBQSxTQUFTLEVBQUMsQ0FBaEs7QUFBa0tDLFVBQUFBLFVBQVUsRUFBQyxJQUE3SztBQUFrTEMsVUFBQUEsVUFBVSxFQUFDLElBQTdMO0FBQWtNQyxVQUFBQSxTQUFTLEVBQUMsQ0FBQyxDQUE3TTtBQUErTUMsVUFBQUEsVUFBVSxFQUFDLElBQTFOO0FBQStOQyxVQUFBQSxVQUFVLEVBQUMsSUFBMU87QUFBK09DLFVBQUFBLFdBQVcsRUFBQyxJQUEzUDtBQUFnUUMsVUFBQUEsT0FBTyxFQUFDLElBQXhRO0FBQTZRQyxVQUFBQSxPQUFPLEVBQUMsQ0FBQyxDQUF0UjtBQUF3UkMsVUFBQUEsV0FBVyxFQUFDLENBQXBTO0FBQXNTQyxVQUFBQSxTQUFTLEVBQUMsSUFBaFQ7QUFBcVRDLFVBQUFBLE9BQU8sRUFBQyxDQUFDLENBQTlUO0FBQWdVQyxVQUFBQSxLQUFLLEVBQUMsSUFBdFU7QUFBMlVDLFVBQUFBLFdBQVcsRUFBQyxFQUF2VjtBQUEwVkMsVUFBQUEsaUJBQWlCLEVBQUMsQ0FBQyxDQUE3VztBQUErV0MsVUFBQUEsU0FBUyxFQUFDLENBQUM7QUFBMVgsU0FBNTdCLEVBQXl6QzlRLENBQUMsQ0FBQzNDLE1BQUYsQ0FBUzRPLENBQVQsRUFBV0EsQ0FBQyxDQUFDbUQsUUFBYixDQUF6ekMsRUFBZzFDbkQsQ0FBQyxDQUFDOEUsZ0JBQUYsR0FBbUIsSUFBbjJDLEVBQXcyQzlFLENBQUMsQ0FBQytFLFFBQUYsR0FBVyxJQUFuM0MsRUFBdzNDL0UsQ0FBQyxDQUFDZ0YsUUFBRixHQUFXLElBQW40QyxFQUF3NENoRixDQUFDLENBQUN0UCxXQUFGLEdBQWMsRUFBdDVDLEVBQXk1Q3NQLENBQUMsQ0FBQ2lGLGtCQUFGLEdBQXFCLEVBQTk2QyxFQUFpN0NqRixDQUFDLENBQUNrRixjQUFGLEdBQWlCLENBQUMsQ0FBbjhDLEVBQXE4Q2xGLENBQUMsQ0FBQ21GLFFBQUYsR0FBVyxDQUFDLENBQWo5QyxFQUFtOUNuRixDQUFDLENBQUNvRixXQUFGLEdBQWMsQ0FBQyxDQUFsK0MsRUFBbytDcEYsQ0FBQyxDQUFDcUYsTUFBRixHQUFTLFFBQTcrQyxFQUFzL0NyRixDQUFDLENBQUNzRixNQUFGLEdBQVMsQ0FBQyxDQUFoZ0QsRUFBa2dEdEYsQ0FBQyxDQUFDdUYsWUFBRixHQUFlLElBQWpoRCxFQUFzaER2RixDQUFDLENBQUNnQyxTQUFGLEdBQVksSUFBbGlELEVBQXVpRGhDLENBQUMsQ0FBQ3dGLFFBQUYsR0FBVyxDQUFsakQsRUFBb2pEeEYsQ0FBQyxDQUFDeUYsV0FBRixHQUFjLENBQUMsQ0FBbmtELEVBQXFrRHpGLENBQUMsQ0FBQzBGLE9BQUYsR0FBVTNSLENBQUMsQ0FBQzVCLENBQUQsQ0FBaGxELEVBQW9sRDZOLENBQUMsQ0FBQzJGLFlBQUYsR0FBZSxJQUFubUQsRUFBd21EM0YsQ0FBQyxDQUFDNEYsYUFBRixHQUFnQixJQUF4bkQsRUFBNm5ENUYsQ0FBQyxDQUFDNkYsY0FBRixHQUFpQixJQUE5b0QsRUFBbXBEN0YsQ0FBQyxDQUFDOEYsZ0JBQUYsR0FBbUIsa0JBQXRxRCxFQUF5ckQ5RixDQUFDLENBQUMrRixXQUFGLEdBQWMsQ0FBdnNELEVBQXlzRC9GLENBQUMsQ0FBQ2dHLFdBQUYsR0FBYyxJQUF2dEQsRUFBNHREakcsQ0FBQyxHQUFDaE0sQ0FBQyxDQUFDNUIsQ0FBRCxDQUFELENBQUthLElBQUwsQ0FBVSxPQUFWLEtBQW9CLEVBQWx2RCxFQUFxdkRnTixDQUFDLENBQUMvSSxPQUFGLEdBQVVsRCxDQUFDLENBQUMzQyxNQUFGLENBQVMsRUFBVCxFQUFZNE8sQ0FBQyxDQUFDQyxRQUFkLEVBQXVCSCxDQUF2QixFQUF5QkMsQ0FBekIsQ0FBL3ZELEVBQTJ4REMsQ0FBQyxDQUFDeUQsWUFBRixHQUFlekQsQ0FBQyxDQUFDL0ksT0FBRixDQUFVeUssWUFBcHpELEVBQWkwRDFCLENBQUMsQ0FBQ2lHLGdCQUFGLEdBQW1CakcsQ0FBQyxDQUFDL0ksT0FBdDFELEVBQTgxRCxLQUFLLENBQUwsS0FBU3pILFFBQVEsQ0FBQzBXLFNBQWxCLElBQTZCbEcsQ0FBQyxDQUFDcUYsTUFBRixHQUFTLFdBQVQsRUFBcUJyRixDQUFDLENBQUM4RixnQkFBRixHQUFtQixxQkFBckUsSUFBNEYsS0FBSyxDQUFMLEtBQVN0VyxRQUFRLENBQUMyVyxZQUFsQixLQUFpQ25HLENBQUMsQ0FBQ3FGLE1BQUYsR0FBUyxjQUFULEVBQXdCckYsQ0FBQyxDQUFDOEYsZ0JBQUYsR0FBbUIsd0JBQTVFLENBQTE3RCxFQUFnaUU5RixDQUFDLENBQUNvRyxRQUFGLEdBQVdyUyxDQUFDLENBQUNzUyxLQUFGLENBQVFyRyxDQUFDLENBQUNvRyxRQUFWLEVBQW1CcEcsQ0FBbkIsQ0FBM2lFLEVBQWlrRUEsQ0FBQyxDQUFDc0csYUFBRixHQUFnQnZTLENBQUMsQ0FBQ3NTLEtBQUYsQ0FBUXJHLENBQUMsQ0FBQ3NHLGFBQVYsRUFBd0J0RyxDQUF4QixDQUFqbEUsRUFBNG1FQSxDQUFDLENBQUN1RyxnQkFBRixHQUFtQnhTLENBQUMsQ0FBQ3NTLEtBQUYsQ0FBUXJHLENBQUMsQ0FBQ3VHLGdCQUFWLEVBQTJCdkcsQ0FBM0IsQ0FBL25FLEVBQTZwRUEsQ0FBQyxDQUFDd0csV0FBRixHQUFjelMsQ0FBQyxDQUFDc1MsS0FBRixDQUFRckcsQ0FBQyxDQUFDd0csV0FBVixFQUFzQnhHLENBQXRCLENBQTNxRSxFQUFvc0VBLENBQUMsQ0FBQ3lHLFlBQUYsR0FBZTFTLENBQUMsQ0FBQ3NTLEtBQUYsQ0FBUXJHLENBQUMsQ0FBQ3lHLFlBQVYsRUFBdUJ6RyxDQUF2QixDQUFudEUsRUFBNnVFQSxDQUFDLENBQUMwRyxhQUFGLEdBQWdCM1MsQ0FBQyxDQUFDc1MsS0FBRixDQUFRckcsQ0FBQyxDQUFDMEcsYUFBVixFQUF3QjFHLENBQXhCLENBQTd2RSxFQUF3eEVBLENBQUMsQ0FBQzJHLFdBQUYsR0FBYzVTLENBQUMsQ0FBQ3NTLEtBQUYsQ0FBUXJHLENBQUMsQ0FBQzJHLFdBQVYsRUFBc0IzRyxDQUF0QixDQUF0eUUsRUFBK3pFQSxDQUFDLENBQUM0RyxZQUFGLEdBQWU3UyxDQUFDLENBQUNzUyxLQUFGLENBQVFyRyxDQUFDLENBQUM0RyxZQUFWLEVBQXVCNUcsQ0FBdkIsQ0FBOTBFLEVBQXcyRUEsQ0FBQyxDQUFDNkcsV0FBRixHQUFjOVMsQ0FBQyxDQUFDc1MsS0FBRixDQUFRckcsQ0FBQyxDQUFDNkcsV0FBVixFQUFzQjdHLENBQXRCLENBQXQzRSxFQUErNEVBLENBQUMsQ0FBQzhHLFVBQUYsR0FBYS9TLENBQUMsQ0FBQ3NTLEtBQUYsQ0FBUXJHLENBQUMsQ0FBQzhHLFVBQVYsRUFBcUI5RyxDQUFyQixDQUE1NUUsRUFBbzdFQSxDQUFDLENBQUMrRyxXQUFGLEdBQWN4VCxDQUFDLEVBQW44RSxFQUFzOEV5TSxDQUFDLENBQUNnSCxRQUFGLEdBQVcsMkJBQWo5RSxFQUE2K0VoSCxDQUFDLENBQUNpSCxtQkFBRixFQUE3K0UsRUFBcWdGakgsQ0FBQyxDQUFDck4sSUFBRixDQUFPLENBQUMsQ0FBUixDQUFyZ0Y7QUFBZ2hGLE9BQWxqRjtBQUFtakYsS0FBdGtGLEVBQUgsRUFBNmtGdVUsU0FBN2tGLENBQXVsRkMsV0FBdmxGLEdBQW1tRixZQUFVO0FBQUMsV0FBSy9DLFdBQUwsQ0FBaUI1USxJQUFqQixDQUFzQixlQUF0QixFQUF1Qy9DLElBQXZDLENBQTRDO0FBQUMsdUJBQWM7QUFBZixPQUE1QyxFQUFxRStDLElBQXJFLENBQTBFLDBCQUExRSxFQUFzRy9DLElBQXRHLENBQTJHO0FBQUMyVyxRQUFBQSxRQUFRLEVBQUM7QUFBVixPQUEzRztBQUEySCxLQUF6dUYsRUFBMHVGN1QsQ0FBQyxDQUFDMlQsU0FBRixDQUFZRyxRQUFaLEdBQXFCOVQsQ0FBQyxDQUFDMlQsU0FBRixDQUFZSSxRQUFaLEdBQXFCLFVBQVMvVCxDQUFULEVBQVdwQixDQUFYLEVBQWEyTixDQUFiLEVBQWU7QUFBQyxVQUFJQyxDQUFDLEdBQUMsSUFBTjtBQUFXLFVBQUcsYUFBVyxPQUFPNU4sQ0FBckIsRUFBdUIyTixDQUFDLEdBQUMzTixDQUFGLEVBQUlBLENBQUMsR0FBQyxJQUFOLENBQXZCLEtBQXVDLElBQUdBLENBQUMsR0FBQyxDQUFGLElBQUtBLENBQUMsSUFBRTROLENBQUMsQ0FBQ21FLFVBQWIsRUFBd0IsT0FBTSxDQUFDLENBQVA7QUFBU25FLE1BQUFBLENBQUMsQ0FBQ3dILE1BQUYsSUFBVyxZQUFVLE9BQU9wVixDQUFqQixHQUFtQixNQUFJQSxDQUFKLElBQU8sTUFBSTROLENBQUMsQ0FBQ3NFLE9BQUYsQ0FBVW5PLE1BQXJCLEdBQTRCbkMsQ0FBQyxDQUFDUixDQUFELENBQUQsQ0FBS2lVLFFBQUwsQ0FBY3pILENBQUMsQ0FBQ3FFLFdBQWhCLENBQTVCLEdBQXlEdEUsQ0FBQyxHQUFDL0wsQ0FBQyxDQUFDUixDQUFELENBQUQsQ0FBS2tVLFlBQUwsQ0FBa0IxSCxDQUFDLENBQUNzRSxPQUFGLENBQVU5RixFQUFWLENBQWFwTSxDQUFiLENBQWxCLENBQUQsR0FBb0M0QixDQUFDLENBQUNSLENBQUQsQ0FBRCxDQUFLbVUsV0FBTCxDQUFpQjNILENBQUMsQ0FBQ3NFLE9BQUYsQ0FBVTlGLEVBQVYsQ0FBYXBNLENBQWIsQ0FBakIsQ0FBakgsR0FBbUosQ0FBQyxDQUFELEtBQUsyTixDQUFMLEdBQU8vTCxDQUFDLENBQUNSLENBQUQsQ0FBRCxDQUFLb1UsU0FBTCxDQUFlNUgsQ0FBQyxDQUFDcUUsV0FBakIsQ0FBUCxHQUFxQ3JRLENBQUMsQ0FBQ1IsQ0FBRCxDQUFELENBQUtpVSxRQUFMLENBQWN6SCxDQUFDLENBQUNxRSxXQUFoQixDQUFuTSxFQUFnT3JFLENBQUMsQ0FBQ3NFLE9BQUYsR0FBVXRFLENBQUMsQ0FBQ3FFLFdBQUYsQ0FBYzFHLFFBQWQsQ0FBdUIsS0FBS3pHLE9BQUwsQ0FBYXVHLEtBQXBDLENBQTFPLEVBQXFSdUMsQ0FBQyxDQUFDcUUsV0FBRixDQUFjMUcsUUFBZCxDQUF1QixLQUFLekcsT0FBTCxDQUFhdUcsS0FBcEMsRUFBMkNvSyxNQUEzQyxFQUFyUixFQUF5VTdILENBQUMsQ0FBQ3FFLFdBQUYsQ0FBY3pHLE1BQWQsQ0FBcUJvQyxDQUFDLENBQUNzRSxPQUF2QixDQUF6VSxFQUF5V3RFLENBQUMsQ0FBQ3NFLE9BQUYsQ0FBVXhSLElBQVYsQ0FBZSxVQUFTVSxDQUFULEVBQVdwQixDQUFYLEVBQWE7QUFBQzRCLFFBQUFBLENBQUMsQ0FBQzVCLENBQUQsQ0FBRCxDQUFLMUIsSUFBTCxDQUFVLGtCQUFWLEVBQTZCOEMsQ0FBN0I7QUFBZ0MsT0FBN0QsQ0FBelcsRUFBd2F3TSxDQUFDLENBQUM0RixZQUFGLEdBQWU1RixDQUFDLENBQUNzRSxPQUF6YixFQUFpY3RFLENBQUMsQ0FBQzhILE1BQUYsRUFBamM7QUFBNGMsS0FBbjBHLEVBQW8wR3RVLENBQUMsQ0FBQzJULFNBQUYsQ0FBWVksYUFBWixHQUEwQixZQUFVO0FBQUMsVUFBSS9ULENBQUMsR0FBQyxJQUFOOztBQUFXLFVBQUcsTUFBSUEsQ0FBQyxDQUFDa0QsT0FBRixDQUFVb0wsWUFBZCxJQUE0QixDQUFDLENBQUQsS0FBS3RPLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVWtKLGNBQTNDLElBQTJELENBQUMsQ0FBRCxLQUFLcE0sQ0FBQyxDQUFDa0QsT0FBRixDQUFVOEwsUUFBN0UsRUFBc0Y7QUFBQyxZQUFJeFAsQ0FBQyxHQUFDUSxDQUFDLENBQUNzUSxPQUFGLENBQVU5RixFQUFWLENBQWF4SyxDQUFDLENBQUMwUCxZQUFmLEVBQTZCc0UsV0FBN0IsQ0FBeUMsQ0FBQyxDQUExQyxDQUFOO0FBQW1EaFUsUUFBQUEsQ0FBQyxDQUFDMlEsS0FBRixDQUFRdEYsT0FBUixDQUFnQjtBQUFDN0osVUFBQUEsTUFBTSxFQUFDaEM7QUFBUixTQUFoQixFQUEyQlEsQ0FBQyxDQUFDa0QsT0FBRixDQUFVc0wsS0FBckM7QUFBNEM7QUFBQyxLQUEzaUgsRUFBNGlIaFAsQ0FBQyxDQUFDMlQsU0FBRixDQUFZYyxZQUFaLEdBQXlCLFVBQVN6VSxDQUFULEVBQVdwQixDQUFYLEVBQWE7QUFBQyxVQUFJMk4sQ0FBQyxHQUFDLEVBQU47QUFBQSxVQUFTQyxDQUFDLEdBQUMsSUFBWDtBQUFnQkEsTUFBQUEsQ0FBQyxDQUFDK0gsYUFBRixJQUFrQixDQUFDLENBQUQsS0FBSy9ILENBQUMsQ0FBQzlJLE9BQUYsQ0FBVWtMLEdBQWYsSUFBb0IsQ0FBQyxDQUFELEtBQUtwQyxDQUFDLENBQUM5SSxPQUFGLENBQVU4TCxRQUFuQyxLQUE4Q3hQLENBQUMsR0FBQyxDQUFDQSxDQUFqRCxDQUFsQixFQUFzRSxDQUFDLENBQUQsS0FBS3dNLENBQUMsQ0FBQzZFLGlCQUFQLEdBQXlCLENBQUMsQ0FBRCxLQUFLN0UsQ0FBQyxDQUFDOUksT0FBRixDQUFVOEwsUUFBZixHQUF3QmhELENBQUMsQ0FBQ3FFLFdBQUYsQ0FBY2hGLE9BQWQsQ0FBc0I7QUFBQ2hLLFFBQUFBLElBQUksRUFBQzdCO0FBQU4sT0FBdEIsRUFBK0J3TSxDQUFDLENBQUM5SSxPQUFGLENBQVVzTCxLQUF6QyxFQUErQ3hDLENBQUMsQ0FBQzlJLE9BQUYsQ0FBVW1LLE1BQXpELEVBQWdFalAsQ0FBaEUsQ0FBeEIsR0FBMkY0TixDQUFDLENBQUNxRSxXQUFGLENBQWNoRixPQUFkLENBQXNCO0FBQUMvSixRQUFBQSxHQUFHLEVBQUM5QjtBQUFMLE9BQXRCLEVBQThCd00sQ0FBQyxDQUFDOUksT0FBRixDQUFVc0wsS0FBeEMsRUFBOEN4QyxDQUFDLENBQUM5SSxPQUFGLENBQVVtSyxNQUF4RCxFQUErRGpQLENBQS9ELENBQXBILEdBQXNMLENBQUMsQ0FBRCxLQUFLNE4sQ0FBQyxDQUFDbUYsY0FBUCxJQUF1QixDQUFDLENBQUQsS0FBS25GLENBQUMsQ0FBQzlJLE9BQUYsQ0FBVWtMLEdBQWYsS0FBcUJwQyxDQUFDLENBQUN5RCxXQUFGLEdBQWMsQ0FBQ3pELENBQUMsQ0FBQ3lELFdBQXRDLEdBQW1EelAsQ0FBQyxDQUFDO0FBQUNrVSxRQUFBQSxTQUFTLEVBQUNsSSxDQUFDLENBQUN5RDtBQUFiLE9BQUQsQ0FBRCxDQUE2QnBFLE9BQTdCLENBQXFDO0FBQUM2SSxRQUFBQSxTQUFTLEVBQUMxVTtBQUFYLE9BQXJDLEVBQW1EO0FBQUMyVSxRQUFBQSxRQUFRLEVBQUNuSSxDQUFDLENBQUM5SSxPQUFGLENBQVVzTCxLQUFwQjtBQUEwQm5CLFFBQUFBLE1BQU0sRUFBQ3JCLENBQUMsQ0FBQzlJLE9BQUYsQ0FBVW1LLE1BQTNDO0FBQWtEL0QsUUFBQUEsSUFBSSxFQUFDLGNBQVN0SixDQUFULEVBQVc7QUFBQ0EsVUFBQUEsQ0FBQyxHQUFDb1UsSUFBSSxDQUFDQyxJQUFMLENBQVVyVSxDQUFWLENBQUYsRUFBZSxDQUFDLENBQUQsS0FBS2dNLENBQUMsQ0FBQzlJLE9BQUYsQ0FBVThMLFFBQWYsSUFBeUJqRCxDQUFDLENBQUNDLENBQUMsQ0FBQ2dGLFFBQUgsQ0FBRCxHQUFjLGVBQWFoUixDQUFiLEdBQWUsVUFBN0IsRUFBd0NnTSxDQUFDLENBQUNxRSxXQUFGLENBQWN4TyxHQUFkLENBQWtCa0ssQ0FBbEIsQ0FBakUsS0FBd0ZBLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDZ0YsUUFBSCxDQUFELEdBQWMsbUJBQWlCaFIsQ0FBakIsR0FBbUIsS0FBakMsRUFBdUNnTSxDQUFDLENBQUNxRSxXQUFGLENBQWN4TyxHQUFkLENBQWtCa0ssQ0FBbEIsQ0FBL0gsQ0FBZjtBQUFvSyxTQUF2TztBQUF3T3VJLFFBQUFBLFFBQVEsRUFBQyxvQkFBVTtBQUFDbFcsVUFBQUEsQ0FBQyxJQUFFQSxDQUFDLENBQUNtVyxJQUFGLEVBQUg7QUFBWTtBQUF4USxPQUFuRCxDQUExRSxLQUEwWXZJLENBQUMsQ0FBQ3dJLGVBQUYsSUFBb0JoVixDQUFDLEdBQUM0VSxJQUFJLENBQUNDLElBQUwsQ0FBVTdVLENBQVYsQ0FBdEIsRUFBbUMsQ0FBQyxDQUFELEtBQUt3TSxDQUFDLENBQUM5SSxPQUFGLENBQVU4TCxRQUFmLEdBQXdCakQsQ0FBQyxDQUFDQyxDQUFDLENBQUNnRixRQUFILENBQUQsR0FBYyxpQkFBZXhSLENBQWYsR0FBaUIsZUFBdkQsR0FBdUV1TSxDQUFDLENBQUNDLENBQUMsQ0FBQ2dGLFFBQUgsQ0FBRCxHQUFjLHFCQUFtQnhSLENBQW5CLEdBQXFCLFVBQTdJLEVBQXdKd00sQ0FBQyxDQUFDcUUsV0FBRixDQUFjeE8sR0FBZCxDQUFrQmtLLENBQWxCLENBQXhKLEVBQTZLM04sQ0FBQyxJQUFFeU0sVUFBVSxDQUFDLFlBQVU7QUFBQ21CLFFBQUFBLENBQUMsQ0FBQ3lJLGlCQUFGLElBQXNCclcsQ0FBQyxDQUFDbVcsSUFBRixFQUF0QjtBQUErQixPQUEzQyxFQUE0Q3ZJLENBQUMsQ0FBQzlJLE9BQUYsQ0FBVXNMLEtBQXRELENBQXBrQixDQUE1UDtBQUE4M0IsS0FBaitJLEVBQWsrSWhQLENBQUMsQ0FBQzJULFNBQUYsQ0FBWXVCLFlBQVosR0FBeUIsWUFBVTtBQUFDLFVBQUlsVixDQUFDLEdBQUMsSUFBTjtBQUFBLFVBQVdwQixDQUFDLEdBQUNvQixDQUFDLENBQUMwRCxPQUFGLENBQVVzSixRQUF2QjtBQUFnQyxhQUFPcE8sQ0FBQyxJQUFFLFNBQU9BLENBQVYsS0FBY0EsQ0FBQyxHQUFDNEIsQ0FBQyxDQUFDNUIsQ0FBRCxDQUFELENBQUtrTSxHQUFMLENBQVM5SyxDQUFDLENBQUNtUyxPQUFYLENBQWhCLEdBQXFDdlQsQ0FBNUM7QUFBOEMsS0FBcGxKLEVBQXFsSm9CLENBQUMsQ0FBQzJULFNBQUYsQ0FBWTNHLFFBQVosR0FBcUIsVUFBU2hOLENBQVQsRUFBVztBQUFDLFVBQUlwQixDQUFDLEdBQUMsS0FBS3NXLFlBQUwsRUFBTjtBQUEwQixlQUFPdFcsQ0FBUCxJQUFVLG9CQUFpQkEsQ0FBakIsQ0FBVixJQUE4QkEsQ0FBQyxDQUFDVSxJQUFGLENBQU8sWUFBVTtBQUFDLFlBQUlWLENBQUMsR0FBQzRCLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUTJVLEtBQVIsQ0FBYyxVQUFkLENBQU47QUFBZ0N2VyxRQUFBQSxDQUFDLENBQUMwUyxTQUFGLElBQWExUyxDQUFDLENBQUN3VyxZQUFGLENBQWVwVixDQUFmLEVBQWlCLENBQUMsQ0FBbEIsQ0FBYjtBQUFrQyxPQUFwRixDQUE5QjtBQUFvSCxLQUFwd0osRUFBcXdKQSxDQUFDLENBQUMyVCxTQUFGLENBQVlxQixlQUFaLEdBQTRCLFVBQVN4VSxDQUFULEVBQVc7QUFBQyxVQUFJUixDQUFDLEdBQUMsSUFBTjtBQUFBLFVBQVdwQixDQUFDLEdBQUMsRUFBYjtBQUFnQixPQUFDLENBQUQsS0FBS29CLENBQUMsQ0FBQzBELE9BQUYsQ0FBVXFLLElBQWYsR0FBb0JuUCxDQUFDLENBQUNvQixDQUFDLENBQUNzUyxjQUFILENBQUQsR0FBb0J0UyxDQUFDLENBQUNxUyxhQUFGLEdBQWdCLEdBQWhCLEdBQW9CclMsQ0FBQyxDQUFDMEQsT0FBRixDQUFVc0wsS0FBOUIsR0FBb0MsS0FBcEMsR0FBMENoUCxDQUFDLENBQUMwRCxPQUFGLENBQVU2SixPQUE1RixHQUFvRzNPLENBQUMsQ0FBQ29CLENBQUMsQ0FBQ3NTLGNBQUgsQ0FBRCxHQUFvQixhQUFXdFMsQ0FBQyxDQUFDMEQsT0FBRixDQUFVc0wsS0FBckIsR0FBMkIsS0FBM0IsR0FBaUNoUCxDQUFDLENBQUMwRCxPQUFGLENBQVU2SixPQUFuSyxFQUEySyxDQUFDLENBQUQsS0FBS3ZOLENBQUMsQ0FBQzBELE9BQUYsQ0FBVXFLLElBQWYsR0FBb0IvTixDQUFDLENBQUM2USxXQUFGLENBQWN4TyxHQUFkLENBQWtCekQsQ0FBbEIsQ0FBcEIsR0FBeUNvQixDQUFDLENBQUM4USxPQUFGLENBQVU5RixFQUFWLENBQWF4SyxDQUFiLEVBQWdCNkIsR0FBaEIsQ0FBb0J6RCxDQUFwQixDQUFwTjtBQUEyTyxLQUF4aUssRUFBeWlLb0IsQ0FBQyxDQUFDMlQsU0FBRixDQUFZZCxRQUFaLEdBQXFCLFlBQVU7QUFBQyxVQUFJclMsQ0FBQyxHQUFDLElBQU47QUFBV0EsTUFBQUEsQ0FBQyxDQUFDdVMsYUFBRixJQUFrQnZTLENBQUMsQ0FBQ21RLFVBQUYsR0FBYW5RLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVW9MLFlBQXZCLEtBQXNDdE8sQ0FBQyxDQUFDdVAsYUFBRixHQUFnQnNGLFdBQVcsQ0FBQzdVLENBQUMsQ0FBQ3dTLGdCQUFILEVBQW9CeFMsQ0FBQyxDQUFDa0QsT0FBRixDQUFVMEosYUFBOUIsQ0FBakUsQ0FBbEI7QUFBaUksS0FBcnRLLEVBQXN0S3BOLENBQUMsQ0FBQzJULFNBQUYsQ0FBWVosYUFBWixHQUEwQixZQUFVO0FBQUMsVUFBSXZTLENBQUMsR0FBQyxJQUFOO0FBQVdBLE1BQUFBLENBQUMsQ0FBQ3VQLGFBQUYsSUFBaUJ1RixhQUFhLENBQUM5VSxDQUFDLENBQUN1UCxhQUFILENBQTlCO0FBQWdELEtBQXR6SyxFQUF1eksvUCxDQUFDLENBQUMyVCxTQUFGLENBQVlYLGdCQUFaLEdBQTZCLFlBQVU7QUFBQyxVQUFJeFMsQ0FBQyxHQUFDLElBQU47QUFBQSxVQUFXUixDQUFDLEdBQUNRLENBQUMsQ0FBQzBQLFlBQUYsR0FBZTFQLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVXFMLGNBQXRDO0FBQXFEdk8sTUFBQUEsQ0FBQyxDQUFDdVIsTUFBRixJQUFVdlIsQ0FBQyxDQUFDcVIsV0FBWixJQUF5QnJSLENBQUMsQ0FBQ29SLFFBQTNCLEtBQXNDLENBQUMsQ0FBRCxLQUFLcFIsQ0FBQyxDQUFDa0QsT0FBRixDQUFVd0ssUUFBZixLQUEwQixNQUFJMU4sQ0FBQyxDQUFDMlAsU0FBTixJQUFpQjNQLENBQUMsQ0FBQzBQLFlBQUYsR0FBZSxDQUFmLEtBQW1CMVAsQ0FBQyxDQUFDbVEsVUFBRixHQUFhLENBQWpELEdBQW1EblEsQ0FBQyxDQUFDMlAsU0FBRixHQUFZLENBQS9ELEdBQWlFLE1BQUkzUCxDQUFDLENBQUMyUCxTQUFOLEtBQWtCblEsQ0FBQyxHQUFDUSxDQUFDLENBQUMwUCxZQUFGLEdBQWUxUCxDQUFDLENBQUNrRCxPQUFGLENBQVVxTCxjQUEzQixFQUEwQ3ZPLENBQUMsQ0FBQzBQLFlBQUYsR0FBZSxDQUFmLElBQWtCLENBQWxCLEtBQXNCMVAsQ0FBQyxDQUFDMlAsU0FBRixHQUFZLENBQWxDLENBQTVELENBQTNGLEdBQThMM1AsQ0FBQyxDQUFDNFUsWUFBRixDQUFlcFYsQ0FBZixDQUFwTztBQUF1UCxLQUEzb0wsRUFBNG9MQSxDQUFDLENBQUMyVCxTQUFGLENBQVk0QixXQUFaLEdBQXdCLFlBQVU7QUFBQyxVQUFJdlYsQ0FBQyxHQUFDLElBQU47QUFBVyxPQUFDLENBQUQsS0FBS0EsQ0FBQyxDQUFDMEQsT0FBRixDQUFVcUosTUFBZixLQUF3Qi9NLENBQUMsQ0FBQ3lRLFVBQUYsR0FBYWpRLENBQUMsQ0FBQ1IsQ0FBQyxDQUFDMEQsT0FBRixDQUFVdUosU0FBWCxDQUFELENBQXVCbFAsUUFBdkIsQ0FBZ0MsYUFBaEMsQ0FBYixFQUE0RGlDLENBQUMsQ0FBQ3dRLFVBQUYsR0FBYWhRLENBQUMsQ0FBQ1IsQ0FBQyxDQUFDMEQsT0FBRixDQUFVd0osU0FBWCxDQUFELENBQXVCblAsUUFBdkIsQ0FBZ0MsYUFBaEMsQ0FBekUsRUFBd0hpQyxDQUFDLENBQUMyUSxVQUFGLEdBQWEzUSxDQUFDLENBQUMwRCxPQUFGLENBQVVvTCxZQUF2QixJQUFxQzlPLENBQUMsQ0FBQ3lRLFVBQUYsQ0FBYXpTLFdBQWIsQ0FBeUIsY0FBekIsRUFBeUN3WCxVQUF6QyxDQUFvRCxzQkFBcEQsR0FBNEV4VixDQUFDLENBQUN3USxVQUFGLENBQWF4UyxXQUFiLENBQXlCLGNBQXpCLEVBQXlDd1gsVUFBekMsQ0FBb0Qsc0JBQXBELENBQTVFLEVBQXdKeFYsQ0FBQyxDQUFDeVQsUUFBRixDQUFXaFAsSUFBWCxDQUFnQnpFLENBQUMsQ0FBQzBELE9BQUYsQ0FBVXVKLFNBQTFCLEtBQXNDak4sQ0FBQyxDQUFDeVEsVUFBRixDQUFhMkQsU0FBYixDQUF1QnBVLENBQUMsQ0FBQzBELE9BQUYsQ0FBVW1KLFlBQWpDLENBQTlMLEVBQTZPN00sQ0FBQyxDQUFDeVQsUUFBRixDQUFXaFAsSUFBWCxDQUFnQnpFLENBQUMsQ0FBQzBELE9BQUYsQ0FBVXdKLFNBQTFCLEtBQXNDbE4sQ0FBQyxDQUFDd1EsVUFBRixDQUFheUQsUUFBYixDQUFzQmpVLENBQUMsQ0FBQzBELE9BQUYsQ0FBVW1KLFlBQWhDLENBQW5SLEVBQWlVLENBQUMsQ0FBRCxLQUFLN00sQ0FBQyxDQUFDMEQsT0FBRixDQUFVd0ssUUFBZixJQUF5QmxPLENBQUMsQ0FBQ3lRLFVBQUYsQ0FBYTFTLFFBQWIsQ0FBc0IsZ0JBQXRCLEVBQXdDYixJQUF4QyxDQUE2QyxlQUE3QyxFQUE2RCxNQUE3RCxDQUEvWCxJQUFxYzhDLENBQUMsQ0FBQ3lRLFVBQUYsQ0FBYWdGLEdBQWIsQ0FBaUJ6VixDQUFDLENBQUN3USxVQUFuQixFQUErQnpTLFFBQS9CLENBQXdDLGNBQXhDLEVBQXdEYixJQUF4RCxDQUE2RDtBQUFDLHlCQUFnQixNQUFqQjtBQUF3QjJXLFFBQUFBLFFBQVEsRUFBQztBQUFqQyxPQUE3RCxDQUFybEI7QUFBMnJCLEtBQXIzTSxFQUFzM003VCxDQUFDLENBQUMyVCxTQUFGLENBQVkrQixTQUFaLEdBQXNCLFlBQVU7QUFBQyxVQUFJMVYsQ0FBSjtBQUFBLFVBQU1wQixDQUFOO0FBQUEsVUFBUTJOLENBQUMsR0FBQyxJQUFWOztBQUFlLFVBQUcsQ0FBQyxDQUFELEtBQUtBLENBQUMsQ0FBQzdJLE9BQUYsQ0FBVWdLLElBQWxCLEVBQXVCO0FBQUMsYUFBSW5CLENBQUMsQ0FBQzRGLE9BQUYsQ0FBVXBVLFFBQVYsQ0FBbUIsY0FBbkIsR0FBbUNhLENBQUMsR0FBQzRCLENBQUMsQ0FBQyxRQUFELENBQUQsQ0FBWXpDLFFBQVosQ0FBcUJ3TyxDQUFDLENBQUM3SSxPQUFGLENBQVVpSyxTQUEvQixDQUFyQyxFQUErRTNOLENBQUMsR0FBQyxDQUFyRixFQUF1RkEsQ0FBQyxJQUFFdU0sQ0FBQyxDQUFDb0osV0FBRixFQUExRixFQUEwRzNWLENBQUMsSUFBRSxDQUE3RztBQUErR3BCLFVBQUFBLENBQUMsQ0FBQ3dMLE1BQUYsQ0FBUzVKLENBQUMsQ0FBQyxRQUFELENBQUQsQ0FBWTRKLE1BQVosQ0FBbUJtQyxDQUFDLENBQUM3SSxPQUFGLENBQVU4SixZQUFWLENBQXVCdUgsSUFBdkIsQ0FBNEIsSUFBNUIsRUFBaUN4SSxDQUFqQyxFQUFtQ3ZNLENBQW5DLENBQW5CLENBQVQ7QUFBL0c7O0FBQW1MdU0sUUFBQUEsQ0FBQyxDQUFDNkQsS0FBRixHQUFReFIsQ0FBQyxDQUFDcVYsUUFBRixDQUFXMUgsQ0FBQyxDQUFDN0ksT0FBRixDQUFVb0osVUFBckIsQ0FBUixFQUF5Q1AsQ0FBQyxDQUFDNkQsS0FBRixDQUFRblEsSUFBUixDQUFhLElBQWIsRUFBbUIyVixLQUFuQixHQUEyQjdYLFFBQTNCLENBQW9DLGNBQXBDLENBQXpDO0FBQTZGO0FBQUMsS0FBL3NOLEVBQWd0TmlDLENBQUMsQ0FBQzJULFNBQUYsQ0FBWWtDLFFBQVosR0FBcUIsWUFBVTtBQUFDLFVBQUk3VixDQUFDLEdBQUMsSUFBTjtBQUFXQSxNQUFBQSxDQUFDLENBQUM4USxPQUFGLEdBQVU5USxDQUFDLENBQUNtUyxPQUFGLENBQVVoSSxRQUFWLENBQW1CbkssQ0FBQyxDQUFDMEQsT0FBRixDQUFVdUcsS0FBVixHQUFnQixxQkFBbkMsRUFBMERsTSxRQUExRCxDQUFtRSxhQUFuRSxDQUFWLEVBQTRGaUMsQ0FBQyxDQUFDMlEsVUFBRixHQUFhM1EsQ0FBQyxDQUFDOFEsT0FBRixDQUFVbk8sTUFBbkgsRUFBMEgzQyxDQUFDLENBQUM4USxPQUFGLENBQVV4UixJQUFWLENBQWUsVUFBU1UsQ0FBVCxFQUFXcEIsQ0FBWCxFQUFhO0FBQUM0QixRQUFBQSxDQUFDLENBQUM1QixDQUFELENBQUQsQ0FBSzFCLElBQUwsQ0FBVSxrQkFBVixFQUE2QjhDLENBQTdCLEVBQWdDUCxJQUFoQyxDQUFxQyxpQkFBckMsRUFBdURlLENBQUMsQ0FBQzVCLENBQUQsQ0FBRCxDQUFLMUIsSUFBTCxDQUFVLE9BQVYsS0FBb0IsRUFBM0U7QUFBK0UsT0FBNUcsQ0FBMUgsRUFBd084QyxDQUFDLENBQUNtUyxPQUFGLENBQVVwVSxRQUFWLENBQW1CLGNBQW5CLENBQXhPLEVBQTJRaUMsQ0FBQyxDQUFDNlEsV0FBRixHQUFjLE1BQUk3USxDQUFDLENBQUMyUSxVQUFOLEdBQWlCblEsQ0FBQyxDQUFDLDRCQUFELENBQUQsQ0FBZ0N5VCxRQUFoQyxDQUF5Q2pVLENBQUMsQ0FBQ21TLE9BQTNDLENBQWpCLEdBQXFFblMsQ0FBQyxDQUFDOFEsT0FBRixDQUFVZ0YsT0FBVixDQUFrQiw0QkFBbEIsRUFBZ0RqVixNQUFoRCxFQUE5VixFQUF1WmIsQ0FBQyxDQUFDbVIsS0FBRixHQUFRblIsQ0FBQyxDQUFDNlEsV0FBRixDQUFjalEsSUFBZCxDQUFtQiwyQkFBbkIsRUFBZ0RDLE1BQWhELEVBQS9aLEVBQXdkYixDQUFDLENBQUM2USxXQUFGLENBQWN4TyxHQUFkLENBQWtCLFNBQWxCLEVBQTRCLENBQTVCLENBQXhkLEVBQXVmLENBQUMsQ0FBRCxLQUFLckMsQ0FBQyxDQUFDMEQsT0FBRixDQUFVMkosVUFBZixJQUEyQixDQUFDLENBQUQsS0FBS3JOLENBQUMsQ0FBQzBELE9BQUYsQ0FBVXdMLFlBQTFDLEtBQXlEbFAsQ0FBQyxDQUFDMEQsT0FBRixDQUFVcUwsY0FBVixHQUF5QixDQUFsRixDQUF2ZixFQUE0a0J2TyxDQUFDLENBQUMsZ0JBQUQsRUFBa0JSLENBQUMsQ0FBQ21TLE9BQXBCLENBQUQsQ0FBOEJySCxHQUE5QixDQUFrQyxPQUFsQyxFQUEyQy9NLFFBQTNDLENBQW9ELGVBQXBELENBQTVrQixFQUFpcEJpQyxDQUFDLENBQUMrVixhQUFGLEVBQWpwQixFQUFtcUIvVixDQUFDLENBQUN1VixXQUFGLEVBQW5xQixFQUFtckJ2VixDQUFDLENBQUMwVixTQUFGLEVBQW5yQixFQUFpc0IxVixDQUFDLENBQUNnVyxVQUFGLEVBQWpzQixFQUFndEJoVyxDQUFDLENBQUNpVyxlQUFGLENBQWtCLFlBQVUsT0FBT2pXLENBQUMsQ0FBQ2tRLFlBQW5CLEdBQWdDbFEsQ0FBQyxDQUFDa1EsWUFBbEMsR0FBK0MsQ0FBakUsQ0FBaHRCLEVBQW94QixDQUFDLENBQUQsS0FBS2xRLENBQUMsQ0FBQzBELE9BQUYsQ0FBVWtLLFNBQWYsSUFBMEI1TixDQUFDLENBQUNtUixLQUFGLENBQVFwVCxRQUFSLENBQWlCLFdBQWpCLENBQTl5QjtBQUE0MEIsS0FBdmtQLEVBQXdrUGlDLENBQUMsQ0FBQzJULFNBQUYsQ0FBWXVDLFNBQVosR0FBc0IsWUFBVTtBQUFDLFVBQUkxVixDQUFKO0FBQUEsVUFBTVIsQ0FBTjtBQUFBLFVBQVFwQixDQUFSO0FBQUEsVUFBVTJOLENBQVY7QUFBQSxVQUFZQyxDQUFaO0FBQUEsVUFBY0MsQ0FBZDtBQUFBLFVBQWdCMEosQ0FBaEI7QUFBQSxVQUFrQkMsQ0FBQyxHQUFDLElBQXBCOztBQUF5QixVQUFHN0osQ0FBQyxHQUFDdFEsUUFBUSxDQUFDb2Esc0JBQVQsRUFBRixFQUFvQzVKLENBQUMsR0FBQzJKLENBQUMsQ0FBQ2pFLE9BQUYsQ0FBVWhJLFFBQVYsRUFBdEMsRUFBMkRpTSxDQUFDLENBQUMxUyxPQUFGLENBQVVpTCxJQUFWLEdBQWUsQ0FBN0UsRUFBK0U7QUFBQyxhQUFJd0gsQ0FBQyxHQUFDQyxDQUFDLENBQUMxUyxPQUFGLENBQVVtTCxZQUFWLEdBQXVCdUgsQ0FBQyxDQUFDMVMsT0FBRixDQUFVaUwsSUFBbkMsRUFBd0NuQyxDQUFDLEdBQUNvSSxJQUFJLENBQUNDLElBQUwsQ0FBVXBJLENBQUMsQ0FBQzlKLE1BQUYsR0FBU3dULENBQW5CLENBQTFDLEVBQWdFM1YsQ0FBQyxHQUFDLENBQXRFLEVBQXdFQSxDQUFDLEdBQUNnTSxDQUExRSxFQUE0RWhNLENBQUMsRUFBN0UsRUFBZ0Y7QUFBQyxjQUFJOFYsQ0FBQyxHQUFDcmEsUUFBUSxDQUFDOEMsYUFBVCxDQUF1QixLQUF2QixDQUFOOztBQUFvQyxlQUFJaUIsQ0FBQyxHQUFDLENBQU4sRUFBUUEsQ0FBQyxHQUFDb1csQ0FBQyxDQUFDMVMsT0FBRixDQUFVaUwsSUFBcEIsRUFBeUIzTyxDQUFDLEVBQTFCLEVBQTZCO0FBQUMsZ0JBQUl1VyxDQUFDLEdBQUN0YSxRQUFRLENBQUM4QyxhQUFULENBQXVCLEtBQXZCLENBQU47O0FBQW9DLGlCQUFJSCxDQUFDLEdBQUMsQ0FBTixFQUFRQSxDQUFDLEdBQUN3WCxDQUFDLENBQUMxUyxPQUFGLENBQVVtTCxZQUFwQixFQUFpQ2pRLENBQUMsRUFBbEMsRUFBcUM7QUFBQyxrQkFBSTRYLENBQUMsR0FBQ2hXLENBQUMsR0FBQzJWLENBQUYsSUFBS25XLENBQUMsR0FBQ29XLENBQUMsQ0FBQzFTLE9BQUYsQ0FBVW1MLFlBQVosR0FBeUJqUSxDQUE5QixDQUFOO0FBQXVDNk4sY0FBQUEsQ0FBQyxDQUFDZ0ssR0FBRixDQUFNRCxDQUFOLEtBQVVELENBQUMsQ0FBQ0csV0FBRixDQUFjakssQ0FBQyxDQUFDZ0ssR0FBRixDQUFNRCxDQUFOLENBQWQsQ0FBVjtBQUFrQzs7QUFBQUYsWUFBQUEsQ0FBQyxDQUFDSSxXQUFGLENBQWNILENBQWQ7QUFBaUI7O0FBQUFoSyxVQUFBQSxDQUFDLENBQUNtSyxXQUFGLENBQWNKLENBQWQ7QUFBaUI7O0FBQUFGLFFBQUFBLENBQUMsQ0FBQ2pFLE9BQUYsQ0FBVXdFLEtBQVYsR0FBa0J2TSxNQUFsQixDQUF5Qm1DLENBQXpCLEdBQTRCNkosQ0FBQyxDQUFDakUsT0FBRixDQUFVaEksUUFBVixHQUFxQkEsUUFBckIsR0FBZ0NBLFFBQWhDLEdBQTJDOUgsR0FBM0MsQ0FBK0M7QUFBQ04sVUFBQUEsS0FBSyxFQUFDLE1BQUlxVSxDQUFDLENBQUMxUyxPQUFGLENBQVVtTCxZQUFkLEdBQTJCLEdBQWxDO0FBQXNDK0gsVUFBQUEsT0FBTyxFQUFDO0FBQTlDLFNBQS9DLENBQTVCO0FBQTBJO0FBQUMsS0FBcnFRLEVBQXNxUTVXLENBQUMsQ0FBQzJULFNBQUYsQ0FBWWtELGVBQVosR0FBNEIsVUFBUzdXLENBQVQsRUFBV3BCLENBQVgsRUFBYTtBQUFDLFVBQUkyTixDQUFKO0FBQUEsVUFBTUMsQ0FBTjtBQUFBLFVBQVFDLENBQVI7QUFBQSxVQUFVMEosQ0FBQyxHQUFDLElBQVo7QUFBQSxVQUFpQkMsQ0FBQyxHQUFDLENBQUMsQ0FBcEI7QUFBQSxVQUFzQkUsQ0FBQyxHQUFDSCxDQUFDLENBQUNoRSxPQUFGLENBQVVwUSxLQUFWLEVBQXhCO0FBQUEsVUFBMEN3VSxDQUFDLEdBQUNsWixNQUFNLENBQUN5WixVQUFQLElBQW1CdFcsQ0FBQyxDQUFDbkQsTUFBRCxDQUFELENBQVUwRSxLQUFWLEVBQS9EOztBQUFpRixVQUFHLGFBQVdvVSxDQUFDLENBQUMxSCxTQUFiLEdBQXVCaEMsQ0FBQyxHQUFDOEosQ0FBekIsR0FBMkIsYUFBV0osQ0FBQyxDQUFDMUgsU0FBYixHQUF1QmhDLENBQUMsR0FBQzZKLENBQXpCLEdBQTJCLFVBQVFILENBQUMsQ0FBQzFILFNBQVYsS0FBc0JoQyxDQUFDLEdBQUNtSSxJQUFJLENBQUM3UCxHQUFMLENBQVN3UixDQUFULEVBQVdELENBQVgsQ0FBeEIsQ0FBdEQsRUFBNkZILENBQUMsQ0FBQ3pTLE9BQUYsQ0FBVWdMLFVBQVYsSUFBc0J5SCxDQUFDLENBQUN6UyxPQUFGLENBQVVnTCxVQUFWLENBQXFCL0wsTUFBM0MsSUFBbUQsU0FBT3dULENBQUMsQ0FBQ3pTLE9BQUYsQ0FBVWdMLFVBQXBLLEVBQStLO0FBQUNsQyxRQUFBQSxDQUFDLEdBQUMsSUFBRjs7QUFBTyxhQUFJRCxDQUFKLElBQVM0SixDQUFDLENBQUNoWixXQUFYO0FBQXVCZ1osVUFBQUEsQ0FBQyxDQUFDaFosV0FBRixDQUFjNFosY0FBZCxDQUE2QnhLLENBQTdCLE1BQWtDLENBQUMsQ0FBRCxLQUFLNEosQ0FBQyxDQUFDekQsZ0JBQUYsQ0FBbUJyRSxXQUF4QixHQUFvQzVCLENBQUMsR0FBQzBKLENBQUMsQ0FBQ2haLFdBQUYsQ0FBY29QLENBQWQsQ0FBRixLQUFxQkMsQ0FBQyxHQUFDMkosQ0FBQyxDQUFDaFosV0FBRixDQUFjb1AsQ0FBZCxDQUF2QixDQUFwQyxHQUE2RUUsQ0FBQyxHQUFDMEosQ0FBQyxDQUFDaFosV0FBRixDQUFjb1AsQ0FBZCxDQUFGLEtBQXFCQyxDQUFDLEdBQUMySixDQUFDLENBQUNoWixXQUFGLENBQWNvUCxDQUFkLENBQXZCLENBQS9HO0FBQXZCOztBQUFnTCxpQkFBT0MsQ0FBUCxHQUFTLFNBQU8ySixDQUFDLENBQUM1RSxnQkFBVCxHQUEwQixDQUFDL0UsQ0FBQyxLQUFHMkosQ0FBQyxDQUFDNUUsZ0JBQU4sSUFBd0IzUyxDQUF6QixNQUE4QnVYLENBQUMsQ0FBQzVFLGdCQUFGLEdBQW1CL0UsQ0FBbkIsRUFBcUIsY0FBWTJKLENBQUMsQ0FBQ3pFLGtCQUFGLENBQXFCbEYsQ0FBckIsQ0FBWixHQUFvQzJKLENBQUMsQ0FBQ2EsT0FBRixDQUFVeEssQ0FBVixDQUFwQyxJQUFrRDJKLENBQUMsQ0FBQ3pTLE9BQUYsR0FBVWxELENBQUMsQ0FBQzNDLE1BQUYsQ0FBUyxFQUFULEVBQVlzWSxDQUFDLENBQUN6RCxnQkFBZCxFQUErQnlELENBQUMsQ0FBQ3pFLGtCQUFGLENBQXFCbEYsQ0FBckIsQ0FBL0IsQ0FBVixFQUFrRSxDQUFDLENBQUQsS0FBS3hNLENBQUwsS0FBU21XLENBQUMsQ0FBQ2pHLFlBQUYsR0FBZWlHLENBQUMsQ0FBQ3pTLE9BQUYsQ0FBVXlLLFlBQWxDLENBQWxFLEVBQWtIZ0ksQ0FBQyxDQUFDYyxPQUFGLENBQVVqWCxDQUFWLENBQXBLLENBQXJCLEVBQXVNb1csQ0FBQyxHQUFDNUosQ0FBdk8sQ0FBMUIsSUFBcVEySixDQUFDLENBQUM1RSxnQkFBRixHQUFtQi9FLENBQW5CLEVBQXFCLGNBQVkySixDQUFDLENBQUN6RSxrQkFBRixDQUFxQmxGLENBQXJCLENBQVosR0FBb0MySixDQUFDLENBQUNhLE9BQUYsQ0FBVXhLLENBQVYsQ0FBcEMsSUFBa0QySixDQUFDLENBQUN6UyxPQUFGLEdBQVVsRCxDQUFDLENBQUMzQyxNQUFGLENBQVMsRUFBVCxFQUFZc1ksQ0FBQyxDQUFDekQsZ0JBQWQsRUFBK0J5RCxDQUFDLENBQUN6RSxrQkFBRixDQUFxQmxGLENBQXJCLENBQS9CLENBQVYsRUFBa0UsQ0FBQyxDQUFELEtBQUt4TSxDQUFMLEtBQVNtVyxDQUFDLENBQUNqRyxZQUFGLEdBQWVpRyxDQUFDLENBQUN6UyxPQUFGLENBQVV5SyxZQUFsQyxDQUFsRSxFQUFrSGdJLENBQUMsQ0FBQ2MsT0FBRixDQUFValgsQ0FBVixDQUFwSyxDQUFyQixFQUF1TW9XLENBQUMsR0FBQzVKLENBQTljLENBQVQsR0FBMGQsU0FBTzJKLENBQUMsQ0FBQzVFLGdCQUFULEtBQTRCNEUsQ0FBQyxDQUFDNUUsZ0JBQUYsR0FBbUIsSUFBbkIsRUFBd0I0RSxDQUFDLENBQUN6UyxPQUFGLEdBQVV5UyxDQUFDLENBQUN6RCxnQkFBcEMsRUFBcUQsQ0FBQyxDQUFELEtBQUsxUyxDQUFMLEtBQVNtVyxDQUFDLENBQUNqRyxZQUFGLEdBQWVpRyxDQUFDLENBQUN6UyxPQUFGLENBQVV5SyxZQUFsQyxDQUFyRCxFQUFxR2dJLENBQUMsQ0FBQ2MsT0FBRixDQUFValgsQ0FBVixDQUFyRyxFQUFrSG9XLENBQUMsR0FBQzVKLENBQWhKLENBQTFkLEVBQTZtQnhNLENBQUMsSUFBRSxDQUFDLENBQUQsS0FBS29XLENBQVIsSUFBV0QsQ0FBQyxDQUFDaEUsT0FBRixDQUFVeE8sT0FBVixDQUFrQixZQUFsQixFQUErQixDQUFDd1MsQ0FBRCxFQUFHQyxDQUFILENBQS9CLENBQXhuQjtBQUE4cEI7QUFBQyxLQUF2eVMsRUFBd3lTcFcsQ0FBQyxDQUFDMlQsU0FBRixDQUFZVixXQUFaLEdBQXdCLFVBQVNqVCxDQUFULEVBQVdwQixDQUFYLEVBQWE7QUFBQyxVQUFJMk4sQ0FBSjtBQUFBLFVBQU1DLENBQU47QUFBQSxVQUFRQyxDQUFSO0FBQUEsVUFBVTBKLENBQUMsR0FBQyxJQUFaO0FBQUEsVUFBaUJDLENBQUMsR0FBQzVWLENBQUMsQ0FBQ1IsQ0FBQyxDQUFDa1gsYUFBSCxDQUFwQjs7QUFBc0MsY0FBT2QsQ0FBQyxDQUFDdE4sRUFBRixDQUFLLEdBQUwsS0FBVzlJLENBQUMsQ0FBQ3FJLGNBQUYsRUFBWCxFQUE4QitOLENBQUMsQ0FBQ3ROLEVBQUYsQ0FBSyxJQUFMLE1BQWFzTixDQUFDLEdBQUNBLENBQUMsQ0FBQzlSLE9BQUYsQ0FBVSxJQUFWLENBQWYsQ0FBOUIsRUFBOERtSSxDQUFDLEdBQUMwSixDQUFDLENBQUN4RixVQUFGLEdBQWF3RixDQUFDLENBQUN6UyxPQUFGLENBQVVxTCxjQUF2QixJQUF1QyxDQUF2RyxFQUF5R3hDLENBQUMsR0FBQ0UsQ0FBQyxHQUFDLENBQUQsR0FBRyxDQUFDMEosQ0FBQyxDQUFDeEYsVUFBRixHQUFhd0YsQ0FBQyxDQUFDakcsWUFBaEIsSUFBOEJpRyxDQUFDLENBQUN6UyxPQUFGLENBQVVxTCxjQUF2SixFQUFzSy9PLENBQUMsQ0FBQ1AsSUFBRixDQUFPMFgsT0FBcEw7QUFBNkwsYUFBSSxVQUFKO0FBQWUzSyxVQUFBQSxDQUFDLEdBQUMsTUFBSUQsQ0FBSixHQUFNNEosQ0FBQyxDQUFDelMsT0FBRixDQUFVcUwsY0FBaEIsR0FBK0JvSCxDQUFDLENBQUN6UyxPQUFGLENBQVVvTCxZQUFWLEdBQXVCdkMsQ0FBeEQsRUFBMEQ0SixDQUFDLENBQUN4RixVQUFGLEdBQWF3RixDQUFDLENBQUN6UyxPQUFGLENBQVVvTCxZQUF2QixJQUFxQ3FILENBQUMsQ0FBQ2YsWUFBRixDQUFlZSxDQUFDLENBQUNqRyxZQUFGLEdBQWUxRCxDQUE5QixFQUFnQyxDQUFDLENBQWpDLEVBQW1DNU4sQ0FBbkMsQ0FBL0Y7QUFBcUk7O0FBQU0sYUFBSSxNQUFKO0FBQVc0TixVQUFBQSxDQUFDLEdBQUMsTUFBSUQsQ0FBSixHQUFNNEosQ0FBQyxDQUFDelMsT0FBRixDQUFVcUwsY0FBaEIsR0FBK0J4QyxDQUFqQyxFQUFtQzRKLENBQUMsQ0FBQ3hGLFVBQUYsR0FBYXdGLENBQUMsQ0FBQ3pTLE9BQUYsQ0FBVW9MLFlBQXZCLElBQXFDcUgsQ0FBQyxDQUFDZixZQUFGLENBQWVlLENBQUMsQ0FBQ2pHLFlBQUYsR0FBZTFELENBQTlCLEVBQWdDLENBQUMsQ0FBakMsRUFBbUM1TixDQUFuQyxDQUF4RTtBQUE4Rzs7QUFBTSxhQUFJLE9BQUo7QUFBWSxjQUFJMFgsQ0FBQyxHQUFDLE1BQUl0VyxDQUFDLENBQUNQLElBQUYsQ0FBTzBELEtBQVgsR0FBaUIsQ0FBakIsR0FBbUJuRCxDQUFDLENBQUNQLElBQUYsQ0FBTzBELEtBQVAsSUFBY2lULENBQUMsQ0FBQ2pULEtBQUYsS0FBVWdULENBQUMsQ0FBQ3pTLE9BQUYsQ0FBVXFMLGNBQTNEO0FBQTBFb0gsVUFBQUEsQ0FBQyxDQUFDZixZQUFGLENBQWVlLENBQUMsQ0FBQ2lCLGNBQUYsQ0FBaUJkLENBQWpCLENBQWYsRUFBbUMsQ0FBQyxDQUFwQyxFQUFzQzFYLENBQXRDLEdBQXlDd1gsQ0FBQyxDQUFDak0sUUFBRixHQUFheEcsT0FBYixDQUFxQixPQUFyQixDQUF6QztBQUF1RTs7QUFBTTtBQUFRO0FBQWpvQjtBQUF5b0IsS0FBNy9ULEVBQTgvVDNELENBQUMsQ0FBQzJULFNBQUYsQ0FBWXlELGNBQVosR0FBMkIsVUFBUzVXLENBQVQsRUFBVztBQUFDLFVBQUlSLENBQUosRUFBTXBCLENBQU47QUFBUSxVQUFHb0IsQ0FBQyxHQUFDLEtBQUtxWCxtQkFBTCxFQUFGLEVBQTZCelksQ0FBQyxHQUFDLENBQS9CLEVBQWlDNEIsQ0FBQyxHQUFDUixDQUFDLENBQUNBLENBQUMsQ0FBQzJDLE1BQUYsR0FBUyxDQUFWLENBQXZDLEVBQW9EbkMsQ0FBQyxHQUFDUixDQUFDLENBQUNBLENBQUMsQ0FBQzJDLE1BQUYsR0FBUyxDQUFWLENBQUgsQ0FBcEQsS0FBeUUsS0FBSSxJQUFJNEosQ0FBUixJQUFhdk0sQ0FBYixFQUFlO0FBQUMsWUFBR1EsQ0FBQyxHQUFDUixDQUFDLENBQUN1TSxDQUFELENBQU4sRUFBVTtBQUFDL0wsVUFBQUEsQ0FBQyxHQUFDNUIsQ0FBRjtBQUFJO0FBQU07O0FBQUFBLFFBQUFBLENBQUMsR0FBQ29CLENBQUMsQ0FBQ3VNLENBQUQsQ0FBSDtBQUFPO0FBQUEsYUFBTy9MLENBQVA7QUFBUyxLQUEzcVUsRUFBNHFVUixDQUFDLENBQUMyVCxTQUFGLENBQVkyRCxhQUFaLEdBQTBCLFlBQVU7QUFBQyxVQUFJdFgsQ0FBQyxHQUFDLElBQU47QUFBV0EsTUFBQUEsQ0FBQyxDQUFDMEQsT0FBRixDQUFVZ0ssSUFBVixJQUFnQixTQUFPMU4sQ0FBQyxDQUFDb1EsS0FBekIsS0FBaUM1UCxDQUFDLENBQUMsSUFBRCxFQUFNUixDQUFDLENBQUNvUSxLQUFSLENBQUQsQ0FBZ0JtSCxHQUFoQixDQUFvQixhQUFwQixFQUFrQ3ZYLENBQUMsQ0FBQ2lULFdBQXBDLEVBQWlEc0UsR0FBakQsQ0FBcUQsa0JBQXJELEVBQXdFL1csQ0FBQyxDQUFDc1MsS0FBRixDQUFROVMsQ0FBQyxDQUFDd1gsU0FBVixFQUFvQnhYLENBQXBCLEVBQXNCLENBQUMsQ0FBdkIsQ0FBeEUsRUFBbUd1WCxHQUFuRyxDQUF1RyxrQkFBdkcsRUFBMEgvVyxDQUFDLENBQUNzUyxLQUFGLENBQVE5UyxDQUFDLENBQUN3WCxTQUFWLEVBQW9CeFgsQ0FBcEIsRUFBc0IsQ0FBQyxDQUF2QixDQUExSCxHQUFxSixDQUFDLENBQUQsS0FBS0EsQ0FBQyxDQUFDMEQsT0FBRixDQUFVaUosYUFBZixJQUE4QjNNLENBQUMsQ0FBQ29RLEtBQUYsQ0FBUW1ILEdBQVIsQ0FBWSxlQUFaLEVBQTRCdlgsQ0FBQyxDQUFDdVQsVUFBOUIsQ0FBcE4sR0FBK1B2VCxDQUFDLENBQUNtUyxPQUFGLENBQVVvRixHQUFWLENBQWMsd0JBQWQsQ0FBL1AsRUFBdVMsQ0FBQyxDQUFELEtBQUt2WCxDQUFDLENBQUMwRCxPQUFGLENBQVVxSixNQUFmLElBQXVCL00sQ0FBQyxDQUFDMlEsVUFBRixHQUFhM1EsQ0FBQyxDQUFDMEQsT0FBRixDQUFVb0wsWUFBOUMsS0FBNkQ5TyxDQUFDLENBQUN5USxVQUFGLElBQWN6USxDQUFDLENBQUN5USxVQUFGLENBQWE4RyxHQUFiLENBQWlCLGFBQWpCLEVBQStCdlgsQ0FBQyxDQUFDaVQsV0FBakMsQ0FBZCxFQUE0RGpULENBQUMsQ0FBQ3dRLFVBQUYsSUFBY3hRLENBQUMsQ0FBQ3dRLFVBQUYsQ0FBYStHLEdBQWIsQ0FBaUIsYUFBakIsRUFBK0J2WCxDQUFDLENBQUNpVCxXQUFqQyxDQUExRSxFQUF3SCxDQUFDLENBQUQsS0FBS2pULENBQUMsQ0FBQzBELE9BQUYsQ0FBVWlKLGFBQWYsS0FBK0IzTSxDQUFDLENBQUN5USxVQUFGLElBQWN6USxDQUFDLENBQUN5USxVQUFGLENBQWE4RyxHQUFiLENBQWlCLGVBQWpCLEVBQWlDdlgsQ0FBQyxDQUFDdVQsVUFBbkMsQ0FBZCxFQUE2RHZULENBQUMsQ0FBQ3dRLFVBQUYsSUFBY3hRLENBQUMsQ0FBQ3dRLFVBQUYsQ0FBYStHLEdBQWIsQ0FBaUIsZUFBakIsRUFBaUN2WCxDQUFDLENBQUN1VCxVQUFuQyxDQUExRyxDQUFyTCxDQUF2UyxFQUF1bkJ2VCxDQUFDLENBQUNtUixLQUFGLENBQVFvRyxHQUFSLENBQVksa0NBQVosRUFBK0N2WCxDQUFDLENBQUNxVCxZQUFqRCxDQUF2bkIsRUFBc3JCclQsQ0FBQyxDQUFDbVIsS0FBRixDQUFRb0csR0FBUixDQUFZLGlDQUFaLEVBQThDdlgsQ0FBQyxDQUFDcVQsWUFBaEQsQ0FBdHJCLEVBQW92QnJULENBQUMsQ0FBQ21SLEtBQUYsQ0FBUW9HLEdBQVIsQ0FBWSw4QkFBWixFQUEyQ3ZYLENBQUMsQ0FBQ3FULFlBQTdDLENBQXB2QixFQUEreUJyVCxDQUFDLENBQUNtUixLQUFGLENBQVFvRyxHQUFSLENBQVksb0NBQVosRUFBaUR2WCxDQUFDLENBQUNxVCxZQUFuRCxDQUEveUIsRUFBZzNCclQsQ0FBQyxDQUFDbVIsS0FBRixDQUFRb0csR0FBUixDQUFZLGFBQVosRUFBMEJ2WCxDQUFDLENBQUNrVCxZQUE1QixDQUFoM0IsRUFBMDVCMVMsQ0FBQyxDQUFDdkUsUUFBRCxDQUFELENBQVlzYixHQUFaLENBQWdCdlgsQ0FBQyxDQUFDdVMsZ0JBQWxCLEVBQW1DdlMsQ0FBQyxDQUFDeVgsVUFBckMsQ0FBMTVCLEVBQTI4QnpYLENBQUMsQ0FBQzBYLGtCQUFGLEVBQTM4QixFQUFrK0IsQ0FBQyxDQUFELEtBQUsxWCxDQUFDLENBQUMwRCxPQUFGLENBQVVpSixhQUFmLElBQThCM00sQ0FBQyxDQUFDbVIsS0FBRixDQUFRb0csR0FBUixDQUFZLGVBQVosRUFBNEJ2WCxDQUFDLENBQUN1VCxVQUE5QixDQUFoZ0MsRUFBMGlDLENBQUMsQ0FBRCxLQUFLdlQsQ0FBQyxDQUFDMEQsT0FBRixDQUFVc0ssYUFBZixJQUE4QnhOLENBQUMsQ0FBQ1IsQ0FBQyxDQUFDNlEsV0FBSCxDQUFELENBQWlCMUcsUUFBakIsR0FBNEJvTixHQUE1QixDQUFnQyxhQUFoQyxFQUE4Q3ZYLENBQUMsQ0FBQ21ULGFBQWhELENBQXhrQyxFQUF1b0MzUyxDQUFDLENBQUNuRCxNQUFELENBQUQsQ0FBVWthLEdBQVYsQ0FBYyxtQ0FBaUN2WCxDQUFDLENBQUN3VCxXQUFqRCxFQUE2RHhULENBQUMsQ0FBQzJYLGlCQUEvRCxDQUF2b0MsRUFBeXRDblgsQ0FBQyxDQUFDbkQsTUFBRCxDQUFELENBQVVrYSxHQUFWLENBQWMsd0JBQXNCdlgsQ0FBQyxDQUFDd1QsV0FBdEMsRUFBa0R4VCxDQUFDLENBQUM0WCxNQUFwRCxDQUF6dEMsRUFBcXhDcFgsQ0FBQyxDQUFDLG1CQUFELEVBQXFCUixDQUFDLENBQUM2USxXQUF2QixDQUFELENBQXFDMEcsR0FBckMsQ0FBeUMsV0FBekMsRUFBcUR2WCxDQUFDLENBQUNxSSxjQUF2RCxDQUFyeEMsRUFBNDFDN0gsQ0FBQyxDQUFDbkQsTUFBRCxDQUFELENBQVVrYSxHQUFWLENBQWMsc0JBQW9CdlgsQ0FBQyxDQUFDd1QsV0FBcEMsRUFBZ0R4VCxDQUFDLENBQUNvVCxXQUFsRCxDQUE1MUM7QUFBMjVDLEtBQXZuWCxFQUF3blhwVCxDQUFDLENBQUMyVCxTQUFGLENBQVkrRCxrQkFBWixHQUErQixZQUFVO0FBQUMsVUFBSTFYLENBQUMsR0FBQyxJQUFOO0FBQVdBLE1BQUFBLENBQUMsQ0FBQ21SLEtBQUYsQ0FBUW9HLEdBQVIsQ0FBWSxrQkFBWixFQUErQi9XLENBQUMsQ0FBQ3NTLEtBQUYsQ0FBUTlTLENBQUMsQ0FBQ3dYLFNBQVYsRUFBb0J4WCxDQUFwQixFQUFzQixDQUFDLENBQXZCLENBQS9CLEdBQTBEQSxDQUFDLENBQUNtUixLQUFGLENBQVFvRyxHQUFSLENBQVksa0JBQVosRUFBK0IvVyxDQUFDLENBQUNzUyxLQUFGLENBQVE5UyxDQUFDLENBQUN3WCxTQUFWLEVBQW9CeFgsQ0FBcEIsRUFBc0IsQ0FBQyxDQUF2QixDQUEvQixDQUExRDtBQUFvSCxLQUFqeVgsRUFBa3lYQSxDQUFDLENBQUMyVCxTQUFGLENBQVlrRSxXQUFaLEdBQXdCLFlBQVU7QUFBQyxVQUFJclgsQ0FBSjtBQUFBLFVBQU1SLENBQUMsR0FBQyxJQUFSO0FBQWFBLE1BQUFBLENBQUMsQ0FBQzBELE9BQUYsQ0FBVWlMLElBQVYsR0FBZSxDQUFmLEtBQW1CLENBQUNuTyxDQUFDLEdBQUNSLENBQUMsQ0FBQzhRLE9BQUYsQ0FBVTNHLFFBQVYsR0FBcUJBLFFBQXJCLEVBQUgsRUFBb0NxTCxVQUFwQyxDQUErQyxPQUEvQyxHQUF3RHhWLENBQUMsQ0FBQ21TLE9BQUYsQ0FBVXdFLEtBQVYsR0FBa0J2TSxNQUFsQixDQUF5QjVKLENBQXpCLENBQTNFO0FBQXdHLEtBQTE3WCxFQUEyN1hSLENBQUMsQ0FBQzJULFNBQUYsQ0FBWVQsWUFBWixHQUF5QixVQUFTMVMsQ0FBVCxFQUFXO0FBQUMsT0FBQyxDQUFELEtBQUssS0FBSzBSLFdBQVYsS0FBd0IxUixDQUFDLENBQUNzWCx3QkFBRixJQUE2QnRYLENBQUMsQ0FBQ2lMLGVBQUYsRUFBN0IsRUFBaURqTCxDQUFDLENBQUM2SCxjQUFGLEVBQXpFO0FBQTZGLEtBQTdqWSxFQUE4allySSxDQUFDLENBQUMyVCxTQUFGLENBQVlvRSxPQUFaLEdBQW9CLFVBQVMvWCxDQUFULEVBQVc7QUFBQyxVQUFJcEIsQ0FBQyxHQUFDLElBQU47QUFBV0EsTUFBQUEsQ0FBQyxDQUFDbVUsYUFBRixJQUFrQm5VLENBQUMsQ0FBQ3dTLFdBQUYsR0FBYyxFQUFoQyxFQUFtQ3hTLENBQUMsQ0FBQzBZLGFBQUYsRUFBbkMsRUFBcUQ5VyxDQUFDLENBQUMsZUFBRCxFQUFpQjVCLENBQUMsQ0FBQ3VULE9BQW5CLENBQUQsQ0FBNkJrQyxNQUE3QixFQUFyRCxFQUEyRnpWLENBQUMsQ0FBQ3dSLEtBQUYsSUFBU3hSLENBQUMsQ0FBQ3dSLEtBQUYsQ0FBUTNOLE1BQVIsRUFBcEcsRUFBcUg3RCxDQUFDLENBQUM2UixVQUFGLElBQWM3UixDQUFDLENBQUM2UixVQUFGLENBQWE5TixNQUEzQixLQUFvQy9ELENBQUMsQ0FBQzZSLFVBQUYsQ0FBYXpTLFdBQWIsQ0FBeUIseUNBQXpCLEVBQW9Fd1gsVUFBcEUsQ0FBK0Usb0NBQS9FLEVBQXFIblQsR0FBckgsQ0FBeUgsU0FBekgsRUFBbUksRUFBbkksR0FBdUl6RCxDQUFDLENBQUM2VSxRQUFGLENBQVdoUCxJQUFYLENBQWdCN0YsQ0FBQyxDQUFDOEUsT0FBRixDQUFVdUosU0FBMUIsS0FBc0NyTyxDQUFDLENBQUM2UixVQUFGLENBQWFoTyxNQUFiLEVBQWpOLENBQXJILEVBQTZWN0QsQ0FBQyxDQUFDNFIsVUFBRixJQUFjNVIsQ0FBQyxDQUFDNFIsVUFBRixDQUFhN04sTUFBM0IsS0FBb0MvRCxDQUFDLENBQUM0UixVQUFGLENBQWF4UyxXQUFiLENBQXlCLHlDQUF6QixFQUFvRXdYLFVBQXBFLENBQStFLG9DQUEvRSxFQUFxSG5ULEdBQXJILENBQXlILFNBQXpILEVBQW1JLEVBQW5JLEdBQXVJekQsQ0FBQyxDQUFDNlUsUUFBRixDQUFXaFAsSUFBWCxDQUFnQjdGLENBQUMsQ0FBQzhFLE9BQUYsQ0FBVXdKLFNBQTFCLEtBQXNDdE8sQ0FBQyxDQUFDNFIsVUFBRixDQUFhL04sTUFBYixFQUFqTixDQUE3VixFQUFxa0I3RCxDQUFDLENBQUNrUyxPQUFGLEtBQVlsUyxDQUFDLENBQUNrUyxPQUFGLENBQVU5UyxXQUFWLENBQXNCLG1FQUF0QixFQUEyRndYLFVBQTNGLENBQXNHLGFBQXRHLEVBQXFIQSxVQUFySCxDQUFnSSxrQkFBaEksRUFBb0psVyxJQUFwSixDQUF5SixZQUFVO0FBQUNrQixRQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVF0RCxJQUFSLENBQWEsT0FBYixFQUFxQnNELENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUWYsSUFBUixDQUFhLGlCQUFiLENBQXJCO0FBQXNELE9BQTFOLEdBQTROYixDQUFDLENBQUNpUyxXQUFGLENBQWMxRyxRQUFkLENBQXVCLEtBQUt6RyxPQUFMLENBQWF1RyxLQUFwQyxFQUEyQ29LLE1BQTNDLEVBQTVOLEVBQWdSelYsQ0FBQyxDQUFDaVMsV0FBRixDQUFjd0QsTUFBZCxFQUFoUixFQUF1U3pWLENBQUMsQ0FBQ3VTLEtBQUYsQ0FBUWtELE1BQVIsRUFBdlMsRUFBd1R6VixDQUFDLENBQUN1VCxPQUFGLENBQVUvSCxNQUFWLENBQWlCeEwsQ0FBQyxDQUFDa1MsT0FBbkIsQ0FBcFUsQ0FBcmtCLEVBQXM2QmxTLENBQUMsQ0FBQ2laLFdBQUYsRUFBdDZCLEVBQXM3QmpaLENBQUMsQ0FBQ3VULE9BQUYsQ0FBVW5VLFdBQVYsQ0FBc0IsY0FBdEIsQ0FBdDdCLEVBQTQ5QlksQ0FBQyxDQUFDdVQsT0FBRixDQUFVblUsV0FBVixDQUFzQixtQkFBdEIsQ0FBNTlCLEVBQXVnQ1ksQ0FBQyxDQUFDdVQsT0FBRixDQUFVblUsV0FBVixDQUFzQixjQUF0QixDQUF2Z0MsRUFBNmlDWSxDQUFDLENBQUMwUyxTQUFGLEdBQVksQ0FBQyxDQUExakMsRUFBNGpDdFIsQ0FBQyxJQUFFcEIsQ0FBQyxDQUFDdVQsT0FBRixDQUFVeE8sT0FBVixDQUFrQixTQUFsQixFQUE0QixDQUFDL0UsQ0FBRCxDQUE1QixDQUEvakM7QUFBZ21DLEtBQXpzYSxFQUEwc2FvQixDQUFDLENBQUMyVCxTQUFGLENBQVlzQixpQkFBWixHQUE4QixVQUFTelUsQ0FBVCxFQUFXO0FBQUMsVUFBSVIsQ0FBQyxHQUFDLElBQU47QUFBQSxVQUFXcEIsQ0FBQyxHQUFDLEVBQWI7QUFBZ0JBLE1BQUFBLENBQUMsQ0FBQ29CLENBQUMsQ0FBQ3NTLGNBQUgsQ0FBRCxHQUFvQixFQUFwQixFQUF1QixDQUFDLENBQUQsS0FBS3RTLENBQUMsQ0FBQzBELE9BQUYsQ0FBVXFLLElBQWYsR0FBb0IvTixDQUFDLENBQUM2USxXQUFGLENBQWN4TyxHQUFkLENBQWtCekQsQ0FBbEIsQ0FBcEIsR0FBeUNvQixDQUFDLENBQUM4USxPQUFGLENBQVU5RixFQUFWLENBQWF4SyxDQUFiLEVBQWdCNkIsR0FBaEIsQ0FBb0J6RCxDQUFwQixDQUFoRTtBQUF1RixLQUEzMWEsRUFBNDFhb0IsQ0FBQyxDQUFDMlQsU0FBRixDQUFZcUUsU0FBWixHQUFzQixVQUFTeFgsQ0FBVCxFQUFXUixDQUFYLEVBQWE7QUFBQyxVQUFJcEIsQ0FBQyxHQUFDLElBQU47QUFBVyxPQUFDLENBQUQsS0FBS0EsQ0FBQyxDQUFDK1MsY0FBUCxJQUF1Qi9TLENBQUMsQ0FBQ2tTLE9BQUYsQ0FBVTlGLEVBQVYsQ0FBYXhLLENBQWIsRUFBZ0I2QixHQUFoQixDQUFvQjtBQUFDc04sUUFBQUEsTUFBTSxFQUFDL1EsQ0FBQyxDQUFDOEUsT0FBRixDQUFVaU07QUFBbEIsT0FBcEIsR0FBK0MvUSxDQUFDLENBQUNrUyxPQUFGLENBQVU5RixFQUFWLENBQWF4SyxDQUFiLEVBQWdCcUwsT0FBaEIsQ0FBd0I7QUFBQ29NLFFBQUFBLE9BQU8sRUFBQztBQUFULE9BQXhCLEVBQW9DclosQ0FBQyxDQUFDOEUsT0FBRixDQUFVc0wsS0FBOUMsRUFBb0RwUSxDQUFDLENBQUM4RSxPQUFGLENBQVVtSyxNQUE5RCxFQUFxRTdOLENBQXJFLENBQXRFLEtBQWdKcEIsQ0FBQyxDQUFDb1csZUFBRixDQUFrQnhVLENBQWxCLEdBQXFCNUIsQ0FBQyxDQUFDa1MsT0FBRixDQUFVOUYsRUFBVixDQUFheEssQ0FBYixFQUFnQjZCLEdBQWhCLENBQW9CO0FBQUM0VixRQUFBQSxPQUFPLEVBQUMsQ0FBVDtBQUFXdEksUUFBQUEsTUFBTSxFQUFDL1EsQ0FBQyxDQUFDOEUsT0FBRixDQUFVaU07QUFBNUIsT0FBcEIsQ0FBckIsRUFBOEUzUCxDQUFDLElBQUVxTCxVQUFVLENBQUMsWUFBVTtBQUFDek0sUUFBQUEsQ0FBQyxDQUFDcVcsaUJBQUYsQ0FBb0J6VSxDQUFwQixHQUF1QlIsQ0FBQyxDQUFDK1UsSUFBRixFQUF2QjtBQUFnQyxPQUE1QyxFQUE2Q25XLENBQUMsQ0FBQzhFLE9BQUYsQ0FBVXNMLEtBQXZELENBQTNPO0FBQTBTLEtBQXJyYixFQUFzcmJoUCxDQUFDLENBQUMyVCxTQUFGLENBQVl1RSxZQUFaLEdBQXlCLFVBQVMxWCxDQUFULEVBQVc7QUFBQyxVQUFJUixDQUFDLEdBQUMsSUFBTjtBQUFXLE9BQUMsQ0FBRCxLQUFLQSxDQUFDLENBQUMyUixjQUFQLEdBQXNCM1IsQ0FBQyxDQUFDOFEsT0FBRixDQUFVOUYsRUFBVixDQUFheEssQ0FBYixFQUFnQnFMLE9BQWhCLENBQXdCO0FBQUNvTSxRQUFBQSxPQUFPLEVBQUMsQ0FBVDtBQUFXdEksUUFBQUEsTUFBTSxFQUFDM1AsQ0FBQyxDQUFDMEQsT0FBRixDQUFVaU0sTUFBVixHQUFpQjtBQUFuQyxPQUF4QixFQUE4RDNQLENBQUMsQ0FBQzBELE9BQUYsQ0FBVXNMLEtBQXhFLEVBQThFaFAsQ0FBQyxDQUFDMEQsT0FBRixDQUFVbUssTUFBeEYsQ0FBdEIsSUFBdUg3TixDQUFDLENBQUNnVixlQUFGLENBQWtCeFUsQ0FBbEIsR0FBcUJSLENBQUMsQ0FBQzhRLE9BQUYsQ0FBVTlGLEVBQVYsQ0FBYXhLLENBQWIsRUFBZ0I2QixHQUFoQixDQUFvQjtBQUFDNFYsUUFBQUEsT0FBTyxFQUFDLENBQVQ7QUFBV3RJLFFBQUFBLE1BQU0sRUFBQzNQLENBQUMsQ0FBQzBELE9BQUYsQ0FBVWlNLE1BQVYsR0FBaUI7QUFBbkMsT0FBcEIsQ0FBNUk7QUFBd00sS0FBOTZiLEVBQSs2YjNQLENBQUMsQ0FBQzJULFNBQUYsQ0FBWXdFLFlBQVosR0FBeUJuWSxDQUFDLENBQUMyVCxTQUFGLENBQVl5RSxXQUFaLEdBQXdCLFVBQVM1WCxDQUFULEVBQVc7QUFBQyxVQUFJUixDQUFDLEdBQUMsSUFBTjtBQUFXLGVBQU9RLENBQVAsS0FBV1IsQ0FBQyxDQUFDb1MsWUFBRixHQUFlcFMsQ0FBQyxDQUFDOFEsT0FBakIsRUFBeUI5USxDQUFDLENBQUNnVSxNQUFGLEVBQXpCLEVBQW9DaFUsQ0FBQyxDQUFDNlEsV0FBRixDQUFjMUcsUUFBZCxDQUF1QixLQUFLekcsT0FBTCxDQUFhdUcsS0FBcEMsRUFBMkNvSyxNQUEzQyxFQUFwQyxFQUF3RnJVLENBQUMsQ0FBQ29TLFlBQUYsQ0FBZWlHLE1BQWYsQ0FBc0I3WCxDQUF0QixFQUF5QnlULFFBQXpCLENBQWtDalUsQ0FBQyxDQUFDNlEsV0FBcEMsQ0FBeEYsRUFBeUk3USxDQUFDLENBQUNzVSxNQUFGLEVBQXBKO0FBQWdLLEtBQXZwYyxFQUF3cGN0VSxDQUFDLENBQUMyVCxTQUFGLENBQVkyRSxZQUFaLEdBQXlCLFlBQVU7QUFBQyxVQUFJdFksQ0FBQyxHQUFDLElBQU47QUFBV0EsTUFBQUEsQ0FBQyxDQUFDbVMsT0FBRixDQUFVb0YsR0FBVixDQUFjLHdCQUFkLEVBQXdDeFgsRUFBeEMsQ0FBMkMsd0JBQTNDLEVBQW9FLEdBQXBFLEVBQXdFLFVBQVNuQixDQUFULEVBQVc7QUFBQ0EsUUFBQUEsQ0FBQyxDQUFDa1osd0JBQUY7QUFBNkIsWUFBSXZMLENBQUMsR0FBQy9MLENBQUMsQ0FBQyxJQUFELENBQVA7QUFBYzZLLFFBQUFBLFVBQVUsQ0FBQyxZQUFVO0FBQUNyTCxVQUFBQSxDQUFDLENBQUMwRCxPQUFGLENBQVU2SyxZQUFWLEtBQXlCdk8sQ0FBQyxDQUFDNFIsUUFBRixHQUFXckYsQ0FBQyxDQUFDekQsRUFBRixDQUFLLFFBQUwsQ0FBWCxFQUEwQjlJLENBQUMsQ0FBQzZTLFFBQUYsRUFBbkQ7QUFBaUUsU0FBN0UsRUFBOEUsQ0FBOUUsQ0FBVjtBQUEyRixPQUExTjtBQUE0TixLQUFuNmMsRUFBbzZjN1MsQ0FBQyxDQUFDMlQsU0FBRixDQUFZNEUsVUFBWixHQUF1QnZZLENBQUMsQ0FBQzJULFNBQUYsQ0FBWTZFLGlCQUFaLEdBQThCLFlBQVU7QUFBQyxhQUFPLEtBQUt0SSxZQUFaO0FBQXlCLEtBQTcvYyxFQUE4L2NsUSxDQUFDLENBQUMyVCxTQUFGLENBQVlnQyxXQUFaLEdBQXdCLFlBQVU7QUFBQyxVQUFJblYsQ0FBQyxHQUFDLElBQU47QUFBQSxVQUFXUixDQUFDLEdBQUMsQ0FBYjtBQUFBLFVBQWVwQixDQUFDLEdBQUMsQ0FBakI7QUFBQSxVQUFtQjJOLENBQUMsR0FBQyxDQUFyQjtBQUF1QixVQUFHLENBQUMsQ0FBRCxLQUFLL0wsQ0FBQyxDQUFDa0QsT0FBRixDQUFVd0ssUUFBbEI7QUFBMkIsWUFBRzFOLENBQUMsQ0FBQ21RLFVBQUYsSUFBY25RLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVW9MLFlBQTNCLEVBQXdDLEVBQUV2QyxDQUFGLENBQXhDLEtBQWlELE9BQUt2TSxDQUFDLEdBQUNRLENBQUMsQ0FBQ21RLFVBQVQ7QUFBcUIsWUFBRXBFLENBQUYsRUFBSXZNLENBQUMsR0FBQ3BCLENBQUMsR0FBQzRCLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVXFMLGNBQWxCLEVBQWlDblEsQ0FBQyxJQUFFNEIsQ0FBQyxDQUFDa0QsT0FBRixDQUFVcUwsY0FBVixJQUEwQnZPLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVW9MLFlBQXBDLEdBQWlEdE8sQ0FBQyxDQUFDa0QsT0FBRixDQUFVcUwsY0FBM0QsR0FBMEV2TyxDQUFDLENBQUNrRCxPQUFGLENBQVVvTCxZQUF4SDtBQUFyQjtBQUE1RSxhQUEyTyxJQUFHLENBQUMsQ0FBRCxLQUFLdE8sQ0FBQyxDQUFDa0QsT0FBRixDQUFVMkosVUFBbEIsRUFBNkJkLENBQUMsR0FBQy9MLENBQUMsQ0FBQ21RLFVBQUosQ0FBN0IsS0FBaUQsSUFBR25RLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVXNKLFFBQWIsRUFBc0IsT0FBS2hOLENBQUMsR0FBQ1EsQ0FBQyxDQUFDbVEsVUFBVDtBQUFxQixVQUFFcEUsQ0FBRixFQUFJdk0sQ0FBQyxHQUFDcEIsQ0FBQyxHQUFDNEIsQ0FBQyxDQUFDa0QsT0FBRixDQUFVcUwsY0FBbEIsRUFBaUNuUSxDQUFDLElBQUU0QixDQUFDLENBQUNrRCxPQUFGLENBQVVxTCxjQUFWLElBQTBCdk8sQ0FBQyxDQUFDa0QsT0FBRixDQUFVb0wsWUFBcEMsR0FBaUR0TyxDQUFDLENBQUNrRCxPQUFGLENBQVVxTCxjQUEzRCxHQUEwRXZPLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVW9MLFlBQXhIO0FBQXJCLE9BQXRCLE1BQXFMdkMsQ0FBQyxHQUFDLElBQUVxSSxJQUFJLENBQUNDLElBQUwsQ0FBVSxDQUFDclUsQ0FBQyxDQUFDbVEsVUFBRixHQUFhblEsQ0FBQyxDQUFDa0QsT0FBRixDQUFVb0wsWUFBeEIsSUFBc0N0TyxDQUFDLENBQUNrRCxPQUFGLENBQVVxTCxjQUExRCxDQUFKO0FBQThFLGFBQU94QyxDQUFDLEdBQUMsQ0FBVDtBQUFXLEtBQWxtZSxFQUFtbWV2TSxDQUFDLENBQUMyVCxTQUFGLENBQVk4RSxPQUFaLEdBQW9CLFVBQVNqWSxDQUFULEVBQVc7QUFBQyxVQUFJUixDQUFKO0FBQUEsVUFBTXBCLENBQU47QUFBQSxVQUFRMk4sQ0FBUjtBQUFBLFVBQVVDLENBQVY7QUFBQSxVQUFZQyxDQUFDLEdBQUMsSUFBZDtBQUFBLFVBQW1CMEosQ0FBQyxHQUFDLENBQXJCO0FBQXVCLGFBQU8xSixDQUFDLENBQUN1RSxXQUFGLEdBQWMsQ0FBZCxFQUFnQnBTLENBQUMsR0FBQzZOLENBQUMsQ0FBQ3FFLE9BQUYsQ0FBVThFLEtBQVYsR0FBa0JwQixXQUFsQixDQUE4QixDQUFDLENBQS9CLENBQWxCLEVBQW9ELENBQUMsQ0FBRCxLQUFLL0gsQ0FBQyxDQUFDL0ksT0FBRixDQUFVd0ssUUFBZixJQUF5QnpCLENBQUMsQ0FBQ2tFLFVBQUYsR0FBYWxFLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVW9MLFlBQXZCLEtBQXNDckMsQ0FBQyxDQUFDdUUsV0FBRixHQUFjdkUsQ0FBQyxDQUFDbUUsVUFBRixHQUFhbkUsQ0FBQyxDQUFDL0ksT0FBRixDQUFVb0wsWUFBdkIsR0FBb0MsQ0FBQyxDQUFuRCxFQUFxRHRDLENBQUMsR0FBQyxDQUFDLENBQXhELEVBQTBELENBQUMsQ0FBRCxLQUFLQyxDQUFDLENBQUMvSSxPQUFGLENBQVU4TCxRQUFmLElBQXlCLENBQUMsQ0FBRCxLQUFLL0MsQ0FBQyxDQUFDL0ksT0FBRixDQUFVMkosVUFBeEMsS0FBcUQsTUFBSVosQ0FBQyxDQUFDL0ksT0FBRixDQUFVb0wsWUFBZCxHQUEyQnRDLENBQUMsR0FBQyxDQUFDLEdBQTlCLEdBQWtDLE1BQUlDLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVW9MLFlBQWQsS0FBNkJ0QyxDQUFDLEdBQUMsQ0FBQyxDQUFoQyxDQUF2RixDQUExRCxFQUFxTDJKLENBQUMsR0FBQ3ZYLENBQUMsR0FBQzZOLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVW9MLFlBQVosR0FBeUJ0QyxDQUF0UCxHQUF5UEMsQ0FBQyxDQUFDa0UsVUFBRixHQUFhbEUsQ0FBQyxDQUFDL0ksT0FBRixDQUFVcUwsY0FBdkIsSUFBdUMsQ0FBdkMsSUFBMEN2TyxDQUFDLEdBQUNpTSxDQUFDLENBQUMvSSxPQUFGLENBQVVxTCxjQUFaLEdBQTJCdEMsQ0FBQyxDQUFDa0UsVUFBdkUsSUFBbUZsRSxDQUFDLENBQUNrRSxVQUFGLEdBQWFsRSxDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUExRyxLQUF5SHRPLENBQUMsR0FBQ2lNLENBQUMsQ0FBQ2tFLFVBQUosSUFBZ0JsRSxDQUFDLENBQUN1RSxXQUFGLEdBQWMsQ0FBQ3ZFLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVW9MLFlBQVYsSUFBd0J0TyxDQUFDLEdBQUNpTSxDQUFDLENBQUNrRSxVQUE1QixDQUFELElBQTBDbEUsQ0FBQyxDQUFDbUUsVUFBNUMsR0FBdUQsQ0FBQyxDQUF0RSxFQUF3RXVGLENBQUMsR0FBQyxDQUFDMUosQ0FBQyxDQUFDL0ksT0FBRixDQUFVb0wsWUFBVixJQUF3QnRPLENBQUMsR0FBQ2lNLENBQUMsQ0FBQ2tFLFVBQTVCLENBQUQsSUFBMEMvUixDQUExQyxHQUE0QyxDQUFDLENBQXZJLEtBQTJJNk4sQ0FBQyxDQUFDdUUsV0FBRixHQUFjdkUsQ0FBQyxDQUFDa0UsVUFBRixHQUFhbEUsQ0FBQyxDQUFDL0ksT0FBRixDQUFVcUwsY0FBdkIsR0FBc0N0QyxDQUFDLENBQUNtRSxVQUF4QyxHQUFtRCxDQUFDLENBQWxFLEVBQW9FdUYsQ0FBQyxHQUFDMUosQ0FBQyxDQUFDa0UsVUFBRixHQUFhbEUsQ0FBQyxDQUFDL0ksT0FBRixDQUFVcUwsY0FBdkIsR0FBc0NuUSxDQUF0QyxHQUF3QyxDQUFDLENBQTFQLENBQXpILENBQWxSLElBQTBvQjRCLENBQUMsR0FBQ2lNLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVW9MLFlBQVosR0FBeUJyQyxDQUFDLENBQUNrRSxVQUEzQixLQUF3Q2xFLENBQUMsQ0FBQ3VFLFdBQUYsR0FBYyxDQUFDeFEsQ0FBQyxHQUFDaU0sQ0FBQyxDQUFDL0ksT0FBRixDQUFVb0wsWUFBWixHQUF5QnJDLENBQUMsQ0FBQ2tFLFVBQTVCLElBQXdDbEUsQ0FBQyxDQUFDbUUsVUFBeEQsRUFBbUV1RixDQUFDLEdBQUMsQ0FBQzNWLENBQUMsR0FBQ2lNLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVW9MLFlBQVosR0FBeUJyQyxDQUFDLENBQUNrRSxVQUE1QixJQUF3Qy9SLENBQXJKLENBQTlyQixFQUFzMUI2TixDQUFDLENBQUNrRSxVQUFGLElBQWNsRSxDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUF4QixLQUF1Q3JDLENBQUMsQ0FBQ3VFLFdBQUYsR0FBYyxDQUFkLEVBQWdCbUYsQ0FBQyxHQUFDLENBQXpELENBQXQxQixFQUFrNUIsQ0FBQyxDQUFELEtBQUsxSixDQUFDLENBQUMvSSxPQUFGLENBQVUySixVQUFmLElBQTJCWixDQUFDLENBQUNrRSxVQUFGLElBQWNsRSxDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUFuRCxHQUFnRXJDLENBQUMsQ0FBQ3VFLFdBQUYsR0FBY3ZFLENBQUMsQ0FBQ21FLFVBQUYsR0FBYWdFLElBQUksQ0FBQzhELEtBQUwsQ0FBV2pNLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVW9MLFlBQXJCLENBQWIsR0FBZ0QsQ0FBaEQsR0FBa0RyQyxDQUFDLENBQUNtRSxVQUFGLEdBQWFuRSxDQUFDLENBQUNrRSxVQUFmLEdBQTBCLENBQTFKLEdBQTRKLENBQUMsQ0FBRCxLQUFLbEUsQ0FBQyxDQUFDL0ksT0FBRixDQUFVMkosVUFBZixJQUEyQixDQUFDLENBQUQsS0FBS1osQ0FBQyxDQUFDL0ksT0FBRixDQUFVd0ssUUFBMUMsR0FBbUR6QixDQUFDLENBQUN1RSxXQUFGLElBQWV2RSxDQUFDLENBQUNtRSxVQUFGLEdBQWFnRSxJQUFJLENBQUM4RCxLQUFMLENBQVdqTSxDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUFWLEdBQXVCLENBQWxDLENBQWIsR0FBa0RyQyxDQUFDLENBQUNtRSxVQUF0SCxHQUFpSSxDQUFDLENBQUQsS0FBS25FLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVTJKLFVBQWYsS0FBNEJaLENBQUMsQ0FBQ3VFLFdBQUYsR0FBYyxDQUFkLEVBQWdCdkUsQ0FBQyxDQUFDdUUsV0FBRixJQUFldkUsQ0FBQyxDQUFDbUUsVUFBRixHQUFhZ0UsSUFBSSxDQUFDOEQsS0FBTCxDQUFXak0sQ0FBQyxDQUFDL0ksT0FBRixDQUFVb0wsWUFBVixHQUF1QixDQUFsQyxDQUF4RSxDQUEvcUMsRUFBNnhDOU8sQ0FBQyxHQUFDLENBQUMsQ0FBRCxLQUFLeU0sQ0FBQyxDQUFDL0ksT0FBRixDQUFVOEwsUUFBZixHQUF3QmhQLENBQUMsR0FBQ2lNLENBQUMsQ0FBQ21FLFVBQUosR0FBZSxDQUFDLENBQWhCLEdBQWtCbkUsQ0FBQyxDQUFDdUUsV0FBNUMsR0FBd0R4USxDQUFDLEdBQUM1QixDQUFGLEdBQUksQ0FBQyxDQUFMLEdBQU91WCxDQUE5MUMsRUFBZzJDLENBQUMsQ0FBRCxLQUFLMUosQ0FBQyxDQUFDL0ksT0FBRixDQUFVNkwsYUFBZixLQUErQmhELENBQUMsR0FBQ0UsQ0FBQyxDQUFDa0UsVUFBRixJQUFjbEUsQ0FBQyxDQUFDL0ksT0FBRixDQUFVb0wsWUFBeEIsSUFBc0MsQ0FBQyxDQUFELEtBQUtyQyxDQUFDLENBQUMvSSxPQUFGLENBQVV3SyxRQUFyRCxHQUE4RHpCLENBQUMsQ0FBQ29FLFdBQUYsQ0FBYzFHLFFBQWQsQ0FBdUIsY0FBdkIsRUFBdUNhLEVBQXZDLENBQTBDeEssQ0FBMUMsQ0FBOUQsR0FBMkdpTSxDQUFDLENBQUNvRSxXQUFGLENBQWMxRyxRQUFkLENBQXVCLGNBQXZCLEVBQXVDYSxFQUF2QyxDQUEwQ3hLLENBQUMsR0FBQ2lNLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVW9MLFlBQXRELENBQTdHLEVBQWlMOU8sQ0FBQyxHQUFDLENBQUMsQ0FBRCxLQUFLeU0sQ0FBQyxDQUFDL0ksT0FBRixDQUFVa0wsR0FBZixHQUFtQnJDLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBSyxDQUFDLENBQUQsSUFBSUUsQ0FBQyxDQUFDb0UsV0FBRixDQUFjOU8sS0FBZCxLQUFzQndLLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBS29NLFVBQTNCLEdBQXNDcE0sQ0FBQyxDQUFDeEssS0FBRixFQUExQyxDQUFMLEdBQTBELENBQTdFLEdBQStFd0ssQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFLLENBQUMsQ0FBRCxHQUFHQSxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUtvTSxVQUFiLEdBQXdCLENBQTFSLEVBQTRSLENBQUMsQ0FBRCxLQUFLbE0sQ0FBQyxDQUFDL0ksT0FBRixDQUFVMkosVUFBZixLQUE0QmQsQ0FBQyxHQUFDRSxDQUFDLENBQUNrRSxVQUFGLElBQWNsRSxDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUF4QixJQUFzQyxDQUFDLENBQUQsS0FBS3JDLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVXdLLFFBQXJELEdBQThEekIsQ0FBQyxDQUFDb0UsV0FBRixDQUFjMUcsUUFBZCxDQUF1QixjQUF2QixFQUF1Q2EsRUFBdkMsQ0FBMEN4SyxDQUExQyxDQUE5RCxHQUEyR2lNLENBQUMsQ0FBQ29FLFdBQUYsQ0FBYzFHLFFBQWQsQ0FBdUIsY0FBdkIsRUFBdUNhLEVBQXZDLENBQTBDeEssQ0FBQyxHQUFDaU0sQ0FBQyxDQUFDL0ksT0FBRixDQUFVb0wsWUFBWixHQUF5QixDQUFuRSxDQUE3RyxFQUFtTDlPLENBQUMsR0FBQyxDQUFDLENBQUQsS0FBS3lNLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVWtMLEdBQWYsR0FBbUJyQyxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQUssQ0FBQyxDQUFELElBQUlFLENBQUMsQ0FBQ29FLFdBQUYsQ0FBYzlPLEtBQWQsS0FBc0J3SyxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUtvTSxVQUEzQixHQUFzQ3BNLENBQUMsQ0FBQ3hLLEtBQUYsRUFBMUMsQ0FBTCxHQUEwRCxDQUE3RSxHQUErRXdLLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBSyxDQUFDLENBQUQsR0FBR0EsQ0FBQyxDQUFDLENBQUQsQ0FBRCxDQUFLb00sVUFBYixHQUF3QixDQUE1UixFQUE4UjNZLENBQUMsSUFBRSxDQUFDeU0sQ0FBQyxDQUFDMEUsS0FBRixDQUFRcFAsS0FBUixLQUFnQndLLENBQUMsQ0FBQ3FNLFVBQUYsRUFBakIsSUFBaUMsQ0FBOVYsQ0FBM1QsQ0FBaDJDLEVBQTYvRDVZLENBQXBnRTtBQUFzZ0UsS0FBaHFpQixFQUFpcWlCQSxDQUFDLENBQUMyVCxTQUFGLENBQVlrRixTQUFaLEdBQXNCN1ksQ0FBQyxDQUFDMlQsU0FBRixDQUFZbUYsY0FBWixHQUEyQixVQUFTdFksQ0FBVCxFQUFXO0FBQUMsYUFBTyxLQUFLa0QsT0FBTCxDQUFhbEQsQ0FBYixDQUFQO0FBQXVCLEtBQXJ2aUIsRUFBc3ZpQlIsQ0FBQyxDQUFDMlQsU0FBRixDQUFZMEQsbUJBQVosR0FBZ0MsWUFBVTtBQUFDLFVBQUk3VyxDQUFKO0FBQUEsVUFBTVIsQ0FBQyxHQUFDLElBQVI7QUFBQSxVQUFhcEIsQ0FBQyxHQUFDLENBQWY7QUFBQSxVQUFpQjJOLENBQUMsR0FBQyxDQUFuQjtBQUFBLFVBQXFCQyxDQUFDLEdBQUMsRUFBdkI7O0FBQTBCLFdBQUksQ0FBQyxDQUFELEtBQUt4TSxDQUFDLENBQUMwRCxPQUFGLENBQVV3SyxRQUFmLEdBQXdCMU4sQ0FBQyxHQUFDUixDQUFDLENBQUMyUSxVQUE1QixJQUF3Qy9SLENBQUMsR0FBQyxDQUFDLENBQUQsR0FBR29CLENBQUMsQ0FBQzBELE9BQUYsQ0FBVXFMLGNBQWYsRUFBOEJ4QyxDQUFDLEdBQUMsQ0FBQyxDQUFELEdBQUd2TSxDQUFDLENBQUMwRCxPQUFGLENBQVVxTCxjQUE3QyxFQUE0RHZPLENBQUMsR0FBQyxJQUFFUixDQUFDLENBQUMyUSxVQUExRyxDQUFKLEVBQTBIL1IsQ0FBQyxHQUFDNEIsQ0FBNUg7QUFBK0hnTSxRQUFBQSxDQUFDLENBQUN1TSxJQUFGLENBQU9uYSxDQUFQLEdBQVVBLENBQUMsR0FBQzJOLENBQUMsR0FBQ3ZNLENBQUMsQ0FBQzBELE9BQUYsQ0FBVXFMLGNBQXhCLEVBQXVDeEMsQ0FBQyxJQUFFdk0sQ0FBQyxDQUFDMEQsT0FBRixDQUFVcUwsY0FBVixJQUEwQi9PLENBQUMsQ0FBQzBELE9BQUYsQ0FBVW9MLFlBQXBDLEdBQWlEOU8sQ0FBQyxDQUFDMEQsT0FBRixDQUFVcUwsY0FBM0QsR0FBMEUvTyxDQUFDLENBQUMwRCxPQUFGLENBQVVvTCxZQUE5SDtBQUEvSDs7QUFBMFEsYUFBT3RDLENBQVA7QUFBUyxLQUE5a2pCLEVBQStrakJ4TSxDQUFDLENBQUMyVCxTQUFGLENBQVlxRixRQUFaLEdBQXFCLFlBQVU7QUFBQyxhQUFPLElBQVA7QUFBWSxLQUEzbmpCLEVBQTRuakJoWixDQUFDLENBQUMyVCxTQUFGLENBQVlzRixhQUFaLEdBQTBCLFlBQVU7QUFBQyxVQUFJalosQ0FBSjtBQUFBLFVBQU1wQixDQUFOO0FBQUEsVUFBUTJOLENBQUMsR0FBQyxJQUFWO0FBQWUsYUFBTzNOLENBQUMsR0FBQyxDQUFDLENBQUQsS0FBSzJOLENBQUMsQ0FBQzdJLE9BQUYsQ0FBVTJKLFVBQWYsR0FBMEJkLENBQUMsQ0FBQ3FFLFVBQUYsR0FBYWdFLElBQUksQ0FBQzhELEtBQUwsQ0FBV25NLENBQUMsQ0FBQzdJLE9BQUYsQ0FBVW9MLFlBQVYsR0FBdUIsQ0FBbEMsQ0FBdkMsR0FBNEUsQ0FBOUUsRUFBZ0YsQ0FBQyxDQUFELEtBQUt2QyxDQUFDLENBQUM3SSxPQUFGLENBQVV3TCxZQUFmLElBQTZCM0MsQ0FBQyxDQUFDc0UsV0FBRixDQUFjNVEsSUFBZCxDQUFtQixjQUFuQixFQUFtQ1gsSUFBbkMsQ0FBd0MsVUFBU2tOLENBQVQsRUFBV0MsQ0FBWCxFQUFhO0FBQUMsWUFBR0EsQ0FBQyxDQUFDa00sVUFBRixHQUFhL1osQ0FBYixHQUFlNEIsQ0FBQyxDQUFDaU0sQ0FBRCxDQUFELENBQUttTSxVQUFMLEtBQWtCLENBQWpDLEdBQW1DLENBQUMsQ0FBRCxHQUFHck0sQ0FBQyxDQUFDMEUsU0FBM0MsRUFBcUQsT0FBT2pSLENBQUMsR0FBQ3lNLENBQUYsRUFBSSxDQUFDLENBQVo7QUFBYyxPQUF6SCxHQUEySG1JLElBQUksQ0FBQ3NFLEdBQUwsQ0FBUzFZLENBQUMsQ0FBQ1IsQ0FBRCxDQUFELENBQUs5QyxJQUFMLENBQVUsa0JBQVYsSUFBOEJxUCxDQUFDLENBQUMyRCxZQUF6QyxLQUF3RCxDQUFoTixJQUFtTjNELENBQUMsQ0FBQzdJLE9BQUYsQ0FBVXFMLGNBQXBUO0FBQW1VLEtBQW4vakIsRUFBby9qQi9PLENBQUMsQ0FBQzJULFNBQUYsQ0FBWXdGLElBQVosR0FBaUJuWixDQUFDLENBQUMyVCxTQUFGLENBQVl5RixTQUFaLEdBQXNCLFVBQVM1WSxDQUFULEVBQVdSLENBQVgsRUFBYTtBQUFDLFdBQUtpVCxXQUFMLENBQWlCO0FBQUN4VCxRQUFBQSxJQUFJLEVBQUM7QUFBQzBYLFVBQUFBLE9BQU8sRUFBQyxPQUFUO0FBQWlCaFUsVUFBQUEsS0FBSyxFQUFDa1csUUFBUSxDQUFDN1ksQ0FBRDtBQUEvQjtBQUFOLE9BQWpCLEVBQTREUixDQUE1RDtBQUErRCxLQUF4bWtCLEVBQXlta0JBLENBQUMsQ0FBQzJULFNBQUYsQ0FBWXZVLElBQVosR0FBaUIsVUFBU1ksQ0FBVCxFQUFXO0FBQUMsVUFBSXBCLENBQUMsR0FBQyxJQUFOO0FBQVc0QixNQUFBQSxDQUFDLENBQUM1QixDQUFDLENBQUN1VCxPQUFILENBQUQsQ0FBYTVTLFFBQWIsQ0FBc0IsbUJBQXRCLE1BQTZDaUIsQ0FBQyxDQUFDNUIsQ0FBQyxDQUFDdVQsT0FBSCxDQUFELENBQWFwVSxRQUFiLENBQXNCLG1CQUF0QixHQUEyQ2EsQ0FBQyxDQUFDc1gsU0FBRixFQUEzQyxFQUF5RHRYLENBQUMsQ0FBQ2lYLFFBQUYsRUFBekQsRUFBc0VqWCxDQUFDLENBQUMwYSxRQUFGLEVBQXRFLEVBQW1GMWEsQ0FBQyxDQUFDMmEsU0FBRixFQUFuRixFQUFpRzNhLENBQUMsQ0FBQzRhLFVBQUYsRUFBakcsRUFBZ0g1YSxDQUFDLENBQUM2YSxnQkFBRixFQUFoSCxFQUFxSTdhLENBQUMsQ0FBQzhhLFlBQUYsRUFBckksRUFBc0o5YSxDQUFDLENBQUNvWCxVQUFGLEVBQXRKLEVBQXFLcFgsQ0FBQyxDQUFDaVksZUFBRixDQUFrQixDQUFDLENBQW5CLENBQXJLLEVBQTJMalksQ0FBQyxDQUFDMFosWUFBRixFQUF4TyxHQUEwUHRZLENBQUMsSUFBRXBCLENBQUMsQ0FBQ3VULE9BQUYsQ0FBVXhPLE9BQVYsQ0FBa0IsTUFBbEIsRUFBeUIsQ0FBQy9FLENBQUQsQ0FBekIsQ0FBN1AsRUFBMlIsQ0FBQyxDQUFELEtBQUtBLENBQUMsQ0FBQzhFLE9BQUYsQ0FBVWlKLGFBQWYsSUFBOEIvTixDQUFDLENBQUMrYSxPQUFGLEVBQXpULEVBQXFVL2EsQ0FBQyxDQUFDOEUsT0FBRixDQUFVeUosUUFBVixLQUFxQnZPLENBQUMsQ0FBQ21ULE1BQUYsR0FBUyxDQUFDLENBQVYsRUFBWW5ULENBQUMsQ0FBQ2lVLFFBQUYsRUFBakMsQ0FBclU7QUFBb1gsS0FBcmdsQixFQUFzZ2xCN1MsQ0FBQyxDQUFDMlQsU0FBRixDQUFZZ0csT0FBWixHQUFvQixZQUFVO0FBQUMsVUFBSTNaLENBQUMsR0FBQyxJQUFOO0FBQUEsVUFBV3BCLENBQUMsR0FBQ2dXLElBQUksQ0FBQ0MsSUFBTCxDQUFVN1UsQ0FBQyxDQUFDMlEsVUFBRixHQUFhM1EsQ0FBQyxDQUFDMEQsT0FBRixDQUFVb0wsWUFBakMsQ0FBYjtBQUFBLFVBQTREdkMsQ0FBQyxHQUFDdk0sQ0FBQyxDQUFDcVgsbUJBQUYsR0FBd0JnQixNQUF4QixDQUErQixVQUFTN1gsQ0FBVCxFQUFXO0FBQUMsZUFBT0EsQ0FBQyxJQUFFLENBQUgsSUFBTUEsQ0FBQyxHQUFDUixDQUFDLENBQUMyUSxVQUFqQjtBQUE0QixPQUF2RSxDQUE5RDtBQUF1STNRLE1BQUFBLENBQUMsQ0FBQzhRLE9BQUYsQ0FBVTJFLEdBQVYsQ0FBY3pWLENBQUMsQ0FBQzZRLFdBQUYsQ0FBYzVRLElBQWQsQ0FBbUIsZUFBbkIsQ0FBZCxFQUFtRC9DLElBQW5ELENBQXdEO0FBQUMsdUJBQWMsTUFBZjtBQUFzQjJXLFFBQUFBLFFBQVEsRUFBQztBQUEvQixPQUF4RCxFQUE4RjVULElBQTlGLENBQW1HLDBCQUFuRyxFQUErSC9DLElBQS9ILENBQW9JO0FBQUMyVyxRQUFBQSxRQUFRLEVBQUM7QUFBVixPQUFwSSxHQUFxSixTQUFPN1QsQ0FBQyxDQUFDb1EsS0FBVCxLQUFpQnBRLENBQUMsQ0FBQzhRLE9BQUYsQ0FBVWhHLEdBQVYsQ0FBYzlLLENBQUMsQ0FBQzZRLFdBQUYsQ0FBYzVRLElBQWQsQ0FBbUIsZUFBbkIsQ0FBZCxFQUFtRFgsSUFBbkQsQ0FBd0QsVUFBU1YsQ0FBVCxFQUFXO0FBQUMsWUFBSTROLENBQUMsR0FBQ0QsQ0FBQyxDQUFDcU4sT0FBRixDQUFVaGIsQ0FBVixDQUFOO0FBQW1CNEIsUUFBQUEsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRdEQsSUFBUixDQUFhO0FBQUMyYyxVQUFBQSxJQUFJLEVBQUMsVUFBTjtBQUFpQkMsVUFBQUEsRUFBRSxFQUFDLGdCQUFjOVosQ0FBQyxDQUFDd1QsV0FBaEIsR0FBNEI1VSxDQUFoRDtBQUFrRGlWLFVBQUFBLFFBQVEsRUFBQyxDQUFDO0FBQTVELFNBQWIsR0FBNkUsQ0FBQyxDQUFELEtBQUtySCxDQUFMLElBQVFoTSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVF0RCxJQUFSLENBQWE7QUFBQyw4QkFBbUIsd0JBQXNCOEMsQ0FBQyxDQUFDd1QsV0FBeEIsR0FBb0NoSDtBQUF4RCxTQUFiLENBQXJGO0FBQThKLE9BQXJQLEdBQXVQeE0sQ0FBQyxDQUFDb1EsS0FBRixDQUFRbFQsSUFBUixDQUFhLE1BQWIsRUFBb0IsU0FBcEIsRUFBK0IrQyxJQUEvQixDQUFvQyxJQUFwQyxFQUEwQ1gsSUFBMUMsQ0FBK0MsVUFBU2tOLENBQVQsRUFBVztBQUFDLFlBQUlDLENBQUMsR0FBQ0YsQ0FBQyxDQUFDQyxDQUFELENBQVA7QUFBV2hNLFFBQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXRELElBQVIsQ0FBYTtBQUFDMmMsVUFBQUEsSUFBSSxFQUFDO0FBQU4sU0FBYixHQUFvQ3JaLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUVAsSUFBUixDQUFhLFFBQWIsRUFBdUIyVixLQUF2QixHQUErQjFZLElBQS9CLENBQW9DO0FBQUMyYyxVQUFBQSxJQUFJLEVBQUMsS0FBTjtBQUFZQyxVQUFBQSxFQUFFLEVBQUMsd0JBQXNCOVosQ0FBQyxDQUFDd1QsV0FBeEIsR0FBb0NoSCxDQUFuRDtBQUFxRCwyQkFBZ0IsZ0JBQWN4TSxDQUFDLENBQUN3VCxXQUFoQixHQUE0Qi9HLENBQWpHO0FBQW1HLHdCQUFhRCxDQUFDLEdBQUMsQ0FBRixHQUFJLE1BQUosR0FBVzVOLENBQTNIO0FBQTZILDJCQUFnQixJQUE3STtBQUFrSmlWLFVBQUFBLFFBQVEsRUFBQztBQUEzSixTQUFwQyxDQUFwQztBQUEwTyxPQUFoVCxFQUFrVDdJLEVBQWxULENBQXFUaEwsQ0FBQyxDQUFDa1EsWUFBdlQsRUFBcVVqUSxJQUFyVSxDQUEwVSxRQUExVSxFQUFvVi9DLElBQXBWLENBQXlWO0FBQUMseUJBQWdCLE1BQWpCO0FBQXdCMlcsUUFBQUEsUUFBUSxFQUFDO0FBQWpDLE9BQXpWLEVBQWdZa0csR0FBaFksRUFBeFEsQ0FBcko7O0FBQW95QixXQUFJLElBQUl2TixDQUFDLEdBQUN4TSxDQUFDLENBQUNrUSxZQUFSLEVBQXFCekQsQ0FBQyxHQUFDRCxDQUFDLEdBQUN4TSxDQUFDLENBQUMwRCxPQUFGLENBQVVvTCxZQUF2QyxFQUFvRHRDLENBQUMsR0FBQ0MsQ0FBdEQsRUFBd0RELENBQUMsRUFBekQ7QUFBNER4TSxRQUFBQSxDQUFDLENBQUM4USxPQUFGLENBQVU5RixFQUFWLENBQWF3QixDQUFiLEVBQWdCdFAsSUFBaEIsQ0FBcUIsVUFBckIsRUFBZ0MsQ0FBaEM7QUFBNUQ7O0FBQStGOEMsTUFBQUEsQ0FBQyxDQUFDNFQsV0FBRjtBQUFnQixLQUEvam5CLEVBQWdrbkI1VCxDQUFDLENBQUMyVCxTQUFGLENBQVlxRyxlQUFaLEdBQTRCLFlBQVU7QUFBQyxVQUFJeFosQ0FBQyxHQUFDLElBQU47QUFBVyxPQUFDLENBQUQsS0FBS0EsQ0FBQyxDQUFDa0QsT0FBRixDQUFVcUosTUFBZixJQUF1QnZNLENBQUMsQ0FBQ21RLFVBQUYsR0FBYW5RLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVW9MLFlBQTlDLEtBQTZEdE8sQ0FBQyxDQUFDaVEsVUFBRixDQUFhOEcsR0FBYixDQUFpQixhQUFqQixFQUFnQ3hYLEVBQWhDLENBQW1DLGFBQW5DLEVBQWlEO0FBQUNvWCxRQUFBQSxPQUFPLEVBQUM7QUFBVCxPQUFqRCxFQUFzRTNXLENBQUMsQ0FBQ3lTLFdBQXhFLEdBQXFGelMsQ0FBQyxDQUFDZ1EsVUFBRixDQUFhK0csR0FBYixDQUFpQixhQUFqQixFQUFnQ3hYLEVBQWhDLENBQW1DLGFBQW5DLEVBQWlEO0FBQUNvWCxRQUFBQSxPQUFPLEVBQUM7QUFBVCxPQUFqRCxFQUFrRTNXLENBQUMsQ0FBQ3lTLFdBQXBFLENBQXJGLEVBQXNLLENBQUMsQ0FBRCxLQUFLelMsQ0FBQyxDQUFDa0QsT0FBRixDQUFVaUosYUFBZixLQUErQm5NLENBQUMsQ0FBQ2lRLFVBQUYsQ0FBYTFRLEVBQWIsQ0FBZ0IsZUFBaEIsRUFBZ0NTLENBQUMsQ0FBQytTLFVBQWxDLEdBQThDL1MsQ0FBQyxDQUFDZ1EsVUFBRixDQUFhelEsRUFBYixDQUFnQixlQUFoQixFQUFnQ1MsQ0FBQyxDQUFDK1MsVUFBbEMsQ0FBN0UsQ0FBbk87QUFBZ1csS0FBbDluQixFQUFtOW5CdlQsQ0FBQyxDQUFDMlQsU0FBRixDQUFZc0csYUFBWixHQUEwQixZQUFVO0FBQUMsVUFBSWphLENBQUMsR0FBQyxJQUFOO0FBQVcsT0FBQyxDQUFELEtBQUtBLENBQUMsQ0FBQzBELE9BQUYsQ0FBVWdLLElBQWYsS0FBc0JsTixDQUFDLENBQUMsSUFBRCxFQUFNUixDQUFDLENBQUNvUSxLQUFSLENBQUQsQ0FBZ0JyUSxFQUFoQixDQUFtQixhQUFuQixFQUFpQztBQUFDb1gsUUFBQUEsT0FBTyxFQUFDO0FBQVQsT0FBakMsRUFBbURuWCxDQUFDLENBQUNpVCxXQUFyRCxHQUFrRSxDQUFDLENBQUQsS0FBS2pULENBQUMsQ0FBQzBELE9BQUYsQ0FBVWlKLGFBQWYsSUFBOEIzTSxDQUFDLENBQUNvUSxLQUFGLENBQVFyUSxFQUFSLENBQVcsZUFBWCxFQUEyQkMsQ0FBQyxDQUFDdVQsVUFBN0IsQ0FBdEgsR0FBZ0ssQ0FBQyxDQUFELEtBQUt2VCxDQUFDLENBQUMwRCxPQUFGLENBQVVnSyxJQUFmLElBQXFCLENBQUMsQ0FBRCxLQUFLMU4sQ0FBQyxDQUFDMEQsT0FBRixDQUFVOEssZ0JBQXBDLElBQXNEaE8sQ0FBQyxDQUFDLElBQUQsRUFBTVIsQ0FBQyxDQUFDb1EsS0FBUixDQUFELENBQWdCclEsRUFBaEIsQ0FBbUIsa0JBQW5CLEVBQXNDUyxDQUFDLENBQUNzUyxLQUFGLENBQVE5UyxDQUFDLENBQUN3WCxTQUFWLEVBQW9CeFgsQ0FBcEIsRUFBc0IsQ0FBQyxDQUF2QixDQUF0QyxFQUFpRUQsRUFBakUsQ0FBb0Usa0JBQXBFLEVBQXVGUyxDQUFDLENBQUNzUyxLQUFGLENBQVE5UyxDQUFDLENBQUN3WCxTQUFWLEVBQW9CeFgsQ0FBcEIsRUFBc0IsQ0FBQyxDQUF2QixDQUF2RixDQUF0TjtBQUF3VSxLQUEzMG9CLEVBQTQwb0JBLENBQUMsQ0FBQzJULFNBQUYsQ0FBWXVHLGVBQVosR0FBNEIsWUFBVTtBQUFDLFVBQUlsYSxDQUFDLEdBQUMsSUFBTjtBQUFXQSxNQUFBQSxDQUFDLENBQUMwRCxPQUFGLENBQVU0SyxZQUFWLEtBQXlCdE8sQ0FBQyxDQUFDbVIsS0FBRixDQUFRcFIsRUFBUixDQUFXLGtCQUFYLEVBQThCUyxDQUFDLENBQUNzUyxLQUFGLENBQVE5UyxDQUFDLENBQUN3WCxTQUFWLEVBQW9CeFgsQ0FBcEIsRUFBc0IsQ0FBQyxDQUF2QixDQUE5QixHQUF5REEsQ0FBQyxDQUFDbVIsS0FBRixDQUFRcFIsRUFBUixDQUFXLGtCQUFYLEVBQThCUyxDQUFDLENBQUNzUyxLQUFGLENBQVE5UyxDQUFDLENBQUN3WCxTQUFWLEVBQW9CeFgsQ0FBcEIsRUFBc0IsQ0FBQyxDQUF2QixDQUE5QixDQUFsRjtBQUE0SSxLQUExZ3BCLEVBQTJncEJBLENBQUMsQ0FBQzJULFNBQUYsQ0FBWThGLGdCQUFaLEdBQTZCLFlBQVU7QUFBQyxVQUFJelosQ0FBQyxHQUFDLElBQU47QUFBV0EsTUFBQUEsQ0FBQyxDQUFDZ2EsZUFBRixJQUFvQmhhLENBQUMsQ0FBQ2lhLGFBQUYsRUFBcEIsRUFBc0NqYSxDQUFDLENBQUNrYSxlQUFGLEVBQXRDLEVBQTBEbGEsQ0FBQyxDQUFDbVIsS0FBRixDQUFRcFIsRUFBUixDQUFXLGtDQUFYLEVBQThDO0FBQUNvYSxRQUFBQSxNQUFNLEVBQUM7QUFBUixPQUE5QyxFQUErRG5hLENBQUMsQ0FBQ3FULFlBQWpFLENBQTFELEVBQXlJclQsQ0FBQyxDQUFDbVIsS0FBRixDQUFRcFIsRUFBUixDQUFXLGlDQUFYLEVBQTZDO0FBQUNvYSxRQUFBQSxNQUFNLEVBQUM7QUFBUixPQUE3QyxFQUE2RG5hLENBQUMsQ0FBQ3FULFlBQS9ELENBQXpJLEVBQXNOclQsQ0FBQyxDQUFDbVIsS0FBRixDQUFRcFIsRUFBUixDQUFXLDhCQUFYLEVBQTBDO0FBQUNvYSxRQUFBQSxNQUFNLEVBQUM7QUFBUixPQUExQyxFQUF5RG5hLENBQUMsQ0FBQ3FULFlBQTNELENBQXROLEVBQStSclQsQ0FBQyxDQUFDbVIsS0FBRixDQUFRcFIsRUFBUixDQUFXLG9DQUFYLEVBQWdEO0FBQUNvYSxRQUFBQSxNQUFNLEVBQUM7QUFBUixPQUFoRCxFQUErRG5hLENBQUMsQ0FBQ3FULFlBQWpFLENBQS9SLEVBQThXclQsQ0FBQyxDQUFDbVIsS0FBRixDQUFRcFIsRUFBUixDQUFXLGFBQVgsRUFBeUJDLENBQUMsQ0FBQ2tULFlBQTNCLENBQTlXLEVBQXVaMVMsQ0FBQyxDQUFDdkUsUUFBRCxDQUFELENBQVk4RCxFQUFaLENBQWVDLENBQUMsQ0FBQ3VTLGdCQUFqQixFQUFrQy9SLENBQUMsQ0FBQ3NTLEtBQUYsQ0FBUTlTLENBQUMsQ0FBQ3lYLFVBQVYsRUFBcUJ6WCxDQUFyQixDQUFsQyxDQUF2WixFQUFrZCxDQUFDLENBQUQsS0FBS0EsQ0FBQyxDQUFDMEQsT0FBRixDQUFVaUosYUFBZixJQUE4QjNNLENBQUMsQ0FBQ21SLEtBQUYsQ0FBUXBSLEVBQVIsQ0FBVyxlQUFYLEVBQTJCQyxDQUFDLENBQUN1VCxVQUE3QixDQUFoZixFQUF5aEIsQ0FBQyxDQUFELEtBQUt2VCxDQUFDLENBQUMwRCxPQUFGLENBQVVzSyxhQUFmLElBQThCeE4sQ0FBQyxDQUFDUixDQUFDLENBQUM2USxXQUFILENBQUQsQ0FBaUIxRyxRQUFqQixHQUE0QnBLLEVBQTVCLENBQStCLGFBQS9CLEVBQTZDQyxDQUFDLENBQUNtVCxhQUEvQyxDQUF2akIsRUFBcW5CM1MsQ0FBQyxDQUFDbkQsTUFBRCxDQUFELENBQVUwQyxFQUFWLENBQWEsbUNBQWlDQyxDQUFDLENBQUN3VCxXQUFoRCxFQUE0RGhULENBQUMsQ0FBQ3NTLEtBQUYsQ0FBUTlTLENBQUMsQ0FBQzJYLGlCQUFWLEVBQTRCM1gsQ0FBNUIsQ0FBNUQsQ0FBcm5CLEVBQWl0QlEsQ0FBQyxDQUFDbkQsTUFBRCxDQUFELENBQVUwQyxFQUFWLENBQWEsd0JBQXNCQyxDQUFDLENBQUN3VCxXQUFyQyxFQUFpRGhULENBQUMsQ0FBQ3NTLEtBQUYsQ0FBUTlTLENBQUMsQ0FBQzRYLE1BQVYsRUFBaUI1WCxDQUFqQixDQUFqRCxDQUFqdEIsRUFBdXhCUSxDQUFDLENBQUMsbUJBQUQsRUFBcUJSLENBQUMsQ0FBQzZRLFdBQXZCLENBQUQsQ0FBcUM5USxFQUFyQyxDQUF3QyxXQUF4QyxFQUFvREMsQ0FBQyxDQUFDcUksY0FBdEQsQ0FBdnhCLEVBQTYxQjdILENBQUMsQ0FBQ25ELE1BQUQsQ0FBRCxDQUFVMEMsRUFBVixDQUFhLHNCQUFvQkMsQ0FBQyxDQUFDd1QsV0FBbkMsRUFBK0N4VCxDQUFDLENBQUNvVCxXQUFqRCxDQUE3MUIsRUFBMjVCNVMsQ0FBQyxDQUFDUixDQUFDLENBQUNvVCxXQUFILENBQTU1QjtBQUE0NkIsS0FBMStxQixFQUEyK3FCcFQsQ0FBQyxDQUFDMlQsU0FBRixDQUFZeUcsTUFBWixHQUFtQixZQUFVO0FBQUMsVUFBSTVaLENBQUMsR0FBQyxJQUFOO0FBQVcsT0FBQyxDQUFELEtBQUtBLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVXFKLE1BQWYsSUFBdUJ2TSxDQUFDLENBQUNtUSxVQUFGLEdBQWFuUSxDQUFDLENBQUNrRCxPQUFGLENBQVVvTCxZQUE5QyxLQUE2RHRPLENBQUMsQ0FBQ2lRLFVBQUYsQ0FBYTFFLElBQWIsSUFBb0J2TCxDQUFDLENBQUNnUSxVQUFGLENBQWF6RSxJQUFiLEVBQWpGLEdBQXNHLENBQUMsQ0FBRCxLQUFLdkwsQ0FBQyxDQUFDa0QsT0FBRixDQUFVZ0ssSUFBZixJQUFxQmxOLENBQUMsQ0FBQ21RLFVBQUYsR0FBYW5RLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVW9MLFlBQTVDLElBQTBEdE8sQ0FBQyxDQUFDNFAsS0FBRixDQUFRckUsSUFBUixFQUFoSztBQUErSyxLQUFuc3JCLEVBQW9zckIvTCxDQUFDLENBQUMyVCxTQUFGLENBQVlKLFVBQVosR0FBdUIsVUFBUy9TLENBQVQsRUFBVztBQUFDLFVBQUlSLENBQUMsR0FBQyxJQUFOO0FBQVdRLE1BQUFBLENBQUMsQ0FBQ3VJLE1BQUYsQ0FBU3NSLE9BQVQsQ0FBaUIvVSxLQUFqQixDQUF1Qix1QkFBdkIsTUFBa0QsT0FBSzlFLENBQUMsQ0FBQzhaLE9BQVAsSUFBZ0IsQ0FBQyxDQUFELEtBQUt0YSxDQUFDLENBQUMwRCxPQUFGLENBQVVpSixhQUEvQixHQUE2QzNNLENBQUMsQ0FBQ2lULFdBQUYsQ0FBYztBQUFDeFQsUUFBQUEsSUFBSSxFQUFDO0FBQUMwWCxVQUFBQSxPQUFPLEVBQUMsQ0FBQyxDQUFELEtBQUtuWCxDQUFDLENBQUMwRCxPQUFGLENBQVVrTCxHQUFmLEdBQW1CLE1BQW5CLEdBQTBCO0FBQW5DO0FBQU4sT0FBZCxDQUE3QyxHQUFrSCxPQUFLcE8sQ0FBQyxDQUFDOFosT0FBUCxJQUFnQixDQUFDLENBQUQsS0FBS3RhLENBQUMsQ0FBQzBELE9BQUYsQ0FBVWlKLGFBQS9CLElBQThDM00sQ0FBQyxDQUFDaVQsV0FBRixDQUFjO0FBQUN4VCxRQUFBQSxJQUFJLEVBQUM7QUFBQzBYLFVBQUFBLE9BQU8sRUFBQyxDQUFDLENBQUQsS0FBS25YLENBQUMsQ0FBQzBELE9BQUYsQ0FBVWtMLEdBQWYsR0FBbUIsVUFBbkIsR0FBOEI7QUFBdkM7QUFBTixPQUFkLENBQWxOO0FBQXdSLEtBQTFnc0IsRUFBMmdzQjVPLENBQUMsQ0FBQzJULFNBQUYsQ0FBWXZGLFFBQVosR0FBcUIsWUFBVTtBQUFDLGVBQVNwTyxDQUFULENBQVdBLENBQVgsRUFBYTtBQUFDUSxRQUFBQSxDQUFDLENBQUMsZ0JBQUQsRUFBa0JSLENBQWxCLENBQUQsQ0FBc0JWLElBQXRCLENBQTJCLFlBQVU7QUFBQyxjQUFJVSxDQUFDLEdBQUNRLENBQUMsQ0FBQyxJQUFELENBQVA7QUFBQSxjQUFjNUIsQ0FBQyxHQUFDNEIsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRdEQsSUFBUixDQUFhLFdBQWIsQ0FBaEI7QUFBQSxjQUEwQ3FQLENBQUMsR0FBQy9MLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXRELElBQVIsQ0FBYSxhQUFiLENBQTVDO0FBQUEsY0FBd0VzUCxDQUFDLEdBQUNoTSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVF0RCxJQUFSLENBQWEsWUFBYixLQUE0QnVQLENBQUMsQ0FBQzBGLE9BQUYsQ0FBVWpWLElBQVYsQ0FBZSxZQUFmLENBQXRHO0FBQUEsY0FBbUlpWixDQUFDLEdBQUNsYSxRQUFRLENBQUM4QyxhQUFULENBQXVCLEtBQXZCLENBQXJJO0FBQW1Lb1gsVUFBQUEsQ0FBQyxDQUFDOUwsTUFBRixHQUFTLFlBQVU7QUFBQ3JLLFlBQUFBLENBQUMsQ0FBQzZMLE9BQUYsQ0FBVTtBQUFDb00sY0FBQUEsT0FBTyxFQUFDO0FBQVQsYUFBVixFQUFzQixHQUF0QixFQUEwQixZQUFVO0FBQUMxTCxjQUFBQSxDQUFDLEtBQUd2TSxDQUFDLENBQUM5QyxJQUFGLENBQU8sUUFBUCxFQUFnQnFQLENBQWhCLEdBQW1CQyxDQUFDLElBQUV4TSxDQUFDLENBQUM5QyxJQUFGLENBQU8sT0FBUCxFQUFlc1AsQ0FBZixDQUF6QixDQUFELEVBQTZDeE0sQ0FBQyxDQUFDOUMsSUFBRixDQUFPLEtBQVAsRUFBYTBCLENBQWIsRUFBZ0JpTixPQUFoQixDQUF3QjtBQUFDb00sZ0JBQUFBLE9BQU8sRUFBQztBQUFULGVBQXhCLEVBQW9DLEdBQXBDLEVBQXdDLFlBQVU7QUFBQ2pZLGdCQUFBQSxDQUFDLENBQUN3VixVQUFGLENBQWEsa0NBQWIsRUFBaUR4WCxXQUFqRCxDQUE2RCxlQUE3RDtBQUE4RSxlQUFqSSxDQUE3QyxFQUFnTHlPLENBQUMsQ0FBQzBGLE9BQUYsQ0FBVXhPLE9BQVYsQ0FBa0IsWUFBbEIsRUFBK0IsQ0FBQzhJLENBQUQsRUFBR3pNLENBQUgsRUFBS3BCLENBQUwsQ0FBL0IsQ0FBaEw7QUFBd04sYUFBN1A7QUFBK1AsV0FBblIsRUFBb1J1WCxDQUFDLENBQUNvRSxPQUFGLEdBQVUsWUFBVTtBQUFDdmEsWUFBQUEsQ0FBQyxDQUFDd1YsVUFBRixDQUFhLFdBQWIsRUFBMEJ4WCxXQUExQixDQUFzQyxlQUF0QyxFQUF1REQsUUFBdkQsQ0FBZ0Usc0JBQWhFLEdBQXdGME8sQ0FBQyxDQUFDMEYsT0FBRixDQUFVeE8sT0FBVixDQUFrQixlQUFsQixFQUFrQyxDQUFDOEksQ0FBRCxFQUFHek0sQ0FBSCxFQUFLcEIsQ0FBTCxDQUFsQyxDQUF4RjtBQUFtSSxXQUE1YSxFQUE2YXVYLENBQUMsQ0FBQ3FFLEdBQUYsR0FBTTViLENBQW5iO0FBQXFiLFNBQTluQjtBQUFnb0I7O0FBQUEsVUFBSUEsQ0FBSjtBQUFBLFVBQU0yTixDQUFOO0FBQUEsVUFBUUMsQ0FBUjtBQUFBLFVBQVVDLENBQUMsR0FBQyxJQUFaO0FBQWlCLFVBQUcsQ0FBQyxDQUFELEtBQUtBLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVTJKLFVBQWYsR0FBMEIsQ0FBQyxDQUFELEtBQUtaLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVXdLLFFBQWYsR0FBd0IxQixDQUFDLEdBQUMsQ0FBQ0QsQ0FBQyxHQUFDRSxDQUFDLENBQUN5RCxZQUFGLElBQWdCekQsQ0FBQyxDQUFDL0ksT0FBRixDQUFVb0wsWUFBVixHQUF1QixDQUF2QixHQUF5QixDQUF6QyxDQUFILElBQWdEckMsQ0FBQyxDQUFDL0ksT0FBRixDQUFVb0wsWUFBMUQsR0FBdUUsQ0FBakcsSUFBb0d2QyxDQUFDLEdBQUNxSSxJQUFJLENBQUMzUCxHQUFMLENBQVMsQ0FBVCxFQUFXd0gsQ0FBQyxDQUFDeUQsWUFBRixJQUFnQnpELENBQUMsQ0FBQy9JLE9BQUYsQ0FBVW9MLFlBQVYsR0FBdUIsQ0FBdkIsR0FBeUIsQ0FBekMsQ0FBWCxDQUFGLEVBQTBEdEMsQ0FBQyxHQUFDQyxDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUFWLEdBQXVCLENBQXZCLEdBQXlCLENBQXpCLEdBQTJCLENBQTNCLEdBQTZCckMsQ0FBQyxDQUFDeUQsWUFBL0wsQ0FBMUIsSUFBd08zRCxDQUFDLEdBQUNFLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVXdLLFFBQVYsR0FBbUJ6QixDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUFWLEdBQXVCckMsQ0FBQyxDQUFDeUQsWUFBNUMsR0FBeUR6RCxDQUFDLENBQUN5RCxZQUE3RCxFQUEwRTFELENBQUMsR0FBQ29JLElBQUksQ0FBQ0MsSUFBTCxDQUFVdEksQ0FBQyxHQUFDRSxDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUF0QixDQUE1RSxFQUFnSCxDQUFDLENBQUQsS0FBS3JDLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVXFLLElBQWYsS0FBc0J4QixDQUFDLEdBQUMsQ0FBRixJQUFLQSxDQUFDLEVBQU4sRUFBU0MsQ0FBQyxJQUFFQyxDQUFDLENBQUNrRSxVQUFMLElBQWlCbkUsQ0FBQyxFQUFqRCxDQUF4VixHQUE4WTVOLENBQUMsR0FBQzZOLENBQUMsQ0FBQzBGLE9BQUYsQ0FBVWxTLElBQVYsQ0FBZSxjQUFmLEVBQStCd2EsS0FBL0IsQ0FBcUNsTyxDQUFyQyxFQUF1Q0MsQ0FBdkMsQ0FBaFosRUFBMGIsa0JBQWdCQyxDQUFDLENBQUMvSSxPQUFGLENBQVUwSyxRQUF2ZCxFQUFnZSxLQUFJLElBQUkrSCxDQUFDLEdBQUM1SixDQUFDLEdBQUMsQ0FBUixFQUFVNkosQ0FBQyxHQUFDNUosQ0FBWixFQUFjOEosQ0FBQyxHQUFDN0osQ0FBQyxDQUFDMEYsT0FBRixDQUFVbFMsSUFBVixDQUFlLGNBQWYsQ0FBaEIsRUFBK0NzVyxDQUFDLEdBQUMsQ0FBckQsRUFBdURBLENBQUMsR0FBQzlKLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVXFMLGNBQW5FLEVBQWtGd0gsQ0FBQyxFQUFuRjtBQUFzRkosUUFBQUEsQ0FBQyxHQUFDLENBQUYsS0FBTUEsQ0FBQyxHQUFDMUosQ0FBQyxDQUFDa0UsVUFBRixHQUFhLENBQXJCLEdBQXdCL1IsQ0FBQyxHQUFDLENBQUNBLENBQUMsR0FBQ0EsQ0FBQyxDQUFDNlcsR0FBRixDQUFNYSxDQUFDLENBQUN0TCxFQUFGLENBQUttTCxDQUFMLENBQU4sQ0FBSCxFQUFtQlYsR0FBbkIsQ0FBdUJhLENBQUMsQ0FBQ3RMLEVBQUYsQ0FBS29MLENBQUwsQ0FBdkIsQ0FBMUIsRUFBMERELENBQUMsRUFBM0QsRUFBOERDLENBQUMsRUFBL0Q7QUFBdEY7QUFBd0pwVyxNQUFBQSxDQUFDLENBQUNwQixDQUFELENBQUQsRUFBSzZOLENBQUMsQ0FBQ2tFLFVBQUYsSUFBY2xFLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVW9MLFlBQXhCLEdBQXFDOU8sQ0FBQyxDQUFDeU0sQ0FBQyxDQUFDMEYsT0FBRixDQUFVbFMsSUFBVixDQUFlLGNBQWYsQ0FBRCxDQUF0QyxHQUF1RXdNLENBQUMsQ0FBQ3lELFlBQUYsSUFBZ0J6RCxDQUFDLENBQUNrRSxVQUFGLEdBQWFsRSxDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUF2QyxHQUFvRDlPLENBQUMsQ0FBQ3lNLENBQUMsQ0FBQzBGLE9BQUYsQ0FBVWxTLElBQVYsQ0FBZSxlQUFmLEVBQWdDd2EsS0FBaEMsQ0FBc0MsQ0FBdEMsRUFBd0NoTyxDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUFsRCxDQUFELENBQXJELEdBQXVILE1BQUlyQyxDQUFDLENBQUN5RCxZQUFOLElBQW9CbFEsQ0FBQyxDQUFDeU0sQ0FBQyxDQUFDMEYsT0FBRixDQUFVbFMsSUFBVixDQUFlLGVBQWYsRUFBZ0N3YSxLQUFoQyxDQUFzQyxDQUFDLENBQUQsR0FBR2hPLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVW9MLFlBQW5ELENBQUQsQ0FBeE47QUFBMlIsS0FBN2x2QixFQUE4bHZCOU8sQ0FBQyxDQUFDMlQsU0FBRixDQUFZNkYsVUFBWixHQUF1QixZQUFVO0FBQUMsVUFBSWhaLENBQUMsR0FBQyxJQUFOO0FBQVdBLE1BQUFBLENBQUMsQ0FBQzRTLFdBQUYsSUFBZ0I1UyxDQUFDLENBQUNxUSxXQUFGLENBQWN4TyxHQUFkLENBQWtCO0FBQUM0VixRQUFBQSxPQUFPLEVBQUM7QUFBVCxPQUFsQixDQUFoQixFQUErQ3pYLENBQUMsQ0FBQzJSLE9BQUYsQ0FBVW5VLFdBQVYsQ0FBc0IsZUFBdEIsQ0FBL0MsRUFBc0Z3QyxDQUFDLENBQUM0WixNQUFGLEVBQXRGLEVBQWlHLGtCQUFnQjVaLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVTBLLFFBQTFCLElBQW9DNU4sQ0FBQyxDQUFDa2EsbUJBQUYsRUFBckk7QUFBNkosS0FBeHl2QixFQUF5eXZCMWEsQ0FBQyxDQUFDMlQsU0FBRixDQUFZblIsSUFBWixHQUFpQnhDLENBQUMsQ0FBQzJULFNBQUYsQ0FBWWdILFNBQVosR0FBc0IsWUFBVTtBQUFDLFdBQUsxSCxXQUFMLENBQWlCO0FBQUN4VCxRQUFBQSxJQUFJLEVBQUM7QUFBQzBYLFVBQUFBLE9BQU8sRUFBQztBQUFUO0FBQU4sT0FBakI7QUFBMEMsS0FBcjR2QixFQUFzNHZCblgsQ0FBQyxDQUFDMlQsU0FBRixDQUFZZ0UsaUJBQVosR0FBOEIsWUFBVTtBQUFDLFVBQUluWCxDQUFDLEdBQUMsSUFBTjtBQUFXQSxNQUFBQSxDQUFDLENBQUNxVyxlQUFGLElBQW9CclcsQ0FBQyxDQUFDNFMsV0FBRixFQUFwQjtBQUFvQyxLQUE5OXZCLEVBQSs5dkJwVCxDQUFDLENBQUMyVCxTQUFGLENBQVlpSCxLQUFaLEdBQWtCNWEsQ0FBQyxDQUFDMlQsU0FBRixDQUFZa0gsVUFBWixHQUF1QixZQUFVO0FBQUMsVUFBSXJhLENBQUMsR0FBQyxJQUFOO0FBQVdBLE1BQUFBLENBQUMsQ0FBQ3VTLGFBQUYsSUFBa0J2UyxDQUFDLENBQUN1UixNQUFGLEdBQVMsQ0FBQyxDQUE1QjtBQUE4QixLQUE1andCLEVBQTZqd0IvUixDQUFDLENBQUMyVCxTQUFGLENBQVltSCxJQUFaLEdBQWlCOWEsQ0FBQyxDQUFDMlQsU0FBRixDQUFZb0gsU0FBWixHQUFzQixZQUFVO0FBQUMsVUFBSXZhLENBQUMsR0FBQyxJQUFOO0FBQVdBLE1BQUFBLENBQUMsQ0FBQ3FTLFFBQUYsSUFBYXJTLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVXlKLFFBQVYsR0FBbUIsQ0FBQyxDQUFqQyxFQUFtQzNNLENBQUMsQ0FBQ3VSLE1BQUYsR0FBUyxDQUFDLENBQTdDLEVBQStDdlIsQ0FBQyxDQUFDb1IsUUFBRixHQUFXLENBQUMsQ0FBM0QsRUFBNkRwUixDQUFDLENBQUNxUixXQUFGLEdBQWMsQ0FBQyxDQUE1RTtBQUE4RSxLQUF4c3dCLEVBQXlzd0I3UixDQUFDLENBQUMyVCxTQUFGLENBQVlxSCxTQUFaLEdBQXNCLFVBQVNoYixDQUFULEVBQVc7QUFBQyxVQUFJcEIsQ0FBQyxHQUFDLElBQU47QUFBV0EsTUFBQUEsQ0FBQyxDQUFDMFMsU0FBRixLQUFjMVMsQ0FBQyxDQUFDdVQsT0FBRixDQUFVeE8sT0FBVixDQUFrQixhQUFsQixFQUFnQyxDQUFDL0UsQ0FBRCxFQUFHb0IsQ0FBSCxDQUFoQyxHQUF1Q3BCLENBQUMsQ0FBQ2lSLFNBQUYsR0FBWSxDQUFDLENBQXBELEVBQXNEalIsQ0FBQyxDQUFDK1IsVUFBRixHQUFhL1IsQ0FBQyxDQUFDOEUsT0FBRixDQUFVb0wsWUFBdkIsSUFBcUNsUSxDQUFDLENBQUN3VSxXQUFGLEVBQTNGLEVBQTJHeFUsQ0FBQyxDQUFDcVMsU0FBRixHQUFZLElBQXZILEVBQTRIclMsQ0FBQyxDQUFDOEUsT0FBRixDQUFVeUosUUFBVixJQUFvQnZPLENBQUMsQ0FBQ2lVLFFBQUYsRUFBaEosRUFBNkosQ0FBQyxDQUFELEtBQUtqVSxDQUFDLENBQUM4RSxPQUFGLENBQVVpSixhQUFmLEtBQStCL04sQ0FBQyxDQUFDK2EsT0FBRixJQUFZL2EsQ0FBQyxDQUFDOEUsT0FBRixDQUFVdUssYUFBVixJQUF5QnpOLENBQUMsQ0FBQzVCLENBQUMsQ0FBQ2tTLE9BQUYsQ0FBVTJGLEdBQVYsQ0FBYzdYLENBQUMsQ0FBQ3NSLFlBQWhCLENBQUQsQ0FBRCxDQUFpQ2hULElBQWpDLENBQXNDLFVBQXRDLEVBQWlELENBQWpELEVBQW9EK2QsS0FBcEQsRUFBcEUsQ0FBM0s7QUFBNlMsS0FBbml4QixFQUFvaXhCamIsQ0FBQyxDQUFDMlQsU0FBRixDQUFZdUgsSUFBWixHQUFpQmxiLENBQUMsQ0FBQzJULFNBQUYsQ0FBWXdILFNBQVosR0FBc0IsWUFBVTtBQUFDLFdBQUtsSSxXQUFMLENBQWlCO0FBQUN4VCxRQUFBQSxJQUFJLEVBQUM7QUFBQzBYLFVBQUFBLE9BQU8sRUFBQztBQUFUO0FBQU4sT0FBakI7QUFBOEMsS0FBcG94QixFQUFxb3hCblgsQ0FBQyxDQUFDMlQsU0FBRixDQUFZdEwsY0FBWixHQUEyQixVQUFTN0gsQ0FBVCxFQUFXO0FBQUNBLE1BQUFBLENBQUMsQ0FBQzZILGNBQUY7QUFBbUIsS0FBL3J4QixFQUFnc3hCckksQ0FBQyxDQUFDMlQsU0FBRixDQUFZK0csbUJBQVosR0FBZ0MsVUFBUzFhLENBQVQsRUFBVztBQUFDQSxNQUFBQSxDQUFDLEdBQUNBLENBQUMsSUFBRSxDQUFMO0FBQU8sVUFBSXBCLENBQUo7QUFBQSxVQUFNMk4sQ0FBTjtBQUFBLFVBQVFDLENBQVI7QUFBQSxVQUFVQyxDQUFWO0FBQUEsVUFBWTBKLENBQVo7QUFBQSxVQUFjQyxDQUFDLEdBQUMsSUFBaEI7QUFBQSxVQUFxQkUsQ0FBQyxHQUFDOVYsQ0FBQyxDQUFDLGdCQUFELEVBQWtCNFYsQ0FBQyxDQUFDakUsT0FBcEIsQ0FBeEI7QUFBcURtRSxNQUFBQSxDQUFDLENBQUMzVCxNQUFGLElBQVUvRCxDQUFDLEdBQUMwWCxDQUFDLENBQUNWLEtBQUYsRUFBRixFQUFZckosQ0FBQyxHQUFDM04sQ0FBQyxDQUFDMUIsSUFBRixDQUFPLFdBQVAsQ0FBZCxFQUFrQ3NQLENBQUMsR0FBQzVOLENBQUMsQ0FBQzFCLElBQUYsQ0FBTyxhQUFQLENBQXBDLEVBQTBEdVAsQ0FBQyxHQUFDN04sQ0FBQyxDQUFDMUIsSUFBRixDQUFPLFlBQVAsS0FBc0JrWixDQUFDLENBQUNqRSxPQUFGLENBQVVqVixJQUFWLENBQWUsWUFBZixDQUFsRixFQUErRyxDQUFDaVosQ0FBQyxHQUFDbGEsUUFBUSxDQUFDOEMsYUFBVCxDQUF1QixLQUF2QixDQUFILEVBQWtDc0wsTUFBbEMsR0FBeUMsWUFBVTtBQUFDbUMsUUFBQUEsQ0FBQyxLQUFHNU4sQ0FBQyxDQUFDMUIsSUFBRixDQUFPLFFBQVAsRUFBZ0JzUCxDQUFoQixHQUFtQkMsQ0FBQyxJQUFFN04sQ0FBQyxDQUFDMUIsSUFBRixDQUFPLE9BQVAsRUFBZXVQLENBQWYsQ0FBekIsQ0FBRCxFQUE2QzdOLENBQUMsQ0FBQzFCLElBQUYsQ0FBTyxLQUFQLEVBQWFxUCxDQUFiLEVBQWdCaUosVUFBaEIsQ0FBMkIsa0NBQTNCLEVBQStEeFgsV0FBL0QsQ0FBMkUsZUFBM0UsQ0FBN0MsRUFBeUksQ0FBQyxDQUFELEtBQUtvWSxDQUFDLENBQUMxUyxPQUFGLENBQVVrSixjQUFmLElBQStCd0osQ0FBQyxDQUFDaEQsV0FBRixFQUF4SyxFQUF3TGdELENBQUMsQ0FBQ2pFLE9BQUYsQ0FBVXhPLE9BQVYsQ0FBa0IsWUFBbEIsRUFBK0IsQ0FBQ3lTLENBQUQsRUFBR3hYLENBQUgsRUFBSzJOLENBQUwsQ0FBL0IsQ0FBeEwsRUFBZ082SixDQUFDLENBQUNzRSxtQkFBRixFQUFoTztBQUF3UCxPQUEzWixFQUE0WnZFLENBQUMsQ0FBQ29FLE9BQUYsR0FBVSxZQUFVO0FBQUN2YSxRQUFBQSxDQUFDLEdBQUMsQ0FBRixHQUFJcUwsVUFBVSxDQUFDLFlBQVU7QUFBQytLLFVBQUFBLENBQUMsQ0FBQ3NFLG1CQUFGLENBQXNCMWEsQ0FBQyxHQUFDLENBQXhCO0FBQTJCLFNBQXZDLEVBQXdDLEdBQXhDLENBQWQsSUFBNERwQixDQUFDLENBQUM0VyxVQUFGLENBQWEsV0FBYixFQUEwQnhYLFdBQTFCLENBQXNDLGVBQXRDLEVBQXVERCxRQUF2RCxDQUFnRSxzQkFBaEUsR0FBd0ZxWSxDQUFDLENBQUNqRSxPQUFGLENBQVV4TyxPQUFWLENBQWtCLGVBQWxCLEVBQWtDLENBQUN5UyxDQUFELEVBQUd4WCxDQUFILEVBQUsyTixDQUFMLENBQWxDLENBQXhGLEVBQW1JNkosQ0FBQyxDQUFDc0UsbUJBQUYsRUFBL0w7QUFBd04sT0FBem9CLEVBQTBvQnZFLENBQUMsQ0FBQ3FFLEdBQUYsR0FBTWpPLENBQTFwQixJQUE2cEI2SixDQUFDLENBQUNqRSxPQUFGLENBQVV4TyxPQUFWLENBQWtCLGlCQUFsQixFQUFvQyxDQUFDeVMsQ0FBRCxDQUFwQyxDQUE3cEI7QUFBc3NCLEtBQTkreUIsRUFBKyt5QnBXLENBQUMsQ0FBQzJULFNBQUYsQ0FBWXNELE9BQVosR0FBb0IsVUFBU2pYLENBQVQsRUFBVztBQUFDLFVBQUlwQixDQUFKO0FBQUEsVUFBTTJOLENBQU47QUFBQSxVQUFRQyxDQUFDLEdBQUMsSUFBVjtBQUFlRCxNQUFBQSxDQUFDLEdBQUNDLENBQUMsQ0FBQ21FLFVBQUYsR0FBYW5FLENBQUMsQ0FBQzlJLE9BQUYsQ0FBVW9MLFlBQXpCLEVBQXNDLENBQUN0QyxDQUFDLENBQUM5SSxPQUFGLENBQVV3SyxRQUFYLElBQXFCMUIsQ0FBQyxDQUFDMEQsWUFBRixHQUFlM0QsQ0FBcEMsS0FBd0NDLENBQUMsQ0FBQzBELFlBQUYsR0FBZTNELENBQXZELENBQXRDLEVBQWdHQyxDQUFDLENBQUNtRSxVQUFGLElBQWNuRSxDQUFDLENBQUM5SSxPQUFGLENBQVVvTCxZQUF4QixLQUF1Q3RDLENBQUMsQ0FBQzBELFlBQUYsR0FBZSxDQUF0RCxDQUFoRyxFQUF5SnRSLENBQUMsR0FBQzROLENBQUMsQ0FBQzBELFlBQTdKLEVBQTBLMUQsQ0FBQyxDQUFDdUwsT0FBRixDQUFVLENBQUMsQ0FBWCxDQUExSyxFQUF3THZYLENBQUMsQ0FBQzNDLE1BQUYsQ0FBUzJPLENBQVQsRUFBV0EsQ0FBQyxDQUFDb0QsUUFBYixFQUFzQjtBQUFDTSxRQUFBQSxZQUFZLEVBQUN0UjtBQUFkLE9BQXRCLENBQXhMLEVBQWdPNE4sQ0FBQyxDQUFDcE4sSUFBRixFQUFoTyxFQUF5T1ksQ0FBQyxJQUFFd00sQ0FBQyxDQUFDeUcsV0FBRixDQUFjO0FBQUN4VCxRQUFBQSxJQUFJLEVBQUM7QUFBQzBYLFVBQUFBLE9BQU8sRUFBQyxPQUFUO0FBQWlCaFUsVUFBQUEsS0FBSyxFQUFDdkU7QUFBdkI7QUFBTixPQUFkLEVBQStDLENBQUMsQ0FBaEQsQ0FBNU87QUFBK1IsS0FBN3p6QixFQUE4enpCb0IsQ0FBQyxDQUFDMlQsU0FBRixDQUFZRCxtQkFBWixHQUFnQyxZQUFVO0FBQUMsVUFBSTFULENBQUo7QUFBQSxVQUFNcEIsQ0FBTjtBQUFBLFVBQVEyTixDQUFSO0FBQUEsVUFBVUMsQ0FBQyxHQUFDLElBQVo7QUFBQSxVQUFpQkMsQ0FBQyxHQUFDRCxDQUFDLENBQUM5SSxPQUFGLENBQVVnTCxVQUFWLElBQXNCLElBQXpDOztBQUE4QyxVQUFHLFlBQVVsTyxDQUFDLENBQUMwRCxJQUFGLENBQU91SSxDQUFQLENBQVYsSUFBcUJBLENBQUMsQ0FBQzlKLE1BQTFCLEVBQWlDO0FBQUM2SixRQUFBQSxDQUFDLENBQUNpQyxTQUFGLEdBQVlqQyxDQUFDLENBQUM5SSxPQUFGLENBQVUrSyxTQUFWLElBQXFCLFFBQWpDOztBQUEwQyxhQUFJek8sQ0FBSixJQUFTeU0sQ0FBVDtBQUFXLGNBQUdGLENBQUMsR0FBQ0MsQ0FBQyxDQUFDclAsV0FBRixDQUFjd0YsTUFBZCxHQUFxQixDQUF2QixFQUF5QjhKLENBQUMsQ0FBQ3NLLGNBQUYsQ0FBaUIvVyxDQUFqQixDQUE1QixFQUFnRDtBQUFDLGlCQUFJcEIsQ0FBQyxHQUFDNk4sQ0FBQyxDQUFDek0sQ0FBRCxDQUFELENBQUtvYixVQUFYLEVBQXNCN08sQ0FBQyxJQUFFLENBQXpCO0FBQTRCQyxjQUFBQSxDQUFDLENBQUNyUCxXQUFGLENBQWNvUCxDQUFkLEtBQWtCQyxDQUFDLENBQUNyUCxXQUFGLENBQWNvUCxDQUFkLE1BQW1CM04sQ0FBckMsSUFBd0M0TixDQUFDLENBQUNyUCxXQUFGLENBQWNrZSxNQUFkLENBQXFCOU8sQ0FBckIsRUFBdUIsQ0FBdkIsQ0FBeEMsRUFBa0VBLENBQUMsRUFBbkU7QUFBNUI7O0FBQWtHQyxZQUFBQSxDQUFDLENBQUNyUCxXQUFGLENBQWM0YixJQUFkLENBQW1CbmEsQ0FBbkIsR0FBc0I0TixDQUFDLENBQUNrRixrQkFBRixDQUFxQjlTLENBQXJCLElBQXdCNk4sQ0FBQyxDQUFDek0sQ0FBRCxDQUFELENBQUttSixRQUFuRDtBQUE0RDtBQUExTjs7QUFBME5xRCxRQUFBQSxDQUFDLENBQUNyUCxXQUFGLENBQWNtZSxJQUFkLENBQW1CLFVBQVM5YSxDQUFULEVBQVdSLENBQVgsRUFBYTtBQUFDLGlCQUFPd00sQ0FBQyxDQUFDOUksT0FBRixDQUFVMkssV0FBVixHQUFzQjdOLENBQUMsR0FBQ1IsQ0FBeEIsR0FBMEJBLENBQUMsR0FBQ1EsQ0FBbkM7QUFBcUMsU0FBdEU7QUFBd0U7QUFBQyxLQUF0dzBCLEVBQXV3MEJSLENBQUMsQ0FBQzJULFNBQUYsQ0FBWVcsTUFBWixHQUFtQixZQUFVO0FBQUMsVUFBSXRVLENBQUMsR0FBQyxJQUFOO0FBQVdBLE1BQUFBLENBQUMsQ0FBQzhRLE9BQUYsR0FBVTlRLENBQUMsQ0FBQzZRLFdBQUYsQ0FBYzFHLFFBQWQsQ0FBdUJuSyxDQUFDLENBQUMwRCxPQUFGLENBQVV1RyxLQUFqQyxFQUF3Q2xNLFFBQXhDLENBQWlELGFBQWpELENBQVYsRUFBMEVpQyxDQUFDLENBQUMyUSxVQUFGLEdBQWEzUSxDQUFDLENBQUM4USxPQUFGLENBQVVuTyxNQUFqRyxFQUF3RzNDLENBQUMsQ0FBQ2tRLFlBQUYsSUFBZ0JsUSxDQUFDLENBQUMyUSxVQUFsQixJQUE4QixNQUFJM1EsQ0FBQyxDQUFDa1EsWUFBcEMsS0FBbURsUSxDQUFDLENBQUNrUSxZQUFGLEdBQWVsUSxDQUFDLENBQUNrUSxZQUFGLEdBQWVsUSxDQUFDLENBQUMwRCxPQUFGLENBQVVxTCxjQUEzRixDQUF4RyxFQUFtTi9PLENBQUMsQ0FBQzJRLFVBQUYsSUFBYzNRLENBQUMsQ0FBQzBELE9BQUYsQ0FBVW9MLFlBQXhCLEtBQXVDOU8sQ0FBQyxDQUFDa1EsWUFBRixHQUFlLENBQXRELENBQW5OLEVBQTRRbFEsQ0FBQyxDQUFDMFQsbUJBQUYsRUFBNVEsRUFBb1MxVCxDQUFDLENBQUNzWixRQUFGLEVBQXBTLEVBQWlUdFosQ0FBQyxDQUFDK1YsYUFBRixFQUFqVCxFQUFtVS9WLENBQUMsQ0FBQ3VWLFdBQUYsRUFBblUsRUFBbVZ2VixDQUFDLENBQUMwWixZQUFGLEVBQW5WLEVBQW9XMVosQ0FBQyxDQUFDZ2EsZUFBRixFQUFwVyxFQUF3WGhhLENBQUMsQ0FBQzBWLFNBQUYsRUFBeFgsRUFBc1kxVixDQUFDLENBQUNnVyxVQUFGLEVBQXRZLEVBQXFaaFcsQ0FBQyxDQUFDaWEsYUFBRixFQUFyWixFQUF1YWphLENBQUMsQ0FBQzBYLGtCQUFGLEVBQXZhLEVBQThiMVgsQ0FBQyxDQUFDa2EsZUFBRixFQUE5YixFQUFrZGxhLENBQUMsQ0FBQzZXLGVBQUYsQ0FBa0IsQ0FBQyxDQUFuQixFQUFxQixDQUFDLENBQXRCLENBQWxkLEVBQTJlLENBQUMsQ0FBRCxLQUFLN1csQ0FBQyxDQUFDMEQsT0FBRixDQUFVc0ssYUFBZixJQUE4QnhOLENBQUMsQ0FBQ1IsQ0FBQyxDQUFDNlEsV0FBSCxDQUFELENBQWlCMUcsUUFBakIsR0FBNEJwSyxFQUE1QixDQUErQixhQUEvQixFQUE2Q0MsQ0FBQyxDQUFDbVQsYUFBL0MsQ0FBemdCLEVBQXVrQm5ULENBQUMsQ0FBQ2lXLGVBQUYsQ0FBa0IsWUFBVSxPQUFPalcsQ0FBQyxDQUFDa1EsWUFBbkIsR0FBZ0NsUSxDQUFDLENBQUNrUSxZQUFsQyxHQUErQyxDQUFqRSxDQUF2a0IsRUFBMm9CbFEsQ0FBQyxDQUFDb1QsV0FBRixFQUEzb0IsRUFBMnBCcFQsQ0FBQyxDQUFDc1ksWUFBRixFQUEzcEIsRUFBNHFCdFksQ0FBQyxDQUFDK1IsTUFBRixHQUFTLENBQUMvUixDQUFDLENBQUMwRCxPQUFGLENBQVV5SixRQUFoc0IsRUFBeXNCbk4sQ0FBQyxDQUFDNlMsUUFBRixFQUF6c0IsRUFBc3RCN1MsQ0FBQyxDQUFDbVMsT0FBRixDQUFVeE8sT0FBVixDQUFrQixRQUFsQixFQUEyQixDQUFDM0QsQ0FBRCxDQUEzQixDQUF0dEI7QUFBc3ZCLEtBQXRpMkIsRUFBdWkyQkEsQ0FBQyxDQUFDMlQsU0FBRixDQUFZaUUsTUFBWixHQUFtQixZQUFVO0FBQUMsVUFBSTVYLENBQUMsR0FBQyxJQUFOO0FBQVdRLE1BQUFBLENBQUMsQ0FBQ25ELE1BQUQsQ0FBRCxDQUFVMEUsS0FBVixPQUFvQi9CLENBQUMsQ0FBQ3dTLFdBQXRCLEtBQW9DK0ksWUFBWSxDQUFDdmIsQ0FBQyxDQUFDd2IsV0FBSCxDQUFaLEVBQTRCeGIsQ0FBQyxDQUFDd2IsV0FBRixHQUFjbmUsTUFBTSxDQUFDZ08sVUFBUCxDQUFrQixZQUFVO0FBQUNyTCxRQUFBQSxDQUFDLENBQUN3UyxXQUFGLEdBQWNoUyxDQUFDLENBQUNuRCxNQUFELENBQUQsQ0FBVTBFLEtBQVYsRUFBZCxFQUFnQy9CLENBQUMsQ0FBQzZXLGVBQUYsRUFBaEMsRUFBb0Q3VyxDQUFDLENBQUNzUixTQUFGLElBQWF0UixDQUFDLENBQUNvVCxXQUFGLEVBQWpFO0FBQWlGLE9BQTlHLEVBQStHLEVBQS9HLENBQTlFO0FBQWtNLEtBQWx4MkIsRUFBbXgyQnBULENBQUMsQ0FBQzJULFNBQUYsQ0FBWThILFdBQVosR0FBd0J6YixDQUFDLENBQUMyVCxTQUFGLENBQVkrSCxXQUFaLEdBQXdCLFVBQVNsYixDQUFULEVBQVdSLENBQVgsRUFBYXBCLENBQWIsRUFBZTtBQUFDLFVBQUkyTixDQUFDLEdBQUMsSUFBTjtBQUFXLFVBQUcvTCxDQUFDLEdBQUMsYUFBVyxPQUFPQSxDQUFsQixHQUFvQixDQUFDLENBQUQsTUFBTVIsQ0FBQyxHQUFDUSxDQUFSLElBQVcsQ0FBWCxHQUFhK0wsQ0FBQyxDQUFDb0UsVUFBRixHQUFhLENBQTlDLEdBQWdELENBQUMsQ0FBRCxLQUFLM1EsQ0FBTCxHQUFPLEVBQUVRLENBQVQsR0FBV0EsQ0FBN0QsRUFBK0QrTCxDQUFDLENBQUNvRSxVQUFGLEdBQWEsQ0FBYixJQUFnQm5RLENBQUMsR0FBQyxDQUFsQixJQUFxQkEsQ0FBQyxHQUFDK0wsQ0FBQyxDQUFDb0UsVUFBRixHQUFhLENBQXRHLEVBQXdHLE9BQU0sQ0FBQyxDQUFQO0FBQVNwRSxNQUFBQSxDQUFDLENBQUN5SCxNQUFGLElBQVcsQ0FBQyxDQUFELEtBQUtwVixDQUFMLEdBQU8yTixDQUFDLENBQUNzRSxXQUFGLENBQWMxRyxRQUFkLEdBQXlCMUgsTUFBekIsRUFBUCxHQUF5QzhKLENBQUMsQ0FBQ3NFLFdBQUYsQ0FBYzFHLFFBQWQsQ0FBdUIsS0FBS3pHLE9BQUwsQ0FBYXVHLEtBQXBDLEVBQTJDZSxFQUEzQyxDQUE4Q3hLLENBQTlDLEVBQWlEaUMsTUFBakQsRUFBcEQsRUFBOEc4SixDQUFDLENBQUN1RSxPQUFGLEdBQVV2RSxDQUFDLENBQUNzRSxXQUFGLENBQWMxRyxRQUFkLENBQXVCLEtBQUt6RyxPQUFMLENBQWF1RyxLQUFwQyxDQUF4SCxFQUFtS3NDLENBQUMsQ0FBQ3NFLFdBQUYsQ0FBYzFHLFFBQWQsQ0FBdUIsS0FBS3pHLE9BQUwsQ0FBYXVHLEtBQXBDLEVBQTJDb0ssTUFBM0MsRUFBbkssRUFBdU45SCxDQUFDLENBQUNzRSxXQUFGLENBQWN6RyxNQUFkLENBQXFCbUMsQ0FBQyxDQUFDdUUsT0FBdkIsQ0FBdk4sRUFBdVB2RSxDQUFDLENBQUM2RixZQUFGLEdBQWU3RixDQUFDLENBQUN1RSxPQUF4USxFQUFnUnZFLENBQUMsQ0FBQytILE1BQUYsRUFBaFI7QUFBMlIsS0FBMXUzQixFQUEydTNCdFUsQ0FBQyxDQUFDMlQsU0FBRixDQUFZZ0ksTUFBWixHQUFtQixVQUFTbmIsQ0FBVCxFQUFXO0FBQUMsVUFBSVIsQ0FBSjtBQUFBLFVBQU1wQixDQUFOO0FBQUEsVUFBUTJOLENBQUMsR0FBQyxJQUFWO0FBQUEsVUFBZUMsQ0FBQyxHQUFDLEVBQWpCO0FBQW9CLE9BQUMsQ0FBRCxLQUFLRCxDQUFDLENBQUM3SSxPQUFGLENBQVVrTCxHQUFmLEtBQXFCcE8sQ0FBQyxHQUFDLENBQUNBLENBQXhCLEdBQTJCUixDQUFDLEdBQUMsVUFBUXVNLENBQUMsQ0FBQ3lGLFlBQVYsR0FBdUI0QyxJQUFJLENBQUNDLElBQUwsQ0FBVXJVLENBQVYsSUFBYSxJQUFwQyxHQUF5QyxLQUF0RSxFQUE0RTVCLENBQUMsR0FBQyxTQUFPMk4sQ0FBQyxDQUFDeUYsWUFBVCxHQUFzQjRDLElBQUksQ0FBQ0MsSUFBTCxDQUFVclUsQ0FBVixJQUFhLElBQW5DLEdBQXdDLEtBQXRILEVBQTRIZ00sQ0FBQyxDQUFDRCxDQUFDLENBQUN5RixZQUFILENBQUQsR0FBa0J4UixDQUE5SSxFQUFnSixDQUFDLENBQUQsS0FBSytMLENBQUMsQ0FBQzhFLGlCQUFQLEdBQXlCOUUsQ0FBQyxDQUFDc0UsV0FBRixDQUFjeE8sR0FBZCxDQUFrQm1LLENBQWxCLENBQXpCLElBQStDQSxDQUFDLEdBQUMsRUFBRixFQUFLLENBQUMsQ0FBRCxLQUFLRCxDQUFDLENBQUNvRixjQUFQLElBQXVCbkYsQ0FBQyxDQUFDRCxDQUFDLENBQUNpRixRQUFILENBQUQsR0FBYyxlQUFheFIsQ0FBYixHQUFlLElBQWYsR0FBb0JwQixDQUFwQixHQUFzQixHQUFwQyxFQUF3QzJOLENBQUMsQ0FBQ3NFLFdBQUYsQ0FBY3hPLEdBQWQsQ0FBa0JtSyxDQUFsQixDQUEvRCxLQUFzRkEsQ0FBQyxDQUFDRCxDQUFDLENBQUNpRixRQUFILENBQUQsR0FBYyxpQkFBZXhSLENBQWYsR0FBaUIsSUFBakIsR0FBc0JwQixDQUF0QixHQUF3QixRQUF0QyxFQUErQzJOLENBQUMsQ0FBQ3NFLFdBQUYsQ0FBY3hPLEdBQWQsQ0FBa0JtSyxDQUFsQixDQUFySSxDQUFwRCxDQUFoSjtBQUFnVyxLQUE5bjRCLEVBQStuNEJ4TSxDQUFDLENBQUMyVCxTQUFGLENBQVlpSSxhQUFaLEdBQTBCLFlBQVU7QUFBQyxVQUFJcGIsQ0FBQyxHQUFDLElBQU47QUFBVyxPQUFDLENBQUQsS0FBS0EsQ0FBQyxDQUFDa0QsT0FBRixDQUFVOEwsUUFBZixHQUF3QixDQUFDLENBQUQsS0FBS2hQLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVTJKLFVBQWYsSUFBMkI3TSxDQUFDLENBQUMyUSxLQUFGLENBQVE5TyxHQUFSLENBQVk7QUFBQ3daLFFBQUFBLE9BQU8sRUFBQyxTQUFPcmIsQ0FBQyxDQUFDa0QsT0FBRixDQUFVNEo7QUFBMUIsT0FBWixDQUFuRCxJQUEwRzlNLENBQUMsQ0FBQzJRLEtBQUYsQ0FBUW5QLE1BQVIsQ0FBZXhCLENBQUMsQ0FBQ3NRLE9BQUYsQ0FBVThFLEtBQVYsR0FBa0JwQixXQUFsQixDQUE4QixDQUFDLENBQS9CLElBQWtDaFUsQ0FBQyxDQUFDa0QsT0FBRixDQUFVb0wsWUFBM0QsR0FBeUUsQ0FBQyxDQUFELEtBQUt0TyxDQUFDLENBQUNrRCxPQUFGLENBQVUySixVQUFmLElBQTJCN00sQ0FBQyxDQUFDMlEsS0FBRixDQUFROU8sR0FBUixDQUFZO0FBQUN3WixRQUFBQSxPQUFPLEVBQUNyYixDQUFDLENBQUNrRCxPQUFGLENBQVU0SixhQUFWLEdBQXdCO0FBQWpDLE9BQVosQ0FBOU0sR0FBcVE5TSxDQUFDLENBQUM2UCxTQUFGLEdBQVk3UCxDQUFDLENBQUMyUSxLQUFGLENBQVFwUCxLQUFSLEVBQWpSLEVBQWlTdkIsQ0FBQyxDQUFDOFAsVUFBRixHQUFhOVAsQ0FBQyxDQUFDMlEsS0FBRixDQUFRblAsTUFBUixFQUE5UyxFQUErVCxDQUFDLENBQUQsS0FBS3hCLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVThMLFFBQWYsSUFBeUIsQ0FBQyxDQUFELEtBQUtoUCxDQUFDLENBQUNrRCxPQUFGLENBQVU2TCxhQUF4QyxJQUF1RC9PLENBQUMsQ0FBQ29RLFVBQUYsR0FBYWdFLElBQUksQ0FBQ0MsSUFBTCxDQUFVclUsQ0FBQyxDQUFDNlAsU0FBRixHQUFZN1AsQ0FBQyxDQUFDa0QsT0FBRixDQUFVb0wsWUFBaEMsQ0FBYixFQUEyRHRPLENBQUMsQ0FBQ3FRLFdBQUYsQ0FBYzlPLEtBQWQsQ0FBb0I2UyxJQUFJLENBQUNDLElBQUwsQ0FBVXJVLENBQUMsQ0FBQ29RLFVBQUYsR0FBYXBRLENBQUMsQ0FBQ3FRLFdBQUYsQ0FBYzFHLFFBQWQsQ0FBdUIsY0FBdkIsRUFBdUN4SCxNQUE5RCxDQUFwQixDQUFsSCxJQUE4TSxDQUFDLENBQUQsS0FBS25DLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVTZMLGFBQWYsR0FBNkIvTyxDQUFDLENBQUNxUSxXQUFGLENBQWM5TyxLQUFkLENBQW9CLE1BQUl2QixDQUFDLENBQUNtUSxVQUExQixDQUE3QixJQUFvRW5RLENBQUMsQ0FBQ29RLFVBQUYsR0FBYWdFLElBQUksQ0FBQ0MsSUFBTCxDQUFVclUsQ0FBQyxDQUFDNlAsU0FBWixDQUFiLEVBQW9DN1AsQ0FBQyxDQUFDcVEsV0FBRixDQUFjN08sTUFBZCxDQUFxQjRTLElBQUksQ0FBQ0MsSUFBTCxDQUFVclUsQ0FBQyxDQUFDc1EsT0FBRixDQUFVOEUsS0FBVixHQUFrQnBCLFdBQWxCLENBQThCLENBQUMsQ0FBL0IsSUFBa0NoVSxDQUFDLENBQUNxUSxXQUFGLENBQWMxRyxRQUFkLENBQXVCLGNBQXZCLEVBQXVDeEgsTUFBbkYsQ0FBckIsQ0FBeEcsQ0FBN2dCO0FBQXV1QixVQUFJM0MsQ0FBQyxHQUFDUSxDQUFDLENBQUNzUSxPQUFGLENBQVU4RSxLQUFWLEdBQWtCZ0QsVUFBbEIsQ0FBNkIsQ0FBQyxDQUE5QixJQUFpQ3BZLENBQUMsQ0FBQ3NRLE9BQUYsQ0FBVThFLEtBQVYsR0FBa0I3VCxLQUFsQixFQUF2QztBQUFpRSxPQUFDLENBQUQsS0FBS3ZCLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVTZMLGFBQWYsSUFBOEIvTyxDQUFDLENBQUNxUSxXQUFGLENBQWMxRyxRQUFkLENBQXVCLGNBQXZCLEVBQXVDcEksS0FBdkMsQ0FBNkN2QixDQUFDLENBQUNvUSxVQUFGLEdBQWE1USxDQUExRCxDQUE5QjtBQUEyRixLQUFsajZCLEVBQW1qNkJBLENBQUMsQ0FBQzJULFNBQUYsQ0FBWW1JLE9BQVosR0FBb0IsWUFBVTtBQUFDLFVBQUk5YixDQUFKO0FBQUEsVUFBTXBCLENBQUMsR0FBQyxJQUFSO0FBQWFBLE1BQUFBLENBQUMsQ0FBQ2tTLE9BQUYsQ0FBVXhSLElBQVYsQ0FBZSxVQUFTaU4sQ0FBVCxFQUFXQyxDQUFYLEVBQWE7QUFBQ3hNLFFBQUFBLENBQUMsR0FBQ3BCLENBQUMsQ0FBQ2dTLFVBQUYsR0FBYXJFLENBQWIsR0FBZSxDQUFDLENBQWxCLEVBQW9CLENBQUMsQ0FBRCxLQUFLM04sQ0FBQyxDQUFDOEUsT0FBRixDQUFVa0wsR0FBZixHQUFtQnBPLENBQUMsQ0FBQ2dNLENBQUQsQ0FBRCxDQUFLbkssR0FBTCxDQUFTO0FBQUMwWixVQUFBQSxRQUFRLEVBQUMsVUFBVjtBQUFxQkMsVUFBQUEsS0FBSyxFQUFDaGMsQ0FBM0I7QUFBNkI4QixVQUFBQSxHQUFHLEVBQUMsQ0FBakM7QUFBbUM2TixVQUFBQSxNQUFNLEVBQUMvUSxDQUFDLENBQUM4RSxPQUFGLENBQVVpTSxNQUFWLEdBQWlCLENBQTNEO0FBQTZEc0ksVUFBQUEsT0FBTyxFQUFDO0FBQXJFLFNBQVQsQ0FBbkIsR0FBcUd6WCxDQUFDLENBQUNnTSxDQUFELENBQUQsQ0FBS25LLEdBQUwsQ0FBUztBQUFDMFosVUFBQUEsUUFBUSxFQUFDLFVBQVY7QUFBcUJsYSxVQUFBQSxJQUFJLEVBQUM3QixDQUExQjtBQUE0QjhCLFVBQUFBLEdBQUcsRUFBQyxDQUFoQztBQUFrQzZOLFVBQUFBLE1BQU0sRUFBQy9RLENBQUMsQ0FBQzhFLE9BQUYsQ0FBVWlNLE1BQVYsR0FBaUIsQ0FBMUQ7QUFBNERzSSxVQUFBQSxPQUFPLEVBQUM7QUFBcEUsU0FBVCxDQUF6SDtBQUEwTSxPQUF2TyxHQUF5T3JaLENBQUMsQ0FBQ2tTLE9BQUYsQ0FBVTlGLEVBQVYsQ0FBYXBNLENBQUMsQ0FBQ3NSLFlBQWYsRUFBNkI3TixHQUE3QixDQUFpQztBQUFDc04sUUFBQUEsTUFBTSxFQUFDL1EsQ0FBQyxDQUFDOEUsT0FBRixDQUFVaU0sTUFBVixHQUFpQixDQUF6QjtBQUEyQnNJLFFBQUFBLE9BQU8sRUFBQztBQUFuQyxPQUFqQyxDQUF6TztBQUFpVCxLQUFoNTZCLEVBQWk1NkJqWSxDQUFDLENBQUMyVCxTQUFGLENBQVlzSSxTQUFaLEdBQXNCLFlBQVU7QUFBQyxVQUFJemIsQ0FBQyxHQUFDLElBQU47O0FBQVcsVUFBRyxNQUFJQSxDQUFDLENBQUNrRCxPQUFGLENBQVVvTCxZQUFkLElBQTRCLENBQUMsQ0FBRCxLQUFLdE8sQ0FBQyxDQUFDa0QsT0FBRixDQUFVa0osY0FBM0MsSUFBMkQsQ0FBQyxDQUFELEtBQUtwTSxDQUFDLENBQUNrRCxPQUFGLENBQVU4TCxRQUE3RSxFQUFzRjtBQUFDLFlBQUl4UCxDQUFDLEdBQUNRLENBQUMsQ0FBQ3NRLE9BQUYsQ0FBVTlGLEVBQVYsQ0FBYXhLLENBQUMsQ0FBQzBQLFlBQWYsRUFBNkJzRSxXQUE3QixDQUF5QyxDQUFDLENBQTFDLENBQU47QUFBbURoVSxRQUFBQSxDQUFDLENBQUMyUSxLQUFGLENBQVE5TyxHQUFSLENBQVksUUFBWixFQUFxQnJDLENBQXJCO0FBQXdCO0FBQUMsS0FBaG03QixFQUFpbTdCQSxDQUFDLENBQUMyVCxTQUFGLENBQVl1SSxTQUFaLEdBQXNCbGMsQ0FBQyxDQUFDMlQsU0FBRixDQUFZd0ksY0FBWixHQUEyQixZQUFVO0FBQUMsVUFBSW5jLENBQUo7QUFBQSxVQUFNcEIsQ0FBTjtBQUFBLFVBQVEyTixDQUFSO0FBQUEsVUFBVUMsQ0FBVjtBQUFBLFVBQVlDLENBQVo7QUFBQSxVQUFjMEosQ0FBQyxHQUFDLElBQWhCO0FBQUEsVUFBcUJDLENBQUMsR0FBQyxDQUFDLENBQXhCO0FBQTBCLFVBQUcsYUFBVzVWLENBQUMsQ0FBQzBELElBQUYsQ0FBT2MsU0FBUyxDQUFDLENBQUQsQ0FBaEIsQ0FBWCxJQUFpQ3VILENBQUMsR0FBQ3ZILFNBQVMsQ0FBQyxDQUFELENBQVgsRUFBZW9SLENBQUMsR0FBQ3BSLFNBQVMsQ0FBQyxDQUFELENBQTFCLEVBQThCeUgsQ0FBQyxHQUFDLFVBQWpFLElBQTZFLGFBQVdqTSxDQUFDLENBQUMwRCxJQUFGLENBQU9jLFNBQVMsQ0FBQyxDQUFELENBQWhCLENBQVgsS0FBa0N1SCxDQUFDLEdBQUN2SCxTQUFTLENBQUMsQ0FBRCxDQUFYLEVBQWV3SCxDQUFDLEdBQUN4SCxTQUFTLENBQUMsQ0FBRCxDQUExQixFQUE4Qm9SLENBQUMsR0FBQ3BSLFNBQVMsQ0FBQyxDQUFELENBQXpDLEVBQTZDLGlCQUFlQSxTQUFTLENBQUMsQ0FBRCxDQUF4QixJQUE2QixZQUFVeEUsQ0FBQyxDQUFDMEQsSUFBRixDQUFPYyxTQUFTLENBQUMsQ0FBRCxDQUFoQixDQUF2QyxHQUE0RHlILENBQUMsR0FBQyxZQUE5RCxHQUEyRSxLQUFLLENBQUwsS0FBU3pILFNBQVMsQ0FBQyxDQUFELENBQWxCLEtBQXdCeUgsQ0FBQyxHQUFDLFFBQTFCLENBQTFKLENBQTdFLEVBQTRRLGFBQVdBLENBQTFSLEVBQTRSMEosQ0FBQyxDQUFDelMsT0FBRixDQUFVNkksQ0FBVixJQUFhQyxDQUFiLENBQTVSLEtBQWdULElBQUcsZUFBYUMsQ0FBaEIsRUFBa0JqTSxDQUFDLENBQUNsQixJQUFGLENBQU9pTixDQUFQLEVBQVMsVUFBUy9MLENBQVQsRUFBV1IsQ0FBWCxFQUFhO0FBQUNtVyxRQUFBQSxDQUFDLENBQUN6UyxPQUFGLENBQVVsRCxDQUFWLElBQWFSLENBQWI7QUFBZSxPQUF0QyxFQUFsQixLQUErRCxJQUFHLGlCQUFleU0sQ0FBbEIsRUFBb0IsS0FBSTdOLENBQUosSUFBUzROLENBQVQ7QUFBVyxZQUFHLFlBQVVoTSxDQUFDLENBQUMwRCxJQUFGLENBQU9pUyxDQUFDLENBQUN6UyxPQUFGLENBQVVnTCxVQUFqQixDQUFiLEVBQTBDeUgsQ0FBQyxDQUFDelMsT0FBRixDQUFVZ0wsVUFBVixHQUFxQixDQUFDbEMsQ0FBQyxDQUFDNU4sQ0FBRCxDQUFGLENBQXJCLENBQTFDLEtBQTBFO0FBQUMsZUFBSW9CLENBQUMsR0FBQ21XLENBQUMsQ0FBQ3pTLE9BQUYsQ0FBVWdMLFVBQVYsQ0FBcUIvTCxNQUFyQixHQUE0QixDQUFsQyxFQUFvQzNDLENBQUMsSUFBRSxDQUF2QztBQUEwQ21XLFlBQUFBLENBQUMsQ0FBQ3pTLE9BQUYsQ0FBVWdMLFVBQVYsQ0FBcUIxTyxDQUFyQixFQUF3Qm9iLFVBQXhCLEtBQXFDNU8sQ0FBQyxDQUFDNU4sQ0FBRCxDQUFELENBQUt3YyxVQUExQyxJQUFzRGpGLENBQUMsQ0FBQ3pTLE9BQUYsQ0FBVWdMLFVBQVYsQ0FBcUIyTSxNQUFyQixDQUE0QnJiLENBQTVCLEVBQThCLENBQTlCLENBQXRELEVBQXVGQSxDQUFDLEVBQXhGO0FBQTFDOztBQUFxSW1XLFVBQUFBLENBQUMsQ0FBQ3pTLE9BQUYsQ0FBVWdMLFVBQVYsQ0FBcUJxSyxJQUFyQixDQUEwQnZNLENBQUMsQ0FBQzVOLENBQUQsQ0FBM0I7QUFBZ0M7QUFBM1A7QUFBMlB3WCxNQUFBQSxDQUFDLEtBQUdELENBQUMsQ0FBQ25DLE1BQUYsSUFBV21DLENBQUMsQ0FBQzdCLE1BQUYsRUFBZCxDQUFEO0FBQTJCLEtBQWgxOEIsRUFBaTE4QnRVLENBQUMsQ0FBQzJULFNBQUYsQ0FBWVAsV0FBWixHQUF3QixZQUFVO0FBQUMsVUFBSTVTLENBQUMsR0FBQyxJQUFOO0FBQVdBLE1BQUFBLENBQUMsQ0FBQ29iLGFBQUYsSUFBa0JwYixDQUFDLENBQUN5YixTQUFGLEVBQWxCLEVBQWdDLENBQUMsQ0FBRCxLQUFLemIsQ0FBQyxDQUFDa0QsT0FBRixDQUFVcUssSUFBZixHQUFvQnZOLENBQUMsQ0FBQ21iLE1BQUYsQ0FBU25iLENBQUMsQ0FBQ2lZLE9BQUYsQ0FBVWpZLENBQUMsQ0FBQzBQLFlBQVosQ0FBVCxDQUFwQixHQUF3RDFQLENBQUMsQ0FBQ3NiLE9BQUYsRUFBeEYsRUFBb0d0YixDQUFDLENBQUMyUixPQUFGLENBQVV4TyxPQUFWLENBQWtCLGFBQWxCLEVBQWdDLENBQUNuRCxDQUFELENBQWhDLENBQXBHO0FBQXlJLEtBQXhnOUIsRUFBeWc5QlIsQ0FBQyxDQUFDMlQsU0FBRixDQUFZMkYsUUFBWixHQUFxQixZQUFVO0FBQUMsVUFBSTlZLENBQUMsR0FBQyxJQUFOO0FBQUEsVUFBV1IsQ0FBQyxHQUFDL0QsUUFBUSxDQUFDbWdCLElBQVQsQ0FBY3ZkLEtBQTNCO0FBQWlDMkIsTUFBQUEsQ0FBQyxDQUFDd1IsWUFBRixHQUFlLENBQUMsQ0FBRCxLQUFLeFIsQ0FBQyxDQUFDa0QsT0FBRixDQUFVOEwsUUFBZixHQUF3QixLQUF4QixHQUE4QixNQUE3QyxFQUFvRCxVQUFRaFAsQ0FBQyxDQUFDd1IsWUFBVixHQUF1QnhSLENBQUMsQ0FBQzJSLE9BQUYsQ0FBVXBVLFFBQVYsQ0FBbUIsZ0JBQW5CLENBQXZCLEdBQTREeUMsQ0FBQyxDQUFDMlIsT0FBRixDQUFVblUsV0FBVixDQUFzQixnQkFBdEIsQ0FBaEgsRUFBd0osS0FBSyxDQUFMLEtBQVNnQyxDQUFDLENBQUNxYyxnQkFBWCxJQUE2QixLQUFLLENBQUwsS0FBU3JjLENBQUMsQ0FBQ3NjLGFBQXhDLElBQXVELEtBQUssQ0FBTCxLQUFTdGMsQ0FBQyxDQUFDdWMsWUFBbEUsSUFBZ0YsQ0FBQyxDQUFELEtBQUsvYixDQUFDLENBQUNrRCxPQUFGLENBQVUyTCxNQUFmLEtBQXdCN08sQ0FBQyxDQUFDbVIsY0FBRixHQUFpQixDQUFDLENBQTFDLENBQXhPLEVBQXFSblIsQ0FBQyxDQUFDa0QsT0FBRixDQUFVcUssSUFBVixLQUFpQixZQUFVLE9BQU92TixDQUFDLENBQUNrRCxPQUFGLENBQVVpTSxNQUEzQixHQUFrQ25QLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVWlNLE1BQVYsR0FBaUIsQ0FBakIsS0FBcUJuUCxDQUFDLENBQUNrRCxPQUFGLENBQVVpTSxNQUFWLEdBQWlCLENBQXRDLENBQWxDLEdBQTJFblAsQ0FBQyxDQUFDa0QsT0FBRixDQUFVaU0sTUFBVixHQUFpQm5QLENBQUMsQ0FBQ2tNLFFBQUYsQ0FBV2lELE1BQXhILENBQXJSLEVBQXFaLEtBQUssQ0FBTCxLQUFTM1AsQ0FBQyxDQUFDd2MsVUFBWCxLQUF3QmhjLENBQUMsQ0FBQ2dSLFFBQUYsR0FBVyxZQUFYLEVBQXdCaFIsQ0FBQyxDQUFDNlIsYUFBRixHQUFnQixjQUF4QyxFQUF1RDdSLENBQUMsQ0FBQzhSLGNBQUYsR0FBaUIsYUFBeEUsRUFBc0YsS0FBSyxDQUFMLEtBQVN0UyxDQUFDLENBQUN5YyxtQkFBWCxJQUFnQyxLQUFLLENBQUwsS0FBU3pjLENBQUMsQ0FBQzBjLGlCQUEzQyxLQUErRGxjLENBQUMsQ0FBQ2dSLFFBQUYsR0FBVyxDQUFDLENBQTNFLENBQTlHLENBQXJaLEVBQWtsQixLQUFLLENBQUwsS0FBU3hSLENBQUMsQ0FBQzJjLFlBQVgsS0FBMEJuYyxDQUFDLENBQUNnUixRQUFGLEdBQVcsY0FBWCxFQUEwQmhSLENBQUMsQ0FBQzZSLGFBQUYsR0FBZ0IsZ0JBQTFDLEVBQTJEN1IsQ0FBQyxDQUFDOFIsY0FBRixHQUFpQixlQUE1RSxFQUE0RixLQUFLLENBQUwsS0FBU3RTLENBQUMsQ0FBQ3ljLG1CQUFYLElBQWdDLEtBQUssQ0FBTCxLQUFTemMsQ0FBQyxDQUFDNGMsY0FBM0MsS0FBNERwYyxDQUFDLENBQUNnUixRQUFGLEdBQVcsQ0FBQyxDQUF4RSxDQUF0SCxDQUFsbEIsRUFBb3hCLEtBQUssQ0FBTCxLQUFTeFIsQ0FBQyxDQUFDNmMsZUFBWCxLQUE2QnJjLENBQUMsQ0FBQ2dSLFFBQUYsR0FBVyxpQkFBWCxFQUE2QmhSLENBQUMsQ0FBQzZSLGFBQUYsR0FBZ0IsbUJBQTdDLEVBQWlFN1IsQ0FBQyxDQUFDOFIsY0FBRixHQUFpQixrQkFBbEYsRUFBcUcsS0FBSyxDQUFMLEtBQVN0UyxDQUFDLENBQUN5YyxtQkFBWCxJQUFnQyxLQUFLLENBQUwsS0FBU3pjLENBQUMsQ0FBQzBjLGlCQUEzQyxLQUErRGxjLENBQUMsQ0FBQ2dSLFFBQUYsR0FBVyxDQUFDLENBQTNFLENBQWxJLENBQXB4QixFQUFxK0IsS0FBSyxDQUFMLEtBQVN4UixDQUFDLENBQUM4YyxXQUFYLEtBQXlCdGMsQ0FBQyxDQUFDZ1IsUUFBRixHQUFXLGFBQVgsRUFBeUJoUixDQUFDLENBQUM2UixhQUFGLEdBQWdCLGVBQXpDLEVBQXlEN1IsQ0FBQyxDQUFDOFIsY0FBRixHQUFpQixjQUExRSxFQUF5RixLQUFLLENBQUwsS0FBU3RTLENBQUMsQ0FBQzhjLFdBQVgsS0FBeUJ0YyxDQUFDLENBQUNnUixRQUFGLEdBQVcsQ0FBQyxDQUFyQyxDQUFsSCxDQUFyK0IsRUFBZ29DLEtBQUssQ0FBTCxLQUFTeFIsQ0FBQyxDQUFDc0wsU0FBWCxJQUFzQixDQUFDLENBQUQsS0FBSzlLLENBQUMsQ0FBQ2dSLFFBQTdCLEtBQXdDaFIsQ0FBQyxDQUFDZ1IsUUFBRixHQUFXLFdBQVgsRUFBdUJoUixDQUFDLENBQUM2UixhQUFGLEdBQWdCLFdBQXZDLEVBQW1EN1IsQ0FBQyxDQUFDOFIsY0FBRixHQUFpQixZQUE1RyxDQUFob0MsRUFBMHZDOVIsQ0FBQyxDQUFDNlEsaUJBQUYsR0FBb0I3USxDQUFDLENBQUNrRCxPQUFGLENBQVU0TCxZQUFWLElBQXdCLFNBQU85TyxDQUFDLENBQUNnUixRQUFqQyxJQUEyQyxDQUFDLENBQUQsS0FBS2hSLENBQUMsQ0FBQ2dSLFFBQWgwQztBQUF5MEMsS0FBbjUvQixFQUFvNS9CeFIsQ0FBQyxDQUFDMlQsU0FBRixDQUFZc0MsZUFBWixHQUE0QixVQUFTelYsQ0FBVCxFQUFXO0FBQUMsVUFBSVIsQ0FBSjtBQUFBLFVBQU1wQixDQUFOO0FBQUEsVUFBUTJOLENBQVI7QUFBQSxVQUFVQyxDQUFWO0FBQUEsVUFBWUMsQ0FBQyxHQUFDLElBQWQ7O0FBQW1CLFVBQUc3TixDQUFDLEdBQUM2TixDQUFDLENBQUMwRixPQUFGLENBQVVsUyxJQUFWLENBQWUsY0FBZixFQUErQmpDLFdBQS9CLENBQTJDLHlDQUEzQyxFQUFzRmQsSUFBdEYsQ0FBMkYsYUFBM0YsRUFBeUcsTUFBekcsQ0FBRixFQUFtSHVQLENBQUMsQ0FBQ3FFLE9BQUYsQ0FBVTlGLEVBQVYsQ0FBYXhLLENBQWIsRUFBZ0J6QyxRQUFoQixDQUF5QixlQUF6QixDQUFuSCxFQUE2SixDQUFDLENBQUQsS0FBSzBPLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVTJKLFVBQS9LLEVBQTBMO0FBQUMsWUFBSThJLENBQUMsR0FBQzFKLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVW9MLFlBQVYsR0FBdUIsQ0FBdkIsSUFBMEIsQ0FBMUIsR0FBNEIsQ0FBNUIsR0FBOEIsQ0FBcEM7QUFBc0M5TyxRQUFBQSxDQUFDLEdBQUM0VSxJQUFJLENBQUM4RCxLQUFMLENBQVdqTSxDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUFWLEdBQXVCLENBQWxDLENBQUYsRUFBdUMsQ0FBQyxDQUFELEtBQUtyQyxDQUFDLENBQUMvSSxPQUFGLENBQVV3SyxRQUFmLEtBQTBCMU4sQ0FBQyxJQUFFUixDQUFILElBQU1RLENBQUMsSUFBRWlNLENBQUMsQ0FBQ2tFLFVBQUYsR0FBYSxDQUFiLEdBQWUzUSxDQUF4QixHQUEwQnlNLENBQUMsQ0FBQ3FFLE9BQUYsQ0FBVTJKLEtBQVYsQ0FBZ0JqYSxDQUFDLEdBQUNSLENBQUYsR0FBSW1XLENBQXBCLEVBQXNCM1YsQ0FBQyxHQUFDUixDQUFGLEdBQUksQ0FBMUIsRUFBNkJqQyxRQUE3QixDQUFzQyxjQUF0QyxFQUFzRGIsSUFBdEQsQ0FBMkQsYUFBM0QsRUFBeUUsT0FBekUsQ0FBMUIsSUFBNkdxUCxDQUFDLEdBQUNFLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVW9MLFlBQVYsR0FBdUJ0TyxDQUF6QixFQUEyQjVCLENBQUMsQ0FBQzZiLEtBQUYsQ0FBUWxPLENBQUMsR0FBQ3ZNLENBQUYsR0FBSSxDQUFKLEdBQU1tVyxDQUFkLEVBQWdCNUosQ0FBQyxHQUFDdk0sQ0FBRixHQUFJLENBQXBCLEVBQXVCakMsUUFBdkIsQ0FBZ0MsY0FBaEMsRUFBZ0RiLElBQWhELENBQXFELGFBQXJELEVBQW1FLE9BQW5FLENBQXhJLEdBQXFOLE1BQUlzRCxDQUFKLEdBQU01QixDQUFDLENBQUNvTSxFQUFGLENBQUtwTSxDQUFDLENBQUMrRCxNQUFGLEdBQVMsQ0FBVCxHQUFXOEosQ0FBQyxDQUFDL0ksT0FBRixDQUFVb0wsWUFBMUIsRUFBd0MvUSxRQUF4QyxDQUFpRCxjQUFqRCxDQUFOLEdBQXVFeUMsQ0FBQyxLQUFHaU0sQ0FBQyxDQUFDa0UsVUFBRixHQUFhLENBQWpCLElBQW9CL1IsQ0FBQyxDQUFDb00sRUFBRixDQUFLeUIsQ0FBQyxDQUFDL0ksT0FBRixDQUFVb0wsWUFBZixFQUE2Qi9RLFFBQTdCLENBQXNDLGNBQXRDLENBQTFVLENBQXZDLEVBQXdhME8sQ0FBQyxDQUFDcUUsT0FBRixDQUFVOUYsRUFBVixDQUFheEssQ0FBYixFQUFnQnpDLFFBQWhCLENBQXlCLGNBQXpCLENBQXhhO0FBQWlkLE9BQWxyQixNQUF1ckJ5QyxDQUFDLElBQUUsQ0FBSCxJQUFNQSxDQUFDLElBQUVpTSxDQUFDLENBQUNrRSxVQUFGLEdBQWFsRSxDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUFoQyxHQUE2Q3JDLENBQUMsQ0FBQ3FFLE9BQUYsQ0FBVTJKLEtBQVYsQ0FBZ0JqYSxDQUFoQixFQUFrQkEsQ0FBQyxHQUFDaU0sQ0FBQyxDQUFDL0ksT0FBRixDQUFVb0wsWUFBOUIsRUFBNEMvUSxRQUE1QyxDQUFxRCxjQUFyRCxFQUFxRWIsSUFBckUsQ0FBMEUsYUFBMUUsRUFBd0YsT0FBeEYsQ0FBN0MsR0FBOEkwQixDQUFDLENBQUMrRCxNQUFGLElBQVU4SixDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUFwQixHQUFpQ2xRLENBQUMsQ0FBQ2IsUUFBRixDQUFXLGNBQVgsRUFBMkJiLElBQTNCLENBQWdDLGFBQWhDLEVBQThDLE9BQTlDLENBQWpDLElBQXlGc1AsQ0FBQyxHQUFDQyxDQUFDLENBQUNrRSxVQUFGLEdBQWFsRSxDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUF6QixFQUFzQ3ZDLENBQUMsR0FBQyxDQUFDLENBQUQsS0FBS0UsQ0FBQyxDQUFDL0ksT0FBRixDQUFVd0ssUUFBZixHQUF3QnpCLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVW9MLFlBQVYsR0FBdUJ0TyxDQUEvQyxHQUFpREEsQ0FBekYsRUFBMkZpTSxDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUFWLElBQXdCckMsQ0FBQyxDQUFDL0ksT0FBRixDQUFVcUwsY0FBbEMsSUFBa0R0QyxDQUFDLENBQUNrRSxVQUFGLEdBQWFuUSxDQUFiLEdBQWVpTSxDQUFDLENBQUMvSSxPQUFGLENBQVVvTCxZQUEzRSxHQUF3RmxRLENBQUMsQ0FBQzZiLEtBQUYsQ0FBUWxPLENBQUMsSUFBRUUsQ0FBQyxDQUFDL0ksT0FBRixDQUFVb0wsWUFBVixHQUF1QnRDLENBQXpCLENBQVQsRUFBcUNELENBQUMsR0FBQ0MsQ0FBdkMsRUFBMEN6TyxRQUExQyxDQUFtRCxjQUFuRCxFQUFtRWIsSUFBbkUsQ0FBd0UsYUFBeEUsRUFBc0YsT0FBdEYsQ0FBeEYsR0FBdUwwQixDQUFDLENBQUM2YixLQUFGLENBQVFsTyxDQUFSLEVBQVVBLENBQUMsR0FBQ0UsQ0FBQyxDQUFDL0ksT0FBRixDQUFVb0wsWUFBdEIsRUFBb0MvUSxRQUFwQyxDQUE2QyxjQUE3QyxFQUE2RGIsSUFBN0QsQ0FBa0UsYUFBbEUsRUFBZ0YsT0FBaEYsQ0FBM1csQ0FBOUk7O0FBQW1sQixxQkFBYXVQLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVTBLLFFBQXZCLElBQWlDLGtCQUFnQjNCLENBQUMsQ0FBQy9JLE9BQUYsQ0FBVTBLLFFBQTNELElBQXFFM0IsQ0FBQyxDQUFDMkIsUUFBRixFQUFyRTtBQUFrRixLQUEzeWlDLEVBQTR5aUNwTyxDQUFDLENBQUMyVCxTQUFGLENBQVlvQyxhQUFaLEdBQTBCLFlBQVU7QUFBQyxVQUFJL1YsQ0FBSjtBQUFBLFVBQU1wQixDQUFOO0FBQUEsVUFBUTJOLENBQVI7QUFBQSxVQUFVQyxDQUFDLEdBQUMsSUFBWjs7QUFBaUIsVUFBRyxDQUFDLENBQUQsS0FBS0EsQ0FBQyxDQUFDOUksT0FBRixDQUFVcUssSUFBZixLQUFzQnZCLENBQUMsQ0FBQzlJLE9BQUYsQ0FBVTJKLFVBQVYsR0FBcUIsQ0FBQyxDQUE1QyxHQUErQyxDQUFDLENBQUQsS0FBS2IsQ0FBQyxDQUFDOUksT0FBRixDQUFVd0ssUUFBZixJQUF5QixDQUFDLENBQUQsS0FBSzFCLENBQUMsQ0FBQzlJLE9BQUYsQ0FBVXFLLElBQXhDLEtBQStDblAsQ0FBQyxHQUFDLElBQUYsRUFBTzROLENBQUMsQ0FBQ21FLFVBQUYsR0FBYW5FLENBQUMsQ0FBQzlJLE9BQUYsQ0FBVW9MLFlBQTdFLENBQWxELEVBQTZJO0FBQUMsYUFBSXZDLENBQUMsR0FBQyxDQUFDLENBQUQsS0FBS0MsQ0FBQyxDQUFDOUksT0FBRixDQUFVMkosVUFBZixHQUEwQmIsQ0FBQyxDQUFDOUksT0FBRixDQUFVb0wsWUFBVixHQUF1QixDQUFqRCxHQUFtRHRDLENBQUMsQ0FBQzlJLE9BQUYsQ0FBVW9MLFlBQS9ELEVBQTRFOU8sQ0FBQyxHQUFDd00sQ0FBQyxDQUFDbUUsVUFBcEYsRUFBK0YzUSxDQUFDLEdBQUN3TSxDQUFDLENBQUNtRSxVQUFGLEdBQWFwRSxDQUE5RyxFQUFnSHZNLENBQUMsSUFBRSxDQUFuSDtBQUFxSHBCLFVBQUFBLENBQUMsR0FBQ29CLENBQUMsR0FBQyxDQUFKLEVBQU1RLENBQUMsQ0FBQ2dNLENBQUMsQ0FBQ3NFLE9BQUYsQ0FBVWxTLENBQVYsQ0FBRCxDQUFELENBQWdCbWUsS0FBaEIsQ0FBc0IsQ0FBQyxDQUF2QixFQUEwQjdmLElBQTFCLENBQStCLElBQS9CLEVBQW9DLEVBQXBDLEVBQXdDQSxJQUF4QyxDQUE2QyxrQkFBN0MsRUFBZ0UwQixDQUFDLEdBQUM0TixDQUFDLENBQUNtRSxVQUFwRSxFQUFnRnlELFNBQWhGLENBQTBGNUgsQ0FBQyxDQUFDcUUsV0FBNUYsRUFBeUc5UyxRQUF6RyxDQUFrSCxjQUFsSCxDQUFOO0FBQXJIOztBQUE2UCxhQUFJaUMsQ0FBQyxHQUFDLENBQU4sRUFBUUEsQ0FBQyxHQUFDdU0sQ0FBQyxHQUFDQyxDQUFDLENBQUNtRSxVQUFkLEVBQXlCM1EsQ0FBQyxJQUFFLENBQTVCO0FBQThCcEIsVUFBQUEsQ0FBQyxHQUFDb0IsQ0FBRixFQUFJUSxDQUFDLENBQUNnTSxDQUFDLENBQUNzRSxPQUFGLENBQVVsUyxDQUFWLENBQUQsQ0FBRCxDQUFnQm1lLEtBQWhCLENBQXNCLENBQUMsQ0FBdkIsRUFBMEI3ZixJQUExQixDQUErQixJQUEvQixFQUFvQyxFQUFwQyxFQUF3Q0EsSUFBeEMsQ0FBNkMsa0JBQTdDLEVBQWdFMEIsQ0FBQyxHQUFDNE4sQ0FBQyxDQUFDbUUsVUFBcEUsRUFBZ0ZzRCxRQUFoRixDQUF5RnpILENBQUMsQ0FBQ3FFLFdBQTNGLEVBQXdHOVMsUUFBeEcsQ0FBaUgsY0FBakgsQ0FBSjtBQUE5Qjs7QUFBbUt5TyxRQUFBQSxDQUFDLENBQUNxRSxXQUFGLENBQWM1USxJQUFkLENBQW1CLGVBQW5CLEVBQW9DQSxJQUFwQyxDQUF5QyxNQUF6QyxFQUFpRFgsSUFBakQsQ0FBc0QsWUFBVTtBQUFDa0IsVUFBQUEsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRdEQsSUFBUixDQUFhLElBQWIsRUFBa0IsRUFBbEI7QUFBc0IsU0FBdkY7QUFBeUY7QUFBQyxLQUExK2pDLEVBQTIrakM4QyxDQUFDLENBQUMyVCxTQUFGLENBQVk2RCxTQUFaLEdBQXNCLFVBQVNoWCxDQUFULEVBQVc7QUFBQyxVQUFJUixDQUFDLEdBQUMsSUFBTjtBQUFXUSxNQUFBQSxDQUFDLElBQUVSLENBQUMsQ0FBQzZTLFFBQUYsRUFBSCxFQUFnQjdTLENBQUMsQ0FBQzZSLFdBQUYsR0FBY3JSLENBQTlCO0FBQWdDLEtBQXhqa0MsRUFBeWprQ1IsQ0FBQyxDQUFDMlQsU0FBRixDQUFZUixhQUFaLEdBQTBCLFVBQVNuVCxDQUFULEVBQVc7QUFBQyxVQUFJcEIsQ0FBQyxHQUFDLElBQU47QUFBQSxVQUFXMk4sQ0FBQyxHQUFDL0wsQ0FBQyxDQUFDUixDQUFDLENBQUMrSSxNQUFILENBQUQsQ0FBWUQsRUFBWixDQUFlLGNBQWYsSUFBK0J0SSxDQUFDLENBQUNSLENBQUMsQ0FBQytJLE1BQUgsQ0FBaEMsR0FBMkN2SSxDQUFDLENBQUNSLENBQUMsQ0FBQytJLE1BQUgsQ0FBRCxDQUFZeUMsT0FBWixDQUFvQixjQUFwQixDQUF4RDtBQUFBLFVBQTRGZ0IsQ0FBQyxHQUFDNk0sUUFBUSxDQUFDOU0sQ0FBQyxDQUFDclAsSUFBRixDQUFPLGtCQUFQLENBQUQsQ0FBdEc7QUFBbUlzUCxNQUFBQSxDQUFDLEtBQUdBLENBQUMsR0FBQyxDQUFMLENBQUQsRUFBUzVOLENBQUMsQ0FBQytSLFVBQUYsSUFBYy9SLENBQUMsQ0FBQzhFLE9BQUYsQ0FBVW9MLFlBQXhCLEdBQXFDbFEsQ0FBQyxDQUFDd1csWUFBRixDQUFlNUksQ0FBZixFQUFpQixDQUFDLENBQWxCLEVBQW9CLENBQUMsQ0FBckIsQ0FBckMsR0FBNkQ1TixDQUFDLENBQUN3VyxZQUFGLENBQWU1SSxDQUFmLENBQXRFO0FBQXdGLEtBQTF6a0MsRUFBMnprQ3hNLENBQUMsQ0FBQzJULFNBQUYsQ0FBWXlCLFlBQVosR0FBeUIsVUFBUzVVLENBQVQsRUFBV1IsQ0FBWCxFQUFhcEIsQ0FBYixFQUFlO0FBQUMsVUFBSTJOLENBQUo7QUFBQSxVQUFNQyxDQUFOO0FBQUEsVUFBUUMsQ0FBUjtBQUFBLFVBQVUwSixDQUFWO0FBQUEsVUFBWUMsQ0FBWjtBQUFBLFVBQWNFLENBQUMsR0FBQyxJQUFoQjtBQUFBLFVBQXFCQyxDQUFDLEdBQUMsSUFBdkI7QUFBNEIsVUFBR3ZXLENBQUMsR0FBQ0EsQ0FBQyxJQUFFLENBQUMsQ0FBTixFQUFRLEVBQUUsQ0FBQyxDQUFELEtBQUt1VyxDQUFDLENBQUMxRyxTQUFQLElBQWtCLENBQUMsQ0FBRCxLQUFLMEcsQ0FBQyxDQUFDN1MsT0FBRixDQUFVZ00sY0FBakMsSUFBaUQsQ0FBQyxDQUFELEtBQUs2RyxDQUFDLENBQUM3UyxPQUFGLENBQVVxSyxJQUFmLElBQXFCd0ksQ0FBQyxDQUFDckcsWUFBRixLQUFpQjFQLENBQXpGLENBQVgsRUFBdUcsSUFBRyxDQUFDLENBQUQsS0FBS1IsQ0FBTCxJQUFRdVcsQ0FBQyxDQUFDdkosUUFBRixDQUFXeE0sQ0FBWCxDQUFSLEVBQXNCK0wsQ0FBQyxHQUFDL0wsQ0FBeEIsRUFBMEI4VixDQUFDLEdBQUNDLENBQUMsQ0FBQ2tDLE9BQUYsQ0FBVWxNLENBQVYsQ0FBNUIsRUFBeUM0SixDQUFDLEdBQUNJLENBQUMsQ0FBQ2tDLE9BQUYsQ0FBVWxDLENBQUMsQ0FBQ3JHLFlBQVosQ0FBM0MsRUFBcUVxRyxDQUFDLENBQUN0RyxXQUFGLEdBQWMsU0FBT3NHLENBQUMsQ0FBQ3RGLFNBQVQsR0FBbUJrRixDQUFuQixHQUFxQkksQ0FBQyxDQUFDdEYsU0FBMUcsRUFBb0gsQ0FBQyxDQUFELEtBQUtzRixDQUFDLENBQUM3UyxPQUFGLENBQVV3SyxRQUFmLElBQXlCLENBQUMsQ0FBRCxLQUFLcUksQ0FBQyxDQUFDN1MsT0FBRixDQUFVMkosVUFBeEMsS0FBcUQ3TSxDQUFDLEdBQUMsQ0FBRixJQUFLQSxDQUFDLEdBQUMrVixDQUFDLENBQUNaLFdBQUYsS0FBZ0JZLENBQUMsQ0FBQzdTLE9BQUYsQ0FBVXFMLGNBQXRGLENBQXZILEVBQTZOLENBQUMsQ0FBRCxLQUFLd0gsQ0FBQyxDQUFDN1MsT0FBRixDQUFVcUssSUFBZixLQUFzQnhCLENBQUMsR0FBQ2dLLENBQUMsQ0FBQ3JHLFlBQUosRUFBaUIsQ0FBQyxDQUFELEtBQUt0UixDQUFMLEdBQU8yWCxDQUFDLENBQUM5QixZQUFGLENBQWUwQixDQUFmLEVBQWlCLFlBQVU7QUFBQ0ksUUFBQUEsQ0FBQyxDQUFDeUUsU0FBRixDQUFZek8sQ0FBWjtBQUFlLE9BQTNDLENBQVAsR0FBb0RnSyxDQUFDLENBQUN5RSxTQUFGLENBQVl6TyxDQUFaLENBQTNGLEVBQTdOLEtBQTZVLElBQUcsQ0FBQyxDQUFELEtBQUtnSyxDQUFDLENBQUM3UyxPQUFGLENBQVV3SyxRQUFmLElBQXlCLENBQUMsQ0FBRCxLQUFLcUksQ0FBQyxDQUFDN1MsT0FBRixDQUFVMkosVUFBeEMsS0FBcUQ3TSxDQUFDLEdBQUMsQ0FBRixJQUFLQSxDQUFDLEdBQUMrVixDQUFDLENBQUM1RixVQUFGLEdBQWE0RixDQUFDLENBQUM3UyxPQUFGLENBQVVxTCxjQUFuRixDQUFILEVBQXNHLENBQUMsQ0FBRCxLQUFLd0gsQ0FBQyxDQUFDN1MsT0FBRixDQUFVcUssSUFBZixLQUFzQnhCLENBQUMsR0FBQ2dLLENBQUMsQ0FBQ3JHLFlBQUosRUFBaUIsQ0FBQyxDQUFELEtBQUt0UixDQUFMLEdBQU8yWCxDQUFDLENBQUM5QixZQUFGLENBQWUwQixDQUFmLEVBQWlCLFlBQVU7QUFBQ0ksUUFBQUEsQ0FBQyxDQUFDeUUsU0FBRixDQUFZek8sQ0FBWjtBQUFlLE9BQTNDLENBQVAsR0FBb0RnSyxDQUFDLENBQUN5RSxTQUFGLENBQVl6TyxDQUFaLENBQTNGLEVBQXRHLEtBQXFOO0FBQUMsWUFBR2dLLENBQUMsQ0FBQzdTLE9BQUYsQ0FBVXlKLFFBQVYsSUFBb0JtSSxhQUFhLENBQUNpQixDQUFDLENBQUN4RyxhQUFILENBQWpDLEVBQW1EdkQsQ0FBQyxHQUFDRCxDQUFDLEdBQUMsQ0FBRixHQUFJZ0ssQ0FBQyxDQUFDNUYsVUFBRixHQUFhNEYsQ0FBQyxDQUFDN1MsT0FBRixDQUFVcUwsY0FBdkIsSUFBdUMsQ0FBdkMsR0FBeUN3SCxDQUFDLENBQUM1RixVQUFGLEdBQWE0RixDQUFDLENBQUM1RixVQUFGLEdBQWE0RixDQUFDLENBQUM3UyxPQUFGLENBQVVxTCxjQUE3RSxHQUE0RndILENBQUMsQ0FBQzVGLFVBQUYsR0FBYXBFLENBQTdHLEdBQStHQSxDQUFDLElBQUVnSyxDQUFDLENBQUM1RixVQUFMLEdBQWdCNEYsQ0FBQyxDQUFDNUYsVUFBRixHQUFhNEYsQ0FBQyxDQUFDN1MsT0FBRixDQUFVcUwsY0FBdkIsSUFBdUMsQ0FBdkMsR0FBeUMsQ0FBekMsR0FBMkN4QyxDQUFDLEdBQUNnSyxDQUFDLENBQUM1RixVQUEvRCxHQUEwRXBFLENBQTlPLEVBQWdQZ0ssQ0FBQyxDQUFDMUcsU0FBRixHQUFZLENBQUMsQ0FBN1AsRUFBK1AwRyxDQUFDLENBQUNwRSxPQUFGLENBQVV4TyxPQUFWLENBQWtCLGNBQWxCLEVBQWlDLENBQUM0UyxDQUFELEVBQUdBLENBQUMsQ0FBQ3JHLFlBQUwsRUFBa0IxRCxDQUFsQixDQUFqQyxDQUEvUCxFQUFzVEMsQ0FBQyxHQUFDOEosQ0FBQyxDQUFDckcsWUFBMVQsRUFBdVVxRyxDQUFDLENBQUNyRyxZQUFGLEdBQWUxRCxDQUF0VixFQUF3VitKLENBQUMsQ0FBQ04sZUFBRixDQUFrQk0sQ0FBQyxDQUFDckcsWUFBcEIsQ0FBeFYsRUFBMFhxRyxDQUFDLENBQUM3UyxPQUFGLENBQVVzSixRQUFWLElBQW9CLENBQUNvSixDQUFDLEdBQUMsQ0FBQ0EsQ0FBQyxHQUFDRyxDQUFDLENBQUNyQixZQUFGLEVBQUgsRUFBcUJDLEtBQXJCLENBQTJCLFVBQTNCLENBQUgsRUFBMkN4RSxVQUEzQyxJQUF1RHlGLENBQUMsQ0FBQzFTLE9BQUYsQ0FBVW9MLFlBQXJGLElBQW1Hc0gsQ0FBQyxDQUFDSCxlQUFGLENBQWtCTSxDQUFDLENBQUNyRyxZQUFwQixDQUE3ZCxFQUErZnFHLENBQUMsQ0FBQ1AsVUFBRixFQUEvZixFQUE4Z0JPLENBQUMsQ0FBQ21ELFlBQUYsRUFBOWdCLEVBQStoQixDQUFDLENBQUQsS0FBS25ELENBQUMsQ0FBQzdTLE9BQUYsQ0FBVXFLLElBQWpqQixFQUFzakIsT0FBTSxDQUFDLENBQUQsS0FBS25QLENBQUwsSUFBUTJYLENBQUMsQ0FBQzJCLFlBQUYsQ0FBZXpMLENBQWYsR0FBa0I4SixDQUFDLENBQUN5QixTQUFGLENBQVl4TCxDQUFaLEVBQWMsWUFBVTtBQUFDK0osVUFBQUEsQ0FBQyxDQUFDeUUsU0FBRixDQUFZeE8sQ0FBWjtBQUFlLFNBQXhDLENBQTFCLElBQXFFK0osQ0FBQyxDQUFDeUUsU0FBRixDQUFZeE8sQ0FBWixDQUFyRSxFQUFvRixLQUFLK0osQ0FBQyxDQUFDaEMsYUFBRixFQUEvRjtBQUFpSCxTQUFDLENBQUQsS0FBSzNWLENBQUwsR0FBTzJYLENBQUMsQ0FBQzlCLFlBQUYsQ0FBZTZCLENBQWYsRUFBaUIsWUFBVTtBQUFDQyxVQUFBQSxDQUFDLENBQUN5RSxTQUFGLENBQVl4TyxDQUFaO0FBQWUsU0FBM0MsQ0FBUCxHQUFvRCtKLENBQUMsQ0FBQ3lFLFNBQUYsQ0FBWXhPLENBQVosQ0FBcEQ7QUFBbUU7QUFBQyxLQUFydm5DLEVBQXN2bkN4TSxDQUFDLENBQUMyVCxTQUFGLENBQVk0RixTQUFaLEdBQXNCLFlBQVU7QUFBQyxVQUFJL1ksQ0FBQyxHQUFDLElBQU47QUFBVyxPQUFDLENBQUQsS0FBS0EsQ0FBQyxDQUFDa0QsT0FBRixDQUFVcUosTUFBZixJQUF1QnZNLENBQUMsQ0FBQ21RLFVBQUYsR0FBYW5RLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVW9MLFlBQTlDLEtBQTZEdE8sQ0FBQyxDQUFDaVEsVUFBRixDQUFhMUYsSUFBYixJQUFvQnZLLENBQUMsQ0FBQ2dRLFVBQUYsQ0FBYXpGLElBQWIsRUFBakYsR0FBc0csQ0FBQyxDQUFELEtBQUt2SyxDQUFDLENBQUNrRCxPQUFGLENBQVVnSyxJQUFmLElBQXFCbE4sQ0FBQyxDQUFDbVEsVUFBRixHQUFhblEsQ0FBQyxDQUFDa0QsT0FBRixDQUFVb0wsWUFBNUMsSUFBMER0TyxDQUFDLENBQUM0UCxLQUFGLENBQVFyRixJQUFSLEVBQWhLLEVBQStLdkssQ0FBQyxDQUFDMlIsT0FBRixDQUFVcFUsUUFBVixDQUFtQixlQUFuQixDQUEvSztBQUFtTixLQUFyL25DLEVBQXMvbkNpQyxDQUFDLENBQUMyVCxTQUFGLENBQVlxSixjQUFaLEdBQTJCLFlBQVU7QUFBQyxVQUFJeGMsQ0FBSjtBQUFBLFVBQU1SLENBQU47QUFBQSxVQUFRcEIsQ0FBUjtBQUFBLFVBQVUyTixDQUFWO0FBQUEsVUFBWUMsQ0FBQyxHQUFDLElBQWQ7QUFBbUIsYUFBT2hNLENBQUMsR0FBQ2dNLENBQUMsQ0FBQzRFLFdBQUYsQ0FBYzZMLE1BQWQsR0FBcUJ6USxDQUFDLENBQUM0RSxXQUFGLENBQWM4TCxJQUFyQyxFQUEwQ2xkLENBQUMsR0FBQ3dNLENBQUMsQ0FBQzRFLFdBQUYsQ0FBYytMLE1BQWQsR0FBcUIzUSxDQUFDLENBQUM0RSxXQUFGLENBQWNnTSxJQUEvRSxFQUFvRnhlLENBQUMsR0FBQ2dXLElBQUksQ0FBQ3lJLEtBQUwsQ0FBV3JkLENBQVgsRUFBYVEsQ0FBYixDQUF0RixFQUFzRyxDQUFDK0wsQ0FBQyxHQUFDcUksSUFBSSxDQUFDMEksS0FBTCxDQUFXLE1BQUkxZSxDQUFKLEdBQU1nVyxJQUFJLENBQUMySSxFQUF0QixDQUFILElBQThCLENBQTlCLEtBQWtDaFIsQ0FBQyxHQUFDLE1BQUlxSSxJQUFJLENBQUNzRSxHQUFMLENBQVMzTSxDQUFULENBQXhDLENBQXRHLEVBQTJKQSxDQUFDLElBQUUsRUFBSCxJQUFPQSxDQUFDLElBQUUsQ0FBVixHQUFZLENBQUMsQ0FBRCxLQUFLQyxDQUFDLENBQUM5SSxPQUFGLENBQVVrTCxHQUFmLEdBQW1CLE1BQW5CLEdBQTBCLE9BQXRDLEdBQThDckMsQ0FBQyxJQUFFLEdBQUgsSUFBUUEsQ0FBQyxJQUFFLEdBQVgsR0FBZSxDQUFDLENBQUQsS0FBS0MsQ0FBQyxDQUFDOUksT0FBRixDQUFVa0wsR0FBZixHQUFtQixNQUFuQixHQUEwQixPQUF6QyxHQUFpRHJDLENBQUMsSUFBRSxHQUFILElBQVFBLENBQUMsSUFBRSxHQUFYLEdBQWUsQ0FBQyxDQUFELEtBQUtDLENBQUMsQ0FBQzlJLE9BQUYsQ0FBVWtMLEdBQWYsR0FBbUIsT0FBbkIsR0FBMkIsTUFBMUMsR0FBaUQsQ0FBQyxDQUFELEtBQUtwQyxDQUFDLENBQUM5SSxPQUFGLENBQVUrTCxlQUFmLEdBQStCbEQsQ0FBQyxJQUFFLEVBQUgsSUFBT0EsQ0FBQyxJQUFFLEdBQVYsR0FBYyxNQUFkLEdBQXFCLElBQXBELEdBQXlELFVBQTNXO0FBQXNYLEtBQXI2b0MsRUFBczZvQ3ZNLENBQUMsQ0FBQzJULFNBQUYsQ0FBWTZKLFFBQVosR0FBcUIsVUFBU2hkLENBQVQsRUFBVztBQUFDLFVBQUlSLENBQUo7QUFBQSxVQUFNcEIsQ0FBTjtBQUFBLFVBQVEyTixDQUFDLEdBQUMsSUFBVjtBQUFlLFVBQUdBLENBQUMsQ0FBQ3VELFFBQUYsR0FBVyxDQUFDLENBQVosRUFBY3ZELENBQUMsQ0FBQzJFLE9BQUYsR0FBVSxDQUFDLENBQXpCLEVBQTJCM0UsQ0FBQyxDQUFDbUUsU0FBaEMsRUFBMEMsT0FBT25FLENBQUMsQ0FBQ21FLFNBQUYsR0FBWSxDQUFDLENBQWIsRUFBZSxDQUFDLENBQXZCO0FBQXlCLFVBQUduRSxDQUFDLENBQUNzRixXQUFGLEdBQWMsQ0FBQyxDQUFmLEVBQWlCdEYsQ0FBQyxDQUFDMkYsV0FBRixHQUFjLEVBQUUzRixDQUFDLENBQUM2RSxXQUFGLENBQWNxTSxXQUFkLEdBQTBCLEVBQTVCLENBQS9CLEVBQStELEtBQUssQ0FBTCxLQUFTbFIsQ0FBQyxDQUFDNkUsV0FBRixDQUFjOEwsSUFBekYsRUFBOEYsT0FBTSxDQUFDLENBQVA7O0FBQVMsVUFBRyxDQUFDLENBQUQsS0FBSzNRLENBQUMsQ0FBQzZFLFdBQUYsQ0FBY3NNLE9BQW5CLElBQTRCblIsQ0FBQyxDQUFDNEYsT0FBRixDQUFVeE8sT0FBVixDQUFrQixNQUFsQixFQUF5QixDQUFDNEksQ0FBRCxFQUFHQSxDQUFDLENBQUN5USxjQUFGLEVBQUgsQ0FBekIsQ0FBNUIsRUFBNkV6USxDQUFDLENBQUM2RSxXQUFGLENBQWNxTSxXQUFkLElBQTJCbFIsQ0FBQyxDQUFDNkUsV0FBRixDQUFjdU0sUUFBekgsRUFBa0k7QUFBQyxnQkFBTy9lLENBQUMsR0FBQzJOLENBQUMsQ0FBQ3lRLGNBQUYsRUFBVDtBQUE2QixlQUFJLE1BQUo7QUFBVyxlQUFJLE1BQUo7QUFBV2hkLFlBQUFBLENBQUMsR0FBQ3VNLENBQUMsQ0FBQzdJLE9BQUYsQ0FBVXdMLFlBQVYsR0FBdUIzQyxDQUFDLENBQUM2SyxjQUFGLENBQWlCN0ssQ0FBQyxDQUFDMkQsWUFBRixHQUFlM0QsQ0FBQyxDQUFDME0sYUFBRixFQUFoQyxDQUF2QixHQUEwRTFNLENBQUMsQ0FBQzJELFlBQUYsR0FBZTNELENBQUMsQ0FBQzBNLGFBQUYsRUFBM0YsRUFBNkcxTSxDQUFDLENBQUN5RCxnQkFBRixHQUFtQixDQUFoSTtBQUFrSTs7QUFBTSxlQUFJLE9BQUo7QUFBWSxlQUFJLElBQUo7QUFBU2hRLFlBQUFBLENBQUMsR0FBQ3VNLENBQUMsQ0FBQzdJLE9BQUYsQ0FBVXdMLFlBQVYsR0FBdUIzQyxDQUFDLENBQUM2SyxjQUFGLENBQWlCN0ssQ0FBQyxDQUFDMkQsWUFBRixHQUFlM0QsQ0FBQyxDQUFDME0sYUFBRixFQUFoQyxDQUF2QixHQUEwRTFNLENBQUMsQ0FBQzJELFlBQUYsR0FBZTNELENBQUMsQ0FBQzBNLGFBQUYsRUFBM0YsRUFBNkcxTSxDQUFDLENBQUN5RCxnQkFBRixHQUFtQixDQUFoSTtBQUFoTjs7QUFBa1Ysc0JBQVlwUixDQUFaLEtBQWdCMk4sQ0FBQyxDQUFDNkksWUFBRixDQUFlcFYsQ0FBZixHQUFrQnVNLENBQUMsQ0FBQzZFLFdBQUYsR0FBYyxFQUFoQyxFQUFtQzdFLENBQUMsQ0FBQzRGLE9BQUYsQ0FBVXhPLE9BQVYsQ0FBa0IsT0FBbEIsRUFBMEIsQ0FBQzRJLENBQUQsRUFBRzNOLENBQUgsQ0FBMUIsQ0FBbkQ7QUFBcUYsT0FBMWlCLE1BQStpQjJOLENBQUMsQ0FBQzZFLFdBQUYsQ0FBYzZMLE1BQWQsS0FBdUIxUSxDQUFDLENBQUM2RSxXQUFGLENBQWM4TCxJQUFyQyxLQUE0QzNRLENBQUMsQ0FBQzZJLFlBQUYsQ0FBZTdJLENBQUMsQ0FBQzJELFlBQWpCLEdBQStCM0QsQ0FBQyxDQUFDNkUsV0FBRixHQUFjLEVBQXpGO0FBQTZGLEtBQTV3cUMsRUFBNndxQ3BSLENBQUMsQ0FBQzJULFNBQUYsQ0FBWU4sWUFBWixHQUF5QixVQUFTN1MsQ0FBVCxFQUFXO0FBQUMsVUFBSVIsQ0FBQyxHQUFDLElBQU47QUFBVyxVQUFHLEVBQUUsQ0FBQyxDQUFELEtBQUtBLENBQUMsQ0FBQzBELE9BQUYsQ0FBVXVMLEtBQWYsSUFBc0IsZ0JBQWVoVCxRQUFmLElBQXlCLENBQUMsQ0FBRCxLQUFLK0QsQ0FBQyxDQUFDMEQsT0FBRixDQUFVdUwsS0FBOUQsSUFBcUUsQ0FBQyxDQUFELEtBQUtqUCxDQUFDLENBQUMwRCxPQUFGLENBQVVrSyxTQUFmLElBQTBCLENBQUMsQ0FBRCxLQUFLcE4sQ0FBQyxDQUFDMEQsSUFBRixDQUFPMFYsT0FBUCxDQUFlLE9BQWYsQ0FBdEcsQ0FBSCxFQUFrSSxRQUFPNVosQ0FBQyxDQUFDb1IsV0FBRixDQUFjd00sV0FBZCxHQUEwQnBkLENBQUMsQ0FBQ3FkLGFBQUYsSUFBaUIsS0FBSyxDQUFMLEtBQVNyZCxDQUFDLENBQUNxZCxhQUFGLENBQWdCQyxPQUExQyxHQUFrRHRkLENBQUMsQ0FBQ3FkLGFBQUYsQ0FBZ0JDLE9BQWhCLENBQXdCbmIsTUFBMUUsR0FBaUYsQ0FBM0csRUFBNkczQyxDQUFDLENBQUNvUixXQUFGLENBQWN1TSxRQUFkLEdBQXVCM2QsQ0FBQyxDQUFDcVEsU0FBRixHQUFZclEsQ0FBQyxDQUFDMEQsT0FBRixDQUFVMEwsY0FBMUosRUFBeUssQ0FBQyxDQUFELEtBQUtwUCxDQUFDLENBQUMwRCxPQUFGLENBQVUrTCxlQUFmLEtBQWlDelAsQ0FBQyxDQUFDb1IsV0FBRixDQUFjdU0sUUFBZCxHQUF1QjNkLENBQUMsQ0FBQ3NRLFVBQUYsR0FBYXRRLENBQUMsQ0FBQzBELE9BQUYsQ0FBVTBMLGNBQS9FLENBQXpLLEVBQXdRNU8sQ0FBQyxDQUFDZixJQUFGLENBQU8wYSxNQUF0UjtBQUE4UixhQUFJLE9BQUo7QUFBWW5hLFVBQUFBLENBQUMsQ0FBQytkLFVBQUYsQ0FBYXZkLENBQWI7QUFBZ0I7O0FBQU0sYUFBSSxNQUFKO0FBQVdSLFVBQUFBLENBQUMsQ0FBQ2dlLFNBQUYsQ0FBWXhkLENBQVo7QUFBZTs7QUFBTSxhQUFJLEtBQUo7QUFBVVIsVUFBQUEsQ0FBQyxDQUFDd2QsUUFBRixDQUFXaGQsQ0FBWDtBQUExVztBQUF5WCxLQUF4enJDLEVBQXl6ckNSLENBQUMsQ0FBQzJULFNBQUYsQ0FBWXFLLFNBQVosR0FBc0IsVUFBU3hkLENBQVQsRUFBVztBQUFDLFVBQUlSLENBQUo7QUFBQSxVQUFNcEIsQ0FBTjtBQUFBLFVBQVEyTixDQUFSO0FBQUEsVUFBVUMsQ0FBVjtBQUFBLFVBQVlDLENBQVo7QUFBQSxVQUFjMEosQ0FBZDtBQUFBLFVBQWdCQyxDQUFDLEdBQUMsSUFBbEI7QUFBdUIsYUFBTzNKLENBQUMsR0FBQyxLQUFLLENBQUwsS0FBU2pNLENBQUMsQ0FBQ3FkLGFBQVgsR0FBeUJyZCxDQUFDLENBQUNxZCxhQUFGLENBQWdCQyxPQUF6QyxHQUFpRCxJQUFuRCxFQUF3RCxFQUFFLENBQUMxSCxDQUFDLENBQUN0RyxRQUFILElBQWFzRyxDQUFDLENBQUMxRixTQUFmLElBQTBCakUsQ0FBQyxJQUFFLE1BQUlBLENBQUMsQ0FBQzlKLE1BQXJDLE1BQStDM0MsQ0FBQyxHQUFDb1csQ0FBQyxDQUFDcUMsT0FBRixDQUFVckMsQ0FBQyxDQUFDbEcsWUFBWixDQUFGLEVBQTRCa0csQ0FBQyxDQUFDaEYsV0FBRixDQUFjOEwsSUFBZCxHQUFtQixLQUFLLENBQUwsS0FBU3pRLENBQVQsR0FBV0EsQ0FBQyxDQUFDLENBQUQsQ0FBRCxDQUFLeEssS0FBaEIsR0FBc0J6QixDQUFDLENBQUN5ZCxPQUF2RSxFQUErRTdILENBQUMsQ0FBQ2hGLFdBQUYsQ0FBY2dNLElBQWQsR0FBbUIsS0FBSyxDQUFMLEtBQVMzUSxDQUFULEdBQVdBLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBS3ZLLEtBQWhCLEdBQXNCMUIsQ0FBQyxDQUFDMGQsT0FBMUgsRUFBa0k5SCxDQUFDLENBQUNoRixXQUFGLENBQWNxTSxXQUFkLEdBQTBCN0ksSUFBSSxDQUFDMEksS0FBTCxDQUFXMUksSUFBSSxDQUFDdUosSUFBTCxDQUFVdkosSUFBSSxDQUFDd0osR0FBTCxDQUFTaEksQ0FBQyxDQUFDaEYsV0FBRixDQUFjOEwsSUFBZCxHQUFtQjlHLENBQUMsQ0FBQ2hGLFdBQUYsQ0FBYzZMLE1BQTFDLEVBQWlELENBQWpELENBQVYsQ0FBWCxDQUE1SixFQUF1TzlHLENBQUMsR0FBQ3ZCLElBQUksQ0FBQzBJLEtBQUwsQ0FBVzFJLElBQUksQ0FBQ3VKLElBQUwsQ0FBVXZKLElBQUksQ0FBQ3dKLEdBQUwsQ0FBU2hJLENBQUMsQ0FBQ2hGLFdBQUYsQ0FBY2dNLElBQWQsR0FBbUJoSCxDQUFDLENBQUNoRixXQUFGLENBQWMrTCxNQUExQyxFQUFpRCxDQUFqRCxDQUFWLENBQVgsQ0FBek8sRUFBb1QsQ0FBQy9HLENBQUMsQ0FBQzFTLE9BQUYsQ0FBVStMLGVBQVgsSUFBNEIsQ0FBQzJHLENBQUMsQ0FBQ2xGLE9BQS9CLElBQXdDaUYsQ0FBQyxHQUFDLENBQTFDLElBQTZDQyxDQUFDLENBQUMxRixTQUFGLEdBQVksQ0FBQyxDQUFiLEVBQWUsQ0FBQyxDQUE3RCxLQUFpRSxDQUFDLENBQUQsS0FBSzBGLENBQUMsQ0FBQzFTLE9BQUYsQ0FBVStMLGVBQWYsS0FBaUMyRyxDQUFDLENBQUNoRixXQUFGLENBQWNxTSxXQUFkLEdBQTBCdEgsQ0FBM0QsR0FBOER2WCxDQUFDLEdBQUN3WCxDQUFDLENBQUM0RyxjQUFGLEVBQWhFLEVBQW1GLEtBQUssQ0FBTCxLQUFTeGMsQ0FBQyxDQUFDcWQsYUFBWCxJQUEwQnpILENBQUMsQ0FBQ2hGLFdBQUYsQ0FBY3FNLFdBQWQsR0FBMEIsQ0FBcEQsS0FBd0RySCxDQUFDLENBQUNsRixPQUFGLEdBQVUsQ0FBQyxDQUFYLEVBQWExUSxDQUFDLENBQUM2SCxjQUFGLEVBQXJFLENBQW5GLEVBQTRLbUUsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFELEtBQUs0SixDQUFDLENBQUMxUyxPQUFGLENBQVVrTCxHQUFmLEdBQW1CLENBQW5CLEdBQXFCLENBQUMsQ0FBdkIsS0FBMkJ3SCxDQUFDLENBQUNoRixXQUFGLENBQWM4TCxJQUFkLEdBQW1COUcsQ0FBQyxDQUFDaEYsV0FBRixDQUFjNkwsTUFBakMsR0FBd0MsQ0FBeEMsR0FBMEMsQ0FBQyxDQUF0RSxDQUE5SyxFQUF1UCxDQUFDLENBQUQsS0FBSzdHLENBQUMsQ0FBQzFTLE9BQUYsQ0FBVStMLGVBQWYsS0FBaUNqRCxDQUFDLEdBQUM0SixDQUFDLENBQUNoRixXQUFGLENBQWNnTSxJQUFkLEdBQW1CaEgsQ0FBQyxDQUFDaEYsV0FBRixDQUFjK0wsTUFBakMsR0FBd0MsQ0FBeEMsR0FBMEMsQ0FBQyxDQUE5RSxDQUF2UCxFQUF3VTVRLENBQUMsR0FBQzZKLENBQUMsQ0FBQ2hGLFdBQUYsQ0FBY3FNLFdBQXhWLEVBQW9XckgsQ0FBQyxDQUFDaEYsV0FBRixDQUFjc00sT0FBZCxHQUFzQixDQUFDLENBQTNYLEVBQTZYLENBQUMsQ0FBRCxLQUFLdEgsQ0FBQyxDQUFDMVMsT0FBRixDQUFVd0ssUUFBZixLQUEwQixNQUFJa0ksQ0FBQyxDQUFDbEcsWUFBTixJQUFvQixZQUFVdFIsQ0FBOUIsSUFBaUN3WCxDQUFDLENBQUNsRyxZQUFGLElBQWdCa0csQ0FBQyxDQUFDVCxXQUFGLEVBQWhCLElBQWlDLFdBQVMvVyxDQUFyRyxNQUEwRzJOLENBQUMsR0FBQzZKLENBQUMsQ0FBQ2hGLFdBQUYsQ0FBY3FNLFdBQWQsR0FBMEJySCxDQUFDLENBQUMxUyxPQUFGLENBQVVvSyxZQUF0QyxFQUFtRHNJLENBQUMsQ0FBQ2hGLFdBQUYsQ0FBY3NNLE9BQWQsR0FBc0IsQ0FBQyxDQUFwTCxDQUE3WCxFQUFvakIsQ0FBQyxDQUFELEtBQUt0SCxDQUFDLENBQUMxUyxPQUFGLENBQVU4TCxRQUFmLEdBQXdCNEcsQ0FBQyxDQUFDbkYsU0FBRixHQUFZalIsQ0FBQyxHQUFDdU0sQ0FBQyxHQUFDQyxDQUF4QyxHQUEwQzRKLENBQUMsQ0FBQ25GLFNBQUYsR0FBWWpSLENBQUMsR0FBQ3VNLENBQUMsSUFBRTZKLENBQUMsQ0FBQ2pGLEtBQUYsQ0FBUW5QLE1BQVIsS0FBaUJvVSxDQUFDLENBQUMvRixTQUFyQixDQUFELEdBQWlDN0QsQ0FBN29CLEVBQStvQixDQUFDLENBQUQsS0FBSzRKLENBQUMsQ0FBQzFTLE9BQUYsQ0FBVStMLGVBQWYsS0FBaUMyRyxDQUFDLENBQUNuRixTQUFGLEdBQVlqUixDQUFDLEdBQUN1TSxDQUFDLEdBQUNDLENBQWpELENBQS9vQixFQUFtc0IsQ0FBQyxDQUFELEtBQUs0SixDQUFDLENBQUMxUyxPQUFGLENBQVVxSyxJQUFmLElBQXFCLENBQUMsQ0FBRCxLQUFLcUksQ0FBQyxDQUFDMVMsT0FBRixDQUFVeUwsU0FBcEMsS0FBZ0QsQ0FBQyxDQUFELEtBQUtpSCxDQUFDLENBQUN2RyxTQUFQLElBQWtCdUcsQ0FBQyxDQUFDbkYsU0FBRixHQUFZLElBQVosRUFBaUIsQ0FBQyxDQUFwQyxJQUF1QyxLQUFLbUYsQ0FBQyxDQUFDdUYsTUFBRixDQUFTdkYsQ0FBQyxDQUFDbkYsU0FBWCxDQUE1RixDQUFwd0IsQ0FBblcsQ0FBL0Q7QUFBMnhDLEtBQTdvdUMsRUFBOG91Q2pSLENBQUMsQ0FBQzJULFNBQUYsQ0FBWW9LLFVBQVosR0FBdUIsVUFBU3ZkLENBQVQsRUFBVztBQUFDLFVBQUlSLENBQUo7QUFBQSxVQUFNcEIsQ0FBQyxHQUFDLElBQVI7QUFBYSxVQUFHQSxDQUFDLENBQUNpVCxXQUFGLEdBQWMsQ0FBQyxDQUFmLEVBQWlCLE1BQUlqVCxDQUFDLENBQUN3UyxXQUFGLENBQWN3TSxXQUFsQixJQUErQmhmLENBQUMsQ0FBQytSLFVBQUYsSUFBYy9SLENBQUMsQ0FBQzhFLE9BQUYsQ0FBVW9MLFlBQTNFLEVBQXdGLE9BQU9sUSxDQUFDLENBQUN3UyxXQUFGLEdBQWMsRUFBZCxFQUFpQixDQUFDLENBQXpCO0FBQTJCLFdBQUssQ0FBTCxLQUFTNVEsQ0FBQyxDQUFDcWQsYUFBWCxJQUEwQixLQUFLLENBQUwsS0FBU3JkLENBQUMsQ0FBQ3FkLGFBQUYsQ0FBZ0JDLE9BQW5ELEtBQTZEOWQsQ0FBQyxHQUFDUSxDQUFDLENBQUNxZCxhQUFGLENBQWdCQyxPQUFoQixDQUF3QixDQUF4QixDQUEvRCxHQUEyRmxmLENBQUMsQ0FBQ3dTLFdBQUYsQ0FBYzZMLE1BQWQsR0FBcUJyZSxDQUFDLENBQUN3UyxXQUFGLENBQWM4TCxJQUFkLEdBQW1CLEtBQUssQ0FBTCxLQUFTbGQsQ0FBVCxHQUFXQSxDQUFDLENBQUNpQyxLQUFiLEdBQW1CekIsQ0FBQyxDQUFDeWQsT0FBeEosRUFBZ0tyZixDQUFDLENBQUN3UyxXQUFGLENBQWMrTCxNQUFkLEdBQXFCdmUsQ0FBQyxDQUFDd1MsV0FBRixDQUFjZ00sSUFBZCxHQUFtQixLQUFLLENBQUwsS0FBU3BkLENBQVQsR0FBV0EsQ0FBQyxDQUFDa0MsS0FBYixHQUFtQjFCLENBQUMsQ0FBQzBkLE9BQTdOLEVBQXFPdGYsQ0FBQyxDQUFDa1IsUUFBRixHQUFXLENBQUMsQ0FBalA7QUFBbVAsS0FBcGl2QyxFQUFxaXZDOVAsQ0FBQyxDQUFDMlQsU0FBRixDQUFZMEssY0FBWixHQUEyQnJlLENBQUMsQ0FBQzJULFNBQUYsQ0FBWTJLLGFBQVosR0FBMEIsWUFBVTtBQUFDLFVBQUk5ZCxDQUFDLEdBQUMsSUFBTjtBQUFXLGVBQU9BLENBQUMsQ0FBQzRSLFlBQVQsS0FBd0I1UixDQUFDLENBQUN3VCxNQUFGLElBQVd4VCxDQUFDLENBQUNxUSxXQUFGLENBQWMxRyxRQUFkLENBQXVCLEtBQUt6RyxPQUFMLENBQWF1RyxLQUFwQyxFQUEyQ29LLE1BQTNDLEVBQVgsRUFBK0Q3VCxDQUFDLENBQUM0UixZQUFGLENBQWU2QixRQUFmLENBQXdCelQsQ0FBQyxDQUFDcVEsV0FBMUIsQ0FBL0QsRUFBc0dyUSxDQUFDLENBQUM4VCxNQUFGLEVBQTlIO0FBQTBJLEtBQTF2dkMsRUFBMnZ2Q3RVLENBQUMsQ0FBQzJULFNBQUYsQ0FBWUssTUFBWixHQUFtQixZQUFVO0FBQUMsVUFBSWhVLENBQUMsR0FBQyxJQUFOO0FBQVdRLE1BQUFBLENBQUMsQ0FBQyxlQUFELEVBQWlCUixDQUFDLENBQUNtUyxPQUFuQixDQUFELENBQTZCMVAsTUFBN0IsSUFBc0N6QyxDQUFDLENBQUNvUSxLQUFGLElBQVNwUSxDQUFDLENBQUNvUSxLQUFGLENBQVEzTixNQUFSLEVBQS9DLEVBQWdFekMsQ0FBQyxDQUFDeVEsVUFBRixJQUFjelEsQ0FBQyxDQUFDeVQsUUFBRixDQUFXaFAsSUFBWCxDQUFnQnpFLENBQUMsQ0FBQzBELE9BQUYsQ0FBVXVKLFNBQTFCLENBQWQsSUFBb0RqTixDQUFDLENBQUN5USxVQUFGLENBQWFoTyxNQUFiLEVBQXBILEVBQTBJekMsQ0FBQyxDQUFDd1EsVUFBRixJQUFjeFEsQ0FBQyxDQUFDeVQsUUFBRixDQUFXaFAsSUFBWCxDQUFnQnpFLENBQUMsQ0FBQzBELE9BQUYsQ0FBVXdKLFNBQTFCLENBQWQsSUFBb0RsTixDQUFDLENBQUN3USxVQUFGLENBQWEvTixNQUFiLEVBQTlMLEVBQW9OekMsQ0FBQyxDQUFDOFEsT0FBRixDQUFVOVMsV0FBVixDQUFzQixzREFBdEIsRUFBOEVkLElBQTlFLENBQW1GLGFBQW5GLEVBQWlHLE1BQWpHLEVBQXlHbUYsR0FBekcsQ0FBNkcsT0FBN0csRUFBcUgsRUFBckgsQ0FBcE47QUFBNlUsS0FBam53QyxFQUFrbndDckMsQ0FBQyxDQUFDMlQsU0FBRixDQUFZcUQsT0FBWixHQUFvQixVQUFTeFcsQ0FBVCxFQUFXO0FBQUMsVUFBSVIsQ0FBQyxHQUFDLElBQU47QUFBV0EsTUFBQUEsQ0FBQyxDQUFDbVMsT0FBRixDQUFVeE8sT0FBVixDQUFrQixTQUFsQixFQUE0QixDQUFDM0QsQ0FBRCxFQUFHUSxDQUFILENBQTVCLEdBQW1DUixDQUFDLENBQUMrWCxPQUFGLEVBQW5DO0FBQStDLEtBQTVzd0MsRUFBNnN3Qy9YLENBQUMsQ0FBQzJULFNBQUYsQ0FBWStGLFlBQVosR0FBeUIsWUFBVTtBQUFDLFVBQUlsWixDQUFDLEdBQUMsSUFBTjtBQUFXb1UsTUFBQUEsSUFBSSxDQUFDOEQsS0FBTCxDQUFXbFksQ0FBQyxDQUFDa0QsT0FBRixDQUFVb0wsWUFBVixHQUF1QixDQUFsQyxHQUFxQyxDQUFDLENBQUQsS0FBS3RPLENBQUMsQ0FBQ2tELE9BQUYsQ0FBVXFKLE1BQWYsSUFBdUJ2TSxDQUFDLENBQUNtUSxVQUFGLEdBQWFuUSxDQUFDLENBQUNrRCxPQUFGLENBQVVvTCxZQUE5QyxJQUE0RCxDQUFDdE8sQ0FBQyxDQUFDa0QsT0FBRixDQUFVd0ssUUFBdkUsS0FBa0YxTixDQUFDLENBQUNpUSxVQUFGLENBQWF6UyxXQUFiLENBQXlCLGdCQUF6QixFQUEyQ2QsSUFBM0MsQ0FBZ0QsZUFBaEQsRUFBZ0UsT0FBaEUsR0FBeUVzRCxDQUFDLENBQUNnUSxVQUFGLENBQWF4UyxXQUFiLENBQXlCLGdCQUF6QixFQUEyQ2QsSUFBM0MsQ0FBZ0QsZUFBaEQsRUFBZ0UsT0FBaEUsQ0FBekUsRUFBa0osTUFBSXNELENBQUMsQ0FBQzBQLFlBQU4sSUFBb0IxUCxDQUFDLENBQUNpUSxVQUFGLENBQWExUyxRQUFiLENBQXNCLGdCQUF0QixFQUF3Q2IsSUFBeEMsQ0FBNkMsZUFBN0MsRUFBNkQsTUFBN0QsR0FBcUVzRCxDQUFDLENBQUNnUSxVQUFGLENBQWF4UyxXQUFiLENBQXlCLGdCQUF6QixFQUEyQ2QsSUFBM0MsQ0FBZ0QsZUFBaEQsRUFBZ0UsT0FBaEUsQ0FBekYsSUFBbUtzRCxDQUFDLENBQUMwUCxZQUFGLElBQWdCMVAsQ0FBQyxDQUFDbVEsVUFBRixHQUFhblEsQ0FBQyxDQUFDa0QsT0FBRixDQUFVb0wsWUFBdkMsSUFBcUQsQ0FBQyxDQUFELEtBQUt0TyxDQUFDLENBQUNrRCxPQUFGLENBQVUySixVQUFwRSxJQUFnRjdNLENBQUMsQ0FBQ2dRLFVBQUYsQ0FBYXpTLFFBQWIsQ0FBc0IsZ0JBQXRCLEVBQXdDYixJQUF4QyxDQUE2QyxlQUE3QyxFQUE2RCxNQUE3RCxHQUFxRXNELENBQUMsQ0FBQ2lRLFVBQUYsQ0FBYXpTLFdBQWIsQ0FBeUIsZ0JBQXpCLEVBQTJDZCxJQUEzQyxDQUFnRCxlQUFoRCxFQUFnRSxPQUFoRSxDQUFySixJQUErTnNELENBQUMsQ0FBQzBQLFlBQUYsSUFBZ0IxUCxDQUFDLENBQUNtUSxVQUFGLEdBQWEsQ0FBN0IsSUFBZ0MsQ0FBQyxDQUFELEtBQUtuUSxDQUFDLENBQUNrRCxPQUFGLENBQVUySixVQUEvQyxLQUE0RDdNLENBQUMsQ0FBQ2dRLFVBQUYsQ0FBYXpTLFFBQWIsQ0FBc0IsZ0JBQXRCLEVBQXdDYixJQUF4QyxDQUE2QyxlQUE3QyxFQUE2RCxNQUE3RCxHQUFxRXNELENBQUMsQ0FBQ2lRLFVBQUYsQ0FBYXpTLFdBQWIsQ0FBeUIsZ0JBQXpCLEVBQTJDZCxJQUEzQyxDQUFnRCxlQUFoRCxFQUFnRSxPQUFoRSxDQUFqSSxDQUF0bUIsQ0FBckM7QUFBdTFCLEtBQW5seUMsRUFBb2x5QzhDLENBQUMsQ0FBQzJULFNBQUYsQ0FBWXFDLFVBQVosR0FBdUIsWUFBVTtBQUFDLFVBQUl4VixDQUFDLEdBQUMsSUFBTjtBQUFXLGVBQU9BLENBQUMsQ0FBQzRQLEtBQVQsS0FBaUI1UCxDQUFDLENBQUM0UCxLQUFGLENBQVFuUSxJQUFSLENBQWEsSUFBYixFQUFtQmpDLFdBQW5CLENBQStCLGNBQS9CLEVBQStDK2IsR0FBL0MsSUFBcUR2WixDQUFDLENBQUM0UCxLQUFGLENBQVFuUSxJQUFSLENBQWEsSUFBYixFQUFtQitLLEVBQW5CLENBQXNCNEosSUFBSSxDQUFDOEQsS0FBTCxDQUFXbFksQ0FBQyxDQUFDMFAsWUFBRixHQUFlMVAsQ0FBQyxDQUFDa0QsT0FBRixDQUFVcUwsY0FBcEMsQ0FBdEIsRUFBMkVoUixRQUEzRSxDQUFvRixjQUFwRixDQUF0RTtBQUEySyxLQUE1eXlDLEVBQTZ5eUNpQyxDQUFDLENBQUMyVCxTQUFGLENBQVk4RCxVQUFaLEdBQXVCLFlBQVU7QUFBQyxVQUFJalgsQ0FBQyxHQUFDLElBQU47QUFBV0EsTUFBQUEsQ0FBQyxDQUFDa0QsT0FBRixDQUFVeUosUUFBVixLQUFxQmxSLFFBQVEsQ0FBQ3VFLENBQUMsQ0FBQ3NSLE1BQUgsQ0FBUixHQUFtQnRSLENBQUMsQ0FBQ3FSLFdBQUYsR0FBYyxDQUFDLENBQWxDLEdBQW9DclIsQ0FBQyxDQUFDcVIsV0FBRixHQUFjLENBQUMsQ0FBeEU7QUFBMkUsS0FBcjZ5QyxFQUFzNnlDclIsQ0FBQyxDQUFDdkMsRUFBRixDQUFLa1gsS0FBTCxHQUFXLFlBQVU7QUFBQyxVQUFJM1UsQ0FBSjtBQUFBLFVBQU01QixDQUFOO0FBQUEsVUFBUTJOLENBQUMsR0FBQyxJQUFWO0FBQUEsVUFBZUMsQ0FBQyxHQUFDeEgsU0FBUyxDQUFDLENBQUQsQ0FBMUI7QUFBQSxVQUE4QnlILENBQUMsR0FBQzhSLEtBQUssQ0FBQzVLLFNBQU4sQ0FBZ0I4RyxLQUFoQixDQUFzQjFGLElBQXRCLENBQTJCL1AsU0FBM0IsRUFBcUMsQ0FBckMsQ0FBaEM7QUFBQSxVQUF3RW1SLENBQUMsR0FBQzVKLENBQUMsQ0FBQzVKLE1BQTVFOztBQUFtRixXQUFJbkMsQ0FBQyxHQUFDLENBQU4sRUFBUUEsQ0FBQyxHQUFDMlYsQ0FBVixFQUFZM1YsQ0FBQyxFQUFiO0FBQWdCLFlBQUcsb0JBQWlCZ00sQ0FBakIsS0FBb0IsS0FBSyxDQUFMLEtBQVNBLENBQTdCLEdBQStCRCxDQUFDLENBQUMvTCxDQUFELENBQUQsQ0FBSzJVLEtBQUwsR0FBVyxJQUFJblYsQ0FBSixDQUFNdU0sQ0FBQyxDQUFDL0wsQ0FBRCxDQUFQLEVBQVdnTSxDQUFYLENBQTFDLEdBQXdENU4sQ0FBQyxHQUFDMk4sQ0FBQyxDQUFDL0wsQ0FBRCxDQUFELENBQUsyVSxLQUFMLENBQVczSSxDQUFYLEVBQWNnUyxLQUFkLENBQW9CalMsQ0FBQyxDQUFDL0wsQ0FBRCxDQUFELENBQUsyVSxLQUF6QixFQUErQjFJLENBQS9CLENBQTFELEVBQTRGLEtBQUssQ0FBTCxLQUFTN04sQ0FBeEcsRUFBMEcsT0FBT0EsQ0FBUDtBQUExSDs7QUFBbUksYUFBTzJOLENBQVA7QUFBUyxLQUEzcHpDO0FBQTRwekMsR0FBMzJ6QyxDQUFEO0FBRUF2USxFQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDeEJGLElBQUFBLENBQUMsQ0FBQyxpQkFBRCxDQUFELENBQXFCbVosS0FBckIsQ0FBMkI7QUFDekJqSCxNQUFBQSxRQUFRLEVBQUUsS0FEZTtBQUV6QlIsTUFBQUEsSUFBSSxFQUFFLEtBRm1CO0FBR3pCVCxNQUFBQSxTQUFTLEVBQUUsc0NBSGM7QUFJekJDLE1BQUFBLFNBQVMsRUFBRSxzQ0FKYztBQUt6QndCLE1BQUFBLFVBQVUsRUFBRSxDQUNWO0FBQ0kwTSxRQUFBQSxVQUFVLEVBQUUsSUFEaEI7QUFFSWpTLFFBQUFBLFFBQVEsRUFBRTtBQUVSdUUsVUFBQUEsSUFBSSxFQUFFLEtBRkU7QUFHUjtBQUNBO0FBQ0FYLFVBQUFBLE1BQU0sRUFBRSxLQUxBO0FBTVJtQixVQUFBQSxRQUFRLEVBQUUsSUFORjtBQU9SZixVQUFBQSxRQUFRLEVBQUUsSUFQRjtBQVFSQyxVQUFBQSxhQUFhLEVBQUU7QUFSUDtBQUZkLE9BRFUsRUFlVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0lnTyxRQUFBQSxVQUFVLEVBQUUsR0FEaEI7QUFFSWpTLFFBQUFBLFFBQVEsRUFBRTtBQUNSdUUsVUFBQUEsSUFBSSxFQUFFLEtBREU7QUFFUlQsVUFBQUEsU0FBUyxFQUFFLEtBRkg7QUFHUkMsVUFBQUEsU0FBUyxFQUFFLEtBSEg7QUFJUkgsVUFBQUEsTUFBTSxFQUFFO0FBSkE7QUFGZCxPQXRCVSxDQStCVjtBQUNBO0FBQ0E7QUFqQ1U7QUFMYSxLQUEzQjtBQXlDRCxHQTFDSDtBQTJDQS9RLEVBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUN4QkYsSUFBQUEsQ0FBQyxDQUFDLGlCQUFELENBQUQsQ0FBcUJtWixLQUFyQixDQUEyQjtBQUN2QnpILE1BQUFBLElBQUksRUFBRSxLQURpQjtBQUd2QjtBQUNBO0FBQ0FRLE1BQUFBLFFBQVEsRUFBRSxLQUxhO0FBTXZCYyxNQUFBQSxLQUFLLEVBQUUsR0FOZ0I7QUFPdkJGLE1BQUFBLFlBQVksRUFBRSxDQVBTO0FBUXZCQyxNQUFBQSxjQUFjLEVBQUUsQ0FSTztBQVN2QjlCLE1BQUFBLFNBQVMsRUFBRSxzQ0FUWTtBQVV2QkMsTUFBQUEsU0FBUyxFQUFFLHNDQVZZO0FBV3ZCd0IsTUFBQUEsVUFBVSxFQUFFLENBQ1I7QUFDSTBNLFFBQUFBLFVBQVUsRUFBRSxJQURoQjtBQUVJalMsUUFBQUEsUUFBUSxFQUFFO0FBQ04yRixVQUFBQSxZQUFZLEVBQUUsQ0FEUjtBQUVOQyxVQUFBQSxjQUFjLEVBQUUsQ0FGVjtBQUdOckIsVUFBQUEsSUFBSSxFQUFFO0FBSEE7QUFGZCxPQURRLEVBV1I7QUFDSTBOLFFBQUFBLFVBQVUsRUFBRSxHQURoQjtBQUVJalMsUUFBQUEsUUFBUSxFQUFFO0FBQ1YyRixVQUFBQSxZQUFZLEVBQUUsQ0FESjtBQUVWQyxVQUFBQSxjQUFjLEVBQUU7QUFGTjtBQUZkLE9BWFEsRUFrQlI7QUFDSXFNLFFBQUFBLFVBQVUsRUFBRSxHQURoQjtBQUVJalMsUUFBQUEsUUFBUSxFQUFFO0FBQ1YyRixVQUFBQSxZQUFZLEVBQUUsQ0FESjtBQUVWQyxVQUFBQSxjQUFjLEVBQUUsQ0FGTjtBQUdWaEMsVUFBQUEsTUFBTSxFQUFFO0FBSEU7QUFGZCxPQWxCUSxFQTRCUjtBQUNJcU8sUUFBQUEsVUFBVSxFQUFFLEdBRGhCO0FBRUlqUyxRQUFBQSxRQUFRLEVBQUU7QUFDUnVFLFVBQUFBLElBQUksRUFBRSxJQURFO0FBRVJULFVBQUFBLFNBQVMsRUFBRSxLQUZIO0FBR1JDLFVBQUFBLFNBQVMsRUFBRSxLQUhIO0FBSVJILFVBQUFBLE1BQU0sRUFBRTtBQUpBO0FBRmQsT0E1QlEsQ0FxQ1I7QUFDQTtBQUNBO0FBdkNRO0FBWFcsS0FBM0I7QUFzREEvUSxJQUFBQSxDQUFDLENBQUMsc0JBQUQsQ0FBRCxDQUEwQm1aLEtBQTFCLENBQWdDO0FBQzVCeEcsTUFBQUEsSUFBSSxFQUFFLENBRHNCO0FBRTVCakIsTUFBQUEsSUFBSSxFQUFFLElBRnNCO0FBRzVCRixNQUFBQSxZQUFZLEVBQUUsc0JBQUMzRCxNQUFELEVBQVNySixDQUFUO0FBQUEsNEJBQXFCQSxDQUFDLEdBQUcsQ0FBekI7QUFBQSxPQUhjO0FBSTVCME4sTUFBQUEsUUFBUSxFQUFFLEtBSmtCO0FBSzVCbkIsTUFBQUEsTUFBTSxFQUFFLEtBTG9CO0FBTTVCaUMsTUFBQUEsS0FBSyxFQUFFLEdBTnFCO0FBTzVCRixNQUFBQSxZQUFZLEVBQUUsQ0FQYztBQVE1QkMsTUFBQUEsY0FBYyxFQUFFO0FBUlksS0FBaEM7QUFXSCxHQWxFRCxFQWptQ3lCLENBdXFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQS9TLEVBQUFBLENBQUMsQ0FBQyxZQUFZO0FBQ1ZBLElBQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CNk4sTUFBcEIsQ0FBMkI7QUFDeEI5RSxNQUFBQSxHQUFHLEVBQUUsQ0FEbUI7QUFFeEJFLE1BQUFBLEdBQUcsRUFBRSxLQUZtQjtBQUd4QjhFLE1BQUFBLE1BQU0sRUFBRSxDQUFDLEtBQUQsRUFBTyxLQUFQLENBSGdCO0FBSXhCQyxNQUFBQSxLQUFLLEVBQUUsSUFKaUI7QUFLeEJoQixNQUFBQSxJQUFJLEVBQUUsY0FBUzFGLEtBQVQsRUFBZ0I0RyxFQUFoQixFQUFvQjtBQUMxQmxPLFFBQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CdUcsR0FBcEIsQ0FBd0J2RyxDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUFvQjZOLE1BQXBCLENBQTJCLFFBQTNCLEVBQW9DLENBQXBDLENBQXhCO0FBQ0E3TixRQUFBQSxDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUFvQnVHLEdBQXBCLENBQXdCdkcsQ0FBQyxDQUFDLGdCQUFELENBQUQsQ0FBb0I2TixNQUFwQixDQUEyQixRQUEzQixFQUFvQyxDQUFwQyxDQUF4QjtBQUVELE9BVHlCO0FBVTFCSSxNQUFBQSxLQUFLLEVBQUUsZUFBUzNHLEtBQVQsRUFBZ0I0RyxFQUFoQixFQUFtQjtBQUN4QmxPLFFBQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CdUcsR0FBcEIsQ0FBd0J2RyxDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUFvQjZOLE1BQXBCLENBQTJCLFFBQTNCLEVBQW9DLENBQXBDLENBQXhCO0FBQ0E3TixRQUFBQSxDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUFvQnVHLEdBQXBCLENBQXdCdkcsQ0FBQyxDQUFDLGdCQUFELENBQUQsQ0FBb0I2TixNQUFwQixDQUEyQixRQUEzQixFQUFvQyxDQUFwQyxDQUF4QjtBQUVEO0FBZHlCLEtBQTNCO0FBaUJEN04sSUFBQUEsQ0FBQyxDQUFDLGdCQUFELENBQUQsQ0FBb0IrRCxFQUFwQixDQUF1QixRQUF2QixFQUFpQyxZQUFVO0FBQ3ZDLFVBQUkwZSxNQUFNLEdBQUN6aUIsQ0FBQyxDQUFDLGdCQUFELENBQUQsQ0FBb0J1RyxHQUFwQixFQUFYO0FBQ0EsVUFBSW1jLE1BQU0sR0FBQzFpQixDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUFvQnVHLEdBQXBCLEVBQVg7O0FBQ0YsVUFBRzhXLFFBQVEsQ0FBQ29GLE1BQUQsQ0FBUixHQUFtQnBGLFFBQVEsQ0FBQ3FGLE1BQUQsQ0FBOUIsRUFBdUM7QUFDakNELFFBQUFBLE1BQU0sR0FBR0MsTUFBVDtBQUNBMWlCLFFBQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CdUcsR0FBcEIsQ0FBd0JrYyxNQUF4QjtBQUVIOztBQUNEemlCLE1BQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CNk4sTUFBcEIsQ0FBMkIsUUFBM0IsRUFBcUMsQ0FBckMsRUFBd0M0VSxNQUF4QztBQUVILEtBVkQ7QUFZQXppQixJQUFBQSxDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUFvQitELEVBQXBCLENBQXVCLFFBQXZCLEVBQWlDLFlBQVU7QUFDdkMsVUFBSTBlLE1BQU0sR0FBQ3ppQixDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUFvQnVHLEdBQXBCLEVBQVg7QUFDQSxVQUFJbWMsTUFBTSxHQUFDMWlCLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CdUcsR0FBcEIsRUFBWDs7QUFDQSxVQUFJbWMsTUFBTSxHQUFHLEtBQWIsRUFBb0I7QUFBRUEsUUFBQUEsTUFBTSxHQUFHLEtBQVQ7QUFBZ0IxaUIsUUFBQUEsQ0FBQyxDQUFDLGdCQUFELENBQUQsQ0FBb0J1RyxHQUFwQixDQUF3QixLQUF4QjtBQUErQjs7QUFDckUsVUFBRzhXLFFBQVEsQ0FBQ29GLE1BQUQsQ0FBUixHQUFtQnBGLFFBQVEsQ0FBQ3FGLE1BQUQsQ0FBOUIsRUFBdUM7QUFDbkNBLFFBQUFBLE1BQU0sR0FBR0QsTUFBVDtBQUNBemlCLFFBQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CdUcsR0FBcEIsQ0FBd0JtYyxNQUF4QjtBQUVIOztBQUNEMWlCLE1BQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CNk4sTUFBcEIsQ0FBMkIsUUFBM0IsRUFBb0MsQ0FBcEMsRUFBc0M2VSxNQUF0QztBQUVILEtBWEQ7QUFZRCxHQTFDRCxDQUFEO0FBMkNBMWlCLEVBQUFBLENBQUMsQ0FBQyxvQ0FBRCxDQUFELENBQXdDbVosS0FBeEMsQ0FBOEM7QUFDNUNyRyxJQUFBQSxZQUFZLEVBQUUsQ0FEOEI7QUFFNUNDLElBQUFBLGNBQWMsRUFBRSxDQUY0QjtBQUc1Q2hDLElBQUFBLE1BQU0sRUFBRSxJQUhvQztBQUk1Q21CLElBQUFBLFFBQVEsRUFBRSxLQUprQztBQUs1Q0gsSUFBQUEsSUFBSSxFQUFFLElBTHNDO0FBTTVDZixJQUFBQSxRQUFRLEVBQUU7QUFOa0MsR0FBOUM7QUFTQWhSLEVBQUFBLENBQUMsQ0FBQyxvQ0FBRCxDQUFELENBQXdDbVosS0FBeEMsQ0FBOEM7QUFDNUNyRyxJQUFBQSxZQUFZLEVBQUUsQ0FEOEI7QUFFNUNDLElBQUFBLGNBQWMsRUFBRSxDQUY0QjtBQUc1Q2IsSUFBQUEsUUFBUSxFQUFFLEtBSGtDO0FBSTVDbEIsSUFBQUEsUUFBUSxFQUFFLG9DQUprQztBQUs1QztBQUNBQyxJQUFBQSxTQUFTLEVBQUUsdURBTmlDO0FBTzVDQyxJQUFBQSxTQUFTLEVBQUUseURBUGlDO0FBUTVDUSxJQUFBQSxJQUFJLEVBQUUsS0FSc0M7QUFTNUM4QixJQUFBQSxRQUFRLEVBQUUsSUFUa0M7QUFVNUNDLElBQUFBLGVBQWUsRUFBRSxJQVYyQjtBQVc1QztBQUNBekIsSUFBQUEsYUFBYSxFQUFFO0FBWjZCLEdBQTlDLEVBaHVDeUIsQ0FpdkN6Qjs7QUFFQWhTLEVBQUFBLENBQUMsQ0FBQyxXQUFELENBQUQsQ0FBZStELEVBQWYsQ0FBa0IsT0FBbEIsRUFBMEIsVUFBU0MsQ0FBVCxFQUFZO0FBQ2xDQSxJQUFBQSxDQUFDLENBQUNxSSxjQUFGO0FBQ0FyTSxJQUFBQSxDQUFDLENBQUMsV0FBRCxDQUFELENBQWV1TSxXQUFmLENBQTJCLEtBQTNCO0FBQ0gsR0FIRCxFQW52Q3lCLENBd3ZDekI7O0FBQ0F2TSxFQUFBQSxDQUFDLENBQUMsc0JBQUQsQ0FBRCxDQUEwQitELEVBQTFCLENBQTZCLE9BQTdCLEVBQXFDLFVBQVNDLENBQVQsRUFBWTtBQUM3Q0EsSUFBQUEsQ0FBQyxDQUFDcUksY0FBRjtBQUNBck0sSUFBQUEsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRdU0sV0FBUixDQUFvQiw0QkFBcEI7QUFDSCxHQUhELEVBenZDeUIsQ0ErdkN6Qjs7QUFDQXZNLEVBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBWTtBQUUxQkYsSUFBQUEsQ0FBQyxDQUFDLGFBQUQsQ0FBRCxDQUFpQm9FLEtBQWpCLENBQXVCLFlBQVk7QUFDL0JwRSxNQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVF1TSxXQUFSLENBQW9CLHNCQUFwQixFQUE0Qy9GLElBQTVDLEdBQW1EbWMsV0FBbkQsR0FEK0IsQ0FFL0I7QUFDSCxLQUhEO0FBS0gsR0FQRDtBQVNBM2lCLEVBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBWTtBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUdBRixJQUFBQSxDQUFDLENBQUMsWUFBRCxDQUFELENBQWdCb0UsS0FBaEIsQ0FBc0IsWUFBWTtBQUM5QnBFLE1BQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUWtmLElBQVIsR0FBZTNTLFdBQWYsQ0FBMkIsZ0JBQTNCLEVBRDhCLENBRTlCO0FBQ0gsS0FIRDtBQUtILEdBYkQsRUF6d0N5QixDQXl4Q3pCOztBQUVBdk0sRUFBQUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVb0UsS0FBVixDQUFnQixZQUFZO0FBQ3hCLFFBQUlwRSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVFrZixJQUFSLEdBQWUzWSxHQUFmLEtBQXVCLEVBQTNCLEVBQStCO0FBQy9CdkcsTUFBQUEsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRa2YsSUFBUixHQUFlM1ksR0FBZixDQUFtQixDQUFDdkcsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRa2YsSUFBUixHQUFlM1ksR0FBZixFQUFELEdBQXdCLENBQTNDO0FBQ0M7QUFDSixHQUpEO0FBS0F2RyxFQUFBQSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVVvRSxLQUFWLENBQWdCLFlBQVk7QUFDeEIsUUFBSXBFLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXdHLElBQVIsR0FBZUQsR0FBZixLQUF1QixDQUEzQixFQUE4QjtBQUM5QixVQUFJdkcsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRd0csSUFBUixHQUFlRCxHQUFmLEtBQXVCLENBQTNCLEVBQThCdkcsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRd0csSUFBUixHQUFlRCxHQUFmLENBQW1CLENBQUN2RyxDQUFDLENBQUMsSUFBRCxDQUFELENBQVF3RyxJQUFSLEdBQWVELEdBQWYsRUFBRCxHQUF3QixDQUEzQztBQUM3QjtBQUNKLEdBSkQsRUFoeUN5QixDQXV5Q3pCOztBQUVBdkcsRUFBQUEsQ0FBQyxDQUFDLGFBQUQsQ0FBRCxDQUFpQm9FLEtBQWpCLENBQXVCLFlBQVc7QUFDOUJwRSxJQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVF5UixJQUFSLENBQWEsVUFBU2pOLENBQVQsRUFBWWlOLElBQVosRUFBa0I7QUFDN0IsYUFBT0EsSUFBSSxLQUFLLGNBQVQsR0FBMEIsUUFBMUIsR0FBcUMsY0FBNUM7QUFDRCxLQUZEO0FBR0gsR0FKRDtBQU9BelIsRUFBQUEsQ0FBQyxDQUFDLGFBQUQsQ0FBRCxDQUFpQm9FLEtBQWpCLENBQXVCLFlBQVc7QUFDOUJwRSxJQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVF5UixJQUFSLENBQWEsVUFBU2pOLENBQVQsRUFBWWlOLElBQVosRUFBa0I7QUFDN0IsYUFBT0EsSUFBSSxLQUFLLFdBQVQsR0FBdUIsb0JBQXZCLEdBQThDLFdBQXJEO0FBQ0QsS0FGRDtBQUdILEdBSkQsRUFoekN5QixDQXF6Q3pCO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFJQTs7O0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUtKO0FBRUMsQ0E5MkNEIiwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAvKipcclxuICAgICAqINCT0LvQvtCx0LDQu9GM0L3Ri9C1INC/0LXRgNC10LzQtdC90L3Ri9C1LCDQutC+0YLQvtGA0YvQtSDQuNGB0L/QvtC70YzQt9GD0Y7RgtGB0Y8g0LzQvdC+0LPQvtC60YDQsNGC0L3QvlxyXG4gICAgICovXHJcbiAgICBsZXQgZ2xvYmFsT3B0aW9ucyA9IHtcclxuICAgICAgICAvLyDQktGA0LXQvNGPINC00LvRjyDQsNC90LjQvNCw0YbQuNC5XHJcbiAgICAgICAgdGltZTogIDIwMCxcclxuXHJcbiAgICAgICAgLy8g0JrQvtC90YLRgNC+0LvRjNC90YvQtSDRgtC+0YfQutC4INCw0LTQsNC/0YLQuNCy0LBcclxuICAgICAgICBkZXNrdG9wWGxTaXplOiAxOTIwLFxyXG4gICAgICAgIGRlc2t0b3BMZ1NpemU6IDE2MDAsXHJcbiAgICAgICAgZGVza3RvcFNpemU6ICAgMTI4MCxcclxuICAgICAgICB0YWJsZXRMZ1NpemU6ICAgMTAyNCxcclxuICAgICAgICB0YWJsZXRTaXplOiAgICAgNzY4LFxyXG4gICAgICAgIG1vYmlsZUxnU2l6ZTogICA2NDAsXHJcbiAgICAgICAgbW9iaWxlU2l6ZTogICAgIDQ4MCxcclxuXHJcbiAgICAgICAgLy8g0KLQvtGH0LrQsCDQv9C10YDQtdGF0L7QtNCwINC/0L7Qv9Cw0L/QvtCyINC90LAg0YTRg9C70YHQutGA0LjQvVxyXG4gICAgICAgIHBvcHVwc0JyZWFrcG9pbnQ6IDc2OCxcclxuXHJcbiAgICAgICAgLy8g0JLRgNC10LzRjyDQtNC+INGB0L7QutGA0YvRgtC40Y8g0YTQuNC60YHQuNGA0L7QstCw0L3QvdGL0YUg0L/QvtC/0LDQv9C+0LJcclxuICAgICAgICBwb3B1cHNGaXhlZFRpbWVvdXQ6IDUwMDAsXHJcblxyXG4gICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAgdG91Y2gg0YPRgdGC0YDQvtC50YHRgtCyXHJcbiAgICAgICAgaXNUb3VjaDogJC5icm93c2VyLm1vYmlsZSxcclxuXHJcbiAgICAgICAgbGFuZzogJCgnaHRtbCcpLmF0dHIoJ2xhbmcnKVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDQkdGA0LXQudC60L/QvtC40L3RgtGLINCw0LTQsNC/0YLQuNCy0LBcclxuICAgIC8vIEBleGFtcGxlIGlmIChnbG9iYWxPcHRpb25zLmJyZWFrcG9pbnRUYWJsZXQubWF0Y2hlcykge30gZWxzZSB7fVxyXG4gICAgY29uc3QgYnJlYWtwb2ludHMgPSB7XHJcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3BYbDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wWGxTaXplIC0gMX1weClgKSxcclxuICAgICAgICBicmVha3BvaW50RGVza3RvcExnOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BMZ1NpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BTaXplIC0gMX1weClgKSxcclxuICAgICAgICBicmVha3BvaW50VGFibGV0TGc6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMudGFibGV0TGdTaXplIC0gMX1weClgKSxcclxuICAgICAgICBicmVha3BvaW50VGFibGV0OiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLnRhYmxldFNpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnRNb2JpbGVMZ1NpemU6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMubW9iaWxlTGdTaXplIC0gMX1weClgKSxcclxuICAgICAgICBicmVha3BvaW50TW9iaWxlOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLm1vYmlsZVNpemUgLSAxfXB4KWApXHJcbiAgICB9O1xyXG5cclxuICAgICQuZXh0ZW5kKHRydWUsIGdsb2JhbE9wdGlvbnMsIGJyZWFrcG9pbnRzKTtcclxuXHJcblxyXG5cclxuXHJcbiAgICAkKHdpbmRvdykubG9hZCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGdsb2JhbE9wdGlvbnMuaXNUb3VjaCkge1xyXG4gICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3RvdWNoJykucmVtb3ZlQ2xhc3MoJ25vLXRvdWNoJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCduby10b3VjaCcpLnJlbW92ZUNsYXNzKCd0b3VjaCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgKCQoJ3RleHRhcmVhJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIC8vICAgICBhdXRvc2l6ZSgkKCd0ZXh0YXJlYScpKTtcclxuICAgICAgICAvLyB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LTQutC70Y7Rh9C10L3QuNC1IGpzIHBhcnRpYWxzXHJcbiAgICAgKi9cclxuICAgIC8qIGZvcm1fc3R5bGUuanMg0LTQvtC70LbQtdC9INCx0YvRgtGMINCy0YvQv9C+0LvQvdC10L0g0L/QtdGA0LXQtCBmb3JtX3ZhbGlkYXRpb24uanMgKi9cclxuICAgIC8qKlxyXG4gICAgICog0KDQsNGB0YjQuNGA0LXQvdC40LUgYW5pbWF0ZS5jc3NcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gYW5pbWF0aW9uTmFtZSDQvdCw0LfQstCw0L3QuNC1INCw0L3QuNC80LDRhtC40LhcclxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayDRhNGD0L3QutGG0LjRjywg0LrQvtGC0L7RgNCw0Y8g0L7RgtGA0LDQsdC+0YLQsNC10YIg0L/QvtGB0LvQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9INC+0LHRitC10LrRgiDQsNC90LjQvNCw0YbQuNC4XHJcbiAgICAgKiBcclxuICAgICAqIEBzZWUgIGh0dHBzOi8vZGFuZWRlbi5naXRodWIuaW8vYW5pbWF0ZS5jc3MvXHJcbiAgICAgKiBcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnKTtcclxuICAgICAqIFxyXG4gICAgICogJCgnI3lvdXJFbGVtZW50JykuYW5pbWF0ZUNzcygnYm91bmNlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgKiAgICAgLy8g0JTQtdC70LDQtdC8INGH0YLQvi3RgtC+INC/0L7RgdC70LUg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxyXG4gICAgICogfSk7XHJcbiAgICAgKi9cclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBhbmltYXRlQ3NzOiBmdW5jdGlvbihhbmltYXRpb25OYW1lLCBjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uRW5kID0gKGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246ICdhbmltYXRpb25lbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgIE9BbmltYXRpb246ICdvQW5pbWF0aW9uRW5kJyxcclxuICAgICAgICAgICAgICAgICAgICBNb3pBbmltYXRpb246ICdtb3pBbmltYXRpb25FbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgIFdlYmtpdEFuaW1hdGlvbjogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHQgaW4gYW5pbWF0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbC5zdHlsZVt0XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25zW3RdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRDbGFzcygnYW5pbWF0ZWQgJyArIGFuaW1hdGlvbk5hbWUpLm9uZShhbmltYXRpb25FbmQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQgJyArIGFuaW1hdGlvbk5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvKipcclxuICAgICAqINCh0YLQuNC70LjQt9GD0LXRgiDRgdC10LvQtdC60YLRiyDRgSDQv9C+0LzQvtGJ0YzRjiDQv9C70LDQs9C40L3QsCBzZWxlY3QyXHJcbiAgICAgKiBodHRwczovL3NlbGVjdDIuZ2l0aHViLmlvXHJcbiAgICAgKi9cclxuICAgIGxldCBDdXN0b21TZWxlY3QgPSBmdW5jdGlvbigkZWxlbSkge1xyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5pbml0ID0gZnVuY3Rpb24oJGluaXRFbGVtKSB7XHJcbiAgICAgICAgICAgICRpbml0RWxlbS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdFNlYXJjaCA9ICQodGhpcykuZGF0YSgnc2VhcmNoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0U2VhcmNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoID0gMTsgLy8g0L/QvtC60LDQt9GL0LLQsNC10Lwg0L/QvtC70LUg0L/QvtC40YHQutCwXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSBJbmZpbml0eTsgLy8g0L3QtSDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C+0LvQtSDQv9C+0LjRgdC60LBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2VsZWN0Mih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0T25CbHVyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkNzc0NsYXNzOiAnZXJyb3InXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L3Rg9C20L3QviDQtNC70Y8g0LLRi9C70LjQtNCw0YbQuNC4INC90LAg0LvQtdGC0YNcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKGBvcHRpb25bdmFsdWU9XCIkeyQodGhpcykuY29udGV4dC52YWx1ZX1cIl1gKS5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZSA9IGZ1bmN0aW9uKCR1cGRhdGVFbGVtKSB7XHJcbiAgICAgICAgICAgICR1cGRhdGVFbGVtLnNlbGVjdDIoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgc2VsZi5pbml0KCR1cGRhdGVFbGVtKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmluaXQoJGVsZW0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0YLQuNC70LjQt9GD0LXRgiBmaWxlIGlucHV0XHJcbiAgICAgKiBodHRwOi8vZ3JlZ3Bpa2UubmV0L2RlbW9zL2Jvb3RzdHJhcC1maWxlLWlucHV0L2RlbW8uaHRtbFxyXG4gICAgICovXHJcbiAgICAkLmZuLmN1c3RvbUZpbGVJbnB1dCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaSwgZWxlbSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgJGVsZW0gPSAkKGVsZW0pO1xyXG5cclxuICAgICAgICAgICAgLy8gTWF5YmUgc29tZSBmaWVsZHMgZG9uJ3QgbmVlZCB0byBiZSBzdGFuZGFyZGl6ZWQuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgJGVsZW0uYXR0cignZGF0YS1iZmktZGlzYWJsZWQnKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gU2V0IHRoZSB3b3JkIHRvIGJlIGRpc3BsYXllZCBvbiB0aGUgYnV0dG9uXHJcbiAgICAgICAgICAgIGxldCBidXR0b25Xb3JkID0gJ0Jyb3dzZSc7XHJcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSAnJztcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgJGVsZW0uYXR0cigndGl0bGUnKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbldvcmQgPSAkZWxlbS5hdHRyKCd0aXRsZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoISEkZWxlbS5hdHRyKCdjbGFzcycpKSB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSAnICcgKyAkZWxlbS5hdHRyKCdjbGFzcycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBOb3cgd2UncmUgZ29pbmcgdG8gd3JhcCB0aGF0IGlucHV0IGZpZWxkIHdpdGggYSBidXR0b24uXHJcbiAgICAgICAgICAgIC8vIFRoZSBpbnB1dCB3aWxsIGFjdHVhbGx5IHN0aWxsIGJlIHRoZXJlLCBpdCB3aWxsIGp1c3QgYmUgZmxvYXQgYWJvdmUgYW5kIHRyYW5zcGFyZW50IChkb25lIHdpdGggdGhlIENTUykuXHJcbiAgICAgICAgICAgICRlbGVtLndyYXAoYDxkaXYgY2xhc3M9XCJjdXN0b20tZmlsZVwiPjxhIGNsYXNzPVwiYnRuICR7Y2xhc3NOYW1lfVwiPjwvYT48L2Rpdj5gKS5wYXJlbnQoKS5wcmVwZW5kKCQoJzxzcGFuPjwvc3Bhbj4nKS5odG1sKGJ1dHRvbldvcmQpKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBBZnRlciB3ZSBoYXZlIGZvdW5kIGFsbCBvZiB0aGUgZmlsZSBpbnB1dHMgbGV0J3MgYXBwbHkgYSBsaXN0ZW5lciBmb3IgdHJhY2tpbmcgdGhlIG1vdXNlIG1vdmVtZW50LlxyXG4gICAgICAgIC8vIFRoaXMgaXMgaW1wb3J0YW50IGJlY2F1c2UgdGhlIGluIG9yZGVyIHRvIGdpdmUgdGhlIGlsbHVzaW9uIHRoYXQgdGhpcyBpcyBhIGJ1dHRvbiBpbiBGRiB3ZSBhY3R1YWxseSBuZWVkIHRvIG1vdmUgdGhlIGJ1dHRvbiBmcm9tIHRoZSBmaWxlIGlucHV0IHVuZGVyIHRoZSBjdXJzb3IuIFVnaC5cclxuICAgICAgICAucHJvbWlzZSgpLmRvbmUoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBBcyB0aGUgY3Vyc29yIG1vdmVzIG92ZXIgb3VyIG5ldyBidXR0b24gd2UgbmVlZCB0byBhZGp1c3QgdGhlIHBvc2l0aW9uIG9mIHRoZSBpbnZpc2libGUgZmlsZSBpbnB1dCBCcm93c2UgYnV0dG9uIHRvIGJlIHVuZGVyIHRoZSBjdXJzb3IuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgZ2l2ZXMgdXMgdGhlIHBvaW50ZXIgY3Vyc29yIHRoYXQgRkYgZGVuaWVzIHVzXHJcbiAgICAgICAgICAgICQoJy5jdXN0b20tZmlsZScpLm1vdXNlbW92ZShmdW5jdGlvbihjdXJzb3IpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQsIHdyYXBwZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlclgsIHdyYXBwZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0V2lkdGgsIGlucHV0SGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvclgsIGN1cnNvclk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyB3cmFwcGVyIGVsZW1lbnQgKHRoZSBidXR0b24gc3Vycm91bmQgdGhpcyBmaWxlIGlucHV0KVxyXG4gICAgICAgICAgICAgICAgd3JhcHBlciA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgaW52aXNpYmxlIGZpbGUgaW5wdXQgZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgaW5wdXQgPSB3cmFwcGVyLmZpbmQoJ2lucHV0Jyk7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgbGVmdC1tb3N0IHBvc2l0aW9uIG9mIHRoZSB3cmFwcGVyXHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyWCA9IHdyYXBwZXIub2Zmc2V0KCkubGVmdDtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSB0b3AtbW9zdCBwb3NpdGlvbiBvZiB0aGUgd3JhcHBlclxyXG4gICAgICAgICAgICAgICAgd3JhcHBlclkgPSB3cmFwcGVyLm9mZnNldCgpLnRvcDtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSB3aXRoIG9mIHRoZSBicm93c2VycyBpbnB1dCBmaWVsZFxyXG4gICAgICAgICAgICAgICAgaW5wdXRXaWR0aCA9IGlucHV0LndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgaGVpZ2h0IG9mIHRoZSBicm93c2VycyBpbnB1dCBmaWVsZFxyXG4gICAgICAgICAgICAgICAgaW5wdXRIZWlnaHQgPSBpbnB1dC5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIC8vVGhlIHBvc2l0aW9uIG9mIHRoZSBjdXJzb3IgaW4gdGhlIHdyYXBwZXJcclxuICAgICAgICAgICAgICAgIGN1cnNvclggPSBjdXJzb3IucGFnZVg7XHJcbiAgICAgICAgICAgICAgICBjdXJzb3JZID0gY3Vyc29yLnBhZ2VZO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vVGhlIHBvc2l0aW9ucyB3ZSBhcmUgdG8gbW92ZSB0aGUgaW52aXNpYmxlIGZpbGUgaW5wdXRcclxuICAgICAgICAgICAgICAgIC8vIFRoZSAyMCBhdCB0aGUgZW5kIGlzIGFuIGFyYml0cmFyeSBudW1iZXIgb2YgcGl4ZWxzIHRoYXQgd2UgY2FuIHNoaWZ0IHRoZSBpbnB1dCBzdWNoIHRoYXQgY3Vyc29yIGlzIG5vdCBwb2ludGluZyBhdCB0aGUgZW5kIG9mIHRoZSBCcm93c2UgYnV0dG9uIGJ1dCBzb21ld2hlcmUgbmVhcmVyIHRoZSBtaWRkbGVcclxuICAgICAgICAgICAgICAgIG1vdmVJbnB1dFggPSBjdXJzb3JYIC0gd3JhcHBlclggLSBpbnB1dFdpZHRoICsgMjA7XHJcbiAgICAgICAgICAgICAgICAvLyBTbGlkZXMgdGhlIGludmlzaWJsZSBpbnB1dCBCcm93c2UgYnV0dG9uIHRvIGJlIHBvc2l0aW9uZWQgbWlkZGxlIHVuZGVyIHRoZSBjdXJzb3JcclxuICAgICAgICAgICAgICAgIG1vdmVJbnB1dFkgPSBjdXJzb3JZIC0gd3JhcHBlclkgLSAoaW5wdXRIZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBcHBseSB0aGUgcG9zaXRpb25pbmcgc3R5bGVzIHRvIGFjdHVhbGx5IG1vdmUgdGhlIGludmlzaWJsZSBmaWxlIGlucHV0XHJcbiAgICAgICAgICAgICAgICBpbnB1dC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IG1vdmVJbnB1dFgsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBtb3ZlSW5wdXRZXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKCdib2R5Jykub24oJ2NoYW5nZScsICcuY3VzdG9tLWZpbGUgaW5wdXRbdHlwZT1maWxlXScsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBmaWxlTmFtZTtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gJCh0aGlzKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgYW55IHByZXZpb3VzIGZpbGUgbmFtZXNcclxuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkubmV4dCgnLmN1c3RvbS1maWxlX19uYW1lJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoISEkKHRoaXMpLnByb3AoJ2ZpbGVzJykgJiYgJCh0aGlzKS5wcm9wKCdmaWxlcycpLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9ICQodGhpcylbMF0uZmlsZXMubGVuZ3RoICsgJyBmaWxlcyc7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gZmlsZU5hbWUuc3Vic3RyaW5nKGZpbGVOYW1lLmxhc3RJbmRleE9mKCdcXFxcJykgKyAxLCBmaWxlTmFtZS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIERvbid0IHRyeSB0byBzaG93IHRoZSBuYW1lIGlmIHRoZXJlIGlzIG5vbmVcclxuICAgICAgICAgICAgICAgIGlmICghZmlsZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkRmlsZU5hbWVQbGFjZW1lbnQgPSAkKHRoaXMpLmRhdGEoJ2ZpbGVuYW1lLXBsYWNlbWVudCcpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkRmlsZU5hbWVQbGFjZW1lbnQgPT09ICdpbnNpZGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUHJpbnQgdGhlIGZpbGVOYW1lIGluc2lkZVxyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJ3NwYW4nKS5odG1sKGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3RpdGxlJywgZmlsZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBQcmludCB0aGUgZmlsZU5hbWUgYXNpZGUgKHJpZ2h0IGFmdGVyIHRoZSB0aGUgYnV0dG9uKVxyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuYWZ0ZXIoYDxzcGFuIGNsYXNzPVwiY3VzdG9tLWZpbGVfX25hbWVcIj4ke2ZpbGVOYW1lfSA8L3NwYW4+YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgICQoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJykuY3VzdG9tRmlsZUlucHV0KCk7XHJcbiAgICAvLyAkKCdzZWxlY3QnKS5jdXN0b21TZWxlY3QoKTtcclxuICAgIHZhciBjdXN0b21TZWxlY3QgPSBuZXcgQ3VzdG9tU2VsZWN0KCQoJ3NlbGVjdCcpKTtcclxuXHJcbiAgICBpZiAoJCgnLmpzLWxhYmVsLWFuaW1hdGlvbicpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQkNC90LjQvNCw0YbQuNGPINGN0LvQtdC80LXQvdGC0LAgbGFiZWwg0L/RgNC4INGE0L7QutGD0YHQtSDQv9C+0LvQtdC5INGE0L7RgNC80YtcclxuICAgICAgICAgKi9cclxuICAgICAgICAkKCcuanMtbGFiZWwtYW5pbWF0aW9uJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcclxuICAgICAgICAgICAgY29uc3QgZmllbGQgPSAkKGVsKS5maW5kKCdpbnB1dCwgdGV4dGFyZWEnKTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkKGZpZWxkKS52YWwoKS50cmltKCkgIT0gJycpIHtcclxuICAgICAgICAgICAgICAgICQoZWwpLmFkZENsYXNzKCdpcy1maWxsZWQnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJChmaWVsZCkub24oJ2ZvY3VzJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICQoZWwpLmFkZENsYXNzKCdpcy1maWxsZWQnKTtcclxuICAgICAgICAgICAgfSkub24oJ2JsdXInLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkudHJpbSgpID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZWwpLnJlbW92ZUNsYXNzKCdpcy1maWxsZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxvY2FsZSA9IGdsb2JhbE9wdGlvbnMubGFuZyA9PSAncnUtUlUnID8gJ3J1JyA6ICdlbic7XHJcblxyXG4gICAgUGFyc2xleS5zZXRMb2NhbGUobG9jYWxlKTtcclxuXHJcbiAgICAvKiDQndCw0YHRgtGA0L7QudC60LggUGFyc2xleSAqL1xyXG4gICAgJC5leHRlbmQoUGFyc2xleS5vcHRpb25zLCB7XHJcbiAgICAgICAgdHJpZ2dlcjogJ2JsdXIgY2hhbmdlJywgLy8gY2hhbmdlINC90YPQttC10L0g0LTQu9GPIHNlbGVjdCfQsFxyXG4gICAgICAgIHZhbGlkYXRpb25UaHJlc2hvbGQ6ICcwJyxcclxuICAgICAgICBlcnJvcnNXcmFwcGVyOiAnPGRpdj48L2Rpdj4nLFxyXG4gICAgICAgIGVycm9yVGVtcGxhdGU6ICc8cCBjbGFzcz1cInBhcnNsZXktZXJyb3ItbWVzc2FnZVwiPjwvcD4nLFxyXG4gICAgICAgIGNsYXNzSGFuZGxlcjogZnVuY3Rpb24oaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSBpbnN0YW5jZS4kZWxlbWVudDtcclxuICAgICAgICAgICAgbGV0IHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXHJcbiAgICAgICAgICAgICAgICAkaGFuZGxlcjtcclxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcclxuICAgICAgICAgICAgICAgICRoYW5kbGVyID0gJGVsZW1lbnQ7IC8vINGC0L4g0LXRgdGC0Ywg0L3QuNGH0LXQs9C+INC90LUg0LLRi9C00LXQu9GP0LXQvCAoaW5wdXQg0YHQutGA0YvRgiksINC40L3QsNGH0LUg0LLRi9C00LXQu9GP0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0LHQu9C+0LpcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAkaGFuZGxlciA9ICQoJy5zZWxlY3QyLXNlbGVjdGlvbi0tc2luZ2xlJywgJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaGFuZGxlcjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yc0NvbnRhaW5lcjogZnVuY3Rpb24oaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSBpbnN0YW5jZS4kZWxlbWVudDtcclxuICAgICAgICAgICAgbGV0IHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnZmlsZScpIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5jbG9zZXN0KCcuY3VzdG9tLWZpbGUnKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50LmNsb3Nlc3QoJy5qcy1kYXRlcGlja2VyLXJhbmdlJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQucGFyZW50KCkubmV4dCgnLmctcmVjYXB0Y2hhJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRjb250YWluZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0JrQsNGB0YLQvtC80L3Ri9C1INCy0LDQu9C40LTQsNGC0L7RgNGLXHJcblxyXG4gICAgLy8g0KLQvtC70YzQutC+INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWVSdScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFcXC0gXSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIidcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0LvQsNGC0LjQvdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWVFbicsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eW2EtelxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwgXCIgXCIsIFwiLVwiJyxcclxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosIFwiIFwiLCBcIi1cIidcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0LvQsNGC0LjQvdGB0LrQuNC1INC4INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWUnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlvQsC3Rj9GRYS16XFwtIF0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIicsXHJcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIidcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRiyDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbnVtTGV0dGVyUnUnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlswLTnQsC3Rj9GRXSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCAwLTknLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyDQkC3Qrywg0LAt0Y8sIDAtOSdcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRiywg0LvQsNGC0LjQvdGB0LrQuNC1INC4INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1MZXR0ZXInLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlvQsC3Rj9GRYS16MC05XSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgMC05JyxcclxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgMC05J1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0LXQu9C10YTQvtC90L3Ri9C5INC90L7QvNC10YBcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdwaG9uZScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eWy0rMC05KCkgXSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDRgtC10LvQtdGE0L7QvdC90YvQuSDQvdC+0LzQtdGAJyxcclxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgcGhvbmUgbnVtYmVyJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbnVtYmVyJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15bMC05XSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgMC05JyxcclxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgMC05J1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCf0L7Rh9GC0LAg0LHQtdC3INC60LjRgNC40LvQu9C40YbRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2VtYWlsJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL14oW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKFxcLnxffC0pezAsMX0pK1tBLVphLXrQkC3Qr9CwLdGPMC05XFwtXVxcQChbQS1aYS160JAt0K/QsC3RjzAtOVxcLV0pKygoXFwuKXswLDF9W0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKXsxLH1cXC5bYS160LAt0Y8wLTlcXC1dezIsfSQvLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0L/QvtGH0YLQvtCy0YvQuSDQsNC00YDQtdGBJyxcclxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgZW1haWwgYWRkcmVzcydcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQpNC+0YDQvNCw0YIg0LTQsNGC0YsgREQuTU0uWVlZWVxyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2RhdGUnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGxldCByZWdUZXN0ID0gL14oPzooPzozMShcXC4pKD86MD9bMTM1NzhdfDFbMDJdKSlcXDF8KD86KD86Mjl8MzApKFxcLikoPzowP1sxLDMtOV18MVswLTJdKVxcMikpKD86KD86MVs2LTldfFsyLTldXFxkKT9cXGR7Mn0pJHxeKD86MjkoXFwuKTA/MlxcMyg/Oig/Oig/OjFbNi05XXxbMi05XVxcZCk/KD86MFs0OF18WzI0NjhdWzA0OF18WzEzNTc5XVsyNl0pfCg/Oig/OjE2fFsyNDY4XVswNDhdfFszNTc5XVsyNl0pMDApKSkpJHxeKD86MD9bMS05XXwxXFxkfDJbMC04XSkoXFwuKSg/Oig/OjA/WzEtOV0pfCg/OjFbMC0yXSkpXFw0KD86KD86MVs2LTldfFsyLTldXFxkKT9cXGR7NH0pJC8sXHJcbiAgICAgICAgICAgICAgICByZWdNYXRjaCA9IC8oXFxkezEsMn0pXFwuKFxcZHsxLDJ9KVxcLihcXGR7NH0pLyxcclxuICAgICAgICAgICAgICAgIG1pbiA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWluJyksXHJcbiAgICAgICAgICAgICAgICBtYXggPSBhcmd1bWVudHNbMl0uJGVsZW1lbnQuZGF0YSgnZGF0ZU1heCcpLFxyXG4gICAgICAgICAgICAgICAgbWluRGF0ZSwgbWF4RGF0ZSwgdmFsdWVEYXRlLCByZXN1bHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAobWluICYmIChyZXN1bHQgPSBtaW4ubWF0Y2gocmVnTWF0Y2gpKSkge1xyXG4gICAgICAgICAgICAgICAgbWluRGF0ZSA9IG5ldyBEYXRlKCtyZXN1bHRbM10sIHJlc3VsdFsyXSAtIDEsICtyZXN1bHRbMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChtYXggJiYgKHJlc3VsdCA9IG1heC5tYXRjaChyZWdNYXRjaCkpKSB7XHJcbiAgICAgICAgICAgICAgICBtYXhEYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlc3VsdCA9IHZhbHVlLm1hdGNoKHJlZ01hdGNoKSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVEYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZWdUZXN0LnRlc3QodmFsdWUpICYmIChtaW5EYXRlID8gdmFsdWVEYXRlID49IG1pbkRhdGUgOiB0cnVlKSAmJiAobWF4RGF0ZSA/IHZhbHVlRGF0ZSA8PSBtYXhEYXRlIDogdHJ1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90LDRjyDQtNCw0YLQsCcsXHJcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGRhdGUnXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vINCk0LDQudC7INC+0LPRgNCw0L3QuNGH0LXQvdC90L7Qs9C+INGA0LDQt9C80LXRgNCwXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZU1heFNpemUnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlLCBtYXhTaXplLCBwYXJzbGV5SW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgbGV0IGZpbGVzID0gcGFyc2xleUluc3RhbmNlLiRlbGVtZW50WzBdLmZpbGVzO1xyXG4gICAgICAgICAgICByZXR1cm4gZmlsZXMubGVuZ3RoICE9IDEgIHx8IGZpbGVzWzBdLnNpemUgPD0gbWF4U2l6ZSAqIDEwMjQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXF1aXJlbWVudFR5cGU6ICdpbnRlZ2VyJyxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ9Ck0LDQudC7INC00L7Qu9C20LXQvSDQstC10YHQuNGC0Ywg0L3QtSDQsdC+0LvQtdC1LCDRh9C10LwgJXMgS2InLFxyXG4gICAgICAgICAgICBlbjogJ0ZpbGUgc2l6ZSBjYW5cXCd0IGJlIG1vcmUgdGhlbiAlcyBLYidcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQntCz0YDQsNC90LjRh9C10L3QuNGPINGA0LDRgdGI0LjRgNC10L3QuNC5INGE0LDQudC70L7QslxyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2ZpbGVFeHRlbnNpb24nLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlLCBmb3JtYXRzKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlRXh0ZW5zaW9uID0gdmFsdWUuc3BsaXQoJy4nKS5wb3AoKTtcclxuICAgICAgICAgICAgbGV0IGZvcm1hdHNBcnIgPSBmb3JtYXRzLnNwbGl0KCcsICcpO1xyXG4gICAgICAgICAgICBsZXQgdmFsaWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9ybWF0c0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpbGVFeHRlbnNpb24gPT09IGZvcm1hdHNBcnJbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWxpZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAn0JTQvtC/0YPRgdGC0LjQvNGLINGC0L7Qu9GM0LrQviDRhNCw0LnQu9GLINGE0L7RgNC80LDRgtCwICVzJyxcclxuICAgICAgICAgICAgZW46ICdBdmFpbGFibGUgZXh0ZW5zaW9ucyBhcmUgJXMnXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KHQvtC30LTQsNGR0YIg0LrQvtC90YLQtdC50L3QtdGA0Ysg0LTQu9GPINC+0YjQuNCx0L7QuiDRgyDQvdC10YLQuNC/0LjRh9C90YvRhSDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgIFBhcnNsZXkub24oJ2ZpZWxkOmluaXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgJGVsZW1lbnQgPSB0aGlzLiRlbGVtZW50LFxyXG4gICAgICAgICAgICB0eXBlID0gJGVsZW1lbnQuYXR0cigndHlwZScpLFxyXG4gICAgICAgICAgICAkYmxvY2sgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcygnZXJyb3JzLXBsYWNlbWVudCcpLFxyXG4gICAgICAgICAgICAkbGFzdDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcclxuICAgICAgICAgICAgJGxhc3QgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKTtcclxuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xyXG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJyk7XHJcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQuY2xvc2VzdCgnLmN1c3RvbS1maWxlJyk7XHJcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmNsb3Nlc3QoJy5qcy1kYXRlcGlja2VyLXJhbmdlJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKTtcclxuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuYXR0cignbmFtZScpID09ICdpc19yZWNhcHRjaGFfc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5wYXJlbnQoKS5uZXh0KCcuZy1yZWNhcHRjaGEnKTtcclxuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCY0L3QuNGG0LjQuNGA0YPQtdGCINCy0LDQu9C40LTQsNGG0LjRjiDQvdCwINCy0YLQvtGA0L7QvCDQutCw0LvQtdC00LDRgNC90L7QvCDQv9C+0LvQtSDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgIFBhcnNsZXkub24oJ2ZpZWxkOnZhbGlkYXRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCAkZWxlbWVudCA9ICQodGhpcy5lbGVtZW50KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJ2Zvcm1bZGF0YS12YWxpZGF0ZT1cInRydWVcIl0nKS5wYXJzbGV5KCk7XHJcbiAgICAvKipcclxuICAgICAqINCU0L7QsdCw0LLQu9GP0LXRgiDQvNCw0YHQutC4INCyINC/0L7Qu9GPINGE0L7RgNC8XHJcbiAgICAgKiBAc2VlICBodHRwczovL2dpdGh1Yi5jb20vUm9iaW5IZXJib3RzL0lucHV0bWFza1xyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiA8aW5wdXQgY2xhc3M9XCJqcy1waG9uZS1tYXNrXCIgdHlwZT1cInRlbFwiIG5hbWU9XCJ0ZWxcIiBpZD1cInRlbFwiPlxyXG4gICAgICovXHJcbiAgICAkKCcuanMtcGhvbmUtbWFzaycpLmlucHV0bWFzaygnKzcoOTk5KSA5OTktOTktOTknLCB7XHJcbiAgICAgICAgY2xlYXJNYXNrT25Mb3N0Rm9jdXM6IHRydWUsXHJcbiAgICAgICAgc2hvd01hc2tPbkhvdmVyOiBmYWxzZVxyXG4gICAgfSk7XHJcblxyXG4gICAgJCggXCIuZmxhZ21hbi1yZXF1ZXN0X19kYXRlXCIgKS5kYXRlcGlja2VyKCk7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtGB0YLRi9C70Ywg0LTQu9GPINC+0LHQvdC+0LLQu9C10L3QuNGPIHhsaW5rINGDIHN2Zy3QuNC60L7QvdC+0Log0L/QvtGB0LvQtSDQvtCx0L3QvtCy0LvQtdC90LjRjyBET00gKNC00LvRjyBJRSlcclxuICAgICAqINGE0YPQvdC60YbQuNGOINC90YPQttC90L4g0LLRi9C30YvQstCw0YLRjCDQsiDRgdC+0LHRi9GC0LjRj9GFLCDQutC+0YLQvtGA0YvQtSDQstC90L7RgdGP0YIg0LjQt9C80LXQvdC10L3QuNGPINCyINGN0LvQtdC80LXQvdGC0Ysg0YPQttC1INC/0L7RgdC70LUg0YTQvtGA0LzQuNGA0L7QstCw0L3QuNGPIERPTS3QsFxyXG4gICAgICogKNC90LDQv9GA0LjQvNC10YAsINC/0L7RgdC70LUg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Lgg0LrQsNGA0YPRgdC10LvQuCDQuNC70Lgg0L7RgtC60YDRi9GC0LjQuCDQv9C+0L/QsNC/0LApXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7RWxlbWVudH0gZWxlbWVudCDRjdC70LXQvNC10L3Rgiwg0LIg0LrQvtGC0L7RgNC+0Lwg0L3QtdC+0LHRhdC+0LTQuNC80L4g0L7QsdC90L7QstC40YLRjCBzdmcgKNC90LDQv9GA0LjQvCAkKCcjc29tZS1wb3B1cCcpKVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVTdmcoZWxlbWVudCkge1xyXG4gICAgICAgIGxldCAkdXNlRWxlbWVudCA9IGVsZW1lbnQuZmluZCgndXNlJyk7XHJcblxyXG4gICAgICAgICR1c2VFbGVtZW50LmVhY2goZnVuY3Rpb24oIGluZGV4ICkge1xyXG4gICAgICAgICAgICBpZiAoJHVzZUVsZW1lbnRbaW5kZXhdLmhyZWYgJiYgJHVzZUVsZW1lbnRbaW5kZXhdLmhyZWYuYmFzZVZhbCkge1xyXG4gICAgICAgICAgICAgICAgJHVzZUVsZW1lbnRbaW5kZXhdLmhyZWYuYmFzZVZhbCA9ICR1c2VFbGVtZW50W2luZGV4XS5ocmVmLmJhc2VWYWw7IC8vIHRyaWdnZXIgZml4aW5nIG9mIGhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgIGRhdGVGb3JtYXQ6ICdkZC5tbS55eScsXHJcbiAgICAgICAgc2hvd090aGVyTW9udGhzOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC70LDQtdGCINCy0YvQv9Cw0LTRjtGJ0LjQtSDQutCw0LvQtdC90LTQsNGA0LjQutC4XHJcbiAgICAgKiBAc2VlICBodHRwOi8vYXBpLmpxdWVyeXVpLmNvbS9kYXRlcGlja2VyL1xyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiAvLyDQsiBkYXRhLWRhdGUtbWluINC4IGRhdGEtZGF0ZS1tYXgg0LzQvtC20L3QviDQt9Cw0LTQsNGC0Ywg0LTQsNGC0YMg0LIg0YTQvtGA0LzQsNGC0LUgZGQubW0ueXl5eVxyXG4gICAgICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImRhdGVJbnB1dFwiIGlkPVwiXCIgY2xhc3M9XCJqcy1kYXRlcGlja2VyXCIgZGF0YS1kYXRlLW1pbj1cIjA2LjExLjIwMTVcIiBkYXRhLWRhdGUtbWF4PVwiMTAuMTIuMjAxNVwiPlxyXG4gICAgICovXHJcbiAgICBsZXQgRGF0ZXBpY2tlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBkYXRlcGlja2VyID0gJCgnLmpzLWRhdGVwaWNrZXInKTtcclxuXHJcbiAgICAgICAgZGF0ZXBpY2tlci5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IG1pbkRhdGUgPSAkKHRoaXMpLmRhdGEoJ2RhdGUtbWluJyk7XHJcbiAgICAgICAgICAgIGxldCBtYXhEYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1heCcpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGl0ZW1PcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgbWluRGF0ZTogbWluRGF0ZSB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgbWF4RGF0ZTogbWF4RGF0ZSB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuZmllbGQnKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBpdGVtT3B0aW9ucywgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgICQodGhpcykuZGF0ZXBpY2tlcihpdGVtT3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBkYXRlcGlja2VyID0gbmV3IERhdGVwaWNrZXIoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8vINCU0LjQsNC/0LDQt9C+0L0g0LTQsNGCXHJcbiAgICBsZXQgRGF0ZXBpY2tlclJhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGRhdGVwaWNrZXJSYW5nZSA9ICQoJy5qcy1kYXRlcGlja2VyLXJhbmdlJyk7XHJcblxyXG4gICAgICAgIGRhdGVwaWNrZXJSYW5nZS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IGZyb21JdGVtT3B0aW9ucyA9IHt9O1xyXG4gICAgICAgICAgICBsZXQgdG9JdGVtT3B0aW9ucyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgZnJvbUl0ZW1PcHRpb25zLCBkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMpO1xyXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCB0b0l0ZW1PcHRpb25zLCBkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRhdGVGcm9tID0gJCh0aGlzKS5maW5kKCcuanMtcmFuZ2UtZnJvbScpLmRhdGVwaWNrZXIoZnJvbUl0ZW1PcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBkYXRlVG8gPSAkKHRoaXMpLmZpbmQoJy5qcy1yYW5nZS10bycpLmRhdGVwaWNrZXIodG9JdGVtT3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBkYXRlRnJvbS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlVG8uZGF0ZXBpY2tlcignb3B0aW9uJywgJ21pbkRhdGUnLCBnZXREYXRlKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkYXRlVG8ucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygncGFyc2xleS1lcnJvcicpICYmICQodGhpcykucGFyc2xleSgpLmlzVmFsaWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyc2xleSgpLnZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZGF0ZVRvLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRhdGVGcm9tLmRhdGVwaWNrZXIoJ29wdGlvbicsICdtYXhEYXRlJywgZ2V0RGF0ZSh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGF0ZUZyb20ucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygncGFyc2xleS1lcnJvcicpICYmICQodGhpcykucGFyc2xleSgpLmlzVmFsaWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyc2xleSgpLnZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXREYXRlKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgbGV0IGRhdGU7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZGF0ZSA9ICQuZGF0ZXBpY2tlci5wYXJzZURhdGUoZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zLmRhdGVGb3JtYXQsIGVsZW1lbnQudmFsdWUpO1xyXG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgZGF0ZXBpY2tlclJhbmdlID0gbmV3IERhdGVwaWNrZXJSYW5nZSgpO1xyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10LDQu9C40LfRg9C10YIg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNC1INGC0LDQsdC+0LJcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogPHVsIGNsYXNzPVwidGFicyBqcy10YWJzXCI+XHJcbiAgICAgKiAgICAgPGxpIGNsYXNzPVwidGFic19faXRlbVwiPlxyXG4gICAgICogICAgICAgICA8c3BhbiBjbGFzcz1cImlzLWFjdGl2ZSB0YWJzX19saW5rIGpzLXRhYi1saW5rXCI+VGFiIG5hbWU8L3NwYW4+XHJcbiAgICAgKiAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJzX19jbnRcIj5cclxuICAgICAqICAgICAgICAgICAgIDxwPlRhYiBjb250ZW50PC9wPlxyXG4gICAgICogICAgICAgICA8L2Rpdj5cclxuICAgICAqICAgICA8L2xpPlxyXG4gICAgICogPC91bD5cclxuICAgICAqL1xyXG4gICAgbGV0IFRhYlN3aXRjaGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgdGFicyA9ICQoJy5qcy10YWJzJyk7XHJcblxyXG4gICAgICAgIHRhYnMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuanMtdGFiLWxpbmsuaXMtYWN0aXZlJykubmV4dCgpLmFkZENsYXNzKCdpcy1vcGVuJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRhYnMub24oJ2NsaWNrJywgJy5qcy10YWItbGluaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHNlbGYub3BlbigkKHRoaXMpLCBldmVudCk7XHJcblxyXG4gICAgICAgICAgICAvLyByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCe0YLQutGA0YvQstCw0LXRgiDRgtCw0LEg0L/QviDQutC70LjQutGDINC90LAg0LrQsNC60L7QuS3RgtC+INC00YDRg9Cz0L7QuSDRjdC70LXQvNC10L3RglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAgKiA8c3BhbiBkYXRhLXRhYi1vcGVuPVwiI3RhYi1sb2dpblwiPk9wZW4gbG9naW4gdGFiPC9zcGFuPlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS10YWItb3Blbl0nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCB0YWJFbGVtID0gJCh0aGlzKS5kYXRhKCd0YWItb3BlbicpO1xyXG4gICAgICAgICAgICBzZWxmLm9wZW4oJCh0YWJFbGVtKSwgZXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCQodGhpcykuZGF0YSgncG9wdXAnKSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQntGC0LrRgNGL0LLQsNC10YIg0YLQsNCxXHJcbiAgICAgICAgICogQHBhcmFtICB7RWxlbWVudH0gZWxlbSDRjdC70LXQvNC10L3RgiAuanMtdGFiLWxpbmssINC90LAg0LrQvtGC0L7RgNGL0Lkg0L3Rg9C20L3QviDQv9C10YDQtdC60LvRjtGH0LjRgtGMXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICAqIC8vINCy0YvQt9C+0LIg0LzQtdGC0L7QtNCwIG9wZW4sINC+0YLQutGA0L7QtdGCINGC0LDQsVxyXG4gICAgICAgICAqIHRhYlN3aXRjaGVyLm9wZW4oJCgnI3NvbWUtdGFiJykpO1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNlbGYub3BlbiA9IGZ1bmN0aW9uKGVsZW0sIGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmICghZWxlbS5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50VGFicyA9IGVsZW0uY2xvc2VzdCh0YWJzKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudFRhYnMuZmluZCgnLmlzLW9wZW4nKS5yZW1vdmVDbGFzcygnaXMtb3BlbicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGVsZW0ubmV4dCgpLnRvZ2dsZUNsYXNzKCdpcy1vcGVuJyk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRUYWJzLmZpbmQoJy5pcy1hY3RpdmUnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBlbGVtLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgdGFiU3dpdGNoZXIgPSBuZXcgVGFiU3dpdGNoZXIoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0LrRgNGL0LLQsNC10YIg0Y3Qu9C10LzQtdC90YIgaGlkZGVuRWxlbSDQv9GA0Lgg0LrQu9C40LrQtSDQt9CwINC/0YDQtdC00LXQu9Cw0LzQuCDRjdC70LXQvNC10L3RgtCwIHRhcmdldEVsZW1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtFbGVtZW50fSAgIHRhcmdldEVsZW1cclxuICAgICAqIEBwYXJhbSAge0VsZW1lbnR9ICAgaGlkZGVuRWxlbVxyXG4gICAgICogQHBhcmFtICB7RnVuY3Rpb259ICBbb3B0aW9uYWxDYl0g0L7RgtGA0LDQsdCw0YLRi9Cy0LDQtdGCINGB0YDQsNC30YMg0L3QtSDQtNC+0LbQuNC00LDRj9GB0Ywg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBvbk91dHNpZGVDbGlja0hpZGUodGFyZ2V0RWxlbSwgaGlkZGVuRWxlbSwgb3B0aW9uYWxDYikge1xyXG4gICAgICAgICQoZG9jdW1lbnQpLmJpbmQoJ21vdXNldXAgdG91Y2hlbmQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0RWxlbS5pcyhlLnRhcmdldCkgJiYgJChlLnRhcmdldCkuY2xvc2VzdCh0YXJnZXRFbGVtKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaGlkZGVuRWxlbS5zdG9wKHRydWUsIHRydWUpLmZhZGVPdXQoZ2xvYmFsT3B0aW9ucy50aW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25hbENiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uYWxDYigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpdGN0LvQv9C10YAg0LTQu9GPINC/0L7QutCw0LfQsCwg0YHQutGA0YvRgtC40Y8g0LjQu9C4INGH0LXRgNC10LTQvtCy0LDQvdC40Y8g0LLQuNC00LjQvNC+0YHRgtC4INGN0LvQtdC80LXQvdGC0L7QslxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXZpc2liaWxpdHk9XCJzaG93XCIgZGF0YS1zaG93PVwiI2VsZW1JZDFcIj48L2J1dHRvbj5cclxuICAgICAqXHJcbiAgICAgKiDQuNC70LhcclxuICAgICAqIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdmlzaWJpbGl0eT1cImhpZGVcIiBkYXRhLWhpZGU9XCIjZWxlbUlkMlwiPjwvYnV0dG9uPlxyXG4gICAgICpcclxuICAgICAqINC40LvQuFxyXG4gICAgICogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS12aXNpYmlsaXR5PVwidG9nZ2xlXCIgZGF0YS10b2dnbGU9XCIjZWxlbUlkM1wiPjwvYnV0dG9uPlxyXG4gICAgICpcclxuICAgICAqINC40LvQuFxyXG4gICAgICogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS12aXNpYmlsaXR5PVwic2hvd1wiIGRhdGEtc2hvdz1cIiNlbGVtSWQxfCNlbGVtSWQzXCI+PC9idXR0b24+XHJcbiAgICAgKlxyXG4gICAgICog0LjQu9C4XHJcbiAgICAgKiAvLyDQtdGB0LvQuCDQtdGB0YLRjCDQsNGC0YDQuNCx0YPRgiBkYXRhLXF1ZXVlPVwic2hvd1wiLCDRgtC+INCx0YPQtNC10YIg0YHQvdCw0YfQsNC70LAg0YHQutGA0YvRgiDRjdC70LXQvNC10L3RgiAjZWxlbUlkMiwg0LAg0L/QvtGC0L7QvCDQv9C+0LrQsNC30LDQvSAjZWxlbUlkMVxyXG4gICAgICogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS12aXNpYmlsaXR5PVwic2hvd1wiIGRhdGEtc2hvdz1cIiNlbGVtSWQxXCIgZGF0YS12aXNpYmlsaXR5PVwiaGlkZVwiIGRhdGEtaGlkZT1cIiNlbGVtSWQyXCIgZGF0YS1xdWV1ZT1cInNob3dcIj48L2J1dHRvbj5cclxuICAgICAqXHJcbiAgICAgKiA8ZGl2IGlkPVwiZWxlbUlkMVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5UZXh0PC9kaXY+XHJcbiAgICAgKiA8ZGl2IGlkPVwiZWxlbUlkMlwiPlRleHQ8L2Rpdj5cclxuICAgICAqIDxkaXYgaWQ9XCJlbGVtSWQzXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlRleHQ8L2Rpdj5cclxuICAgICAqL1xyXG4gICAgbGV0IHZpc2liaWxpdHlDb250cm9sID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICB0eXBlczogW1xyXG4gICAgICAgICAgICAgICAgJ3Nob3cnLFxyXG4gICAgICAgICAgICAgICAgJ2hpZGUnLFxyXG4gICAgICAgICAgICAgICAgJ3RvZ2dsZSdcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICgkKCdbZGF0YS12aXNpYmlsaXR5XScpLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS12aXNpYmlsaXR5XScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRhdGFUeXBlO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXR0aW5ncy50eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlID0gc2V0dGluZ3MudHlwZXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmRhdGEoZGF0YVR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2aXNpYmlsaXR5TGlzdCA9ICQodGhpcykuZGF0YShkYXRhVHlwZSkuc3BsaXQoJ3wnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5ID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmRhdGEoJ3F1ZXVlJykgPT0gJ3Nob3cnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheSA9IGdsb2JhbE9wdGlvbnMudGltZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRWaXNpYmlsaXR5KGRhdGFUeXBlLCB2aXNpYmlsaXR5TGlzdCwgZGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ3RhYnNfX2xpbmsnKSAmJiAkKHRoaXMpLmF0dHIoJ3R5cGUnKSAhPSAncmFkaW8nICYmICQodGhpcykuYXR0cigndHlwZScpICE9ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINCy0LjQtNC40LzQvtGB0YLRjFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIHZpc2liaWxpdHlUeXBlINGC0LjQvyDQvtGC0L7QsdGA0LDQttC10L3QuNGPXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXl9ICAgbGlzdCDQvNCw0YHRgdC40LIg0Y3Qu9C10LzQtdC90YLQvtCyLCDRgSDQutC+0YLQvtGA0YvQvCDRgNCw0LHQvtGC0LDQtdC8XHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSAgZGVsYXkg0LfQsNC00LXRgNC20LrQsCDQv9GA0Lgg0L/QvtC60LDQt9C1INGN0LvQtdC80LXQvdGC0LAg0LIgbXNcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldFZpc2liaWxpdHkodmlzaWJpbGl0eVR5cGUsIGxpc3QsIGRlbGF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmlzaWJpbGl0eVR5cGUgPT0gc2V0dGluZ3MudHlwZXNbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChsaXN0W2ldKS5kZWxheShkZWxheSkuZmFkZUluKGdsb2JhbE9wdGlvbnMudGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmlzaWJpbGl0eVR5cGUgPT0gc2V0dGluZ3MudHlwZXNbMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChsaXN0W2ldKS5mYWRlT3V0KGdsb2JhbE9wdGlvbnMudGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmlzaWJpbGl0eVR5cGUgPT0gc2V0dGluZ3MudHlwZXNbMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQobGlzdFtpXSkuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQobGlzdFtpXSkuZmFkZU91dChnbG9iYWxPcHRpb25zLnRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChsaXN0W2ldKS5mYWRlSW4oZ2xvYmFsT3B0aW9ucy50aW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHZpc2liaWxpdHlDb250cm9sKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LvQsNC10YIg0YHQu9Cw0LnQtNC10YBcclxuICAgICAqIEBzZWUgIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL3NsaWRlci9cclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogLy8g0LIgZGF0YS1taW4g0LggZGF0YS1tYXgg0LfQsNC00LDRjtGC0YHRjyDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC4INC80LDQutGB0LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1XHJcbiAgICAgKiAvLyDQsiBkYXRhLXN0ZXAg0YjQsNCzLFxyXG4gICAgICogLy8g0LIgZGF0YS12YWx1ZXMg0LTQtdGE0L7Qu9GC0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8gXCJtaW4sIG1heFwiXHJcbiAgICAgKiA8ZGl2IGNsYXNzPVwic2xpZGVyIGpzLXJhbmdlXCI+XHJcbiAgICAgKiAgICAgIDxkaXYgY2xhc3M9XCJzbGlkZXJfX3JhbmdlXCIgZGF0YS1taW49XCIwXCIgZGF0YS1tYXg9XCIxMDBcIiBkYXRhLXN0ZXA9XCIxXCIgZGF0YS12YWx1ZXM9XCIxMCwgNTVcIj48L2Rpdj5cclxuICAgICAqIDwvZGl2PlxyXG4gICAgICovXHJcbiAgICBsZXQgU2xpZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgc2xpZGVyID0gJCgnLmpzLXJhbmdlJyk7XHJcbiAgICAgICAgbGV0IG1pbixcclxuICAgICAgICAgICAgbWF4LFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICB2YWx1ZXM7XHJcblxyXG4gICAgICAgIHNsaWRlci5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGYgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBzZWxmLmZpbmQoJy5zbGlkZXJfX3JhbmdlJyk7XHJcblxyXG4gICAgICAgICAgICBtaW4gPSByYW5nZS5kYXRhKCdtaW4nKTtcclxuICAgICAgICAgICAgbWF4ID0gcmFuZ2UuZGF0YSgnbWF4Jyk7XHJcbiAgICAgICAgICAgIHN0ZXAgPSByYW5nZS5kYXRhKCdzdGVwJyk7XHJcbiAgICAgICAgICAgIHZhbHVlcyA9IHJhbmdlLmRhdGEoJ3ZhbHVlcycpLnNwbGl0KCcsICcpO1xyXG5cclxuICAgICAgICAgICAgcmFuZ2Uuc2xpZGVyKHtcclxuICAgICAgICAgICAgICAgIHJhbmdlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWluOiBtaW4gfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIG1heDogbWF4IHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICBzdGVwOiBzdGVwIHx8IDEsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IHZhbHVlcyxcclxuICAgICAgICAgICAgICAgIHNsaWRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmZpbmQoJy51aS1zbGlkZXItaGFuZGxlJykuY2hpbGRyZW4oJ3NwYW4nKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmZpbmQoJy51aS1zbGlkZXItaGFuZGxlOm50aC1jaGlsZCgyKScpLmFwcGVuZChgPHNwYW4+JHt1aS52YWx1ZXNbMF19PC9zcGFuPmApO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZmluZCgnLnVpLXNsaWRlci1oYW5kbGU6bnRoLWNoaWxkKDMpJykuYXBwZW5kKGA8c3Bhbj4ke3VpLnZhbHVlc1sxXX08L3NwYW4+YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5maW5kKCcudWktc2xpZGVyLWhhbmRsZTpudGgtY2hpbGQoMiknKS5hcHBlbmQoYDxzcGFuPiR7cmFuZ2Uuc2xpZGVyKCd2YWx1ZXMnLCAwKX08L3NwYW4+YCk7XHJcbiAgICAgICAgICAgIHNlbGYuZmluZCgnLnVpLXNsaWRlci1oYW5kbGU6bnRoLWNoaWxkKDMpJykuYXBwZW5kKGA8c3Bhbj4ke3JhbmdlLnNsaWRlcigndmFsdWVzJywgMSl9PC9zcGFuPmApO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgbGV0IHNsaWRlciA9IG5ldyBTbGlkZXIoKTtcclxuXHJcbiAgICB3aW5kb3cub25sb2FkPWZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IFBlcnNvbnM9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50ZWFtX3BlcnNvbnNfcGhvdG8nKTtcclxuICAgICAgICBQZXJzb25zLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgUGVyc29ucy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuc3R5bGUud2lkdGg9JzEzJSc7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudD1lbGVtZW50LnRhcmdldDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQuc3R5bGUud2lkdGg9XCIxOCVcIjtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLndpZHRoPVwiMTYlXCI7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmcuc3R5bGUud2lkdGg9XCIxNiVcIjtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQubmV4dEVsZW1lbnRTaWJsaW5nLm5leHRFbGVtZW50U2libGluZy5zdHlsZS53aWR0aD1cIjE0JVwiO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuc3R5bGUud2lkdGg9XCIxNCVcIjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAkKFwiLm1vZGFsX2RpYWxvZ19jb250ZW50X2l0ZW1cIikubm90KFwiOmZpcnN0XCIpLmhpZGUoKTtcclxuICAgICQoXCIubW9kYWxfZGlhbG9nX2NvbnRlbnQgLm1vZGFsX2J1dHRvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgIFx0JChcIi5tb2RhbF9kaWFsb2dfY29udGVudCAubW9kYWxfYnV0dG9uXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLmVxKCQodGhpcykuaW5kZXgoKSkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICBcdCQoXCIubW9kYWxfZGlhbG9nX2NvbnRlbnRfaXRlbVwiKS5oaWRlKCkuZXEoJCh0aGlzKS5pbmRleCgpKS5mYWRlSW4oKVxyXG4gICAgfSkuZXEoMCkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICBjb25zdCBtb2RhbENhbGwgPSAkKFwiW2RhdGEtbW9kYWxdXCIpO1xyXG4gICAgY29uc3QgbW9kYWxDbG9zZSA9ICQoXCJbZGF0YS1jbG9zZV1cIik7XHJcblxyXG4gICAgbW9kYWxDYWxsLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBsZXQgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgIGxldCBtb2RhbElkID0gJHRoaXMuZGF0YSgnbW9kYWwnKTtcclxuXHJcbiAgICAgICAgJChtb2RhbElkKS5hZGRDbGFzcygnc2hvdycpO1xyXG4gICAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKCduby1zY3JvbGwnKVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKG1vZGFsSWQpLmZpbmQoXCIubG9jYXRpb25cIikuY3NzKHtcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogXCJzY2FsZSgxKVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcblxyXG4gICAgXHJcblxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIG1vZGFsQ2xvc2Uub24oXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGxldCAkdGhpcyA9ICQodGhpcyk7XHJcbiAgICAgICAgbGV0IG1vZGFsUGFyZW50ID0gJHRoaXMucGFyZW50cygnLm1vZGFsJyk7XHJcblxyXG4gICAgICAgIG1vZGFsUGFyZW50LmZpbmQoXCIubG9jYXRpb25cIikuY3NzKHtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBcInNjYWxlKDApXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbW9kYWxQYXJlbnQucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuICAgICAgICAgICAgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoJ25vLXNjcm9sbCcpO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcblxyXG4gICAgXHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIi5tb2RhbFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgbGV0ICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgJHRoaXMuZmluZChcIi5sb2NhdGlvblwiKS5jc3Moe1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMClcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkdGhpcy5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG4gICAgICAgICAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcygnbm8tc2Nyb2xsJyk7XHJcbiAgICAgICAgfSwgMjAwKTtcclxuIFxyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIi5sb2NhdGlvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9KTtcclxuICAgIGxldCBkb2M9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb250cicpO1xyXG4gICAgZG9jLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGRvYy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgbm9kZS5zdHlsZS53aWR0aD0nMjIzcHgnO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50PWVsZW1lbnQudGFyZ2V0O1xyXG4gICAgICAgICAgICBjdXJyZW50LnN0eWxlLndpZHRoPVwiMjg0cHhcIjtcclxuICAgICAgICBcclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcbiAgICBcclxuICAgICQoJ2FbaHJlZl49XCIjXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAvLyDQvtGC0LzQtdC90Y/QtdC8INGB0YLQsNC90LTQsNGA0YLQvdC+0LUg0LTQtdC50YHRgtCy0LjQtVxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBcclxuICAgICAgICB2YXIgc2MgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpLFxyXG4gICAgICAgICAgICBkbiA9ICQoc2MpLm9mZnNldCgpLnRvcDtcclxuICAgICAgICAvKlxyXG4gICAgICAgICogc2MgLSDQsiDQv9C10YDQtdC80LXQvdC90YPRjiDQt9Cw0L3QvtGB0LjQvCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDRgtC+0LwsINC6INC60LDQutC+0LzRgyDQsdC70L7QutGDINC90LDQtNC+INC/0LXRgNC10LnRgtC4XHJcbiAgICAgICAgKiBkbiAtINC+0L/RgNC10LTQtdC70Y/QtdC8INC/0L7Qu9C+0LbQtdC90LjQtSDQsdC70L7QutCwINC90LAg0YHRgtGA0LDQvdC40YbQtVxyXG4gICAgICAgICovXHJcbiAgICBcclxuICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiBkbn0sIDEwMDApO1xyXG4gICAgXHJcbiAgICAgICAgLypcclxuICAgICAgICAqIDEwMDAg0YHQutC+0YDQvtGB0YLRjCDQv9C10YDQtdGF0L7QtNCwINCyINC80LjQu9C70LjRgdC10LrRg9C90LTQsNGFXHJcbiAgICAgICAgKi9cclxuICAgIH0pO1xyXG5cclxuICAgIC8qd2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgd2luZG93Lk5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhc2VzX2NvbnRlbnRfaXRlbScpO1xyXG4gICAgICAgIGxldCBpID0gLTE7XHJcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcclxuICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZID4gTm9kZXNbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueSkge1xyXG4gICAgICAgICAgICAgICAgZmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgICB7XHJcbiAgICAgICAgICAgIHBhc3NpdmU6IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChmbGFnID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzY3JvbGwnICsgd2luZG93LnNjcm9sbFkpO1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvdW50KTtcclxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCBOb2Rlcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgTm9kZXNbaV0uc2Nyb2xsSW50b1ZpZXcoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYWc9ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHBhc3NpdmU6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAqL1xyXG4gICAgLy8gJChcIi5jYXNlc19zaWRlYmFyX2xpc3RfaXRlbVwiKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAvLyAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgLy8gICAgICQoXCIuY2FzZXNfc2lkZWJhcl9saXN0X2l0ZW1cIikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgLy8gICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgLy8gfSk7XHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgICAgICQoXCIuaW50cm9fY2FzZXNcIikuaGlkZSgpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgICQoXCIjb3BcIikuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAvLyAkKFwiLmludHJvX2l0ZW1zXCIpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAvLyAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgLy8gJChcIi5pbnRyb19pdGVtc1wiKS5hZGRDbGFzcygnZGlzcGxheV9ub25lJyk7XHJcbiAgICAgICAgJChcIi5pbnRyb19pdGVtc1wiKS5oaWRlKCk7XHJcbiAgICAgICAgJChcIi5pbnRyb19jYXNlc1wiKS5zaG93KCdzcGVlZCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgIC8vIFx0JChcIiNvcFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgLy8gXHRcdCQoXCIuaW50cm9faXRlbXNcIikudG9nZ2xlQ2xhc3MoXCJkaXNwbGF5X25vbmVcIik7IHJldHVybiBmYWxzZTtcclxuICAgIC8vIFx0fSk7XHJcbiAgICAvLyB9KTtcclxuXHJcblxyXG4gICAgLy8gJChcIiNidG4tZHJvcFwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgIC8vICAgICBpZiAoZmxhZ1snZHJvcCddID0gIWZsYWdbJ2Ryb3AnXSkge1xyXG4gICAgLy8gICAgICAgICAkKFwiI3Rlc3QtZHJvcFwiKS5oaWRlKFwiZHJvcFwiLCB7IGRpcmVjdGlvbjogXCJyaWdodFwiIH0sIDEwMDApO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICBlbHNlIHtcclxuICAgIC8vICAgICAgICAgJChcIiN0ZXN0LWRyb3BcIikuc2hvdyhcImRyb3BcIiwgeyBkaXJlY3Rpb246IFwiZG93blwiIH0sIDUwMCk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfSk7XHJcbiAgICAvKipcclxuICAgICAqINCk0LjQutGB0LjRgNC+0LLQsNC90L3Ri9C5INGF0LXQtNC10YBcclxuICAgICAqL1xyXG5cclxuICAgIC8vICQod2luZG93KS5vbignc2Nyb2xsJywgdG9nZ2xlRml4ZWRIZWFkZXIpO1xyXG5cclxuICAgIC8vIGZ1bmN0aW9uIHRvZ2dsZUZpeGVkSGVhZGVyKCkge1xyXG4gICAgLy8gICAgIGNvbnN0ICRoZWFkZXIgPSAkKCcuaGVhZGVyJyk7XHJcbiAgICAvLyAgICAgY29uc3QgJG1haW4gPSAkKCcuaGVhZGVyJykubmV4dCgpO1xyXG5cclxuICAgIC8vICAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gMCkge1xyXG4gICAgLy8gICAgICAgICAkaGVhZGVyLmFkZENsYXNzKCdpcy1maXhlZCcpO1xyXG4gICAgLy8gICAgICAgICAkbWFpbi5jc3MoeyBtYXJnaW5Ub3A6ICRoZWFkZXIub3V0ZXJIZWlnaHQoKSB9KTtcclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdpcy1maXhlZCcpO1xyXG4gICAgLy8gICAgICAgICAkbWFpbi5jc3MoeyBtYXJnaW5Ub3A6IDAgfSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG5cclxuICAgICFmdW5jdGlvbihpKXtcInVzZSBzdHJpY3RcIjtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImpxdWVyeVwiXSxpKTpcInVuZGVmaW5lZFwiIT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1pKHJlcXVpcmUoXCJqcXVlcnlcIikpOmkoalF1ZXJ5KX0oZnVuY3Rpb24oaSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9d2luZG93LlNsaWNrfHx7fTsoZT1mdW5jdGlvbigpe3ZhciBlPTA7cmV0dXJuIGZ1bmN0aW9uKHQsbyl7dmFyIHMsbj10aGlzO24uZGVmYXVsdHM9e2FjY2Vzc2liaWxpdHk6ITAsYWRhcHRpdmVIZWlnaHQ6ITEsYXBwZW5kQXJyb3dzOmkodCksYXBwZW5kRG90czppKHQpLGFycm93czohMCxhc05hdkZvcjpudWxsLHByZXZBcnJvdzonPGJ1dHRvbiBjbGFzcz1cInNsaWNrLXByZXZcIiBhcmlhLWxhYmVsPVwiUHJldmlvdXNcIiB0eXBlPVwiYnV0dG9uXCI+UHJldmlvdXM8L2J1dHRvbj4nLG5leHRBcnJvdzonPGJ1dHRvbiBjbGFzcz1cInNsaWNrLW5leHRcIiBhcmlhLWxhYmVsPVwiTmV4dFwiIHR5cGU9XCJidXR0b25cIj5OZXh0PC9idXR0b24+JyxhdXRvcGxheTohMSxhdXRvcGxheVNwZWVkOjNlMyxjZW50ZXJNb2RlOiExLGNlbnRlclBhZGRpbmc6XCI1MHB4XCIsY3NzRWFzZTpcImVhc2VcIixjdXN0b21QYWdpbmc6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gaSgnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgLz4nKS50ZXh0KHQrMSl9LGRvdHM6ITEsZG90c0NsYXNzOlwic2xpY2stZG90c1wiLGRyYWdnYWJsZTohMCxlYXNpbmc6XCJsaW5lYXJcIixlZGdlRnJpY3Rpb246LjM1LGZhZGU6ITEsZm9jdXNPblNlbGVjdDohMSxmb2N1c09uQ2hhbmdlOiExLGluZmluaXRlOiEwLGluaXRpYWxTbGlkZTowLGxhenlMb2FkOlwib25kZW1hbmRcIixtb2JpbGVGaXJzdDohMSxwYXVzZU9uSG92ZXI6ITAscGF1c2VPbkZvY3VzOiEwLHBhdXNlT25Eb3RzSG92ZXI6ITEscmVzcG9uZFRvOlwid2luZG93XCIscmVzcG9uc2l2ZTpudWxsLHJvd3M6MSxydGw6ITEsc2xpZGU6XCJcIixzbGlkZXNQZXJSb3c6MSxzbGlkZXNUb1Nob3c6MSxzbGlkZXNUb1Njcm9sbDoxLHNwZWVkOjUwMCxzd2lwZTohMCxzd2lwZVRvU2xpZGU6ITEsdG91Y2hNb3ZlOiEwLHRvdWNoVGhyZXNob2xkOjUsdXNlQ1NTOiEwLHVzZVRyYW5zZm9ybTohMCx2YXJpYWJsZVdpZHRoOiExLHZlcnRpY2FsOiExLHZlcnRpY2FsU3dpcGluZzohMSx3YWl0Rm9yQW5pbWF0ZTohMCx6SW5kZXg6MWUzfSxuLmluaXRpYWxzPXthbmltYXRpbmc6ITEsZHJhZ2dpbmc6ITEsYXV0b1BsYXlUaW1lcjpudWxsLGN1cnJlbnREaXJlY3Rpb246MCxjdXJyZW50TGVmdDpudWxsLGN1cnJlbnRTbGlkZTowLGRpcmVjdGlvbjoxLCRkb3RzOm51bGwsbGlzdFdpZHRoOm51bGwsbGlzdEhlaWdodDpudWxsLGxvYWRJbmRleDowLCRuZXh0QXJyb3c6bnVsbCwkcHJldkFycm93Om51bGwsc2Nyb2xsaW5nOiExLHNsaWRlQ291bnQ6bnVsbCxzbGlkZVdpZHRoOm51bGwsJHNsaWRlVHJhY2s6bnVsbCwkc2xpZGVzOm51bGwsc2xpZGluZzohMSxzbGlkZU9mZnNldDowLHN3aXBlTGVmdDpudWxsLHN3aXBpbmc6ITEsJGxpc3Q6bnVsbCx0b3VjaE9iamVjdDp7fSx0cmFuc2Zvcm1zRW5hYmxlZDohMSx1bnNsaWNrZWQ6ITF9LGkuZXh0ZW5kKG4sbi5pbml0aWFscyksbi5hY3RpdmVCcmVha3BvaW50PW51bGwsbi5hbmltVHlwZT1udWxsLG4uYW5pbVByb3A9bnVsbCxuLmJyZWFrcG9pbnRzPVtdLG4uYnJlYWtwb2ludFNldHRpbmdzPVtdLG4uY3NzVHJhbnNpdGlvbnM9ITEsbi5mb2N1c3NlZD0hMSxuLmludGVycnVwdGVkPSExLG4uaGlkZGVuPVwiaGlkZGVuXCIsbi5wYXVzZWQ9ITAsbi5wb3NpdGlvblByb3A9bnVsbCxuLnJlc3BvbmRUbz1udWxsLG4ucm93Q291bnQ9MSxuLnNob3VsZENsaWNrPSEwLG4uJHNsaWRlcj1pKHQpLG4uJHNsaWRlc0NhY2hlPW51bGwsbi50cmFuc2Zvcm1UeXBlPW51bGwsbi50cmFuc2l0aW9uVHlwZT1udWxsLG4udmlzaWJpbGl0eUNoYW5nZT1cInZpc2liaWxpdHljaGFuZ2VcIixuLndpbmRvd1dpZHRoPTAsbi53aW5kb3dUaW1lcj1udWxsLHM9aSh0KS5kYXRhKFwic2xpY2tcIil8fHt9LG4ub3B0aW9ucz1pLmV4dGVuZCh7fSxuLmRlZmF1bHRzLG8scyksbi5jdXJyZW50U2xpZGU9bi5vcHRpb25zLmluaXRpYWxTbGlkZSxuLm9yaWdpbmFsU2V0dGluZ3M9bi5vcHRpb25zLHZvaWQgMCE9PWRvY3VtZW50Lm1vekhpZGRlbj8obi5oaWRkZW49XCJtb3pIaWRkZW5cIixuLnZpc2liaWxpdHlDaGFuZ2U9XCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCIpOnZvaWQgMCE9PWRvY3VtZW50LndlYmtpdEhpZGRlbiYmKG4uaGlkZGVuPVwid2Via2l0SGlkZGVuXCIsbi52aXNpYmlsaXR5Q2hhbmdlPVwid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiKSxuLmF1dG9QbGF5PWkucHJveHkobi5hdXRvUGxheSxuKSxuLmF1dG9QbGF5Q2xlYXI9aS5wcm94eShuLmF1dG9QbGF5Q2xlYXIsbiksbi5hdXRvUGxheUl0ZXJhdG9yPWkucHJveHkobi5hdXRvUGxheUl0ZXJhdG9yLG4pLG4uY2hhbmdlU2xpZGU9aS5wcm94eShuLmNoYW5nZVNsaWRlLG4pLG4uY2xpY2tIYW5kbGVyPWkucHJveHkobi5jbGlja0hhbmRsZXIsbiksbi5zZWxlY3RIYW5kbGVyPWkucHJveHkobi5zZWxlY3RIYW5kbGVyLG4pLG4uc2V0UG9zaXRpb249aS5wcm94eShuLnNldFBvc2l0aW9uLG4pLG4uc3dpcGVIYW5kbGVyPWkucHJveHkobi5zd2lwZUhhbmRsZXIsbiksbi5kcmFnSGFuZGxlcj1pLnByb3h5KG4uZHJhZ0hhbmRsZXIsbiksbi5rZXlIYW5kbGVyPWkucHJveHkobi5rZXlIYW5kbGVyLG4pLG4uaW5zdGFuY2VVaWQ9ZSsrLG4uaHRtbEV4cHI9L14oPzpcXHMqKDxbXFx3XFxXXSs+KVtePl0qKSQvLG4ucmVnaXN0ZXJCcmVha3BvaW50cygpLG4uaW5pdCghMCl9fSgpKS5wcm90b3R5cGUuYWN0aXZhdGVBREE9ZnVuY3Rpb24oKXt0aGlzLiRzbGlkZVRyYWNrLmZpbmQoXCIuc2xpY2stYWN0aXZlXCIpLmF0dHIoe1wiYXJpYS1oaWRkZW5cIjpcImZhbHNlXCJ9KS5maW5kKFwiYSwgaW5wdXQsIGJ1dHRvbiwgc2VsZWN0XCIpLmF0dHIoe3RhYmluZGV4OlwiMFwifSl9LGUucHJvdG90eXBlLmFkZFNsaWRlPWUucHJvdG90eXBlLnNsaWNrQWRkPWZ1bmN0aW9uKGUsdCxvKXt2YXIgcz10aGlzO2lmKFwiYm9vbGVhblwiPT10eXBlb2YgdClvPXQsdD1udWxsO2Vsc2UgaWYodDwwfHx0Pj1zLnNsaWRlQ291bnQpcmV0dXJuITE7cy51bmxvYWQoKSxcIm51bWJlclwiPT10eXBlb2YgdD8wPT09dCYmMD09PXMuJHNsaWRlcy5sZW5ndGg/aShlKS5hcHBlbmRUbyhzLiRzbGlkZVRyYWNrKTpvP2koZSkuaW5zZXJ0QmVmb3JlKHMuJHNsaWRlcy5lcSh0KSk6aShlKS5pbnNlcnRBZnRlcihzLiRzbGlkZXMuZXEodCkpOiEwPT09bz9pKGUpLnByZXBlbmRUbyhzLiRzbGlkZVRyYWNrKTppKGUpLmFwcGVuZFRvKHMuJHNsaWRlVHJhY2spLHMuJHNsaWRlcz1zLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkscy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpLHMuJHNsaWRlVHJhY2suYXBwZW5kKHMuJHNsaWRlcykscy4kc2xpZGVzLmVhY2goZnVuY3Rpb24oZSx0KXtpKHQpLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIsZSl9KSxzLiRzbGlkZXNDYWNoZT1zLiRzbGlkZXMscy5yZWluaXQoKX0sZS5wcm90b3R5cGUuYW5pbWF0ZUhlaWdodD1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aWYoMT09PWkub3B0aW9ucy5zbGlkZXNUb1Nob3cmJiEwPT09aS5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0JiYhMT09PWkub3B0aW9ucy52ZXJ0aWNhbCl7dmFyIGU9aS4kc2xpZGVzLmVxKGkuY3VycmVudFNsaWRlKS5vdXRlckhlaWdodCghMCk7aS4kbGlzdC5hbmltYXRlKHtoZWlnaHQ6ZX0saS5vcHRpb25zLnNwZWVkKX19LGUucHJvdG90eXBlLmFuaW1hdGVTbGlkZT1mdW5jdGlvbihlLHQpe3ZhciBvPXt9LHM9dGhpcztzLmFuaW1hdGVIZWlnaHQoKSwhMD09PXMub3B0aW9ucy5ydGwmJiExPT09cy5vcHRpb25zLnZlcnRpY2FsJiYoZT0tZSksITE9PT1zLnRyYW5zZm9ybXNFbmFibGVkPyExPT09cy5vcHRpb25zLnZlcnRpY2FsP3MuJHNsaWRlVHJhY2suYW5pbWF0ZSh7bGVmdDplfSxzLm9wdGlvbnMuc3BlZWQscy5vcHRpb25zLmVhc2luZyx0KTpzLiRzbGlkZVRyYWNrLmFuaW1hdGUoe3RvcDplfSxzLm9wdGlvbnMuc3BlZWQscy5vcHRpb25zLmVhc2luZyx0KTohMT09PXMuY3NzVHJhbnNpdGlvbnM/KCEwPT09cy5vcHRpb25zLnJ0bCYmKHMuY3VycmVudExlZnQ9LXMuY3VycmVudExlZnQpLGkoe2FuaW1TdGFydDpzLmN1cnJlbnRMZWZ0fSkuYW5pbWF0ZSh7YW5pbVN0YXJ0OmV9LHtkdXJhdGlvbjpzLm9wdGlvbnMuc3BlZWQsZWFzaW5nOnMub3B0aW9ucy5lYXNpbmcsc3RlcDpmdW5jdGlvbihpKXtpPU1hdGguY2VpbChpKSwhMT09PXMub3B0aW9ucy52ZXJ0aWNhbD8ob1tzLmFuaW1UeXBlXT1cInRyYW5zbGF0ZShcIitpK1wicHgsIDBweClcIixzLiRzbGlkZVRyYWNrLmNzcyhvKSk6KG9bcy5hbmltVHlwZV09XCJ0cmFuc2xhdGUoMHB4LFwiK2krXCJweClcIixzLiRzbGlkZVRyYWNrLmNzcyhvKSl9LGNvbXBsZXRlOmZ1bmN0aW9uKCl7dCYmdC5jYWxsKCl9fSkpOihzLmFwcGx5VHJhbnNpdGlvbigpLGU9TWF0aC5jZWlsKGUpLCExPT09cy5vcHRpb25zLnZlcnRpY2FsP29bcy5hbmltVHlwZV09XCJ0cmFuc2xhdGUzZChcIitlK1wicHgsIDBweCwgMHB4KVwiOm9bcy5hbmltVHlwZV09XCJ0cmFuc2xhdGUzZCgwcHgsXCIrZStcInB4LCAwcHgpXCIscy4kc2xpZGVUcmFjay5jc3MobyksdCYmc2V0VGltZW91dChmdW5jdGlvbigpe3MuZGlzYWJsZVRyYW5zaXRpb24oKSx0LmNhbGwoKX0scy5vcHRpb25zLnNwZWVkKSl9LGUucHJvdG90eXBlLmdldE5hdlRhcmdldD1mdW5jdGlvbigpe3ZhciBlPXRoaXMsdD1lLm9wdGlvbnMuYXNOYXZGb3I7cmV0dXJuIHQmJm51bGwhPT10JiYodD1pKHQpLm5vdChlLiRzbGlkZXIpKSx0fSxlLnByb3RvdHlwZS5hc05hdkZvcj1mdW5jdGlvbihlKXt2YXIgdD10aGlzLmdldE5hdlRhcmdldCgpO251bGwhPT10JiZcIm9iamVjdFwiPT10eXBlb2YgdCYmdC5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9aSh0aGlzKS5zbGljayhcImdldFNsaWNrXCIpO3QudW5zbGlja2VkfHx0LnNsaWRlSGFuZGxlcihlLCEwKX0pfSxlLnByb3RvdHlwZS5hcHBseVRyYW5zaXRpb249ZnVuY3Rpb24oaSl7dmFyIGU9dGhpcyx0PXt9OyExPT09ZS5vcHRpb25zLmZhZGU/dFtlLnRyYW5zaXRpb25UeXBlXT1lLnRyYW5zZm9ybVR5cGUrXCIgXCIrZS5vcHRpb25zLnNwZWVkK1wibXMgXCIrZS5vcHRpb25zLmNzc0Vhc2U6dFtlLnRyYW5zaXRpb25UeXBlXT1cIm9wYWNpdHkgXCIrZS5vcHRpb25zLnNwZWVkK1wibXMgXCIrZS5vcHRpb25zLmNzc0Vhc2UsITE9PT1lLm9wdGlvbnMuZmFkZT9lLiRzbGlkZVRyYWNrLmNzcyh0KTplLiRzbGlkZXMuZXEoaSkuY3NzKHQpfSxlLnByb3RvdHlwZS5hdXRvUGxheT1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aS5hdXRvUGxheUNsZWFyKCksaS5zbGlkZUNvdW50Pmkub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihpLmF1dG9QbGF5VGltZXI9c2V0SW50ZXJ2YWwoaS5hdXRvUGxheUl0ZXJhdG9yLGkub3B0aW9ucy5hdXRvcGxheVNwZWVkKSl9LGUucHJvdG90eXBlLmF1dG9QbGF5Q2xlYXI9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO2kuYXV0b1BsYXlUaW1lciYmY2xlYXJJbnRlcnZhbChpLmF1dG9QbGF5VGltZXIpfSxlLnByb3RvdHlwZS5hdXRvUGxheUl0ZXJhdG9yPWZ1bmN0aW9uKCl7dmFyIGk9dGhpcyxlPWkuY3VycmVudFNsaWRlK2kub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtpLnBhdXNlZHx8aS5pbnRlcnJ1cHRlZHx8aS5mb2N1c3NlZHx8KCExPT09aS5vcHRpb25zLmluZmluaXRlJiYoMT09PWkuZGlyZWN0aW9uJiZpLmN1cnJlbnRTbGlkZSsxPT09aS5zbGlkZUNvdW50LTE/aS5kaXJlY3Rpb249MDowPT09aS5kaXJlY3Rpb24mJihlPWkuY3VycmVudFNsaWRlLWkub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCxpLmN1cnJlbnRTbGlkZS0xPT0wJiYoaS5kaXJlY3Rpb249MSkpKSxpLnNsaWRlSGFuZGxlcihlKSl9LGUucHJvdG90eXBlLmJ1aWxkQXJyb3dzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpczshMD09PWUub3B0aW9ucy5hcnJvd3MmJihlLiRwcmV2QXJyb3c9aShlLm9wdGlvbnMucHJldkFycm93KS5hZGRDbGFzcyhcInNsaWNrLWFycm93XCIpLGUuJG5leHRBcnJvdz1pKGUub3B0aW9ucy5uZXh0QXJyb3cpLmFkZENsYXNzKFwic2xpY2stYXJyb3dcIiksZS5zbGlkZUNvdW50PmUub3B0aW9ucy5zbGlkZXNUb1Nob3c/KGUuJHByZXZBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWhpZGRlblwiKS5yZW1vdmVBdHRyKFwiYXJpYS1oaWRkZW4gdGFiaW5kZXhcIiksZS4kbmV4dEFycm93LnJlbW92ZUNsYXNzKFwic2xpY2staGlkZGVuXCIpLnJlbW92ZUF0dHIoXCJhcmlhLWhpZGRlbiB0YWJpbmRleFwiKSxlLmh0bWxFeHByLnRlc3QoZS5vcHRpb25zLnByZXZBcnJvdykmJmUuJHByZXZBcnJvdy5wcmVwZW5kVG8oZS5vcHRpb25zLmFwcGVuZEFycm93cyksZS5odG1sRXhwci50ZXN0KGUub3B0aW9ucy5uZXh0QXJyb3cpJiZlLiRuZXh0QXJyb3cuYXBwZW5kVG8oZS5vcHRpb25zLmFwcGVuZEFycm93cyksITAhPT1lLm9wdGlvbnMuaW5maW5pdGUmJmUuJHByZXZBcnJvdy5hZGRDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJ0cnVlXCIpKTplLiRwcmV2QXJyb3cuYWRkKGUuJG5leHRBcnJvdykuYWRkQ2xhc3MoXCJzbGljay1oaWRkZW5cIikuYXR0cih7XCJhcmlhLWRpc2FibGVkXCI6XCJ0cnVlXCIsdGFiaW5kZXg6XCItMVwifSkpfSxlLnByb3RvdHlwZS5idWlsZERvdHM9ZnVuY3Rpb24oKXt2YXIgZSx0LG89dGhpcztpZighMD09PW8ub3B0aW9ucy5kb3RzKXtmb3Ioby4kc2xpZGVyLmFkZENsYXNzKFwic2xpY2stZG90dGVkXCIpLHQ9aShcIjx1bCAvPlwiKS5hZGRDbGFzcyhvLm9wdGlvbnMuZG90c0NsYXNzKSxlPTA7ZTw9by5nZXREb3RDb3VudCgpO2UrPTEpdC5hcHBlbmQoaShcIjxsaSAvPlwiKS5hcHBlbmQoby5vcHRpb25zLmN1c3RvbVBhZ2luZy5jYWxsKHRoaXMsbyxlKSkpO28uJGRvdHM9dC5hcHBlbmRUbyhvLm9wdGlvbnMuYXBwZW5kRG90cyksby4kZG90cy5maW5kKFwibGlcIikuZmlyc3QoKS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKX19LGUucHJvdG90eXBlLmJ1aWxkT3V0PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLiRzbGlkZXM9ZS4kc2xpZGVyLmNoaWxkcmVuKGUub3B0aW9ucy5zbGlkZStcIjpub3QoLnNsaWNrLWNsb25lZClcIikuYWRkQ2xhc3MoXCJzbGljay1zbGlkZVwiKSxlLnNsaWRlQ291bnQ9ZS4kc2xpZGVzLmxlbmd0aCxlLiRzbGlkZXMuZWFjaChmdW5jdGlvbihlLHQpe2kodCkuYXR0cihcImRhdGEtc2xpY2staW5kZXhcIixlKS5kYXRhKFwib3JpZ2luYWxTdHlsaW5nXCIsaSh0KS5hdHRyKFwic3R5bGVcIil8fFwiXCIpfSksZS4kc2xpZGVyLmFkZENsYXNzKFwic2xpY2stc2xpZGVyXCIpLGUuJHNsaWRlVHJhY2s9MD09PWUuc2xpZGVDb3VudD9pKCc8ZGl2IGNsYXNzPVwic2xpY2stdHJhY2tcIi8+JykuYXBwZW5kVG8oZS4kc2xpZGVyKTplLiRzbGlkZXMud3JhcEFsbCgnPGRpdiBjbGFzcz1cInNsaWNrLXRyYWNrXCIvPicpLnBhcmVudCgpLGUuJGxpc3Q9ZS4kc2xpZGVUcmFjay53cmFwKCc8ZGl2IGNsYXNzPVwic2xpY2stbGlzdFwiLz4nKS5wYXJlbnQoKSxlLiRzbGlkZVRyYWNrLmNzcyhcIm9wYWNpdHlcIiwwKSwhMCE9PWUub3B0aW9ucy5jZW50ZXJNb2RlJiYhMCE9PWUub3B0aW9ucy5zd2lwZVRvU2xpZGV8fChlLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw9MSksaShcImltZ1tkYXRhLWxhenldXCIsZS4kc2xpZGVyKS5ub3QoXCJbc3JjXVwiKS5hZGRDbGFzcyhcInNsaWNrLWxvYWRpbmdcIiksZS5zZXR1cEluZmluaXRlKCksZS5idWlsZEFycm93cygpLGUuYnVpbGREb3RzKCksZS51cGRhdGVEb3RzKCksZS5zZXRTbGlkZUNsYXNzZXMoXCJudW1iZXJcIj09dHlwZW9mIGUuY3VycmVudFNsaWRlP2UuY3VycmVudFNsaWRlOjApLCEwPT09ZS5vcHRpb25zLmRyYWdnYWJsZSYmZS4kbGlzdC5hZGRDbGFzcyhcImRyYWdnYWJsZVwiKX0sZS5wcm90b3R5cGUuYnVpbGRSb3dzPWZ1bmN0aW9uKCl7dmFyIGksZSx0LG8scyxuLHIsbD10aGlzO2lmKG89ZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLG49bC4kc2xpZGVyLmNoaWxkcmVuKCksbC5vcHRpb25zLnJvd3M+MSl7Zm9yKHI9bC5vcHRpb25zLnNsaWRlc1BlclJvdypsLm9wdGlvbnMucm93cyxzPU1hdGguY2VpbChuLmxlbmd0aC9yKSxpPTA7aTxzO2krKyl7dmFyIGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtmb3IoZT0wO2U8bC5vcHRpb25zLnJvd3M7ZSsrKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2Zvcih0PTA7dDxsLm9wdGlvbnMuc2xpZGVzUGVyUm93O3QrKyl7dmFyIGM9aSpyKyhlKmwub3B0aW9ucy5zbGlkZXNQZXJSb3crdCk7bi5nZXQoYykmJmEuYXBwZW5kQ2hpbGQobi5nZXQoYykpfWQuYXBwZW5kQ2hpbGQoYSl9by5hcHBlbmRDaGlsZChkKX1sLiRzbGlkZXIuZW1wdHkoKS5hcHBlbmQobyksbC4kc2xpZGVyLmNoaWxkcmVuKCkuY2hpbGRyZW4oKS5jaGlsZHJlbigpLmNzcyh7d2lkdGg6MTAwL2wub3B0aW9ucy5zbGlkZXNQZXJSb3crXCIlXCIsZGlzcGxheTpcImlubGluZS1ibG9ja1wifSl9fSxlLnByb3RvdHlwZS5jaGVja1Jlc3BvbnNpdmU9ZnVuY3Rpb24oZSx0KXt2YXIgbyxzLG4scj10aGlzLGw9ITEsZD1yLiRzbGlkZXIud2lkdGgoKSxhPXdpbmRvdy5pbm5lcldpZHRofHxpKHdpbmRvdykud2lkdGgoKTtpZihcIndpbmRvd1wiPT09ci5yZXNwb25kVG8/bj1hOlwic2xpZGVyXCI9PT1yLnJlc3BvbmRUbz9uPWQ6XCJtaW5cIj09PXIucmVzcG9uZFRvJiYobj1NYXRoLm1pbihhLGQpKSxyLm9wdGlvbnMucmVzcG9uc2l2ZSYmci5vcHRpb25zLnJlc3BvbnNpdmUubGVuZ3RoJiZudWxsIT09ci5vcHRpb25zLnJlc3BvbnNpdmUpe3M9bnVsbDtmb3IobyBpbiByLmJyZWFrcG9pbnRzKXIuYnJlYWtwb2ludHMuaGFzT3duUHJvcGVydHkobykmJighMT09PXIub3JpZ2luYWxTZXR0aW5ncy5tb2JpbGVGaXJzdD9uPHIuYnJlYWtwb2ludHNbb10mJihzPXIuYnJlYWtwb2ludHNbb10pOm4+ci5icmVha3BvaW50c1tvXSYmKHM9ci5icmVha3BvaW50c1tvXSkpO251bGwhPT1zP251bGwhPT1yLmFjdGl2ZUJyZWFrcG9pbnQ/KHMhPT1yLmFjdGl2ZUJyZWFrcG9pbnR8fHQpJiYoci5hY3RpdmVCcmVha3BvaW50PXMsXCJ1bnNsaWNrXCI9PT1yLmJyZWFrcG9pbnRTZXR0aW5nc1tzXT9yLnVuc2xpY2socyk6KHIub3B0aW9ucz1pLmV4dGVuZCh7fSxyLm9yaWdpbmFsU2V0dGluZ3Msci5icmVha3BvaW50U2V0dGluZ3Nbc10pLCEwPT09ZSYmKHIuY3VycmVudFNsaWRlPXIub3B0aW9ucy5pbml0aWFsU2xpZGUpLHIucmVmcmVzaChlKSksbD1zKTooci5hY3RpdmVCcmVha3BvaW50PXMsXCJ1bnNsaWNrXCI9PT1yLmJyZWFrcG9pbnRTZXR0aW5nc1tzXT9yLnVuc2xpY2socyk6KHIub3B0aW9ucz1pLmV4dGVuZCh7fSxyLm9yaWdpbmFsU2V0dGluZ3Msci5icmVha3BvaW50U2V0dGluZ3Nbc10pLCEwPT09ZSYmKHIuY3VycmVudFNsaWRlPXIub3B0aW9ucy5pbml0aWFsU2xpZGUpLHIucmVmcmVzaChlKSksbD1zKTpudWxsIT09ci5hY3RpdmVCcmVha3BvaW50JiYoci5hY3RpdmVCcmVha3BvaW50PW51bGwsci5vcHRpb25zPXIub3JpZ2luYWxTZXR0aW5ncywhMD09PWUmJihyLmN1cnJlbnRTbGlkZT1yLm9wdGlvbnMuaW5pdGlhbFNsaWRlKSxyLnJlZnJlc2goZSksbD1zKSxlfHwhMT09PWx8fHIuJHNsaWRlci50cmlnZ2VyKFwiYnJlYWtwb2ludFwiLFtyLGxdKX19LGUucHJvdG90eXBlLmNoYW5nZVNsaWRlPWZ1bmN0aW9uKGUsdCl7dmFyIG8scyxuLHI9dGhpcyxsPWkoZS5jdXJyZW50VGFyZ2V0KTtzd2l0Y2gobC5pcyhcImFcIikmJmUucHJldmVudERlZmF1bHQoKSxsLmlzKFwibGlcIil8fChsPWwuY2xvc2VzdChcImxpXCIpKSxuPXIuc2xpZGVDb3VudCVyLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwhPTAsbz1uPzA6KHIuc2xpZGVDb3VudC1yLmN1cnJlbnRTbGlkZSklci5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLGUuZGF0YS5tZXNzYWdlKXtjYXNlXCJwcmV2aW91c1wiOnM9MD09PW8/ci5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOnIub3B0aW9ucy5zbGlkZXNUb1Nob3ctbyxyLnNsaWRlQ291bnQ+ci5vcHRpb25zLnNsaWRlc1RvU2hvdyYmci5zbGlkZUhhbmRsZXIoci5jdXJyZW50U2xpZGUtcywhMSx0KTticmVhaztjYXNlXCJuZXh0XCI6cz0wPT09bz9yLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw6byxyLnNsaWRlQ291bnQ+ci5vcHRpb25zLnNsaWRlc1RvU2hvdyYmci5zbGlkZUhhbmRsZXIoci5jdXJyZW50U2xpZGUrcywhMSx0KTticmVhaztjYXNlXCJpbmRleFwiOnZhciBkPTA9PT1lLmRhdGEuaW5kZXg/MDplLmRhdGEuaW5kZXh8fGwuaW5kZXgoKSpyLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7ci5zbGlkZUhhbmRsZXIoci5jaGVja05hdmlnYWJsZShkKSwhMSx0KSxsLmNoaWxkcmVuKCkudHJpZ2dlcihcImZvY3VzXCIpO2JyZWFrO2RlZmF1bHQ6cmV0dXJufX0sZS5wcm90b3R5cGUuY2hlY2tOYXZpZ2FibGU9ZnVuY3Rpb24oaSl7dmFyIGUsdDtpZihlPXRoaXMuZ2V0TmF2aWdhYmxlSW5kZXhlcygpLHQ9MCxpPmVbZS5sZW5ndGgtMV0paT1lW2UubGVuZ3RoLTFdO2Vsc2UgZm9yKHZhciBvIGluIGUpe2lmKGk8ZVtvXSl7aT10O2JyZWFrfXQ9ZVtvXX1yZXR1cm4gaX0sZS5wcm90b3R5cGUuY2xlYW5VcEV2ZW50cz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7ZS5vcHRpb25zLmRvdHMmJm51bGwhPT1lLiRkb3RzJiYoaShcImxpXCIsZS4kZG90cykub2ZmKFwiY2xpY2suc2xpY2tcIixlLmNoYW5nZVNsaWRlKS5vZmYoXCJtb3VzZWVudGVyLnNsaWNrXCIsaS5wcm94eShlLmludGVycnVwdCxlLCEwKSkub2ZmKFwibW91c2VsZWF2ZS5zbGlja1wiLGkucHJveHkoZS5pbnRlcnJ1cHQsZSwhMSkpLCEwPT09ZS5vcHRpb25zLmFjY2Vzc2liaWxpdHkmJmUuJGRvdHMub2ZmKFwia2V5ZG93bi5zbGlja1wiLGUua2V5SGFuZGxlcikpLGUuJHNsaWRlci5vZmYoXCJmb2N1cy5zbGljayBibHVyLnNsaWNrXCIpLCEwPT09ZS5vcHRpb25zLmFycm93cyYmZS5zbGlkZUNvdW50PmUub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihlLiRwcmV2QXJyb3cmJmUuJHByZXZBcnJvdy5vZmYoXCJjbGljay5zbGlja1wiLGUuY2hhbmdlU2xpZGUpLGUuJG5leHRBcnJvdyYmZS4kbmV4dEFycm93Lm9mZihcImNsaWNrLnNsaWNrXCIsZS5jaGFuZ2VTbGlkZSksITA9PT1lLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSYmKGUuJHByZXZBcnJvdyYmZS4kcHJldkFycm93Lm9mZihcImtleWRvd24uc2xpY2tcIixlLmtleUhhbmRsZXIpLGUuJG5leHRBcnJvdyYmZS4kbmV4dEFycm93Lm9mZihcImtleWRvd24uc2xpY2tcIixlLmtleUhhbmRsZXIpKSksZS4kbGlzdC5vZmYoXCJ0b3VjaHN0YXJ0LnNsaWNrIG1vdXNlZG93bi5zbGlja1wiLGUuc3dpcGVIYW5kbGVyKSxlLiRsaXN0Lm9mZihcInRvdWNobW92ZS5zbGljayBtb3VzZW1vdmUuc2xpY2tcIixlLnN3aXBlSGFuZGxlciksZS4kbGlzdC5vZmYoXCJ0b3VjaGVuZC5zbGljayBtb3VzZXVwLnNsaWNrXCIsZS5zd2lwZUhhbmRsZXIpLGUuJGxpc3Qub2ZmKFwidG91Y2hjYW5jZWwuc2xpY2sgbW91c2VsZWF2ZS5zbGlja1wiLGUuc3dpcGVIYW5kbGVyKSxlLiRsaXN0Lm9mZihcImNsaWNrLnNsaWNrXCIsZS5jbGlja0hhbmRsZXIpLGkoZG9jdW1lbnQpLm9mZihlLnZpc2liaWxpdHlDaGFuZ2UsZS52aXNpYmlsaXR5KSxlLmNsZWFuVXBTbGlkZUV2ZW50cygpLCEwPT09ZS5vcHRpb25zLmFjY2Vzc2liaWxpdHkmJmUuJGxpc3Qub2ZmKFwia2V5ZG93bi5zbGlja1wiLGUua2V5SGFuZGxlciksITA9PT1lLm9wdGlvbnMuZm9jdXNPblNlbGVjdCYmaShlLiRzbGlkZVRyYWNrKS5jaGlsZHJlbigpLm9mZihcImNsaWNrLnNsaWNrXCIsZS5zZWxlY3RIYW5kbGVyKSxpKHdpbmRvdykub2ZmKFwib3JpZW50YXRpb25jaGFuZ2Uuc2xpY2suc2xpY2stXCIrZS5pbnN0YW5jZVVpZCxlLm9yaWVudGF0aW9uQ2hhbmdlKSxpKHdpbmRvdykub2ZmKFwicmVzaXplLnNsaWNrLnNsaWNrLVwiK2UuaW5zdGFuY2VVaWQsZS5yZXNpemUpLGkoXCJbZHJhZ2dhYmxlIT10cnVlXVwiLGUuJHNsaWRlVHJhY2spLm9mZihcImRyYWdzdGFydFwiLGUucHJldmVudERlZmF1bHQpLGkod2luZG93KS5vZmYoXCJsb2FkLnNsaWNrLnNsaWNrLVwiK2UuaW5zdGFuY2VVaWQsZS5zZXRQb3NpdGlvbil9LGUucHJvdG90eXBlLmNsZWFuVXBTbGlkZUV2ZW50cz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7ZS4kbGlzdC5vZmYoXCJtb3VzZWVudGVyLnNsaWNrXCIsaS5wcm94eShlLmludGVycnVwdCxlLCEwKSksZS4kbGlzdC5vZmYoXCJtb3VzZWxlYXZlLnNsaWNrXCIsaS5wcm94eShlLmludGVycnVwdCxlLCExKSl9LGUucHJvdG90eXBlLmNsZWFuVXBSb3dzPWZ1bmN0aW9uKCl7dmFyIGksZT10aGlzO2Uub3B0aW9ucy5yb3dzPjEmJigoaT1lLiRzbGlkZXMuY2hpbGRyZW4oKS5jaGlsZHJlbigpKS5yZW1vdmVBdHRyKFwic3R5bGVcIiksZS4kc2xpZGVyLmVtcHR5KCkuYXBwZW5kKGkpKX0sZS5wcm90b3R5cGUuY2xpY2tIYW5kbGVyPWZ1bmN0aW9uKGkpeyExPT09dGhpcy5zaG91bGRDbGljayYmKGkuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCksaS5zdG9wUHJvcGFnYXRpb24oKSxpLnByZXZlbnREZWZhdWx0KCkpfSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7dC5hdXRvUGxheUNsZWFyKCksdC50b3VjaE9iamVjdD17fSx0LmNsZWFuVXBFdmVudHMoKSxpKFwiLnNsaWNrLWNsb25lZFwiLHQuJHNsaWRlcikuZGV0YWNoKCksdC4kZG90cyYmdC4kZG90cy5yZW1vdmUoKSx0LiRwcmV2QXJyb3cmJnQuJHByZXZBcnJvdy5sZW5ndGgmJih0LiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZCBzbGljay1hcnJvdyBzbGljay1oaWRkZW5cIikucmVtb3ZlQXR0cihcImFyaWEtaGlkZGVuIGFyaWEtZGlzYWJsZWQgdGFiaW5kZXhcIikuY3NzKFwiZGlzcGxheVwiLFwiXCIpLHQuaHRtbEV4cHIudGVzdCh0Lm9wdGlvbnMucHJldkFycm93KSYmdC4kcHJldkFycm93LnJlbW92ZSgpKSx0LiRuZXh0QXJyb3cmJnQuJG5leHRBcnJvdy5sZW5ndGgmJih0LiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZCBzbGljay1hcnJvdyBzbGljay1oaWRkZW5cIikucmVtb3ZlQXR0cihcImFyaWEtaGlkZGVuIGFyaWEtZGlzYWJsZWQgdGFiaW5kZXhcIikuY3NzKFwiZGlzcGxheVwiLFwiXCIpLHQuaHRtbEV4cHIudGVzdCh0Lm9wdGlvbnMubmV4dEFycm93KSYmdC4kbmV4dEFycm93LnJlbW92ZSgpKSx0LiRzbGlkZXMmJih0LiRzbGlkZXMucmVtb3ZlQ2xhc3MoXCJzbGljay1zbGlkZSBzbGljay1hY3RpdmUgc2xpY2stY2VudGVyIHNsaWNrLXZpc2libGUgc2xpY2stY3VycmVudFwiKS5yZW1vdmVBdHRyKFwiYXJpYS1oaWRkZW5cIikucmVtb3ZlQXR0cihcImRhdGEtc2xpY2staW5kZXhcIikuZWFjaChmdW5jdGlvbigpe2kodGhpcykuYXR0cihcInN0eWxlXCIsaSh0aGlzKS5kYXRhKFwib3JpZ2luYWxTdHlsaW5nXCIpKX0pLHQuJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKSx0LiRzbGlkZVRyYWNrLmRldGFjaCgpLHQuJGxpc3QuZGV0YWNoKCksdC4kc2xpZGVyLmFwcGVuZCh0LiRzbGlkZXMpKSx0LmNsZWFuVXBSb3dzKCksdC4kc2xpZGVyLnJlbW92ZUNsYXNzKFwic2xpY2stc2xpZGVyXCIpLHQuJHNsaWRlci5yZW1vdmVDbGFzcyhcInNsaWNrLWluaXRpYWxpemVkXCIpLHQuJHNsaWRlci5yZW1vdmVDbGFzcyhcInNsaWNrLWRvdHRlZFwiKSx0LnVuc2xpY2tlZD0hMCxlfHx0LiRzbGlkZXIudHJpZ2dlcihcImRlc3Ryb3lcIixbdF0pfSxlLnByb3RvdHlwZS5kaXNhYmxlVHJhbnNpdGlvbj1mdW5jdGlvbihpKXt2YXIgZT10aGlzLHQ9e307dFtlLnRyYW5zaXRpb25UeXBlXT1cIlwiLCExPT09ZS5vcHRpb25zLmZhZGU/ZS4kc2xpZGVUcmFjay5jc3ModCk6ZS4kc2xpZGVzLmVxKGkpLmNzcyh0KX0sZS5wcm90b3R5cGUuZmFkZVNsaWRlPWZ1bmN0aW9uKGksZSl7dmFyIHQ9dGhpczshMT09PXQuY3NzVHJhbnNpdGlvbnM/KHQuJHNsaWRlcy5lcShpKS5jc3Moe3pJbmRleDp0Lm9wdGlvbnMuekluZGV4fSksdC4kc2xpZGVzLmVxKGkpLmFuaW1hdGUoe29wYWNpdHk6MX0sdC5vcHRpb25zLnNwZWVkLHQub3B0aW9ucy5lYXNpbmcsZSkpOih0LmFwcGx5VHJhbnNpdGlvbihpKSx0LiRzbGlkZXMuZXEoaSkuY3NzKHtvcGFjaXR5OjEsekluZGV4OnQub3B0aW9ucy56SW5kZXh9KSxlJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dC5kaXNhYmxlVHJhbnNpdGlvbihpKSxlLmNhbGwoKX0sdC5vcHRpb25zLnNwZWVkKSl9LGUucHJvdG90eXBlLmZhZGVTbGlkZU91dD1mdW5jdGlvbihpKXt2YXIgZT10aGlzOyExPT09ZS5jc3NUcmFuc2l0aW9ucz9lLiRzbGlkZXMuZXEoaSkuYW5pbWF0ZSh7b3BhY2l0eTowLHpJbmRleDplLm9wdGlvbnMuekluZGV4LTJ9LGUub3B0aW9ucy5zcGVlZCxlLm9wdGlvbnMuZWFzaW5nKTooZS5hcHBseVRyYW5zaXRpb24oaSksZS4kc2xpZGVzLmVxKGkpLmNzcyh7b3BhY2l0eTowLHpJbmRleDplLm9wdGlvbnMuekluZGV4LTJ9KSl9LGUucHJvdG90eXBlLmZpbHRlclNsaWRlcz1lLnByb3RvdHlwZS5zbGlja0ZpbHRlcj1mdW5jdGlvbihpKXt2YXIgZT10aGlzO251bGwhPT1pJiYoZS4kc2xpZGVzQ2FjaGU9ZS4kc2xpZGVzLGUudW5sb2FkKCksZS4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpLGUuJHNsaWRlc0NhY2hlLmZpbHRlcihpKS5hcHBlbmRUbyhlLiRzbGlkZVRyYWNrKSxlLnJlaW5pdCgpKX0sZS5wcm90b3R5cGUuZm9jdXNIYW5kbGVyPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLiRzbGlkZXIub2ZmKFwiZm9jdXMuc2xpY2sgYmx1ci5zbGlja1wiKS5vbihcImZvY3VzLnNsaWNrIGJsdXIuc2xpY2tcIixcIipcIixmdW5jdGlvbih0KXt0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO3ZhciBvPWkodGhpcyk7c2V0VGltZW91dChmdW5jdGlvbigpe2Uub3B0aW9ucy5wYXVzZU9uRm9jdXMmJihlLmZvY3Vzc2VkPW8uaXMoXCI6Zm9jdXNcIiksZS5hdXRvUGxheSgpKX0sMCl9KX0sZS5wcm90b3R5cGUuZ2V0Q3VycmVudD1lLnByb3RvdHlwZS5zbGlja0N1cnJlbnRTbGlkZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmN1cnJlbnRTbGlkZX0sZS5wcm90b3R5cGUuZ2V0RG90Q291bnQ9ZnVuY3Rpb24oKXt2YXIgaT10aGlzLGU9MCx0PTAsbz0wO2lmKCEwPT09aS5vcHRpb25zLmluZmluaXRlKWlmKGkuc2xpZGVDb3VudDw9aS5vcHRpb25zLnNsaWRlc1RvU2hvdykrK287ZWxzZSBmb3IoO2U8aS5zbGlkZUNvdW50OykrK28sZT10K2kub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCx0Kz1pLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw8PWkub3B0aW9ucy5zbGlkZXNUb1Nob3c/aS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOmkub3B0aW9ucy5zbGlkZXNUb1Nob3c7ZWxzZSBpZighMD09PWkub3B0aW9ucy5jZW50ZXJNb2RlKW89aS5zbGlkZUNvdW50O2Vsc2UgaWYoaS5vcHRpb25zLmFzTmF2Rm9yKWZvcig7ZTxpLnNsaWRlQ291bnQ7KSsrbyxlPXQraS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLHQrPWkub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDw9aS5vcHRpb25zLnNsaWRlc1RvU2hvdz9pLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw6aS5vcHRpb25zLnNsaWRlc1RvU2hvdztlbHNlIG89MStNYXRoLmNlaWwoKGkuc2xpZGVDb3VudC1pLm9wdGlvbnMuc2xpZGVzVG9TaG93KS9pLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpO3JldHVybiBvLTF9LGUucHJvdG90eXBlLmdldExlZnQ9ZnVuY3Rpb24oaSl7dmFyIGUsdCxvLHMsbj10aGlzLHI9MDtyZXR1cm4gbi5zbGlkZU9mZnNldD0wLHQ9bi4kc2xpZGVzLmZpcnN0KCkub3V0ZXJIZWlnaHQoITApLCEwPT09bi5vcHRpb25zLmluZmluaXRlPyhuLnNsaWRlQ291bnQ+bi5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKG4uc2xpZGVPZmZzZXQ9bi5zbGlkZVdpZHRoKm4ub3B0aW9ucy5zbGlkZXNUb1Nob3cqLTEscz0tMSwhMD09PW4ub3B0aW9ucy52ZXJ0aWNhbCYmITA9PT1uLm9wdGlvbnMuY2VudGVyTW9kZSYmKDI9PT1uLm9wdGlvbnMuc2xpZGVzVG9TaG93P3M9LTEuNToxPT09bi5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKHM9LTIpKSxyPXQqbi5vcHRpb25zLnNsaWRlc1RvU2hvdypzKSxuLnNsaWRlQ291bnQlbi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIT0wJiZpK24ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbD5uLnNsaWRlQ291bnQmJm4uc2xpZGVDb3VudD5uLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoaT5uLnNsaWRlQ291bnQ/KG4uc2xpZGVPZmZzZXQ9KG4ub3B0aW9ucy5zbGlkZXNUb1Nob3ctKGktbi5zbGlkZUNvdW50KSkqbi5zbGlkZVdpZHRoKi0xLHI9KG4ub3B0aW9ucy5zbGlkZXNUb1Nob3ctKGktbi5zbGlkZUNvdW50KSkqdCotMSk6KG4uc2xpZGVPZmZzZXQ9bi5zbGlkZUNvdW50JW4ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCpuLnNsaWRlV2lkdGgqLTEscj1uLnNsaWRlQ291bnQlbi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKnQqLTEpKSk6aStuLm9wdGlvbnMuc2xpZGVzVG9TaG93Pm4uc2xpZGVDb3VudCYmKG4uc2xpZGVPZmZzZXQ9KGkrbi5vcHRpb25zLnNsaWRlc1RvU2hvdy1uLnNsaWRlQ291bnQpKm4uc2xpZGVXaWR0aCxyPShpK24ub3B0aW9ucy5zbGlkZXNUb1Nob3ctbi5zbGlkZUNvdW50KSp0KSxuLnNsaWRlQ291bnQ8PW4ub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihuLnNsaWRlT2Zmc2V0PTAscj0wKSwhMD09PW4ub3B0aW9ucy5jZW50ZXJNb2RlJiZuLnNsaWRlQ291bnQ8PW4ub3B0aW9ucy5zbGlkZXNUb1Nob3c/bi5zbGlkZU9mZnNldD1uLnNsaWRlV2lkdGgqTWF0aC5mbG9vcihuLm9wdGlvbnMuc2xpZGVzVG9TaG93KS8yLW4uc2xpZGVXaWR0aCpuLnNsaWRlQ291bnQvMjohMD09PW4ub3B0aW9ucy5jZW50ZXJNb2RlJiYhMD09PW4ub3B0aW9ucy5pbmZpbml0ZT9uLnNsaWRlT2Zmc2V0Kz1uLnNsaWRlV2lkdGgqTWF0aC5mbG9vcihuLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIpLW4uc2xpZGVXaWR0aDohMD09PW4ub3B0aW9ucy5jZW50ZXJNb2RlJiYobi5zbGlkZU9mZnNldD0wLG4uc2xpZGVPZmZzZXQrPW4uc2xpZGVXaWR0aCpNYXRoLmZsb29yKG4ub3B0aW9ucy5zbGlkZXNUb1Nob3cvMikpLGU9ITE9PT1uLm9wdGlvbnMudmVydGljYWw/aSpuLnNsaWRlV2lkdGgqLTErbi5zbGlkZU9mZnNldDppKnQqLTErciwhMD09PW4ub3B0aW9ucy52YXJpYWJsZVdpZHRoJiYobz1uLnNsaWRlQ291bnQ8PW4ub3B0aW9ucy5zbGlkZXNUb1Nob3d8fCExPT09bi5vcHRpb25zLmluZmluaXRlP24uJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikuZXEoaSk6bi4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS5lcShpK24ub3B0aW9ucy5zbGlkZXNUb1Nob3cpLGU9ITA9PT1uLm9wdGlvbnMucnRsP29bMF0/LTEqKG4uJHNsaWRlVHJhY2sud2lkdGgoKS1vWzBdLm9mZnNldExlZnQtby53aWR0aCgpKTowOm9bMF0/LTEqb1swXS5vZmZzZXRMZWZ0OjAsITA9PT1uLm9wdGlvbnMuY2VudGVyTW9kZSYmKG89bi5zbGlkZUNvdW50PD1uLm9wdGlvbnMuc2xpZGVzVG9TaG93fHwhMT09PW4ub3B0aW9ucy5pbmZpbml0ZT9uLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLmVxKGkpOm4uJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikuZXEoaStuLm9wdGlvbnMuc2xpZGVzVG9TaG93KzEpLGU9ITA9PT1uLm9wdGlvbnMucnRsP29bMF0/LTEqKG4uJHNsaWRlVHJhY2sud2lkdGgoKS1vWzBdLm9mZnNldExlZnQtby53aWR0aCgpKTowOm9bMF0/LTEqb1swXS5vZmZzZXRMZWZ0OjAsZSs9KG4uJGxpc3Qud2lkdGgoKS1vLm91dGVyV2lkdGgoKSkvMikpLGV9LGUucHJvdG90eXBlLmdldE9wdGlvbj1lLnByb3RvdHlwZS5zbGlja0dldE9wdGlvbj1mdW5jdGlvbihpKXtyZXR1cm4gdGhpcy5vcHRpb25zW2ldfSxlLnByb3RvdHlwZS5nZXROYXZpZ2FibGVJbmRleGVzPWZ1bmN0aW9uKCl7dmFyIGksZT10aGlzLHQ9MCxvPTAscz1bXTtmb3IoITE9PT1lLm9wdGlvbnMuaW5maW5pdGU/aT1lLnNsaWRlQ291bnQ6KHQ9LTEqZS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLG89LTEqZS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLGk9MiplLnNsaWRlQ291bnQpO3Q8aTspcy5wdXNoKHQpLHQ9bytlLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwsbys9ZS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsPD1lLm9wdGlvbnMuc2xpZGVzVG9TaG93P2Uub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDplLm9wdGlvbnMuc2xpZGVzVG9TaG93O3JldHVybiBzfSxlLnByb3RvdHlwZS5nZXRTbGljaz1mdW5jdGlvbigpe3JldHVybiB0aGlzfSxlLnByb3RvdHlwZS5nZXRTbGlkZUNvdW50PWZ1bmN0aW9uKCl7dmFyIGUsdCxvPXRoaXM7cmV0dXJuIHQ9ITA9PT1vLm9wdGlvbnMuY2VudGVyTW9kZT9vLnNsaWRlV2lkdGgqTWF0aC5mbG9vcihvLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIpOjAsITA9PT1vLm9wdGlvbnMuc3dpcGVUb1NsaWRlPyhvLiRzbGlkZVRyYWNrLmZpbmQoXCIuc2xpY2stc2xpZGVcIikuZWFjaChmdW5jdGlvbihzLG4pe2lmKG4ub2Zmc2V0TGVmdC10K2kobikub3V0ZXJXaWR0aCgpLzI+LTEqby5zd2lwZUxlZnQpcmV0dXJuIGU9biwhMX0pLE1hdGguYWJzKGkoZSkuYXR0cihcImRhdGEtc2xpY2staW5kZXhcIiktby5jdXJyZW50U2xpZGUpfHwxKTpvLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGx9LGUucHJvdG90eXBlLmdvVG89ZS5wcm90b3R5cGUuc2xpY2tHb1RvPWZ1bmN0aW9uKGksZSl7dGhpcy5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTpcImluZGV4XCIsaW5kZXg6cGFyc2VJbnQoaSl9fSxlKX0sZS5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihlKXt2YXIgdD10aGlzO2kodC4kc2xpZGVyKS5oYXNDbGFzcyhcInNsaWNrLWluaXRpYWxpemVkXCIpfHwoaSh0LiRzbGlkZXIpLmFkZENsYXNzKFwic2xpY2staW5pdGlhbGl6ZWRcIiksdC5idWlsZFJvd3MoKSx0LmJ1aWxkT3V0KCksdC5zZXRQcm9wcygpLHQuc3RhcnRMb2FkKCksdC5sb2FkU2xpZGVyKCksdC5pbml0aWFsaXplRXZlbnRzKCksdC51cGRhdGVBcnJvd3MoKSx0LnVwZGF0ZURvdHMoKSx0LmNoZWNrUmVzcG9uc2l2ZSghMCksdC5mb2N1c0hhbmRsZXIoKSksZSYmdC4kc2xpZGVyLnRyaWdnZXIoXCJpbml0XCIsW3RdKSwhMD09PXQub3B0aW9ucy5hY2Nlc3NpYmlsaXR5JiZ0LmluaXRBREEoKSx0Lm9wdGlvbnMuYXV0b3BsYXkmJih0LnBhdXNlZD0hMSx0LmF1dG9QbGF5KCkpfSxlLnByb3RvdHlwZS5pbml0QURBPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PU1hdGguY2VpbChlLnNsaWRlQ291bnQvZS5vcHRpb25zLnNsaWRlc1RvU2hvdyksbz1lLmdldE5hdmlnYWJsZUluZGV4ZXMoKS5maWx0ZXIoZnVuY3Rpb24oaSl7cmV0dXJuIGk+PTAmJmk8ZS5zbGlkZUNvdW50fSk7ZS4kc2xpZGVzLmFkZChlLiRzbGlkZVRyYWNrLmZpbmQoXCIuc2xpY2stY2xvbmVkXCIpKS5hdHRyKHtcImFyaWEtaGlkZGVuXCI6XCJ0cnVlXCIsdGFiaW5kZXg6XCItMVwifSkuZmluZChcImEsIGlucHV0LCBidXR0b24sIHNlbGVjdFwiKS5hdHRyKHt0YWJpbmRleDpcIi0xXCJ9KSxudWxsIT09ZS4kZG90cyYmKGUuJHNsaWRlcy5ub3QoZS4kc2xpZGVUcmFjay5maW5kKFwiLnNsaWNrLWNsb25lZFwiKSkuZWFjaChmdW5jdGlvbih0KXt2YXIgcz1vLmluZGV4T2YodCk7aSh0aGlzKS5hdHRyKHtyb2xlOlwidGFicGFuZWxcIixpZDpcInNsaWNrLXNsaWRlXCIrZS5pbnN0YW5jZVVpZCt0LHRhYmluZGV4Oi0xfSksLTEhPT1zJiZpKHRoaXMpLmF0dHIoe1wiYXJpYS1kZXNjcmliZWRieVwiOlwic2xpY2stc2xpZGUtY29udHJvbFwiK2UuaW5zdGFuY2VVaWQrc30pfSksZS4kZG90cy5hdHRyKFwicm9sZVwiLFwidGFibGlzdFwiKS5maW5kKFwibGlcIikuZWFjaChmdW5jdGlvbihzKXt2YXIgbj1vW3NdO2kodGhpcykuYXR0cih7cm9sZTpcInByZXNlbnRhdGlvblwifSksaSh0aGlzKS5maW5kKFwiYnV0dG9uXCIpLmZpcnN0KCkuYXR0cih7cm9sZTpcInRhYlwiLGlkOlwic2xpY2stc2xpZGUtY29udHJvbFwiK2UuaW5zdGFuY2VVaWQrcyxcImFyaWEtY29udHJvbHNcIjpcInNsaWNrLXNsaWRlXCIrZS5pbnN0YW5jZVVpZCtuLFwiYXJpYS1sYWJlbFwiOnMrMStcIiBvZiBcIit0LFwiYXJpYS1zZWxlY3RlZFwiOm51bGwsdGFiaW5kZXg6XCItMVwifSl9KS5lcShlLmN1cnJlbnRTbGlkZSkuZmluZChcImJ1dHRvblwiKS5hdHRyKHtcImFyaWEtc2VsZWN0ZWRcIjpcInRydWVcIix0YWJpbmRleDpcIjBcIn0pLmVuZCgpKTtmb3IodmFyIHM9ZS5jdXJyZW50U2xpZGUsbj1zK2Uub3B0aW9ucy5zbGlkZXNUb1Nob3c7czxuO3MrKyllLiRzbGlkZXMuZXEocykuYXR0cihcInRhYmluZGV4XCIsMCk7ZS5hY3RpdmF0ZUFEQSgpfSxlLnByb3RvdHlwZS5pbml0QXJyb3dFdmVudHM9ZnVuY3Rpb24oKXt2YXIgaT10aGlzOyEwPT09aS5vcHRpb25zLmFycm93cyYmaS5zbGlkZUNvdW50Pmkub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihpLiRwcmV2QXJyb3cub2ZmKFwiY2xpY2suc2xpY2tcIikub24oXCJjbGljay5zbGlja1wiLHttZXNzYWdlOlwicHJldmlvdXNcIn0saS5jaGFuZ2VTbGlkZSksaS4kbmV4dEFycm93Lm9mZihcImNsaWNrLnNsaWNrXCIpLm9uKFwiY2xpY2suc2xpY2tcIix7bWVzc2FnZTpcIm5leHRcIn0saS5jaGFuZ2VTbGlkZSksITA9PT1pLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSYmKGkuJHByZXZBcnJvdy5vbihcImtleWRvd24uc2xpY2tcIixpLmtleUhhbmRsZXIpLGkuJG5leHRBcnJvdy5vbihcImtleWRvd24uc2xpY2tcIixpLmtleUhhbmRsZXIpKSl9LGUucHJvdG90eXBlLmluaXREb3RFdmVudHM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzOyEwPT09ZS5vcHRpb25zLmRvdHMmJihpKFwibGlcIixlLiRkb3RzKS5vbihcImNsaWNrLnNsaWNrXCIse21lc3NhZ2U6XCJpbmRleFwifSxlLmNoYW5nZVNsaWRlKSwhMD09PWUub3B0aW9ucy5hY2Nlc3NpYmlsaXR5JiZlLiRkb3RzLm9uKFwia2V5ZG93bi5zbGlja1wiLGUua2V5SGFuZGxlcikpLCEwPT09ZS5vcHRpb25zLmRvdHMmJiEwPT09ZS5vcHRpb25zLnBhdXNlT25Eb3RzSG92ZXImJmkoXCJsaVwiLGUuJGRvdHMpLm9uKFwibW91c2VlbnRlci5zbGlja1wiLGkucHJveHkoZS5pbnRlcnJ1cHQsZSwhMCkpLm9uKFwibW91c2VsZWF2ZS5zbGlja1wiLGkucHJveHkoZS5pbnRlcnJ1cHQsZSwhMSkpfSxlLnByb3RvdHlwZS5pbml0U2xpZGVFdmVudHM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2Uub3B0aW9ucy5wYXVzZU9uSG92ZXImJihlLiRsaXN0Lm9uKFwibW91c2VlbnRlci5zbGlja1wiLGkucHJveHkoZS5pbnRlcnJ1cHQsZSwhMCkpLGUuJGxpc3Qub24oXCJtb3VzZWxlYXZlLnNsaWNrXCIsaS5wcm94eShlLmludGVycnVwdCxlLCExKSkpfSxlLnByb3RvdHlwZS5pbml0aWFsaXplRXZlbnRzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLmluaXRBcnJvd0V2ZW50cygpLGUuaW5pdERvdEV2ZW50cygpLGUuaW5pdFNsaWRlRXZlbnRzKCksZS4kbGlzdC5vbihcInRvdWNoc3RhcnQuc2xpY2sgbW91c2Vkb3duLnNsaWNrXCIse2FjdGlvbjpcInN0YXJ0XCJ9LGUuc3dpcGVIYW5kbGVyKSxlLiRsaXN0Lm9uKFwidG91Y2htb3ZlLnNsaWNrIG1vdXNlbW92ZS5zbGlja1wiLHthY3Rpb246XCJtb3ZlXCJ9LGUuc3dpcGVIYW5kbGVyKSxlLiRsaXN0Lm9uKFwidG91Y2hlbmQuc2xpY2sgbW91c2V1cC5zbGlja1wiLHthY3Rpb246XCJlbmRcIn0sZS5zd2lwZUhhbmRsZXIpLGUuJGxpc3Qub24oXCJ0b3VjaGNhbmNlbC5zbGljayBtb3VzZWxlYXZlLnNsaWNrXCIse2FjdGlvbjpcImVuZFwifSxlLnN3aXBlSGFuZGxlciksZS4kbGlzdC5vbihcImNsaWNrLnNsaWNrXCIsZS5jbGlja0hhbmRsZXIpLGkoZG9jdW1lbnQpLm9uKGUudmlzaWJpbGl0eUNoYW5nZSxpLnByb3h5KGUudmlzaWJpbGl0eSxlKSksITA9PT1lLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSYmZS4kbGlzdC5vbihcImtleWRvd24uc2xpY2tcIixlLmtleUhhbmRsZXIpLCEwPT09ZS5vcHRpb25zLmZvY3VzT25TZWxlY3QmJmkoZS4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vbihcImNsaWNrLnNsaWNrXCIsZS5zZWxlY3RIYW5kbGVyKSxpKHdpbmRvdykub24oXCJvcmllbnRhdGlvbmNoYW5nZS5zbGljay5zbGljay1cIitlLmluc3RhbmNlVWlkLGkucHJveHkoZS5vcmllbnRhdGlvbkNoYW5nZSxlKSksaSh3aW5kb3cpLm9uKFwicmVzaXplLnNsaWNrLnNsaWNrLVwiK2UuaW5zdGFuY2VVaWQsaS5wcm94eShlLnJlc2l6ZSxlKSksaShcIltkcmFnZ2FibGUhPXRydWVdXCIsZS4kc2xpZGVUcmFjaykub24oXCJkcmFnc3RhcnRcIixlLnByZXZlbnREZWZhdWx0KSxpKHdpbmRvdykub24oXCJsb2FkLnNsaWNrLnNsaWNrLVwiK2UuaW5zdGFuY2VVaWQsZS5zZXRQb3NpdGlvbiksaShlLnNldFBvc2l0aW9uKX0sZS5wcm90b3R5cGUuaW5pdFVJPWZ1bmN0aW9uKCl7dmFyIGk9dGhpczshMD09PWkub3B0aW9ucy5hcnJvd3MmJmkuc2xpZGVDb3VudD5pLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoaS4kcHJldkFycm93LnNob3coKSxpLiRuZXh0QXJyb3cuc2hvdygpKSwhMD09PWkub3B0aW9ucy5kb3RzJiZpLnNsaWRlQ291bnQ+aS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmaS4kZG90cy5zaG93KCl9LGUucHJvdG90eXBlLmtleUhhbmRsZXI9ZnVuY3Rpb24oaSl7dmFyIGU9dGhpcztpLnRhcmdldC50YWdOYW1lLm1hdGNoKFwiVEVYVEFSRUF8SU5QVVR8U0VMRUNUXCIpfHwoMzc9PT1pLmtleUNvZGUmJiEwPT09ZS5vcHRpb25zLmFjY2Vzc2liaWxpdHk/ZS5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTohMD09PWUub3B0aW9ucy5ydGw/XCJuZXh0XCI6XCJwcmV2aW91c1wifX0pOjM5PT09aS5rZXlDb2RlJiYhMD09PWUub3B0aW9ucy5hY2Nlc3NpYmlsaXR5JiZlLmNoYW5nZVNsaWRlKHtkYXRhOnttZXNzYWdlOiEwPT09ZS5vcHRpb25zLnJ0bD9cInByZXZpb3VzXCI6XCJuZXh0XCJ9fSkpfSxlLnByb3RvdHlwZS5sYXp5TG9hZD1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSl7aShcImltZ1tkYXRhLWxhenldXCIsZSkuZWFjaChmdW5jdGlvbigpe3ZhciBlPWkodGhpcyksdD1pKHRoaXMpLmF0dHIoXCJkYXRhLWxhenlcIiksbz1pKHRoaXMpLmF0dHIoXCJkYXRhLXNyY3NldFwiKSxzPWkodGhpcykuYXR0cihcImRhdGEtc2l6ZXNcIil8fG4uJHNsaWRlci5hdHRyKFwiZGF0YS1zaXplc1wiKSxyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7ci5vbmxvYWQ9ZnVuY3Rpb24oKXtlLmFuaW1hdGUoe29wYWNpdHk6MH0sMTAwLGZ1bmN0aW9uKCl7byYmKGUuYXR0cihcInNyY3NldFwiLG8pLHMmJmUuYXR0cihcInNpemVzXCIscykpLGUuYXR0cihcInNyY1wiLHQpLmFuaW1hdGUoe29wYWNpdHk6MX0sMjAwLGZ1bmN0aW9uKCl7ZS5yZW1vdmVBdHRyKFwiZGF0YS1sYXp5IGRhdGEtc3Jjc2V0IGRhdGEtc2l6ZXNcIikucmVtb3ZlQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpfSksbi4kc2xpZGVyLnRyaWdnZXIoXCJsYXp5TG9hZGVkXCIsW24sZSx0XSl9KX0sci5vbmVycm9yPWZ1bmN0aW9uKCl7ZS5yZW1vdmVBdHRyKFwiZGF0YS1sYXp5XCIpLnJlbW92ZUNsYXNzKFwic2xpY2stbG9hZGluZ1wiKS5hZGRDbGFzcyhcInNsaWNrLWxhenlsb2FkLWVycm9yXCIpLG4uJHNsaWRlci50cmlnZ2VyKFwibGF6eUxvYWRFcnJvclwiLFtuLGUsdF0pfSxyLnNyYz10fSl9dmFyIHQsbyxzLG49dGhpcztpZighMD09PW4ub3B0aW9ucy5jZW50ZXJNb2RlPyEwPT09bi5vcHRpb25zLmluZmluaXRlP3M9KG89bi5jdXJyZW50U2xpZGUrKG4ub3B0aW9ucy5zbGlkZXNUb1Nob3cvMisxKSkrbi5vcHRpb25zLnNsaWRlc1RvU2hvdysyOihvPU1hdGgubWF4KDAsbi5jdXJyZW50U2xpZGUtKG4ub3B0aW9ucy5zbGlkZXNUb1Nob3cvMisxKSkscz1uLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIrMSsyK24uY3VycmVudFNsaWRlKToobz1uLm9wdGlvbnMuaW5maW5pdGU/bi5vcHRpb25zLnNsaWRlc1RvU2hvdytuLmN1cnJlbnRTbGlkZTpuLmN1cnJlbnRTbGlkZSxzPU1hdGguY2VpbChvK24ub3B0aW9ucy5zbGlkZXNUb1Nob3cpLCEwPT09bi5vcHRpb25zLmZhZGUmJihvPjAmJm8tLSxzPD1uLnNsaWRlQ291bnQmJnMrKykpLHQ9bi4kc2xpZGVyLmZpbmQoXCIuc2xpY2stc2xpZGVcIikuc2xpY2UobyxzKSxcImFudGljaXBhdGVkXCI9PT1uLm9wdGlvbnMubGF6eUxvYWQpZm9yKHZhciByPW8tMSxsPXMsZD1uLiRzbGlkZXIuZmluZChcIi5zbGljay1zbGlkZVwiKSxhPTA7YTxuLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7YSsrKXI8MCYmKHI9bi5zbGlkZUNvdW50LTEpLHQ9KHQ9dC5hZGQoZC5lcShyKSkpLmFkZChkLmVxKGwpKSxyLS0sbCsrO2UodCksbi5zbGlkZUNvdW50PD1uLm9wdGlvbnMuc2xpZGVzVG9TaG93P2Uobi4kc2xpZGVyLmZpbmQoXCIuc2xpY2stc2xpZGVcIikpOm4uY3VycmVudFNsaWRlPj1uLnNsaWRlQ291bnQtbi5vcHRpb25zLnNsaWRlc1RvU2hvdz9lKG4uJHNsaWRlci5maW5kKFwiLnNsaWNrLWNsb25lZFwiKS5zbGljZSgwLG4ub3B0aW9ucy5zbGlkZXNUb1Nob3cpKTowPT09bi5jdXJyZW50U2xpZGUmJmUobi4kc2xpZGVyLmZpbmQoXCIuc2xpY2stY2xvbmVkXCIpLnNsaWNlKC0xKm4ub3B0aW9ucy5zbGlkZXNUb1Nob3cpKX0sZS5wcm90b3R5cGUubG9hZFNsaWRlcj1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aS5zZXRQb3NpdGlvbigpLGkuJHNsaWRlVHJhY2suY3NzKHtvcGFjaXR5OjF9KSxpLiRzbGlkZXIucmVtb3ZlQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpLGkuaW5pdFVJKCksXCJwcm9ncmVzc2l2ZVwiPT09aS5vcHRpb25zLmxhenlMb2FkJiZpLnByb2dyZXNzaXZlTGF6eUxvYWQoKX0sZS5wcm90b3R5cGUubmV4dD1lLnByb3RvdHlwZS5zbGlja05leHQ9ZnVuY3Rpb24oKXt0aGlzLmNoYW5nZVNsaWRlKHtkYXRhOnttZXNzYWdlOlwibmV4dFwifX0pfSxlLnByb3RvdHlwZS5vcmllbnRhdGlvbkNoYW5nZT1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aS5jaGVja1Jlc3BvbnNpdmUoKSxpLnNldFBvc2l0aW9uKCl9LGUucHJvdG90eXBlLnBhdXNlPWUucHJvdG90eXBlLnNsaWNrUGF1c2U9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO2kuYXV0b1BsYXlDbGVhcigpLGkucGF1c2VkPSEwfSxlLnByb3RvdHlwZS5wbGF5PWUucHJvdG90eXBlLnNsaWNrUGxheT1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aS5hdXRvUGxheSgpLGkub3B0aW9ucy5hdXRvcGxheT0hMCxpLnBhdXNlZD0hMSxpLmZvY3Vzc2VkPSExLGkuaW50ZXJydXB0ZWQ9ITF9LGUucHJvdG90eXBlLnBvc3RTbGlkZT1mdW5jdGlvbihlKXt2YXIgdD10aGlzO3QudW5zbGlja2VkfHwodC4kc2xpZGVyLnRyaWdnZXIoXCJhZnRlckNoYW5nZVwiLFt0LGVdKSx0LmFuaW1hdGluZz0hMSx0LnNsaWRlQ291bnQ+dC5vcHRpb25zLnNsaWRlc1RvU2hvdyYmdC5zZXRQb3NpdGlvbigpLHQuc3dpcGVMZWZ0PW51bGwsdC5vcHRpb25zLmF1dG9wbGF5JiZ0LmF1dG9QbGF5KCksITA9PT10Lm9wdGlvbnMuYWNjZXNzaWJpbGl0eSYmKHQuaW5pdEFEQSgpLHQub3B0aW9ucy5mb2N1c09uQ2hhbmdlJiZpKHQuJHNsaWRlcy5nZXQodC5jdXJyZW50U2xpZGUpKS5hdHRyKFwidGFiaW5kZXhcIiwwKS5mb2N1cygpKSl9LGUucHJvdG90eXBlLnByZXY9ZS5wcm90b3R5cGUuc2xpY2tQcmV2PWZ1bmN0aW9uKCl7dGhpcy5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTpcInByZXZpb3VzXCJ9fSl9LGUucHJvdG90eXBlLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKGkpe2kucHJldmVudERlZmF1bHQoKX0sZS5wcm90b3R5cGUucHJvZ3Jlc3NpdmVMYXp5TG9hZD1mdW5jdGlvbihlKXtlPWV8fDE7dmFyIHQsbyxzLG4scixsPXRoaXMsZD1pKFwiaW1nW2RhdGEtbGF6eV1cIixsLiRzbGlkZXIpO2QubGVuZ3RoPyh0PWQuZmlyc3QoKSxvPXQuYXR0cihcImRhdGEtbGF6eVwiKSxzPXQuYXR0cihcImRhdGEtc3Jjc2V0XCIpLG49dC5hdHRyKFwiZGF0YS1zaXplc1wiKXx8bC4kc2xpZGVyLmF0dHIoXCJkYXRhLXNpemVzXCIpLChyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIikpLm9ubG9hZD1mdW5jdGlvbigpe3MmJih0LmF0dHIoXCJzcmNzZXRcIixzKSxuJiZ0LmF0dHIoXCJzaXplc1wiLG4pKSx0LmF0dHIoXCJzcmNcIixvKS5yZW1vdmVBdHRyKFwiZGF0YS1sYXp5IGRhdGEtc3Jjc2V0IGRhdGEtc2l6ZXNcIikucmVtb3ZlQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpLCEwPT09bC5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0JiZsLnNldFBvc2l0aW9uKCksbC4kc2xpZGVyLnRyaWdnZXIoXCJsYXp5TG9hZGVkXCIsW2wsdCxvXSksbC5wcm9ncmVzc2l2ZUxhenlMb2FkKCl9LHIub25lcnJvcj1mdW5jdGlvbigpe2U8Mz9zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bC5wcm9ncmVzc2l2ZUxhenlMb2FkKGUrMSl9LDUwMCk6KHQucmVtb3ZlQXR0cihcImRhdGEtbGF6eVwiKS5yZW1vdmVDbGFzcyhcInNsaWNrLWxvYWRpbmdcIikuYWRkQ2xhc3MoXCJzbGljay1sYXp5bG9hZC1lcnJvclwiKSxsLiRzbGlkZXIudHJpZ2dlcihcImxhenlMb2FkRXJyb3JcIixbbCx0LG9dKSxsLnByb2dyZXNzaXZlTGF6eUxvYWQoKSl9LHIuc3JjPW8pOmwuJHNsaWRlci50cmlnZ2VyKFwiYWxsSW1hZ2VzTG9hZGVkXCIsW2xdKX0sZS5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbihlKXt2YXIgdCxvLHM9dGhpcztvPXMuc2xpZGVDb3VudC1zLm9wdGlvbnMuc2xpZGVzVG9TaG93LCFzLm9wdGlvbnMuaW5maW5pdGUmJnMuY3VycmVudFNsaWRlPm8mJihzLmN1cnJlbnRTbGlkZT1vKSxzLnNsaWRlQ291bnQ8PXMub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihzLmN1cnJlbnRTbGlkZT0wKSx0PXMuY3VycmVudFNsaWRlLHMuZGVzdHJveSghMCksaS5leHRlbmQocyxzLmluaXRpYWxzLHtjdXJyZW50U2xpZGU6dH0pLHMuaW5pdCgpLGV8fHMuY2hhbmdlU2xpZGUoe2RhdGE6e21lc3NhZ2U6XCJpbmRleFwiLGluZGV4OnR9fSwhMSl9LGUucHJvdG90eXBlLnJlZ2lzdGVyQnJlYWtwb2ludHM9ZnVuY3Rpb24oKXt2YXIgZSx0LG8scz10aGlzLG49cy5vcHRpb25zLnJlc3BvbnNpdmV8fG51bGw7aWYoXCJhcnJheVwiPT09aS50eXBlKG4pJiZuLmxlbmd0aCl7cy5yZXNwb25kVG89cy5vcHRpb25zLnJlc3BvbmRUb3x8XCJ3aW5kb3dcIjtmb3IoZSBpbiBuKWlmKG89cy5icmVha3BvaW50cy5sZW5ndGgtMSxuLmhhc093blByb3BlcnR5KGUpKXtmb3IodD1uW2VdLmJyZWFrcG9pbnQ7bz49MDspcy5icmVha3BvaW50c1tvXSYmcy5icmVha3BvaW50c1tvXT09PXQmJnMuYnJlYWtwb2ludHMuc3BsaWNlKG8sMSksby0tO3MuYnJlYWtwb2ludHMucHVzaCh0KSxzLmJyZWFrcG9pbnRTZXR0aW5nc1t0XT1uW2VdLnNldHRpbmdzfXMuYnJlYWtwb2ludHMuc29ydChmdW5jdGlvbihpLGUpe3JldHVybiBzLm9wdGlvbnMubW9iaWxlRmlyc3Q/aS1lOmUtaX0pfX0sZS5wcm90b3R5cGUucmVpbml0PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLiRzbGlkZXM9ZS4kc2xpZGVUcmFjay5jaGlsZHJlbihlLm9wdGlvbnMuc2xpZGUpLmFkZENsYXNzKFwic2xpY2stc2xpZGVcIiksZS5zbGlkZUNvdW50PWUuJHNsaWRlcy5sZW5ndGgsZS5jdXJyZW50U2xpZGU+PWUuc2xpZGVDb3VudCYmMCE9PWUuY3VycmVudFNsaWRlJiYoZS5jdXJyZW50U2xpZGU9ZS5jdXJyZW50U2xpZGUtZS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSxlLnNsaWRlQ291bnQ8PWUub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihlLmN1cnJlbnRTbGlkZT0wKSxlLnJlZ2lzdGVyQnJlYWtwb2ludHMoKSxlLnNldFByb3BzKCksZS5zZXR1cEluZmluaXRlKCksZS5idWlsZEFycm93cygpLGUudXBkYXRlQXJyb3dzKCksZS5pbml0QXJyb3dFdmVudHMoKSxlLmJ1aWxkRG90cygpLGUudXBkYXRlRG90cygpLGUuaW5pdERvdEV2ZW50cygpLGUuY2xlYW5VcFNsaWRlRXZlbnRzKCksZS5pbml0U2xpZGVFdmVudHMoKSxlLmNoZWNrUmVzcG9uc2l2ZSghMSwhMCksITA9PT1lLm9wdGlvbnMuZm9jdXNPblNlbGVjdCYmaShlLiRzbGlkZVRyYWNrKS5jaGlsZHJlbigpLm9uKFwiY2xpY2suc2xpY2tcIixlLnNlbGVjdEhhbmRsZXIpLGUuc2V0U2xpZGVDbGFzc2VzKFwibnVtYmVyXCI9PXR5cGVvZiBlLmN1cnJlbnRTbGlkZT9lLmN1cnJlbnRTbGlkZTowKSxlLnNldFBvc2l0aW9uKCksZS5mb2N1c0hhbmRsZXIoKSxlLnBhdXNlZD0hZS5vcHRpb25zLmF1dG9wbGF5LGUuYXV0b1BsYXkoKSxlLiRzbGlkZXIudHJpZ2dlcihcInJlSW5pdFwiLFtlXSl9LGUucHJvdG90eXBlLnJlc2l6ZT1mdW5jdGlvbigpe3ZhciBlPXRoaXM7aSh3aW5kb3cpLndpZHRoKCkhPT1lLndpbmRvd1dpZHRoJiYoY2xlYXJUaW1lb3V0KGUud2luZG93RGVsYXkpLGUud2luZG93RGVsYXk9d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtlLndpbmRvd1dpZHRoPWkod2luZG93KS53aWR0aCgpLGUuY2hlY2tSZXNwb25zaXZlKCksZS51bnNsaWNrZWR8fGUuc2V0UG9zaXRpb24oKX0sNTApKX0sZS5wcm90b3R5cGUucmVtb3ZlU2xpZGU9ZS5wcm90b3R5cGUuc2xpY2tSZW1vdmU9ZnVuY3Rpb24oaSxlLHQpe3ZhciBvPXRoaXM7aWYoaT1cImJvb2xlYW5cIj09dHlwZW9mIGk/ITA9PT0oZT1pKT8wOm8uc2xpZGVDb3VudC0xOiEwPT09ZT8tLWk6aSxvLnNsaWRlQ291bnQ8MXx8aTwwfHxpPm8uc2xpZGVDb3VudC0xKXJldHVybiExO28udW5sb2FkKCksITA9PT10P28uJHNsaWRlVHJhY2suY2hpbGRyZW4oKS5yZW1vdmUoKTpvLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZXEoaSkucmVtb3ZlKCksby4kc2xpZGVzPW8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKSxvLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCksby4kc2xpZGVUcmFjay5hcHBlbmQoby4kc2xpZGVzKSxvLiRzbGlkZXNDYWNoZT1vLiRzbGlkZXMsby5yZWluaXQoKX0sZS5wcm90b3R5cGUuc2V0Q1NTPWZ1bmN0aW9uKGkpe3ZhciBlLHQsbz10aGlzLHM9e307ITA9PT1vLm9wdGlvbnMucnRsJiYoaT0taSksZT1cImxlZnRcIj09by5wb3NpdGlvblByb3A/TWF0aC5jZWlsKGkpK1wicHhcIjpcIjBweFwiLHQ9XCJ0b3BcIj09by5wb3NpdGlvblByb3A/TWF0aC5jZWlsKGkpK1wicHhcIjpcIjBweFwiLHNbby5wb3NpdGlvblByb3BdPWksITE9PT1vLnRyYW5zZm9ybXNFbmFibGVkP28uJHNsaWRlVHJhY2suY3NzKHMpOihzPXt9LCExPT09by5jc3NUcmFuc2l0aW9ucz8oc1tvLmFuaW1UeXBlXT1cInRyYW5zbGF0ZShcIitlK1wiLCBcIit0K1wiKVwiLG8uJHNsaWRlVHJhY2suY3NzKHMpKTooc1tvLmFuaW1UeXBlXT1cInRyYW5zbGF0ZTNkKFwiK2UrXCIsIFwiK3QrXCIsIDBweClcIixvLiRzbGlkZVRyYWNrLmNzcyhzKSkpfSxlLnByb3RvdHlwZS5zZXREaW1lbnNpb25zPWZ1bmN0aW9uKCl7dmFyIGk9dGhpczshMT09PWkub3B0aW9ucy52ZXJ0aWNhbD8hMD09PWkub3B0aW9ucy5jZW50ZXJNb2RlJiZpLiRsaXN0LmNzcyh7cGFkZGluZzpcIjBweCBcIitpLm9wdGlvbnMuY2VudGVyUGFkZGluZ30pOihpLiRsaXN0LmhlaWdodChpLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCghMCkqaS5vcHRpb25zLnNsaWRlc1RvU2hvdyksITA9PT1pLm9wdGlvbnMuY2VudGVyTW9kZSYmaS4kbGlzdC5jc3Moe3BhZGRpbmc6aS5vcHRpb25zLmNlbnRlclBhZGRpbmcrXCIgMHB4XCJ9KSksaS5saXN0V2lkdGg9aS4kbGlzdC53aWR0aCgpLGkubGlzdEhlaWdodD1pLiRsaXN0LmhlaWdodCgpLCExPT09aS5vcHRpb25zLnZlcnRpY2FsJiYhMT09PWkub3B0aW9ucy52YXJpYWJsZVdpZHRoPyhpLnNsaWRlV2lkdGg9TWF0aC5jZWlsKGkubGlzdFdpZHRoL2kub3B0aW9ucy5zbGlkZXNUb1Nob3cpLGkuJHNsaWRlVHJhY2sud2lkdGgoTWF0aC5jZWlsKGkuc2xpZGVXaWR0aCppLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLmxlbmd0aCkpKTohMD09PWkub3B0aW9ucy52YXJpYWJsZVdpZHRoP2kuJHNsaWRlVHJhY2sud2lkdGgoNWUzKmkuc2xpZGVDb3VudCk6KGkuc2xpZGVXaWR0aD1NYXRoLmNlaWwoaS5saXN0V2lkdGgpLGkuJHNsaWRlVHJhY2suaGVpZ2h0KE1hdGguY2VpbChpLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCghMCkqaS4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS5sZW5ndGgpKSk7dmFyIGU9aS4kc2xpZGVzLmZpcnN0KCkub3V0ZXJXaWR0aCghMCktaS4kc2xpZGVzLmZpcnN0KCkud2lkdGgoKTshMT09PWkub3B0aW9ucy52YXJpYWJsZVdpZHRoJiZpLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLndpZHRoKGkuc2xpZGVXaWR0aC1lKX0sZS5wcm90b3R5cGUuc2V0RmFkZT1mdW5jdGlvbigpe3ZhciBlLHQ9dGhpczt0LiRzbGlkZXMuZWFjaChmdW5jdGlvbihvLHMpe2U9dC5zbGlkZVdpZHRoKm8qLTEsITA9PT10Lm9wdGlvbnMucnRsP2kocykuY3NzKHtwb3NpdGlvbjpcInJlbGF0aXZlXCIscmlnaHQ6ZSx0b3A6MCx6SW5kZXg6dC5vcHRpb25zLnpJbmRleC0yLG9wYWNpdHk6MH0pOmkocykuY3NzKHtwb3NpdGlvbjpcInJlbGF0aXZlXCIsbGVmdDplLHRvcDowLHpJbmRleDp0Lm9wdGlvbnMuekluZGV4LTIsb3BhY2l0eTowfSl9KSx0LiRzbGlkZXMuZXEodC5jdXJyZW50U2xpZGUpLmNzcyh7ekluZGV4OnQub3B0aW9ucy56SW5kZXgtMSxvcGFjaXR5OjF9KX0sZS5wcm90b3R5cGUuc2V0SGVpZ2h0PWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztpZigxPT09aS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmITA9PT1pLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQmJiExPT09aS5vcHRpb25zLnZlcnRpY2FsKXt2YXIgZT1pLiRzbGlkZXMuZXEoaS5jdXJyZW50U2xpZGUpLm91dGVySGVpZ2h0KCEwKTtpLiRsaXN0LmNzcyhcImhlaWdodFwiLGUpfX0sZS5wcm90b3R5cGUuc2V0T3B0aW9uPWUucHJvdG90eXBlLnNsaWNrU2V0T3B0aW9uPWZ1bmN0aW9uKCl7dmFyIGUsdCxvLHMsbixyPXRoaXMsbD0hMTtpZihcIm9iamVjdFwiPT09aS50eXBlKGFyZ3VtZW50c1swXSk/KG89YXJndW1lbnRzWzBdLGw9YXJndW1lbnRzWzFdLG49XCJtdWx0aXBsZVwiKTpcInN0cmluZ1wiPT09aS50eXBlKGFyZ3VtZW50c1swXSkmJihvPWFyZ3VtZW50c1swXSxzPWFyZ3VtZW50c1sxXSxsPWFyZ3VtZW50c1syXSxcInJlc3BvbnNpdmVcIj09PWFyZ3VtZW50c1swXSYmXCJhcnJheVwiPT09aS50eXBlKGFyZ3VtZW50c1sxXSk/bj1cInJlc3BvbnNpdmVcIjp2b2lkIDAhPT1hcmd1bWVudHNbMV0mJihuPVwic2luZ2xlXCIpKSxcInNpbmdsZVwiPT09bilyLm9wdGlvbnNbb109cztlbHNlIGlmKFwibXVsdGlwbGVcIj09PW4paS5lYWNoKG8sZnVuY3Rpb24oaSxlKXtyLm9wdGlvbnNbaV09ZX0pO2Vsc2UgaWYoXCJyZXNwb25zaXZlXCI9PT1uKWZvcih0IGluIHMpaWYoXCJhcnJheVwiIT09aS50eXBlKHIub3B0aW9ucy5yZXNwb25zaXZlKSlyLm9wdGlvbnMucmVzcG9uc2l2ZT1bc1t0XV07ZWxzZXtmb3IoZT1yLm9wdGlvbnMucmVzcG9uc2l2ZS5sZW5ndGgtMTtlPj0wOylyLm9wdGlvbnMucmVzcG9uc2l2ZVtlXS5icmVha3BvaW50PT09c1t0XS5icmVha3BvaW50JiZyLm9wdGlvbnMucmVzcG9uc2l2ZS5zcGxpY2UoZSwxKSxlLS07ci5vcHRpb25zLnJlc3BvbnNpdmUucHVzaChzW3RdKX1sJiYoci51bmxvYWQoKSxyLnJlaW5pdCgpKX0sZS5wcm90b3R5cGUuc2V0UG9zaXRpb249ZnVuY3Rpb24oKXt2YXIgaT10aGlzO2kuc2V0RGltZW5zaW9ucygpLGkuc2V0SGVpZ2h0KCksITE9PT1pLm9wdGlvbnMuZmFkZT9pLnNldENTUyhpLmdldExlZnQoaS5jdXJyZW50U2xpZGUpKTppLnNldEZhZGUoKSxpLiRzbGlkZXIudHJpZ2dlcihcInNldFBvc2l0aW9uXCIsW2ldKX0sZS5wcm90b3R5cGUuc2V0UHJvcHM9ZnVuY3Rpb24oKXt2YXIgaT10aGlzLGU9ZG9jdW1lbnQuYm9keS5zdHlsZTtpLnBvc2l0aW9uUHJvcD0hMD09PWkub3B0aW9ucy52ZXJ0aWNhbD9cInRvcFwiOlwibGVmdFwiLFwidG9wXCI9PT1pLnBvc2l0aW9uUHJvcD9pLiRzbGlkZXIuYWRkQ2xhc3MoXCJzbGljay12ZXJ0aWNhbFwiKTppLiRzbGlkZXIucmVtb3ZlQ2xhc3MoXCJzbGljay12ZXJ0aWNhbFwiKSx2b2lkIDA9PT1lLldlYmtpdFRyYW5zaXRpb24mJnZvaWQgMD09PWUuTW96VHJhbnNpdGlvbiYmdm9pZCAwPT09ZS5tc1RyYW5zaXRpb258fCEwPT09aS5vcHRpb25zLnVzZUNTUyYmKGkuY3NzVHJhbnNpdGlvbnM9ITApLGkub3B0aW9ucy5mYWRlJiYoXCJudW1iZXJcIj09dHlwZW9mIGkub3B0aW9ucy56SW5kZXg/aS5vcHRpb25zLnpJbmRleDwzJiYoaS5vcHRpb25zLnpJbmRleD0zKTppLm9wdGlvbnMuekluZGV4PWkuZGVmYXVsdHMuekluZGV4KSx2b2lkIDAhPT1lLk9UcmFuc2Zvcm0mJihpLmFuaW1UeXBlPVwiT1RyYW5zZm9ybVwiLGkudHJhbnNmb3JtVHlwZT1cIi1vLXRyYW5zZm9ybVwiLGkudHJhbnNpdGlvblR5cGU9XCJPVHJhbnNpdGlvblwiLHZvaWQgMD09PWUucGVyc3BlY3RpdmVQcm9wZXJ0eSYmdm9pZCAwPT09ZS53ZWJraXRQZXJzcGVjdGl2ZSYmKGkuYW5pbVR5cGU9ITEpKSx2b2lkIDAhPT1lLk1velRyYW5zZm9ybSYmKGkuYW5pbVR5cGU9XCJNb3pUcmFuc2Zvcm1cIixpLnRyYW5zZm9ybVR5cGU9XCItbW96LXRyYW5zZm9ybVwiLGkudHJhbnNpdGlvblR5cGU9XCJNb3pUcmFuc2l0aW9uXCIsdm9pZCAwPT09ZS5wZXJzcGVjdGl2ZVByb3BlcnR5JiZ2b2lkIDA9PT1lLk1velBlcnNwZWN0aXZlJiYoaS5hbmltVHlwZT0hMSkpLHZvaWQgMCE9PWUud2Via2l0VHJhbnNmb3JtJiYoaS5hbmltVHlwZT1cIndlYmtpdFRyYW5zZm9ybVwiLGkudHJhbnNmb3JtVHlwZT1cIi13ZWJraXQtdHJhbnNmb3JtXCIsaS50cmFuc2l0aW9uVHlwZT1cIndlYmtpdFRyYW5zaXRpb25cIix2b2lkIDA9PT1lLnBlcnNwZWN0aXZlUHJvcGVydHkmJnZvaWQgMD09PWUud2Via2l0UGVyc3BlY3RpdmUmJihpLmFuaW1UeXBlPSExKSksdm9pZCAwIT09ZS5tc1RyYW5zZm9ybSYmKGkuYW5pbVR5cGU9XCJtc1RyYW5zZm9ybVwiLGkudHJhbnNmb3JtVHlwZT1cIi1tcy10cmFuc2Zvcm1cIixpLnRyYW5zaXRpb25UeXBlPVwibXNUcmFuc2l0aW9uXCIsdm9pZCAwPT09ZS5tc1RyYW5zZm9ybSYmKGkuYW5pbVR5cGU9ITEpKSx2b2lkIDAhPT1lLnRyYW5zZm9ybSYmITEhPT1pLmFuaW1UeXBlJiYoaS5hbmltVHlwZT1cInRyYW5zZm9ybVwiLGkudHJhbnNmb3JtVHlwZT1cInRyYW5zZm9ybVwiLGkudHJhbnNpdGlvblR5cGU9XCJ0cmFuc2l0aW9uXCIpLGkudHJhbnNmb3Jtc0VuYWJsZWQ9aS5vcHRpb25zLnVzZVRyYW5zZm9ybSYmbnVsbCE9PWkuYW5pbVR5cGUmJiExIT09aS5hbmltVHlwZX0sZS5wcm90b3R5cGUuc2V0U2xpZGVDbGFzc2VzPWZ1bmN0aW9uKGkpe3ZhciBlLHQsbyxzLG49dGhpcztpZih0PW4uJHNsaWRlci5maW5kKFwiLnNsaWNrLXNsaWRlXCIpLnJlbW92ZUNsYXNzKFwic2xpY2stYWN0aXZlIHNsaWNrLWNlbnRlciBzbGljay1jdXJyZW50XCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKSxuLiRzbGlkZXMuZXEoaSkuYWRkQ2xhc3MoXCJzbGljay1jdXJyZW50XCIpLCEwPT09bi5vcHRpb25zLmNlbnRlck1vZGUpe3ZhciByPW4ub3B0aW9ucy5zbGlkZXNUb1Nob3clMj09MD8xOjA7ZT1NYXRoLmZsb29yKG4ub3B0aW9ucy5zbGlkZXNUb1Nob3cvMiksITA9PT1uLm9wdGlvbnMuaW5maW5pdGUmJihpPj1lJiZpPD1uLnNsaWRlQ291bnQtMS1lP24uJHNsaWRlcy5zbGljZShpLWUrcixpK2UrMSkuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKToobz1uLm9wdGlvbnMuc2xpZGVzVG9TaG93K2ksdC5zbGljZShvLWUrMStyLG8rZSsyKS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpKSwwPT09aT90LmVxKHQubGVuZ3RoLTEtbi5vcHRpb25zLnNsaWRlc1RvU2hvdykuYWRkQ2xhc3MoXCJzbGljay1jZW50ZXJcIik6aT09PW4uc2xpZGVDb3VudC0xJiZ0LmVxKG4ub3B0aW9ucy5zbGlkZXNUb1Nob3cpLmFkZENsYXNzKFwic2xpY2stY2VudGVyXCIpKSxuLiRzbGlkZXMuZXEoaSkuYWRkQ2xhc3MoXCJzbGljay1jZW50ZXJcIil9ZWxzZSBpPj0wJiZpPD1uLnNsaWRlQ291bnQtbi5vcHRpb25zLnNsaWRlc1RvU2hvdz9uLiRzbGlkZXMuc2xpY2UoaSxpK24ub3B0aW9ucy5zbGlkZXNUb1Nob3cpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIik6dC5sZW5ndGg8PW4ub3B0aW9ucy5zbGlkZXNUb1Nob3c/dC5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpOihzPW4uc2xpZGVDb3VudCVuLm9wdGlvbnMuc2xpZGVzVG9TaG93LG89ITA9PT1uLm9wdGlvbnMuaW5maW5pdGU/bi5vcHRpb25zLnNsaWRlc1RvU2hvdytpOmksbi5vcHRpb25zLnNsaWRlc1RvU2hvdz09bi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsJiZuLnNsaWRlQ291bnQtaTxuLm9wdGlvbnMuc2xpZGVzVG9TaG93P3Quc2xpY2Uoby0obi5vcHRpb25zLnNsaWRlc1RvU2hvdy1zKSxvK3MpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIik6dC5zbGljZShvLG8rbi5vcHRpb25zLnNsaWRlc1RvU2hvdykuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKSk7XCJvbmRlbWFuZFwiIT09bi5vcHRpb25zLmxhenlMb2FkJiZcImFudGljaXBhdGVkXCIhPT1uLm9wdGlvbnMubGF6eUxvYWR8fG4ubGF6eUxvYWQoKX0sZS5wcm90b3R5cGUuc2V0dXBJbmZpbml0ZT1mdW5jdGlvbigpe3ZhciBlLHQsbyxzPXRoaXM7aWYoITA9PT1zLm9wdGlvbnMuZmFkZSYmKHMub3B0aW9ucy5jZW50ZXJNb2RlPSExKSwhMD09PXMub3B0aW9ucy5pbmZpbml0ZSYmITE9PT1zLm9wdGlvbnMuZmFkZSYmKHQ9bnVsbCxzLnNsaWRlQ291bnQ+cy5vcHRpb25zLnNsaWRlc1RvU2hvdykpe2ZvcihvPSEwPT09cy5vcHRpb25zLmNlbnRlck1vZGU/cy5vcHRpb25zLnNsaWRlc1RvU2hvdysxOnMub3B0aW9ucy5zbGlkZXNUb1Nob3csZT1zLnNsaWRlQ291bnQ7ZT5zLnNsaWRlQ291bnQtbztlLT0xKXQ9ZS0xLGkocy4kc2xpZGVzW3RdKS5jbG9uZSghMCkuYXR0cihcImlkXCIsXCJcIikuYXR0cihcImRhdGEtc2xpY2staW5kZXhcIix0LXMuc2xpZGVDb3VudCkucHJlcGVuZFRvKHMuJHNsaWRlVHJhY2spLmFkZENsYXNzKFwic2xpY2stY2xvbmVkXCIpO2ZvcihlPTA7ZTxvK3Muc2xpZGVDb3VudDtlKz0xKXQ9ZSxpKHMuJHNsaWRlc1t0XSkuY2xvbmUoITApLmF0dHIoXCJpZFwiLFwiXCIpLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIsdCtzLnNsaWRlQ291bnQpLmFwcGVuZFRvKHMuJHNsaWRlVHJhY2spLmFkZENsYXNzKFwic2xpY2stY2xvbmVkXCIpO3MuJHNsaWRlVHJhY2suZmluZChcIi5zbGljay1jbG9uZWRcIikuZmluZChcIltpZF1cIikuZWFjaChmdW5jdGlvbigpe2kodGhpcykuYXR0cihcImlkXCIsXCJcIil9KX19LGUucHJvdG90eXBlLmludGVycnVwdD1mdW5jdGlvbihpKXt2YXIgZT10aGlzO2l8fGUuYXV0b1BsYXkoKSxlLmludGVycnVwdGVkPWl9LGUucHJvdG90eXBlLnNlbGVjdEhhbmRsZXI9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxvPWkoZS50YXJnZXQpLmlzKFwiLnNsaWNrLXNsaWRlXCIpP2koZS50YXJnZXQpOmkoZS50YXJnZXQpLnBhcmVudHMoXCIuc2xpY2stc2xpZGVcIikscz1wYXJzZUludChvLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIpKTtzfHwocz0wKSx0LnNsaWRlQ291bnQ8PXQub3B0aW9ucy5zbGlkZXNUb1Nob3c/dC5zbGlkZUhhbmRsZXIocywhMSwhMCk6dC5zbGlkZUhhbmRsZXIocyl9LGUucHJvdG90eXBlLnNsaWRlSGFuZGxlcj1mdW5jdGlvbihpLGUsdCl7dmFyIG8scyxuLHIsbCxkPW51bGwsYT10aGlzO2lmKGU9ZXx8ITEsISghMD09PWEuYW5pbWF0aW5nJiYhMD09PWEub3B0aW9ucy53YWl0Rm9yQW5pbWF0ZXx8ITA9PT1hLm9wdGlvbnMuZmFkZSYmYS5jdXJyZW50U2xpZGU9PT1pKSlpZighMT09PWUmJmEuYXNOYXZGb3IoaSksbz1pLGQ9YS5nZXRMZWZ0KG8pLHI9YS5nZXRMZWZ0KGEuY3VycmVudFNsaWRlKSxhLmN1cnJlbnRMZWZ0PW51bGw9PT1hLnN3aXBlTGVmdD9yOmEuc3dpcGVMZWZ0LCExPT09YS5vcHRpb25zLmluZmluaXRlJiYhMT09PWEub3B0aW9ucy5jZW50ZXJNb2RlJiYoaTwwfHxpPmEuZ2V0RG90Q291bnQoKSphLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpKSExPT09YS5vcHRpb25zLmZhZGUmJihvPWEuY3VycmVudFNsaWRlLCEwIT09dD9hLmFuaW1hdGVTbGlkZShyLGZ1bmN0aW9uKCl7YS5wb3N0U2xpZGUobyl9KTphLnBvc3RTbGlkZShvKSk7ZWxzZSBpZighMT09PWEub3B0aW9ucy5pbmZpbml0ZSYmITA9PT1hLm9wdGlvbnMuY2VudGVyTW9kZSYmKGk8MHx8aT5hLnNsaWRlQ291bnQtYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSkhMT09PWEub3B0aW9ucy5mYWRlJiYobz1hLmN1cnJlbnRTbGlkZSwhMCE9PXQ/YS5hbmltYXRlU2xpZGUocixmdW5jdGlvbigpe2EucG9zdFNsaWRlKG8pfSk6YS5wb3N0U2xpZGUobykpO2Vsc2V7aWYoYS5vcHRpb25zLmF1dG9wbGF5JiZjbGVhckludGVydmFsKGEuYXV0b1BsYXlUaW1lcikscz1vPDA/YS5zbGlkZUNvdW50JWEub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCE9MD9hLnNsaWRlQ291bnQtYS5zbGlkZUNvdW50JWEub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDphLnNsaWRlQ291bnQrbzpvPj1hLnNsaWRlQ291bnQ/YS5zbGlkZUNvdW50JWEub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCE9MD8wOm8tYS5zbGlkZUNvdW50Om8sYS5hbmltYXRpbmc9ITAsYS4kc2xpZGVyLnRyaWdnZXIoXCJiZWZvcmVDaGFuZ2VcIixbYSxhLmN1cnJlbnRTbGlkZSxzXSksbj1hLmN1cnJlbnRTbGlkZSxhLmN1cnJlbnRTbGlkZT1zLGEuc2V0U2xpZGVDbGFzc2VzKGEuY3VycmVudFNsaWRlKSxhLm9wdGlvbnMuYXNOYXZGb3ImJihsPShsPWEuZ2V0TmF2VGFyZ2V0KCkpLnNsaWNrKFwiZ2V0U2xpY2tcIikpLnNsaWRlQ291bnQ8PWwub3B0aW9ucy5zbGlkZXNUb1Nob3cmJmwuc2V0U2xpZGVDbGFzc2VzKGEuY3VycmVudFNsaWRlKSxhLnVwZGF0ZURvdHMoKSxhLnVwZGF0ZUFycm93cygpLCEwPT09YS5vcHRpb25zLmZhZGUpcmV0dXJuITAhPT10PyhhLmZhZGVTbGlkZU91dChuKSxhLmZhZGVTbGlkZShzLGZ1bmN0aW9uKCl7YS5wb3N0U2xpZGUocyl9KSk6YS5wb3N0U2xpZGUocyksdm9pZCBhLmFuaW1hdGVIZWlnaHQoKTshMCE9PXQ/YS5hbmltYXRlU2xpZGUoZCxmdW5jdGlvbigpe2EucG9zdFNsaWRlKHMpfSk6YS5wb3N0U2xpZGUocyl9fSxlLnByb3RvdHlwZS5zdGFydExvYWQ9ZnVuY3Rpb24oKXt2YXIgaT10aGlzOyEwPT09aS5vcHRpb25zLmFycm93cyYmaS5zbGlkZUNvdW50Pmkub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihpLiRwcmV2QXJyb3cuaGlkZSgpLGkuJG5leHRBcnJvdy5oaWRlKCkpLCEwPT09aS5vcHRpb25zLmRvdHMmJmkuc2xpZGVDb3VudD5pLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZpLiRkb3RzLmhpZGUoKSxpLiRzbGlkZXIuYWRkQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpfSxlLnByb3RvdHlwZS5zd2lwZURpcmVjdGlvbj1mdW5jdGlvbigpe3ZhciBpLGUsdCxvLHM9dGhpcztyZXR1cm4gaT1zLnRvdWNoT2JqZWN0LnN0YXJ0WC1zLnRvdWNoT2JqZWN0LmN1clgsZT1zLnRvdWNoT2JqZWN0LnN0YXJ0WS1zLnRvdWNoT2JqZWN0LmN1clksdD1NYXRoLmF0YW4yKGUsaSksKG89TWF0aC5yb3VuZCgxODAqdC9NYXRoLlBJKSk8MCYmKG89MzYwLU1hdGguYWJzKG8pKSxvPD00NSYmbz49MD8hMT09PXMub3B0aW9ucy5ydGw/XCJsZWZ0XCI6XCJyaWdodFwiOm88PTM2MCYmbz49MzE1PyExPT09cy5vcHRpb25zLnJ0bD9cImxlZnRcIjpcInJpZ2h0XCI6bz49MTM1JiZvPD0yMjU/ITE9PT1zLm9wdGlvbnMucnRsP1wicmlnaHRcIjpcImxlZnRcIjohMD09PXMub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmc/bz49MzUmJm88PTEzNT9cImRvd25cIjpcInVwXCI6XCJ2ZXJ0aWNhbFwifSxlLnByb3RvdHlwZS5zd2lwZUVuZD1mdW5jdGlvbihpKXt2YXIgZSx0LG89dGhpcztpZihvLmRyYWdnaW5nPSExLG8uc3dpcGluZz0hMSxvLnNjcm9sbGluZylyZXR1cm4gby5zY3JvbGxpbmc9ITEsITE7aWYoby5pbnRlcnJ1cHRlZD0hMSxvLnNob3VsZENsaWNrPSEoby50b3VjaE9iamVjdC5zd2lwZUxlbmd0aD4xMCksdm9pZCAwPT09by50b3VjaE9iamVjdC5jdXJYKXJldHVybiExO2lmKCEwPT09by50b3VjaE9iamVjdC5lZGdlSGl0JiZvLiRzbGlkZXIudHJpZ2dlcihcImVkZ2VcIixbbyxvLnN3aXBlRGlyZWN0aW9uKCldKSxvLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoPj1vLnRvdWNoT2JqZWN0Lm1pblN3aXBlKXtzd2l0Y2godD1vLnN3aXBlRGlyZWN0aW9uKCkpe2Nhc2VcImxlZnRcIjpjYXNlXCJkb3duXCI6ZT1vLm9wdGlvbnMuc3dpcGVUb1NsaWRlP28uY2hlY2tOYXZpZ2FibGUoby5jdXJyZW50U2xpZGUrby5nZXRTbGlkZUNvdW50KCkpOm8uY3VycmVudFNsaWRlK28uZ2V0U2xpZGVDb3VudCgpLG8uY3VycmVudERpcmVjdGlvbj0wO2JyZWFrO2Nhc2VcInJpZ2h0XCI6Y2FzZVwidXBcIjplPW8ub3B0aW9ucy5zd2lwZVRvU2xpZGU/by5jaGVja05hdmlnYWJsZShvLmN1cnJlbnRTbGlkZS1vLmdldFNsaWRlQ291bnQoKSk6by5jdXJyZW50U2xpZGUtby5nZXRTbGlkZUNvdW50KCksby5jdXJyZW50RGlyZWN0aW9uPTF9XCJ2ZXJ0aWNhbFwiIT10JiYoby5zbGlkZUhhbmRsZXIoZSksby50b3VjaE9iamVjdD17fSxvLiRzbGlkZXIudHJpZ2dlcihcInN3aXBlXCIsW28sdF0pKX1lbHNlIG8udG91Y2hPYmplY3Quc3RhcnRYIT09by50b3VjaE9iamVjdC5jdXJYJiYoby5zbGlkZUhhbmRsZXIoby5jdXJyZW50U2xpZGUpLG8udG91Y2hPYmplY3Q9e30pfSxlLnByb3RvdHlwZS5zd2lwZUhhbmRsZXI9ZnVuY3Rpb24oaSl7dmFyIGU9dGhpcztpZighKCExPT09ZS5vcHRpb25zLnN3aXBlfHxcIm9udG91Y2hlbmRcImluIGRvY3VtZW50JiYhMT09PWUub3B0aW9ucy5zd2lwZXx8ITE9PT1lLm9wdGlvbnMuZHJhZ2dhYmxlJiYtMSE9PWkudHlwZS5pbmRleE9mKFwibW91c2VcIikpKXN3aXRjaChlLnRvdWNoT2JqZWN0LmZpbmdlckNvdW50PWkub3JpZ2luYWxFdmVudCYmdm9pZCAwIT09aS5vcmlnaW5hbEV2ZW50LnRvdWNoZXM/aS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMubGVuZ3RoOjEsZS50b3VjaE9iamVjdC5taW5Td2lwZT1lLmxpc3RXaWR0aC9lLm9wdGlvbnMudG91Y2hUaHJlc2hvbGQsITA9PT1lLm9wdGlvbnMudmVydGljYWxTd2lwaW5nJiYoZS50b3VjaE9iamVjdC5taW5Td2lwZT1lLmxpc3RIZWlnaHQvZS5vcHRpb25zLnRvdWNoVGhyZXNob2xkKSxpLmRhdGEuYWN0aW9uKXtjYXNlXCJzdGFydFwiOmUuc3dpcGVTdGFydChpKTticmVhaztjYXNlXCJtb3ZlXCI6ZS5zd2lwZU1vdmUoaSk7YnJlYWs7Y2FzZVwiZW5kXCI6ZS5zd2lwZUVuZChpKX19LGUucHJvdG90eXBlLnN3aXBlTW92ZT1mdW5jdGlvbihpKXt2YXIgZSx0LG8scyxuLHIsbD10aGlzO3JldHVybiBuPXZvaWQgMCE9PWkub3JpZ2luYWxFdmVudD9pLm9yaWdpbmFsRXZlbnQudG91Y2hlczpudWxsLCEoIWwuZHJhZ2dpbmd8fGwuc2Nyb2xsaW5nfHxuJiYxIT09bi5sZW5ndGgpJiYoZT1sLmdldExlZnQobC5jdXJyZW50U2xpZGUpLGwudG91Y2hPYmplY3QuY3VyWD12b2lkIDAhPT1uP25bMF0ucGFnZVg6aS5jbGllbnRYLGwudG91Y2hPYmplY3QuY3VyWT12b2lkIDAhPT1uP25bMF0ucGFnZVk6aS5jbGllbnRZLGwudG91Y2hPYmplY3Quc3dpcGVMZW5ndGg9TWF0aC5yb3VuZChNYXRoLnNxcnQoTWF0aC5wb3cobC50b3VjaE9iamVjdC5jdXJYLWwudG91Y2hPYmplY3Quc3RhcnRYLDIpKSkscj1NYXRoLnJvdW5kKE1hdGguc3FydChNYXRoLnBvdyhsLnRvdWNoT2JqZWN0LmN1clktbC50b3VjaE9iamVjdC5zdGFydFksMikpKSwhbC5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyYmIWwuc3dpcGluZyYmcj40PyhsLnNjcm9sbGluZz0hMCwhMSk6KCEwPT09bC5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyYmKGwudG91Y2hPYmplY3Quc3dpcGVMZW5ndGg9ciksdD1sLnN3aXBlRGlyZWN0aW9uKCksdm9pZCAwIT09aS5vcmlnaW5hbEV2ZW50JiZsLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoPjQmJihsLnN3aXBpbmc9ITAsaS5wcmV2ZW50RGVmYXVsdCgpKSxzPSghMT09PWwub3B0aW9ucy5ydGw/MTotMSkqKGwudG91Y2hPYmplY3QuY3VyWD5sLnRvdWNoT2JqZWN0LnN0YXJ0WD8xOi0xKSwhMD09PWwub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcmJihzPWwudG91Y2hPYmplY3QuY3VyWT5sLnRvdWNoT2JqZWN0LnN0YXJ0WT8xOi0xKSxvPWwudG91Y2hPYmplY3Quc3dpcGVMZW5ndGgsbC50b3VjaE9iamVjdC5lZGdlSGl0PSExLCExPT09bC5vcHRpb25zLmluZmluaXRlJiYoMD09PWwuY3VycmVudFNsaWRlJiZcInJpZ2h0XCI9PT10fHxsLmN1cnJlbnRTbGlkZT49bC5nZXREb3RDb3VudCgpJiZcImxlZnRcIj09PXQpJiYobz1sLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoKmwub3B0aW9ucy5lZGdlRnJpY3Rpb24sbC50b3VjaE9iamVjdC5lZGdlSGl0PSEwKSwhMT09PWwub3B0aW9ucy52ZXJ0aWNhbD9sLnN3aXBlTGVmdD1lK28qczpsLnN3aXBlTGVmdD1lK28qKGwuJGxpc3QuaGVpZ2h0KCkvbC5saXN0V2lkdGgpKnMsITA9PT1sLm9wdGlvbnMudmVydGljYWxTd2lwaW5nJiYobC5zd2lwZUxlZnQ9ZStvKnMpLCEwIT09bC5vcHRpb25zLmZhZGUmJiExIT09bC5vcHRpb25zLnRvdWNoTW92ZSYmKCEwPT09bC5hbmltYXRpbmc/KGwuc3dpcGVMZWZ0PW51bGwsITEpOnZvaWQgbC5zZXRDU1MobC5zd2lwZUxlZnQpKSkpfSxlLnByb3RvdHlwZS5zd2lwZVN0YXJ0PWZ1bmN0aW9uKGkpe3ZhciBlLHQ9dGhpcztpZih0LmludGVycnVwdGVkPSEwLDEhPT10LnRvdWNoT2JqZWN0LmZpbmdlckNvdW50fHx0LnNsaWRlQ291bnQ8PXQub3B0aW9ucy5zbGlkZXNUb1Nob3cpcmV0dXJuIHQudG91Y2hPYmplY3Q9e30sITE7dm9pZCAwIT09aS5vcmlnaW5hbEV2ZW50JiZ2b2lkIDAhPT1pLm9yaWdpbmFsRXZlbnQudG91Y2hlcyYmKGU9aS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0pLHQudG91Y2hPYmplY3Quc3RhcnRYPXQudG91Y2hPYmplY3QuY3VyWD12b2lkIDAhPT1lP2UucGFnZVg6aS5jbGllbnRYLHQudG91Y2hPYmplY3Quc3RhcnRZPXQudG91Y2hPYmplY3QuY3VyWT12b2lkIDAhPT1lP2UucGFnZVk6aS5jbGllbnRZLHQuZHJhZ2dpbmc9ITB9LGUucHJvdG90eXBlLnVuZmlsdGVyU2xpZGVzPWUucHJvdG90eXBlLnNsaWNrVW5maWx0ZXI9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO251bGwhPT1pLiRzbGlkZXNDYWNoZSYmKGkudW5sb2FkKCksaS4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpLGkuJHNsaWRlc0NhY2hlLmFwcGVuZFRvKGkuJHNsaWRlVHJhY2spLGkucmVpbml0KCkpfSxlLnByb3RvdHlwZS51bmxvYWQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2koXCIuc2xpY2stY2xvbmVkXCIsZS4kc2xpZGVyKS5yZW1vdmUoKSxlLiRkb3RzJiZlLiRkb3RzLnJlbW92ZSgpLGUuJHByZXZBcnJvdyYmZS5odG1sRXhwci50ZXN0KGUub3B0aW9ucy5wcmV2QXJyb3cpJiZlLiRwcmV2QXJyb3cucmVtb3ZlKCksZS4kbmV4dEFycm93JiZlLmh0bWxFeHByLnRlc3QoZS5vcHRpb25zLm5leHRBcnJvdykmJmUuJG5leHRBcnJvdy5yZW1vdmUoKSxlLiRzbGlkZXMucmVtb3ZlQ2xhc3MoXCJzbGljay1zbGlkZSBzbGljay1hY3RpdmUgc2xpY2stdmlzaWJsZSBzbGljay1jdXJyZW50XCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKS5jc3MoXCJ3aWR0aFwiLFwiXCIpfSxlLnByb3RvdHlwZS51bnNsaWNrPWZ1bmN0aW9uKGkpe3ZhciBlPXRoaXM7ZS4kc2xpZGVyLnRyaWdnZXIoXCJ1bnNsaWNrXCIsW2UsaV0pLGUuZGVzdHJveSgpfSxlLnByb3RvdHlwZS51cGRhdGVBcnJvd3M9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO01hdGguZmxvb3IoaS5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKSwhMD09PWkub3B0aW9ucy5hcnJvd3MmJmkuc2xpZGVDb3VudD5pLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYhaS5vcHRpb25zLmluZmluaXRlJiYoaS4kcHJldkFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcImZhbHNlXCIpLGkuJG5leHRBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKSwwPT09aS5jdXJyZW50U2xpZGU/KGkuJHByZXZBcnJvdy5hZGRDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJ0cnVlXCIpLGkuJG5leHRBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKSk6aS5jdXJyZW50U2xpZGU+PWkuc2xpZGVDb3VudC1pLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYhMT09PWkub3B0aW9ucy5jZW50ZXJNb2RlPyhpLiRuZXh0QXJyb3cuYWRkQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwidHJ1ZVwiKSxpLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwiZmFsc2VcIikpOmkuY3VycmVudFNsaWRlPj1pLnNsaWRlQ291bnQtMSYmITA9PT1pLm9wdGlvbnMuY2VudGVyTW9kZSYmKGkuJG5leHRBcnJvdy5hZGRDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJ0cnVlXCIpLGkuJHByZXZBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKSkpfSxlLnByb3RvdHlwZS51cGRhdGVEb3RzPWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztudWxsIT09aS4kZG90cyYmKGkuJGRvdHMuZmluZChcImxpXCIpLnJlbW92ZUNsYXNzKFwic2xpY2stYWN0aXZlXCIpLmVuZCgpLGkuJGRvdHMuZmluZChcImxpXCIpLmVxKE1hdGguZmxvb3IoaS5jdXJyZW50U2xpZGUvaS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSkuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikpfSxlLnByb3RvdHlwZS52aXNpYmlsaXR5PWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztpLm9wdGlvbnMuYXV0b3BsYXkmJihkb2N1bWVudFtpLmhpZGRlbl0/aS5pbnRlcnJ1cHRlZD0hMDppLmludGVycnVwdGVkPSExKX0saS5mbi5zbGljaz1mdW5jdGlvbigpe3ZhciBpLHQsbz10aGlzLHM9YXJndW1lbnRzWzBdLG49QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpLHI9by5sZW5ndGg7Zm9yKGk9MDtpPHI7aSsrKWlmKFwib2JqZWN0XCI9PXR5cGVvZiBzfHx2b2lkIDA9PT1zP29baV0uc2xpY2s9bmV3IGUob1tpXSxzKTp0PW9baV0uc2xpY2tbc10uYXBwbHkob1tpXS5zbGljayxuKSx2b2lkIDAhPT10KXJldHVybiB0O3JldHVybiBvfX0pO1xuXHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgICAgICQoJy5iYW5uZXJzLXNsaWRlcicpLnNsaWNrKHtcclxuICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiBjbGFzcz1cInByZXYgYXJyb3dcIj48L2J1dHRvbj4nLFxyXG4gICAgICAgICAgbmV4dEFycm93OiAnPGJ1dHRvbiBjbGFzcz1cIm5leHQgYXJyb3dcIj48L2J1dHRvbj4nLFxyXG4gICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiAxMDI0LFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgLy8gcHJldkFycm93OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgLy8gbmV4dEFycm93OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGF1dG9wbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBhdXRvcGxheVNwZWVkOiAzMDAwLFxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyB7XHJcbiAgICAgICAgICAgIC8vICAgICBicmVha3BvaW50OiA2MDAsXHJcbiAgICAgICAgICAgIC8vICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAvLyAgICAgc2xpZGVzVG9TaG93OiAyLFxyXG4gICAgICAgICAgICAvLyAgICAgc2xpZGVzVG9TY3JvbGw6IDJcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogMzIwLFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIHByZXZBcnJvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIG5leHRBcnJvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFlvdSBjYW4gdW5zbGljayBhdCBhIGdpdmVuIGJyZWFrcG9pbnQgbm93IGJ5IGFkZGluZzpcclxuICAgICAgICAgICAgLy8gc2V0dGluZ3M6IFwidW5zbGlja1wiXHJcbiAgICAgICAgICAgIC8vIGluc3RlYWQgb2YgYSBzZXR0aW5ncyBvYmplY3RcclxuICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgICAgICAkKCcucHJvZHVjdC1zbGlkZXInKS5zbGljayh7XHJcbiAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyDQutCw0YHRgtC+0LzQvdGL0LUg0YLQvtGH0LrQuCjRhtC40YTRgNGLKSBjdXN0b21QYWdpbmc6IChzbGlkZXIsIGkpID0+IGA8YT4ke2kgKyAxfTwvYT5gXHJcbiAgICAgICAgICAgIC8vINC60L7Qu9C+0L3QutC4IHJvd3M6XHJcbiAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgICAgICAgICAgc3BlZWQ6IDQwMCxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiA0LFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogNCxcclxuICAgICAgICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiBjbGFzcz1cInByZXYgYXJyb3dcIj48L2J1dHRvbj4nLFxyXG4gICAgICAgICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIGNsYXNzPVwibmV4dCBhcnJvd1wiPjwvYnV0dG9uPicsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiAxMDI0LFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDQ4MCxcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDMyMCxcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgIHByZXZBcnJvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICBuZXh0QXJyb3c6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gWW91IGNhbiB1bnNsaWNrIGF0IGEgZ2l2ZW4gYnJlYWtwb2ludCBub3cgYnkgYWRkaW5nOlxyXG4gICAgICAgICAgICAgICAgLy8gc2V0dGluZ3M6IFwidW5zbGlja1wiXHJcbiAgICAgICAgICAgICAgICAvLyBpbnN0ZWFkIG9mIGEgc2V0dGluZ3Mgb2JqZWN0XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLlNPTUVjYXRlZ29yeS1zbGlkZXInKS5zbGljayh7XHJcbiAgICAgICAgICAgIHJvd3M6IDIsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIGN1c3RvbVBhZ2luZzogKHNsaWRlciwgaSkgPT4gYDxhPiR7aSArIDF9PC9hPmAsXHJcbiAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgICAgICAgICAgc3BlZWQ6IDYwMCxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogM1xyXG4gICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gIFxyXG4gICAgXHJcbiAgICAvLyAkKGZ1bmN0aW9uKCl7XHJcbiAgICAvLyAgICAgJCgnLnByb2R1Y3QtbGlzdC1leHBlbmQnKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgLy8gICAgICAgICAkKCcucHJvZHVjdC1saXN0JykudG9nZ2xlQ2xhc3MoJ3Byb2R1Y3Qtc2xpZGVyJyk7XHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyB9KTtcclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCIjZmlsdGVyX19yYW5nZVwiKS5zbGlkZXIoe1xyXG4gICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICBtYXg6IDUwMDAwLFxyXG4gICAgICAgICAgIHZhbHVlczogWzI1MDAwLDM1MDAwXSxcclxuICAgICAgICAgICByYW5nZTogdHJ1ZSxcclxuICAgICAgICAgICBzdG9wOiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuICAgICAgICAgICAkKFwiaW5wdXQjcHJpY2VNaW5cIikudmFsKCQoXCIjZmlsdGVyX19yYW5nZVwiKS5zbGlkZXIoXCJ2YWx1ZXNcIiwwKSk7XHJcbiAgICAgICAgICAgJChcImlucHV0I3ByaWNlTWF4XCIpLnZhbCgkKFwiI2ZpbHRlcl9fcmFuZ2VcIikuc2xpZGVyKFwidmFsdWVzXCIsMSkpO1xyXG4gXHJcbiAgICAgICAgIH0sXHJcbiAgICAgICAgIHNsaWRlOiBmdW5jdGlvbihldmVudCwgdWkpe1xyXG4gICAgICAgICAgICQoXCJpbnB1dCNwcmljZU1pblwiKS52YWwoJChcIiNmaWx0ZXJfX3JhbmdlXCIpLnNsaWRlcihcInZhbHVlc1wiLDApKTtcclxuICAgICAgICAgICAkKFwiaW5wdXQjcHJpY2VNYXhcIikudmFsKCQoXCIjZmlsdGVyX19yYW5nZVwiKS5zbGlkZXIoXCJ2YWx1ZXNcIiwxKSk7XHJcbiBcclxuICAgICAgICAgfVxyXG4gICAgICAgfSk7XHJcbiBcclxuICAgICAgICQoXCJpbnB1dCNwcmljZU1pblwiKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICB2YXIgdmFsdWUxPSQoXCJpbnB1dCNwcmljZU1pblwiKS52YWwoKTtcclxuICAgICAgICAgICB2YXIgdmFsdWUyPSQoXCJpbnB1dCNwcmljZU1heFwiKS52YWwoKTtcclxuICAgICAgICAgaWYocGFyc2VJbnQodmFsdWUxKSA+IHBhcnNlSW50KHZhbHVlMikpe1xyXG4gICAgICAgICAgICAgICB2YWx1ZTEgPSB2YWx1ZTI7XHJcbiAgICAgICAgICAgICAgICQoXCJpbnB1dCNwcmljZU1pblwiKS52YWwodmFsdWUxKTtcclxuICAgICAgIFxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICAkKFwiI2ZpbHRlcl9fcmFuZ2VcIikuc2xpZGVyKFwidmFsdWVzXCIsIDAsIHZhbHVlMSk7XHJcbiAgICAgXHJcbiAgICAgICB9KTtcclxuIFxyXG4gICAgICAgJChcImlucHV0I3ByaWNlTWF4XCIpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgIHZhciB2YWx1ZTE9JChcImlucHV0I3ByaWNlTWluXCIpLnZhbCgpO1xyXG4gICAgICAgICAgIHZhciB2YWx1ZTI9JChcImlucHV0I3ByaWNlTWF4XCIpLnZhbCgpO1xyXG4gICAgICAgICAgIGlmICh2YWx1ZTIgPiA1MDAwMCkgeyB2YWx1ZTIgPSA1MDAwMDsgJChcImlucHV0I3ByaWNlTWF4XCIpLnZhbCg1MDAwMCl9XHJcbiAgICAgICAgICAgaWYocGFyc2VJbnQodmFsdWUxKSA+IHBhcnNlSW50KHZhbHVlMikpe1xyXG4gICAgICAgICAgICAgICB2YWx1ZTIgPSB2YWx1ZTE7XHJcbiAgICAgICAgICAgICAgICQoXCJpbnB1dCNwcmljZU1heFwiKS52YWwodmFsdWUyKTtcclxuICAgICBcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgJChcIiNmaWx0ZXJfX3JhbmdlXCIpLnNsaWRlcihcInZhbHVlc1wiLDEsdmFsdWUyKTtcclxuICAgXHJcbiAgICAgICB9KTtcclxuICAgICB9KTtcclxuICAgICQoJy5wcm9kLWRlc2NyaXB0aW9uLXBpY3R1cmVfX2ltZy1tYXgnKS5zbGljayh7XHJcbiAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgIGFycm93czogdHJ1ZSxcclxuICAgICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgICBmYWRlOiB0cnVlLFxyXG4gICAgICBhc05hdkZvcjogJy5wcm9kLWRlc2NyaXB0aW9uLXBpY3R1cmVfX2ltZy1taW4nXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcucHJvZC1kZXNjcmlwdGlvbi1waWN0dXJlX19pbWctbWluJykuc2xpY2soe1xyXG4gICAgICBzbGlkZXNUb1Nob3c6IDQsXHJcbiAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICBpbmZpbml0ZTogZmFsc2UsXHJcbiAgICAgIGFzTmF2Rm9yOiAnLnByb2QtZGVzY3JpcHRpb24tcGljdHVyZV9faW1nLW1heCcsXHJcbiAgICAgIC8vIGFycm93czogdHJ1ZSxcclxuICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiBjbGFzcz1cInByZXZfdXAgYXJyb3cgYXJyb3dfcHJvZHVjdFwiPjwvYnV0dG9uPicsXHJcbiAgICAgIG5leHRBcnJvdzogJzxidXR0b24gY2xhc3M9XCJuZXh0X2Rvd24gYXJyb3cgYXJyb3dfcHJvZHVjdFwiPjwvYnV0dG9uPicsXHJcbiAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICB2ZXJ0aWNhbDogdHJ1ZSxcclxuICAgICAgdmVydGljYWxTd2lwaW5nOiB0cnVlLFxyXG4gICAgICAvLyBjZW50ZXJNb2RlOiB0cnVlLFxyXG4gICAgICBmb2N1c09uU2VsZWN0OiB0cnVlXHJcbiAgICB9KTtcclxuXHJcblxyXG5cclxuICAgIC8vINCb0LDQudC6XHJcblxyXG4gICAgJCgnLmJ0bi1saWtlJykub24oJ2NsaWNrJyxmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdDtcclxuICAgICAgICAkKCcuZmEtaGVhcnQnKS50b2dnbGVDbGFzcygnZmFzJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQmtCw0YLQtdCz0L7RgNC40LhcclxuICAgICQoJy5oZWFkZXJfX2NhdGFsb2ctYnRuJykub24oJ2NsaWNrJyxmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdDtcclxuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdoZWFkZXJfX2NhdGFsb2ctYnRuX2FjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vINCQ0LrQutC+0YDQtNC10L7QvdCxINGB0LDQudC00LHQsNGALdGE0LjQu9GM0YLRgFxyXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAkKCcudGFiLWhlYWRlcicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnY29sbGFwc2UtYnRuX19hY3RpdmUnKS5uZXh0KCkuc2xpZGVUb2dnbGUoKTtcclxuICAgICAgICAgICAgLy8gJCgnLnRhYi1oZWFkZXInKS5ub3QodGhpcykucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlLWJ0bl9fYWN0aXZlJykubmV4dCgpLnNsaWRlVXAoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vICQoJy5maWx0ZXJfX21vcmUnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gICAgICQoJy5jdXN0b20tY2hlY2tib3gnKS50b2dnbGVDbGFzcygnY3VzdG9tLWNoZWNrYm94X19hY3RpdmUnKTtcclxuICAgICAgICAvLyAgICAgLy8gJCgnLnRhYi1oZWFkZXInKS5ub3QodGhpcykucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlLWJ0bl9fYWN0aXZlJykubmV4dCgpLnNsaWRlVXAoKTtcclxuICAgICAgICAvLyB9KTtcclxuXHJcblxyXG4gICAgICAgICQoJy5idG5fX21vcmUnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykucHJldigpLnRvZ2dsZUNsYXNzKCdmaWx0ZXJfX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAvLyAkKCcudGFiLWhlYWRlcicpLm5vdCh0aGlzKS5yZW1vdmVDbGFzcygnY29sbGFwc2UtYnRuX19hY3RpdmUnKS5uZXh0KCkuc2xpZGVVcCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBidXR0b24gcXVhbnRpdHlcclxuXHJcbiAgICAkKCcuYWRkJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKHRoaXMpLnByZXYoKS52YWwoKSA8IDEwKSB7XHJcbiAgICAgICAgJCh0aGlzKS5wcmV2KCkudmFsKCskKHRoaXMpLnByZXYoKS52YWwoKSArIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJCgnLnN1YicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCh0aGlzKS5uZXh0KCkudmFsKCkgPiAxKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykubmV4dCgpLnZhbCgpID4gMSkgJCh0aGlzKS5uZXh0KCkudmFsKCskKHRoaXMpLm5leHQoKS52YWwoKSAtIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyDQodC80LXQvdGP0Y7RidCw0Y/RgdGPXHJcblxyXG4gICAgJCgnLmJ0bl9jaGFuZ2UnKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgICAkKHRoaXMpLnRleHQoZnVuY3Rpb24oaSwgdGV4dCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRleHQgPT09IFwi0J/QvtC60LDQt9Cw0YLRjCDQtdGJ0LVcIiA/IFwi0KHQutGA0YvRgtGMXCIgOiBcItCf0L7QutCw0LfQsNGC0Ywg0LXRidC1XCI7XHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAkKCcuYnRuX2Jhc2tldCcpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcykudGV4dChmdW5jdGlvbihpLCB0ZXh0KSB7XHJcbiAgICAgICAgICByZXR1cm4gdGV4dCA9PT0gXCLQkiDQutC+0YDQt9C40L3Rg1wiID8gXCLQo9C00LDQu9C40YLRjCDQuNC3INC60L7RgNC30LjQvdGLXCIgOiBcItCSINC60L7RgNC30LjQvdGDXCI7XHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG4gICAgLy8gdmFyIHJhdGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGFyJyksXHJcbiAgICAvLyAgICAgcmF0aW5nSXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGFyLWl0ZW0nKTtcclxuXHJcbiAgICAvLyByYXRpbmcub25jbGljayA9IGZ1bmN0aW9uKGUpe1xyXG4gICAgLy8gICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcbiAgICAvLyAgIGlmKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3N0YXItaXRlbScpKXtcclxuICAgIC8vICAgICByZW1vdmVDbGFzcyhyYXRpbmdJdGVtLCdhY3RpdmUnKVxyXG4gICAgLy8gICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgIC8vICAgfVxyXG4gICAgLy8gfTtcclxuXHJcbiAgICAvLyBmdW5jdGlvbiByZW1vdmVDbGFzcyhlbGVtZW50cywgY2xhc3NOYW1lKSB7XHJcbiAgICAvLyAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIC8vICAgICAgZWxlbWVudHNbaV0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9O1xyXG4gICAgLy8gY29uc3QgY2lyY2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJhdGluZy1yaW5nX19jaXJjbGUnKTtcclxuICAgIC8vIGNvbnN0IHJhZGl1cyA9IGNpcmNsZS5yLmJhc2VWYWwudmFsdWU7XHJcbiAgICAvLyBjb25zdCBjaXJjdW1mZXJlbmNlID0gMiAqIE1hdGguUEkgKiByYWRpdXM7XHJcblxyXG4gICAgLy8gY2lyY2xlLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBjaXJjdW1mZXJlbmNlO1xyXG4gICAgLy8gY2lyY2xlLnN0eWxlLnN0cm9rZURhc2hhcnJheSA9IGNpcmN1bWZlcmVuY2U7XHJcblxyXG5cclxuICAgIC8vIGZ1bmN0aW9uIHNldFByb2dyZXNzKHBlcmNlbnQpIHtcclxuICAgIC8vICAgICBjb25zdCBvZmZzZXQgPSBjaXJjdW1mZXJlbmNlIC0gcGVyY2VudCAvIDEwMCAqIGNpcmN1bWZlcmVuY2U7XHJcbiAgICAvLyAgICAgY2lyY2xlLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBvZmZzZXQ7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gc2V0UHJvZ3Jlc3MoNjQpO1xyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpNC40LrRgdC40YDQvtCy0LDQvdC90YvQuSDRhdC10LTQtdGAXHJcbiAgICAgKi9cclxuXHJcbiAgICAvLyAkKHdpbmRvdykub24oJ3Njcm9sbCcsIHRvZ2dsZUZpeGVkSGVhZGVyKTtcclxuXHJcbiAgICAvLyBmdW5jdGlvbiB0b2dnbGVGaXhlZEhlYWRlcigpIHtcclxuICAgIC8vICAgICBjb25zdCAkaGVhZGVyID0gJCgnLmhlYWRlcicpO1xyXG4gICAgLy8gICAgIGNvbnN0ICRtYWluID0gJCgnLmhlYWRlcicpLm5leHQoKTtcclxuXHJcbiAgICAvLyAgICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCA+IDApIHtcclxuICAgIC8vICAgICAgICAgJGhlYWRlci5hZGRDbGFzcygnaXMtZml4ZWQnKTtcclxuICAgIC8vICAgICAgICAgJG1haW4uY3NzKHsgbWFyZ2luVG9wOiAkaGVhZGVyLm91dGVySGVpZ2h0KCkgfSk7XHJcbiAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnaXMtZml4ZWQnKTtcclxuICAgIC8vICAgICAgICAgJG1haW4uY3NzKHsgbWFyZ2luVG9wOiAwIH0pO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuXHJcblxyXG5cclxuXHJcbjtcclxuXHJcbn0pO1xyXG4iXSwiZmlsZSI6ImludGVybmFsLmpzIn0=

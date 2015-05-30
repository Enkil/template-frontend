# Шаблон Front-End проектов

Репозиторий, служащий шаблоном для начала работ над Front-End проектами

Компиляция и сборка осуществляется с помощью Gulp

## Требования

Для корректной работы шаблона в системе должны быть глобально установлены `bower` и `nodejs` (вместе с `npm`)

- [Установка Nodejs](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager "Installing Node.js via package manager")
- [Установка Bower](http://bower.io/#install-bower "Install Bower")

## Установка шаблона

``` sh
$ git clone https://github.com/Enkil/template-frontend.git app-name
$ cd app-name
$ npm i -d
$ bower install
```

По окончанию выполнения будут установлены все необходимые пакеты и их зависимости.
По умолчанию в шаблоне устанавливается и подключается Bootstrap 3 и Bootstrap Material Design. Однако, шаблон не накладывает никаких ограничений и не навязывает использование определенных фреймворков - с помощью `bower` можно установить/удалить нужные пакеты.

## Компиляция с помощью Gulp

После установки шаблона можно приступать к работе над проектом.

### Задачи Gulp
 
 - `$ gulp html` - сборка HTML проекта с использованием простейшией шаблонизации.
 - `$ gulp js` - сборка JavaScript проекта
 - `$ gulp less` - компилиция Less
 - `$ gulp images` - оптимизация изображений
 - `$ gulp svg` - оптимизация SVG
 - `$ gulp png-sprite` - создание PNG-спрайта
 - `$ gulp svg-sprite` - создание SVG-спрайта
 - `$ gulp fonts` - копирование файлов шрифтов
 - `$ gulp clean` - очистка каталога `build/`
 - `$ gulp webserver` - запуск локального веб-сервера для livereload и синхронного тестирования в разных браузерах
 - `$ gulp gh-pages`- размещение скомпилированного проекта на Github Pages
 - `$ gulp build` - полная сборка проекта
 - `$ gulp watch` - запуск задачи `webserver` и отслеживания изменений
 - `$ gulp default` - запуск задачи `watch`
 
## Общая концепция

- `src/` - каталог для размещения рабочих файлов (html-шаблоны, less-файлы, файлы и библиотки js, изображения для сборки в спрайты и т.д.)
- `build/` - каталог для размещения скомпилированной верстки
- `design/` - каталог для локального хранения файлов макета. Содержимое не отслеживается в Git и не будет в последствии залито в репозиторий

Вся работа осуществляется в каталоге `src/`. В каталоге `build/` никакие изменения напрямую в файлы не вносятся.
Back-End разработчикам и/или Заказчиками передается содержимое каталога `build/` или предоставляется доступ к репозиторию проекта.

## Концепции работы

### HTML-разметка

Задача `$ gulp html`

Страницы, которые необходимо сверстать размещаются в корне каталога `src/` (пример index.html)  
Файлы html повторяющихся блоков (например, общий header, footer, модальные окна и т.д.) размещаются в каталоге `src/html-blocks/` :
- `src/html-blocks/common` - файлы html-блоков, использующиеся на всех страницах сайта
- `src/html-blocks/common/modals` - файлы html модальных окон, использующихся на всех страницах сайта
- `src/html-blocks/pages--external` - файлы html-блоков, внешних страниц сайта (страниц, доступных любому пользователю без авторизации на сайте)
- `src/html-blocks/pages--internal` - файлы html-блоков, внутренних страниц сайта (страниц, доступных залогиненному пользователю - например, страницы раздела "Личный кабинет")

При необходимости внутри данных каталогов можно вводить дополнительную структуру, при этом сборка html пройдет корректно.  

Для указания того содержимое какого файла необходимо вставить используется конструкция вида  
```sh
<!--build:include html-blocks/pages--external/file-name.html-->
This will be replaced by the content of html-blocks/pages--external/file-name.html
<!--/build-->
```
- содержимое файла `file-name.html` будет вставлено на место данного блока
 
Допускается использование вложенности, то есть в одном файле, содержащим код html-разметки блока, можно вызвать содержимое другого файла с блоком разметки.  
При этом необходимо учитывать правильное написание пути к файлу.  

Например,  
В файле `src/html-blocks/pages-external/header--external.html` мы хотим вызвать содержимое файла `src/html-blocks/common/modals/login.html`  
В таком случае вызов пишеться так  

 ```sh
 <!--build:include ../common/modals/login.html-->
 This will be replaced by the content of ../common/modals/login.html
 <!--/build-->
 ```
 
### Компиляция Less

Задача `$ gulp less`

Файл `src/styles/styles.less` является диспетчером подключений для всех прочих less-файлов.  
Секция `Third party` предназначена для подключения less/css файлов сторонних библиотек и фреймворков.  
Секция `Custom` - для подключения собственных файлов стилей.

При компиляции происходит объединение всех файлов, компиляция в CSS, форматирование стиля кодирования, добавление вендорных префиксов, минификация и запись sourcemaps.
Итоговые файлы стилевых таблиц помещаются в каталог `build/css` (style.css, style.min.css, style.min.css.map)

Для упрощения навигации при работе над крупными проектами предполагается структура размещения исходных файлов схожая с html-блоками.

### Компиляция JavaScript

Задача `$ gulp js`

Файл `src/js/vendor.js` является диспетчером подключений js файлов сторонних библиотек и фреймворков.  
Файл `src/js/custom.js` является диспетчером подключений собственных js файлов.

При компиляции происходит объединение всех файлов, проверка на наличие ошибок (при этом исключаются из проверки файлы сторонних библиотек и проверяются только те, что написаны нами), минификация и запись sourcemaps.
Итоговый файл помещается в каталог `build/js` (main.js, main.min.js, main.min.js.map)

Для упрощения навигации при работе над крупными проектами предполагается структура размещения исходных файлов схожая с html-блоками.

### Оптимизация изображений

Задача `$ gulp images`

Все контентные изображения, а также любые изображения, которые не должны быть объединены в спрайт, необходимо помещать в каталог `src/img/images`.  
При выполнении задачи все изображения из этого каталога оптимизируются.  
Итоговые файлы помещаются в каталог `build/img/images/`

### Оптимизация SVG

Задача `$ gulp svg`

Все SVG изображения, которые не должны быть объединены в спрайт, необходимо помещать в каталог `src/img/svg`.  
При выполнении задачи все SVG из этого каталога оптимизируются.  
Итоговые файлы помещаются в каталог `build/img/svg/`

### Создание PNG-спрайта

Задача `$ gulp png-sprite`

Все изображения, которые необходимо собрать в спрайт (например, png-файлы иконок) необходимо помещать в каталог `src/img/sprites/png`.  
Итоговый спрайт будет оптимизирован и помещен в каталог `build/img/sprites/png/png-sprite.png`.  
Также будет создан или дополнен файл `src/styles/common/_png-sprite.less`, содержащий примеси (mixins) для вызова изображений спрайта.  
Имя примеси (mixin) всегда выглядит как `@sprite-filename`, где filename - имя изображения, добавленного к спрайту.

Пример работы с спрайтом и его стилями.

- Размещаем png-изображение иконки в каталоге `src/img/sprites/png/html5.png`
- Запускаем задачу `$ gulp png-sprite`
- Создаем файл `src/styles/common/icons.less`
- В нем создаем следующие CSS-классы:

``` sh
.png-sprite{
  &:before{
    content: '';
    display: inline-block;
  }

  &--html5:before{
    .sprite(@sprite-html5);
  }
}
```

- Файл `src/styles/common/icons.less` подключаем в `src/styles/style.less` с помощью конструкции `@import` (`@import "common/icons.less";`)
- После компиляции less (запускаем задачу `$ gulp less`)получаем следующий CSS код

``` sh
.png-sprite:before
{
    display: inline-block;

    content: '';
}
.png-sprite--html5:before
{
    width: 24px;
    height: 24px;

    background-image: url(../img/sprites/png/png-sprite.png);
    background-position: 0 0;
}
```

- html-тегу, около которого надо разместить иконку, добавляем CSS-классы `png-sprite png-sprite--html5`

Пример: `<h2 class="png-sprite png-sprite--html5">Test PNG sprite</h2>`

Работа с спрайтом в таком случае сводится к добавлению нужных изображений в каталог `src/img/sprites/png`  
и созданию CSS-класса, в котором вызывается примесь (mixin), созданная при генерации спрайта.  
Вы можете использовать примеси (mixins) и по другому, вызывая изображения с спрайта, не в псевдоэлементе :before

Итого, для добавления в спрайт и генерации сопутствующего Less/CSS-кода изображений необходимо
- добавить в каталог `src/img/sprites/png` изображение (html5.png)
- запустить задачу `$ gulp png-sprite`

#### Создание Retina-ready спрайта

Для создания PNG-спрайта адаптированного под Retina-экраны и экраны повышенной плотности, необходимо в каталог  
`src/img/sprites/png` поместить файл изображения вдвое большего размера, чем он должен отображаться. Имя файла обязательно  
должно содержать постфикс -2x (`filename-2x.png`).  
Обязательным условием для корректной работы является наличие двух файлов изображений для одной иконки (например, html5.png и html5-2x.png).  
В результате генерации спрайта создается спрайт `build/img/sprites/png-sprite-2x.png` и переменная вида `@sprite-filename-group`,  
(например, `@sprite-html5-group`).  
Для вызова данной переменной (mixin) необходимо использовать примесь (mixin) `.retina-sprite()`  
Например, `.retina-sprite(@sprite-html5-group)`

Пример файла icons.less:

``` sh
.png-sprite{
  &:before{
    content: '';
    display: inline-block;
  }

  &--html5:before{
    .sprite(@sprite-html5);
  }

  &--html5-retina:before{
    .retina-sprite(@sprite-html5-group)
  }
}
```

Пример использования в разметке

``` sh
<h2 class="png-sprite png-sprite--html5-retina">Test Retina-ready PNG sprite</h2>
```

Итого, для добавления в спрайт и генерации сопутствующего Less/CSS-кода Retina изображений необходимо
- добавить в каталог `src/img/sprites/png` два изображения - обычное и вдвое большее, отличающиеся в названии постфиксом -2x (html5.png, html5-2x.png)
- запустить задачу `$ gulp png-sprite`

### Создание SVG-спрайта

Задача `$ gulp svg-sprite`

Все SVG, которые необходимо собрать в спрайт (например, svg-файлы иконок) необходимо помещать в каталог `src/img/sprites/svg`.  
Итоговый спрайт будет оптимизирован и помещен в каталог `build/img/sprites/svg/svg-sprite.svg`, при этом будет создан дополнительный спрайт  
`build/img/sprites/svg/svg-sprite.png` для отображения в браузерах не поддерживающих SVG.  
Также будет создан или дополнен файл `src/styles/common/_svg-sprite.less`, содержащий CSS-классы для вызова изображений спрайта.  
Имя CSS-класса всегда выглядит как `@svg-sprite-filename`, где filename - имя изображения, добавленного к спрайту.

Пример работы с SVG-спрайтом и его стилями.

- Размещаем svg-изображение иконки в каталоге `src/img/sprites/svg/html5.svg`
- Запускаем задачу `$ gulp svg-sprite`
- Создаем файл `src/styles/common/svg-icons.less`
- В нем создаем следующие CSS-классы:

``` sh
.svg-sprite{
  &:before{
    content: '';
    display: inline-block;
    width: 32px!important;
    height: 32px!important;
    background-size: contain!important;
  }

  &--html5-icon:before{
    .svg-sprite--html5(); // CSS-класс, созданный при генерации SVG-спрайта.
  }

}
```

- Файл `src/styles/common/svg-icons.less` подключаем в `src/styles/style.less` с помощью конструкции `@import` (`@import "common/svg-icons.less";`)
- После компиляции less (запускаем задачу `$ gulp less`) получаем следующий CSS код

``` sh
.svg-sprite--html5
{
    width: 47px;
    height: 47px;

    background-image: url('../img/sprites/svg/svg-sprite.svg');
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 47px 47px;
}
.no-svg .svg-sprite--html5
{
    background-image: url('../img/sprites/svg/svg-sprite.png');
}


.svg-sprite:before
{
    display: inline-block;

    width: 32px!important;
    height: 32px!important;

    content: '';

    background-size: contain!important;
}
.svg-sprite--html5-icon:before
{
    width: 47px;
    height: 47px;

    background-image: url('../img/sprites/svg/svg-sprite.svg');
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 47px 47px;
}
.no-svg .svg-sprite--html5-icon:before
{
    background-image: url('../img/sprites/svg/svg-sprite.png');
}
```

- html-тегу, около которого надо разместить иконку, добавляем CSS-классы `svg-sprite svg-sprite--html5-icon`

Пример: `<h2 class="svg-sprite svg-sprite--html5-icon">Test SVG sprite</h2>`

Работа с SVG-спрайтом в таком случае сводится к добавлению нужных SVG в каталог `src/img/sprites/svg`  
и созданию CSS-класса, в котором вызывается в качестве примеси (mixin) CSS-класс, созданный при генерации спрайта.  
Вы можете использовать CSS-классы, созданные при генерации спрайта и по другому, вызывая изображения с спрайта, не в псевдоэлементе :before

Итого, для добавления в спрайт и генерации сопутствующего Less/CSS-кода изображений необходимо
- добавить в каталог `src/img/sprites/svg` изображение (html5.svg)
- запустить задачу `$ gulp svg-sprite`

### Обработка файлов шрифтов

Задача `$ gulp fonts`

Файлы используемых шрифтов необходимо размещать в каталоге `src/styles/fonts`.  
При обработке шрифты будут скопированы в каталог `build/css/fonts`.  
Важно корректно прописать к ним пути в файле Less, описывающим типографику.

### Очистка каталога сборки

Задача `$ gulp clean`

При выполнении задачи полностью удаляется содержимое каталога `build/` за исключением файла `build/.gitignore`

### Полная сборка проекта

Задача `$ gulp build`

При запуске задачи последовательно выполняются задачи  `clean`, `html`, `js`, `less`, `images`, `png-sprite`, `svg-sprite`, `svg`, `fonts`, `gh-pages`.  
В итоге выполнения в каталоге `build/` формируется полная сборка проекта с нуля.

### Livereload и синхронизация между браузерами

Задача `$ gulp webserver`

При выполнении задачи запускается локальный веб-сервер BrowserSync и открыватся index.html проекта.  

[Подробнее о BrowserSync](http://www.browsersync.io/ "Подробнее о BrowserSync")  

Сервер использует каталог `build/` в качестве корня проекта.

При запуске формируются следующие данные:

``` sh
[App Front-End] Access URLs:
 ----------------------------------------------
       Local: http://localhost:9000 // локальный URL проекта
    External: http://192.168.0.100:9000 // внешний (в пределах локальной сети) URL проекта (по нему можно открыть на других устройствах в той же сети)
      Tunnel: https://iuvrvzmmli.localtunnel.me // Туннель - защищенный уникальный URL, можно дать человеку на другом конце мира и он также будет видеть все обновления в реальном времени
 ----------------------------------------------
          UI: http://localhost:3001 // локальный URL WebUI BrowserSync
 UI External: http://192.168.0.100:3001 // внешний (в пределах сети) URL WebUI BrowserSync
 ----------------------------------------------
[App Front-End] Serving files from: ./build // корень проекта для BrowserSync
```

### Публикация на Github Pages

Задача `$ gulp gh-pages`

При запуске задачи будет создана ветка gh-pages и в нее залито текущее состояние каталога `build/`.

[Подробнее о GitHub Pages](https://pages.github.com/ "GitHub Pages")

### Отслеживание изменений

Задача `$ gulp watch`

При запуске сначала выполняется задача `$ gulp webserver`, затем при изменении или добавлении в каталоге `src/` каких  
либо файлов, автоматически запускается соответсвующая задача по их обработке.

### Настройки шаблона

В файле `gulpfile.js` в секции Settings в разделе Path settings задаются  
пути к каталогам размещения обработанных файлов (итогов сборки), исходных файлов и путей для отслеживания изменений.

Рекомендуется изменять пути и целевые файлы только через этот раздел, при необходимости дополняя его новыми переменными.



## [Igor Timohin, Front-End template](http://enkil.github.io/template-frontend/ "Igor Timohin, Front-End template")
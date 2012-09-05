---
layout: post
title: "US Visa: Мое первое приложение для iPhone"
language: russian
date: 2012-09-05 21:00
comments: true
categories: 
- article
- ios
- iphone
- project
- russian
- usvisa
---
Почему, собственно?
-------------------

Имея Mac и iPhone, не попытаться написать мобильное приложение? Как-то неправильно. Благо тут подвернулась задачка, которая прекрасно легла в тему, как весьма полезная и в то же время не очень сложная в реализации. Итак, я погрузился в Objective-C и Cocoa.

Disclaimer
----------

Прошу помнить, что не только мое первое приложение для iOS, но и первое приложение на Objective-C в принципе. Ни разу не претендую ни качество реализации, ни на эффективность, но хочу сказать, что получился весьма целостный несложный пример, который дает представление об Objective-C и разработке под iOS в целом. Особенно для тех, кто вообще этот язык не знает.

Disclaimer 2
------------

Данный пост был изначально опубликован в виде статьи в журнале «The Pragmatic Bookshelf Magazine» на английском языке -- [US Visa: My First iPhone App][]. Русская версия, публикуемая здесь, не является точным переводом журнальной версии, так как была написана как отдельный текст несколько позже.

[US Visa: My First iPhone App]: http://pragprog.com/magazines/2012-09/us-visa-my-first-iphone-app/

«Хьюстон! У нас проблема!»
--------------------------

За последний год я несколько раз вынужден был подавать на американскую визу в посольстве в Лондоне. Каждый раз мне говорили, что конкретно в моем случае требуется «administrative processing». Документы то у тебя принимают, но потом вместо визы дают номерок (batch number) и говорят периодически заглядывать на их сайт, где есть PDF-ка, в которой по данному номеру следует искать указания, что делать дальше (досылать еще документы, посылать паспорт и т.д.). Нажимаешь на [ссылку][US embassy PDF], открывается файл, жмешь CTRL-F, вводишь номер (batch number) и вперед.

[US embassy PDF]: http://photos.state.gov/libraries/unitedkingdom/164203/cons-visa/admin_processing_dates.pdf

Возникла идея автоматизации -- сделать приложение для айфона, в которое может вбить номер заявки один раз, и затем одним нажатием на кнопку получать статус обработки визы. Приложение должно уметь скачивать PDF файл, парсить его и вычленять данные по заявке.

Что делать, если у меня Windows?
--------------------------------

Не все еще потеряно. Objective-C можно запустить на Windows через Cygwin или MinGW. Более того, проект [GNUstep][] дает возможность использовать библиотеки AppKit и Foundation для написания графических программ в Windows на Objective-C. Увы, я не буду погружаться столь глубоко в этой статье. Мы сделаем только приложение, работающее в командной строке. Оно будет уметь скачивать PDF и парсить его. Собрать приложение можно будет и на Windows, и на Маке. После, мы практически без изменений будем использовать модули этого приложения для создания полноценной программы для iOS. Но, увы, это уже только для владельцев Маков. Можно, конечно, Хакинтош на виртуалку поставить и гонять приложение на симуляторе айфона в Xcode, но вот загрузить его в реальный айфон вряд ли получится без настоящего Мака.

[GNUstep]: http://www.gnustep.org/

Установка GNUstep под Windows
-----------------------------

Я нашел два великолепныx поста:

* «[Learn Objective-C on Windows][]» -- Как поставить GNUstep и попробовать минимальное приложение.
* «[Clang and Objective-C on Windows][]» -- Как собрать свежий компилятор Clang под Windows. К сожалению, GCC, идущий на данный момент с GNUstep, не поддерживает уровня языка Objective-C, требуемого Apple'ом. К тому же, Apple полностью переключился на Clang с некоторого времени. Так что, надо собирать Clang, так как установщика под Windows у него пока нет. Я просто следовал один в один инструкциям из поста, и все встало без проблем.

[Learn Objective-C on Windows]: http://solarianprogrammer.com/2011/09/14/learn-objective-c-on-windows/
[Clang and Objective-C on Windows]: http://solarianprogrammer.com/2012/03/21/clang-objective-c-windows/

Неплохо было бы познакомиться с Objective-C и iOS API
-----------------------------------------------------

Я про Objective-C не знал ничего, кроме слухов о его необычном подходе к управлению памятью, поэтому пришлось пролистать следующие книжки.

**Предупреждение**: *Ссылки снизу содержат мой личный номер партнерской программы с Амазоном. От возможных покупок, совершенных после перехода по этим ссылкам, я могу получить небольшой процент. Если вас это не устраивает, пожалуйста, не нажимайте на ссылки, или вручную «почистите» URL через cut-paste. Спасибо за понимание.*

1\. <a href="http://www.amazon.co.uk/gp/product/B007OWBAB0/ref=as_li_qf_sp_asin_tl?ie=UTF8&amp;tag=prodiy-21&amp;linkCode=as2&amp;camp=1634&amp;creative=6738&amp;creativeASIN=B007OWBAB0">iOS Programming: The Big Nerd Ranch Guide, 3/e (Big Nerd Ranch Guides)</a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=B007OWBAB0" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

<a href="http://www.amazon.co.uk/gp/product/B007OWBAB0/ref=as_li_qf_sp_asin_il?ie=UTF8&amp;tag=prodiy-21&amp;linkCode=as2&amp;camp=1634&amp;creative=6738&amp;creativeASIN=B007OWBAB0"><img border="0" src="http://ws.assoc-amazon.co.uk/widgets/q?_encoding=UTF8&amp;Format=_SL160_&amp;ASIN=B007OWBAB0&amp;MarketPlace=GB&amp;ID=AsinImage&amp;WS=1&amp;tag=prodiy-21&amp;ServiceVersion=20070822" ></a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=B007OWBAB0" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

2\. <a href="http://www.amazon.co.uk/gp/product/0321706285/ref=as_li_qf_sp_asin_tl?ie=UTF8&amp;tag=prodiy-21&amp;linkCode=as2&amp;camp=1634&amp;creative=6738&amp;creativeASIN=0321706285">Objective-C Programming: The Big Nerd Ranch Guide (Big Nerd Ranch Guides)</a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=0321706285" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

<a href="http://www.amazon.co.uk/gp/product/0321706285/ref=as_li_qf_sp_asin_il?ie=UTF8&amp;tag=prodiy-21&amp;linkCode=as2&amp;camp=1634&amp;creative=6738&amp;creativeASIN=0321706285"><img border="0" src="http://ws.assoc-amazon.co.uk/widgets/q?_encoding=UTF8&amp;Format=_SL160_&amp;ASIN=0321706285&amp;MarketPlace=GB&amp;ID=AsinImage&amp;WS=1&amp;tag=prodiy-21&amp;ServiceVersion=20070822" ></a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=0321706285" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

3\. <a href="http://www.amazon.co.uk/gp/product/B006GFZ288/ref=as_li_qf_sp_asin_tl?ie=UTF8&amp;tag=prodiy-21&amp;linkCode=as2&amp;camp=1634&amp;creative=6738&amp;creativeASIN=B006GFZ288">Programming in Objective-C (4th Edition) (Developer's Library)</a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=B006GFZ288" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

<a href="http://www.amazon.co.uk/gp/product/B006GFZ288/ref=as_li_qf_sp_asin_il?ie=UTF8&amp;tag=prodiy-21&amp;linkCode=as2&amp;camp=1634&amp;creative=6738&amp;creativeASIN=B006GFZ288"><img border="0" src="http://ws.assoc-amazon.co.uk/widgets/q?_encoding=UTF8&amp;Format=_SL160_&amp;ASIN=B006GFZ288&amp;MarketPlace=GB&amp;ID=AsinImage&amp;WS=1&amp;tag=prodiy-21&amp;ServiceVersion=20070822" ></a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=B006GFZ288" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

А еще есть один волшебный бесплатный документ --  «[From C++ to Objective-C][]».

[From C++ to Objective-C]: http://pierre.chachatelier.fr/programmation/fichiers/cpp-objc-en.pdf

Итак, задача делится на три основные части:

- Парсер PDF
- Скачивалка PDF (желательно ее сделать без привязки к интерфейсу)
- Интерфейс под iOS

После ознакомления с Objective-C, могу сказать, что для более менее опытного разработчика на C или C++, особенно, если есть опыт разработки UI (я в свое время много возился с Delphi/C++Builder), «въехать» в Objective-C и Cocoa несложно. Достаточно сфокусироваться на весьма необычной полу-ручной модели управления памятью (особенно после RAII в C++ и сборщика мусора в Java). Objective-C сам управляет памятью, но вот контроль за подсчетом ссылок на объекты для их правильного освобождения лежит на вас. Надо понять принцип, иначе утечки памяти неизбежны. У меня именно так и было в начале. Благо отличные инструменты профилировки в Xcode позволяют основные проблемы выявлять практически сразу.

Ниже я приведу несколько личных субъективных впечатлений, как новичка в Objective-C и Cocoa. Вряд ли это будет интересно, если вы уже имеете опыт в них, но вот если нет -- думаю, будет интересно.

Для начала интересно посмотреть, как в Objective-C формируются имена функций-членов класса. Это почти как человеческий язык. Если я по-английски скажу «please, find a needle in a portion of some data and add the result to a list implemented as a mutable array», в Objective-C это будет:

``` objective-c
+ (bool)findInPortion:(NSMutableData *)someData 
               needle:(NSString*)aNeedle
             andAddTo:(NSMutableArray*)aList {
   ...
}
```

Если прочитать этот код слева направо сверху вниз, то получается почти полноценное предложение. Формально, полное имя этого метода - `findInPortion:needle:andAddTo:`. Аргументы именованы, и их имена являются частью полного имени метода. Если правильно давать имена переменных аргументов (`someData`, `aNeedle` and `aList`), то можно фактически писать по-английски. Конечно, это все довольно «многословный» подход, но фантастическая система предсказания в Xcode при наборе кода позволяет быстро и просто набивать все эти обороты. Обратите внимание также, что традиционное выравнивание при разбивке длинных строк происходит по двоеточию, разделяющему формальное имя параметра от переменной, его представляющей.

В Objective-C нетрадиционный синтаксис для вызова методов. Например, вместо:

``` objective-c
NSMutableArray* list = NSMutableArray.alloc.init;
```

пишется:

``` objective-c
NSMutableArray* list = [[NSMutableArray alloc] init];    
```

Выглядит странно, но это вопрос привычки. Опять таки, система предсказания кода при вводе позволяет вводить квадратные скобки даже почти физически не набивая их.

Objective-C и Cocoa используют активно несколько шаблонов программирования, которые просто необходимо освоить. Например, делегаты. Они везде в Cocoa. Делегат -- это класс, содержащий в себе обратные вызовы. Вместе передачи пачки отдельных функций или методов, просто передается один объект, реализующий все требуемые обратные вызовы. Например, я использовал стандартный класс [NSURLConnection][] для скачивания PDF'ки. Этот класс требует предоставление ему делегата [NSURLConnectionDelegate][], методы которого вызываются при различных событиях в процессе скачивания.

[NSURLConnection]: https://developer.apple.com/library/mac/#documentation/Cocoa/Reference/Foundation/Classes/nsurlconnection_Class/Reference/Reference.html
[NSURLConnectionDelegate]: https://developer.apple.com/library/mac/#documentation/Foundation/Reference/NSURLConnectionDelegate_Protocol/Reference/Reference.html#//apple_ref/occ/intf/NSURLConnectionDelegate

Итак, пара недель вечерних бдений за книгами, и я набросал остов моего первого приложения. Но это была только первая часть марлезонского балета. Далее надо было разобраться с форматом PDF.

Парсер PDF
----------

Как уже было сказано, файл, содержащий информацию из посольства, в формате PDF. Описание этого формата доступно на [сайте Adobe][PDF manuals are available online]. Я использовал документ «[PDF Reference third edition, Version 1.4][]».

[PDF manuals are available online]: http://www.adobe.com/devnet/pdf/pdf_reference_archive.html
[PDF Reference third edition, Version 1.4]: http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/pdf/pdfs/pdf_reference_archives/PDFReference.pdf

Разбор PDF у меня реализован весьма кондово. Так как данные приходят порциями, то мы будем анализировать документ по частям, последовательно. Каждую новую порцию данных добавляем в буфер и пытаемся в нем разобрать формат PDF. Сначала ищем фрагменты, обрамленные в маркеры `stream` и `endstream`. Содержимое каждого такого блока «разжимаем» через `zlib/inflate`. После это уже чистый текст, и мы в нем ищем наш batch number, конечно, с учетом языка разметки PDF. Если номер обнаружен, то печатаем его и переходим к следующему блоку. 

Основные шаги парсера:

1\. Если в данных, принятых на текущий момент, есть блок, ограниченных тегами `stream\r\n` и `endstream\r\n`, то вырезаем его из буфера и «разжимаем» через `zlib/inflate`.

2\. Разжатый на первом шаге блок являет текстовым. Нам надо найти в нем фрагменты, обрамленные тегами `BT\r\n` (Begin Text) и `ET\r\n` (End Text). Находим все такие блоки и объединяем их в список строк.

3\. Внутри каждой строки, найденной на шаге 2, удаляем подстроки, неокруженные круглыми скобками. Все что вокруг круглых скобок -- это служебная информация, и она нам не нужна.

4\. Итак, мы вычленили чистый текст из PDF'ки. Логически информация в этом файле организована в виде таблицы с тремя колонками: номер заявки (batch number), статус и дата. Увы, среди этого еще попадаются колонтитулы страниц. Чтобы их отсеить, мы будем смотреть, что если текущая строка выглядит как batch number (11 цифр), то за ней обязательно идет строка-статус и строка-даты. Берем их и снова ждем нового batch number'а.

Как я уже сказал, разбор заточен под конкретный файл, и если в посольстве его изменят, то все сломается. Если хотя бы использовать регулярные выражения, то будет гораздо гибче, но я оставлю это читателям на самостоятельную проработку.

**ДОПОЛНЕНИЕ**. В процессе работы над статьей, появилась идея сделать специальный веб-сервис, обращаясь к которому по простым URL'ам можно получать данные о заявке, а вся «кухня» по разбору PDF'ки происходит «на облаке». В журнале Dr.Dobb's недавно вышла моя статья - [RESTful Web Service in Go Powered by the Google App Engine][], описывающая данный подход. Желающие могут «допилить» приложение для работы через этот веб-сервис. Можно вообще сделать хитро: сначала обратиться к веб-сервису, и если от него есть ответ, то на этом закончить, а если нет -- запустить процедуру самостоятельного скачивания и разбора PDF'ки.

[RESTful Web Service in Go Powered by the Google App Engine]: http://www.drdobbs.com/cloud/restful-web-service-in-go-powered-by-the/240006401

Приложение для командной строки
-------------------------------

Итак, мы знаем почти все, чтобы написать приложение, которое будет скачивать PDF и вычленять из него информацию по нашей заявке. Приложение будет работать из командной строки. Его можно будет собрать из на Маке, и на Windows через GNUstep и Clang. Далее, исходные файлы этого приложения будут использоваться без изменений для версии под iOS.

Файлы:

- `BatchPDFParser.m` (и `.h`) -- PDF-парсер.
- `NSURLConnectionDirectDownload.m` (и `.h`) -- Скачивалка. Тут «обвеска» для `NSURLConnection` (инициализация, делегаты, цикл обработки событий).
- `DirectDownloadDelegate.m` (и `.h`) -- Делегат для `NSURLConnection`, принимающий вызовы в различные моменты скачивания.
- `ViewController.m` -- прототип ViewController. Это «прослойка» между скачивалкой и будущим графическим интерфейсом. В OSX и iOS используется концепция MVC (Model-View-Controller). «Контроллер» обеспечивает связь между элементами интерфейса и бизнес-логикой приложения. Текущий контроллер в основном содержит заглушки, которые будут реализованы в полной графической версии.
- `main-cli.m` -- Точка входа.

### BatchPDFParser.h

Этот файл содержит объявление класса `Batch`, содержащего информацию об обновлении статуса заявки, и класса `BatchPDFParser`, который реализует метод `findInPortion:needle:andAddTo:` (кстати, это статический метод класса, видите `+` начале строки?).

``` objective-c
@interface Batch: NSObject {
  NSString *batchNumber, *status, *date;
}
@property (atomic, copy) NSString* batchNumber, *status, *date;
@end

@interface BatchPDFParser: NSObject

+ (bool)findInPortion:(NSMutableData *)data needle:(NSString* const)needle andAddTo:(NSMutableArray*)list;

@end
```

### BatchPDFParser.m

В этом файле реализация парсера PDF.

``` objective-c
#import <Foundation/Foundation.h>
#import "BatchPDFParser.h"
#import "zlib.h"

@implementation Batch
@synthesize batchNumber, status, date;

- (void) dealloc {
    [batchNumber release];
    [status release];
    [date release];
    [super dealloc];
}
@end

@implementation BatchPDFParser
```

Метод `findInData:fromOffset:needle:` ищет подстроку в данном блоке данных (типа `strstr()`). Поиск примитивный, и его можно ускорить, например, реализовав алгоритм КМП.

``` objective-c
+ (int) findInData:(NSMutableData *)data fromOffset:(size_t)offset needle:(char const * const)needle {
    int const needleSize = strlen(needle);
    char const* const bytes = [data mutableBytes];
    int const bytesLength = [data length] - needleSize;
    for (int i = 0; i < bytesLength;) {
        char const* const current = memchr(bytes + i, needle[0], bytesLength - i);
        if (current == NULL) return -1;
        if (memcmp(current, needle, needleSize) == 0) return current - bytes;
        i = current - bytes + 1;
    }
    return -1;
}
```

Метод `isBatchNumber:number:` проверяет, является ли строка номером заявки (batch number):

``` objective-c
+ (bool) isBatchNumber:(NSString*)number {
    long long const value = [number longLongValue];
    return value >= 20000000000L && value < 29000000000L;
}
```

Метод `findBatchNumberInChunk:needle:andAddTo:` ищет фрагменты, обрамленные тегами `BT` и `ET`. В них выделяет текст в круглых скобках, и уже среди найденного выделяет конкретно номер заявки, строку-статус и строку-дату.

``` objective-c
+ (bool) findBatchNumberInChunk:(char const*)chunk needle:(NSString*)needle andAddTo:(NSMutableArray*)list {
    enum {
        waitBT, waitText, insideText
    } state = waitBT;
    enum {
        waitBatchNumber, waitStatus, waitDate
    } batchParserState = waitBatchNumber;
    NSMutableString* line = [[NSMutableString alloc] init];
    Batch* batch = nil;
    bool found = NO;
    while (*chunk) {
        if (state == waitBT) {
            if (chunk[0] == 'B' && chunk[1] == 'T') {
                state = waitText;
                [line deleteCharactersInRange:NSMakeRange(0, [line length])];
            }
        } else if (state == waitText) {
            if (chunk[0] == '(') {
                state = insideText;
            } else if (chunk[0] == 'E' && chunk[1] == 'T') {
                if (batchParserState == waitBatchNumber) {
                    if ([self isBatchNumber:line]) {
                        [batch autorelease];
                        batch = [[Batch alloc] init];
                        batch.batchNumber = line;
                        batchParserState = waitStatus;
                    }
                } else if (batchParserState == waitStatus) {
                    batch.status = line;
                    batchParserState = waitDate;
                } else if (batchParserState == waitDate) {
                    batch.date = line;
                    batchParserState = waitBatchNumber;
                    if ([batch.batchNumber isEqualToString:needle]) {
                        NSString* pair = [NSString stringWithFormat:@"%@\n%@", batch.status, batch.date];
                        [list addObject:pair];
                        NSLog(@"Found match: '%@' '%@' '%@'", batch.batchNumber, batch.status, batch.date);
                        found = YES;
                    }
                }
                [line autorelease];
                line = [[NSMutableString alloc] init];
                state = waitBT;
            }
        } else if (state == insideText) {
            if (chunk[0] == ')') {
                state = waitText;
            } else {
                char const c[2] = { chunk[0], 0 };
                [line appendString:[NSString stringWithUTF8String:&c[0]]];
            }
        }
        chunk += 1;
    }
    [line release];
    [batch release];
    return found;
}
```

Теперь главный метод `findInPortion:needle:andAddTo:`. Тут выделяются куски, обрамленные тегами `stream\r\n` и `endstream\r\n`, содержимое разжимается через `zlib/inflate` и передается в `findBatchNumberInChunk:needle:andAddTo:` на анализ.

``` objective-c
+ (bool)findInPortion:(NSMutableData *)portion needle:(NSString*)needle andAddTo:(NSMutableArray*)list {
    static char const* const streamStartMarker = "stream\x0d\x0a";
    static char const* const streamStopMarker = "endstream\x0d\x0a";
    bool found = false;
    while (true) {
        int const beginPosition = [self findInData:portion fromOffset:0 needle:streamStartMarker];
        if (beginPosition == -1) break;
        int const endPosition = [self findInData:portion fromOffset:beginPosition needle:streamStopMarker];
        if (endPosition == -1) break;
        int const blockLength = endPosition + strlen(streamStopMarker) - beginPosition;

        char const* const zipped = [portion mutableBytes] + beginPosition + strlen(streamStartMarker);
        z_stream zstream;
        memset(&zstream, 0, sizeof(zstream));
        int const zippedLength = blockLength - strlen(streamStartMarker) - strlen(streamStopMarker);

        zstream.avail_in = zippedLength;
        zstream.avail_out = zstream.avail_in * 10;
        zstream.next_in = (Bytef*)zipped;
        char* const unzipped = malloc(zstream.avail_out);
        zstream.next_out = (Bytef*)unzipped;
        int const zstatus = inflateInit(&zstream);
        if (zstatus == Z_OK) {
            int const inflateStatus = inflate(&zstream, Z_FINISH);
            if (inflateStatus >= 0) {
                found = found || [BatchPDFParser findBatchNumberInChunk:unzipped needle:needle andAddTo:list];
            } else {
                NSLog(@"inflate() failed, error %d", inflateStatus);
            }
        } else {
            NSLog(@"Unable to initialize zlib, error %d", zstatus);
        }
        free(unzipped);
        inflateEnd(&zstream);

        int const cutLength = endPosition + strlen(streamStopMarker);
        [portion replaceBytesInRange:NSMakeRange(0, cutLength) withBytes:NULL length:0];
    }
    return found;
}

@end
```

### DirectDownloadViewDelegate.h

Заголовок делегата для `NSURLConnectionDelegate`:

``` objective-c
@protocol DirectDownloadViewDelegate<NSObject>

- (void)setProgress: (float)progress;
- (void)appendStatus: (NSString*)status;
- (void)setCompleteDate: (NSString*)date;

@end
```

### DirectDownloadDelegate.h

Собственно, сам делегат `NSURLConnectionDelegate`.

``` objective-c
#import "DirectDownloadViewDelegate.h"

@interface DirectDownloadDelegate : NSObject {
    NSError *error;
    BOOL done;
    BOOL found;
    NSMutableData *receivedData;
    float expectedBytes, receivedBytes;
    id<DirectDownloadViewDelegate> viewDelegate;
    NSString* needle;
}

- (id) initWithNeedle:(NSString*)aNeedle andViewDelegate:(id<DirectDownloadViewDelegate>)aViewDelegate;

@property (atomic, readonly, getter=isDone) BOOL done;
@property (atomic, readonly, getter=isFound) BOOL found;
@property (atomic, readonly) NSError *error;

@end
```

### DirectDownloadDelegate.m

И его реализация:

``` objective-c
#import <Foundation/Foundation.h>

#import "DirectDownloadDelegate.h"
#import "BatchPDFParser.h"

@implementation DirectDownloadDelegate
@synthesize error, done, found;
```

Конструктор `initWithNeedle:andViewDelegate:` создает делегата и параметризирует его другим делегатом, `DirectDownloadViewDelegate`, который будет использоваться для задачи обновления экрана. Тут, кстати, мы впервые видит и деструктор, `(void) dealloc:`.

``` objective-c
- (id) initWithNeedle:(NSString*)aNeedle andViewDelegate:(id<DirectDownloadViewDelegate>)aViewDelegate {
    viewDelegate = aViewDelegate;
    [viewDelegate retain];

    needle = [[NSString alloc] initWithString:aNeedle];
    receivedData = [[NSMutableData alloc] init];
    expectedBytes = receivedBytes = 0.0;
    found = NO;

    return self;
}

- (void) dealloc {
    [error release];
    [receivedData release];
    [needle release];
    [viewDelegate release];
    [super dealloc];
}
```

Метод `connectionDidFinishLoading:` вызывается, когда соединение закончено.

``` objective-c
- (void) connectionDidFinishLoading:(NSURLConnection *)connection {
    done = YES;
    NSLog(@"Connection finished");
}
```

Метод `connection:didFailWithError:` вызывает при ошибке при скачивании файла.

``` objective-c
- (void) connection:(NSURLConnection *)connection didFailWithError:(NSError *)anError {
    error = [anError retain];
    [self connectionDidFinishLoading:connection];
}
```

Метод `connection:didReceiveData:` вызывается, когда получена новая порция данных из канала. Каждую такую порцию мы добавляем в буфер, обновляем индикатор прогресса скачивания (через еще один делегат, `viewDelegate`), затем пробуем вычленить фрагменты данных по PDF формату, и, наконец, печатаем то, что было найдено.

``` objective-c
- (void) connection:(NSURLConnection *)connection didReceiveData:(NSData *)someData {
    receivedBytes += [someData length];
    [viewDelegate setProgress:(receivedBytes / expectedBytes)];
    [receivedData appendData:someData];

    NSMutableArray* list = [[NSMutableArray alloc] init];
    bool foundInCurrentPortion = [BatchPDFParser findInPortion:receivedData needle:needle andAddTo:list];
    for (id batch in list) {
        NSLog(@"[%@]", [batch stringByReplacingOccurrencesOfString:@"\n" withString:@"\\n"]);
        [viewDelegate appendStatus:batch];
    }
    [list release];
    found = found || foundInCurrentPortion;
}
```

Последний обратный вызов делегата `NSURLConnectionDelegate`, что мы используем, называется `connection:didReceiveResponse:`. Он вызывается, когда получен информационный ответ по HTTP, содержащий заголовки. Мы из заголовка «Content-Length» берем длину будущего файла, чтобы позже сообразно обновлять индикатор скачивания.

``` objective-c
- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSHTTPURLResponse *)someResponse {
    NSDictionary *headers = [someResponse allHeaderFields];
    NSLog(@"[didReceiveResponse] response headers: %@", headers);
    if (headers) {
        if ([headers objectForKey: @"Content-Length"]) {
            NSLog(@"Content-Length: %@", [headers objectForKey: @"Content-Length"]);
            expectedBytes = [[headers objectForKey: @"Content-Length"] floatValue];
        } else {
            NSLog(@"No Content-Length header found");
        }
    }
}
```

### NSURLConnectionDirectDownload.h

В этом файле находится метод `donwloadAtURL:searching:viewingOn:`, который мы добавляем к классу `NSURLConnection`. Интересно тут то, что через понятие категорий в Objective-C можно «примешивать» новые методы к существующим классам. Тут мы к классу `NSURLConnection` добавляем категорию `DirectDownload`.

``` objective-c
@interface NSURLConnection (DirectDownload)

+ (BOOL) downloadAtURL:(NSURL *)url searching:(NSString*)batchNumber viewingOn:(id)viewDelegate;

@end
```

### NSURLConnectionDirectDownload.m

Ну и финальная часть скачивалки PDF. Метод `donwloadAtURL:searching:viewingOn:` создает соединение и запускает скачивание. Затем происходит ожидание в цикле `NSRunLoop`, пока скачивание не закончится. Этот цикл позволяет приложению реагировать на события в процессе скачивания. Обратите внимание, это до сих пор скачивалка ни как не привязана к графическому интерфейсу. Она использует делегат `viewDelegate` для общения с «мордой» приложения.

``` objective-c
#import <Foundation/Foundation.h>
#import "DirectDownloadDelegate.h"

@implementation NSURLConnection (DirectDownload)

+ (BOOL) downloadAtURL:(NSURL *)url searching:(NSString*)batchNumber viewingOn:(id)viewDelegate {
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];

    DirectDownloadDelegate *delegate = [[[DirectDownloadDelegate alloc] initWithNeedle:batchNumber andViewDelegate:viewDelegate] autorelease];
    NSURLConnection *connection = [[NSURLConnection alloc] initWithRequest:request delegate:delegate];
    [request release];

    while ([delegate isDone] == NO) {
        [[NSRunLoop currentRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:1.0]];
    }

    if ([delegate isFound] != YES) {
        [viewDelegate appendStatus:@"This batch number is not found."];
        NSLog(@"This batch number is not found.");
    }

    NSLog(@"PDF is processed");
    [connection release];

    NSDateFormatter* dateFormatter = [[NSDateFormatter alloc] init];
    dateFormatter.dateFormat = @"yyyy/MM/dd HH:mm:ss";
    NSString* lastUpdateDate = [dateFormatter stringFromDate:[NSDate date]];
    NSLog(@"Last update at: %@", lastUpdateDate);
    [viewDelegate setCompleteDate:lastUpdateDate];
    [dateFormatter release];

    NSError *error = [delegate error];
    if (error != nil) {
        NSLog(@"Download error: %@", error);
        return NO;
    }

    return YES;
}

@end
```

### ViewController.m

Как уже было сказано, в приложении для командной строки контроллер будет содержать только заглушки, которые мы реализуем позже в полной версии программы.

``` objective-c
#import <Foundation/Foundation.h>

#import "DirectDownloadViewDelegate.h"

#define IBAction void
```

Пустой класс-заглушка `ViewController`.

``` objective-c
@interface ViewController : NSObject <DirectDownloadViewDelegate>
@end

#import "NSURLConnectionDirectDownload.h"
```

Адрес, откуда качать файл.

``` objective-c
static char const* const pdf = "http://photos.state.gov/libraries/unitedkingdom/164203/cons-visa/admin_processing_dates.pdf";
```

И mock-реализация класса-контроллера.

``` objective-c
@implementation ViewController
```

Тестовый обратный вызов `appendStatus:` вызывается, когда обнаружено очередное обновление по заявке. Тут мы просто логируем, а в полном приложении будем обновлять экранную форму.

``` objective-c
- (void) appendStatus:(NSString*)status {
    NSLog(@"appendStatus(): '%@'", [status stringByReplacingOccurrencesOfString:@"\n" withString:@"\\n"]);
    // Some code is skipped here because not required for the command line mode.
}
```

Тестовый обратный вызов `setProgress:` вызывается, когда после принятия очередной порции данных надо обновить индикатор скачивания.

``` objective-c
- (void) setProgress:(float)progress {
    // Some code is skipped here because not required for the command line mode.
}
```

Тестовый обратный вызов `setCompleteDate:` вызывается, когда анализ PDF полностью закончен. Тут, опять, мы просто логируем.

``` objective-c
- (void) setCompleteDate:(NSString*)date {
    NSLog(@"setCompleteDate(): '%@'", date);
    // Some code is skipped here because not required for the command line mode.
}
```

Ну и финальный метод, который все запускает, `updateBatchStatus:`. В полной программе он будет вызываться при нажатии кнопки на форме. Тут он вызывается из `main()`.

``` objective-c
- (bool) updateBatchStatus:(NSString*)batchNumber {
    NSURL *url = [[[NSURL alloc] initWithString:[NSString stringWithCString:pdf encoding:NSASCIIStringEncoding]] autorelease];
    return [NSURLConnection downloadAtURL:url searching:batchNumber viewingOn:self];
}

@end
```

### main-cli.m

Запуск из командной строки.

``` objective-c
#import <Foundation/Foundation.h>
#import "DirectDownloadDelegate.h"

@interface ViewController : NSObject <DirectDownloadViewDelegate>
- (bool) updateBatchStatus:(NSString*)batchNumber;
@end

int main(int argc, char *argv[]) {
    @autoreleasepool {
        ViewController* viewController = [ViewController alloc];
        [viewController updateBatchStatus:[NSString stringWithCString:argv[1] encoding:NSASCIIStringEncoding]];
        [viewController release];
    }
    return 0;
}
```

### Попробуем все это собрать и запустить?

`Makefile` для Мак:

``` makefile
files = \
    ViewController.m \
    BatchPDFParser.m \
    NSURLConnectionDirectDownload.m \
    DirectDownloadDelegate.m
    main-cli.m

all: build run

build:
    clang -o USVisaTest -DTESTING -framework Foundation -lz $(files)

run:
    ./USVisaTest 20121456171
```

Makefile `GNUmakefile` для GNUstep:

``` makefile
include $(GNUSTEP_MAKEFILES)/common.make

TOOL_NAME = USVisa
USVisa_OBJC_FILES = \
    ../ViewController.m \
    ../BatchPDFParser.m \
    ../NSURLConnectionDirectDownload.m \
    ../DirectDownloadDelegate.m \
    ../main-cli.m
USVisa_TOOL_LIBS = -lz
ADDITIONAL_OBJCFLAGS = -DTESTING
CC = clang

include $(GNUSTEP_MAKEFILES)/tool.make

run:
    ./obj/USVisa 20121456171
```    

Набираем `make`. Windows:

    This is gnustep-make 2.6.2. Type 'mmake print-gnustep-make-help' for help.
    Making all for tool USVisa...
     Creating obj/USVisa.obj/../...
     Compiling file ViewController.m ...
     Compiling file BatchPDFParser.m ...
     Compiling file NSURLConnectionDirectDownload.m ...
     Compiling file DirectDownloadDelegate.m ...
     Compiling file main-cli.m ...
     Linking tool USVisa ...

Можно запустить проверить реальную заявку:

    make run

У меня вывелось следующее:

    This is gnustep-make 2.6.2. Type 'mmake print-gnustep-make-help' for help.
    ./obj/USVisa 20121456171
    2012-06-19 17:27:11.472 USVisa[3420] [didReceiveResponse] response headers: {"Accept-Ranges" = bytes; "Cache-Control" = "max-age=600"; Connection = "keep-alive"; "Content-Length" = 2237242; "Content-Type" = "application/pdf"; Date = "Tue, 19 Jun 2012 16:27:11 GMT"; ETag = "\"4b2ca3e41de5ba4ae45670e776edfc3b:1339778351\""; "Last-Modified" = "Fri, 15 Jun 2012 16:06:15 GMT"; Server = Apache; }
    2012-06-19 17:27:11.604 USVisa[3420] Content-Length: 2237242
    2012-06-19 17:27:12.093 USVisa[3420] Found match: '20121456171' 'send passport & new travel itinerary' '14-Jun-12'
    2012-06-19 17:27:12.104 USVisa[3420] [send passport & new travel itinerary\n14-Jun-12]
    2012-06-19 17:27:12.111 USVisa[3420] appendStatus(): 'send passport & new travel itinerary\n14-Jun-12'
    2012-06-19 17:27:13.769 USVisa[3420] Connection finished
    2012-06-19 17:27:13.774 USVisa[3420] PDF is processed
    2012-06-19 17:27:13.961 USVisa[3420] Last update at: 2012/06/19 16:27:13
    2012-06-19 17:27:13.972 USVisa[3420] setCompleteDate(): '2012/06/19 16:27:13'

Итак, все работает: скачивалка и парсер PDF. Теперь займемся версией под iOS. Увы, только для пользователей Mac.

Макет экранной формы
--------------------

Я сделал приложение крайне простым: одна форма с полем ввода, кнопкой и местом для вывода обновлений.

![](/images/blog/usvisa/app/usvisa-application-screenshot.png)

Индикатор скачивания и крутящийся бегунок появляются временно.

### ViewController.h

Вот сейчас это полная реализации контроллера. Через макрос `TESTING` я сделал разделение между упрощенной и полной версией.

``` objective-c
#import <Foundation/Foundation.h>
#import "DirectDownloadViewDelegate.h"

#ifdef TESTING
#define IBAction void
@interface ViewController : NSObject <DirectDownloadViewDelegate>
@end
#else
#import "ViewController.h"
#endif

#import "NSURLConnectionDirectDownload.h"

static char const* const pdf = "http://photos.state.gov/libraries/unitedkingdom/164203/cons-visa/admin_processing_dates.pdf";

@implementation ViewController

#ifndef TESTING
@synthesize updateProgressView, batchNumberTextField, statusTextView, lastUpdatedLabel, updateButton;
#endif

NSString* const PropertiesFilename = @"Properties";

NSString *pathInDocumentDirectory(NSString *fileName) {
    NSArray *documentDirectories = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentDirectory = [documentDirectories objectAtIndex:0];
    return [documentDirectory stringByAppendingPathComponent:fileName];
}
```

Сейчас обратный вызов `appendStatus:` не только логирует, но и обновляет экранную форму.

``` objective-c
- (void) appendStatus:(NSString*)status {
    NSLog(@"appendStatus(): '%@'", [status stringByReplacingOccurrencesOfString:@"\n" withString:@"\\n"]);
#ifndef TESTING
    if ([[statusTextView text] length] == 0)
        [statusTextView setText:@"Status:\n"];
    [statusTextView setText:[[statusTextView text] stringByAppendingString:status]];
    [statusTextView setText:[[statusTextView text] stringByAppendingString:@"\n"]];
#endif
}
```

`setProcess:` обновляет индикатор скачивания.

``` objective-c
- (void) setProgress:(float)progress {
#ifndef TESTING
    updateProgressView.progress = progress;
#endif
}
```

`setCompleteDate:` выводит дату обновления в текстовое поле на экране.

``` objective-c
- (void) setCompleteDate:(NSString*)date {
    NSLog(@"setCompleteDate(): '%@'", date);
#ifndef TESTING
    [lastUpdatedLabel setText:date];
#endif
}

- (bool) updateBatchStatus:(NSString*)batchNumber {
    NSURL *url = [[[NSURL alloc] initWithString:[NSString stringWithCString:pdf encoding:NSASCIIStringEncoding]] autorelease];
    return [NSURLConnection downloadAtURL:url searching:batchNumber viewingOn:self];
}
```

Теперь несколько вызовов, специфичных для iOS. Метод `viewDidLoad:` вызывается системой, когда экранная форма загружена и готова к использованию. Тут мы вручную создаем крутящийся бегунок и подправляем высоты двух элементов, кнопки и поля ввода, так как почему-то Xcode Interface Builder не позволяет менять их при дизайне формы.

``` objective-c
#ifndef TESTING
- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    spinnerActivityIndicatorView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    [spinnerActivityIndicatorView setColor:[UIColor blueColor]];
    CGSize size = [[self view] frame].size;
    [spinnerActivityIndicatorView setCenter:CGPointMake(size.width / 2, size.height / 2 + 60)];
    [self.view addSubview:spinnerActivityIndicatorView];

    CGRect rect = [self.updateButton bounds];
    rect.size.height += 10;
    [self.updateButton setBounds:rect];

    rect = [self.batchNumberTextField bounds];
    rect.size.height += 20;
    [self.batchNumberTextField setBounds:rect];

#ifdef DEBUG
    NSLog(@"DEBUG mode");
#endif
}
```

`viewDidUnload` вызывается, когда форма становится неактивной.

``` objective-c
- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
}
```

Метод `shouldAutorotateToInterfaceOrientation:` позволяет контролировать поведение для смене ориентации аппарата. Тут мы разрешаем только портретное положение, не вверх ногами.

``` objective-c
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    return (interfaceOrientation == UIInterfaceOrientationPortrait);
}
#endif
```

Метод `launchUpdate:` вызывает при нажатии на кнопку `Update` на форме. Мы блокируем кнопку от повторного нажатия, вывод индикатор скачивания и крутящийся бегунок.

``` objective-c
- (IBAction)launchUpdate:(id)sender {
    [self setProgress:0.0];
#ifndef TESTING
    [updateButton setEnabled: NO];
    [updateProgressView setHidden:NO];

    NSString* previousStatus = [statusTextView text];
    [statusTextView setText:@""];

    NSString* batchNumber = [batchNumberTextField text];

    [spinnerActivityIndicatorView startAnimating];
    BOOL const ok = [self updateBatchStatus:batchNumber];
    [spinnerActivityIndicatorView stopAnimating];

    if (!ok) {
        UIAlertView *alert = 
            [[UIAlertView alloc] initWithTitle:@"Error"
                                       message:@"Internet connectivity problem"
                                      delegate:self cancelButtonTitle:nil
                             otherButtonTitles:@"OK", nil];
        [alert show];
        [alert release];
        [statusTextView setText:previousStatus];
    }

    [updateProgressView setHidden:YES];
    [updateButton setEnabled: YES];
#endif
}
```

Методы `saveProperties:` и `loadProperties:` сохраняют и восстанавливают содержимое формы при запуске и остановке приложения. Обратите внимание, что для сохранения данных в файле надо запросить у системы положение предназначенного для этого каталога.

``` objective-c
- (void) saveProperties {
    NSDictionary *props = [[NSDictionary alloc] initWithObjectsAndKeys:
#ifndef TESTING
                          batchNumberTextField.text, @"batchNumberTextField",
                          statusTextView.text, @"statusTextView",
                          lastUpdatedLabel.text, @"lastUpdatedLabel",
#endif
                           nil];
    for (NSString* key in props) {
        NSLog(@"%@ - %@", key, [props objectForKey:key]);
    }

    NSString* filename = pathInDocumentDirectory(PropertiesFilename);
    if ([props writeToFile:filename atomically:YES] == NO)
        NSLog(@"Unable to save properties into file [%@]", filename);

    [props release];
}

- (void) loadProperties {
    NSDictionary *props = [[NSDictionary alloc] initWithContentsOfFile:pathInDocumentDirectory(PropertiesFilename)];
    for (NSString* key in props) {
        NSLog(@"%@ - %@", key, [props objectForKey:key]);
    }

#ifndef TESTING
    [batchNumberTextField setText:[props objectForKey:@"batchNumberTextField"]];
    [statusTextView setText:[props objectForKey:@"statusTextView"]];
    [lastUpdatedLabel setText:[props objectForKey:@"lastUpdatedLabel"]];
#endif
    [props release];
}

- (IBAction)textFieldReturn:(id)sender {
#ifndef TESTING
    [sender resignFirstResponder];
#endif
}

-(IBAction)backgroundTouched:(id)sender {
#ifndef TESTING
    [batchNumberTextField resignFirstResponder];
#endif
}

@end
```

Все! Мы рассмотрели все основные файлы. Приложение полностью готово. Можно собирать и заливать в аппарат (не забыв купить у Apple лицензию разработчика).

Я выложил полный проект на GitHub -- [usvisa-app][]. Замечания и мысли принимаются.

[usvisa-app]: https://github.com/begoon/usvisa-app/

Можно заценить видео:

http://www.youtube.com/watch?v=fxKlXDsDANU

<iframe width="560" height="315" src="http://www.youtube.com/embed/fxKlXDsDANU" frameborder="0" allowfullscreen></iframe>

И еще!
------

Если вы подумываете о том, чтобы ваше приложение было распродано миллионным тиражом, стоит начать с красивой иконки. Для приложения обычно надо их несколько: 57x57 и 114x114 для непосредственно приложения, и 512x512 и 1024x1024 для публикации в AppStore.

Мы поступим проще и возьмем иконку из открытых источников -- [The Great Seal of the United States][].

![](/images/blog/usvisa/app/USVisa-icon-114x114.png)

[The Great Seal of the United States]: http://en.wikipedia.org/wiki/Great_Seal_of_the_United_States

P.S.
----

Я решил написать пост про это приложение после того, как цензоры AppStore его «завернули», сославшись на пункт в правилах, где говорится, что приложения с минимальной функциональной нагрузкой, которые можно реализовать через HTML5, не будут допущены. Видимо, они более не хотят видеть пукающих или просто отображающих статическую картинку приложений. Можно было бы поспорить с цензорами на тему минимальной функциональной нагрузки или реализации через HTML5, но я забил. Во-первых, лично мне нравится, что Apple старается не пропускать бесполезные и некачественные приложения, и во-вторых -- я и так получил массу удовольствия от освоения Objective-C, и на данный момент работаю еще над двумя приложениями.

P.P.S.
------

Скоро будет еще статейка про разработку приложений для iOS для новичков, так что [следите за анонсами][demin.ws].

[demin.ws]: http://demin.ws/

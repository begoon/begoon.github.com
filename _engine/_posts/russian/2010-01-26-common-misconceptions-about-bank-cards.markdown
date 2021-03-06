---
layout: post
title: "Распространенные заблуждения про банковские карточки"
language: russian
date: 2010-01-26 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/01/blog-post_26.html
categories:
- russian
---
Работая долгое время области банковского ПО, а в частности по всяким электронным платежам, вместе с коллегами я составил мини-ЧАВО на тему банковских пластиковых карт. Многие вопросы очевидны, а некоторые могут быть весьма туманными. В России бизнес пластиковых карт набирает обороты, что приятно, и лучше быть подкованным по "матчасти".

Итак, 10 распространенных заблуждений.

**1. Количество денег хранится на самой карте.**

На обычной кредитной или дебетовой карте (даже если она с чипом) нет никакого счетчика денег. Карточка - это просто идентификатор. Бывают исключения в виде особых дополнительных приложений-кошельков на картах с чипом. Обычно это могут быть скидочные программы, виртуальные деньги (например, литры бензина) и т.д. В общем, что-то несвязанное напрямую с обычным использование карты. Но такие особые приложения принимаются только в торговых точках, участвующих в поддержке этого конкретного типа карт.

**2. Каждый, кто хочет принимать платежи через банковские карточки, может подключиться напрямую в Визу, Мастеркард или любую другую международную систему.**

Нельзя просто так кому угодно подключиться напрямую в Визу или Мастеркард. Это могут делать только богатые банки или независимые процессинговые центры, так как нужно особое оборудование, немалые страховые счета, сертификация по безопасности и много других "мелочей" (даже не каждый банк может себе такое позволить). Все остальные желающие принимать карты пользуются их услугами.

**3. Банкоматы или терминалы для платежей подключены прямо в Визу или Мастеркард.**

Крупные международные платежные системы не держат своих банкоматов или платежных терминалов. Любой банкомат или терминал обязательно принадлежит какому-то банку, который в свою очередь либо сам, либо опосредовано (см. п.2) подключен в платежную систему.

**4. У меня "на карте" $200. Это все, что я могу потратить.**

Остаток на счету и сумма, которую можно потратить в день с карты, сильно между собой несвязаны. Конструктивнее говорить о дневном лимите по карте. Дневной лимит зависит от множества факторов, и может быть как меньше остатка на счету, так и больше. Например, даже если на счету миллион, вам врядли дадут снять в банкомате более нескольких тысяч в день (и это не ограничение банкомата как устройства). И наоборот, но если вы VIP-клиент, у которого обычно на счету миллионы, а сейчас вы в казино и все уже продули, то после звонка в банк, в индивидуальном порядке какой-то из высоких менеджеров может дать команду установить лично для вас нужный лимит, чтобы вы смогли-таки расплатиться. В этом случае банк берет на себя ответственность, что вы ему потом все отдадите.

**5. При использовании карты ПИН-код проверят сам банкомат или платежный терминал.**

В подавляющем количестве случаев любое использование карты подразумевается соединения с банком, выдавшим карту. Если вы суете карту Сбербанка в банкомат в Австралии, то разрешение на выдачу денег все равно будет запрошено напрямую из Сбера прямо на ваших глазах. Все это потому, что ПИН-код может быть проверен только банком, выпустившим карту. Исключением являются карты с чипом. Такие карты могут сами проверить ПИН (так как сама карта-чип - это миникомпьютер, умеющий выполнять крипто-функции). Также, иногда для использования карты для оплаты покупки (а не снятия наличных), торговая точка может не связываться с авторизационным центром для каждой покупки, если сумма меньше какого-то лимита. Это может быть актуально для небольших сумм, когда сумма покупки меньше стоимости сессии обмена по электронному каналу. Так как суммы невелики, и иногда применяются дневные счетчики по картам, авторизованным таким образом, то и риски нарваться на большие потери из-за мошеннических операций тоже невелики.

**6. На магнитной полосе записан ПИН, который может "украсть" любой сотрудник банка, стоит только отвернуться, пока твоя карточка у него в руках.**

На самом деле, на магнитной полосе записана крипто-свертка ПИНа и номера карты, полученная при помощи криптографического ключа, который хранится внутри суперохраняемой железяки в банке. То есть с помощью данных с магнитной полосы можно только проверить ПИН, да и то, если знать секретный ключ. Обычно в качестве алгоритма шифрования используется 3DES. «Суперохраняемая железяка» - это аппаратное устройство для хранения ключей и проведения крипто-операции на их основе. То есть после начального ввода ключей (персонализации) в этой устройство они никогда не передаются вне физического корпуса в чистом виде.

Помимо серьезных мер по физической охране этих устройств, сами они имеют защиту от проникновения. Например, если попытаться открыть его корпус для подключения «сниффера», то все ключи буду автоматически стерты.

Интересна методика начального ввода ключей. Например, реален вот такой сценарий. Выбирается N сотрудников безопасности банка, например, 3 (в идеале, они даже знать друг друга не должны лично). Каждый генерирует вариант ключа и никому его, конечно, не показывает. Затем, они по очереди заходят в помещение, где стоит оборудование по хранению ключей, и вводят каждый свой ключ. Затем, когда все ключи введены, устройство делает операцию XOR между ними, и это сохраняет внутри себя в качестве ключа. Получается, что ключ не знает никто вообще. И чтобы его восстановить, надо получить исходные компоненты от каждого из тех N сотрудников безопасности, которые обязаны заботиться о конфедециальном их хранении.

Как я уже [писал][KeePass, TrueCrypt или как обезопасить свои конфиденциальные данные], в безопасности полумер нет, и подобные административные меры нужны, когда кончается сила криптографии, и начинается человеческий фактор.

Важное замечание: никто из сотрудников банка, никогда, ни при каких условиях не будет спрашивать вас ПИН. Но если б вы знали, сколько раз из десяти, клиенты, звонящие в банк, на вопрос оператора об их секретном слове (которое задавалось при открытии счета), говорят ПИН.

**7. При совершении покупки деньги сразу попадают напрямую со счета клиента на счет магазина.**

Обычно реальный обмен деньгами (пусть и электронными), происходит в конце рабочего дня. А в момент самой покупки производится только блокировка суммы из доступного лимита (см. п.4). Списание же обычно происходит через несколько дней, когда до банка-владельца счета дойдет финансовое представление от банка, через чей терминал был проведен платеж.

**8. Сумма, написанная на вашем чеке при оплате картой, в точности будет списана с вашего счета.**

На самом деле, сумма, списанная при авторизации, может отличаться существенно от суммы, которая списана по финансовой транзакции. Особенно это проявляется при оплате аренды машин и оплате гостиниц, так как эти торговые точки могут "вдогонку" списать дополнительные расходы (пример, недостачу бензина, или неоплаченный мини-бар). Но не только этим типам торговых точек также разрешено увеличивать или уменьшать конечную сумму.

Также, сумма, заблокированная при авторизации, может отличаться от суммы, списанной со счета, в случае, если валюта счета отличается от валюты операции, так как реальное списание средств со счета происходит через 1-2 дня, а за это время курс конвертации может измениться.

**9. Сумма, заблокированная на счету при оплате картой, так или иначе спишется с моего счета.**

Сумма, заблокированная при авторизации, может никогда быть не списана со счета. Через 10 (для банкомата) или 45 (все остальные терминалы) дней без прихода в ваш банк финансового подтверждения операции из платежной системы она будет разблокирована. Это и "хорошо" и "плохо". Это "хорошо", когда вы сделали операцию, от которой хотите тут же отказаться. Сразу после операции вы звоните в банк, объясняете оператору причину отказа, и если она разрешенная, то операция "отменяется", и блокировка может быть снята. В этом случае если вдруг на операцию придет финансовое подтверждение от торговой точки (через пару дней), то сам банк будет разбираться с ним без вашего участия (и ваших денег). Это "плохо", когда вы таки подождали день-два, и финансовое подтверждение уже пришло в банк до вашего звонка, тогда "откатить" операцию будет уже сложнее. Банк будет вынужден начать официальное разбирательство по этому случаю, которое может длиться эти 45 дней. В течение этого времени сумма покупки может оставаться заблокированной.

**10. Владельцы дебетовых (а не кредитных) карт не могут оказаться "должны банку".**

Как уже говорилось в п.4 — логика авторизации покупки основана не на реальной сумме на счету, а на дневных лимитах, то как и для кредитных карт, так и для дебетовых, можно "залезть в минус", если банк ставит дневные лимиты, немного превышающие остаток на счету даже для дебитных карт.

Надеюсь, эта информация поможет вам избежать некоторых неприятных сюрпризов при использовании пластиковых карточек.

Посты по теме:

* [KeePass, TrueCrypt или как обезопасить свои конфиденциальные данные][]

[KeePass, TrueCrypt или как обезопасить свои конфиденциальные данные]: /blog/russian/2010/01/17/truecrypt-keepass-and-confidential-data/

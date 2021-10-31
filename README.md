# Домашнее задание ШРИ: Инфраструктура
## При пуше коммита с указанием релизного тэга происходит создание нового релизного тикета в Яндекс.Трекере.

В рамках проекта написаны 3 bash-скрипта и файл .yml для github actions, в котором происходит запуск скриптов после добавления в git релизного тэга
### Скрипт оформления релиза:
+ определяет версию релиза (соответствует последнему релизному тэгу)
+ формирует changelog по истории коммитов от предыдущего релизного тэга
+ создает запись в реестре релизов (Яндекс.Трекер) и сохраняет в описании - автора, дату релиза и номер версии, а в комментариях - changelog
+ при запуске скрипта повторно с уже существующим релизным тэгом новый тикет не создается, информация обновляется в существующем релизном тикете
+ в случае возникновения ошибки при отправке запроса в Трекер выполнение дальнейших шагов не происходит
### Скрипт запуска автотестов:
+ запускает несколько юнит-тестов
+ результаты запуска автотестов добавляются в реестр релизов в комментарии соответствующего релизного тикета
+ в случае возникновения ошибки при выполнении тестов сборка релизного артефакта не происходит
### Скрипт сборки релизного артефакта:
+ собирает docker-образ приложения из коммита, подписанного релизным тэгом
+ после сборки релизного артефакта информация о нем добавляется в реестр релизов в комментарии соответствующего релизного тикета
+ в случае возникновения ошибки при сборке docker-образа выполнение pipeline завершается с ошибкой



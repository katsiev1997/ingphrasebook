"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import Link from "next/link";

export function PronunciationGuide() {
  return (
    <div className="space-y-6">
      <section className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
          Транскрипция в разговорнике основана на русском алфавите. Краткие
          гласные обозначаются буквами, долгие — с значком долготы (например,{" "}
          <strong>а:</strong>, <strong>е:</strong>). Гортанная фонема{" "}
          <strong>I</strong> в начале и конце слова — значком <strong>′</strong>
          : <strong>′а</strong> (Iа) «зима», <strong>во′</strong> (воI) «сын».
        </p>
      </section>

      <Accordion
        type="single"
        className="rounded-lg border border-border bg-component-light dark:bg-component-dark px-4"
      >
        <AccordionItem value="vowels">
          <AccordionTrigger className="text-base font-semibold text-black dark:text-white">
            Гласные
          </AccordionTrigger>
          <AccordionContent className="space-y-4 text-sm">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Ингушские гласные произносятся вообще кратко и отрывисто.
              Исключение представляют <strong>«а:»</strong> и{" "}
              <strong>«аь»</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  А: (а:)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Первая произносится несколько протяжнее, чем в русском языке,
                  представляя на слух как бы соединение двух последовательных{" "}
                  <strong>а</strong>: <strong>да:</strong> – «отец»,{" "}
                  <strong>ма:рша воагIалва</strong> – «с приездом» и т.п.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  Аь (аь)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  В середине слов практически не отличается от русского{" "}
                  <strong>я</strong>: <strong>маьчи</strong> «чувяки» / «обувь»;{" "}
                  <strong>къаьнк</strong> «мальчик». В начале слова{" "}
                  <strong>аь</strong> произносится как <strong>эа</strong>:{" "}
                  <strong>аьннад</strong> – «сказал», <strong>аьха</strong> –
                  «вспаханный».
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  А (а)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Беглый звук, активно употребляемый в ингушском языке. По
                  произношению это звук является средним между{" "}
                  <strong>а</strong>, <strong>э</strong> и <strong>ы</strong>:{" "}
                  <strong>барт</strong> – «согласие», <strong>бе:зам</strong> –
                  «любовь» и др. В русском языке ближе всего к краткому{" "}
                  <strong>а</strong> подходит <strong>о</strong> неударное,
                  например, произношение <strong>о</strong> в словах «говорить»,
                  «Федор» и др.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  Е (е)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Соответствует русскому <strong>«э»</strong>:{" "}
                  <strong>эзар</strong> – «тысяча», <strong>дей</strong> –
                  «легкий» и др.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  И (и)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  В ряде случаев произносится приблизительно так, как русское{" "}
                  <strong>«ы»</strong>, но очень коротко и отрывисто:{" "}
                  <strong>из</strong> – «он», <strong>ишкол</strong> – «школа» и
                  др.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  Остальные гласные
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Остальные гласные: <strong>и</strong>, <strong>о</strong>,{" "}
                  <strong>у</strong> произносятся так же, как и соответствующие
                  звуки русского языка: <strong>итт</strong> – «десять»,{" "}
                  <strong>ги</strong> – «семя», <strong>дом</strong> – «пыль»,{" "}
                  <strong>уст</strong> – «бык», <strong>гу</strong> – «вижу» и
                  др.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="consonants">
          <AccordionTrigger className="text-base font-semibold text-black dark:text-white">
            Согласные
          </AccordionTrigger>
          <AccordionContent className="space-y-4 text-sm">
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                О произношении согласных звуков ингушского языка следует помнить
                следующее:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li className="leading-relaxed">
                  Сочетания <strong>лг</strong>, <strong>рг</strong>,{" "}
                  <strong>шк</strong>, <strong>кк</strong> и буквы{" "}
                  <strong>г</strong> и <strong>к</strong> на конце слов
                  произносятся всегда мягко, как бы <strong>льгь</strong>,{" "}
                  <strong>рьгь</strong>, <strong>шькь</strong>,{" "}
                  <strong>ськь</strong>, <strong>ккь</strong>:{" "}
                  <strong>кулг</strong> (кульгь) – «рука», <strong>лерг</strong>{" "}
                  (лерьгь) – «ухо», <strong>пишк</strong> (пишькь) – «печка»,{" "}
                  <strong>циськь</strong> (циськь) – «кошка»,{" "}
                  <strong>икк</strong> (иккь) – «сапог», <strong>гийг</strong>{" "}
                  (гийгь) – «живот» / «желудок». Исключение составляет слово{" "}
                  <strong>барг</strong> – «копыто», в котором исходные{" "}
                  <strong>рг</strong> произносятся всегда твердо.
                </li>
                <li className="leading-relaxed">
                  Буква <strong>з</strong> имеет в ингушском языке двоякое
                  произношение: во-первых, как чистое русское <strong>з</strong>
                  : <strong>боз</strong> – «бязь» и, во-вторых, как{" "}
                  <strong>дз</strong>, произносимое слитно:{" "}
                  <strong>морз</strong> (мордз) – «сыворотка»,{" "}
                  <strong>герз</strong> (гердз) – «оружие». Следует уяснить, что
                  в начале слова <strong>з</strong> практически всегда
                  произносится как <strong>дз</strong>. Такой же характер имеет
                  и произношение буквы <strong>ж</strong>, которая
                  выговаривается и как <strong>ж</strong>, и как{" "}
                  <strong>дж</strong>: <strong>мож</strong> (модж) – «борода»,{" "}
                  <strong>гIаж</strong> (гIаж) – «гусь», <strong>жа</strong>{" "}
                  (джа) – «овцы» и др.
                </li>
              </ol>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Особо сложными для произношения являются следующие фонемы:
            </p>

            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  ГI (гI)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Щелевой звонкий согласный звук, в образовании которого, кроме
                  основного шума, участвует и музыкальный тон. Эту фонему еще
                  называют фарингальной. Фонема <strong>гI</strong> более
                  глубокозаднего образования, чем заднеязычные{" "}
                  <strong>г</strong>, <strong>к</strong>, <strong>х</strong>.
                  Она образуется почти в гортани и произносится с относительно
                  слабым придыханием. Подобной фонемы нет в русском языке.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  ХЬ (хь)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Гортанная щелевая глухая фонема, произносится с придыханием.
                  По своей природе всегда является твердой. Не озвончается перед
                  звонкими согласными и гласными.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  ХI (хI)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Щелевая глухая (соответствует немецкому <strong>h</strong>).
                  Эту фонему называют звуком свободного выдоха, соответственно,
                  является придыхательной.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  ПI (пI)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Смычно-гортанная глухая фонема, в образовании которой
                  музыкальный тон не участвует. Фонема <strong>пI</strong>{" "}
                  произносится с более сильным напряжением артикулирующих
                  органов и с более сильной струей выдыхаемого воздуха, чем
                  фонема <strong>п</strong>.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  ТI (тI)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Мгновенная надгортанная зубная глухая фонема. Произносится с
                  более сильным напряжением артикулирующих органов и с более
                  сильной струей выдыхаемого воздуха, чем <strong>т</strong>.
                  Данный звук произносится твердо, то есть почти не смягчается
                  перед передними гласными, поэтому не имеет мягкого варианта.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  КI (кI)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Мгновенная заднетвердонебная смычно-гортанная глухая фонема,
                  произносится с более сильным напряжением артикулирующих
                  органов и с более сильной струей выдыхаемого воздуха, чем{" "}
                  <strong>к</strong>. Данный звук абсолютно глухой, в его
                  образовании голос (музыкальный тон) не участвует. Фонема{" "}
                  <strong>кI</strong> относится к числу сильно придыхательных
                  звуков ингушского языка, особенно сильно проявляется
                  придыхание в позиции <strong>кI</strong> в начале и в конце
                  слова.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  ДЗ (дз)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Зубная твердая звонкая аффриката, произносится с придыханием
                  и, как правило, твердо. Перед глухими согласными не
                  оглушается.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  Дж (дж)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Переднетвердонебная звонкая аффриката, произносится, как
                  правило, твердо, с придыханием и не оглушается перед
                  согласными.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  Кх (кх)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Заднемягконебная несмычно-гортанная глухая аффриката, то есть
                  фарингальная фонема. Она относится к числу звуков,
                  произносящихся с придыханием. В ингушском языке встречается
                  долгая (графически удвоенная) <strong>кх</strong>:{" "}
                  <strong>воаккха саг</strong> – «старец».
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  ЦI (цI)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Зубная смычно-гортанная глухая аффриката, представляет собой
                  фонему <strong>ц</strong> с дополнительным (смычно-гортанным)
                  признаком, создаваемым полной преградой в полости гортани.
                  Произносится с придыханием.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  ЧI (чI)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Переднетвердонебная смычно-гортанная глухая фонема,
                  произносится с придыханием. Всегда звонкая.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  Къ (къ)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Заднемягконебная смычно-гортанная глухая аффриката, всегда
                  произносится с придыханием. Практически в любых позициях
                  звучит твердо и не озвончается перед звонкими согласными.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="classes">
          <AccordionTrigger className="text-base font-semibold text-black dark:text-white">
            Классы существительного
          </AccordionTrigger>
          <AccordionContent className="space-y-4 text-sm">
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                В ингушском языке 6 классов имени существительного,
                определяющихся формами настоящего времени глагола «быть»:
              </p>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <p>
                  <strong className="text-black dark:text-white">Да ва</strong>{" "}
                  – «Отец есть» (классный показатель <strong>в</strong>)
                </p>
                <p>
                  <strong className="text-black dark:text-white">
                    Нана йа
                  </strong>{" "}
                  – «Мать есть» (<strong>й</strong>)
                </p>
                <p>
                  <strong className="text-black dark:text-white">
                    Маьнги ба
                  </strong>{" "}
                  – «Кровать есть» (<strong>б</strong>)
                </p>
                <p>
                  <strong className="text-black dark:text-white">
                    Говр йа
                  </strong>{" "}
                  – «Лошадь есть» (<strong>й</strong>)
                </p>
                <p>
                  <strong className="text-black dark:text-white">Iаж ба</strong>{" "}
                  – «Яблоко есть» (<strong>б</strong>)
                </p>
                <p>
                  <strong className="text-black dark:text-white">Бер да</strong>{" "}
                  – «Дитя есть» (<strong>д</strong>)
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Таким образом, мы имеем четыре подвижные буквы (
                <strong>в</strong>, <strong>й</strong>, <strong>б</strong>,{" "}
                <strong>д</strong>), которые и называются классным показателем.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Нельзя путать класс существительного с родом в русском языке:
                признак пола не является для классов определяющим.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  в-б – класс мужчин
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong>къонах ва</strong> – «мужчина есть»,{" "}
                  <strong>къонахий ба</strong> – «мужчины есть»
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  й-б – класс женщин
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong>кхалсаг йа</strong> – «женщина есть»,{" "}
                  <strong>кхалнах ба</strong> – «женщины есть»
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  й-й – класс вещей
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Самый многочисленный в ингушском языке и постоянно
                  пополняющийся, поскольку, как правило, подавляющая часть
                  заимствованных слов относят к этому классу:{" "}
                  <strong>шарф йа</strong> – «шарф есть»,{" "}
                  <strong>шарфаш йа</strong> – «шарфы есть»
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  б-б – класс вещей
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Также класс вещей, является малочисленным
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  б-д – класс вещей и животных
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong>устагI ба</strong> – «баран есть»,{" "}
                  <strong>устагIий да</strong> – «бараны есть»
                </p>
              </div>

              <div>
                <h3 className="font-medium text-black dark:text-white mb-1">
                  д-д – класс
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Класс, к которому относится основной исконный (общий для
                  нахских языков) слой лексики: <strong>хий да</strong> – «вода
                  есть», <strong>хиш да</strong> – «воды есть»,{" "}
                  <strong>Iаса да</strong> – «теленок есть»,{" "}
                  <strong>Iаьсий да</strong> – «телята есть»
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        <Link
          href="/about"
          className="underline text-primary hover:text-primary/80"
        >
          Вернуться к информации о проекте
        </Link>
      </p>
    </div>
  );
}

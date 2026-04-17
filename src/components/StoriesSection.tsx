import { Link } from "react-router-dom";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import tourmalineImg from "@/assets/tourmaline.jpg";
import roseQuartzImg from "@/assets/rose-quartz.jpg";
import amethystImg from "@/assets/amethyst.jpg";
import citrineImg from "@/assets/citrine.jpg";
import carnelianImg from "@/assets/carnelian.jpg";
import labradoriteImg from "@/assets/labradorite.jpg";
import aquamarineImg from "@/assets/aquamarine.jpg";
import tigerEyeImg from "@/assets/tiger-eye.jpg";
import shungiteImg from "@/assets/shungite.jpg";
import nephriteImg from "@/assets/nephrite.jpg";
import moonstoneImg from "@/assets/moonstone.jpg";
import clearQuartzImg from "@/assets/clear-quartz.jpg";

const stories = [
  { stone: "Чёрный турмалин", image: tourmalineImg, story: "Она брала его с собой на работу, где каждый день — токсичный начальник и чужая тревога. Через неделю заметила: чужие эмоции перестали прилипать.", effect: "Моя энергия — моя. Чужое — мимо." },
  { stone: "Розовый кварц", image: roseQuartzImg, story: "Она носила его после развода. Не верила. Через неделю заметила, что перестала прокручивать в голове их последний разговор. Через месяц — смогла заплакать.", effect: "Сердце начало оттаивать." },
  { stone: "Аметист", image: amethystImg, story: "Он клал его под подушку, потому что не мог спать. Голова не выключалась. Через несколько ночей — тишина.", effect: "Та, в которой наконец можно отдохнуть." },
  { stone: "Цитрин", image: citrineImg, story: "Она потеряла мотивацию. Бизнес стоял. Положила цитрин на стол — «ну а вдруг». Через неделю снова записывает идеи.", effect: "Не потому что надо. Потому что хочется." },
  { stone: "Сердолик", image: carnelianImg, story: "Он годами жил в режиме «надо». Тело ответило хронической усталостью, потухшим взглядом. Сердолик вернул краски.", effect: "Вернул вопрос: «А чего хочу я?»" },
  { stone: "Лабрадорит", image: labradoriteImg, story: "Она чувствовала, что живёт не свою жизнь. Что выбрала не ту профессию, не того партнёра. Лабрадорит не дал ответов.", effect: "Он дал смелость задать себе правильные вопросы." },
  { stone: "Аквамарин", image: aquamarineImg, story: "Каждый важный разговор заканчивался комом в горле. Слова застревали. Аквамарин лёг на шею — и голос стал звучать иначе.", effect: "Не громче. Настоящее." },
  { stone: "Тигровый глаз", image: tigerEyeImg, story: "Он месяцами откладывал решение. Боялся ошибиться. Взял тигровый глаз в руку перед звонком — и набрал номер.", effect: "Момент — сейчас. Знак — это я в твоей руке." },
  { stone: "Шунгит", image: shungiteImg, story: "После выгорания она чувствовала себя грязной губкой. Шунгит поставила у кровати. Утро стало начинаться с чистого листа.", effect: "Перезагрузка. Каждый день заново." },
  { stone: "Нефрит", image: nephriteImg, story: "Он всегда хотел всё и сразу. Нефрит научил ждать. Не сдаваться, а ждать — это разные вещи.", effect: "Камень для тех, кто играет вдолгую." },
  { stone: "Лунный камень", image: moonstoneImg, story: "Она считала мягкость слабостью. Гормоны скакали, сны пропали. Лунный камень вернул право быть уязвимой.", effect: "Мягкость — самая недооценённая сила." },
  { stone: "Горный хрусталь", image: clearQuartzImg, story: "Он не знал, с чего начать. Какой камень выбрать? Горный хрусталь подходит всем. Всегда. Без условий.", effect: "Ты на верном пути." },
];

const StoriesSection = () => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-crystal-glow opacity-50" />
      <div className="relative max-w-6xl mx-auto px-6">
        <AnimateOnScroll className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6 leading-tight">
            Как это работает <span className="text-gradient-gold">в реальной жизни</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg">Не в книгах. Не в красивых постах. В жизни.</p>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((item, i) => (
            <AnimateOnScroll key={item.stone} delay={i * 80}>
              <div className="group bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden hover:border-primary/20 transition-all duration-500 h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.stone} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" width={800} height={800} />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/30 to-transparent" />
                  <h3 className="absolute bottom-4 left-6 font-display text-2xl text-foreground">{item.stone}</h3>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="font-body text-muted-foreground leading-relaxed text-sm mb-4 flex-1">{item.story}</p>
                  <p className="font-body text-primary italic text-sm">{item.effect}</p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll className="text-center mt-12">
          <Link
            to="/catalog"
            className="inline-block font-display text-lg px-8 py-4 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Перейти в каталог камней →
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default StoriesSection;

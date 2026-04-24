import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { crystals } from "@/data/crystals";
import PageSEO from "@/components/PageSEO";

type Chakra = {
  name: string;
  sanskrit: string;
  location: string;
  color: string;
  colorClass: string;
  element: string;
  description: string;
  balanced: string;
  blocked: string;
  stones: string[];
  top: string;
};

const chakrasData: Chakra[] = [
  {
    name: "Коронная чакра",
    sanskrit: "Сахасрара",
    location: "Макушка головы",
    color: "Фиолетовый и белый",
    colorClass: "bg-violet-500",
    element: "Мысль",
    description: "Коронная чакра является высшим энергетическим центром и связывает индивида с космическим сознанием. Она отвечает за духовное пробуждение, просветление и ощущение единства со всем сущим. Когда этот центр раскрыт, каждый обретает глубокое понимание природы реальности и своего места в ней.",
    balanced: "Духовная ясность, ощущение единства, мудрость, внутренний покой, связь с высшим сознанием",
    blocked: "Отрыв от реальности, духовный кризис, чувство изоляции, цинизм, отсутствие смысла жизни",
    stones: ["Аметист", "Флюорит", "Чароит", "Сугилит"],
    top: "5%",
  },
  {
    name: "Третий глаз",
    sanskrit: "Аджна",
    location: "Центр лба между бровями",
    color: "Индиго",
    colorClass: "bg-indigo-500",
    element: "Свет",
    description: "Чакра третьего глаза управляет интуицией, ясновидением и внутренним знанием. Она позволяет видеть за пределами физической реальности, развивает способность к визуализации и помогает отличать истину от иллюзий. Этот центр связан с шишковидной железой и управляет процессами восприятия тонких энергий.",
    balanced: "Развитая интуиция, ясное мышление, хорошая память, способность к визуализации, проницательность",
    blocked: "Головные боли, проблемы со зрением, неспособность принимать решения, отсутствие интуиции, путаница",
    stones: ["Лабрадорит", "Содалит", "Спектролит", "Танзанит"],
    top: "15%",
  },
  {
    name: "Горловая чакра",
    sanskrit: "Вишуддха",
    location: "Область горла",
    color: "Голубой",
    colorClass: "bg-sky-400",
    element: "Эфир",
    description: "Горловая чакра отвечает за общение, самовыражение и творчество. Она управляет способностью говорить правду, выражать свои мысли и чувства, а также слушать и понимать других. Этот энергетический центр связан с щитовидной железой и влияет на все формы коммуникации.",
    balanced: "Честное самовыражение, хорошие коммуникативные навыки, творческий поток, способность слушать",
    blocked: "Страх высказаться, проблемы с горлом, неспособность выразить чувства, ложь, чрезмерная болтливость",
    stones: ["Аквамарин", "Голубой халцедон", "Ларимар", "Голубой топаз", "Голубой кианит"],
    top: "28%",
  },
  {
    name: "Сердечная чакра",
    sanskrit: "Анахата",
    location: "Центр грудной клетки",
    color: "Зелёный и розовый",
    colorClass: "bg-emerald-500",
    element: "Воздух",
    description: "Сердечная чакра является мостом между нижними и верхними энергетическими центрами. Она управляет способностью любить и быть любимым, состраданием, эмпатией и способностью прощать. Этот центр определяет качество всех отношений индивида — с собой, с другими и с миром.",
    balanced: "Способность любить безусловно, сострадание, эмпатия, прощение, гармоничные отношения",
    blocked: "Обиды, ревность, неспособность прощать, закрытость, созависимость, чувство одиночества",
    stones: ["Розовый кварц", "Родонит", "Нефрит", "Хризоколла", "Пренит", "Розовый турмалин"],
    top: "40%",
  },
  {
    name: "Солнечное сплетение",
    sanskrit: "Манипура",
    location: "Область выше пупка",
    color: "Жёлтый",
    colorClass: "bg-yellow-400",
    element: "Огонь",
    description: "Чакра солнечного сплетения является центром личной силы, воли и самоидентификации. Она определяет уверенность в себе, способность ставить границы и принимать решения. Этот энергетический центр управляет пищеварительной системой и связан с чувством собственного достоинства.",
    balanced: "Уверенность в себе, здоровые границы, сила воли, мотивация, самодисциплина",
    blocked: "Низкая самооценка, беспомощность, контролирующее поведение, проблемы с пищеварением, выгорание",
    stones: ["Цитрин", "Тигровый глаз", "Пирит", "Янтарь", "Хризоберилл"],
    top: "52%",
  },
  {
    name: "Сакральная чакра",
    sanskrit: "Свадхистана",
    location: "Нижняя часть живота",
    color: "Оранжевый",
    colorClass: "bg-orange-500",
    element: "Вода",
    description: "Сакральная чакра отвечает за эмоции, чувственность, творческую энергию и способность получать удовольствие от жизни. Она управляет сексуальной энергией, репродуктивной системой и способностью адаптироваться к переменам. Этот центр тесно связан с внутренним ребёнком.",
    balanced: "Эмоциональная гибкость, здоровая сексуальность, творческий поток, умение радоваться жизни",
    blocked: "Эмоциональная нестабильность, чувство вины, подавленная сексуальность, зависимости, апатия",
    stones: ["Сердолик", "Рубеллит", "Сардоникс"],
    top: "64%",
  },
  {
    name: "Корневая чакра",
    sanskrit: "Муладхара",
    location: "Основание позвоночника",
    color: "Красный",
    colorClass: "bg-red-600",
    element: "Земля",
    description: "Корневая чакра является фундаментом всей энергетической системы живого существа. Она отвечает за чувство безопасности, заземление, связь с физическим телом и материальным миром. От состояния этого центра зависит выживание, базовые потребности и ощущение стабильности.",
    balanced: "Чувство безопасности, стабильность, заземлённость, физическая энергия, доверие к жизни",
    blocked: "Страхи, тревога, финансовые проблемы, физическая слабость, ощущение угрозы, паника",
    stones: ["Чёрный турмалин", "Красная яшма", "Гематит", "Гранат", "Обсидиан", "Шунгит", "Оникс"],
    top: "78%",
  },
];

const ChakraMap = () => {
  const [selected, setSelected] = useState<number>(3);

  const findCrystal = (name: string) => crystals.find((c) => c.name === name);

  return (
    <main className="min-h-screen bg-background">
      <PageSEO
        title="Карта чакр"
        description="Интерактивная карта чакр с камнями. Узнайте, какие минералы активируют каждую чакру и помогают восстановить баланс."
        path="/chakras"
      />
      <div className="container mx-auto px-4 pt-6">
      </div>

      <section className="container mx-auto px-4 py-12 text-center">
        <AnimateOnScroll>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Карта чакр
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Интерактивная карта семи основных энергетических центров индивида.
            Нажмите на чакру, чтобы узнать её значение и какие камни помогают
            гармонизировать этот энергетический центр.
          </p>
        </AnimateOnScroll>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Силуэт с чакрами */}
          <div className="relative mx-auto w-[200px] h-[500px] lg:w-[280px] lg:h-[600px]">
            {/* Контур тела */}
            <div className="absolute inset-x-[25%] top-[3%] bottom-[2%] border-2 border-border/30 rounded-[50%_50%_45%_45%] opacity-20" />

            {/* Центральная линия */}
            <div className="absolute left-1/2 top-[8%] bottom-[5%] w-0.5 bg-gradient-to-b from-violet-500/20 via-emerald-500/20 to-red-600/20" />

            {/* Чакры */}
            {chakrasData.map((chakra, idx) => (
              <button
                key={chakra.name}
                onClick={() => setSelected(idx)}
                className={`absolute left-1/2 -translate-x-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  selected === idx
                    ? `${chakra.colorClass} scale-125 shadow-lg ring-2 ring-foreground/20`
                    : `${chakra.colorClass} opacity-60 hover:opacity-90 hover:scale-110`
                }`}
                style={{ top: chakra.top }}
                title={chakra.name}
              >
                <span className="text-white text-xs font-bold">{7 - idx}</span>
              </button>
            ))}
          </div>

          {/* Информация о выбранной чакре */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-8 h-8 rounded-full ${chakrasData[selected].colorClass}`} />
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  {chakrasData[selected].name}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {chakrasData[selected].sanskrit} — {chakrasData[selected].location}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                  <span>Цвет: <span className="text-foreground">{chakrasData[selected].color}</span></span>
                  <span>Элемент: <span className="text-foreground">{chakrasData[selected].element}</span></span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{chakrasData[selected].description}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-primary mb-2">Гармоничное состояние</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{chakrasData[selected].balanced}</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-destructive mb-2">Признаки блокировки</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{chakrasData[selected].blocked}</p>
                </div>
              </div>

              <div>
                <h4 className="font-serif text-lg font-semibold text-foreground mb-3">Камни для гармонизации</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {chakrasData[selected].stones.map((stoneName) => {
                    const crystal = findCrystal(stoneName);
                    return (
                      <Link
                        key={stoneName}
                        to={crystal ? `/catalog/${encodeURIComponent(crystal.name)}` : "/catalog"}
                        className="bg-secondary/30 rounded-lg p-3 hover:bg-secondary/50 transition-colors text-center"
                      >
                        {crystal && (
                          <img
                            src={crystal.image}
                            alt={crystal.name}
                            className="w-12 h-12 rounded-full object-cover mx-auto mb-2"
                          />
                        )}
                        <span className="text-sm text-foreground">{stoneName}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChakraMap;

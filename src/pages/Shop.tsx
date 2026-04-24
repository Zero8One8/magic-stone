import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, Sparkles, Flame, Star, ExternalLink } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { BOT_URL, bracelets, rosaries, candles, type Product } from "@/data/products";
import ContactForm from "@/components/ContactForm";
import PaymentButton from "@/components/PaymentButton";

const isImageUrl = (str: string) =>
  typeof str === "string" &&
  (str.startsWith("/") || str.startsWith("http") || str.startsWith("data:"));

const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-card rounded-2xl border border-border p-5 hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
    <div className="flex items-start justify-between mb-3">
      {isImageUrl(product.image) ? (
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-16 h-16 rounded-xl object-cover"
          width={64}
          height={64}
        />
      ) : (
        <span className="text-3xl">{product.image}</span>
      )}
      {product.badge && (
        <span className="bg-primary/20 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
          {product.badge}
        </span>
      )}
    </div>
    <h3 className="font-serif text-lg font-bold text-foreground mb-1">{product.title}</h3>
    <span className="text-primary font-semibold text-sm mb-2">{product.price}</span>
    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{product.description}</p>
    {product.priceRub ? (
      <PaymentButton
        amount={product.priceRub}
        orderSlug={product.botParam}
        itemName={product.title}
        itemType="product"
        cta={`Оплатить ${product.price}`}
        className="w-full gap-2"
      />
    ) : (
      <a href={`${BOT_URL}?start=${product.botParam}`} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" className="w-full gap-2">
          <ShoppingBag className="w-4 h-4" />
          Обсудить заказ
        </Button>
      </a>
    )}
  </div>
);

const CategorySection = ({
  icon: Icon,
  title,
  subtitle,
  products,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  products: Product[];
}) => (
  <section className="mb-16">
    <AnimateOnScroll>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
      </div>
      <p className="text-muted-foreground mb-6 ml-[52px]">{subtitle}</p>
    </AnimateOnScroll>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((p) => (
        <AnimateOnScroll key={p.title}>
          <ProductCard product={p} />
        </AnimateOnScroll>
      ))}
    </div>
  </section>
);

const Shop = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>
      </div>

      <section className="container mx-auto px-4 py-12 text-center">
        <AnimateOnScroll>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Магазин
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Браслеты, чётки и программные свечи — готовые изделия и индивидуальный подбор после диагностики мастера.
            Для товаров с фиксированной ценой оплата проходит на сайте, дальше вы заполняете данные доставки.
          </p>
        </AnimateOnScroll>
      </section>

      <div className="container mx-auto px-4 pb-16 max-w-7xl">
        <CategorySection
          icon={Sparkles}
          title="Браслеты из натуральных камней"
          subtitle="Готовые браслеты и индивидуальный подбор после диагностики"
          products={bracelets}
        />

        <CategorySection
          icon={Star}
          title="Чётки для медитации"
          subtitle="Инструменты для духовных практик и мантра-медитаций"
          products={rosaries}
        />

        <CategorySection
          icon={Flame}
          title="Программные свечи"
          subtitle="Свечи ручной работы, заряженные на конкретное намерение"
          products={candles}
        />

        <AnimateOnScroll>
          <div className="bg-card border border-primary/20 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <h3 className="font-serif text-xl font-bold text-foreground mb-3">
              Не знаете, что выбрать?
            </h3>
            <p className="text-muted-foreground text-sm mb-5">
              Пройдите бесплатную самодиагностику или запишитесь на индивидуальную диагностику мастера —
              после неё вы получите персональные рекомендации по камням и практикам.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/diagnostika">
                <Button variant="default" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Диагностика
                </Button>
              </Link>
              <Link to="/quiz">
                <Button variant="outline">Пройти квиз</Button>
              </Link>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <div className="mt-12">
            <p className="text-muted-foreground/60 text-xs text-center mb-4">
              Или оставьте заявку на сайте — мы перезвоним
            </p>
            <ContactForm />
          </div>
        </AnimateOnScroll>
      </div>
    </main>
  );
};

export default Shop;

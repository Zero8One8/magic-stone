import { Link } from "react-router-dom";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { SITE_BLOG_DEFAULTS } from "@/content/siteDefaults";
import { useSiteContent } from "@/lib/siteContent";

const Blog = () => {
  const blogContent = useSiteContent("site_blog", SITE_BLOG_DEFAULTS);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>
          <Link to="/diagnostika" className="text-primary/70 hover:text-primary text-sm transition-colors">
            Диагностика мастера →
          </Link>
        </div>
      </div>

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <AnimateOnScroll>
            <p className="text-primary/60 text-sm tracking-[0.3em] uppercase mb-6">Знания</p>
            <h1 className="font-display text-4xl md:text-6xl font-light leading-[1.1] mb-6">
              Статьи <span className="text-gradient-gold italic">о камнях</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Полезные материалы о минералах, энергетике и практиках работы с камнями
            </p>
          </AnimateOnScroll>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {blogContent.articles.map((article, i) => (
            <AnimateOnScroll key={article.slug} delay={i * 80}>
              <Link
                to={`/blog/${article.slug}`}
                className="block group border border-border/50 rounded-xl bg-card/30 p-6 md:p-8 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-body px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                    <Clock className="w-3 h-3" /> {article.readTime}
                  </span>
                </div>
                <h2 className="font-display text-xl md:text-2xl font-light mb-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-sm text-primary font-body group-hover:gap-3 transition-all">
                  Читать <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Blog;

import { useParams, Link } from "react-router-dom";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { ArrowLeft, Clock } from "lucide-react";
import { SITE_BLOG_DEFAULTS } from "@/content/siteDefaults";
import { useSiteContent } from "@/lib/siteContent";

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const blogContent = useSiteContent("site_blog", SITE_BLOG_DEFAULTS);
  const article = blogContent.articles.find((entry) => entry.slug === slug);

  if (!article) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <h1 className="font-display text-3xl text-foreground">Статья не найдена</h1>
        <Link to="/blog" className="font-body text-primary underline underline-offset-4">
          Все статьи
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Все статьи
          </Link>
        </div>
      </div>

      <div className="pt-24 pb-20 px-6">
        <article className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-body px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                <Clock className="w-3 h-3" /> {article.readTime}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-light leading-[1.15] mb-8">
              {article.title}
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <div className="prose prose-invert max-w-none">
              {article.content.map((block, i) => {
                if (block.type === "h2") {
                  return (
                    <h2 key={i} className="font-display text-2xl font-light mt-10 mb-4 text-foreground">
                      {block.text}
                    </h2>
                  );
                }
                return (
                  <p key={i} className="font-body text-foreground/80 leading-relaxed mb-4">
                    {block.text}
                  </p>
                );
              })}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="mt-16">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
              <h3 className="font-display text-xl mb-3">{blogContent.cta.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {blogContent.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/quiz" className="font-body text-sm px-6 py-3 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors">
                  {blogContent.cta.quizButtonText}
                </Link>
                <Link to="/diagnostika" className="font-body text-sm px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  {blogContent.cta.diagnosticButtonText}
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </article>
      </div>
    </main>
  );
};

export default BlogArticle;

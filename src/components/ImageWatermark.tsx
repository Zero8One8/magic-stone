import { useEffect } from "react";

const MIN_WATERMARK_SIZE = 110;

const ImageWatermark = () => {
  useEffect(() => {
    const decorateImage = (img: HTMLImageElement) => {
      if (img.dataset.wmProcessed === "1") return;
      if (img.closest(".wm-wrap") || img.classList.contains("no-watermark")) return;
      if (!img.src || img.src.startsWith("data:image/svg")) return;

      const applyWrap = () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        if (width < MIN_WATERMARK_SIZE || height < MIN_WATERMARK_SIZE) {
          img.dataset.wmProcessed = "1";
          return;
        }

        const wrapper = document.createElement("span");
        wrapper.className = "wm-wrap";

        const computed = window.getComputedStyle(img);
        if (computed.display === "block") {
          wrapper.classList.add("wm-block");
        }

        const parent = img.parentElement;
        if (!parent) return;

        parent.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        img.dataset.wmProcessed = "1";
      };

      if (img.complete) {
        applyWrap();
      } else {
        img.addEventListener("load", applyWrap, { once: true });
        img.addEventListener(
          "error",
          () => {
            img.dataset.wmProcessed = "1";
          },
          { once: true }
        );
      }
    };

    const scan = (root: ParentNode) => {
      const images = root.querySelectorAll("img");
      images.forEach((img) => decorateImage(img as HTMLImageElement));
    };

    scan(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLImageElement) {
            decorateImage(node);
          } else if (node instanceof HTMLElement) {
            scan(node);
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
};

export default ImageWatermark;

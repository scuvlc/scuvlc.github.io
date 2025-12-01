/*
  动态加载 articles/ 下的 Markdown，渲染为首页“新闻资讯”的手风琴列表。
  要求：
  - 仅需在 articles/ 下新增/修改 Markdown 文件，无需改 HTML。
  - 支持本地文件与 GitHub Pages 部署（同源相对路径）。
  - 将文件名解析为标题；从 Markdown 第一行或 FrontMatter 中提取日期（可选）。
*/

(function () {
  const accordionId = 'news-accordion';
  const articlesDir = './articles/';

  /**
   * 获取 articles 目录下的 Markdown 文件列表。
   * 要求：articles/news11.json 一定存在，内容为文件名数组。
   */
  async function loadArticleList() {
    const manifestResp = await fetch(articlesDir + 'news11.json', { cache: 'no-cache' });
    if (!manifestResp.ok) {
      throw new Error('articles/news11.json not found');
    }
    const list = await manifestResp.json();
    if (!Array.isArray(list)) {
      throw new Error('articles/news11.json malformed');
    }
    return list.filter(Boolean);
  }

  function parseDateFromMarkdown(markdown) {
    // 支持 YAML frontmatter: ---\n date: YYYY-MM-DD \n---
    const fm = markdown.match(/^---[\s\S]*?---/);
    if (fm) {
      const dateMatch = fm[0].match(/date:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i);
      if (dateMatch) return dateMatch[1];
    }
    // 支持首行形如：# 标题 YYYY-MM-DD 或 [YYYY-MM-DD]
    const firstLine = markdown.split(/\r?\n/)[0] || '';
    const dateInline = firstLine.match(/(20[0-9]{2}-[0-9]{1,2}-[0-9]{1,2})/);
    if (dateInline) {
      const [y, m, d] = dateInline[1].split('-');
      return [y, m.padStart(2, '0'), d.padStart(2, '0')].join('-');
    }
    return '';
  }

  function parseTitleFromMarkdown(markdown) {
    // YAML frontmatter title: title: xxx
    const fm = markdown.match(/^---[\s\S]*?---/);
    if (fm) {
      const titleMatch = fm[0].match(/title:\s*(.+)/i);
      if (titleMatch) {
        return titleMatch[1].trim();
      }
    }
    // First H1 as title
    const h1 = markdown.match(/^#\s+(.+)$/m);
    if (h1) return h1[1].trim();
    return '';
  }

  function stripFrontmatter(markdown) {
    // 移除起始处的 YAML frontmatter 块
    if (markdown.startsWith('---')) {
      const match = markdown.match(/^---[\s\S]*?---\s*/);
      if (match) {
        return markdown.slice(match[0].length);
      }
    }
    return markdown;
  }

  function fileNameToTitle(fileName) {
    return fileName.replace(/\.md$/i, '');
  }

  function sortByDateDesc(items) {
    return items.sort((a, b) => {
      const ta = a.date ? Date.parse(a.date) : 0;
      const tb = b.date ? Date.parse(b.date) : 0;
      return tb - ta;
    });
  }

  function createAccordionItem(index, title, date, html) {
    const headingId = `news-heading-${index}`;
    const collapseId = `news-collapse-${index}`;
    return (
      '<div class="accordion-item">' +
      `  <h2 class="accordion-header" id="${headingId}">` +
      '    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" ' +
      `      data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">` +
      '      <div class="mt-1 d-flex w-100 justify-content-between">' +
      `        <h5 class="">${title}</h5>` +
      `        <h5 class="text-muted mx-3">${date || ''}</h5>` +
      '      </div>' +
      '    </button>' +
      '  </h2>' +
      `  <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headingId}" data-bs-parent="#${accordionId}">` +
      '    <div class="accordion-body">' +
      '      <div class="markdown-content">' + html + '</div>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  async function renderNews() {
    const container = document.getElementById(accordionId);
    if (!container) return;

    container.innerHTML = '<div class="text-muted p-3">加载中…</div>';

    let files = await loadArticleList();
    if (!files.length) {
      container.innerHTML = '<div class="text-muted p-3">暂无内容</div>';
      return;
    }

    // 拉取每篇文章内容
    const articles = await Promise.all(
      files.map(async (name) => {
        try {
          // 注意：不能对路径中的斜杠进行整体 encode（encodeURIComponent），否则会把 "/" 变成 %2F，
          // 在 GitHub Pages 这类静态托管上会导致 404。这里仅对每个路径段做编码，再用 "/" 连接。
          const encodedPath = name
            .split('/')
            .filter(Boolean)
            .map((seg) => encodeURIComponent(seg))
            .join('/');
          const resp = await fetch(articlesDir + encodedPath + `?t=${Date.now()}`);
          if (!resp.ok) throw new Error('not ok');
          const md = await resp.text();
          const fmTitle = parseTitleFromMarkdown(md);
          const title = fmTitle || fileNameToTitle(name);
          const date = parseDateFromMarkdown(md);
          const mdBody = stripFrontmatter(md);
          const rawHtml = (typeof marked !== 'undefined') ? marked.parse(mdBody) : mdBody;
          const safeHtml = (typeof DOMPurify !== 'undefined') ? DOMPurify.sanitize(rawHtml) : rawHtml;
          return { title, date, html: safeHtml };
        } catch (_) {
          return null;
        }
      })
    );

    const valid = articles.filter(Boolean);
    if (!valid.length) {
      container.innerHTML = '<div class="text-muted p-3">暂无可展示的文章</div>';
      return;
    }

    sortByDateDesc(valid);

    // 生成手风琴
    const html = valid.map((a, idx) => createAccordionItem(idx, a.title, a.date, a.html)).join('\n');
    container.innerHTML = html;
  }

  // 等待文档与依赖加载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderNews);
  } else {
    renderNews();
  }
})();



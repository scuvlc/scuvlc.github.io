fetch('https://gitee.com/zinkt/zinkt.github.io/raw/master/README.md')
    .then(response => response.text())
    .then(text => {
        // 处理Markdown文件内容，将其显示在页面上
        document.getElementById('markdown-content').innerHTML = marked(text);
    });
// 示例js，对每篇文章进行修改
// 因为是静态页面，遍历读取需要token，较为麻烦，实现丑陋、、、
// 引入此js前，请引入marked.js

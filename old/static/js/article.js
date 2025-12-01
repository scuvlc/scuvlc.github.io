function getQueryString(name) {
    const url_string = window.location.href; // window.location.href
    const url = new URL(url_string);
    return url.searchParams.get(name);
  }
  
//   console.log(getQueryString('name')) // mick
//   console.log(getQueryString('age')) // 20


getQueryString('name')








// fetch('https://raw.githubusercontent.com/zinkt/zinkt.github.io/master/articles/%E8%AF%BE%E9%A2%98%E7%BB%84%E5%AD%99%E5%A5%95%E9%AB%A6%E8%80%81%E5%B8%88%E5%9C%A8%E4%BF%A1%E5%8F%B7%E5%A4%84%E7%90%86%E9%A1%B6%E7%BA%A7%E4%BC%9A%E8%AE%AEICASSP2023%E5%8F%91%E8%A1%A8%E8%AE%BA%E6%96%87%E5%B9%B6%E5%8F%82%E4%BC%9A.md')
//     .then(response => response.text())
//     .then(text => {
//         // 处理Markdown文件内容，将其显示在页面上
//         document.getElementById('markdown-content').innerHTML = marked(text);
//     });
// 示例js，对每篇文章进行修改
// 因为是静态页面，遍历读取需要token，较为麻烦，实现丑陋、、、
// 引入此js前，请引入marked.js

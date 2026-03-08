// 根据#markdown-content内的[h1, h2, h3]标签生成目录
const titleTag = ["H1", "H2", "H3"];
let titles = [];
var items = [];

const post_content = document.getElementById("markdown-content");
post_content.childNodes.forEach((e, index) => {
  if (titleTag.includes(e.nodeName)) {
    // 设置元素id
    const id = "header-" + index;
    e.setAttribute("id", id);
    // 把<h>标签，解析成一个树，丢到titles内
    titles.push({
      id: id,
      title: e.innerText,
      level: Number(e.nodeName.substring(1, 2))
    });
    // 将其推入items中，用于页面滚动
    items.push(e);
  }
});

for (index in titles) {
  document.getElementById("catalog").innerHTML +=
    "<li style='text-indent: " +
    (titles[index].level * 1.5 - 0.5) +
    "em;'>" +
    "<a href='#" +
    titles[index].id +
    "'>" +
    titles[index].title +
    "</a>" +
    "</li>";
}

// ***** 跟随滚动 ******

var itemHeights = [];
var lis = [...document.querySelectorAll("#catalog > li")];
for (var i = 0; i < items.length; i++) {
  itemHeights.push(items[i].getBoundingClientRect().top);
}

// 监听scroll事件，更新目录item状态
window.addEventListener("scroll", updateCatalog);

function updateCatalog() {
  // 不是56px的原因是，给足边界
  var scop = document.documentElement.scrollTop + 76;
  var k = 0;
  for (var i = 0; i < itemHeights.length; i++) {
    if(scop > itemHeights[i]) {
      k = i;
    }
  }
  lis[k].classList.add('current');
  for(var i = 0; i < lis.length; i++) {
    if(i == k) continue;
    else lis[i].classList.remove('current');
  }
}

// 在下滑到目录时，使目录跟随
let catalogCard = document.getElementById("catalogCard");
window.addEventListener('scroll',function(e){
  if(window.pageYOffset > catalog.offsetTop){
    catalogCard.classList.add('sticky-top');
  }else{
    catalogCard.classList.remove('sticky-top');
  }
})
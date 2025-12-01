// Image Modal Handler for News Images
(function() {
    'use strict';

    // 创建模态框HTML结构
    function createImageModal() {
        const modalHTML = `
            <div id="imageModal" class="image-modal">
                <span class="image-modal-close" aria-label="关闭">&times;</span>
                <img class="image-modal-content" id="modalImage" alt="放大图片">
                <div class="image-modal-caption" id="modalCaption"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // 初始化模态框功能
    function initImageModal() {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const closeBtn = document.querySelector('.image-modal-close');

        if (!modal) return;

        // 关闭模态框
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        // 点击关闭按钮
        closeBtn.addEventListener('click', closeModal);

        // 点击模态框背景关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // 为所有新闻内容中的图片添加点击事件
        function attachImageClickHandlers() {
            const newsImages = document.querySelectorAll('.markdown-content img');
            
            newsImages.forEach(img => {
                // 移除之前的事件监听器（如果有）
                img.style.cursor = 'pointer';
                
                // 添加点击事件
                img.addEventListener('click', function() {
                    modal.classList.add('active');
                    modalImg.src = this.src;
                    modalImg.alt = this.alt || '新闻图片';
                    
                    // 设置标题（使用alt或父元素的文本）
                    const caption = this.alt || this.title || '';
                    if (caption) {
                        modalCaption.textContent = caption;
                        modalCaption.style.display = 'block';
                    } else {
                        modalCaption.style.display = 'none';
                    }
                    
                    // 防止页面滚动
                    document.body.style.overflow = 'hidden';
                });
            });
        }

        // 初始化时附加事件
        attachImageClickHandlers();

        // 监听手风琴展开事件，为新加载的图片添加事件
        const accordion = document.getElementById('news-accordion');
        if (accordion) {
            // 使用MutationObserver监听DOM变化
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // 延迟一下确保图片已加载
                        setTimeout(attachImageClickHandlers, 100);
                    }
                });
            });

            observer.observe(accordion, {
                childList: true,
                subtree: true
            });

            // 监听手风琴展开事件
            accordion.addEventListener('shown.bs.collapse', function() {
                setTimeout(attachImageClickHandlers, 100);
            });
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            createImageModal();
            // 延迟初始化，确保新闻内容已加载
            setTimeout(initImageModal, 500);
        });
    } else {
        createImageModal();
        setTimeout(initImageModal, 500);
    }

    // 导出全局函数，供外部调用
    window.refreshImageModalHandlers = function() {
        setTimeout(initImageModal, 100);
    };

})();

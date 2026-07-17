// Feature Card Modal Handler
document.addEventListener('DOMContentLoaded', function() {
    // Feature card 详细信息
    const featureDetails = {
        'sensing': {
            title: '先进感知',
            subtitle: 'Advanced Sensing',
            icon: 'fas fa-eye',
            description: '面向复杂环境与智能系统，研究融合光学、视觉、无线信号和多模态信息的先进感知方法。',
            features: [
                '多模态感知与信息融合',
                '目标检测、定位与行为理解',
                '智能信号处理与环境感知',
                '面向真实场景的可靠感知'
            ],
            applications: [
                '室内定位与导航',
                '环境监测',
                '智能交互',
                '工业感知'
            ]
        },
        'isac': {
            title: '通感一体化',
            subtitle: 'Integrated Sensing and Communication',
            icon: 'fas fa-satellite-dish',
            description: '研究通信与感知功能的深度融合，重点探索可见光通信、无线光通信及面向智能场景的通感一体化技术。',
            features: [
                '可见光通信与光无线通信',
                '通信与感知资源协同',
                '智能编解码与信号优化',
                '多模态通感信息融合'
            ],
            applications: [
                '室内定位',
                '智能照明',
                '6G网络',
                '工业互联网'
            ]
        },
        'edge-networks': {
            title: '边缘网络',
            subtitle: 'Edge Networks',
            icon: 'fas fa-network-wired',
            description: '研究计算、通信与感知在网络边缘的协同机制，为低时延、可信赖的智能服务提供支撑。',
            features: [
                '边缘计算与端边云协同',
                '资源调度与任务卸载',
                '低时延网络服务',
                '分布式智能与隐私保护'
            ],
            applications: [
                '智能物联网',
                '智慧城市',
                '协同感知',
                '工业互联网'
            ]
        },
        'iot': {
            title: '物联网',
            subtitle: 'Internet of Things',
            icon: 'fas fa-microchip',
            description: '研究面向万物互联的感知、连接、计算与数据协同技术，构建高效、安全、智能的物联网系统。',
            features: [
                '多源异构设备互联',
                '轻量化感知与低功耗通信',
                '端边云协同处理',
                '物联网数据安全与智能分析'
            ],
            applications: [
                '智能家居',
                '智慧城市',
                '工业物联网',
                '环境监测'
            ]
        },
        'embodied-ai': {
            title: '具身智能',
            subtitle: 'Embodied AI',
            icon: 'fas fa-robot',
            description: '研究智能体通过感知、学习与行动同真实环境交互的方法，推动多模态感知、边缘智能与自主决策的融合。',
            features: [
                '多模态环境感知与理解',
                '感知决策控制闭环',
                '端侧模型与实时推理',
                '多智能体协同学习'
            ],
            applications: [
                '智能机器人',
                '工业自动化',
                '智慧空间',
                '人机协作'
            ]
        },
        'low-altitude-networks': {
            title: '低空智联网',
            subtitle: 'Low-Altitude Intelligent Networks',
            icon: 'fas fa-plane',
            description: '研究面向无人机和低空智能体的通信、感知、组网与边缘计算技术，支撑安全高效的低空智能应用。',
            features: [
                '空地协同通信与组网',
                '低空目标感知与定位',
                '无人机边缘计算与任务协同',
                '动态网络资源调度'
            ],
            applications: [
                '低空物流',
                '应急通信',
                '巡检测绘',
                '城市治理'
            ]
        }
    };

    // 创建模态框 HTML
    const modalHTML = `
        <div class="modal fade" id="featureModal" tabindex="-1" aria-labelledby="featureModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div class="modal-content" style="border: none; border-radius: 1rem; overflow: hidden; max-height: 90vh;">
                    <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #0f766e 100%); color: white; border: none; padding: 1.5rem;">
                        <div>
                            <h4 class="modal-title" id="featureModalLabel" style="font-weight: 700; margin-bottom: 0.5rem; color: white; font-size: 1.25rem;">
                                <i id="modalIcon" class="me-2"></i>
                                <span id="modalTitle"></span>
                            </h4>
                            <p class="mb-0" id="modalSubtitle" style="opacity: 0.9; font-size: 0.9rem; color: white;"></p>
                        </div>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem; overflow-y: auto;">
                        <div class="mb-3">
                            <h6 class="fw-bold mb-2" style="color: #667eea; font-size: 1rem;">
                                <i class="fas fa-info-circle me-2"></i>技术简介
                            </h6>
                            <p id="modalDescription" style="line-height: 1.6; color: #555; font-size: 0.95rem;"></p>
                        </div>
                        
                        <div class="mb-3">
                            <h6 class="fw-bold mb-2" style="color: #667eea; font-size: 1rem;">
                                <i class="fas fa-star me-2"></i>核心特点
                            </h6>
                            <ul id="modalFeatures" style="line-height: 1.8; color: #555; font-size: 0.9rem; padding-left: 1.2rem;"></ul>
                        </div>
                        
                        <div>
                            <h6 class="fw-bold mb-2" style="color: #667eea; font-size: 1rem;">
                                <i class="fas fa-rocket me-2"></i>应用场景
                            </h6>
                            <div id="modalApplications" class="d-flex flex-wrap gap-2"></div>
                        </div>
                    </div>
                    <div class="modal-footer" style="border: none; padding: 1rem 1.5rem; background: #f8f9fa;">
                        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal" style="border-radius: 0.5rem;">关闭</button>
                        <a href="/indexs/research.html" class="btn btn-primary btn-sm" style="background: linear-gradient(135deg, #667eea 0%, #0f766e 100%); border: none; border-radius: 0.5rem;">
                            了解更多 <i class="fas fa-arrow-right ms-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 将模态框添加到页面
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 获取模态框实例
    const featureModal = new bootstrap.Modal(document.getElementById('featureModal'));

    // 为所有 feature-card 添加点击事件
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card) => {
        // 添加鼠标指针样式
        card.style.cursor = 'pointer';

        const featureKey = card.dataset.feature;
        
        if (featureKey && featureDetails[featureKey]) {
            card.addEventListener('click', function() {
                const detail = featureDetails[featureKey];
                
                // 更新模态框内容
                document.getElementById('modalIcon').className = detail.icon;
                document.getElementById('modalTitle').textContent = detail.title;
                document.getElementById('modalSubtitle').textContent = detail.subtitle;
                document.getElementById('modalDescription').textContent = detail.description;
                
                // 更新特点列表
                const featuresList = document.getElementById('modalFeatures');
                featuresList.innerHTML = '';
                detail.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fas fa-check-circle me-2" style="color: #667eea;"></i>${feature}`;
                    featuresList.appendChild(li);
                });
                
                // 更新应用场景
                const applicationsDiv = document.getElementById('modalApplications');
                applicationsDiv.innerHTML = '';
                detail.applications.forEach(app => {
                    const badge = document.createElement('span');
                    badge.className = 'badge';
                    badge.style.cssText = 'background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(15, 118, 110, 0.1)); color: #667eea; padding: 0.5rem 1rem; font-size: 0.9rem; font-weight: 500; border: 1px solid rgba(102, 126, 234, 0.2);';
                    badge.textContent = app;
                    applicationsDiv.appendChild(badge);
                });
                
                // 显示模态框
                featureModal.show();
            });
        }
    });
});

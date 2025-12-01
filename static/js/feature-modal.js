// Feature Card Modal Handler
document.addEventListener('DOMContentLoaded', function() {
    // Feature card 详细信息
    const featureDetails = {
        'vlc': {
            title: '可见光通信',
            subtitle: 'Visible Light Communication',
            icon: 'fas fa-wifi',
            description: '可见光通信（VLC）是一种利用可见光波段进行数据传输的新型无线通信技术。通过调制LED灯光的明暗变化，实现高速、安全的数据传输。',
            features: [
                '高速数据传输：支持Gbps级别的传输速率',
                '绿色环保：利用现有照明设备，节能环保',
                '安全可靠：光信号无法穿透墙壁，天然防窃听',
                '频谱丰富：不受无线电频谱限制，无电磁干扰'
            ],
            applications: [
                '室内定位与导航',
                '智能照明系统',
                '水下通信',
                '医疗场景通信'
            ]
        },
        'sensing': {
            title: '智能感知',
            subtitle: 'Intelligent Sensing',
            icon: 'fas fa-brain',
            description: '智能感知技术结合人工智能与传感器技术，实现对环境、物体和行为的智能识别与分析。通过深度学习和多模态大模型技术，融合视觉、声音、光学等多种感知方式，提供精准的跨模态理解与推理能力。',
            features: [
                '多模态融合：整合视觉、声音、光学等多种感知数据',
                '实时处理：毫秒级响应，支持实时决策',
                '自适应学习：持续优化感知模型',
                '边缘计算：本地化处理，保护隐私'
            ],
            applications: [
                '智能家居控制',
                '工业质量检测',
                '健康监测',
                '环境监控'
            ]
        },
        'iot': {
            title: '物联网',
            subtitle: 'Internet of Things',
            icon: 'fas fa-network-wired',
            description: '物联网（IoT）通过互联网连接各种物理设备，实现设备间的信息交换和智能控制。构建万物互联的智能生态系统。',
            features: [
                '海量连接：支持数十亿设备同时在线',
                '低功耗设计：延长设备使用寿命',
                '云端协同：云计算与边缘计算结合',
                '安全防护：多层次安全机制保障'
            ],
            applications: [
                '智慧城市建设',
                '智能交通系统',
                '农业物联网',
                '工业互联网'
            ]
        },
        'isac': {
            title: '通感一体化',
            subtitle: 'Integrated Sensing and Communication',
            icon: 'fas fa-satellite-dish',
            description: '通感一体化（ISAC）是将通信与感知功能深度融合的创新技术。通过共享硬件和频谱资源，利用深度学习和大模型融合通信与感知数据，实现智能化决策，同时完成高效通信和精准感知任务。',
            features: [
                '资源共享：通信与感知共用频谱和硬件',
                '协同增强：通信辅助感知，感知优化通信',
                '频谱高效：提升频谱利用率',
                '成本优化：减少硬件冗余'
            ],
            applications: [
                '自动驾驶辅助',
                '智能机器人',
                '无人机系统',
                '6G通信网络'
            ]
        },
        'localization': {
            title: '目标位置感知',
            subtitle: 'Target Localization & Positioning',
            icon: 'fas fa-location-crosshairs',
            description: '目标位置感知技术通过多种传感器和算法，实现对目标物体的精确定位和追踪。结合无线信号、光学、声学等多模态信息，提供厘米级定位精度。',
            features: [
                '高精度定位：厘米级定位精度，满足精细化应用需求',
                '多模态融合：整合WiFi、蓝牙、UWB、可见光等多种定位技术',
                '实时追踪：动态目标实时跟踪，响应延迟低于100ms',
                '抗干扰能力：复杂环境下保持稳定的定位性能'
            ],
            applications: [
                '室内导航定位',
                '智能仓储管理',
                '无人驾驶定位',
                '机器人路径规划'
            ]
        },
        'signal': {
            title: '智能信号处理',
            subtitle: 'Intelligent Signal Processing',
            icon: 'fas fa-wave-square',
            description: '智能信号处理技术融合传统信号处理理论与人工智能算法，实现对复杂信号的智能分析、识别和优化。通过深度学习提升信号处理的准确性和效率。',
            features: [
                '自适应滤波：智能调整滤波参数，适应不同信号环境',
                '深度学习增强：利用神经网络提升信号识别准确率',
                '噪声抑制：先进的降噪算法，提高信噪比',
                '特征提取：自动提取信号关键特征，支持智能决策'
            ],
            applications: [
                '语音识别增强',
                '通信信号优化',
                '生物医学信号分析',
                '雷达信号处理'
            ]
        }
    };

    // 创建模态框 HTML
    const modalHTML = `
        <div class="modal fade" id="featureModal" tabindex="-1" aria-labelledby="featureModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div class="modal-content" style="border: none; border-radius: 1rem; overflow: hidden; max-height: 90vh;">
                    <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 1.5rem;">
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
                        <a href="/indexs/research.html" class="btn btn-primary btn-sm" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 0.5rem;">
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
    featureCards.forEach((card, index) => {
        // 添加鼠标指针样式
        card.style.cursor = 'pointer';
        
        // 根据索引确定对应的功能
        const featureKeys = ['vlc', 'sensing', 'iot', 'isac', 'localization', 'signal'];
        const featureKey = featureKeys[index];
        
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
                    badge.style.cssText = 'background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); color: #667eea; padding: 0.5rem 1rem; font-size: 0.9rem; font-weight: 500; border: 1px solid rgba(102, 126, 234, 0.2);';
                    badge.textContent = app;
                    applicationsDiv.appendChild(badge);
                });
                
                // 显示模态框
                featureModal.show();
            });
        }
    });
});

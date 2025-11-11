// 简单的SHA-256实现（用于演示）
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// 计算哈希演示
async function calculateHash() {
    const input = document.getElementById('hash-input').value;
    const result = document.getElementById('hash-result');
    
    if (!input) {
        result.textContent = '请先输入一些文本...';
        return;
    }
    
    const hash = await sha256(input);
    result.textContent = hash;
}

// 交易演示
let transactionCount = 2;
function addTransaction() {
    transactionCount++;
    const chain = document.getElementById('transaction-chain');
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'];
    const from = names[Math.floor(Math.random() * names.length)];
    let to = names[Math.floor(Math.random() * names.length)];
    while (to === from) {
        to = names[Math.floor(Math.random() * names.length)];
    }
    const amount = (Math.random() * 5 + 0.1).toFixed(2);
    const signature = Math.random().toString(36).substring(2, 8) + '...' + Math.random().toString(36).substring(2, 6);
    
    const txBox = document.createElement('div');
    txBox.className = 'transaction-box';
    txBox.innerHTML = `
        <div class="tx-header">交易 #${transactionCount}</div>
        <div class="tx-content">
            <p><strong>从：</strong>${from}</p>
            <p><strong>到：</strong>${to}</p>
            <p><strong>金额：</strong>${amount} BTC</p>
            <p><strong>签名：</strong><code class="signature">${signature}</code></p>
        </div>
        <div class="tx-arrow">→</div>
    `;
    chain.appendChild(txBox);
    chain.scrollLeft = chain.scrollWidth;
}

function resetTransactions() {
    transactionCount = 2;
    const chain = document.getElementById('transaction-chain');
    chain.innerHTML = `
        <div class="transaction-box">
            <div class="tx-header">交易 #1</div>
            <div class="tx-content">
                <p><strong>从：</strong>Alice</p>
                <p><strong>到：</strong>Bob</p>
                <p><strong>金额：</strong>1 BTC</p>
                <p><strong>签名：</strong><code class="signature">3045...a7b2</code></p>
            </div>
            <div class="tx-arrow">→</div>
        </div>
        <div class="transaction-box">
            <div class="tx-header">交易 #2</div>
            <div class="tx-content">
                <p><strong>从：</strong>Bob</p>
                <p><strong>到：</strong>Charlie</p>
                <p><strong>金额：</strong>1 BTC</p>
                <p><strong>签名：</strong><code class="signature">4156...c8d3</code></p>
            </div>
            <div class="tx-arrow">→</div>
        </div>
    `;
}

// 挖矿演示
let miningInterval;
let attempts = 0;

async function startMining() {
    const difficulty = parseInt(document.getElementById('difficulty').value);
    const blockData = document.getElementById('block-data').value;
    const target = '0'.repeat(difficulty);
    
    document.getElementById('mine-btn').style.display = 'none';
    document.getElementById('stop-btn').style.display = 'inline-block';
    document.getElementById('mining-result').style.display = 'none';
    
    attempts = 0;
    let nonce = 0;
    let found = false;
    
    // 使用异步循环避免阻塞UI
    async function mine() {
        if (found) return;
        
        const hash = await sha256(blockData + nonce);
        attempts++;
        
        document.getElementById('current-nonce').textContent = nonce;
        document.getElementById('attempts').textContent = attempts;
        document.getElementById('current-hash').textContent = hash;
        
        if (hash.startsWith(target)) {
            found = true;
            document.getElementById('mine-btn').style.display = 'inline-block';
            document.getElementById('stop-btn').style.display = 'none';
            document.getElementById('mining-result').style.display = 'block';
            document.getElementById('found-nonce').textContent = nonce;
            document.getElementById('valid-hash').textContent = hash;
            document.getElementById('total-attempts').textContent = attempts;
            clearInterval(miningInterval);
        } else {
            nonce++;
        }
    }
    
    // 每隔一小段时间执行一批计算
    miningInterval = setInterval(() => {
        for (let i = 0; i < 1000 && !found; i++) {
            mine();
        }
    }, 10);
}

function stopMining() {
    clearInterval(miningInterval);
    document.getElementById('mine-btn').style.display = 'inline-block';
    document.getElementById('stop-btn').style.display = 'none';
}

// 数字签名演示
let privateKey = '';
let publicKey = '';
let currentSignature = '';
let currentMessage = '';

function generateKeys() {
    // 简化的密钥生成（实际中使用真正的加密库）
    privateKey = 'PRIV_' + Array.from({length: 32}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('');
    publicKey = 'PUB_' + Array.from({length: 32}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('');
    
    document.getElementById('private-key').textContent = privateKey;
    document.getElementById('public-key').textContent = publicKey;
}

async function signMessage() {
    if (!privateKey) {
        alert('请先生成密钥对！');
        return;
    }
    
    currentMessage = document.getElementById('message-to-sign').value;
    if (!currentMessage) {
        alert('请输入要签名的消息！');
        return;
    }
    
    // 简化的签名（实际中使用真正的数字签名算法）
    const hash = await sha256(currentMessage + privateKey);
    currentSignature = 'SIG_' + hash.substring(0, 40);
    
    document.getElementById('signature-output').textContent = currentSignature;
    document.getElementById('tampered-message').value = currentMessage;
}

async function verifySignature() {
    if (!currentSignature) {
        alert('请先签名一条消息！');
        return;
    }
    
    const resultDiv = document.getElementById('verification-result');
    const expectedHash = await sha256(currentMessage + privateKey);
    const expectedSig = 'SIG_' + expectedHash.substring(0, 40);
    
    if (currentSignature === expectedSig) {
        resultDiv.innerHTML = `
            <div style="background: #c8e6c9; padding: 1rem; border-radius: 5px; border-left: 4px solid #4caf50;">
                <h4 style="color: #2e7d32;">✅ 验证成功！</h4>
                <p>签名有效：消息确实来自私钥持有者，且未被篡改。</p>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div style="background: #ffcdd2; padding: 1rem; border-radius: 5px; border-left: 4px solid #f44336;">
                <h4 style="color: #c62828;">❌ 验证失败！</h4>
                <p>签名无效：消息可能被篡改或签名不匹配。</p>
            </div>
        `;
    }
}

async function verifyTamperedMessage() {
    if (!currentSignature) {
        alert('请先签名一条消息！');
        return;
    }
    
    const tamperedMsg = document.getElementById('tampered-message').value;
    const resultDiv = document.getElementById('tamper-result');
    
    if (tamperedMsg === currentMessage) {
        resultDiv.innerHTML = `
            <div style="background: #c8e6c9; padding: 1rem; border-radius: 5px; margin-top: 1rem;">
                <h4 style="color: #2e7d32;">✅ 验证成功</h4>
                <p>消息未被修改，签名有效。</p>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div style="background: #ffcdd2; padding: 1rem; border-radius: 5px; margin-top: 1rem;">
                <h4 style="color: #c62828;">❌ 验证失败！</h4>
                <p>消息已被篡改！签名不再有效。</p>
                <p><strong>原始消息：</strong>"${currentMessage}"</p>
                <p><strong>篡改后消息：</strong>"${tamperedMsg}"</p>
                <p>这证明了数字签名能检测任何消息的修改！</p>
            </div>
        `;
    }
}

// 区块链可视化演示
let blockchain = [];
let blockIdCounter = 1;

async function initBlockchain() {
    blockchain = [];
    blockIdCounter = 1;
    await addBlockToChain();
    renderBlockchain();
}

async function addBlockToChain() {
    const previousHash = blockchain.length > 0 ? blockchain[blockchain.length - 1].hash : '0000000000000000';
    const data = `交易 ${String.fromCharCode(65 + blockchain.length)}, ${String.fromCharCode(66 + blockchain.length)}, ${String.fromCharCode(67 + blockchain.length)}`;
    const timestamp = new Date().toLocaleString('zh-CN');
    const blockString = previousHash + data + timestamp;
    const hash = await sha256(blockString);
    
    const block = {
        id: blockIdCounter++,
        data: data,
        timestamp: timestamp,
        previousHash: previousHash.substring(0, 12) + '...',
        hash: hash.substring(0, 12) + '...',
        fullHash: hash,
        fullPrevHash: previousHash,
        valid: true
    };
    
    blockchain.push(block);
    renderBlockchain();
    updateTamperSelect();
}

function renderBlockchain() {
    const display = document.getElementById('blockchain-display');
    if (!display) return;
    
    display.innerHTML = '';
    
    blockchain.forEach((block, index) => {
        const blockDiv = document.createElement('div');
        blockDiv.style.display = 'flex';
        blockDiv.style.alignItems = 'center';
        
        const blockEl = document.createElement('div');
        blockEl.className = `block ${block.valid ? 'valid' : 'invalid'}`;
        blockEl.innerHTML = `
            <div class="block-header">区块 #${block.id}</div>
            <div class="block-content">
                <p><strong>数据：</strong>${block.data}</p>
                <p><strong>前一个哈希：</strong><code class="hash">${block.previousHash}</code></p>
                <p><strong>时间戳：</strong>${block.timestamp}</p>
                <p><strong>当前哈希：</strong><code class="hash">${block.hash}</code></p>
                ${!block.valid ? '<p style="color: #f44336; font-weight: bold; margin-top: 0.5rem;">⚠️ 无效区块</p>' : ''}
            </div>
        `;
        
        blockDiv.appendChild(blockEl);
        
        if (index < blockchain.length - 1) {
            const arrow = document.createElement('div');
            arrow.className = 'chain-arrow';
            arrow.textContent = '⛓️';
            blockDiv.appendChild(arrow);
        }
        
        display.appendChild(blockDiv);
    });
}

function updateTamperSelect() {
    const select = document.getElementById('block-to-tamper');
    if (!select) return;
    
    select.innerHTML = '';
    blockchain.forEach((block) => {
        const option = document.createElement('option');
        option.value = block.id;
        option.textContent = `区块 #${block.id}`;
        select.appendChild(option);
    });
}

async function tamperBlock() {
    const blockId = parseInt(document.getElementById('block-to-tamper').value);
    const newData = document.getElementById('new-block-data').value;
    
    if (!newData) {
        alert('请输入新的区块数据！');
        return;
    }
    
    const blockIndex = blockchain.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;
    
    // 修改区块数据
    blockchain[blockIndex].data = newData;
    const blockString = blockchain[blockIndex].fullPrevHash + newData + blockchain[blockIndex].timestamp;
    const newHash = await sha256(blockString);
    blockchain[blockIndex].fullHash = newHash;
    blockchain[blockIndex].hash = newHash.substring(0, 12) + '...';
    blockchain[blockIndex].valid = false;
    
    // 检查后续区块
    for (let i = blockIndex + 1; i < blockchain.length; i++) {
        if (blockchain[i].fullPrevHash !== blockchain[i - 1].fullHash) {
            blockchain[i].valid = false;
        }
    }
    
    renderBlockchain();
    
    const explanation = document.getElementById('tamper-explanation');
    explanation.innerHTML = `
        <div style="background: #ffcdd2; padding: 1.5rem; border-radius: 8px; margin-top: 1rem; border-left: 4px solid #f44336;">
            <h4 style="color: #c62828;">⚠️ 检测到篡改！</h4>
            <p><strong>被篡改的区块：</strong>区块 #${blockId}</p>
            <p><strong>影响：</strong></p>
            <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                <li>区块 #${blockId} 的哈希值已改变</li>
                ${blockIndex < blockchain.length - 1 ? `<li>后续所有区块的"前一个哈希"都不匹配了</li>` : ''}
                <li>整个链条的完整性被破坏</li>
                <li>所有节点都能立即检测到这个篡改</li>
            </ul>
            <p style="margin-top: 1rem;"><strong>这就是为什么区块链不可篡改！</strong>要成功篡改，攻击者必须：</p>
            <ol style="margin-left: 1.5rem;">
                <li>重新计算被篡改区块的工作量证明</li>
                <li>重新计算后续所有区块的工作量证明</li>
                <li>比诚实节点更快完成这些计算</li>
            </ol>
            <p style="margin-top: 1rem;">在实际的比特币网络中，这几乎是不可能的！</p>
        </div>
    `;
}

function resetBlockchain() {
    initBlockchain();
    document.getElementById('tamper-explanation').innerHTML = '';
    document.getElementById('new-block-data').value = '';
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化区块链演示
    if (document.getElementById('blockchain-display')) {
        initBlockchain();
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 导航栏滚动效果
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // 添加观察者以实现滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有内容盒子
    document.querySelectorAll('.content-box, .demo-box, .section-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// 添加一些实用函数
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // 可以添加一个提示
        console.log('已复制到剪贴板');
    }).catch(err => {
        console.error('复制失败:', err);
    });
}

// 格式化数字
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 格式化哈希（缩短显示）
function formatHash(hash, length = 12) {
    if (hash.length <= length) return hash;
    return hash.substring(0, length) + '...';
}

// 生成随机哈希（用于演示）
function generateRandomHash() {
    return Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('');
}

// 验证哈希难度
function validateHash(hash, difficulty) {
    const target = '0'.repeat(difficulty);
    return hash.startsWith(target);
}

// 计算挖矿难度
function calculateDifficulty(leadingZeros) {
    return Math.pow(16, leadingZeros);
}

// 动态加载更多内容的占位函数
async function loadMoreContent() {
    // 可以用于动态加载更多章节
    console.log('加载更多内容...');
}

// 搜索功能（可扩展）
function searchContent(query) {
    // 可以实现站内搜索
    console.log('搜索:', query);
}

// 保存学习进度（可扩展）
function saveProgress(section) {
    localStorage.setItem('bitcoinWhitepaperProgress', section);
}

function loadProgress() {
    return localStorage.getItem('bitcoinWhitepaperProgress');
}

// 主题切换（可扩展）
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// 分享功能
function shareContent(section) {
    if (navigator.share) {
        navigator.share({
            title: '比特币白皮书详解',
            text: `查看比特币白皮书的详细解释：${section}`,
            url: window.location.href
        }).catch(err => console.log('分享失败:', err));
    } else {
        copyToClipboard(window.location.href);
        alert('链接已复制到剪贴板！');
    }
}

// 打印友好格式
function preparePrint() {
    window.print();
}

// 反馈收集（占位函数）
function submitFeedback(feedback) {
    console.log('用户反馈:', feedback);
    // 可以发送到服务器
}

// 添加书签
function addBookmark(section) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (!bookmarks.includes(section)) {
        bookmarks.push(section);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        alert('已添加到书签！');
    } else {
        alert('该章节已在书签中！');
    }
}

// 获取书签列表
function getBookmarks() {
    return JSON.parse(localStorage.getItem('bookmarks') || '[]');
}

// 统计阅读时间
let readingStartTime = Date.now();

function getReadingTime() {
    const elapsed = Date.now() - readingStartTime;
    const minutes = Math.floor(elapsed / 60000);
    return minutes;
}

// 定期保存阅读进度
setInterval(() => {
    const currentSection = getCurrentSection();
    if (currentSection) {
        saveProgress(currentSection);
    }
}, 30000); // 每30秒保存一次

function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = null;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.id;
        }
    });
    
    return currentSection;
}

// 进度指示器
function updateProgressIndicator() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    // 更新进度条
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
    
    // 显示/隐藏返回顶部按钮
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (scrollTop > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    return scrollPercent;
}

// 返回顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.addEventListener('scroll', updateProgressIndicator);

console.log('比特币白皮书详解网站已加载 ✓');
console.log('作者：中本聪 (Satoshi Nakamoto)');
console.log('译者：致力于让每个人都能理解区块链技术');

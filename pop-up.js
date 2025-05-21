// pop-up.js

// Function to create and show a modal with given content
function showModal(content) {
    // Create modal elements
    const modalOverlay = document.createElement('div');
    const modalBox = document.createElement('div');
    const closeButton = document.createElement('button');

    // Style modal overlay
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = 0;
    modalOverlay.style.left = 0;
    modalOverlay.style.width = '100vw';
    modalOverlay.style.height = '100vh';
    modalOverlay.style.background = 'rgba(0,0,0,0.5)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.zIndex = 10000;

    // Style modal box
    modalBox.style.background = '#fff';
    modalBox.style.padding = '24px';
    modalBox.style.borderRadius = '8px';
    modalBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    modalBox.style.maxWidth = '90vw';
    modalBox.style.maxHeight = '90vh';
    modalBox.style.overflow = 'auto';

    // Style close button
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '16px';

    // Close modal on button click
    closeButton.onclick = () => document.body.removeChild(modalOverlay);

    // Add content and button to modal box
    modalBox.innerHTML = content;
    modalBox.appendChild(closeButton);

    // Add modal box to overlay
    modalOverlay.appendChild(modalBox);

    // Add overlay to body
    document.body.appendChild(modalOverlay);
}

// スクリプト自身のsrcからurlパラメータを取得
function getFetchUrlFromScript() {
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
        if (script.src && script.src.includes('pop-up.js')) {
            const src = script.src;
            const query = src.split('?')[1];
            if (query) {
                const params = new URLSearchParams(query);
                return params.get('url');
            }
        }
    }
    return null;
}

const fetchUrl = getFetchUrlFromScript();

if (fetchUrl) {
    // Fetch JSON and show modal after 3 seconds
    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            setTimeout(() => {
                // ボタンを含むHTMLを生成
                const content = `
                    <div>
                        <p>${data.message}</p>
                        <button id="popup-link-btn" style="margin-top:16px;">${data.bottonTxt}</button>
                    </div>
                `;
                showModal(content);

                // モーダル表示後にボタンへイベントを追加
                setTimeout(() => {
                    const btn = document.getElementById('popup-link-btn');
                    if (btn) {
                        btn.onclick = () => {
                            window.open(data.linkcode, '_blank');
                        };
                    }
                }, 0);
            }, 3000);
        })
        .catch(error => {
            console.error('Failed to fetch JSON:', error);
        });
} else {
    console.error('URLパラメータ "url" が指定されていません');
}
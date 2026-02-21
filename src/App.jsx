import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, Image as ImageIcon, Sparkles, Twitter } from 'lucide-react';

// === カードのレイアウト定義 (キャンバスサイズ 1200 x 675) ===
const Y_OFFSET = 30;
const LAYOUT = {
  title: { x: 40, y: 20 + Y_OFFSET, w: 340, h: 50 },
  name: { x: 40, y: 90 + Y_OFFSET, w: 340, h: 80 },
  oshi1: { x: 40, y: 180 + Y_OFFSET, w: 340, h: 80 },
  oshi2_1: { x: 40, y: 270 + Y_OFFSET, w: 165, h: 100 },
  oshi2_2: { x: 215, y: 270 + Y_OFFSET, w: 165, h: 100 },
  hobby: { x: 40, y: 380 + Y_OFFSET, w: 340, h: 120 },
  love: { x: 820, y: 20 + Y_OFFSET, w: 340, h: 80 },
  song: { x: 820, y: 110 + Y_OFFSET, w: 340, h: 100 },
  collab: { x: 820, y: 220 + Y_OFFSET, w: 165, h: 80 },
  member: { x: 995, y: 220 + Y_OFFSET, w: 165, h: 80 },
  history: { x: 820, y: 310 + Y_OFFSET, w: 165, h: 80 },
  age: { x: 995, y: 310 + Y_OFFSET, w: 165, h: 80 },
  free: { x: 820, y: 400 + Y_OFFSET, w: 340, h: 120 },
};

const INITIAL_ITEMS = {
  title: { label: '', value: '自己紹介カード', isTitle: true },
  name: { label: 'お名前', value: '' },
  oshi1: { label: '最推し', value: '' },
  oshi2_1: { label: '推し', value: '' },
  oshi2_2: { label: '他Vの推し', value: '' },
  hobby: { label: '趣味や好きなゲーム', value: '' },
  love: { label: '推しの好きなところ', value: '' },
  song: { label: '推し＆ホロで好きな曲', value: '' },
  collab: { label: '好きなコラボ', value: '' },
  member: { label: 'メンシ加入者', value: '' },
  history: { label: '推し歴', value: '' },
  age: { label: '年齢', value: '' },
  free: { label: 'フリースペース', value: '' },
};

export default function App() {
  const [bgImage, setBgImage] = useState(null);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const canvasRef = useRef(null);

  const updateItem = (id, field, value) => {
    setItems(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setBgImage(img);
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 1200;
    const height = 675;
    canvas.width = width;
    canvas.height = height;

    if (bgImage) {
      const imgRatio = bgImage.width / bgImage.height;
      const canvasRatio = width / height;
      let drawW, drawH, drawX, drawY;
      if (imgRatio > canvasRatio) {
        drawH = height;
        drawW = bgImage.width * (height / bgImage.height);
        drawX = (width - drawW) / 2;
        drawY = 0;
      } else {
        drawW = width;
        drawH = bgImage.height * (width / bgImage.width);
        drawX = 0;
        drawY = (height - drawH) / 2;
      }
      ctx.drawImage(bgImage, drawX, drawY, drawW, drawH);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#a18cd1');
      gradient.addColorStop(1, '#fbc2eb');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    Object.entries(items).forEach(([id, item]) => {
      const layout = LAYOUT[id];
      if (!layout) return;
      const { x, y, w, h } = layout;
      ctx.save();
      const radius = 6;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.clip();

      if (item.isTitle) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.value, x + w / 2, y + h / 2 + 2);
      } else {
        const headerH = 26;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(x, y, w, headerH);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.fillRect(x, y + headerH, w, h - headerH);
        ctx.fillStyle = '#ffffff';
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, x + 10, y + headerH / 2 + 1);
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 16px sans-serif';
        ctx.textBaseline = 'top';
        const textX = x + 12;
        const textY = y + headerH + 10;
        const maxW = w - 24;
        const lineHeight = 24;
        const lines = item.value.split('\n');
        let currentY = textY;
        for (const line of lines) {
          let currentLine = '';
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const testLine = currentLine + char;
            if (ctx.measureText(testLine).width > maxW && i > 0) {
              ctx.fillText(currentLine, textX, currentY);
              currentLine = char;
              currentY += lineHeight;
            } else {
              currentLine = testLine;
            }
          }
          ctx.fillText(currentLine, textX, currentY);
          currentY += lineHeight;
        }
      }
      ctx.restore();
    });
  }, [bgImage, items]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'my-profile-card.png';
    link.href = dataUrl;
    link.click();
  };

  // --- X(Twitter)でシェアする関数 ---
  const shareToX = () => {
    const text = encodeURIComponent('自分だけの自己紹介カードを作成しました！ #自己紹介カードメーカー');
    // Vercelで公開されたURLを自動取得してシェアします
    const url = encodeURIComponent(window.location.href); 
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const renderField = (id, rows = 2) => {
    const item = items[id];
    return (
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <input 
          value={item.label}
          onChange={(e) => updateItem(id, 'label', e.target.value)}
          className="text-xs font-bold text-gray-400 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-400 w-full mb-1 outline-none pb-1"
          placeholder="項目名"
        />
        <textarea 
          value={item.value}
          onChange={(e) => updateItem(id, 'value', e.target.value)}
          className="w-full text-sm font-medium text-gray-800 bg-transparent outline-none resize-none leading-relaxed"
          rows={rows}
          placeholder="内容を入力"
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 font-sans overflow-hidden">
      {/* 左側: プレビューエリア */}
      <div className="lg:w-7/12 p-4 lg:p-8 flex flex-col items-center justify-center bg-gray-900 relative h-[45vh] lg:h-full overflow-hidden">
        <div className="w-full max-w-4xl relative aspect-video shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/20">
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full object-contain" />
        </div>
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <button onClick={downloadImage} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95">
            <Download size={20} /> 画像を保存
          </button>
          <button onClick={shareToX} className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-full font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95">
            <Twitter size={20} /> Xでシェア
          </button>
        </div>
      </div>

      {/* 右側: 入力フォームエリア */}
      <div className="lg:w-5/12 bg-gray-50 h-[55vh] lg:h-full overflow-y-auto border-l border-gray-200 shadow-xl pb-20">
        <div className="bg-white px-6 py-4 border-b border-gray-200 sticky top-0 z-10 shadow-sm flex items-center gap-2">
          <Sparkles className="text-yellow-500" size={24} />
          <h1 className="text-xl font-bold text-gray-800">自己紹介カードメーカー</h1>
        </div>
        <div className="p-6 space-y-8">
          <section>
            <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2 text-[11px]">
              <ImageIcon size={14} /> 背景画像
            </h2>
            <label className="block w-full cursor-pointer bg-white border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors rounded-xl p-4 text-center">
              <Upload className="mx-auto text-gray-400 mb-1" size={20} />
              <span className="text-sm font-medium text-blue-600">画像をアップロード</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider text-[11px]">カードタイトル</h2>
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-100">
              <input value={items.title.value} onChange={(e) => updateItem('title', 'value', e.target.value)} className="w-full text-lg font-bold text-gray-800 bg-transparent outline-none" placeholder="タイトルを入力" />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider text-[11px]">プロフィール詳細</h2>
            <div className="grid grid-cols-1 gap-3">
              {renderField('name')}
              {renderField('oshi1')}
              <div className="grid grid-cols-2 gap-3">
                {renderField('oshi2_1', 3)}
                {renderField('oshi2_2', 3)}
              </div>
              {renderField('hobby', 3)}
              {renderField('love', 3)}
              {renderField('song', 3)}
              <div className="grid grid-cols-2 gap-3">
                {renderField('collab')}
                {renderField('member')}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {renderField('history')}
                {renderField('age')}
              </div>
              {renderField('free', 4)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
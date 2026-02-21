import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, Image as ImageIcon, Sparkles, Twitter, Type, Palette } from 'lucide-react';

// === Google Fonts の読み込み (丸文字系フォント) ===
const FontStyle = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap');
    .font-soft { font-family: 'Zen Maru Gothic', sans-serif; }
  `}} />
);

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
  title: { label: '', value: '自己紹介カード', isTitle: true, fontSize: 24, color: '#111827' },
  name: { label: 'お名前', value: '', fontSize: 20, color: '#1f2937' },
  oshi1: { label: '最推し', value: '', fontSize: 20, color: '#1f2937' },
  oshi2_1: { label: '推し', value: '', fontSize: 16, color: '#1f2937' },
  oshi2_2: { label: '他Vの推し', value: '', fontSize: 16, color: '#1f2937' },
  hobby: { label: '趣味や好きなゲーム', value: '', fontSize: 16, color: '#1f2937' },
  love: { label: '推しの好きなところ', value: '', fontSize: 16, color: '#1f2937' },
  song: { label: '推し＆ホロで好きな曲', value: '', fontSize: 16, color: '#1f2937' },
  collab: { label: '好きなコラボ', value: '', fontSize: 16, color: '#1f2937' },
  member: { label: 'メンシ加入者', value: '', fontSize: 16, color: '#1f2937' },
  history: { label: '推し歴', value: '', fontSize: 16, color: '#1f2937' },
  age: { label: '年齢', value: '', fontSize: 16, color: '#1f2937' },
  free: { label: 'フリースペース', value: '', fontSize: 16, color: '#1f2937' },
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
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = item.color; // 指定された文字色
        ctx.font = `bold ${item.fontSize}px 'Zen Maru Gothic', sans-serif`;
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
        ctx.font = `500 13px 'Zen Maru Gothic', sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, x + 10, y + headerH / 2 + 1);

        ctx.fillStyle = item.color; // 指定された文字色
        ctx.font = `bold ${item.fontSize}px 'Zen Maru Gothic', sans-serif`;
        ctx.textBaseline = 'top';
        const textX = x + 12;
        const textY = y + headerH + 8;
        const maxW = w - 24;
        const lineHeight = item.fontSize * 1.4;
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

  useEffect(() => {
    document.fonts.ready.then(() => drawCanvas());
  }, [drawCanvas]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'my-profile-card.png';
    link.href = dataUrl;
    link.click();
  };

  const shareToX = () => {
    const text = encodeURIComponent('自分だけの自己紹介カードを作成しました！ #自己紹介カードメーカー');
    const url = encodeURIComponent(window.location.href); 
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const renderField = (id, rows = 2) => {
    const item = items[id];
    return (
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-pink-100 transition-all font-soft">
        <div className="flex justify-between items-center mb-1.5 border-b border-gray-100 pb-1.5">
          <input 
            value={item.label}
            onChange={(e) => updateItem(id, 'label', e.target.value)}
            className="text-[11px] font-bold text-gray-400 bg-transparent outline-none w-1/3"
            placeholder="項目名"
          />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Type size={12} className="text-gray-300" />
              <input 
                type="range" min="10" max="40" value={item.fontSize}
                onChange={(e) => updateItem(id, 'fontSize', parseInt(e.target.value))}
                className="w-12 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
            </div>
            <div className="flex items-center gap-1 border-l pl-2 border-gray-100">
              <Palette size={12} className="text-gray-300" />
              <input 
                type="color" value={item.color}
                onChange={(e) => updateItem(id, 'color', e.target.value)}
                className="w-5 h-5 border-none bg-transparent cursor-pointer p-0"
              />
            </div>
          </div>
        </div>
        <textarea 
          value={item.value}
          onChange={(e) => updateItem(id, 'value', e.target.value)}
          className="w-full text-sm font-medium text-gray-800 bg-transparent outline-none resize-none leading-relaxed font-soft"
          rows={rows}
          placeholder="内容を入力"
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-pink-50/30 font-soft overflow-hidden">
      <FontStyle />
      
      <div className="lg:w-7/12 p-4 lg:p-8 flex flex-col items-center justify-center bg-gray-800 relative h-[45vh] lg:h-full overflow-hidden">
        <div className="w-full max-w-4xl relative aspect-video shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/20">
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full object-contain" />
        </div>
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <button onClick={downloadImage} className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95">
            <Download size={20} /> 画像を保存
          </button>
          <button onClick={shareToX} className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-full font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95">
            <Twitter size={20} /> Xでシェア
          </button>
        </div>
      </div>

      <div className="lg:w-5/12 bg-white/80 backdrop-blur-sm h-[55vh] lg:h-full overflow-y-auto border-l border-pink-100 shadow-xl pb-20">
        <div className="bg-white/90 px-6 py-4 border-b border-pink-100 sticky top-0 z-10 shadow-sm flex items-center gap-2">
          <Sparkles className="text-pink-400" size={24} />
          <h1 className="text-xl font-bold text-gray-800">自己紹介カードメーカー</h1>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <h2 className="text-[11px] font-bold text-pink-400 mb-3 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon size={14} /> 背景画像
            </h2>
            <label className="block w-full cursor-pointer bg-white border-2 border-dashed border-pink-100 hover:border-pink-300 hover:bg-pink-50 transition-colors rounded-xl p-4 text-center">
              <Upload className="mx-auto text-pink-200 mb-1" size={20} />
              <span className="text-sm font-medium text-pink-400">画像をアップロード</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </section>

          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[11px] font-bold text-pink-400 uppercase tracking-widest">カードタイトル</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Type size={12} className="text-gray-300" />
                  <input 
                    type="range" min="16" max="60" value={items.title.fontSize}
                    onChange={(e) => updateItem('title', 'fontSize', parseInt(e.target.value))}
                    className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-400"
                  />
                </div>
                <div className="flex items-center gap-1 border-l pl-2 border-gray-100">
                  <Palette size={12} className="text-gray-300" />
                  <input 
                    type="color" value={items.title.color}
                    onChange={(e) => updateItem('title', 'color', e.target.value)}
                    className="w-5 h-5 border-none bg-transparent cursor-pointer p-0"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-pink-100 shadow-sm focus-within:ring-2 focus-within:ring-pink-100">
              <input value={items.title.value} onChange={(e) => updateItem('title', 'value', e.target.value)} className="w-full text-lg font-bold text-gray-800 bg-transparent outline-none font-soft" placeholder="タイトルを入力" />
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-bold text-pink-400 mb-3 uppercase tracking-widest">プロフィール詳細</h2>
            <div className="grid grid-cols-1 gap-4">
              {renderField('name')}
              {renderField('oshi1')}
              <div className="grid grid-cols-2 gap-4">
                {renderField('oshi2_1', 3)}
                {renderField('oshi2_2', 3)}
              </div>
              {renderField('hobby', 3)}
              {renderField('love', 3)}
              {renderField('song', 3)}
              <div className="grid grid-cols-2 gap-4">
                {renderField('collab')}
                {renderField('member')}
              </div>
              <div className="grid grid-cols-2 gap-4">
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
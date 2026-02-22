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
const Y_OFFSET = 45; 
const LAYOUT = {
  title: { x: 40, y: 10 + Y_OFFSET, w: 340, h: 60 },
  name: { x: 40, y: 90 + Y_OFFSET, w: 340, h: 95 },
  oshi1: { x: 40, y: 205 + Y_OFFSET, w: 340, h: 95 },
  oshi2_1: { x: 40, y: 320 + Y_OFFSET, w: 165, h: 110 },
  oshi2_2: { x: 215, y: 320 + Y_OFFSET, w: 165, h: 110 },
  hobby: { x: 40, y: 450 + Y_OFFSET, w: 340, h: 140 }, 
  love: { x: 820, y: 10 + Y_OFFSET, w: 340, h: 95 },
  song: { x: 820, y: 125 + Y_OFFSET, w: 340, h: 120 },
  collab: { x: 820, y: 265 + Y_OFFSET, w: 165, h: 95 },
  member: { x: 995, y: 265 + Y_OFFSET, w: 165, h: 95 },
  history: { x: 820, y: 380 + Y_OFFSET, w: 165, h: 95 },
  age: { x: 995, y: 380 + Y_OFFSET, w: 165, h: 95 },
  free: { x: 820, y: 495 + Y_OFFSET, w: 340, h: 95 }, 
};

const INITIAL_ITEMS = {
  title: { label: '', value: '自己紹介カード', isTitle: true, fontSize: 26, color: '#111827' },
  name: { label: 'お名前', value: '', fontSize: 22, color: '#1f2937' },
  oshi1: { label: '最推し', value: '', fontSize: 22, color: '#1f2937' },
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
  // ★背景の調整用ステートを追加
  const [bgSettings, setBgSettings] = useState({ zoom: 100, offsetX: 0, offsetY: 0 }); 
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
        img.onload = () => {
          setBgImage(img);
          // 新しい画像を読み込んだら設定をリセット
          setBgSettings({ zoom: 100, offsetX: 0, offsetY: 0 });
        };
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
      let baseW, baseH;
      
      // 画像の基準サイズを計算
      if (imgRatio > canvasRatio) {
        baseH = height;
        baseW = bgImage.width * (height / bgImage.height);
      } else {
        baseW = width;
        baseH = bgImage.height * (width / bgImage.width);
      }

      // ズームと移動(オフセット)を適用して描画
      const scale = bgSettings.zoom / 100;
      const drawW = baseW * scale;
      const drawH = baseH * scale;
      // 中央を基準に拡大縮小し、さらにオフセットを加える
      const drawX = (width - drawW) / 2 + bgSettings.offsetX;
      const drawY = (height - drawH) / 2 + bgSettings.offsetY;

      ctx.drawImage(bgImage, drawX, drawY, drawW, drawH);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#fce4ec');
      gradient.addColorStop(1, '#f8bbd0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    Object.entries(items).forEach(([id, item]) => {
      const layout = LAYOUT[id];
      if (!layout) return;
      const { x, y, w, h } = layout;
      ctx.save();
      const radius = 10; 
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
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = item.color;
        ctx.font = `bold ${item.fontSize}px 'Zen Maru Gothic', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.value, x + w / 2, y + h / 2 + 2);
      } else {
        const headerH = 28;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(x, y, w, headerH);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(x, y + headerH, w, h - headerH);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `700 13px 'Zen Maru Gothic', sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, x + 12, y + headerH / 2 + 1);

        ctx.fillStyle = item.color;
        ctx.font = `bold ${item.fontSize}px 'Zen Maru Gothic', sans-serif`;
        ctx.textBaseline = 'top';
        const textX = x + 12;
        const textY = y + headerH + 10;
        const maxW = w - 24;
        const lineHeight = item.fontSize * 1.35;
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
  }, [bgImage, bgSettings, items]); // bgSettingsを依存配列に追加

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

  const renderField = (id, rows = 3) => {
    const item = items[id];
    return (
      <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm focus-within:ring-2 focus-within:ring-pink-100 transition-all font-soft">
        <div className="flex justify-between items-center mb-1.5 border-b border-gray-50 pb-1.5">
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
                className="w-12 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-300"
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
    <div className="flex flex-col lg:flex-row h-screen bg-pink-50 font-soft overflow-hidden">
      <FontStyle />
      
      {/* プレビューエリア */}
      <div className="lg:w-7/12 p-4 lg:p-8 flex flex-col items-center justify-center bg-slate-800 relative h-[45vh] lg:h-full overflow-hidden">
        <div className="w-full max-w-4xl relative aspect-video shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden ring-1 ring-white/10">
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full object-contain" />
        </div>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button onClick={downloadImage} className="px-8 py-3.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95">
            <Download size={20} /> 画像を保存
          </button>
          <button onClick={shareToX} className="px-8 py-3.5 bg-slate-900 hover:bg-black text-white rounded-full font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95">
            <Twitter size={20} /> Xでシェア
          </button>
        </div>
      </div>

      {/* 入力フォームエリア */}
      <div className="lg:w-5/12 bg-white/95 backdrop-blur-md h-[55vh] lg:h-full overflow-y-auto border-l border-pink-100 shadow-2xl pb-24">
        <div className="bg-white/90 px-6 py-5 border-b border-pink-50 sticky top-0 z-10 shadow-sm flex items-center gap-2">
          <Sparkles className="text-pink-400" size={26} />
          <h1 className="text-xl font-black text-slate-800 tracking-tight">自己紹介カードメーカー</h1>
        </div>

        <div className="p-6 space-y-10">
          {/* 背景画像セクション */}
          <section>
            <h2 className="text-[12px] font-black text-pink-400 mb-3 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon size={14} /> 1. 背景画像をえらぶ
            </h2>
            <label className="block w-full cursor-pointer bg-pink-50/50 border-2 border-dashed border-pink-200 hover:border-pink-400 hover:bg-pink-50 transition-all rounded-2xl p-6 text-center">
              <Upload className="mx-auto text-pink-300 mb-2" size={24} />
              <span className="text-sm font-bold text-pink-500">お気に入りの画像をアップ</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>

            {/* ★画像がアップロードされたら調整スライダーを表示 */}
            {bgImage && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-pink-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-gray-400 w-16">ズーム</span>
                  <input type="range" min="50" max="250" value={bgSettings.zoom} onChange={(e) => setBgSettings({...bgSettings, zoom: parseInt(e.target.value)})} className="flex-1 accent-pink-400" />
                  <span className="text-[10px] text-gray-400 w-8 text-right">{bgSettings.zoom}%</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-gray-400 w-16">ヨコ移動</span>
                  <input type="range" min="-600" max="600" value={bgSettings.offsetX} onChange={(e) => setBgSettings({...bgSettings, offsetX: parseInt(e.target.value)})} className="flex-1 accent-pink-400" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-gray-400 w-16">タテ移動</span>
                  <input type="range" min="-600" max="600" value={bgSettings.offsetY} onChange={(e) => setBgSettings({...bgSettings, offsetY: parseInt(e.target.value)})} className="flex-1 accent-pink-400" />
                </div>
              </div>
            )}
          </section>

          {/* カードタイトルセクション */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[12px] font-black text-pink-400 uppercase tracking-widest">2. タイトルをきめる</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Type size={12} className="text-gray-300" />
                  <input 
                    type="range" min="16" max="60" value={items.title.fontSize}
                    onChange={(e) => updateItem('title', 'fontSize', parseInt(e.target.value))}
                    className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-300"
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
            <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm focus-within:ring-2 focus-within:ring-pink-200 transition-all">
              <input value={items.title.value} onChange={(e) => updateItem('title', 'value', e.target.value)} className="w-full text-xl font-bold text-slate-800 bg-transparent outline-none font-soft" placeholder="タイトル（例：自己紹介カード）" />
            </div>
          </section>

          {/* プロフィール詳細セクション */}
          <section>
            <h2 className="text-[12px] font-black text-pink-400 mb-4 uppercase tracking-widest">3. プロフィールをかく</h2>
            <div className="grid grid-cols-1 gap-5">
              {renderField('name', 2)}
              {renderField('oshi1', 2)}
              <div className="grid grid-cols-2 gap-4">
                {renderField('oshi2_1', 3)}
                {renderField('oshi2_2', 3)}
              </div>
              {renderField('hobby', 4)}
              {renderField('love', 3)}
              {renderField('song', 3)}
              <div className="grid grid-cols-2 gap-4">
                {renderField('collab', 2)}
                {renderField('member', 2)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {renderField('history', 2)}
                {renderField('age', 2)}
              </div>
              {renderField('free', 4)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
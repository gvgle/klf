import React, { useState } from 'react';
import { Settings, Play, Trophy, ShoppingCart, LogOut } from 'lucide-react';
import GameCanvas from './GameCanvas';

type Screen = 'menu' | 'game' | 'settings' | 'achievements' | 'shop';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [coins, setCoins] = useState(0);
  const [hasUltimate, setHasUltimate] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu': return <MainMenu onNavigate={setCurrentScreen} />;
      case 'game': return <GameScreen onNavigate={setCurrentScreen} hasUltimate={hasUltimate} />;
      case 'settings': return <SettingsScreen onNavigate={setCurrentScreen} coins={coins} setCoins={setCoins} redeemed={redeemed} setRedeemed={setRedeemed} />;
      case 'achievements': return <AchievementsScreen onNavigate={setCurrentScreen} />;
      case 'shop': return <ShopScreen onNavigate={setCurrentScreen} coins={coins} setCoins={setCoins} hasUltimate={hasUltimate} setHasUltimate={setHasUltimate} />;
      default: return <MainMenu onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-black text-white font-sans">
      {renderScreen()}
    </div>
  );
}

function MainMenu({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url("https://raw.githubusercontent.com/gvgle/111/main/unnamedddddddddddddddd.webp")' }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <div className="relative z-10 flex flex-col items-center gap-6 p-8 bg-black/60 rounded-3xl border-4 border-green-800/50 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-green-700 filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-8 tracking-wider text-center">
          伟大的柯立帆<br/><span className="text-2xl md:text-3xl text-green-400">Web Edition</span>
        </h1>

        <div className="flex flex-col gap-4 w-64">
          <MenuButton icon={<Play />} text="开始游戏" onClick={() => onNavigate('game')} primary />
          <MenuButton icon={<ShoppingCart />} text="商店" onClick={() => onNavigate('shop')} />
          <MenuButton icon={<Trophy />} text="成就" onClick={() => onNavigate('achievements')} />
          <MenuButton icon={<Settings />} text="设置" onClick={() => onNavigate('settings')} />
          <MenuButton icon={<LogOut />} text="退出" onClick={() => alert('网页版无法直接退出，请关闭标签页')} variant="danger" />
        </div>
      </div>
    </div>
  );
}

function MenuButton({ icon, text, onClick, primary, variant = 'default' }: { icon: React.ReactNode, text: string, onClick: () => void, primary?: boolean, variant?: 'default' | 'danger' }) {
  const baseClasses = "flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg border-b-4";

  let colorClasses = "bg-stone-700 hover:bg-stone-600 text-stone-100 border-stone-900";
  if (primary) {
    colorClasses = "bg-green-600 hover:bg-green-500 text-white border-green-800 shadow-green-900/50";
  } else if (variant === 'danger') {
    colorClasses = "bg-red-700 hover:bg-red-600 text-white border-red-900 shadow-red-900/50";
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${colorClasses}`}>
      {icon}
      <span>{text}</span>
    </button>
  );
}

function GameScreen({ onNavigate, hasUltimate }: { onNavigate: (screen: Screen) => void, hasUltimate: boolean }) {
  return <GameCanvas onNavigate={onNavigate} hasUltimate={hasUltimate} />;
}

function SettingsScreen({ onNavigate, coins, setCoins, redeemed, setRedeemed }: { onNavigate: (screen: Screen) => void, coins: number, setCoins: React.Dispatch<React.SetStateAction<number>>, redeemed: boolean, setRedeemed: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [code, setCode] = useState('');

  const handleRedeem = () => {
    if (code === '54188' && !redeemed) {
      setCoins(c => c + 1000);
      setRedeemed(true);
      alert('兑换成功！获得 1000 金币！');
    } else if (code === '54188' && redeemed) {
      alert('该兑换码已使用！');
    } else {
      alert('无效的兑换码！');
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 gap-6">
      <h2 className="text-4xl font-bold text-stone-300 mb-4">设置</h2>

      <div className="bg-stone-800 p-8 rounded-2xl border-2 border-stone-700 flex flex-col items-center gap-4">
        <h3 className="text-2xl text-amber-400 font-bold">兑换码</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="输入兑换码"
            className="px-4 py-2 rounded-lg bg-stone-900 border border-stone-600 text-white outline-none focus:border-green-500"
          />
          <button onClick={handleRedeem} className="px-4 py-2 bg-green-600 rounded-lg font-bold hover:bg-green-500">兑换</button>
        </div>
        <p className="text-stone-400 text-sm">当前金币: {coins}</p>
      </div>

      <button onClick={() => onNavigate('menu')} className="px-6 py-3 bg-stone-700 rounded-xl font-bold hover:bg-stone-600 border-b-4 border-stone-900 active:translate-y-1 active:border-b-0 mt-8">返回主菜单</button>
    </div>
  );
}

function AchievementsScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-amber-950">
      <h2 className="text-4xl font-bold text-amber-400 mb-8">成就</h2>
      <button onClick={() => onNavigate('menu')} className="px-6 py-3 bg-stone-700 rounded-xl font-bold hover:bg-stone-600 border-b-4 border-stone-900 active:translate-y-1 active:border-b-0">返回主菜单</button>
    </div>
  );
}

function ShopScreen({ onNavigate, coins, setCoins, hasUltimate, setHasUltimate }: { onNavigate: (screen: Screen) => void, coins: number, setCoins: React.Dispatch<React.SetStateAction<number>>, hasUltimate: boolean, setHasUltimate: React.Dispatch<React.SetStateAction<boolean>> }) {
  const imgUrl = "https://raw.githubusercontent.com/gvgle/-/main/100000000000ed.jpg";

  const handleBuy = () => {
    if (hasUltimate) {
      alert('你已经拥有该物品了！');
      return;
    }
    if (coins >= 1000) {
      setCoins(c => c - 1000);
      setHasUltimate(true);
      alert('购买成功！你现在可以在战斗中使用它了（需要1000阳光）。');
    } else {
      alert('金币不足！');
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-purple-950 gap-8">
      <div className="absolute top-8 right-8 bg-amber-500 text-black px-6 py-2 rounded-full font-black text-xl shadow-[0_0_15px_rgba(245,158,11,0.5)]">
        金币: {coins}
      </div>

      <h2 className="text-5xl font-black text-purple-300 drop-shadow-lg">疯狂戴夫的黑市</h2>

      <div className="bg-purple-900/50 p-6 rounded-3xl border-4 border-purple-800 flex flex-col items-center gap-4 max-w-sm">
        <img src={imgUrl} alt="Ultimate" className="w-48 h-48 object-cover rounded-2xl shadow-2xl border-4 border-red-500" />
        <h3 className="text-3xl font-bold text-red-400">毁灭神</h3>
        <p className="text-purple-200 text-center">战斗中消耗 1000 阳光召唤。<br/>播放专属动画并秒杀全屏僵尸！</p>

        <button
          onClick={handleBuy}
          disabled={hasUltimate}
          className={`mt-4 px-8 py-3 rounded-xl font-bold text-xl border-b-4 active:translate-y-1 active:border-b-0 transition-all ${
            hasUltimate
              ? 'bg-stone-600 border-stone-800 text-stone-400 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-400 border-amber-700 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]'
          }`}
        >
          {hasUltimate ? '已拥有' : '1000 金币购买'}
        </button>
      </div>

      <button onClick={() => onNavigate('menu')} className="px-8 py-4 bg-stone-700 rounded-xl font-bold text-xl hover:bg-stone-600 border-b-4 border-stone-900 active:translate-y-1 active:border-b-0 mt-4">返回主菜单</button>
    </div>
  );
}

import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('子ども向け主要導線の表現', () => {
  it('初回登録で名前だけでも始められることを伝える', () => {
    const source = fs.readFileSync(path.resolve('src/components/RegistrationScreen.tsx'), 'utf8');
    expect(source).toContain('名前だけ入力して出発して大丈夫');
    expect(source).toContain('バトルで一緒に戦う相棒');
    expect(source).toContain('学習で育てるペットのタマゴ');
  });

  it('ホームの最初のおすすめが学習を優先する', () => {
    const source = fs.readFileSync(path.resolve('src/components/HomeScreen.tsx'), 'utf8');
    expect(source).toContain("player.totalAnswered === 0 ? '最初の問題に挑戦しよう！'");
    expect(source).toContain("onSelectTab?.('shop')");
    expect(source).toContain("label: 'ショップ', en: 'SHOP'");
  });
});

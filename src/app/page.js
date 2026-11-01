import { LangProvider } from '@/lib/i18n';
import SkipLink from '@/components/SkipLink';
import Header from '@/components/Header';
import Thread from '@/components/Thread';
import Scene0 from '@/components/scenes/Scene0';
import Scene1 from '@/components/scenes/Scene1';
import Scene2 from '@/components/scenes/Scene2';
import Scene3 from '@/components/scenes/Scene3';

export default function Home() {
  return (
    <LangProvider>
      <SkipLink />
      <Header />
      <Thread />
      <main id="contenido">
        <Scene0 />
        <Scene1 />
        <Scene2 />
        <Scene3 />
      </main>
    </LangProvider>
  );
}

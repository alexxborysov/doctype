import { m } from 'framer-motion';
import { NotesPool } from '../application/note/manager/view/pool';
import { Toolbar } from '../application/note/manager/view/toolbar';

export const Home = () => {
  return (
    <m.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.1,
        ease: 'easeIn',
      }}
      className="w-full relative"
    >
      <NotesPool />
      <Toolbar />
    </m.main>
  );
};

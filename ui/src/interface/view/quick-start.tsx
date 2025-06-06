import { Button, Kbd } from '@mantine/core';
import { RocketIcon } from '@radix-ui/react-icons';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { notesManagerModel } from '../application/note/manager/model';

export const QuickStart = observer(() => {
  const navigate = useNavigate();

  const handleGenerate = () => notesManagerModel.generateSample.run();
  const openAboutPage = () => {
    navigate('/about');
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col -mt-[10vh] gap-2">
      <h1
        className="flex items-center text-[31px] tracking-wider text-white gap-x-1 cursor-pointer "
        onClick={openAboutPage}
      >
        Litte.in
      </h1>

      <div className="flex space-x-2 items-center">
        <Button onClick={handleGenerate} size="sm" variant="outline" className="h-[35px] mr-1">
          Generate sample <RocketIcon className="ml-2" />
        </Button>
        <span className=" tracking-wide text-cyan-300/70">or create yours with</span>
        <div className="px-2 py-2 space-x-2 flex items-center justify-center ">
          <Kbd className="h-8 w-8">
            <p className="-mt-[4px] text-[20px]">⌥</p>
          </Kbd>
          <span className="text-cyan-300/70">+</span>
          <Kbd className="h-8 w-8 text-center">
            <p className="text-[15px]">N</p>
          </Kbd>
        </div>
      </div>
    </div>
  );
});

import { InfoCircledIcon, Pencil2Icon, DashboardIcon } from '@radix-ui/react-icons';
import { observer } from 'mobx-react-lite';
import { AppActionButton } from '~/interface/shared/view/buttons/action';
import { Icon } from '~/interface/shared/view/icon';
import { notesManagerModel } from '../application/note/manager/model';
import { SessionAction } from '../application/viewer/view';
import { useLocationArray } from '../kernel/router/use-location-array';
import { NavigationButton } from '../shared/view/buttons/navigation';

export const AppNavigation = observer(() => {
  const lastOpenedNote = notesManagerModel.lasOpenedNoteId;

  return (
    <header className="py-[0.9rem] flex flex-col min-h-screen min-w-full">
      <section className="space-y-2 flex flex-col grow">
        <NavigationButton
          pushTo="/"
          content={<DashboardIcon className="w-[1.11rem] h-[1.11rem] text-accent" />}
          ariaLabel="home"
        />

        {lastOpenedNote && (
          <NavigationButton
            pushTo={'/notes/' + lastOpenedNote}
            content={<Icon name="app" className="w-[1.11rem] h-[1.11rem] text-accent" />}
            ariaLabel="last-active-note"
          />
        )}

        <HomeSegment />
        <EditorSegment />
      </section>

      <section className="flex flex-col items-center justify-center space-y-2">
        <NavigationButton
          pushTo="/about"
          content={<InfoCircledIcon className="w-[1.25rem] h-[1.25rem] text-accent" />}
          ariaLabel="home"
        />

        <SessionAction />
      </section>
    </header>
  );
});

const HomeSegment = () => {
  const location = useLocationArray();
  const show = location[0] === '';

  const createNote = () => {
    notesManagerModel.create.run();
  };

  return (
    <section hidden={!show}>
      <AppActionButton
        debounce
        onClick={createNote}
        content={<Pencil2Icon className="w-[1.11rem] h-[1.11rem]  text-accent" />}
        ariaLabel="create-new-note"
      />
    </section>
  );
};

const EditorSegment = () => {
  const location = useLocationArray();
  const show = location[0] === 'notes';

  return (
    <section hidden={!show}>
      <AppActionButton
        onClick={() => null}
        content={<Icon name="share" className="w-[1.11rem] h-[1.11rem] text-accent" />}
        ariaLabel="share-note"
      />
    </section>
  );
};

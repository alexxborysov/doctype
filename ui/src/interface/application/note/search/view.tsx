import { Combobox, TextInput, useCombobox } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { twJoin } from 'tailwind-merge';
import { notesManagerModel } from '../manager/model';

export const Search = observer(() => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const notes = notesManagerModel.pool;

  const [searchValue, setSearchValue] = useState('');
  const searchParts = searchValue.toLowerCase().split(/[ \-._]+/);

  const searchResult = notes
    .filter((note) => {
      return searchParts.every((part) => note.name.toLowerCase().includes(part));
    })
    .slice(0, 7);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const openNote = (selectedNoteId: string) => {
    navigate('/notes/' + selectedNoteId);
  };

  useEffect(() => {
    combobox.selectFirstOption();
  }, [searchValue]);

  useEffect(() => {
    const toggleFocus = (event: KeyboardEvent) => {
      const triggered = event.altKey && event.code === 'KeyK';
      if (triggered && inputRef.current) {
        event.preventDefault();
        const focused = inputRef.current === document.activeElement;

        if (focused) {
          combobox.closeDropdown();
          inputRef.current.blur();
        } else {
          combobox.openDropdown();
          inputRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', toggleFocus);
    return () => {
      window.removeEventListener('keydown', toggleFocus);
    };
  }, []);

  return (
    <Combobox
      onOpen={() => {
        combobox.selectFirstOption();
      }}
      onOptionSubmit={openNote}
      store={combobox}
      position="top"
    >
      <Combobox.Target>
        <TextInput
          onChange={(event) => {
            setSearchValue(event.currentTarget.value);
            combobox.openDropdown();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
          value={searchValue}
          ref={inputRef}
          placeholder="Search.."
          aria-label="search-input"
          size="xs"
          classNames={{
            input: 'min-w-[210px]',
          }}
          rightSection={<Kbd dropdownOpened={combobox.dropdownOpened} />}
          rightSectionWidth={53}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {searchResult.length === 0 ? (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          ) : (
            searchResult.map((note) => (
              <Combobox.Option value={note.id} key={note.id}>
                {note.name}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
});

function Kbd({ dropdownOpened }: { dropdownOpened: boolean }) {
  return (
    <p
      className={twJoin(
        "flex items-center justify-center border-[1px] border-border rounded bg-background h-[18px] w-9 font-['JetBrainsMono'] font-black text-[11px] text-nowrap",
        dropdownOpened && 'opacity-65'
      )}
    >
      ⌥ K
    </p>
  );
}

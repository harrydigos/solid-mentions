import { For, Show } from 'solid-js';
import { useMyContext } from './context';

const dummyMentions = [
  { id: 1, name: 'John Doe', username: 'johndoe' },
  { id: 2, name: 'Jane Smith', username: 'janesmith' },
  { id: 3, name: 'Bob Johnson', username: 'bobjohnson' },
];

export function Autocomplete() {
  const { popover } = useMyContext();

  return (
    <Show when={popover.isOpen()}>
      <div
        style={{
          position: 'absolute',
          'background-color': 'white',
          'z-index': 10,
          width: '250px',
          top: `${popover.position().top}px`,
          left: `${popover.position().left}px`,
          color: 'black',
        }}
      >
        <ul>
          <For each={dummyMentions}>
            {(mention) => (
              <li>
                <div>{mention.name}</div>
                <div>@{mention.username}</div>
              </li>
            )}
          </For>
        </ul>
      </div>
    </Show>
  );
}

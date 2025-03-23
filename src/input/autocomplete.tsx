import { For, Show } from 'solid-js';
import { useMentionsContext } from './context';

const dummyMentions = [
  { id: 1, name: 'John Doe', username: 'johndoe' },
  { id: 2, name: 'Jane Smith', username: 'janesmith' },
  { id: 3, name: 'Bob Johnson', username: 'bobjohnson' },
];

export function Autocomplete() {
  const { state } = useMentionsContext();

  return (
    <Show when={state.dropdown.isOpen}>
      <div
        style={{
          position: 'absolute',
          'background-color': 'white',
          'z-index': 10,
          width: '250px',
          top: `${state.dropdown.position!.top}px`,
          left: `${state.dropdown.position!.left}px`,
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

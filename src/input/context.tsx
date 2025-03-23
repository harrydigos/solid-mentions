import { JSX, createContext, createSignal, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { MentionContext } from './types';

export const MentionsContext = createContext<MentionContext>();

export function MentionsProvider(props: { children: JSX.Element }) {
  let inputElement!: HTMLDivElement;
  const [inputValue, setInputValue] = createSignal('');
  // const [mentionItems, setMentionItems] = createSignal<MentionItem[]>([]);

  const [dropdownState, setDropdownState] = createStore<MentionContext['state']['dropdown']>({
    isOpen: false,
    position: null,
    // activeConfig: null as MentionOptions | null,
  });

  const context: MentionContext = {
    state: {
      input: {
        get element() {
          return inputElement;
        },
        get value() {
          return inputValue();
        },
      },

      search: {},

      dropdown: {
        get isOpen() {
          return dropdownState.isOpen;
        },
        get position() {
          return dropdownState.position;
        },
      },
    },

    dom: {
      setInputElement: (newInputElement: HTMLDivElement) => {
        inputElement = newInputElement;
      },
    },

    values: {
      getValue: () => inputValue(),
      setValue: (text: string) => {
        setInputValue(text);
        // Update the extracted mentions when text changes
        // setMentionItems(extractMentionsFromValue(text));
      },
      getMentionItems: () => {
        return [];
      },
    },

    handlers: {},

    actions: {
      openDropdown: (node, value, config) => {
        const rect = node.getBoundingClientRect();
        console.log('input', inputElement);
        const inputRect = inputElement.getBoundingClientRect();

        setDropdownState({
          isOpen: true,
          position: {
            top: rect.bottom - inputRect.top,
            left: rect.left - inputRect.left,
          },
          // activeConfig: config,
        });
      },
      closeDropdown: () => {
        setDropdownState({
          isOpen: false,
          position: null,
          // activeConfig: null,
        });
      },
    },
  };

  return <MentionsContext.Provider value={context}>{props.children}</MentionsContext.Provider>;
}

export function useMentionsContext() {
  const value = useContext(MentionsContext);

  if (!value) {
    throw new Error('Missing context Provider');
  }

  return value;
}

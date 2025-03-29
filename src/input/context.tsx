import { JSX, createContext, createSignal, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { MentionContext } from './types';

export const MentionsContext = createContext<MentionContext>();

function saveCaretPosition() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  return {
    startContainer: range.startContainer,
    startOffset: range.startOffset,
  };
}

function restoreCaretPosition(
  savedSelection: { startContainer: Node; startOffset: number } | null,
) {
  if (!savedSelection) return;

  const selection = window.getSelection();
  if (!selection) return;

  const newRange = document.createRange();
  newRange.setStart(
    savedSelection.startContainer,
    Math.min(savedSelection.startOffset, savedSelection.startContainer.textContent?.length || 0),
  );
  newRange.collapse(true);

  selection.removeAllRanges();
  selection.addRange(newRange);
}

export function MentionsProvider(props: { children: JSX.Element }) {
  let inputElement!: HTMLDivElement;
  const [inputValue, setInputValue] = createSignal('');
  // const [mentionItems, setMentionItems] = createSignal<MentionItem[]>([]);

  const [dropdownState, setDropdownState] = createStore<MentionContext['state']['dropdown']>({
    isOpen: false,
    position: null,
    // activeConfig: null as MentionOptions | null,
  });

  const openDropdown: MentionContext['actions']['openDropdown'] = (node) => {
    const rect = node.getBoundingClientRect();
    const inputRect = inputElement.getBoundingClientRect();

    setDropdownState({
      isOpen: true,
      position: {
        top: rect.bottom - inputRect.top,
        left: rect.left - inputRect.left,
      },
      // activeConfig: config,
    });
  };

  const closeDropdown = () => {
    setDropdownState({
      isOpen: false,
      position: null,
      // activeConfig: null,
    });
  };

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

    handlers: {
      onInput: (event) => {
        event.preventDefault();
        const text = inputElement.textContent || '';
        const savedSelection = saveCaretPosition();

        // Check if @ was just typed
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const currentPosition = range.startOffset;

          // Get the character before the cursor
          if (currentPosition > 0) {
            const textBeforeCursor = text.slice(0, currentPosition);
            const lastChar = textBeforeCursor.slice(-1);

            if (lastChar === '@') {
              openDropdown(range);
            }
          }
        }

        inputElement.textContent = text;
        restoreCaretPosition(savedSelection);
      },
      onBeforeInput: (event) => {
        // event.preventDefault();
      },
      onKeyDown: (event) => {
        if (!dropdownState.isOpen) {
          return;
        }

        if (event.key === 'Escape') {
          closeDropdown();
          // event.preventDefault();
        }
      },
    },

    actions: {
      openDropdown,
      closeDropdown,
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

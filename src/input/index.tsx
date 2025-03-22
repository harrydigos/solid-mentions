import { ComponentProps, For, Show, createSignal, useContext } from 'solid-js';
import { MyContext, Provider, useMyContext } from './context';
import { Autocomplete } from './autocomplete';

const list = ['adrien', 'anna', 'guillaume', 'vincent', 'victor'].map((v, i) => ({
  name: v,
  ref: `<@${v}|u${i + 1}>`,
}));

const config = [
  {
    query: /@([a-zA-Z0-9_-]+)?/,
    match: /<(@\w+)\|([^>]+)>/g,
    matchDisplay: '$1',
    customizeFragment: (fragment: HTMLSpanElement, final: boolean) => {
      fragment.className = final ? 'final' : 'pending';
    },
    onMention: (text: string) => {
      const search = text.substr(1); // remove '@'
      return list.filter((item) => !search || item.name.includes(search));
    },
  },
];

export type TMentionItem<T = object> = T & {
  name: string;
  ref: string;
};

export interface TMentionConfig<T = object> {
  query: RegExp;
  match: RegExp;
  matchDisplay: string;
  customizeFragment?: (fragment: HTMLSpanElement, final: boolean) => void;
  onMention: (
    text: string,
    callback?: (results: TMentionItem<T>[]) => void,
  ) => void | TMentionItem<T>[] | Promise<TMentionItem<T>[]>;
}

export interface TMentionContext {
  getTransformedValue: () => string;
  setValue: (text: string) => void;
  insertFragment: (ref: string, element?: HTMLElement) => void;
  activeSearch: string;
  inputElement: HTMLDivElement | null;
  setInputElement: (newInputElement: HTMLDivElement | null) => void;
  selectItem: (item: TMentionItem<any>) => void;
  setActiveItemIndex: (index: number) => void;
  opened: null | {
    config: TMentionConfig<any>;
    element: HTMLSpanElement;
    fixed: boolean;
    bottom: boolean;
    right: boolean;
    x: number;
    y: number;
  };
  index: number;
  loading: boolean;
  results: TMentionItem<any>[];
  closeAutocomplete: () => void;
  openAutocomplete: <T>(node: HTMLElement, value: string, config: TMentionConfig<T>) => void;
  // onBeforeChanges: (event: React.FormEvent<HTMLDivElement>) => void;
  // onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  // onChanges: (event: React.FormEvent<HTMLDivElement>) => void;
  getInitialHTML?: (value: string) => string;
  fixed: boolean;
  setPositionFixed: (fixed: boolean) => void;
}

export type MentionsInput2Props = Pick<ComponentProps<'div'>, 'class'>;

export function MentionsInput2(props: MentionsInput2Props) {
  return (
    <Provider>
      <MentionsInput2Content {...props} />
    </Provider>
  );
}

export function MentionsInput2Content(props: MentionsInput2Props) {
  let inputRef: HTMLDivElement | undefined;
  // const [content, setContent] = createSignal('');

  const { popover, actions } = useMyContext();

  const handleInput = (event) => {
    const text = event.target.innerHTML;
    // setContent(text);

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
          // Show popover at caret position
          const rect = range.getBoundingClientRect();
          const inputRect = inputRef!.getBoundingClientRect();

          actions.popover.setPosition({
            top: rect.bottom - inputRect.top,
            left: rect.left - inputRect.left,
          });

          actions.popover.setIsOpen(true);
        }
      }
    }
  };

  const handleKeyDown = (event) => {
    // Close popover on escape
    if (event.key === 'Escape' && popover.isOpen()) {
      actions.popover.setIsOpen(false);
      event.preventDefault();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        {...props}
        ref={inputRef}
        contentEditable={true}
        // onBeforeInput={(event) => {}}
        // onKeyDown={mergeOnKeyDown}
        // onInput={(e) => onChanges(e)}

        onInput={handleInput}
        onKeyDown={handleKeyDown}
        // innerHTML={content()}
      />

      <Autocomplete />
    </div>
  );
}

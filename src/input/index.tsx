import { ComponentProps } from 'solid-js';
import { MentionsProvider, useMentionsContext } from './context';
import { Autocomplete } from './autocomplete';

// const list = ['harry', 'john'].map((v, i) => ({
//   name: v,
//   ref: `<@${v}|u${i + 1}>`,
// }));

// const config = [
//   {
//     query: /@([a-zA-Z0-9_-]+)?/,
//     match: /<(@\w+)\|([^>]+)>/g,
//     matchDisplay: '$1',
//     customizeFragment: (fragment: HTMLSpanElement, final: boolean) => {
//       fragment.className = final ? 'final' : 'pending';
//     },
//     onMention: (text: string) => {
//       const search = text.substr(1); // remove '@'
//       return list.filter((item) => !search || item.name.includes(search));
//     },
//   },
// ];

export type MentionsInput2Props = Pick<ComponentProps<'div'>, 'class'>;

export function MentionsInput2(props: MentionsInput2Props) {
  return (
    <MentionsProvider>
      <MentionsInput2Content {...props} />
    </MentionsProvider>
  );
}

export function MentionsInput2Content(props: MentionsInput2Props) {
  const { actions, dom, state } = useMentionsContext();

  const handleInput = (event: any) => {
    const text = event.target.innerHTML;

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
          actions.openDropdown(range);
        }
      }
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Escape' && state.dropdown.isOpen) {
      actions.closeDropdown();
      event.preventDefault();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        {...props}
        ref={(el) => {
          dom.setInputElement(el);
        }}
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

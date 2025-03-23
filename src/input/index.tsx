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
  const { dom, state, handlers } = useMentionsContext();

  return (
    <div style={{ position: 'relative' }}>
      <div
        {...props}
        ref={(el) => {
          dom.setInputElement(el);
        }}
        contentEditable={true}
        // onBeforeInput={handlers.onBeforeInput}
        onInput={handlers.onInput}
        onKeyDown={handlers.onKeyDown}
      />

      <Autocomplete />
    </div>
  );
}
